"""JSON API for the browser app (server edition)."""
import json
import os
from datetime import datetime, timedelta

from flask import Blueprint, Response, jsonify, request, session

from . import VERSION, actions, rules as R, store as S

bp = Blueprint("api", __name__, url_prefix="/api")
MAX_FAILS, LOCK_MIN = 5, 5


def centre_now(c=None):
    tz = "Asia/Dubai"
    try:
        conn = c or S.connect()
        row = conn.execute("SELECT data FROM records WHERE coll='cfg' AND id='centre' AND deleted=0").fetchone()
        if row:
            tz = json.loads(row["data"]).get("tz") or tz
    except Exception:
        pass
    try:
        from zoneinfo import ZoneInfo
        return datetime.now(ZoneInfo(tz))
    except Exception:
        return datetime.now()


def today_hm(c):
    n = centre_now(c)
    return n.date().isoformat(), n.strftime("%H:%M")


def err(msg, status=400, field=None, extra=None):
    r = jsonify(dict(error=msg, field=field, **(extra or {})))
    r.status_code = status
    return r


@bp.errorhandler(S.StoreError)
def store_error(e):
    return err(str(e), e.status, e.field, e.extra)


@bp.before_request
def guard():
    if request.method != "GET" and request.headers.get("X-Immora") != "1":
        return err("Missing request header", 403)
    if request.endpoint in ("api.login", "api.info"):
        return None
    if not session.get("u"):
        return err("Please sign in", 401)
    with S.connect() as c:
        row = c.execute("SELECT active FROM users WHERE username=?", (session["u"],)).fetchone()
    if not row or not row["active"]:
        session.clear()
        return err("Your account is not active", 401)


def user():
    return dict(username=session.get("u"), role=session.get("role"), memberId=session.get("mid", ""), name=session.get("name", ""))


@bp.get("/info")
def info():
    with S.connect() as c:
        db, _ = S.load(c)
    cfg = R.cfg_of(db)
    return jsonify(version=VERSION, demo=bool(cfg.get("demo")), centre=cfg.get("tradeName") or cfg.get("legalName"))


@bp.post("/login")
def login():
    b = request.get_json(silent=True) or {}
    un, pw, portal = str(b.get("username", "")).strip().lower(), str(b.get("password", "")), bool(b.get("portal"))
    with S.connect() as c:
        row = c.execute("SELECT * FROM users WHERE username=?", (un,)).fetchone()
        now = datetime.now()
        if row and row["lockedUntil"] and row["lockedUntil"] > now.isoformat():
            return err(f"Too many wrong passwords. Try again in {LOCK_MIN} minutes.", 429)
        if not row or not row["active"] or not S.check_password(pw, row["hash"]):
            if row:
                f = row["failed"] + 1
                c.execute("UPDATE users SET failed=?, lockedUntil=? WHERE username=?",
                          (0 if f >= MAX_FAILS else f, (now + timedelta(minutes=LOCK_MIN)).isoformat() if f >= MAX_FAILS else "", un))
            S.audit(c, {"username": un or "?"}, "login_failed")
            return err("Wrong username or password", 401)
        if portal != (row["role"] == R.MEMBER_ROLE):
            return err("Use the member portal tab to sign in as a member" if row["role"] == R.MEMBER_ROLE else "Staff sign in on the staff tab", 401)
        c.execute("UPDATE users SET failed=0, lockedUntil='' WHERE username=?", (un,))
        S.audit(c, {"username": un}, "login")
    session.clear()
    session.permanent = True
    session.update(u=un, role=row["role"], mid=row["memberId"] or "", name=row["name"])
    return jsonify(user=dict(user(), lang=row["lang"] or ""))


@bp.post("/logout")
def logout():
    session.clear()
    return jsonify(ok=True)


@bp.get("/me")
def me():
    with S.connect() as c:
        row = c.execute("SELECT lang FROM users WHERE username=?", (session["u"],)).fetchone()
    return jsonify(user=dict(user(), lang=(row["lang"] if row else "") or ""))


@bp.post("/lang")
def set_lang():
    lang = str((request.get_json(silent=True) or {}).get("lang", ""))[:8]
    with S.connect() as c:
        c.execute("UPDATE users SET lang=? WHERE username=?", (lang, session["u"]))
    return jsonify(ok=True)


@bp.get("/state")
def state():
    u = user()
    with S.connect() as c:
        db, ver = S.load(c)
        t, hm = today_hm(c)
    if u["role"] == R.MEMBER_ROLE:
        data = S.member_view(db, ver, u["memberId"])
    else:
        data = {k: [dict(r, _v=ver.get((k, r["id"]), 1)) for r in lst] for k, lst in db.items()}
    return jsonify(data=data, today=t, now=hm, user=u, version=VERSION)


