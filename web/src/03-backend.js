/* Two backends with the same interface:
   ServerBackend  -> Flask API (server edition)
   LocalBackend   -> runs the same rules inside the browser, data in IndexedDB (offline single-file edition). */
const localToday = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const localHM = () => { const d = new Date(); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
class ApiError extends Error { constructor(msg, status, field, extra) { super(msg); this.status = status; this.field = field; this.extra = extra || {}; } }

const ServerBackend = {
  kind: "server",
  async call(method, url, body) {
    let r;
    try { r = await fetch(url, { method, headers: { "Content-Type": "application/json", "X-Immora": "1" }, credentials: "same-origin", body: body === undefined ? undefined : JSON.stringify(body) }); }
    catch (e) { throw new ApiError(t("Cannot reach the Immora BCS server. Check that it is running."), 0); }
    let j = {}; try { j = await r.json(); } catch (e) { /* not json */ }
    if (!r.ok) throw new ApiError(j.error || `Error ${r.status}`, r.status, j.field, j);
    return j;
  },
  async me() { try { return (await this.call("GET", "api/me")).user; } catch (e) { return null; } },
  login(u, p, portal) { return this.call("POST", "api/login", { username: u, password: p, portal: !!portal }).then(j => j.user); },
  logout() { return this.call("POST", "api/logout", {}); },
  state() { return this.call("GET", "api/state"); },
  sync(changes) { return this.call("POST", "api/sync", { changes }); },
  action(name, payload) { return this.call("POST", "api/action/" + name, payload || {}); },
  users() { return this.call("GET", "api/users").then(j => j.users); },
  saveUser(u) { return this.call("POST", "api/users", u); },
  password(o, n) { return this.call("POST", "api/password", { old: o, new: n }); },
  setLang(l) { return this.call("POST", "api/lang", { lang: l }).catch(() => {}); },
  audit() { return this.call("GET", "api/audit?limit=500").then(j => j.audit); },
  async backup() { const r = await fetch("api/backup", { credentials: "same-origin" }); if (!r.ok) throw new ApiError("Backup failed", r.status); return r.text(); },
  restore(obj) { return this.call("POST", "api/restore", { backup: obj }); },
};

/* ---------- PBKDF2-SHA256 (WebCrypto, with a small pure-JS fallback for browsers that block it on file://) */
const SHA = (() => {
  const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  function sha256(bytes) {
    const l = bytes.length, n = ((l + 9 + 63) >> 6) << 6, m = new Uint8Array(n); m.set(bytes); m[l] = 0x80;
    const dv = new DataView(m.buffer); dv.setUint32(n - 4, l * 8); dv.setUint32(n - 8, Math.floor(l / 0x20000000));
    let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]; const w = new Uint32Array(64);
    for (let o = 0; o < n; o += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(o + i * 4);
      for (let i = 16; i < 64; i++) { const a = w[i - 15], b = w[i - 2]; const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3), s1 = ((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0; }
      let [a, b, c, d, e, f, g, hh] = H;
      for (let i = 0; i < 64; i++) { const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7)), ch = (e & f) ^ (~e & g), t1 = (hh + S1 + ch + K[i] + w[i]) | 0, S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10)), mj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + mj) | 0; hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0; }
      H = [H[0] + a, H[1] + b, H[2] + c, H[3] + d, H[4] + e, H[5] + f, H[6] + g, H[7] + hh].map(x => x | 0);
    }
    const out = new Uint8Array(32); const ov = new DataView(out.buffer); H.forEach((x, i) => ov.setUint32(i * 4, x >>> 0)); return out;
  }
  function hmac(key, msg) { if (key.length > 64) key = sha256(key); const k = new Uint8Array(64); k.set(key); const ip = k.map(x => x ^ 0x36), op = k.map(x => x ^ 0x5c); const a = new Uint8Array(64 + msg.length); a.set(ip); a.set(msg, 64); const inner = sha256(a); const b = new Uint8Array(96); b.set(op); b.set(inner, 64); return sha256(b); }
  function pbkdf2js(pw, salt, it) { const s = new Uint8Array(salt.length + 4); s.set(salt); s[salt.length + 3] = 1; let u = hmac(pw, s); const t = u.slice(); for (let i = 1; i < it; i++) { u = hmac(pw, u); for (let j = 0; j < 32; j++) t[j] ^= u[j]; } return t; }
  const b64 = a => btoa(String.fromCharCode.apply(null, Array.from(a))), unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  async function pbkdf2(pw, salt, it) {
    const p = new TextEncoder().encode(pw);
    try { if (window.crypto && crypto.subtle) { const k = await crypto.subtle.importKey("raw", p, "PBKDF2", false, ["deriveBits"]); return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: it }, k, 256)); } } catch (e) { /* fall back */ }
    return pbkdf2js(p, salt, it);
  }
  async function hash(pw, it) { const salt = new Uint8Array(16); crypto.getRandomValues(salt); it = it || 100000; return `pbkdf2_sha256$${it}$${b64(salt)}$${b64(await pbkdf2(pw, salt, it))}`; }
  async function check(pw, stored) { try { const [algo, it, salt, hv] = stored.split("$"); if (algo !== "pbkdf2_sha256") return false; return b64(await pbkdf2(pw, unb64(salt), Number(it))) === hv; } catch (e) { return false; } }
  return { sha256, hash, check };
})();

