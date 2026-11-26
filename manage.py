#!/usr/bin/env python3
"""Immora BCS admin commands (server edition).

    python manage.py init-empty   --admin USER   start a real centre: no demo data, one admin login (asks for a password)
    python manage.py reset-demo                   wipe the database and load the fictional demo centre again
    python manage.py create-user USER ROLE "Full name"   roles: admin frontdesk community finance viewer
    python manage.py set-password USER

The database lives in ./data (or IMMORA_DATA_DIR). Back it up by copying that folder while the server is stopped,
or use Administration → Backup & restore in the app.
"""
import argparse
import getpass
import os
import sys

os.environ.setdefault("IMMORA_NO_DEMO", "1")  # importing app must not auto-load the demo here
from immora_bcs import rules as R, store as S  # noqa: E402


def ask_password():
    while True:
        a = getpass.getpass("New password (8+ characters): ")
        p = S.password_problem(a)
        if p:
            print(p); continue
        if getpass.getpass("Repeat: ") != a:
            print("Passwords differ."); continue
        return a


def wipe():
    S.init()
    with S.connect() as c:
        for t in ("records", "counters", "users", "audit"):
            c.execute(f"DELETE FROM {t}")


def main():
    ap = argparse.ArgumentParser(description="Immora BCS admin commands")
    sub = ap.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("init-empty"); a.add_argument("--admin", default="admin"); a.add_argument("--country", default="AE", choices=sorted(R.COUNTRY_PRESETS))
    a.add_argument("--yes", action="store_true", help="do not ask before wiping")
    sub.add_parser("reset-demo").add_argument("--yes", action="store_true")
    u = sub.add_parser("create-user"); u.add_argument("username"); u.add_argument("role", choices=R.ROLES); u.add_argument("name")
    p = sub.add_parser("set-password"); p.add_argument("username")
    x = ap.parse_args()
    S.init()
    if x.cmd in ("init-empty", "reset-demo") and not x.yes:
        if input(f"This deletes everything in {S.db_path()}. Type YES to continue: ") != "YES":
            sys.exit("Cancelled.")
    if x.cmd == "init-empty":
        pw = ask_password()
        wipe()
        with S.connect() as c:
            cfg = dict(R.COUNTRY_PRESETS[x.country], id="centre", legalName="Your Company LLC", tradeName="Your Business Centre", address="", trn="",
                       paymentTermsDays=14, openFrom="08:00", openTo="20:00", invoicePrefix="INV", lang="en", demo=False)
            S.raw_put(c, "cfg", cfg)
            c.execute("INSERT INTO users(username, name, role, hash, active, memberId) VALUES(?,?,?,?,1,'')", (x.admin.lower(), "Administrator", "admin", S.hash_password(pw)))
            S.audit(c, None, "init_empty")
        print(f"Empty centre ready. Sign in as {x.admin.lower()} and fill in Administration → Centre settings first.")
    elif x.cmd == "reset-demo":
        wipe()
        import app  # noqa: F401  (IMMORA_NO_DEMO=1 so nothing loads on import)
        with S.connect() as c:
            app.load_demo(c)
        print("Demo centre loaded (fictional data).")
    elif x.cmd == "create-user":
        pw = ask_password()
        with S.connect() as c:
            c.execute("INSERT OR REPLACE INTO users(username, name, role, hash, active, memberId) VALUES(?,?,?,?,1,'')", (x.username.lower(), x.name, x.role, S.hash_password(pw)))
        print("User saved.")
    elif x.cmd == "set-password":
        pw = ask_password()
        with S.connect() as c:
            n = c.execute("UPDATE users SET hash=?, failed=0, lockedUntil='' WHERE username=?", (S.hash_password(pw), x.username.lower())).rowcount
        print("Password changed." if n else "No such user.")


if __name__ == "__main__":
    main()
