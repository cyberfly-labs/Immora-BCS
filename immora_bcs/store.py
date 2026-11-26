"""SQLite record store: versioned JSON records per collection, users, audit trail.
Each write goes through rules.validate(); derived records (invoice balances, booking charges) are saved in the same transaction."""
import copy
import hashlib
import base64
import hmac
import json
import os
import re
import secrets
import sqlite3
import threading
from datetime import datetime

from . import rules as R

ID_RE = re.compile(r"^[A-Za-z0-9_.:-]{1,64}$")
_lock = threading.RLock()

SCHEMA = """
CREATE TABLE IF NOT EXISTS records (coll TEXT NOT NULL, id TEXT NOT NULL, data TEXT NOT NULL, version INTEGER NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0, seq INTEGER NOT NULL, PRIMARY KEY (coll, id));
CREATE TABLE IF NOT EXISTS counters (name TEXT PRIMARY KEY, value INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, hash TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1, memberId TEXT DEFAULT '', failed INTEGER NOT NULL DEFAULT 0, lockedUntil TEXT DEFAULT '', lang TEXT DEFAULT '');
CREATE TABLE IF NOT EXISTS audit (n INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT NOT NULL, username TEXT, action TEXT, coll TEXT, rid TEXT, summary TEXT);
"""


class StoreError(Exception):
    def __init__(self, msg, status=400, field=None, extra=None):
        super().__init__(msg)
        self.status, self.field, self.extra = status, field, extra or {}


def data_dir():
    d = os.environ.get("IMMORA_DATA_DIR")
    if not d:
        if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
            d = "/tmp/immora-bcs-data"
        else:
            d = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
    os.makedirs(d, exist_ok=True)
    return d


def db_path():
    return os.path.join(data_dir(), "immora-bcs.db")


def connect():
    c = sqlite3.connect(db_path(), timeout=30, isolation_level=None)
    c.row_factory = sqlite3.Row
    c.execute("PRAGMA journal_mode=WAL")
    c.execute("PRAGMA foreign_keys=ON")
    return c


def init():
    with connect() as c:
        c.executescript(SCHEMA)


# ---------------------------------------------------------------- passwords
def hash_password(pw, iterations=200_000, salt=None):
    salt = salt or secrets.token_bytes(16)
    dk = hashlib.pbkdf2_hmac("sha256", pw.encode(), salt, iterations, 32)
    return f"pbkdf2_sha256${iterations}${base64.b64encode(salt).decode()}${base64.b64encode(dk).decode()}"


def check_password(pw, stored):
    try:
        algo, it, salt, h = stored.split("$")
        dk = hashlib.pbkdf2_hmac("sha256", pw.encode(), base64.b64decode(salt), int(it), 32)
        return algo == "pbkdf2_sha256" and hmac.compare_digest(base64.b64encode(dk).decode(), h)
    except Exception:
        return False


def password_problem(pw):
    if len(pw or "") < 8:
        return "Use at least 8 characters"
    return None


# ---------------------------------------------------------------- records
def now_ts():
    return datetime.now().astimezone().isoformat(timespec="seconds")


def next_seq(c):
    c.execute("INSERT INTO counters(name, value) VALUES('seq', 1) ON CONFLICT(name) DO UPDATE SET value = value + 1")
    return c.execute("SELECT value FROM counters WHERE name='seq'").fetchone()[0]


def load(c):
    """({coll: [records]}, {(coll, id): version})"""
    db = {k: [] for k in R.COLLECTIONS}
    ver = {}
    for r in c.execute("SELECT coll, id, data, version FROM records WHERE deleted = 0 ORDER BY seq"):
        db.setdefault(r["coll"], []).append(json.loads(r["data"]))
        ver[(r["coll"], r["id"])] = r["version"]
    return db, ver


def has_data(c):
    return c.execute("SELECT COUNT(*) FROM records").fetchone()[0] > 0 or c.execute("SELECT COUNT(*) FROM users").fetchone()[0] > 0


def audit(c, user, action, coll="", rid="", summary=""):
    c.execute("INSERT INTO audit(ts, username, action, coll, rid, summary) VALUES(?,?,?,?,?,?)",
              (now_ts(), (user or {}).get("username", "system"), action, coll, rid, summary[:500]))