@bp.post("/sync")
def sync():
    b = request.get_json(silent=True) or {}
    with S.connect() as c:
        t, _ = today_hm(c)
        recs = S.apply_changes(c, user(), b.get("changes") or [], t)
    return jsonify(records=recs)


@bp.post("/action/<name>")
def action(name):
    with S.connect() as c:
        t, hm = today_hm(c)
        res = actions.run(c, user(), name, request.get_json(silent=True) or {}, t, hm)
    return jsonify(res)


def need_admin():
    if session.get("role") != "admin":
        raise S.StoreError("Only an administrator can do this", 403)


@bp.get("/users")
def users():
    need_admin()
    with S.connect() as c:
        rows = c.execute("SELECT username, name, role, active, memberId FROM users ORDER BY role, username").fetchall()
    return jsonify(users=[dict(r) for r in rows])


@bp.post("/users")
def save_user():
    need_admin()
    b = request.get_json(silent=True) or {}
    un = str(b.get("username", "")).strip().lower()
    if not un or not un.replace(".", "").replace("_", "").replace("-", "").isalnum():
        raise S.StoreError("Username: letters and numbers only", field="username")
    role = b.get("role")
    if role not in R.ROLES + [R.MEMBER_ROLE]:
        raise S.StoreError("Choose a role", field="role")
    with S.connect() as c:
        row = c.execute("SELECT * FROM users WHERE username=?", (un,)).fetchone()
        pw = b.get("password") or ""
        if pw:
            p = S.password_problem(pw)
            if p:
                raise S.StoreError(p, field="password")
        elif not row:
            raise S.StoreError("Set a password for the new user", field="password")
        if role == R.MEMBER_ROLE:
            db, _ = S.load(c)
            if not any(m["id"] == b.get("memberId") for m in db["members"]):
                raise S.StoreError("Choose the member for this portal login", field="memberId")
        if row and row["username"] == session["u"] and (role != "admin" or not b.get("active", True)):
            raise S.StoreError("You cannot remove your own administrator access")
        h = S.hash_password(pw) if pw else row["hash"]
        c.execute("INSERT INTO users(username, name, role, hash, active, memberId) VALUES(?,?,?,?,?,?) ON CONFLICT(username) DO UPDATE SET "
                  "name=excluded.name, role=excluded.role, hash=excluded.hash, active=excluded.active, memberId=excluded.memberId",
                  (un, str(b.get("name") or un)[:80], role, h, 1 if b.get("active", True) else 0, b.get("memberId") or ""))
        S.audit(c, user(), "user_saved", "users", un, f"{un} · {role}{' · password set' if pw else ''}")
    return jsonify(ok=True)


@bp.post("/password")
def change_password():
    b = request.get_json(silent=True) or {}
    with S.connect() as c:
        row = c.execute("SELECT hash FROM users WHERE username=?", (session["u"],)).fetchone()
        if not S.check_password(str(b.get("old", "")), row["hash"]):
            raise S.StoreError("Current password is wrong", field="old")
        p = S.password_problem(b.get("new", ""))
        if p:
            raise S.StoreError(p, field="new")
        c.execute("UPDATE users SET hash=? WHERE username=?", (S.hash_password(b["new"]), session["u"]))
        S.audit(c, user(), "password_changed")
    return jsonify(ok=True)


@bp.get("/audit")
def audit_log():
    if session.get("role") not in ("admin", "finance"):
        raise S.StoreError("Only an administrator or finance can see the audit trail", 403)
    lim = min(int(request.args.get("limit", 300)), 2000)
    with S.connect() as c:
        rows = c.execute("SELECT ts, username, action, coll, rid, summary FROM audit ORDER BY n DESC LIMIT ?", (lim,)).fetchall()
    return jsonify(audit=[dict(r) for r in rows])


@bp.get("/backup")
def backup():
    need_admin()
    with S.connect() as c:
        db, _ = S.load(c)
        S.audit(c, user(), "backup")
    body = json.dumps(dict(app="Immora BCS", version=VERSION, created=datetime.now().isoformat(timespec="seconds"), data=db), ensure_ascii=False)
    return Response(body, mimetype="application/json", headers={"Content-Disposition": "attachment; filename=immora-bcs-backup.json"})


@bp.post("/restore")
def restore():
    need_admin()
    b = request.get_json(silent=True) or {}
    data = (b.get("backup") or {}).get("data")
    if not isinstance(data, dict) or "cfg" not in data:
        raise S.StoreError("This is not an Immora BCS backup file")
    with S.connect() as c:
        c.execute("BEGIN IMMEDIATE")
        c.execute("DELETE FROM records")
        for coll, lst in data.items():
            if coll in R.COLLECTIONS:
                for r in lst:
                    if isinstance(r, dict) and S.ID_RE.match(str(r.get("id", ""))):
                        S.raw_put(c, coll, r)
        c.execute("COMMIT")
        S.audit(c, user(), "restore", summary=f"{sum(len(v) for v in data.values())} records")
    return jsonify(ok=True)
