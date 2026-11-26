#!/usr/bin/env bash
# macOS: double-click to start Immora BCS, then open http://localhost:5080
cd "$(dirname "$0")"
if ! command -v python3 >/dev/null 2>&1; then
  osascript -e 'display dialog "Python 3 is needed. Install it from python.org (or run: xcode-select --install), then double-click this file again. Or open Immora-BCS.html (offline edition) in Safari, Chrome or Firefox." buttons {"OK"}'
  exit 1
fi
( sleep 4; open "http://localhost:5080" ) &
./run.sh "$@"
