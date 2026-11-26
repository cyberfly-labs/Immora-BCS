"""Immora BCS business rules (server side). web/src/02-rules.js is the same logic for the offline edition;
tests/test_parity.py checks both give identical results.

Everything here works on plain dicts so it can be shared by the API, the seed and the tests.
Dates are ISO strings internally (YYYY-MM-DD, or YYYY-MM-DDTHH:MM for bookings); screens show DD-MM-YYYY.
"""
import calendar
import re
from datetime import date, datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP

ROLES = ["admin", "frontdesk", "community", "finance", "viewer"]
STAFF_ROLES = set(ROLES)
MEMBER_ROLE = "member"

COLLECTIONS = ["cfg", "spaces", "plans", "products", "companies", "members", "leads", "tours", "quotes", "contracts",
               "bookings", "invoices", "creditnotes", "receipts", "charges", "visitors", "checkins", "mail", "calls",
               "tickets", "access", "outbox", "addressuse"]

ALL = set(COLLECTIONS)
WRITE = {
    "admin": ALL,
    "frontdesk": {"bookings", "visitors", "checkins", "mail", "calls", "tickets", "access", "charges", "outbox"},
    "community": {"companies", "members", "leads", "tours", "quotes", "contracts", "bookings", "tickets", "visitors",
                  "checkins", "outbox", "addressuse", "charges", "mail", "calls"},
    "finance": {"invoices", "creditnotes", "receipts", "charges", "outbox", "contracts", "companies", "quotes"},
    "viewer": set(),
    "member": {"bookings", "tickets", "visitors"},
}
ACTIONS = {
    "billing_run": {"admin", "finance"},
    "dunning_run": {"admin", "finance"},
    "notice_reminders": {"admin", "community", "finance"},
    "renew_contract": {"admin", "community"},
    "convert_lead": {"admin", "community"},
    "card_tap": {"admin", "frontdesk"},
    "payment_link": {"admin", "finance"},
}

SPACE_TYPES = ["hot_desk", "dedicated_desk", "private_office", "meeting_room", "event_space", "virtual_office", "parking", "locker"]
BOOKABLE = {"meeting_room", "event_space", "hot_desk"}
ASSIGNABLE = {"dedicated_desk", "private_office", "parking", "locker", "virtual_office"}
SPACE_STATUS = ["available", "occupied", "reserved", "maintenance"]
LEAD_STAGES = ["new", "contacted", "tour", "proposal", "negotiation", "won", "lost"]
CONTRACT_STATUS = ["draft", "active", "notice", "ended", "renewed", "cancelled"]
INVOICE_STATUS = ["draft", "issued", "part_paid", "paid", "void"]
TICKET_STATUS = ["open", "in_progress", "waiting", "resolved", "closed"]
TICKET_CATS = ["maintenance", "it", "cleaning", "access", "billing", "other"]
PRIORITIES = ["low", "normal", "high", "urgent"]
MAIL_STATUS = ["received", "notified", "collected", "forwarded", "scanned"]
MAIL_TYPES = ["letter", "parcel", "registered", "courier"]
PAY_METHODS = ["bank_transfer", "card", "cash", "cheque", "payment_link"]
DUNNING_DAYS = [1, 14, 30]   # overdue days for reminder level 1, 2, 3 (final notice)
NOTICE_WINDOW_DAYS = 14      # remind this many days before the notice date

PREFIX = {"invoices": "INV", "creditnotes": "CN", "receipts": "RCT", "quotes": "Q", "contracts": "CT", "tickets": "T",
          "visitors": "V"}

COUNTRY_PRESETS = {
    "AE": dict(country="AE", countryName="United Arab Emirates", currency="AED", vatRate=5, taxLabel="TRN", taxIdDigits=15,
               invoiceTitle="Tax Invoice", ejari=True, tz="Asia/Dubai", vatName="VAT"),
    "SA": dict(country="SA", countryName="Saudi Arabia", currency="SAR", vatRate=15, taxLabel="VAT No.", taxIdDigits=15,
               invoiceTitle="Tax Invoice", ejari=False, tz="Asia/Riyadh", vatName="VAT"),
    "BH": dict(country="BH", countryName="Bahrain", currency="BHD", vatRate=10, taxLabel="VAT Account No.", taxIdDigits=0,
               invoiceTitle="Tax Invoice", ejari=False, tz="Asia/Bahrain", vatName="VAT"),
    "OM": dict(country="OM", countryName="Oman", currency="OMR", vatRate=5, taxLabel="VATIN", taxIdDigits=0,
               invoiceTitle="Tax Invoice", ejari=False, tz="Asia/Muscat", vatName="VAT"),
    "GB": dict(country="GB", countryName="United Kingdom", currency="GBP", vatRate=20, taxLabel="VAT Reg. No.", taxIdDigits=0,
               invoiceTitle="VAT Invoice", ejari=False, tz="Europe/London", vatName="VAT"),
    "IN": dict(country="IN", countryName="India", currency="INR", vatRate=18, taxLabel="GSTIN", taxIdDigits=0,
               invoiceTitle="Tax Invoice", ejari=False, tz="Asia/Kolkata", vatName="GST"),
    "INTL": dict(country="INTL", countryName="International", currency="USD", vatRate=0, taxLabel="Tax ID", taxIdDigits=0,
                 invoiceTitle="Invoice", ejari=False, tz="UTC", vatName="Tax"),
}

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
DT_RE = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$")