/* ---------- IndexedDB key/value (falls back to localStorage) */
const KV = {
  db: null,
  open() { return new Promise(res => { try { const r = indexedDB.open("immora-bcs", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => { this.db = r.result; res(true); }; r.onerror = () => res(false); } catch (e) { res(false); } }); },
  async get(k) { if (!this.db) await this.open(); if (!this.db) { const v = localStorage.getItem("immora-bcs:" + k); return v ? JSON.parse(v) : null; } return new Promise(res => { const q = this.db.transaction("kv").objectStore("kv").get(k); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); }); },
  async put(k, v) { if (!this.db) await this.open(); if (!this.db) { localStorage.setItem("immora-bcs:" + k, JSON.stringify(v)); return; } return new Promise((res, rej) => { const tx = this.db.transaction("kv", "readwrite"); tx.objectStore("kv").put(v, k); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); }); },
};

function shiftSeed(seed, base, today) {
  /* Demo data was generated for SEED_BASE; move it to today so the calendar, overdue invoices and renewals look current.
     Day-based lists move by days; month-based billing lists move by whole months (keeps 1st/last day of month). */
  const dd = R.daysBetween(base, today); const [by, bm] = base.split("-").map(Number), [ty, tm] = today.split("-").map(Number); const mm = (ty - by) * 12 + (tm - bm);
  if (!dd) return seed;
  const DAYC = new Set(["bookings", "visitors", "checkins", "access", "tours", "calls", "outbox", "charges", "tickets", "mail"]);
  const shiftM = s => { const d0 = Number(s.slice(8, 10)), [y, m] = s.slice(0, 7).split("-").map(Number); const last = d0 === new Date(Date.UTC(y, m, 0)).getUTCDate(); let x = R.addMonths(s.slice(0, 10), mm); if (last) x = R.monthBounds(x)[1]; return x + s.slice(10); };
  const walk = (v, f) => { if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}($|T\d{2}:\d{2})/.test(v)) return f(v); if (Array.isArray(v)) return v.map(x => walk(x, f)); if (v && typeof v === "object") { const o = {}; for (const k of Object.keys(v)) o[k] = walk(v[k], f); return o; } return v; };
  const out = {};
  for (const [c, list] of Object.entries(seed)) {
    const f = DAYC.has(c) ? (s => R.addDays(s.slice(0, 10), dd) + s.slice(10)) : shiftM;
    out[c] = c === "cfg" ? list : list.map(r => walk(r, f));
    if (c === "contracts") out[c] = out[c].map(r => Object.assign(r, { start: r.start, end: r.end }));
  }
  return out;
}

