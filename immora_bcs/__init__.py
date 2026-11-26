"""Immora BCS — Business Centre System (server edition)."""
import os
import secrets

from flask import Flask, jsonify, send_from_directory

VERSION = "1.0.0"


def secret_key():
    env_key = os.environ.get("IMMORA_SECRET_KEY") or os.environ.get("SECRET_KEY")
    if env_key:
        return env_key.strip()
    from .store import data_dir
    p = os.path.join(data_dir(), "secret_key")
    if not os.path.exists(p):
        with open(p, "w") as f:
            f.write(secrets.token_hex(32))
        try:
            os.chmod(p, 0o600)
        except OSError:
            pass
    with open(p) as f:
        return f.read().strip()


def create_app():
    from . import store, api
    store.init()
    here = os.path.dirname(os.path.abspath(__file__))
    app = Flask(__name__, static_folder=os.path.join(here, "static"), static_url_path="/static")
    app.secret_key = secret_key()
    behind_proxy = os.environ.get("IMMORA_BEHIND_PROXY") == "1" or bool(os.environ.get("VERCEL"))
    app.config.update(SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE="Lax", SESSION_COOKIE_SECURE=behind_proxy or bool(os.environ.get("IMMORA_TLS_CERT")),
                      PERMANENT_SESSION_LIFETIME=12 * 3600, MAX_CONTENT_LENGTH=25 * 1024 * 1024, JSON_SORT_KEYS=False)
    if behind_proxy:
        from werkzeug.middleware.proxy_fix import ProxyFix
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
    app.register_blueprint(api.bp)

    @app.get("/")
    def index():
        r = send_from_directory(app.static_folder, "index.html")
        r.headers["Cache-Control"] = "no-store"
        return r

    @app.get("/healthz")
    def healthz():
        return jsonify(ok=True, app="Immora BCS", version=VERSION)

    @app.after_request
    def headers(r):
        r.headers.setdefault("X-Content-Type-Options", "nosniff")
        r.headers.setdefault("X-Frame-Options", "DENY")
        r.headers.setdefault("Referrer-Policy", "same-origin")
        r.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        r.headers.setdefault("Content-Security-Policy", "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; "
                                                        "font-src 'self' data:; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
        return r
    return app
