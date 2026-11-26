"""Fictional demo data for Immora BCS. Every name, TRN, licence and phone number here is made up.
Prices are example placeholders, not recommendations. generate(today) builds a full working centre:
contracts, bookings and five months of invoices made with the real billing rules."""
import copy
from datetime import date, timedelta

from . import rules as R

DEMO_USERS = [  # username, password, display name, role, memberId
    ("admin", "admin123", "Sara Admin (demo)", "admin", ""),
    ("frontdesk", "frontdesk123", "Omar Front Desk (demo)", "frontdesk", ""),
    ("community", "community123", "Lina Community (demo)", "community", ""),
    ("finance", "finance123", "Ravi Finance (demo)", "finance", ""),
    ("viewer", "viewer123", "Guest Viewer (demo)", "viewer", ""),
    ("member", "member123", "Aisha Rahman (demo member)", "member", "M-0001"),
]

SYS = {"username": "seed", "role": "admin"}


def _put(db, coll, rec, today):
    rec = copy.deepcopy(rec)
    old = next((r for r in db[coll] if r["id"] == rec["id"]), None)
    extras = R.validate(coll, rec, old, db, SYS, today)
    for c2, r2, op in [(coll, rec, "put")] + list(extras or []):
        lst = db[c2]
        idx = next((i for i, r in enumerate(lst) if r["id"] == r2["id"]), None)
        if op == "delete":
            if idx is not None:
                lst.pop(idx)
        elif idx is None:
            lst.append(r2)
        else:
            lst[idx] = r2
    return rec