const LocalBackend = {
  kind: "offline", st: null, user: null,
  async load() {
    if (this.st) return this.st;
    let st = await KV.get("state");
    if (!st) {
      const data = shiftSeed(clone(SEED), SEED_BASE, localToday());
      st = { records: data, ver: {}, users: clone(DEMO_USERS), audit: [], created: localToday() };
      for (const [c, l] of Object.entries(data)) for (const r of l) st.ver[c + "|" + r.id] = 1;
      await KV.put("state", st);
    }
    for (const c of SHARED.COLLECTIONS) if (!st.records[c]) st.records[c] = [];
    this.st = st; return st;
  },
  async save() { await KV.put("state", this.st); },
  log(action, coll, rid, summary) { this.st.audit.unshift({ ts: new Date().toISOString().slice(0, 19), username: (this.user || {}).username || "system", action, coll: coll || "", rid: rid || "", summary: String(summary || "").slice(0, 500) }); if (this.st.audit.length > 5000) this.st.audit.length = 5000; },
  async me() { await this.load(); const u = sessionStorage.getItem("immora-bcs-user"); const x = u && this.st.users.find(z => z.username === u && z.active !== false); this.user = x ? this.pub(x) : null; return this.user; },
  pub(x) { return { username: x.username, name: x.name, role: x.role, memberId: x.memberId || "", lang: x.lang || "" }; },
  async login(u, p, portal) {
    await this.load(); u = String(u || "").trim().toLowerCase();
    const x = this.st.users.find(z => z.username === u);
    if (x && x.lockedUntil && x.lockedUntil > Date.now()) throw new ApiError(t("Too many wrong passwords. Try again in 5 minutes."), 429);
    if (!x || x.active === false || !(await SHA.check(p, x.hash))) { if (x) { x.failed = (x.failed || 0) + 1; if (x.failed >= 5) { x.failed = 0; x.lockedUntil = Date.now() + 300000; } } this.log("login_failed", "", "", u); await this.save(); throw new ApiError(t("Wrong username or password"), 401); }
    if (!!portal !== (x.role === "member")) throw new ApiError(x.role === "member" ? t("Use the member portal tab to sign in as a member") : t("Staff sign in on the staff tab"), 401);
    x.failed = 0; x.lockedUntil = 0; sessionStorage.setItem("immora-bcs-user", u); this.user = this.pub(x); this.log("login"); await this.save(); return this.user;
  },
  async logout() { sessionStorage.removeItem("immora-bcs-user"); this.user = null; },
  async state() {
    await this.load(); const u = this.user; if (!u) throw new ApiError("Please sign in", 401);
    const withV = (c, l) => l.map(r => Object.assign({}, r, { _v: this.st.ver[c + "|" + r.id] || 1 }));
    let data;
    if (u.role === "member") data = memberView(this.st.records, u.memberId, (c, l) => withV(c, l));
    else { data = {}; for (const c of SHARED.COLLECTIONS) data[c] = withV(c, this.st.records[c]); }
    return { data: clone(data), today: localToday(), now: localHM(), user: u };
  },
  canWrite(c) { return (SHARED.WRITE[this.user.role] || []).includes(c); },
  applyChanges(changes, today) {
    const db = clone(this.st.records), ver = Object.assign({}, this.st.ver), out = {}, logs = [];
    const bump = (c, id) => { ver[c + "|" + id] = (ver[c + "|" + id] || 0) + 1; return ver[c + "|" + id]; };
    const memPut = (c, r) => { const l = db[c]; const i = l.findIndex(x => x.id === r.id); if (i < 0) l.push(r); else l[i] = r; };
    const memDel = (c, id) => { db[c] = db[c].filter(x => x.id !== id); };
    const u = this.user;
    for (const ch of changes || []) {
      const c = ch.coll, op = ch.op || "put";
      if (!SHARED.COLLECTIONS.includes(c)) throw new ApiError("Unknown list: " + c, 400);
      if (!this.canWrite(c)) throw new ApiError(t("Your role cannot change this. Ask an administrator."), 403);
      const rid = String(ch.id || (ch.data || {}).id || "");
      if (!/^[A-Za-z0-9_.:-]{1,64}$/.test(rid)) throw new ApiError("Invalid record id", 400);
      const old = db[c].find(x => x.id === rid) || null;
      if (ch.base && old && Number(ch.base) !== ver[c + "|" + rid]) throw new ApiError(t("Someone else changed this record a moment ago. The screen now shows the latest version."), 409);
      if (u.role === "member" && old && !memberOwns(u, c, old)) throw new ApiError("This record is not yours", 403);
      if (op === "delete") {
        if (!old) continue;
        const ok = R.canDelete(c, old); if (ok !== true) throw new ApiError(ok, 400);
        if (u.role === "member") throw new ApiError("Cancel the booking instead of deleting it", 403);
        memDel(c, rid); out[c + "|" + rid] = { coll: c, id: rid, deleted: true, version: bump(c, rid), data: null }; logs.push(["delete", c, rid, describe(c, old)]);
        if (c === "bookings") for (const chg of db.charges.filter(x => x.bookingId === rid && !x.invoiceId)) { memDel("charges", chg.id); out["charges|" + chg.id] = { coll: "charges", id: chg.id, deleted: true, version: bump("charges", chg.id), data: null }; }
        continue;
      }
      const rec = clone(ch.data || {}); delete rec._v; rec.id = rid;
      let extras;
      try { extras = R.validate(c, rec, old, db, u, today); } catch (e) { if (e instanceof R.RuleError) throw new ApiError(e.message, e.status, e.field); throw e; }
      for (const [c2, r2, op2] of [[c, rec, "put"]].concat(extras || [])) {
        if (op2 === "delete") { memDel(c2, r2.id); out[c2 + "|" + r2.id] = { coll: c2, id: r2.id, deleted: true, version: bump(c2, r2.id), data: null }; continue; }
        const old2 = db[c2].find(x => x.id === r2.id);
        memPut(c2, r2); out[c2 + "|" + r2.id] = { coll: c2, id: r2.id, deleted: false, version: bump(c2, r2.id), data: r2 };
        if (c2 === c) logs.push([old2 ? "update" : "create", c2, r2.id, describe(c2, r2) + (old2 && old2.status !== r2.status && r2.status ? ` · ${old2.status} → ${r2.status}` : "")]);
      }
    }
    this.st.records = db; this.st.ver = ver; for (const l of logs) this.log(...l);
    return Object.values(out);
  },
  async sync(changes) { await this.load(); if (!this.user) throw new ApiError("Please sign in", 401); const recs = this.applyChanges(changes, localToday()); await this.save(); return { records: clone(recs) }; },
  async action(name, p) {
    await this.load(); const u = this.user; if (!u) throw new ApiError("Please sign in", 401);
    if (!SHARED.ACTIONS[name]) throw new ApiError("Unknown action", 404);
    if (!SHARED.ACTIONS[name].includes(u.role)) throw new ApiError(t("Your role cannot do this. Ask an administrator."), 403);
    const res = localAction(this, name, p || {}, localToday(), localHM()); await this.save(); return clone(res);
  },
  async users() { await this.load(); return this.st.users.map(x => ({ username: x.username, name: x.name, role: x.role, active: x.active !== false ? 1 : 0, memberId: x.memberId || "" })); },
  async saveUser(b) {
    if (this.user.role !== "admin") throw new ApiError("Only an administrator can do this", 403);
    const un = String(b.username || "").trim().toLowerCase();
    if (!un || !/^[a-z0-9._-]+$/.test(un)) throw new ApiError("Username: letters and numbers only", 400, "username");
    if (!SHARED.ROLES.concat(["member"]).includes(b.role)) throw new ApiError("Choose a role", 400, "role");
    let x = this.st.users.find(z => z.username === un);
    if (b.password && b.password.length < 8) throw new ApiError("Use at least 8 characters", 400, "password");
    if (!x && !b.password) throw new ApiError("Set a password for the new user", 400, "password");
    if (b.role === "member" && !this.st.records.members.some(m => m.id === b.memberId)) throw new ApiError("Choose the member for this portal login", 400, "memberId");
    if (x && x.username === this.user.username && (b.role !== "admin" || b.active === false)) throw new ApiError("You cannot remove your own administrator access", 400);
    if (!x) { x = { username: un }; this.st.users.push(x); }
    Object.assign(x, { name: String(b.name || un).slice(0, 80), role: b.role, active: b.active !== false, memberId: b.memberId || "" });
    if (b.password) x.hash = await SHA.hash(b.password);
    this.log("user_saved", "users", un, `${un} · ${b.role}${b.password ? " · password set" : ""}`); await this.save(); return { ok: true };
  },
  async password(o, n) { const x = this.st.users.find(z => z.username === this.user.username); if (!(await SHA.check(o, x.hash))) throw new ApiError("Current password is wrong", 400, "old"); if (!n || n.length < 8) throw new ApiError("Use at least 8 characters", 400, "new"); x.hash = await SHA.hash(n); this.log("password_changed"); await this.save(); return { ok: true }; },
  async setLang(l) { const x = this.st.users.find(z => z.username === (this.user || {}).username); if (x) { x.lang = l; await this.save(); } },
  async audit() { return this.st.audit.slice(0, 500); },
  async backup() { this.log("backup"); await this.save(); return JSON.stringify({ app: "Immora BCS", version: APP_VERSION, created: new Date().toISOString().slice(0, 19), data: this.st.records }); },
  async restore(obj) { const d = (obj || {}).data; if (!d || !d.cfg) throw new ApiError("This is not an Immora BCS backup file", 400); this.st.records = {}; this.st.ver = {}; for (const c of SHARED.COLLECTIONS) { this.st.records[c] = (d[c] || []).filter(r => r && /^[A-Za-z0-9_.:-]{1,64}$/.test(String(r.id))); for (const r of this.st.records[c]) this.st.ver[c + "|" + r.id] = 1; } this.log("restore", "", "", "backup restored"); await this.save(); return { ok: true }; },
  async resetDemo() { const data = shiftSeed(clone(SEED), SEED_BASE, localToday()); this.st.records = data; this.st.ver = {}; for (const [c, l] of Object.entries(data)) for (const r of l) this.st.ver[c + "|" + r.id] = 1; this.log("demo_reset"); await this.save(); },
};