class RuleError(Exception):
    def __init__(self, msg, field=None, status=400):
        super().__init__(msg)
        self.field, self.status = field, status


def shared():
    """Constants handed to the browser (same values in both editions)."""
    return dict(ROLES=ROLES, COLLECTIONS=COLLECTIONS, WRITE={k: sorted(v) for k, v in WRITE.items()},
                ACTIONS={k: sorted(v) for k, v in ACTIONS.items()}, SPACE_TYPES=SPACE_TYPES, BOOKABLE=sorted(BOOKABLE),
                ASSIGNABLE=sorted(ASSIGNABLE), SPACE_STATUS=SPACE_STATUS, LEAD_STAGES=LEAD_STAGES,
                CONTRACT_STATUS=CONTRACT_STATUS, INVOICE_STATUS=INVOICE_STATUS, TICKET_STATUS=TICKET_STATUS,
                TICKET_CATS=TICKET_CATS, PRIORITIES=PRIORITIES, MAIL_STATUS=MAIL_STATUS, MAIL_TYPES=MAIL_TYPES,
                PAY_METHODS=PAY_METHODS, DUNNING_DAYS=DUNNING_DAYS, NOTICE_WINDOW_DAYS=NOTICE_WINDOW_DAYS, PREFIX=PREFIX,
                COUNTRY_PRESETS=COUNTRY_PRESETS)


