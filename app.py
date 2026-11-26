#!/usr/bin/env python3
"""Immora BCS — server edition entry point.

    python app.py            # http://127.0.0.1:5080  (SQLite in ./data)
    ./run.sh --lan           # other PCs on the office network can open http://<this-computer>:5080

Environment:
    IMMORA_DATA_DIR        where the SQLite database and secret key live (default ./data)
    HOST / PORT            bind address (default 127.0.0.1 / 5080)
    IMMORA_NO_DEMO=1       start empty (no fictional demo data): see manage.py
    IMMORA_BEHIND_PROXY=1  behind nginx / a hosting proxy with HTTPS (secure cookies)
"""
import os

from immora_bcs import create_app, store as S
from immora_bcs.seed import DEMO_USERS, generate

app = create_app()


def first_run():
    with S.connect() as c:
        if S.has_data(c):
            return
        if os.environ.get("IMMORA_NO_DEMO") == "1":
            return
        load_demo(c)
        print("Empty database: loaded the fictional demo centre. Demo logins: admin/admin123, frontdesk/frontdesk123, "
              "community/community123, finance/finance123, viewer/viewer123; member portal member/member123.")


def load_demo(c, today=None):
    from immora_bcs.api import today_hm
    t = today or today_hm(c)[0]
    db = generate(t)
    c.execute("BEGIN IMMEDIATE")
    for coll, lst in db.items():
        for r in lst:
            S.raw_put(c, coll, r)
    for un, pw, name, role, mid in DEMO_USERS:
        c.execute("INSERT OR REPLACE INTO users(username, name, role, hash, active, memberId) VALUES(?,?,?,?,1,?)",
                  (un, name, role, S.hash_password(pw, 60_000), mid))
    c.execute("COMMIT")
    S.audit(c, None, "demo_loaded", summary="Fictional demo data")


first_run()

if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "5080"))
    print(f"Immora BCS on http://{'localhost' if host in ('127.0.0.1', '0.0.0.0') else host}:{port}  (Ctrl+C to stop)")
    try:
        from waitress import serve
        serve(app, host=host, port=port, threads=8)
    except ImportError:
        app.run(host=host, port=port, debug=False, threaded=True)
