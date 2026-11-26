# Immora BCS — Business Centre System (v1.0.0)

Software for coworking spaces, business centres and office-rental operators: desks, private offices, meeting rooms,
virtual offices, member contracts, recurring billing and tax invoices — designed to support UAE practice (AED, 5% VAT, TRN,
FTA tax-invoice fields, Ejari-ready contract fields) with country presets for other markets.

> Demo data is fictional. Prices shown are example placeholders. Nothing here is deployed or connected to any outside service.

## Two editions, one app
| Edition | How to start | Data |
|---|---|---|
| **Offline** (single file) | Open `Immora-BCS.html` in Chrome, Edge, Firefox or Safari | Stays in that browser (IndexedDB) on that computer |
| **Server** (multi-user) | Windows: double-click `Start Immora BCS (Windows).bat` · Mac: `Start Immora BCS.command` · Linux: `./run.sh` (add `--lan` for the office network) | SQLite in `./data` (or `IMMORA_DATA_DIR`) |

The server edition needs Python 3.10+ (first start installs Flask/tzdata/waitress, internet needed once) and opens on http://localhost:5080.

## Demo logins
| Role | Login | Home screen |
|---|---|---|
| Administrator | `admin` / `admin123` | centre KPIs, everything |
| Front desk | `frontdesk` / `frontdesk123` | visitors, check-in, mail, calls, card taps, room bookings |
| Community manager | `community` / `community123` | members, leads pipeline, tours, quotes, contracts, renewals |
| Finance | `finance` / `finance123` | invoices, billing run, receipts, credit notes, overdue, Immora Books export |
| Viewer | `viewer` / `viewer123` | read-only |
| Member portal (tab "Member portal") | `member` / `member123` | demo member M-0001 Aisha Rahman: book rooms, invoices, requests, guests, mail |

For a real centre: `python manage.py init-empty --admin youradmin` (no demo data, asks for a password), then fill in
Administration → Centre settings (legal name, address, TRN, licence, bank, logo/stamp). Other commands: `reset-demo`, `create-user`, `set-password`.

## Features
- **Spaces** — interactive floor plan per floor (drag to rearrange), inventory of hot desks, dedicated desks, private offices,
  meeting rooms, event spaces, virtual-office plans, parking and lockers; live status; plans and add-ons with example prices.
- **Bookings** — visual day/week room calendar, click a slot to book, clash checks, meeting-room credits per plan per month, extra
  hours charged automatically at the room's hourly price.
- **CRM** — members and companies, lead pipeline (kanban), tours, quotes (print/PDF), convert lead → member.
- **Contracts & leases** — Ejari-ready fields (labelled; the app does not connect to or register with Ejari), deposits, add-ons, notice
  periods, renewal with price change, notice reminders, end/renew workflow.
- **Virtual office** — business-address use records (trade-licence address), mail-handling log with member notification (simulated
  outbox), call-answering notes.
- **Billing** — monthly billing run with day-based proration, add-ons and pending charges (printing, coffee, parking, catering,
  extra room hours); FTA-style tax invoices (title "Tax Invoice", supplier legal name, address, TRN, number, date, customer TRN,
  VAT per line, totals, QR); issued invoices locked; credit notes; receipts; payment-link placeholder; overdue reminders at 1/14/30 days;
  CSV/JSON export for Immora Books.
- **Front desk** — visitor registration with QR badges (simulated), member check-in, simulated access-card tap log.
- **Member portal** — book rooms with credits, view/print invoices, raise requests, invite guests, see mail.
- **Helpdesk** — maintenance/IT/cleaning tickets with updates.
- **Reports** — occupancy, revenue, churn, aged receivables, room use, with charts and CSV export.
- **Ease of use** — role home screens with one-click actions, Ctrl+K search/jump, guided tour per role, inline validation,
  light/dark mode, tablet and phone layouts, collapsible sidebar groups, DD-MM-YYYY dates.
- **Languages** — English (default); Arabic (right-to-left), French, Hindi, Urdu starter packs (`web/locales/`, built from
  `tools/locale_starter.txt`). Untranslated text stays in English; have native speakers review before client use.
- **Country presets** — UAE (default: AED, 5% VAT, 15-digit TRN), Saudi Arabia, Bahrain, Oman, UK, India, International.
- **Security (server)** — PBKDF2 password hashes, 5-try lockout, role checks on the server for every change, CSRF header,
  strict Content-Security-Policy, optimistic locking, audit trail, JSON backup/restore (admin).

## Branding
The Immora mark appears only on the sign-in screen, as a small sidebar mark and in the "Powered by Immora" line.
Invoices, receipts, credit notes, quotes, contracts and badges print only the centre's own details.

## Limits (honest list)
- Not FTA-accredited tax accounting software and not connected to the FTA, an e-invoicing provider (ASP) or Peppol.
- Ejari fields are for record-keeping only; no Ejari/DLD connection.
- Payment links, email/SMS notifications, QR badge scanning and access-card hardware are simulated or placeholders.
- The Windows `.bat` launcher has not yet been run on a physical Windows PC.

## Developers
- Front-end sources: `web/src/*.js`, `web/src/theme.css` → `python web/build.py` builds `immora_bcs/static/` (server) and
  `Immora-BCS.html` (offline). Business rules live twice — `immora_bcs/rules.py` and `web/src/02-rules.js` — and
  `tests/test_parity.py` checks both give identical results.
- Tests: `.venv/bin/python -m pytest` (API, rules, parity, manage) and `tests/e2e/run-all.sh` (Playwright: Chromium, WebKit,
  Firefox × server/offline; logs in `logs/`).
- Behind a reverse proxy with HTTPS set `IMMORA_BEHIND_PROXY=1`.

© Immora Soft · md@primeaxis.pro