function describe(c, r) { r = r || {}; for (const f of ["number", "code", "legalName", "name", "subject", "title", "desc"]) if (r[f]) return String(r[f]); return r.id || ""; }
function memberOwns(u, c, r) { const m = u.memberId; return c === "bookings" || c === "tickets" ? r.memberId === m : c === "visitors" ? r.hostId === m : false; }
const PUBLIC_CFG = ["id", "legalName", "tradeName", "address", "trn", "phone", "email", "currency", "vatRate", "taxLabel", "invoiceTitle", "country", "openFrom", "openTo", "licenceNo", "logo", "stamp", "bank", "paymentTermsDays", "vatName", "footer"];
function memberView(db, mid, withV) {
  const me = db.members.find(m => m.id === mid) || null, comp = (me && me.companyId) || "__none__";
  const mine = r => r.memberId === mid || (r.companyId && r.companyId === comp);
  const out = {}; for (const c of SHARED.COLLECTIONS) out[c] = [];
  out.cfg = db.cfg.filter(r => r.id === "centre").map(r => Object.fromEntries(Object.entries(r).filter(([k]) => PUBLIC_CFG.includes(k))));
  out.spaces = db.spaces.filter(s => SHARED.BOOKABLE.includes(s.type)).map(s => Object.fromEntries(["id", "code", "name", "type", "floor", "capacity", "priceHour", "creditRate", "status", "amenities"].map(k => [k, s[k] === undefined ? null : s[k]])));
  out.plans = db.plans.filter(p => me && p.id === me.planId); out.members = me ? [me] : []; out.companies = db.companies.filter(x => x.id === comp);
  for (const b of db.bookings) { if (b.status === "cancelled" && b.memberId !== mid) continue; out.bookings.push(b.memberId === mid ? b : { id: b.id, spaceId: b.spaceId, start: b.start, end: b.end, status: b.status, title: "Booked", private: true }); }
  for (const k of ["invoices", "creditnotes", "receipts"]) out[k] = db[k].filter(x => mine(x) && x.status !== "draft");
  out.tickets = db.tickets.filter(x => x.memberId === mid); out.visitors = db.visitors.filter(x => x.hostId === mid);
  out.mail = db.mail.filter(mine); out.calls = db.calls.filter(mine);
  for (const c of Object.keys(out)) out[c] = withV(c, out[c]);
  return out;
}

