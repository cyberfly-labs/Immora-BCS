#!/usr/bin/env python3
"""Write web/locales/{ar,fr,hi,ur}.json from tools/locale_starter.txt (English | ar | fr | hi | ur)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
CODES = [("ar", "Arabic", "rtl"), ("fr", "French", "ltr"), ("hi", "Hindi", "ltr"), ("ur", "Urdu", "rtl")]
packs = {c: {} for c, _, _ in CODES}
for line in open(os.path.join(HERE, "locale_starter.txt"), encoding="utf-8"):
    line = line.strip()
    if not line or line.startswith("#"): continue
    parts = [p.strip() for p in line.split("|")]
    assert len(parts) == 5, line
    for (c, _, _), v in zip(CODES, parts[1:]): packs[c][parts[0]] = v
for c, name, d in CODES:
    out = {"_meta": {"code": c, "name": name, "dir": d, "note": "Immora BCS starter pack: keys are the English text on screen; missing keys fall back to English."}}
    out.update(dict(sorted(packs[c].items())))
    with open(os.path.join(ROOT, "web", "locales", c + ".json"), "w", encoding="utf-8") as f: json.dump(out, f, ensure_ascii=False, indent=1)
    print(c, len(packs[c]))