def describe(coll, rec):
    rec = rec or {}
    for f in ("number", "code", "legalName", "name", "subject", "title", "desc"):
        if rec.get(f):
            return str(rec[f])
    return rec.get("id", "")


def _write(c, coll, rec, deleted=False):
    seq = next_seq(c)
    row = c.execute("SELECT version FROM records WHERE coll=? AND id=?", (coll, rec["id"])).fetchone()
    v = (row["version"] + 1) if row else 1
    c.execute("INSERT INTO records(coll, id, data, version, deleted, seq) VALUES(?,?,?,?,?,?) "
              "ON CONFLICT(coll, id) DO UPDATE SET data=excluded.data, version=excluded.version, deleted=excluded.deleted, seq=excluded.seq",
              (coll, rec["id"], json.dumps(rec, ensure_ascii=False, sort_keys=True), v, 1 if deleted else 0, seq))
    return v


def _mem_put(db, coll, rec):
    lst = db.setdefault(coll, [])
    for i, r in enumerate(lst):
        if r.get("id") == rec["id"]:
            lst[i] = rec
            return
    lst.append(rec)


def _mem_del(db, coll, rid):
    db[coll] = [r for r in db.get(coll, []) if r.get("id") != rid]


def can_write(user, coll):
    return coll in R.WRITE.get(user.get("role"), set())


def apply_changes(c, user, changes, today):
    """Validate and save a list of {coll, id, op: put|delete, base, data}. All or nothing."""
    out = {}
    with _lock:
        c.execute("BEGIN IMMEDIATE")
        try:
            db, ver = load(c)
            for ch in changes or []:
                coll, op = ch.get("coll"), ch.get("op", "put")
                if coll not in R.COLLECTIONS:
                    raise StoreError(f"Unknown list: {coll}")
                if not can_write(user, coll):
                    raise StoreError("Your role cannot change this. Ask an administrator.", 403)
                rid = str(ch.get("id") or (ch.get("data") or {}).get("id") or "")
                if not ID_RE.match(rid):
                    raise StoreError("Invalid record id")
                old = next((r for r in db.get(coll, []) if r.get("id") == rid), None)
                base = ch.get("base")
                if base is not None and old is not None and int(base) and int(base) != ver.get((coll, rid)):
                    raise StoreError("Someone else changed this record a moment ago. The screen now shows the latest version.", 409,
                                     extra={"conflict": {"coll": coll, "id": rid, "record": dict(old, _v=ver.get((coll, rid)))}})
                if user.get("role") == R.MEMBER_ROLE and old is not None and not member_owns(user, coll, old):
                    raise StoreError("This record is not yours", 403)
                if op == "delete":
                    if old is None:
                        continue
                    ok = R.can_delete(coll, old)
                    if ok is not True:
                        raise StoreError(ok)
                    if user.get("role") == R.MEMBER_ROLE:
                        raise StoreError("Cancel the booking instead of deleting it", 403)
                    ver[(coll, rid)] = _write(c, coll, old, deleted=True)
                    _mem_del(db, coll, rid)
                    out[(coll, rid)] = dict(coll=coll, id=rid, deleted=True, version=ver[(coll, rid)], data=None)
                    audit(c, user, "delete", coll, rid, describe(coll, old))
                    # deleting a booking also drops its uninvoiced charge
                    if coll == "bookings":
                        for chg in [x for x in db.get("charges", []) if x.get("bookingId") == rid and not x.get("invoiceId")]:
                            ver[("charges", chg["id"])] = _write(c, "charges", chg, deleted=True); _mem_del(db, "charges", chg["id"])
                            out[("charges", chg["id"])] = dict(coll="charges", id=chg["id"], deleted=True, version=ver[("charges", chg["id"])], data=None)
                    continue
                rec = copy.deepcopy(ch.get("data") or {})
                rec.pop("_v", None)
                rec["id"] = rid
                try:
                    extras = R.validate(coll, rec, old, db, user, today)
                except R.RuleError as e:
                    raise StoreError(str(e), e.status, e.field)
                for coll2, rec2, op2 in [(coll, rec, "put")] + list(extras or []):
                    if op2 == "delete":
                        ver[(coll2, rec2["id"])] = _write(c, coll2, rec2, deleted=True); _mem_del(db, coll2, rec2["id"])
                        out[(coll2, rec2["id"])] = dict(coll=coll2, id=rec2["id"], deleted=True, version=ver[(coll2, rec2["id"])], data=None)
                        continue
                    old2 = next((r for r in db.get(coll2, []) if r.get("id") == rec2["id"]), None)
                    ver[(coll2, rec2["id"])] = _write(c, coll2, rec2)
                    _mem_put(db, coll2, rec2)
                    out[(coll2, rec2["id"])] = dict(coll=coll2, id=rec2["id"], deleted=False, version=ver[(coll2, rec2["id"])], data=rec2)
                    if coll2 == coll:
                        audit(c, user, "update" if old2 else "create", coll2, rec2["id"], describe(coll2, rec2) + _status_note(old2, rec2))
            c.execute("COMMIT")
        except Exception:
            c.execute("ROLLBACK")
            raise
    return list(out.values())