def generate(today=None):
    T = date.fromisoformat(today) if today else date.today()
    t = T.isoformat()
    D = lambda n: (T + timedelta(days=n)).isoformat()
    M = lambda n, day=1: R.add_months(T.replace(day=1).isoformat(), n)[:8] + f"{day:02d}"
    db = {k: [] for k in R.COLLECTIONS}
    cfg = dict(R.COUNTRY_PRESETS["AE"], id="centre", legalName="Skyline Hub Business Centre LLC (demo)", tradeName="Skyline Hub",
               address="Office 1201, Demo Tower, Business Bay, Dubai, United Arab Emirates", trn="100000000000003",
               licenceNo="DED-000000 (demo)", phone="+971 4 000 0000", email="hello@skylinehub.example",
               bank="Demo Bank PJSC · IBAN AE00 0000 0000 0000 0000 000 (fictional)", paymentTermsDays=14, openFrom="07:00", openTo="22:00",
               footer="Thank you for working with us.", invoicePrefix="INV", lang="en", demo=True)
    db["cfg"].append(cfg)
    # ------------------------------------------------ spaces (floor 12 coworking, floor 14 offices)
    S = []
    for i in range(12):
        S.append(dict(id=f"SP-HD{i+1:02d}", code=f"HD-{i+1:02d}", name=f"Hot desk {i+1}", type="hot_desk", floor="12", capacity=1,
                      priceMonth=950, priceDay=90, priceHour=25, creditRate=1, x=40 + (i % 6) * 70, y=40 + (i // 6) * 70, w=56, h=50, status="available"))
    for i in range(8):
        S.append(dict(id=f"SP-DD{i+1:02d}", code=f"DD-{i+1:02d}", name=f"Dedicated desk {i+1}", type="dedicated_desk", floor="12", capacity=1,
                      priceMonth=1450, x=40 + (i % 4) * 80, y=210 + (i // 4) * 70, w=64, h=52, status="available"))
    rooms = [("MR-DHOW", "Dhow room", 4, 80, 1, 520, 40, 120, 90), ("MR-MAJ", "Majlis room", 8, 150, 2, 660, 40, 150, 90),
             ("MR-FAL", "Falcon room", 12, 220, 3, 520, 150, 150, 100), ("MR-BRD", "Boardroom", 16, 300, 4, 690, 150, 120, 100)]
    for code, nm, cap, ph, cr, x, y, w, h in rooms:
        S.append(dict(id="SP-" + code, code=code, name=nm, type="meeting_room", floor="12", capacity=cap, priceHour=ph, creditRate=cr,
                      x=x, y=y, w=w, h=h, status="available", amenities="Screen, video call kit, whiteboard"))
    S.append(dict(id="SP-EV-ATR", code="EV-ATR", name="Atrium event space", type="event_space", floor="12", capacity=60, priceHour=750, creditRate=10,
                  x=380, y=290, w=430, h=110, status="available", amenities="PA system, projector, 60 chairs"))
    offices = [(101, 2, 18, 4500), (102, 3, 24, 6200), (103, 4, 30, 7800), (104, 4, 32, 8200), (105, 6, 42, 11500), (106, 8, 55, 15500),
               (107, 2, 16, 4200), (108, 3, 22, 5900)]
    for i, (no, cap, area, pm) in enumerate(offices):
        S.append(dict(id=f"SP-PO{no}", code=f"PO-{no}", name=f"Private office {no}", type="private_office", floor="14", capacity=cap, area=area,
                      priceMonth=pm, x=40 + (i % 4) * 190, y=40 + (i // 4) * 170, w=170, h=140, status="available"))
    for i in range(6):
        S.append(dict(id=f"SP-P{i+1:02d}", code=f"P-{i+1:02d}", name=f"Parking bay {i+1}", type="parking", floor="B1", capacity=1, priceMonth=350,
                      x=40 + i * 90, y=40, w=70, h=120, status="available"))
    for i in range(10):
        S.append(dict(id=f"SP-L{i+1:02d}", code=f"L-{i+1:02d}", name=f"Locker {i+1}", type="locker", floor="12", capacity=1, priceMonth=100,
                      x=40 + i * 44, y=440, w=38, h=38, status="available"))
    S.append(dict(id="SP-VO", code="VO-ADDR", name="Virtual office address", type="virtual_office", floor="12", capacity=500, priceMonth=750,
                  x=860, y=40, w=110, h=60, status="available"))
    for s in S:
        _put(db, "spaces", s, t)
    S_BY = {s["code"]: s for s in db["spaces"]}
    S_BY["PO-106"]["status"] = "maintenance"
    S_BY["PO-106"]["note"] = "Carpet replacement (demo)"
    # ------------------------------------------------ plans & add-ons
    for p in [dict(id="PL-HOT", name="Hot desk membership", type="hot_desk", price=950, credits=8),
              dict(id="PL-DED", name="Dedicated desk membership", type="dedicated_desk", price=1450, credits=12),
              dict(id="PL-OFF", name="Private office member", type="private_office", price=0, credits=10),
              dict(id="PL-VO", name="Virtual office", type="virtual_office", price=750, credits=2),
              dict(id="PL-DAY", name="Day pass", type="hot_desk", price=90, credits=0)]:
        _put(db, "plans", p, t)
    for p in [dict(id="PR-PRBW", name="Printing B/W (per page)", price=0.5, category="printing"),
              dict(id="PR-PRCL", name="Printing colour (per page)", price=1.5, category="printing"),
              dict(id="PR-COF", name="Barista coffee", price=12, category="coffee"),
              dict(id="PR-PARKD", name="Visitor parking (per day)", price=40, category="parking"),
              dict(id="PR-CAT", name="Meeting catering (per person)", price=25, category="catering"),
              dict(id="PR-MAILSC", name="Mail scanning (per item)", price=10, category="mail"),
              dict(id="PR-COUR", name="Courier forwarding (per item)", price=15, category="mail"),
              dict(id="PR-CALL", name="Call answering (monthly)", price=250, category="virtual_office")]:
        _put(db, "products", p, t)
    # ------------------------------------------------ companies & members
    comps = [("CO-001", "Bluewave Tech Solutions FZ-LLC", "100000000010003", "Office PO-101, Demo Tower, Business Bay, Dubai", "accounts@bluewave.example", "FZ-100101"),
             ("CO-002", "Saffron Lane Design LLC", "100000000020003", "Office PO-102, Demo Tower, Business Bay, Dubai", "hello@saffronlane.example", "DED-200202"),
             ("CO-003", "Corniche Legal Consultants LLC", "100000000030003", "Office PO-103, Demo Tower, Business Bay, Dubai", "admin@corniche.example", "DED-300303"),
             ("CO-004", "Palmline Trading LLC", "100000000040003", "Office PO-105, Demo Tower, Business Bay, Dubai", "finance@palmline.example", "DED-400404"),
             ("CO-005", "Mirage Analytics FZE", "", "Desk DD-01, Demo Tower, Business Bay, Dubai", "team@mirage.example", "FZ-500505"),
             ("CO-006", "Harbor Light Marketing LLC", "100000000060003", "Virtual office, Demo Tower, Business Bay, Dubai", "info@harborlight.example", "DED-600606"),
             ("CO-007", "Zenith Travel Services LLC", "100000000070003", "Virtual office, Demo Tower, Business Bay, Dubai", "ops@zenithtravel.example", "DED-700707"),
             ("CO-008", "Cedar & Co Consulting", "", "Office PO-104, Demo Tower, Business Bay, Dubai", "cedar@cedarco.example", "DED-800808")]
    for cid, nm, trn, addr, em, lic in comps:
        _put(db, "companies", dict(id=cid, legalName=nm, trn=trn, address=addr, email=em, phone="+971 50 000 " + cid[-3:] + "0", licenceNo=lic,
                                   licenceAuthority="Dubai DET (demo)" if lic.startswith("DED") else "Free zone authority (demo)",
                                   licenceExpiry=R.add_months(t, 3 + int(cid[-1])), status="active", since=M(-7)), t)
    people = [("M-0001", "Aisha Rahman", "CO-001", "PL-OFF", "C-1001"), ("M-0002", "Daniel Mercer", "CO-001", "PL-OFF", "C-1002"),
              ("M-0003", "Priya Nair", "CO-002", "PL-OFF", "C-1003"), ("M-0004", "Youssef Haddad", "CO-002", "PL-OFF", "C-1004"),
              ("M-0005", "Elena Petrova", "CO-003", "PL-OFF", "C-1005"), ("M-0006", "Khalid Al Mansoori", "CO-003", "PL-OFF", "C-1006"),
              ("M-0007", "Fatima Zahra", "CO-004", "PL-OFF", "C-1007"), ("M-0008", "Tom Becker", "CO-004", "PL-OFF", "C-1008"),
              ("M-0009", "Mei Lin", "CO-005", "PL-DED", "C-1009"), ("M-0010", "Arjun Mehta", "CO-005", "PL-DED", "C-1010"),
              ("M-0011", "Noura Saeed", "CO-006", "PL-VO", ""), ("M-0012", "Lucas Moreau", "CO-007", "PL-VO", ""),
              ("M-0013", "Hana Kobayashi", "", "PL-HOT", "C-1013"), ("M-0014", "Samuel Okafor", "", "PL-HOT", "C-1014"),
              ("M-0015", "Rania Khoury", "", "PL-HOT", "C-1015"), ("M-0016", "Ivan Novak", "CO-008", "PL-OFF", "C-1016"),
              ("M-0017", "Grace Wanjiru", "", "PL-DAY", "C-1017"), ("M-0018", "Bilal Qureshi", "", "PL-HOT", "C-1018")]
    for mid, nm, cid, plan, card in people:
        first = nm.split()[0].lower()
        _put(db, "members", dict(id=mid, name=nm, companyId=cid, planId=plan, email=f"{first}@{'member' if not cid else cid.lower()}.example",
                                 phone="+971 55 000 " + mid[-4:], cardNo=card, status="active", start=M(-6, 3), address="Dubai, UAE"), t)
    m18 = next(m for m in db["members"] if m["id"] == "M-0018")
    m18.update(status="ended", end=M(-1, 28))
    # ------------------------------------------------ contracts (Ejari-ready fields filled for offices)
    def ct(cid, party, codes, title, fee, start, end, deposit=0, notice=60, addons=None, status="active", member=False, ejari=False):
        rec = dict(id=cid, title=title, spaceIds=["SP-" + c.replace("-", "") if not c.startswith(("MR", "EV", "VO")) else S_BY[c]["id"] for c in codes],
                   monthlyFee=fee, start=start, end=end, deposit=deposit, noticeDays=notice, addons=addons or [], status=status, termMonths=12,
                   depositStatus="received" if deposit else "not_due")
        rec["spaceIds"] = [S_BY[c]["id"] for c in codes]
        rec["memberId" if member else "companyId"] = party
        if ejari:
            rec.update(ejari=dict(contractNo="", unitNo=codes[0], plotNo="000-000 (demo)", makani="00000 00000 (demo)", dewaPremise="000000000 (demo)",
                                  landlordName=cfg["legalName"], propertyUsage="Commercial – office", annualRent=R.r2(fee * 12)))
        return rec
    contracts = [
        ct("CT-A", "CO-001", ["PO-101"], "Private office", 4500, M(-6, 1), D(330), 9000, 60, [dict(name="Parking bay P-01", qty=1, price=350)], ejari=True),
        ct("CT-B", "CO-002", ["PO-102"], "Private office", 6200, M(-6, 1), D(40), 12400, 60, ejari=True),
        ct("CT-C", "CO-003", ["PO-103"], "Private office", 7800, M(-5, 1), D(200), 15600, 90, [dict(name="Call answering", qty=1, price=250)], ejari=True),
        ct("CT-D", "CO-004", ["PO-105"], "Private office", 11500, M(-4, 15), D(260), 23000, 90, ejari=True),
        ct("CT-E", "CO-005", ["DD-01", "DD-02"], "Dedicated desks ×2", 2900, M(-6, 1), D(150), 2900, 30),
        ct("CT-F", "CO-006", ["VO-ADDR"], "Virtual office – business address", 750, M(-6, 1), D(180), 0, 30, [dict(name="Call answering", qty=1, price=250)]),
        ct("CT-G", "CO-007", ["VO-ADDR"], "Virtual office – business address", 750, M(-3, 10), D(250), 0, 30),
        ct("CT-H", "M-0013", ["HD-01"], "Hot desk membership", 950, M(-6, 1), D(90), 0, 30, member=True),
        ct("CT-I", "M-0014", ["HD-02"], "Hot desk membership", 950, M(-2, 12), D(120), 0, 30, member=True),
        ct("CT-J", "M-0015", ["HD-03"], "Hot desk membership", 950, M(0, 8), D(300), 0, 30, member=True),
        ct("CT-K", "CO-008", ["PO-104"], "Private office", 8200, M(-6, 1), D(20), 16400, 60, ejari=True),
        ct("CT-L", "M-0018", ["HD-04"], "Hot desk membership", 950, M(-6, 1), M(-1, 28), 0, 30, member=True),
        ct("CT-M", "M-0017", ["L-01"], "Locker", 100, D(7), D(372), 0, 30, member=True, status="draft"),
    ]
    contracts[1]["status"] = "notice"
    for c in contracts:
        _put(db, "contracts", c, t)
    for code in ("PO-101", "PO-102", "PO-103", "PO-105", "PO-104", "DD-01", "DD-02", "P-01"):
        S_BY[code]["status"] = "occupied"
    S_BY["PO-107"]["status"] = "reserved"
    # ------------------------------------------------ invoice history: real billing runs, issued, mostly paid
    rcpt_n = 0
    for k in range(-5, 1):
        period = M(k)
        invs, charges, _ = R.billing_run(db, period, period, cfg)
        for i, inv in enumerate(invs):
            inv["id"] = f"INV-S{k+6}{i+1:02d}"
            inv["status"] = "issued"
            for ln in inv["lines"]:
                if ln.get("chargeId"):
                    ch = next(x for x in db["charges"] if x["id"] == ln["chargeId"]); ch["invoiceId"] = inv["id"]
            _put(db, "invoices", inv, period)
            inv = next(x for x in db["invoices"] if x["id"] == inv["id"])
            unpaid = (k == 0 and inv.get("companyId") in ("CO-002", "CO-004", "CO-008")) or (k == -1 and inv.get("companyId") == "CO-008") \
                or (k == -2 and inv.get("companyId") == "CO-008") or (k == 0 and inv.get("memberId") == "M-0014")
            if not unpaid:
                rcpt_n += 1
                amt = inv["total"] if not (k == 0 and inv.get("companyId") == "CO-003") else R.r2(inv["total"] / 2)
                _put(db, "receipts", dict(id=f"RCT-S{rcpt_n:03d}", invoiceId=inv["id"], amount=amt,
                                          method=["bank_transfer", "card", "cheque", "payment_link"][rcpt_n % 4],
                                          date=min(t, R.add_days(inv["date"], 3 + rcpt_n % 9)), ref=f"DEMO-{rcpt_n:04d}"), t)
    for c in db["contracts"]:
        if c["id"] == "CT-L":
            c["status"] = "ended"
    # a credit note on one older invoice
    inv_cn = next(x for x in db["invoices"] if x.get("companyId") == "CO-008" and x["status"] != "paid")
    _put(db, "creditnotes", dict(id="CN-S001", invoiceId=inv_cn["id"], reason="Air-conditioning outage – 2 days goodwill credit (demo)",
                                 date=R.add_days(inv_cn["date"], 6), lines=[dict(desc="Goodwill credit: 2 days office use", qty=1, price=R.r2(8200 * 2 / 30), vat=5)]), t)
    # ------------------------------------------------ bookings around today (credits + pay-as-you-go)
    slots = [(-6, "MR-MAJ", "M-0001", "09:00", "11:00", "Client pitch"), (-5, "MR-DHOW", "M-0009", "14:00", "15:00", "1:1"),
             (-4, "MR-BRD", "M-0005", "10:00", "13:00", "Board meeting"), (-3, "MR-FAL", "M-0007", "15:00", "17:00", "Supplier review"),
             (-2, "MR-DHOW", "M-0013", "11:00", "12:00", "Interview"), (-1, "MR-MAJ", "M-0003", "16:00", "18:00", "Design review"),
             (0, "MR-DHOW", "M-0001", "09:00", "10:00", "Stand-up"), (0, "MR-MAJ", "M-0005", "10:30", "12:00", "Client call"),
             (0, "MR-FAL", "M-0007", "13:00", "15:00", "Training"), (0, "MR-BRD", "M-0016", "15:30", "17:30", "Quarterly review"),
             (0, "MR-DHOW", "M-0014", "14:00", "16:00", "Workshop"), (1, "MR-MAJ", "M-0002", "09:30", "11:00", "Sprint planning"),
             (1, "MR-DHOW", "M-0010", "12:00", "13:00", "Investor call"), (1, "EV-ATR", "M-0004", "18:00", "21:00", "Product launch (demo)"),
             (2, "MR-FAL", "M-0006", "10:00", "12:00", "Legal workshop"), (2, "MR-BRD", "M-0008", "14:00", "16:00", "Partner meeting"),
             (3, "MR-DHOW", "M-0015", "09:00", "10:00", "Coaching"), (4, "MR-MAJ", "M-0001", "13:00", "14:30", "Customer demo"),
             (5, "MR-FAL", "M-0003", "11:00", "13:00", "Team offsite prep"), (7, "MR-BRD", "M-0005", "09:00", "12:00", "Arbitration prep")]
    for i, (dd, code, mid, a, b, title) in enumerate(slots):
        _put(db, "bookings", dict(id=f"BK-S{i+1:03d}", spaceId=S_BY[code]["id"], memberId=mid, start=f"{D(dd)}T{a}", end=f"{D(dd)}T{b}", title=title,
                                  attendees=min(int(S_BY[code]["capacity"]), 2 + i % 5), status="confirmed"), t)
    for b in db["bookings"]:
        if b["start"][:10] < t:
            b["status"] = "checked_in"
    # add-on charges (printing, coffee, parking) not yet invoiced
    for i, (mid, cid, pid, qty) in enumerate([("M-0001", "CO-001", "PR-PRCL", 40), ("M-0003", "CO-002", "PR-COF", 6), ("M-0013", "", "PR-PRBW", 120),
                                              ("M-0007", "CO-004", "PR-CAT", 10), ("M-0014", "", "PR-PARKD", 3), ("M-0011", "CO-006", "PR-MAILSC", 4)]):
        p = next(x for x in db["products"] if x["id"] == pid)
        _put(db, "charges", dict(id=f"CHG-S{i+1:02d}", memberId=mid if not cid else "", companyId=cid, desc=p["name"], productId=pid, qty=qty, price=p["price"],
                                 date=D(-(i % 5) - 1)), t)
    # ------------------------------------------------ CRM
    leads = [("LD-01", "Omar Faris", "Faris Robotics", "new", "private_office", 6000, "Website"), ("LD-02", "Julia Santos", "Santos Media", "contacted", "dedicated_desk", 3000, "Referral"),
             ("LD-03", "Ahmed Saleh", "Saleh Engineering", "tour", "private_office", 9000, "Walk-in"), ("LD-04", "Chloe Martin", "", "tour", "hot_desk", 950, "Instagram"),
             ("LD-05", "Vikram Rao", "Rao Capital", "proposal", "private_office", 12000, "Broker"), ("LD-06", "Sofia Rossi", "Rossi Imports", "negotiation", "virtual_office", 750, "Google"),
             ("LD-07", "Hassan Ali", "Ali & Sons", "proposal", "event_space", 3000, "Website"), ("LD-08", "Emma Clarke", "Clarke Studio", "lost", "dedicated_desk", 1450, "Website"),
             ("LD-09", "Nadia Aziz", "Aziz Health", "new", "virtual_office", 750, "Referral"), ("LD-10", "Peter Lang", "Lang GmbH (demo)", "contacted", "private_office", 7800, "Broker")]
    for i, (lid, nm, comp, stage, interest, budget, src) in enumerate(leads):
        _put(db, "leads", dict(id=lid, name=nm, company=comp, stage=stage, interest=interest, budget=budget, source=src, owner="community",
                               email=f"{nm.split()[0].lower()}@lead.example", phone=f"+971 52 000 {i+1:04d}", created=D(-30 + i * 3),
                               notes="Fictional demo lead" + (" · lost to a cheaper option" if stage == "lost" else "")), t)
    for i, (lid, dd, hm, st) in enumerate([("LD-03", 1, "11:00", "booked"), ("LD-04", 0, "16:00", "booked"), ("LD-05", -3, "10:00", "done"), ("LD-10", 3, "12:30", "booked")]):
        _put(db, "tours", dict(id=f"TR-S{i+1}", leadId=lid, when=f"{D(dd)}T{hm}", status=st, staff="community", notes=""), t)
    _put(db, "quotes", dict(id="Q-S1", leadId="LD-05", date=D(-2), status="sent", validUntil=D(12), notes="12-month term, 2 parking bays",
                            lines=[dict(desc="Private office 106 (8 seats) – monthly", qty=1, price=15500), dict(desc="Parking bay – monthly", qty=2, price=350)]), t)
    _put(db, "quotes", dict(id="Q-S2", leadId="LD-06", date=D(-5), status="sent", validUntil=D(9),
                            lines=[dict(desc="Virtual office – business address (12 months)", qty=12, price=750), dict(desc="Call answering – monthly", qty=12, price=250)]), t)
    _put(db, "quotes", dict(id="Q-S3", leadId="LD-07", date=D(-1), status="draft", validUntil=D(13),
                            lines=[dict(desc="Atrium event space – 4 hours", qty=4, price=750), dict(desc="Catering per person", qty=50, price=25)]), t)
    # ------------------------------------------------ virtual office
    for i, (cid, lic, frm) in enumerate([("CO-006", "DED-600606", M(-6, 1)), ("CO-007", "DED-700707", M(-3, 10)), ("CO-005", "FZ-500505", M(-6, 1))]):
        _put(db, "addressuse", dict(id=f"AU-S{i+1}", companyId=cid, licenceNo=lic, authority="Dubai DET (demo)" if lic.startswith("DED") else "Free zone authority (demo)",
                                    addressText="Office 1201, Demo Tower, Business Bay, Dubai", **{"from": frm}, to="", status="active", nocIssued=frm), t)
    mail = [("CO-006", "letter", "Demo Bank PJSC", "notified", -1), ("CO-006", "parcel", "Courier Co. (demo)", "received", 0), ("CO-007", "registered", "Government office (demo)", "collected", -4),
            ("CO-001", "courier", "Supplier LLC (demo)", "received", 0), ("CO-003", "letter", "Court registry (demo)", "scanned", -2), ("CO-007", "letter", "Insurance Co. (demo)", "forwarded", -6),
            ("CO-004", "parcel", "Online store (demo)", "received", -1), ("CO-002", "letter", "Utility Co. (demo)", "collected", -3)]
    for i, (cid, typ, sender, st, dd) in enumerate(mail):
        _put(db, "mail", dict(id=f"ML-S{i+1}", companyId=cid, type=typ, sender=sender, status=st, received=D(dd), tracking=f"TRK{i+1:05d}", notes=""), t)
    calls = [("CO-006", "Mr. Karim (demo)", "+971 50 111 0001", "Asked for a callback about the quotation", "new", 0),
             ("CO-007", "Ms. Joseph (demo)", "+971 50 111 0002", "Wants to confirm the visa appointment time", "passed_on", -1),
             ("CO-006", "Supplier desk (demo)", "+971 4 111 0003", "Delivery rescheduled to Thursday", "closed", -2),
             ("CO-007", "Bank relationship desk (demo)", "+971 4 111 0004", "Please call back before 3 pm", "new", 0)]
    for i, (cid, caller, phone, msg, st, dd) in enumerate(calls):
        _put(db, "calls", dict(id=f"CL-S{i+1}", companyId=cid, caller=caller, phone=phone, message=msg, status=st, when=f"{D(dd)}T{10+i:02d}:15"), t)
    # ------------------------------------------------ front desk
    vis = [("Rashid Karim", "M-0001", "expected", 0, ""), ("Anna Weber", "M-0005", "checked_in", 0, "09:40"), ("Li Wei", "M-0007", "checked_out", -1, "11:05"),
           ("Sanjay Patel", "M-0003", "expected", 1, ""), ("Maryam Yousef", "M-0016", "expected", 0, "")]
    for i, (nm, host, st, dd, tin) in enumerate(vis):
        _put(db, "visitors", dict(id=f"VS-S{i+1}", name=nm, hostId=host, company="Guest company (demo)", date=D(dd), status=st, inAt=tin,
                                  outAt="12:30" if st == "checked_out" else "", purpose="Meeting", phone=f"+971 56 000 {i+1:04d}"), t)
    for i, mid in enumerate(["M-0001", "M-0002", "M-0005", "M-0007", "M-0009", "M-0013", "M-0014", "M-0016"]):
        _put(db, "checkins", dict(id=f"CHK-S{i+1}", memberId=mid, date=t, time=f"0{8 + i // 4}:{(i * 7) % 60:02d}", via="card" if i % 2 else "front_desk"), t)
    for k in range(1, 6):
        for i, mid in enumerate(["M-0001", "M-0003", "M-0005", "M-0009", "M-0013"][: 5 - k % 3]):
            _put(db, "checkins", dict(id=f"CHK-H{k}{i}", memberId=mid, date=D(-k), time=f"08:{10 + i * 9:02d}", via="card"), t)
    acc = [("C-1001", "Main entrance", "granted", "08:05"), ("C-1005", "Main entrance", "granted", "08:20"), ("C-9999", "Main entrance", "denied", "08:31"),
           ("C-1009", "Floor 12 coworking", "granted", "08:45"), ("C-1018", "Main entrance", "denied", "09:02"), ("C-1007", "Floor 14 offices", "granted", "09:10")]
    for i, (card, door, res, hm) in enumerate(acc):
        m = next((x for x in db["members"] if x.get("cardNo") == card), None)
        _put(db, "access", dict(id=f"ACC-S{i+1}", cardNo=card, memberId=(m or {}).get("id", ""), door=door, result=res, at=f"{t}T{hm}", simulated=True,
                                reason="" if res == "granted" else ("Unknown card" if not m else "Membership not active")), t)
    # ------------------------------------------------ helpdesk
    tk = [("Air-conditioning too cold in PO-103", "maintenance", "high", "in_progress", "M-0005", -2), ("Wi-Fi drops in the Falcon room", "it", "normal", "open", "M-0007", -1),
          ("Need extra key card", "access", "low", "resolved", "M-0002", -5), ("Coffee machine on floor 12 not working", "maintenance", "normal", "open", "M-0013", 0),
          ("Invoice address change", "billing", "normal", "waiting", "M-0003", -3), ("Deep clean after event", "cleaning", "normal", "open", "", 0),
          ("Desk lamp broken at DD-02", "maintenance", "low", "closed", "M-0010", -9)]
    for i, (sub, cat, pr, st, mid, dd) in enumerate(tk):
        _put(db, "tickets", dict(id=f"TK-S{i+1}", subject=sub, category=cat, priority=pr, status=st, memberId=mid, opened=D(dd), assignee="frontdesk" if cat != "billing" else "finance",
                                 comments=[dict(by="frontdesk", at=D(dd), text="Logged, thank you.")] if st != "open" else []), t)
    _put(db, "outbox", dict(id="OUT-S1", to="accounts@bluewave.example", subject="Welcome to Skyline Hub (demo)", body="Simulated email - nothing is sent.", status="sent_simulated", date=D(-6), kind="welcome"), t)
    return db
