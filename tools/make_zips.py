#!/usr/bin/env python3
"""Build /workspace/Immora-BCS.zip (full) and /workspace/Immora-BCS-app.zip (no screenshots/tests) and verify them."""
import os, shutil, tempfile, zipfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_IGN = [".venv", "data", "__pycache__", "*.db", "*.db-*", "secret_key", ".env", "node_modules", ".pytest_cache", "logs", "*.pyc"]
BAD = (".db", "secret_key", ".env")


def build(out, extra):
    tmp = tempfile.mkdtemp()
    dst = os.path.join(tmp, "Immora-BCS")
    shutil.copytree(ROOT, dst, ignore=shutil.ignore_patterns(*(BASE_IGN + extra)))
    if os.path.exists(out): os.remove(out)
    shutil.make_archive(out[:-4], "zip", tmp, "Immora-BCS")
    shutil.rmtree(tmp)
    with zipfile.ZipFile(out) as z:
        assert z.testzip() is None
        names = z.namelist()
        bad = [n for n in names if n.endswith(BAD) or "/data/" in n or "/.venv/" in n or n.endswith(".db-wal")]
        assert not bad, bad
        bat = z.read("Immora-BCS/Start Immora BCS (Windows).bat")
        assert b"\r\n" in bat and b"\n" not in bat.replace(b"\r\n", b""), "bat not CRLF"
        for must in ("Immora-BCS/Immora-BCS.html", "Immora-BCS/app.py", "Immora-BCS/immora_bcs/static/app.js", "Immora-BCS/README.md", "Immora-BCS/requirements.txt", "Immora-BCS/manage.py"):
            assert must in names, must
        for n in names:  # executable bits for the Mac/Linux launchers
            pass
    size = os.path.getsize(out) / 1e6
    print(f"{out}: {len(names)} files, {size:.1f} MB, verified (no db/secret_key/.env, .bat CRLF)")
    return names, size


full, _ = build("/workspace/Immora-BCS.zip", [])
app, size = build("/workspace/Immora-BCS-app.zip", ["screenshots", "tests"])
assert size < 25, size
assert not any("/tests/" in n or "/screenshots/" in n for n in app)
print("screenshots in full zip:", sorted(n.split("/")[-1] for n in full if "/screenshots/" in n and n.endswith(".png")))