function localAction(B, name, p, today, hm) {
  const db = B.st.records, cfgc = R.cfgOf(db); let n = 0;
  const id = pre => `${pre}-${today.replace(/-/g, "")}-${pad2(++n)}${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const put = items => B.applyChanges(items.map(([c, r]) => ({ coll: c, id: r.id, op: "put", data: r })), today);
  const E = m => { throw new ApiError(m, 400); };
  if (name === "billing_run") {
    const period = (p.period || today).slice(0, 10); if (!R.validDate(period)) E("Billing month: use a valid date (DD-MM-YYYY)");
    const [invs, charges, skipped] = R.billingRun(db, period, today, cfgc), items = [];
    for (const inv of invs) { inv.id = id("INV"); items.push(["invoices", inv]); for (const ln of inv.lines) if (ln.chargeId) items.push(["charges", Object.assign({}, charges.find(x => x.id === ln.chargeId), { invoiceId: inv.id })]); }
    const recs = items.length ? put(items) : []; B.log("billing_run", "invoices", "", `${period.slice(0, 7)}: ${invs.length} draft invoice(s); skipped ${skipped.length}`);
    return { records: recs, created: invs.length, skipped };
  }
  if (name === "dunning_run") {
    const due = R.dunningRun(db, today), items = [];
    for (const [inv, lvl, over, bal] of due) {
      const cust = inv.customer || {};
      items.push(["invoices", Object.assign({}, inv, { dunningLevel: lvl, lastReminder: today })]);
      items.push(["outbox", { id: id("OUT"), to: cust.email || cust.name || "client", status: "queued", date: today, kind: "dunning", invoiceId: inv.id, level: lvl,
        subject: ["", "Friendly reminder", "Second reminder", "Final notice"][lvl] + `: invoice ${inv.number} is ${over} day(s) overdue`,
        body: `Dear ${cust.name || "client"},\n\nOur records show ${cfgc.currency || "AED"} ${bal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} is still due on invoice ${inv.number} dated ${R.fmtDate(inv.date)} (due ${R.fmtDate(inv.dueDate)}).\nPlease arrange payment or contact us if you have already paid.\n\n${cfgc.legalName || ""}` }]);
    }
    return { records: items.length ? put(items) : [], created: due.length };
  }
  if (name === "notice_reminders") {
    const items = []; let k = 0;
    for (const c of db.contracts) {
      const [nd, inwin] = R.noticeDue(c, today); if (!inwin || c.noticeReminded) continue; k++;
      const pty = R.partySnapshot(c, db);
      items.push(["contracts", Object.assign({}, c, { noticeReminded: today })]);
      items.push(["outbox", { id: id("OUT"), to: pty.email || pty.name || "client", status: "queued", date: today, kind: "notice", contractId: c.id,
        subject: `Your agreement ${c.number} ends on ${R.fmtDate(c.end)}: renewal or notice by ${R.fmtDate(nd)}`,
        body: `Dear ${pty.name},\n\nYour agreement ${c.number} ends on ${R.fmtDate(c.end)}. Under its ${c.noticeDays}-day notice period, please tell us by ${R.fmtDate(nd)} whether you will renew.\n\n${cfgc.legalName || ""}` }]);
    }
    return { records: items.length ? put(items) : [], created: k };
  }
  if (name === "renew_contract") {
    const old = db.contracts.find(x => x.id === p.id); if (!old || !["active", "notice"].includes(old.status)) E("Only active contracts can be renewed");
    const nw = R.renewalOf(old, today, p.uplift || 0); nw.id = id("CT");
    return { records: put([["contracts", Object.assign({}, old, { status: "renewed", renewedTo: nw.id })], ["contracts", nw]]), id: nw.id };
  }
  if (name === "convert_lead") {
    const lead = db.leads.find(x => x.id === p.id); if (!lead) E("Lead not found"); if (lead.memberId) E("This lead is already a member");
    const items = []; let cid = "";
    if (String(lead.company || "").trim()) { cid = id("CO"); items.push(["companies", { id: cid, legalName: lead.company.trim(), email: lead.email || "", phone: lead.phone || "", status: "active", since: today }]); }
    const mid = id("M");
    items.push(["members", { id: mid, name: lead.name, email: lead.email || "", phone: lead.phone || "", companyId: cid, planId: p.planId || "", status: "active", start: today, leadId: lead.id }]);
    items.push(["leads", Object.assign({}, lead, { stage: "won", memberId: mid, companyId: cid, wonOn: today })]);
    return { records: put(items), memberId: mid, companyId: cid };
  }
  if (name === "card_tap") {
    const card = String(p.cardNo || "").trim(), door = p.door || "Main entrance";
    const m = db.members.find(x => x.cardNo === card) || null;
    const ok = !!(m && m.status === "active" && !m.cardBlocked), reason = ok ? "" : (!m ? "Unknown card" : m.cardBlocked ? "Card blocked" : "Membership not active");
    const items = [["access", { id: id("ACC"), cardNo: card || "?", memberId: (m || {}).id || "", door, at: `${today}T${hm}`, result: ok ? "granted" : "denied", reason, simulated: true }]];
    if (ok && door === "Main entrance" && !db.checkins.some(x => x.memberId === m.id && x.date === today)) items.push(["checkins", { id: id("CHK"), memberId: m.id, date: today, time: hm, via: "card" }]);
    return { records: put(items), result: ok ? "granted" : "denied", reason, member: (m || {}).name || "" };
  }
  if (name === "payment_link") {
    const inv = db.invoices.find(x => x.id === p.id); if (!inv || !["issued", "part_paid"].includes(inv.status)) E("Choose an unpaid issued invoice");
    const link = `https://pay.example.invalid/${inv.number}?amount=${R.balance(inv, db).toFixed(2)}`;
    return { records: put([["invoices", Object.assign({}, inv, { paymentLink: link })]]), link };
  }
}
