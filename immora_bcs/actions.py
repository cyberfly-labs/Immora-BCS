"""One-click server actions (same behaviour as LocalServer.action in web/src/03-backend.js)."""
from . import rules as R
from . import store as S


def _uid(prefix, n, today):
    return f"{prefix}-{today.replace('-', '')}-{n:04d}-{S.secrets.token_hex(3)}"


def run(c, user, name, p, today, now_hm="09:00"):
    if name not in R.ACTIONS:
        raise S.StoreError("Unknown action", 404)
    if user.get("role") not in R.ACTIONS[name]:
        raise S.StoreError("Your role cannot do this. Ask an administrator.", 403)
    db, _ = S.load(c)
    cfg = R.cfg_of(db)
    p = p or {}
    if name == "billing_run":
        period = p.get("period") or today
        R.check_date(period[:10], "Billing month")
        invs, charges, skipped = R.billing_run(db, period[:10], today, cfg)
        items = []
        for i, inv in enumerate(invs):
            inv["id"] = _uid("INV", i + 1, today)
            items.append(("invoices", inv))
            for ln in inv["lines"]:
                if ln.get("chargeId"):
                    ch = next(x for x in charges if x["id"] == ln["chargeId"])
                    items.append(("charges", dict(ch, invoiceId=inv["id"])))
        recs = S.put_many(c, user, items, today) if items else []
        S.audit(c, user, "billing_run", "invoices", "", f"{R.month_bounds(period[:10])[0][:7]}: {len(invs)} draft invoice(s); skipped {len(skipped)}")
        return dict(records=recs, created=len(invs), skipped=skipped)
    if name == "dunning_run":
        due = R.dunning_run(db, today, cfg)
        items = []
        for i, (inv, lvl, over, bal) in enumerate(due):
            items.append(("invoices", dict(inv, dunningLevel=lvl, lastReminder=today)))
            cust = inv.get("customer") or {}
            items.append(("outbox", dict(id=_uid("OUT", i + 1, today), to=cust.get("email") or cust.get("name") or "client", status="queued",
                                         date=today, kind="dunning", invoiceId=inv["id"], level=lvl,
                                         subject=["", "Friendly reminder", "Second reminder", "Final notice"][lvl] + f": invoice {inv.get('number')} is {over} day(s) overdue",
                                         body=f"Dear {cust.get('name', 'client')},\n\nOur records show {cfg.get('currency', 'AED')} {bal:,.2f} is still due on invoice {inv.get('number')} dated {R.fmt_date(inv.get('date'))} (due {R.fmt_date(inv.get('dueDate'))}).\n"
                                              f"Please arrange payment or contact us if you have already paid.\n\n{cfg.get('legalName', '')}")))
        recs = S.put_many(c, user, items, today) if items else []
        return dict(records=recs, created=len(due))
    if name == "notice_reminders":
        items = []
        n = 0
        for c2 in db.get("contracts", []):
            nd, inwin = R.notice_due(c2, today)
            if not inwin or c2.get("noticeReminded"):
                continue
            n += 1
            party = R.party_snapshot(c2, db)
            items.append(("contracts", dict(c2, noticeReminded=today)))
            items.append(("outbox", dict(id=_uid("OUT", n, today), to=party.get("email") or party.get("name") or "client", status="queued", date=today,
                                         kind="notice", contractId=c2["id"],
                                         subject=f"Your agreement {c2.get('number')} ends on {R.fmt_date(c2['end'])}: renewal or notice by {R.fmt_date(nd)}",
                                         body=f"Dear {party.get('name')},\n\nYour agreement {c2.get('number')} ends on {R.fmt_date(c2['end'])}. "
                                              f"Under its {c2.get('noticeDays')}-day notice period, please tell us by {R.fmt_date(nd)} whether you will renew.\n\n{cfg.get('legalName', '')}")))
        recs = S.put_many(c, user, items, today) if items else []
        return dict(records=recs, created=n)
    if name == "renew_contract":
        old = next((x for x in db.get("contracts", []) if x.get("id") == p.get("id")), None)
        if not old or old.get("status") not in ("active", "notice"):
            raise S.StoreError("Only active contracts can be renewed")
        new = R.renewal_of(old, today, p.get("uplift") or 0)
        new["id"] = _uid("CT", 1, today)
        old2 = dict(old, status="renewed", renewedTo=new["id"])
        recs = S.put_many(c, user, [("contracts", old2), ("contracts", new)], today)
        return dict(records=recs, id=new["id"])
    if name == "convert_lead":
        lead = next((x for x in db.get("leads", []) if x.get("id") == p.get("id")), None)
        if not lead:
            raise S.StoreError("Lead not found", 404)
        if lead.get("memberId"):
            raise S.StoreError("This lead is already a member")
        items = []
        comp_id = ""
        if (lead.get("company") or "").strip():
            comp_id = _uid("CO", 1, today)
            items.append(("companies", dict(id=comp_id, legalName=lead["company"].strip(), email=lead.get("email", ""), phone=lead.get("phone", ""), status="active", since=today)))
        mid = _uid("M", 1, today)
        items.append(("members", dict(id=mid, name=lead["name"], email=lead.get("email", ""), phone=lead.get("phone", ""), companyId=comp_id,
                                      planId=p.get("planId") or "", status="active", start=today, leadId=lead["id"])))
        items.append(("leads", dict(lead, stage="won", memberId=mid, companyId=comp_id, wonOn=today)))
        recs = S.put_many(c, user, items, today)
        return dict(records=recs, memberId=mid, companyId=comp_id)
    if name == "card_tap":
        card = str(p.get("cardNo") or "").strip()
        door = p.get("door") or "Main entrance"
        m = next((x for x in db.get("members", []) if x.get("cardNo") == card), None)
        ok = bool(m and m.get("status") == "active" and not m.get("cardBlocked"))
        reason = "" if ok else ("Unknown card" if not m else ("Card blocked" if m.get("cardBlocked") else "Membership not active"))
        items = [("access", dict(id=_uid("ACC", 1, today), cardNo=card or "?", memberId=(m or {}).get("id", ""), door=door, at=f"{today}T{now_hm}",
                                 result="granted" if ok else "denied", reason=reason, simulated=True))]
        if ok and door == "Main entrance" and not any(x.get("memberId") == m["id"] and x.get("date") == today for x in db.get("checkins", [])):
            items.append(("checkins", dict(id=_uid("CHK", 1, today), memberId=m["id"], date=today, time=now_hm, via="card")))
        recs = S.put_many(c, user, items, today)
        return dict(records=recs, result="granted" if ok else "denied", reason=reason, member=(m or {}).get("name", ""))
    if name == "payment_link":
        inv = next((x for x in db.get("invoices", []) if x.get("id") == p.get("id")), None)
        if not inv or inv.get("status") not in ("issued", "part_paid"):
            raise S.StoreError("Choose an unpaid issued invoice")
        link = f"https://pay.example.invalid/{inv['number']}?amount={R.invoice_balance(inv, db):.2f}"
        recs = S.put_many(c, user, [("invoices", dict(inv, paymentLink=link))], today)
        return dict(records=recs, link=link)
