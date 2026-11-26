#!/usr/bin/env python3
"""Build both Immora BCS front-ends from web/src.

  server  -> immora_bcs/static/index.html, app.js, app.css  (external files: strict CSP script-src 'self')
  offline -> Immora-BCS.html  (one file, everything inline, data kept in the browser's IndexedDB)
"""
import base64
import hashlib
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(HERE, "src")
sys.path.insert(0, ROOT)
from immora_bcs import VERSION, rules  # noqa: E402
from immora_bcs.seed import DEMO_USERS, generate  # noqa: E402

SEED_BASE = "2026-11-24"


def read(*p):
    with open(os.path.join(*p), encoding="utf-8") as f:
        return f.read()


def b64(path, mime):
    with open(path, "rb") as f:
        return f"data:{mime};base64," + base64.b64encode(f.read()).decode()


def css():
    fonts = os.path.join(HERE, "assets", "fonts")
    s = read(SRC, "theme.css")
    for k, n in (("FONT_INTER", "inter.woff2"), ("FONT_ARABIC", "noto-arabic.woff2"), ("FONT_DEVANAGARI", "noto-devanagari.woff2")):
        s = s.replace("{{%s}}" % k, b64(os.path.join(fonts, n), "font/woff2"))
    return s


def locales():
    out = {}
    d = os.path.join(HERE, "locales")
    for n in sorted(os.listdir(d)):
        if n.endswith(".json"):
            p = json.loads(read(d, n))
            code = p.pop("_meta")["code"]
            out[code] = p
    return out


def offline_users():
    out = []
    for un, pw, name, role, mid in DEMO_USERS:
        salt = hashlib.sha256(("immora-bcs-demo-" + un).encode()).digest()[:16]
        dk = hashlib.pbkdf2_hmac("sha256", pw.encode(), salt, 60000, 32)
        out.append(dict(username=un, name=name, role=role, memberId=mid, active=True,
                        hash=f"pbkdf2_sha256$60000${base64.b64encode(salt).decode()}${base64.b64encode(dk).decode()}"))
    return out


def bundle(mode):
    a = os.path.join(HERE, "assets")
    head = [f"/* Immora BCS {VERSION} — {mode} edition. Built from web/src by web/build.py. */",
            f"const BUILD_MODE = {json.dumps(mode)}; const APP_VERSION = {json.dumps(VERSION)};",
            f"const IMMORA_LOGO = {json.dumps({'icon': b64(os.path.join(a, 'icon-256.jpg'), 'image/jpeg'), 'mark': b64(os.path.join(a, 'mark-128.jpg'), 'image/jpeg')})};",
            f"const SHARED = {json.dumps(rules.shared(), ensure_ascii=False)};",
            f"const LOCALE_PACKS = {json.dumps(locales(), ensure_ascii=False)};"]
    if mode == "offline":
        head += [f"const SEED_BASE = {json.dumps(SEED_BASE)};", f"const SEED = {json.dumps(generate(SEED_BASE), ensure_ascii=False, separators=(',', ':'))};",
                 f"const DEMO_USERS = {json.dumps(offline_users())};"]
    else:
        head += ["const SEED_BASE = null, SEED = null, DEMO_USERS = [];"]
    parts = ["\n".join(head), "/* ===== vendor/qrcode.js (MIT, Kazuhiko Arase) ===== */\n" + read(HERE, "vendor", "qrcode.js")]
    for n in sorted(os.listdir(SRC)):
        if n.endswith(".js"):
            parts.append(f"/* ===== {n} ===== */\n" + read(SRC, n))
    return "\n".join(parts)


HTML = """<!doctype html>
<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Immora BCS</title><meta name="color-scheme" content="light dark"><link rel="icon" href="{icon}">{style}</head>
<body><div id="app"><p style="padding:40px;font-family:sans-serif">Loading Immora BCS…</p></div>{script}</body></html>
"""


def main():
    static = os.path.join(ROOT, "immora_bcs", "static")
    os.makedirs(static, exist_ok=True)
    icon = b64(os.path.join(HERE, "assets", "mark-128.jpg"), "image/jpeg")
    c = css()
    with open(os.path.join(static, "app.css"), "w", encoding="utf-8") as f:
        f.write(c)
    with open(os.path.join(static, "app.js"), "w", encoding="utf-8") as f:
        f.write(bundle("server"))
    with open(os.path.join(static, "index.html"), "w", encoding="utf-8") as f:
        f.write(HTML.format(icon="static/favicon.jpg", style='<link rel="stylesheet" href="static/app.css">', script='<script src="static/app.js"></script>'))
    with open(os.path.join(HERE, "assets", "mark-128.jpg"), "rb") as s, open(os.path.join(static, "favicon.jpg"), "wb") as d:
        d.write(s.read())
    js = bundle("offline").replace("</script", "<\\/script")
    with open(os.path.join(ROOT, "Immora-BCS.html"), "w", encoding="utf-8") as f:
        f.write(HTML.format(icon=icon, style=f"<style>{c}</style>", script=f"<script>{js}</script>"))
    print("built: immora_bcs/static/{index.html,app.js,app.css}, Immora-BCS.html",
          f"({os.path.getsize(os.path.join(ROOT, 'Immora-BCS.html')) // 1024} KB)")


if __name__ == "__main__":
    main()