def _status_note(old, new):
    if old and old.get("status") != new.get("status") and new.get("status"):
        return f" · {old.get('status')} → {new.get('status')}"
    return ""


def put_many(c, user, items, today):
    """items: [(coll, record)] as one change list (validated)."""
    return apply_changes(c, user, [dict(coll=k, id=r["id"], op="put", data=r) for k, r in items], today)


def raw_put(c, coll, rec):
    """Seed/restore only: no validation."""
    _write(c, coll, rec)


def all_versions(c):
    return {(r["coll"], r["id"]): r["version"] for r in c.execute("SELECT coll, id, version FROM records WHERE deleted=0")}


# ---------------------------------------------------------------- member portal scoping
def member_owns(user, coll, rec):
    mid = user.get("memberId")
    if coll == "bookings":
        return rec.get("memberId") == mid
    if coll == "tickets":
        return rec.get("memberId") == mid
    if coll == "visitors":
        return rec.get("hostId") == mid
    return False


PUBLIC_CFG = ("id", "legalName", "tradeName", "address", "trn", "phone", "email", "currency", "vatRate", "taxLabel", "invoiceTitle",
              "country", "openFrom", "openTo", "licenceNo", "logo", "stamp", "bank", "paymentTermsDays", "vatName", "footer")


def member_view(db, ver, member_id):
    me = next((m for m in db.get("members", []) if m.get("id") == member_id), None) or {}
    comp = me.get("companyId") or "__none__"
    mine = lambda r: r.get("memberId") == member_id or (r.get("companyId") and r.get("companyId") == comp)
    out = {k: [] for k in R.COLLECTIONS}
    out["cfg"] = [{k: v for k, v in r.items() if k in PUBLIC_CFG} for r in db.get("cfg", []) if r.get("id") == "centre"]
    out["spaces"] = [{k: s.get(k) for k in ("id", "code", "name", "type", "floor", "capacity", "priceHour", "creditRate", "status", "amenities")}
                     for s in db.get("spaces", []) if s.get("type") in R.BOOKABLE]
    out["plans"] = [p for p in db.get("plans", []) if p.get("id") == me.get("planId")]
    out["members"] = [me] if me else []
    out["companies"] = [x for x in db.get("companies", []) if x.get("id") == comp]
    out["bookings"] = []
    for b in db.get("bookings", []):
        if b.get("status") == "cancelled" and b.get("memberId") != member_id:
            continue
        if b.get("memberId") == member_id:
            out["bookings"].append(b)
        else:
            out["bookings"].append({k: b.get(k) for k in ("id", "spaceId", "start", "end", "status")} | {"title": "Booked", "private": True})
    for k in ("invoices", "creditnotes", "receipts"):
        out[k] = [x for x in db.get(k, []) if mine(x) and x.get("status") != "draft"]
    out["tickets"] = [t for t in db.get("tickets", []) if t.get("memberId") == member_id]
    out["visitors"] = [v for v in db.get("visitors", []) if v.get("hostId") == member_id]
    out["mail"] = [m for m in db.get("mail", []) if mine(m)]
    out["calls"] = [m for m in db.get("calls", []) if mine(m)]
    for k, lst in out.items():
        out[k] = [dict(r, _v=ver.get((k, r.get("id")), 1)) for r in lst]
    return out