# ---------------------------------------------------------------- numbers & dates
def r2(x):
    return float(Decimal(repr(float(x or 0))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def num(v, field, minimum=0.0, allow_none=False):
    if v in (None, "") and allow_none:
        return None
    try:
        f = float(v)
    except (TypeError, ValueError):
        raise RuleError(f"{field}: enter a number", field)
    if f != f or f in (float("inf"), float("-inf")):
        raise RuleError(f"{field}: enter a number", field)
    if minimum is not None and f < minimum:
        raise RuleError(f"{field}: must be {minimum:g} or more", field)
    return f


def d(s):
    return date.fromisoformat(str(s)[:10])


def iso(dt):
    return dt.isoformat()


def add_days(s, n):
    return iso(d(s) + timedelta(days=n))


def add_months(s, n):
    x = d(s)
    m = x.month - 1 + n
    y, m = x.year + m // 12, m % 12 + 1
    return iso(date(y, m, min(x.day, calendar.monthrange(y, m)[1])))


def month_bounds(s):
    x = d(s)
    return iso(x.replace(day=1)), iso(x.replace(day=calendar.monthrange(x.year, x.month)[1]))


def days_between(a, b):
    return (d(b) - d(a)).days


def fmt_date(s):
    """DD-MM-YYYY for documents."""
    if not s:
        return ""
    s = str(s)
    return f"{s[8:10]}-{s[5:7]}-{s[0:4]}"


def check_date(v, field, required=True):
    if v in (None, ""):
        if required:
            raise RuleError(f"{field}: date is required", field)
        return None
    if not DATE_RE.match(str(v)):
        raise RuleError(f"{field}: use a valid date (DD-MM-YYYY)", field)
    try:
        d(v)
    except ValueError:
        raise RuleError(f"{field}: use a valid date (DD-MM-YYYY)", field)
    return v


def check_dt(v, field):
    if not v or not DT_RE.match(str(v)):
        raise RuleError(f"{field}: date and time are required", field)
    try:
        datetime.fromisoformat(v)
    except ValueError:
        raise RuleError(f"{field}: use a valid date and time", field)
    return v


def hours_between(a, b):
    return (datetime.fromisoformat(b) - datetime.fromisoformat(a)).total_seconds() / 3600.0


# ---------------------------------------------------------------- money
def line_totals(lines, default_rate):
    out, sub, vat = [], 0.0, 0.0
    for i, ln in enumerate(lines or []):
        desc = str(ln.get("desc") or "").strip()
        if not desc:
            raise RuleError(f"Line {i + 1}: description is required", "lines")
        qty = num(ln.get("qty", 1), f"Line {i + 1} quantity", 0)
        price = num(ln.get("price", 0), f"Line {i + 1} price", None)
        rate = num(ln.get("vat", default_rate), f"Line {i + 1} VAT %", 0)
        if rate > 100:
            raise RuleError(f"Line {i + 1}: VAT % must be 100 or less", "lines")
        net = r2(qty * price)
        tax = r2(net * rate / 100)
        x = dict(ln, desc=desc, qty=qty, price=r2(price), vat=rate, net=net, tax=tax)
        out.append(x)
        sub += net
        vat += tax
    sub, vat = r2(sub), r2(vat)
    return out, sub, vat, r2(sub + vat)


def prorate(amount, active_from, active_to, period_start, period_end):
    """Share of a monthly amount for the days a contract is active inside the billing month (both ends inclusive).
    Returns (amount, active_days, days_in_period)."""
    a = max(d(active_from), d(period_start))
    b = min(d(active_to), d(period_end)) if active_to else d(period_end)
    total = (d(period_end) - d(period_start)).days + 1
    days = (b - a).days + 1
    if days <= 0:
        return 0.0, 0, total
    if days >= total:
        return r2(amount), total, total
    return r2(float(amount) * days / total), days, total


def valid_trn(trn, cfg):
    t = re.sub(r"[\s-]", "", str(trn or ""))
    if not t:
        return True
    n = int((cfg or {}).get("taxIdDigits") or 0)
    if n:
        return t.isdigit() and len(t) == n
    return 3 <= len(t) <= 20


# ---------------------------------------------------------------- credits
def member_credit_allowance(member, plans):
    plan = next((p for p in plans if p.get("id") == member.get("planId")), None)
    return float((plan or {}).get("credits") or 0) + float(member.get("extraCredits") or 0)


def credits_used(member_id, month_start, bookings, exclude_id=None):
    ms, me = month_bounds(month_start)
    t = 0.0
    for b in bookings:
        if b.get("memberId") != member_id or b.get("status") == "cancelled" or b.get("id") == exclude_id:
            continue
        if ms <= str(b.get("start", ""))[:10] <= me:
            t += float(b.get("creditsUsed") or 0)
    return r2(t)


def credits_left(member, today, bookings, plans, exclude_id=None):
    return r2(member_credit_allowance(member, plans) - credits_used(member.get("id"), today, bookings, exclude_id))


def price_booking(b, space, member, bookings, plans, cfg):
    """Credits first, then pay-as-you-go at the space's hourly price. Returns (credits_used, overage_hours, overage_amount)."""
    hrs = r2(hours_between(b["start"], b["end"]))
    rate = float(space.get("creditRate") or 1)
    need = r2(hrs * rate)
    if not member:
        return 0.0, hrs, r2(hrs * float(space.get("priceHour") or 0))
    left = max(0.0, credits_left(member, b["start"][:10], bookings, plans, exclude_id=b.get("id")))
    use = min(need, left)
    short_hours = r2((need - use) / rate) if rate else 0.0
    return r2(use), short_hours, r2(short_hours * float(space.get("priceHour") or 0))


# ---------------------------------------------------------------- validation
def _req(rec, field, label=None):
    v = rec.get(field)
    if v is None or (isinstance(v, str) and not v.strip()):
        raise RuleError(f"{label or field} is required", field)
    return v


def _enum(rec, field, values, default=None):
    v = rec.get(field) or default
    if v not in values:
        raise RuleError(f"{field}: choose one of {', '.join(values)}", field)
    rec[field] = v
    return v


def _find(db, coll, rid):
    return next((r for r in db.get(coll, []) if r.get("id") == rid), None)


def validate(coll, rec, old, db, user, today):
    """Check and normalise one record before it is saved. db is {coll: [records]}; returns extra records to save
    (coll, record) for derived changes (e.g. invoice paid amounts)."""
    cfg = cfg_of(db)
    extra = []
    v = VALIDATORS.get(coll)
    if v:
        extra = v(rec, old, db, user, today, cfg) or []
    return extra


def cfg_of(db):
    for r in db.get("cfg", []):
        if r.get("id") == "centre":
            return r
    return dict(COUNTRY_PRESETS["AE"])


def v_spaces(rec, old, db, user, today, cfg):
    _req(rec, "code", "Code"); _req(rec, "name", "Name")
    _enum(rec, "type", SPACE_TYPES)
    _enum(rec, "status", SPACE_STATUS, "available")
    for f in ("priceMonth", "priceHour", "priceDay", "creditRate", "capacity", "area"):
        if rec.get(f) not in (None, ""):
            rec[f] = num(rec[f], f, 0)
    code = rec["code"].strip().upper()
    rec["code"] = code
    if any(s.get("code", "").upper() == code and s["id"] != rec["id"] for s in db.get("spaces", [])):
        raise RuleError(f"Space code {code} is already used", "code")


def v_plans(rec, *a):
    _req(rec, "name", "Plan name")
    rec["price"] = num(rec.get("price", 0), "price", 0)
    rec["credits"] = num(rec.get("credits", 0), "credits", 0)


def v_products(rec, *a):
    _req(rec, "name", "Name")
    rec["price"] = num(rec.get("price", 0), "price", 0)


def v_companies(rec, old, db, user, today, cfg):
    _req(rec, "legalName", "Legal name")
    if rec.get("email") and not EMAIL_RE.match(rec["email"]):
        raise RuleError("Email: enter a valid email address", "email")
    if not valid_trn(rec.get("trn"), cfg):
        n = cfg.get("taxIdDigits")
        raise RuleError(f"{cfg.get('taxLabel', 'TRN')}: must be {n} digits" if n else "Tax ID looks wrong", "trn")
    if rec.get("licenceExpiry"):
        check_date(rec["licenceExpiry"], "Licence expiry")


def v_members(rec, old, db, user, today, cfg):
    _req(rec, "name", "Name")
    _enum(rec, "status", ["active", "paused", "ended"], "active")
    if rec.get("email") and not EMAIL_RE.match(rec["email"]):
        raise RuleError("Email: enter a valid email address", "email")
    if rec.get("companyId") and not _find(db, "companies", rec["companyId"]):
        raise RuleError("Company not found", "companyId")
    check_date(rec.get("start") or today, "Start date"); rec.setdefault("start", today)
    if rec.get("end"):
        check_date(rec["end"], "End date")
    card = str(rec.get("cardNo") or "").strip()
    if card and any(m.get("cardNo") == card and m["id"] != rec["id"] for m in db.get("members", [])):
        raise RuleError(f"Access card {card} is already given to another member", "cardNo")
    rec["extraCredits"] = num(rec.get("extraCredits", 0) or 0, "extraCredits", None)


def v_leads(rec, old, db, user, today, cfg):
    _req(rec, "name", "Name")
    _enum(rec, "stage", LEAD_STAGES, "new")
    if rec.get("email") and not EMAIL_RE.match(rec["email"]):
        raise RuleError("Email: enter a valid email address", "email")
    rec["budget"] = num(rec.get("budget", 0) or 0, "budget", 0)
    rec.setdefault("created", today)


def v_tours(rec, old, db, user, today, cfg):
    check_dt(rec.get("when"), "Tour date and time")
    _enum(rec, "status", ["booked", "done", "no_show", "cancelled"], "booked")
    if not rec.get("leadId") and not rec.get("name"):
        raise RuleError("Choose a lead or enter the visitor's name", "leadId")


def _number(rec, old, coll, db, today):
    if old and old.get("number"):
        rec["number"] = old["number"]
        return
    if rec.get("number") and not old:
        if any(r.get("number") == rec["number"] for r in db.get(coll, [])):
            raise RuleError(f"Number {rec['number']} is already used", "number")
        return
    rec["number"] = next_number(coll, db, today)


def next_number(coll, db, today):
    p = PREFIX[coll]
    y = str(today)[:4]
    if coll in ("tickets", "visitors"):
        pat, width = re.compile(rf"^{p}-(\d+)$"), 4
        head = f"{p}-"
    else:
        pat, width = re.compile(rf"^{p}-{y}-(\d+)$"), 4
        head = f"{p}-{y}-"
    top = 0
    for r in db.get(coll, []):
        m = pat.match(str(r.get("number") or ""))
        if m:
            top = max(top, int(m.group(1)))
    return f"{head}{top + 1:0{width}d}"


def _party(rec, db):
    if rec.get("companyId"):
        c = _find(db, "companies", rec["companyId"])
        if not c:
            raise RuleError("Company not found", "companyId")
        return c
    if rec.get("memberId"):
        m = _find(db, "members", rec["memberId"])
        if not m:
            raise RuleError("Member not found", "memberId")
        return m
    return None


def party_snapshot(rec, db):
    """Customer details frozen on an issued document."""
    c = _find(db, "companies", rec.get("companyId")) if rec.get("companyId") else None
    if c:
        return dict(name=c.get("legalName"), address=c.get("address", ""), trn=c.get("trn", ""), email=c.get("email", ""))
    m = _find(db, "members", rec.get("memberId")) if rec.get("memberId") else None
    if m:
        return dict(name=m.get("name"), address=m.get("address", ""), trn=m.get("trn", ""), email=m.get("email", ""))
    return dict(name=rec.get("customerName") or "", address="", trn="", email="")


def supplier_snapshot(cfg):
    return {k: cfg.get(k, "") for k in ("legalName", "address", "trn", "licenceNo", "phone", "email", "taxLabel", "invoiceTitle", "currency")}


def v_quotes(rec, old, db, user, today, cfg):
    if not rec.get("leadId") and not rec.get("companyId") and not rec.get("memberId"):
        raise RuleError("Choose a lead, company or member", "leadId")
    check_date(rec.get("date") or today, "Quote date"); rec.setdefault("date", today)
    rec["validUntil"] = check_date(rec.get("validUntil") or add_days(rec["date"], 14), "Valid until")
    _enum(rec, "status", ["draft", "sent", "accepted", "declined", "expired"], "draft")
    rec["lines"], rec["subtotal"], rec["vatTotal"], rec["total"] = line_totals(rec.get("lines"), cfg.get("vatRate", 5))
    if not rec["lines"]:
        raise RuleError("Add at least one line", "lines")
    _number(rec, old, "quotes", db, today)


def v_contracts(rec, old, db, user, today, cfg):
    if not rec.get("companyId") and not rec.get("memberId"):
        raise RuleError("Choose the client (company or member)", "companyId")
    _party(rec, db)
    check_date(rec.get("start"), "Start date")
    check_date(rec.get("end"), "End date")
    if rec["end"] < rec["start"]:
        raise RuleError("End date must be after the start date", "end")
    _enum(rec, "status", CONTRACT_STATUS, "draft")
    rec["monthlyFee"] = num(rec.get("monthlyFee", 0), "Monthly fee", 0)
    rec["deposit"] = num(rec.get("deposit", 0) or 0, "Deposit", 0)
    rec["noticeDays"] = int(num(rec.get("noticeDays", 60) or 0, "Notice period", 0))
    _enum(rec, "depositStatus", ["not_due", "due", "received", "refunded", "part_refunded"], "due" if rec["deposit"] else "not_due")
    rec["spaceIds"] = [s for s in (rec.get("spaceIds") or []) if s]
    for sid in rec["spaceIds"]:
        sp = _find(db, "spaces", sid)
        if not sp:
            raise RuleError("Space not found", "spaceIds")
        if rec["status"] in ("active", "notice", "draft") and sp.get("type") in ("private_office", "dedicated_desk", "parking", "locker"):
            for c in db.get("contracts", []):
                if c["id"] == rec["id"] or c.get("status") not in ("active", "notice"):
                    continue
                if sid in (c.get("spaceIds") or []) and c["start"] <= rec["end"] and rec["start"] <= c["end"]:
                    raise RuleError(f"{sp.get('code')} is already contracted to {c.get('number')} for those dates", "spaceIds")
    rec["addons"] = [dict(a, qty=num(a.get("qty", 1), "Add-on quantity", 0), price=num(a.get("price", 0), "Add-on price", 0))
                     for a in (rec.get("addons") or []) if a.get("name")]
    rec.setdefault("termMonths", 12)
    _number(rec, old, "contracts", db, today)


def v_bookings(rec, old, db, user, today, cfg):
    sp = _find(db, "spaces", rec.get("spaceId"))
    if not sp:
        raise RuleError("Choose a room or space", "spaceId")
    if sp.get("type") not in BOOKABLE:
        raise RuleError(f"{sp.get('name')} cannot be booked by the hour", "spaceId")
    if sp.get("status") == "maintenance" and rec.get("status") != "cancelled":
        raise RuleError(f"{sp.get('name')} is under maintenance", "spaceId")
    check_dt(rec.get("start"), "Start"); check_dt(rec.get("end"), "End")
    if rec["end"] <= rec["start"]:
        raise RuleError("End time must be after the start time", "end")
    if rec["start"][:10] != rec["end"][:10]:
        raise RuleError("A booking must start and end on the same day", "end")
    if hours_between(rec["start"], rec["end"]) > 14:
        raise RuleError("A booking can be at most 14 hours", "end")
    _enum(rec, "status", ["confirmed", "tentative", "cancelled", "checked_in"], "confirmed")
    rec["attendees"] = int(num(rec.get("attendees", 1) or 1, "Attendees", 1))
    if sp.get("capacity") and rec["attendees"] > float(sp["capacity"]):
        raise RuleError(f"{sp.get('name')} seats {int(float(sp['capacity']))}; you entered {rec['attendees']}", "attendees")
    member = _find(db, "members", rec.get("memberId")) if rec.get("memberId") else None
    if rec.get("memberId") and not member:
        raise RuleError("Member not found", "memberId")
    if user.get("role") == MEMBER_ROLE:
        if rec.get("memberId") != user.get("memberId"):
            raise RuleError("You can only book for yourself", "memberId", 403)
        if not old and rec["start"][:10] < today:
            raise RuleError("Choose a time in the future", "start")
    if rec["status"] != "cancelled":
        for b in db.get("bookings", []):
            if b["id"] != rec["id"] and b.get("spaceId") == rec["spaceId"] and b.get("status") != "cancelled" \
                    and b["start"] < rec["end"] and rec["start"] < b["end"]:
                raise RuleError(f"{sp.get('name')} is already booked {b['start'][11:]}–{b['end'][11:]}", "start", 409)
    extra = []
    timing_changed = not old or any(old.get(k) != rec.get(k) for k in ("start", "end", "spaceId", "memberId")) or \
        (old.get("status") == "cancelled") != (rec["status"] == "cancelled")
    if timing_changed:
        if rec["status"] == "cancelled":
            rec["creditsUsed"], rec["overageHours"], rec["overageAmount"] = 0.0, 0.0, 0.0
        else:
            rec["creditsUsed"], rec["overageHours"], rec["overageAmount"] = price_booking(rec, sp, member, db.get("bookings", []), db.get("plans", []), cfg)
        # pay-as-you-go part becomes a pending charge for the next invoice
        ch = next((c for c in db.get("charges", []) if c.get("bookingId") == rec["id"]), None)
        if ch and ch.get("invoiceId"):
            if rec["overageAmount"] != ch.get("amount"):
                raise RuleError("This booking's charge is already invoiced; issue a credit note instead", "start")
        elif rec["overageAmount"] > 0 and (member or rec.get("companyId")):
            c2 = dict(ch or {"id": "CHG-" + rec["id"]})
            c2.update(date=rec["start"][:10], bookingId=rec["id"], memberId=rec.get("memberId") or "",
                      companyId=(member or {}).get("companyId") or rec.get("companyId") or "",
                      desc=f"{sp.get('name')} booking {fmt_date(rec['start'][:10])} {rec['start'][11:]}–{rec['end'][11:]} ({rec['overageHours']:g} h beyond credits)",
                      qty=rec["overageHours"], price=r2(float(sp.get("priceHour") or 0)), amount=rec["overageAmount"],
                      vat=cfg.get("vatRate", 5), invoiceId="")
            extra.append(("charges", c2, "put"))
        elif ch:
            extra.append(("charges", ch, "delete"))
    return extra


def v_invoices(rec, old, db, user, today, cfg):
    _enum(rec, "status", INVOICE_STATUS, "draft")
    if old and old.get("status") != "draft":
        # issued invoices are locked: only payment / reminder bookkeeping fields may change, or void with a reason
        locked = {k: v for k, v in old.items() if k not in ("status", "paid", "dunningLevel", "lastReminder", "paymentLink", "voidReason", "voidedOn", "notes", "credited")}
        for k, v in locked.items():
            if rec.get(k) != v:
                raise RuleError("An issued tax invoice cannot be changed. Issue a credit note, or void it with a reason.", k)
        if rec["status"] == "draft":
            raise RuleError("An issued invoice cannot go back to draft", "status")
        if rec["status"] == "void" and old["status"] != "void":
            if not str(rec.get("voidReason") or "").strip():
                raise RuleError("Give a reason for voiding", "voidReason")
            if float(old.get("paid") or 0) > 0:
                raise RuleError("This invoice has payments; issue a credit note instead of voiding", "status")
            rec["voidedOn"] = today
        return []
    _party(rec, db) or (_req(rec, "customerName", "Customer"))
    check_date(rec.get("date") or today, "Invoice date"); rec.setdefault("date", today)
    rec["dueDate"] = check_date(rec.get("dueDate") or add_days(rec["date"], int(cfg.get("paymentTermsDays") or 14)), "Due date")
    if rec["dueDate"] < rec["date"]:
        raise RuleError("Due date must be on or after the invoice date", "dueDate")
    rec["lines"], rec["subtotal"], rec["vatTotal"], rec["total"] = line_totals(rec.get("lines"), cfg.get("vatRate", 5))
    rec["paid"] = r2(rec.get("paid") or 0)
    rec.setdefault("dunningLevel", 0)
    if rec["status"] in ("void",):
        raise RuleError("Delete a draft instead of voiding it", "status")
    if rec["status"] != "draft":
        if not rec["lines"]:
            raise RuleError("Add at least one line before issuing", "lines")
        if rec["total"] <= 0:
            raise RuleError("The invoice total must be more than zero", "lines")
        rec["status"] = "issued"
        rec["number"] = next_number("invoices", db, rec["date"])
        rec["customer"] = party_snapshot(rec, db)
        rec["supplier"] = supplier_snapshot(cfg)
        rec["issuedOn"] = today
    return []


def invoice_balance(inv, db):
    cn = sum(float(c.get("total") or 0) for c in db.get("creditnotes", []) if c.get("invoiceId") == inv["id"])
    return r2(float(inv.get("total") or 0) - float(inv.get("paid") or 0) - cn)


def _refresh_status(inv, db):
    bal = invoice_balance(inv, db)
    if inv["status"] == "void":
        return inv
    inv["status"] = "paid" if bal <= 0.004 else ("part_paid" if float(inv.get("paid") or 0) > 0 or inv.get("credited") else "issued")
    return inv


def v_creditnotes(rec, old, db, user, today, cfg):
    if old:
        raise RuleError("A credit note cannot be changed once issued", "lines")
    inv = _find(db, "invoices", rec.get("invoiceId"))
    if not inv or inv.get("status") in ("draft", "void"):
        raise RuleError("Choose an issued invoice", "invoiceId")
    _req(rec, "reason", "Reason")
    check_date(rec.get("date") or today, "Date"); rec.setdefault("date", today)
    rec["lines"], rec["subtotal"], rec["vatTotal"], rec["total"] = line_totals(rec.get("lines"), cfg.get("vatRate", 5))
    if rec["total"] <= 0:
        raise RuleError("The credit note total must be more than zero", "lines")
    bal = invoice_balance(inv, db)
    if rec["total"] > bal + 0.004:
        raise RuleError(f"The credit note is more than the invoice balance ({bal:.2f})", "lines")
    rec["number"] = next_number("creditnotes", db, rec["date"])
    rec["companyId"], rec["memberId"] = inv.get("companyId", ""), inv.get("memberId", "")
    rec["customer"] = inv.get("customer") or party_snapshot(inv, db)
    rec["supplier"] = supplier_snapshot(cfg)
    rec["invoiceNumber"] = inv.get("number")
    inv2 = dict(inv, credited=r2(float(inv.get("credited") or 0) + rec["total"]))
    db2 = dict(db, creditnotes=db.get("creditnotes", []) + [rec])
    return [("invoices", _refresh_status(inv2, db2), "put")]


def v_receipts(rec, old, db, user, today, cfg):
    if old:
        raise RuleError("A receipt cannot be changed; record a refund or credit note instead", "amount")
    inv = _find(db, "invoices", rec.get("invoiceId"))
    if not inv or inv.get("status") in ("draft", "void"):
        raise RuleError("Choose an issued invoice", "invoiceId")
    rec["amount"] = num(rec.get("amount"), "Amount", 0.01)
    rec["amount"] = r2(rec["amount"])
    _enum(rec, "method", PAY_METHODS, "bank_transfer")
    check_date(rec.get("date") or today, "Date"); rec.setdefault("date", today)
    bal = invoice_balance(inv, db)
    if rec["amount"] > bal + 0.004:
        raise RuleError(f"The amount is more than the balance due ({bal:.2f})", "amount")
    rec["number"] = next_number("receipts", db, rec["date"])
    rec["companyId"], rec["memberId"] = inv.get("companyId", ""), inv.get("memberId", "")
    rec["invoiceNumber"] = inv.get("number")
    rec["customerName"] = (inv.get("customer") or {}).get("name", "")
    inv2 = dict(inv, paid=r2(float(inv.get("paid") or 0) + rec["amount"]))
    return [("invoices", _refresh_status(inv2, db), "put")]


def v_charges(rec, old, db, user, today, cfg):
    _req(rec, "desc", "Description")
    if not rec.get("companyId") and not rec.get("memberId"):
        raise RuleError("Choose who to charge", "memberId")
    _party(rec, db)
    if old and old.get("invoiceId"):
        raise RuleError("This charge is already invoiced", "desc")
    rec["qty"] = num(rec.get("qty", 1), "Quantity", 0)
    rec["price"] = num(rec.get("price", 0), "Price", 0)
    rec["amount"] = r2(rec["qty"] * rec["price"])
    rec["vat"] = num(rec.get("vat", cfg.get("vatRate", 5)), "VAT %", 0)
    rec["date"] = check_date(rec.get("date") or today, "Date")
    rec.setdefault("invoiceId", "")


def v_visitors(rec, old, db, user, today, cfg):
    _req(rec, "name", "Visitor name")
    check_date(rec.get("date") or today, "Visit date"); rec.setdefault("date", today)
    _enum(rec, "status", ["expected", "checked_in", "checked_out", "cancelled"], "expected")
    if user.get("role") == MEMBER_ROLE:
        if rec.get("hostId") != user.get("memberId"):
            raise RuleError("You can only invite guests for yourself", "hostId", 403)
        if old and old.get("status") != rec["status"] and rec["status"] not in ("cancelled",):
            raise RuleError("Reception checks guests in", "status", 403)
    if rec.get("hostId") and not _find(db, "members", rec["hostId"]):
        raise RuleError("Host member not found", "hostId")
    _number(rec, old, "visitors", db, today)
    if rec["status"] == "checked_in" and not rec.get("inAt"):
        rec["inAt"] = rec.get("nowTime") or "09:00"
    rec.pop("nowTime", None)


def v_checkins(rec, old, db, user, today, cfg):
    if not _find(db, "members", rec.get("memberId")):
        raise RuleError("Member not found", "memberId")
    rec["date"] = check_date(rec.get("date") or today, "Date")


def v_mail(rec, old, db, user, today, cfg):
    if not rec.get("companyId") and not rec.get("memberId"):
        raise RuleError("Choose who the mail is for", "companyId")
    _party(rec, db)
    _enum(rec, "type", MAIL_TYPES, "letter")
    _enum(rec, "status", MAIL_STATUS, "received")
    rec["received"] = check_date(rec.get("received") or today, "Received date")
    _req(rec, "sender", "Sender")


def v_calls(rec, old, db, user, today, cfg):
    if not rec.get("companyId") and not rec.get("memberId"):
        raise RuleError("Choose who the call was for", "companyId")
    _party(rec, db)
    _req(rec, "caller", "Caller name")
    _req(rec, "message", "Message")
    _enum(rec, "status", ["new", "passed_on", "closed"], "new")
    rec.setdefault("when", today + "T09:00")


def v_tickets(rec, old, db, user, today, cfg):
    _req(rec, "subject", "Subject")
    _enum(rec, "category", TICKET_CATS, "maintenance")
    _enum(rec, "priority", PRIORITIES, "normal")
    _enum(rec, "status", TICKET_STATUS, "open")
    rec.setdefault("opened", today)
    if user.get("role") == MEMBER_ROLE:
        if rec.get("memberId") != user.get("memberId"):
            raise RuleError("You can only raise tickets for yourself", "memberId", 403)
        if old:
            allowed = {"comments"}
            for k in set(old) | set(rec):
                if k not in allowed and old.get(k) != rec.get(k):
                    if not (k == "status" and rec.get("status") == "closed"):
                        raise RuleError("Only the centre team can change this ticket", k, 403)
    if rec["status"] in ("resolved", "closed") and not rec.get("closedOn"):
        rec["closedOn"] = today
    _number(rec, old, "tickets", db, today)


def v_access(rec, old, db, user, today, cfg):
    _req(rec, "cardNo", "Card number")
    _req(rec, "door", "Door")
    _enum(rec, "result", ["granted", "denied"], "granted")


def v_outbox(rec, *a):
    _req(rec, "to", "Recipient"); _req(rec, "subject", "Subject")
    _enum(rec, "status", ["queued", "sent_simulated", "cancelled"], "queued")


def v_addressuse(rec, old, db, user, today, cfg):
    if not _find(db, "companies", rec.get("companyId")):
        raise RuleError("Choose the company", "companyId")
    _req(rec, "licenceNo", "Trade licence number")
    check_date(rec.get("from") or today, "From"); rec.setdefault("from", today)
    if rec.get("to"):
        check_date(rec["to"], "To")
    _enum(rec, "status", ["active", "ended"], "active")


def v_cfg(rec, old, db, user, today, cfg):
    if rec.get("id") == "centre":
        _req(rec, "legalName", "Centre legal name")
        if rec.get("country") not in COUNTRY_PRESETS:
            raise RuleError("Choose a country preset", "country")
        rec["vatRate"] = num(rec.get("vatRate", 5), "VAT rate", 0)
        if not valid_trn(rec.get("trn"), rec):
            raise RuleError(f"{rec.get('taxLabel', 'TRN')}: must be {rec.get('taxIdDigits')} digits", "trn")
        rec["paymentTermsDays"] = int(num(rec.get("paymentTermsDays", 14), "Payment terms", 0))


VALIDATORS = dict(spaces=v_spaces, plans=v_plans, products=v_products, companies=v_companies, members=v_members, leads=v_leads,
                  tours=v_tours, quotes=v_quotes, contracts=v_contracts, bookings=v_bookings, invoices=v_invoices,
                  creditnotes=v_creditnotes, receipts=v_receipts, charges=v_charges, visitors=v_visitors, checkins=v_checkins,
                  mail=v_mail, calls=v_calls, tickets=v_tickets, access=v_access, outbox=v_outbox, addressuse=v_addressuse,
                  cfg=v_cfg)

DELETE_RULES = {
    "invoices": lambda r: r.get("status") == "draft" or "Issued invoices cannot be deleted. Void it with a reason or issue a credit note.",
    "creditnotes": lambda r: "Credit notes cannot be deleted",
    "receipts": lambda r: "Receipts cannot be deleted",
    "charges": lambda r: not r.get("invoiceId") or "This charge is already invoiced",
    "contracts": lambda r: r.get("status") in ("draft", "cancelled") or "Only draft or cancelled contracts can be deleted. End it instead.",
    "cfg": lambda r: "Settings cannot be deleted",
}


def can_delete(coll, rec):
    f = DELETE_RULES.get(coll)
    if not f:
        return True
    res = f(rec)
    return res if isinstance(res, str) else True


# ---------------------------------------------------------------- actions (same in 02-rules.js)
def _party_key(x):
    return ("c:" + x["companyId"]) if x.get("companyId") else ("m:" + (x.get("memberId") or ""))


def billing_run(db, period, today, cfg):
    """Draft invoices for one month: contract fees and add-ons (prorated), plus pending charges.
    Returns (new_invoices, charge_updates, skipped_contract_numbers)."""
    ps, pe = month_bounds(period)
    rate = cfg.get("vatRate", 5)
    terms = int(cfg.get("paymentTermsDays") or 14)
    invs, skipped = {}, []
    billed = {(i.get("contractId"), i.get("periodStart")) for i in db.get("invoices", []) if i.get("status") != "void"}
    spaces = {s["id"]: s for s in db.get("spaces", [])}

    def inv_for(party):
        k = _party_key(party)
        if k not in invs:
            invs[k] = dict(id="", status="draft", companyId=party.get("companyId", ""), memberId="" if party.get("companyId") else party.get("memberId", ""),
                           date=max(ps, today), dueDate=add_days(max(ps, today), terms), periodStart=ps, periodEnd=pe, lines=[], source="billing_run", contractId="", contractIds=[])
        return invs[k]

    for c in sorted(db.get("contracts", []), key=lambda x: x.get("number") or ""):
        if c.get("status") not in ("active", "notice") or c["start"] > pe or c["end"] < ps:
            continue
        if (c["id"], ps) in billed or any(c["id"] in (i.get("contractIds") or []) and i.get("periodStart") == ps and i.get("status") != "void" for i in db.get("invoices", [])):
            skipped.append(c.get("number"))
            continue
        inv = inv_for(c)
        inv["contractIds"].append(c["id"])
        if not inv["contractId"]:
            inv["contractId"] = c["id"]
        codes = ", ".join(spaces[s].get("code", "") for s in c.get("spaceIds", []) if s in spaces)
        amt, days, total = prorate(c["monthlyFee"], c["start"], c["end"], ps, pe)
        span = f"{fmt_date(max(c['start'], ps))} to {fmt_date(min(c['end'], pe))}"
        note = f" (prorated {days}/{total} days)" if days < total else ""
        if amt > 0:
            inv["lines"].append(dict(desc=f"{c.get('title') or 'Membership'}{' – ' + codes if codes else ''} · {span}{note}", qty=1, price=amt,
                                     vat=0 if c.get("vatExempt") else rate, kind="fee", contractId=c["id"]))
        for a in c.get("addons") or []:
            a_amt, _, _ = prorate(r2(float(a["qty"]) * float(a["price"])), c["start"], c["end"], ps, pe)
            if a_amt > 0:
                inv["lines"].append(dict(desc=f"{a['name']} · {span}{note}", qty=1, price=a_amt, vat=rate, kind="addon", contractId=c["id"]))
    charge_updates = []
    for ch in sorted(db.get("charges", []), key=lambda x: (x.get("date") or "", x.get("id"))):
        if ch.get("invoiceId") or (ch.get("date") or "") > pe:
            continue
        inv = inv_for(ch)
        inv["lines"].append(dict(desc=f"{ch['desc']} ({fmt_date(ch['date'])})", qty=ch.get("qty", 1), price=ch.get("price", 0), vat=ch.get("vat", rate), kind="charge", chargeId=ch["id"]))
        charge_updates.append(ch)
    out = []
    for k in sorted(invs):
        inv = invs[k]
        if not inv["lines"]:
            continue
        inv["lines"], inv["subtotal"], inv["vatTotal"], inv["total"] = line_totals(inv["lines"], rate)
        out.append(inv)
    return out, charge_updates, skipped


def dunning_level(days_overdue):
    lvl = 0
    for i, t in enumerate(DUNNING_DAYS):
        if days_overdue >= t:
            lvl = i + 1
    return lvl


def dunning_run(db, today, cfg):
    """Invoices that need the next reminder: [(invoice, new_level, days_overdue, balance)]."""
    out = []
    for inv in sorted(db.get("invoices", []), key=lambda x: x.get("number") or ""):
        if inv.get("status") not in ("issued", "part_paid"):
            continue
        bal = invoice_balance(inv, db)
        if bal <= 0:
            continue
        over = days_between(inv["dueDate"], today)
        lvl = dunning_level(over)
        if lvl > int(inv.get("dunningLevel") or 0):
            out.append((inv, lvl, over, bal))
    return out


def notice_due(c, today):
    """Date the client must give notice by, and whether the reminder window has started."""
    nd = add_days(c["end"], -int(c.get("noticeDays") or 0))
    return nd, c.get("status") in ("active", "notice") and today >= add_days(nd, -NOTICE_WINDOW_DAYS) and c["end"] >= today


def renewal_of(c, today, uplift_pct=0):
    start = add_days(c["end"], 1)
    months = int(c.get("termMonths") or 12)
    end = add_days(add_months(start, months), -1)
    fee = r2(float(c["monthlyFee"]) * (1 + float(uplift_pct or 0) / 100))
    keep = {k: v for k, v in c.items() if k not in ("id", "number", "status", "start", "end", "monthlyFee", "noticeReminded", "renewedTo", "_v", "renewals", "depositStatus")}
    return dict(keep, start=start, end=end, monthlyFee=fee, status="active", renewedFrom=c["id"], depositStatus=c.get("depositStatus") or "not_due")
