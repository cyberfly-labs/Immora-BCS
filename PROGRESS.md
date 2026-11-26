# Immora BCS — build progress (resume notes)

Brief: Immora BCS (Business Centre System) for coworking / office rental centres (UAE). Same architecture as Immora HIS 1.2:
Flask + SQLite server edition and offline single-file HTML (IndexedDB) built from one front-end in web/src by web/build.py.
Rules: Immora logo only on login, small sidebar mark, "Powered by Immora" — never on invoices/prints. DD-MM-YYYY. Prices placeholders.
No testimonials/stats/approval claims. Fictional demo data. Contact no one, deploy nothing.
Logins: admin/admin123, frontdesk/frontdesk123, community/community123, finance/finance123, viewer/viewer123, portal member/member123.

## Milestones
- [x] M0 (24-11-2026 ~21:45 ACDT) project skeleton, venv (.venv: flask pytest pillow), logo marks (tools/make_logo.py), QR lib vendored (qrcode-generator MIT)
- [x] M1 (24-11 ~22:15 ACDT) Python core: immora_bcs/{rules,store,actions,api,seed,__init__}.py, app.py
- [x] M2 (24-11 ~23:00 ACDT) front-end web/src/*.js + theme.css, web/build.py builds static/ + Immora-BCS.html (syntax OK)
- [x] M3 (24-11 ~22:25 ACDT; earlier M1/M2 times were estimates) smoke test tests/e2e/smoke.mjs: 243/243 chromium server+offline; locales starter packs (tools/locale_starter.txt -> tools/make_locales.py); fixes: tourList clash, pipelineMini, negative bars, RTL calendar, phone lang in user menu, invoice date=max(periodStart,today)
  - next: tests/e2e/flows.mjs (business flows), screens.mjs (screenshots), then pytest
- [x] M4a (24-11 ~22:40 ACDT) pytest 25 passed (tests/test_api.py, test_rules.py, test_parity.py JS==Python, test_manage.py); manage.py, requirements, run.sh, .bat (CRLF), .command, README, .gitignore written; flows.mjs fixes (space ids SP-*, slot end capped 22:00)
  - running: tests/e2e/run-all.sh (logs/e2e-summary.log)
- [x] M4 (24-11 ~22:50 ACDT) locales 339 strings x4; screenshots/01..10 retaken; contract page polish (add-on inputs, 1:2 grid); e2e 3 engines x 2 editions all green (intermittent booking-step timing flake in server mode fixed in flows.mjs by waiting for the modal to close; reruns green)
- [x] M5 zips via tools/make_zips.py: /workspace/Immora-BCS.zip (3.4 MB) + /workspace/Immora-BCS-app.zip (1.4 MB), verified; final e2e re-run logs/e2e-summary.log; ready-queue line appended
