#!/usr/bin/env bash
# Start the Immora BCS server (Flask + SQLite in ./data).
#   ./run.sh          http://localhost:5080   (this computer only)
#   ./run.sh --lan    http://<this-computer-ip>:5080 for other PCs/tablets on the office network
set -euo pipefail
cd "$(dirname "$0")"
PY=python3
command -v python3 >/dev/null 2>&1 || PY=python
if [ ! -x .venv/bin/python ]; then
  echo "First run: creating a Python environment and installing requirements (needs internet once)…"
  "$PY" -m venv .venv
  .venv/bin/pip install -q --upgrade pip
  .venv/bin/pip install -q -r requirements.txt
fi
for arg in "$@"; do
  case "$arg" in
    --lan) export HOST=0.0.0.0 ;;
    -h|--help) sed -n 2,4p "$0"; exit 0 ;;
  esac
done
exec .venv/bin/python app.py
