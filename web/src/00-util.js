/* Small helpers shared by every screen. */
"use strict";
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const h = v => String(v === null || v === undefined ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
function stableStr(v) {
  if (v === undefined) return "null";
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(stableStr).join(",") + "]";
  return "{" + Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => JSON.stringify(k) + ":" + stableStr(v[k])).join(",") + "}";
}
const uid = p => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`.toUpperCase().replace(/[^A-Z0-9-]/g, "");
const pad2 = n => String(n).padStart(2, "0");
const fmtD = s => s ? `${String(s).slice(8, 10)}-${String(s).slice(5, 7)}-${String(s).slice(0, 4)}` : "";
const fmtDT = s => s ? `${fmtD(s)} ${String(s).slice(11, 16)}` : "";
function parseD(s) { // DD-MM-YYYY (or D/M/YYYY, or ISO) -> YYYY-MM-DD or null
  s = String(s || "").trim(); if (!s) return "";
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s); if (m) return chkISO(m[1], m[2], m[3]);
  m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(s); if (m) return chkISO(m[3], m[2], m[1]);
  return null;
}
function chkISO(y, mo, d) { const iso = `${y}-${pad2(mo)}-${pad2(d)}`; return R.validDate(iso) ? iso : null; }
const CUR = () => (cfg().currency || "AED");
const money = (x, cur) => `${cur === false ? "" : (cur || CUR()) + " "}${Number(x || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const money0 = x => `${CUR()} ${Math.round(Number(x || 0)).toLocaleString("en-US")}`;
const pct = x => `${Math.round(Number(x || 0))}%`;
const sum = (a, f) => a.reduce((t, x) => t + Number(f ? f(x) : x) , 0);
const byId = (c, id) => (DB[c] || []).find(r => r.id === id) || null;
const cfg = () => (DB.cfg || []).find(r => r.id === "centre") || {};
const timeOpts = (sel, from = 7, to = 22) => { let o = ""; for (let hh = from; hh <= to; hh++) for (const mm of [0, 30]) { if (hh === to && mm) continue; const v = `${pad2(hh)}:${pad2(mm)}`; o += `<option ${v === sel ? "selected" : ""}>${v}</option>`; } return o; };
function opts(list, sel, blank) { return (blank !== undefined ? `<option value="">${h(blank)}</option>` : "") + list.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${h(v)}" ${String(v) === String(sel === undefined ? "" : sel) ? "selected" : ""}>${h(l)}</option>`; }).join(""); }
function download(name, text, type) { const b = new Blob([text], { type: type || "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
function csv(rows, cols) { const q = v => { const s = String(v === null || v === undefined ? "" : v); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }; return "\ufeff" + [cols.map(c => q(c[1])).join(",")].concat(rows.map(r => cols.map(c => q(typeof c[0] === "function" ? c[0](r) : r[c[0]])).join(","))).join("\r\n"); }
function toast(msg, kind) {
  let box = $("#toasts"); if (!box) { box = document.createElement("div"); box.id = "toasts"; box.setAttribute("aria-live", "polite"); document.body.appendChild(box); }
  const t = document.createElement("div"); t.className = "toast " + (kind || "ok"); t.setAttribute("role", kind === "err" ? "alert" : "status"); t.textContent = msg; box.appendChild(t);
  setTimeout(() => t.classList.add("out"), kind === "err" ? 5200 : 2800); setTimeout(() => t.remove(), kind === "err" ? 5600 : 3200);
}
/* icons: 24px stroke icons, inline SVG */
const ICONS = {
  home: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z", map: "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z", cal: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5", users: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8",
  building: "M4 21V4h11v17M15 9h5v12M8 8h3M8 12h3M8 16h3M3 21h18", funnel: "M3 4h18l-7 8v6l-4 2v-8z", file: "M6 2h9l5 5v15H6zM14 2v6h6M9 13h7M9 17h7",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7", phone: "M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2", receipt: "M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h4",
  bill: "M4 4h16v16H4zM8 9h8M8 13h8M8 17h5", door: "M6 3h12v18H6zM14 12h.01M3 21h18", qr: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM14 18h2M18 14h3",
  tool: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z", chart: "M4 20V10M10 20V4M16 20v-7M22 20H2", cog: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3", plus: "M12 5v14M5 12h14", moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z", sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  menu: "M3 6h18M3 12h18M3 18h18", x: "M18 6L6 18M6 6l12 12", chev: "M6 9l6 6 6-6", check: "M20 6L9 17l-5-5", logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  print: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z", card: "M2 5h20v14H2zM2 10h20", bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  key: "M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4", upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3", help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01", ticket: "M3 7a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-3a2 2 0 0 0 0-4z",
  coffee: "M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3", globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
  link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7", alert: "M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
  refresh: "M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15", send: "M22 2L11 13M22 2l-7 20-4-9-9-4z", edit: "M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z",
};
const ic = (n, cls) => `<svg class="ic ${cls || ""}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n] || ICONS.file}"/></svg>`;
