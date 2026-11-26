/* App shell: sign-in, layout, navigation, router, forms, modals, command palette, guided tour. */
let DB = {}, VER = {}, ME = null, TODAY = localToday(), NOW = localHM();
const Backend = BUILD_MODE === "server" ? ServerBackend : LocalBackend;
const PAGES = {}, AFTER = {}, ACT = {}, FORMS = {}, LIVE = {};
const can = c => !!ME && (SHARED.WRITE[ME.role] || []).includes(c);
const canAct = a => !!ME && (SHARED.ACTIONS[a] || []).includes(ME.role);
const isStaff = () => ME && ME.role !== "member";

function loadState(res) {
  DB = {}; VER = {};
  for (const c of SHARED.COLLECTIONS) { DB[c] = (res.data[c] || []).map(r => { const x = Object.assign({}, r); VER[c + "|" + x.id] = x._v || 1; delete x._v; return x; }); }
  TODAY = res.today || localToday(); NOW = res.now || localHM();
}
function applyRecords(recs) {
  for (const r of recs || []) {
    const l = DB[r.coll] || (DB[r.coll] = []); const i = l.findIndex(x => x.id === r.id);
    if (r.deleted) { if (i >= 0) l.splice(i, 1); delete VER[r.coll + "|" + r.id]; continue; }
    VER[r.coll + "|" + r.id] = r.version; if (i >= 0) l[i] = r.data; else l.push(r.data);
  }
}
async function refresh() { try { loadState(await Backend.state()); } catch (e) { if (e.status === 401) return sessionEnded(); } render(); }
async function save(coll, rec, opts) {
  opts = opts || {};
  if (!rec.id) rec.id = uid(coll.slice(0, 3).toUpperCase());
  try {
    const res = await Backend.sync([{ coll, id: rec.id, op: "put", base: VER[coll + "|" + rec.id] || 0, data: rec }]);
    applyRecords(res.records); if (opts.toast !== false) toast(opts.msg || t("Saved"));
    const mine = res.records.find(r => r.coll === coll && r.id === rec.id); return mine ? mine.data : rec;
  } catch (e) { return fail(e, opts.form); }
}
async function saveMany(items, msg) {
  try { const res = await Backend.sync(items.map(([c, r, op]) => ({ coll: c, id: r.id || (r.id = uid(c.slice(0, 3).toUpperCase())), op: op || "put", base: VER[c + "|" + r.id] || 0, data: r }))); applyRecords(res.records); if (msg) toast(msg); return true; }
  catch (e) { return fail(e); }
}
async function remove(coll, id, msg) {
  try { const res = await Backend.sync([{ coll, id, op: "delete", base: VER[coll + "|" + id] || 0 }]); applyRecords(res.records); toast(msg || t("Deleted")); return true; } catch (e) { return fail(e); }
}
async function act(name, payload, msg) {
  try { const res = await Backend.action(name, payload); applyRecords(res.records); if (msg) toast(typeof msg === "function" ? msg(res) : msg); return res; } catch (e) { return fail(e); }
}
function fail(e, form) {
  if (e.status === 401) { sessionEnded(); return null; }
  if (e.status === 409 && e.extra && e.extra.conflict) refresh();
  if (form && e.field) fieldError(form, e.field, e.message);
  toast(e.message || String(e), "err"); return null;
}
function sessionEnded() { ME = null; DB = {}; closeModal(); renderLogin(t("Your session ended. Please sign in again.")); }

/* ---------------------------------------------------------------- navigation */
const NAV = [
  { id: "home", label: "Home", icon: "home", items: [["dashboard", "Dashboard", "home"]] },
  { id: "spaces", label: "Spaces", icon: "map", items: [["floorplan", "Floor plan", "map"], ["spaces", "Spaces & prices", "grid"], ["plans", "Plans & add-ons", "coffee"]] },
  { id: "book", label: "Bookings", icon: "cal", items: [["calendar", "Room calendar", "cal"], ["bookings", "All bookings", "file"]] },
  { id: "crm", label: "Members & sales", icon: "users", items: [["members", "Members", "users"], ["companies", "Companies", "building"], ["leads", "Lead pipeline", "funnel"], ["tours", "Tours", "door"], ["quotes", "Quotes", "file"]] },
  { id: "contracts", label: "Contracts", icon: "file", items: [["contracts", "Contracts", "file"], ["renewals", "Renewals & notices", "bell"]] },
  { id: "vo", label: "Virtual office", icon: "mail", items: [["addressuse", "Business address use", "building"], ["mail", "Mail log", "mail"], ["calls", "Call answering", "phone"]] },
  { id: "billing", label: "Billing", icon: "bill", items: [["invoices", "Invoices", "bill"], ["billingrun", "Billing run", "refresh"], ["charges", "Charges & add-ons", "coffee"], ["receipts", "Receipts", "receipt"], ["creditnotes", "Credit notes", "file"], ["dunning", "Overdue & reminders", "alert"], ["books", "Export to Immora Books", "download"]] },
  { id: "desk", label: "Front desk", icon: "door", items: [["checkin", "Check-in", "check"], ["visitors", "Visitors", "qr"], ["access", "Access-card log", "card"]] },
  { id: "help", label: "Helpdesk", icon: "tool", items: [["tickets", "Tickets", "ticket"]] },
  { id: "reports", label: "Reports", icon: "chart", items: [["reports", "Reports", "chart"]] },
  { id: "admin", label: "Administration", icon: "cog", items: [["settings", "Centre settings", "cog"], ["users", "Users & logins", "key"], ["outbox", "Outbox (simulated)", "send"], ["audit", "Audit trail", "file"], ["backup", "Backup & restore", "download"]] },
];
const ROUTE_ROLES = {
  settings: ["admin"], users: ["admin"], backup: ["admin"], audit: ["admin", "finance"], billingrun: ["admin", "finance", "viewer"], books: ["admin", "finance", "viewer"],
  dunning: ["admin", "finance", "viewer"],
};
const PORTAL_NAV = [["p-home", "Home", "home"], ["p-book", "Book a room", "cal"], ["p-bookings", "My bookings", "file"], ["p-invoices", "Invoices", "bill"], ["p-tickets", "Help & requests", "ticket"], ["p-visitors", "My guests", "qr"], ["p-mail", "Mail for me", "mail"]];
const routeOK = r => !ROUTE_ROLES[r] || ROUTE_ROLES[r].includes(ME.role);
const ROUTE_TITLE = {}; NAV.forEach(g => g.items.forEach(([r, l]) => ROUTE_TITLE[r] = l)); PORTAL_NAV.forEach(([r, l]) => ROUTE_TITLE[r] = l);
function go(r) { if (location.hash === "#/" + r) render(); else location.hash = "#/" + r; }
function curRoute() { const p = (location.hash || "").replace(/^#\/?/, "").split("/"); return { name: p[0] || (ME && ME.role === "member" ? "p-home" : "dashboard"), arg: decodeURIComponent(p.slice(1).join("/") || "") }; }

/* ---------------------------------------------------------------- sign-in */
function renderLogin(msg) {
  document.body.className = "is-login";
  const demo = BUILD_MODE === "offline" || (window.__INFO && window.__INFO.demo);
  const chips = [["admin", "admin123"], ["frontdesk", "frontdesk123"], ["community", "community123"], ["finance", "finance123"], ["viewer", "viewer123"]];
  $("#app").innerHTML = `<div class="login">
    <section class="login-brand"><img class="login-logo" src="${IMMORA_LOGO.icon}" alt="Immora"><h1>Immora <span>BCS</span></h1>
      <p class="lead">${t("Business Centre System")}</p><p>${t("Designed to support coworking spaces, business centres and office rental operators: spaces, bookings, members, contracts, virtual offices and billing in one place.")}</p>
      <ul class="login-points"><li>${ic("map")} ${t("Floor plan and live availability")}</li><li>${ic("cal")} ${t("Meeting rooms with credits")}</li><li>${ic("bill")} ${t("Recurring billing and tax invoices")}</li><li>${ic("door")} ${t("Front desk, visitors and mail")}</li></ul></section>
    <section class="login-card card">
      <div class="login-tools"><span class="top-lang">${langSelect()}</span><button class="btn-icon" data-act="theme" title="${t("Light / dark")}" aria-label="${t("Light / dark")}">${ic(document.documentElement.dataset.theme === "dark" ? "sun" : "moon")}</button></div>
      <div class="tabs" role="tablist"><button role="tab" class="tab ${window.__portalTab ? "" : "on"}" data-act="login-tab" data-portal="0" id="tab-staff">${t("Staff sign in")}</button><button role="tab" class="tab ${window.__portalTab ? "on" : ""}" data-act="login-tab" data-portal="1" id="tab-portal">${t("Member portal")}</button></div>
      <form data-form="login" id="login-form" autocomplete="on" novalidate>
        ${msg ? `<div class="note warn">${h(msg)}</div>` : ""}
        ${fld(t("Username"), `<input name="username" id="login-user" autocomplete="username" required autofocus>`)}
        ${fld(t("Password"), `<input name="password" id="login-pass" type="password" autocomplete="current-password" required>`)}
        <button class="btn btn-primary btn-block" id="login-btn">${t("Sign in")}</button>
        <p class="login-err" id="login-err" role="alert"></p>
      </form>
      ${demo ? `<div class="demo-box"><b>${t("Demo logins (fictional data)")}</b><div class="chips">${(window.__portalTab ? [["member", "member123"]] : chips).map(([u, p]) => `<button class="chip-btn" data-act="demo-fill" data-u="${u}" data-p="${p}">${u}</button>`).join("")}</div></div>` : ""}
      <p class="hint">${BUILD_MODE === "offline" ? t("Offline edition: data is kept in this browser on this computer.") : t("Server edition")} · v${APP_VERSION}</p>
      <p class="powered">${t("Powered by Immora")}</p>
    </section></div>`;
}
FORMS.login = async (d, form) => {
  const err = $("#login-err"); err.textContent = ""; $("#login-btn").disabled = true;
  try { ME = await Backend.login(d.username, d.password, !!window.__portalTab); if (ME.lang) setLang(ME.lang); await start(); }
  catch (e) { err.textContent = e.message; $("#login-btn").disabled = false; }
};
ACT["login-tab"] = el => { window.__portalTab = el.dataset.portal === "1"; renderLogin(); };
ACT["demo-fill"] = el => { $("#login-user").value = el.dataset.u; $("#login-pass").value = el.dataset.p; $("#login-btn").focus(); };
ACT.logout = async () => { await Backend.logout().catch(() => {}); ME = null; location.hash = ""; renderLogin(); };
ACT.theme = () => { const d = document.documentElement; d.dataset.theme = d.dataset.theme === "dark" ? "light" : "dark"; try { localStorage.setItem("immora-bcs-theme", d.dataset.theme); } catch (e) { /* ignore */ } if (ME) render(); else renderLogin(); };
const langSelect = () => `<label class="lang-sel" title="${t("Language")}">${ic("globe")}<select data-live="lang" aria-label="${t("Language")}">${LANGS.map(([c, n]) => `<option value="${c}" ${c === LANG ? "selected" : ""}>${n}</option>`).join("")}</select></label>`;
LIVE.lang = el => { setLang(el.value, true); if (ME) render(); else renderLogin(); };

async function start() {
  try { loadState(await Backend.state()); } catch (e) { return renderLogin(e.message); }
  if (!location.hash || (ME.role === "member") !== curRoute().name.startsWith("p-")) location.hash = ME.role === "member" ? "#/p-home" : "#/dashboard";
  render();
  if (!localStorage.getItem("immora-bcs-tour-" + ME.role)) setTimeout(() => startTour(), 450);
}

/* ---------------------------------------------------------------- layout & router */
function sidebar() {
  const r = curRoute().name, closed = JSON.parse(localStorage.getItem("immora-bcs-nav") || "{}");
  let nav;
  if (ME.role === "member") nav = `<div class="nav-group"><div class="nav-items">${PORTAL_NAV.map(([k, l, i]) => `<a href="#/${k}" class="nav-item ${r === k ? "on" : ""}" id="nav-${k}">${ic(i)}<span>${t(l)}</span></a>`).join("")}</div></div>`;
  else nav = NAV.map(g => {
    const items = g.items.filter(([k]) => routeOK(k)); if (!items.length) return "";
    const has = items.some(([k]) => k === r || (k === "invoices" && r === "invoice") || (k === "contracts" && r === "contract") || (k === "members" && r === "member") || (k === "companies" && r === "company"));
    const isClosed = closed[g.id] && !has;
    return `<div class="nav-group ${isClosed ? "closed" : ""}"><button class="nav-head" data-act="nav-toggle" data-g="${g.id}" aria-expanded="${!isClosed}">${ic(g.icon)}<span>${t(g.label)}</span>${ic("chev", "chev")}</button>
      <div class="nav-items">${items.map(([k, l, i]) => `<a href="#/${k}" class="nav-item ${r === k ? "on" : ""}" id="nav-${k}">${ic(i)}<span>${t(l)}</span></a>`).join("")}</div></div>`;
  }).join("");
  const c = cfg();
  return `<aside class="sidebar" id="sidebar"><div class="side-brand"><img src="${IMMORA_LOGO.mark}" alt="" class="side-mark"><div><b>Immora BCS</b><small>${h(c.tradeName || c.legalName || "")}</small></div></div>
    <nav class="nav" aria-label="${t("Main menu")}">${nav}</nav><div class="side-foot">${t("Powered by Immora")}</div></aside>`;
}
ACT["nav-toggle"] = el => { const g = el.dataset.g, s = JSON.parse(localStorage.getItem("immora-bcs-nav") || "{}"); s[g] = !s[g]; localStorage.setItem("immora-bcs-nav", JSON.stringify(s)); el.parentElement.classList.toggle("closed", s[g]); el.setAttribute("aria-expanded", !s[g]); };
function topbar(title) {
  const quick = ME.role === "member" ? [["p-book", "Book a room"], ["p-ticket-new", "Raise a request"], ["p-guest-new", "Invite a guest"]] : QUICK.filter(q => !q[2] || q[2]()).map(q => [q[0], q[1]]);
  return `<header class="topbar"><button class="btn-icon only-mobile" data-act="menu" aria-label="${t("Menu")}" id="btn-menu">${ic("menu")}</button>
    <h1 class="page-title">${h(t(title || ""))}</h1>
    <button class="search-btn" data-act="palette" id="btn-search">${ic("search")}<span>${t("Search or jump to…")}</span><kbd>Ctrl K</kbd></button>
    <div class="top-actions"><div class="dd"><button class="btn btn-primary btn-sm" data-act="dd" id="btn-new">${ic("plus")}<span class="hide-sm">${t("New")}</span></button>
      <div class="dd-menu">${quick.map(([k, l]) => `<button data-act="quick" data-k="${k}">${t(l)}</button>`).join("")}</div></div>
      <span class="top-lang">${langSelect()}</span><button class="btn-icon" data-act="theme" id="btn-theme" title="${t("Light / dark")}" aria-label="${t("Light / dark")}">${ic(document.documentElement.dataset.theme === "dark" ? "sun" : "moon")}</button>
      <div class="dd"><button class="user-chip" data-act="dd" id="btn-user"><span class="avatar">${h((ME.name || ME.username).slice(0, 1))}</span><span class="hide-sm">${h(ME.name || ME.username)}<small>${L(ME.role)}</small></span></button>
      <div class="dd-menu right"><div class="dd-lang">${langSelect()}</div><button data-act="tour">${t("Take the guided tour")}</button><button data-act="shortcuts">${t("Keyboard shortcuts")}</button><button data-act="password">${t("Change password")}</button>${BUILD_MODE === "offline" && ME.role === "admin" ? `<button data-act="reset-demo">${t("Reset demo data")}</button>` : ""}<button data-act="logout" id="btn-logout">${ic("logout")} ${t("Sign out")}</button></div></div></div></header>`;
}
const QUICK = [["booking", "Room booking", () => can("bookings")], ["member", "Member", () => can("members")], ["lead", "Lead", () => can("leads")], ["visitor", "Visitor", () => can("visitors")],
  ["mailitem", "Mail item", () => can("mail")], ["ticket", "Ticket", () => can("tickets")], ["contract", "Contract", () => can("contracts")], ["invoice", "Invoice", () => can("invoices")], ["charge", "Charge (printing, coffee…)", () => can("charges")]];
ACT.quick = el => { closeDD(); const k = el.dataset.k; const f = { booking: () => bookingModal({}), member: () => memberModal(), lead: () => leadModal(), visitor: () => visitorModal(), mailitem: () => mailModal(), ticket: () => ticketModal(), contract: () => go("contract/new"), invoice: () => go("invoice/new"), charge: () => chargeModal(), "p-book": () => go("p-book"), "p-ticket-new": () => portalTicketModal(), "p-guest-new": () => portalGuestModal() }[k]; if (f) f(); };
ACT.dd = (el, ev) => { ev.stopPropagation(); const m = el.nextElementSibling; const open = m.classList.contains("open"); closeDD(); if (!open) m.classList.add("open"); };
function closeDD() { $$(".dd-menu.open").forEach(m => m.classList.remove("open")); }
ACT.menu = () => document.body.classList.toggle("nav-open");

let renderQueued = false;
function render() {
  if (!ME) return renderLogin();
  const { name, arg } = curRoute();
  document.body.className = "is-app" + (ME.role === "member" ? " is-portal" : "");
  let page = PAGES[name], title = ROUTE_TITLE[name] || "";
  if (!page || (ME.role === "member") !== name.startsWith("p-") || (isStaff() && !routeOK(name))) { page = ME.role === "member" ? PAGES["p-home"] : PAGES.dashboard; title = ME.role === "member" ? "Home" : "Dashboard"; }
  let body;
  try { const out = page(arg); if (out && typeof out === "object") { body = out.html; title = out.title || title; } else body = out; }
  catch (e) { console.error(e); body = `<div class="card"><h3>${t("Something went wrong on this screen")}</h3><p class="hint">${h(e.message)}</p></div>`; }
  const scroll = $("#view") ? $("#view").scrollTop : 0, same = window.__lastRoute === location.hash;
  $("#app").innerHTML = `<div class="shell">${sidebar()}<div class="main">${topbar(title)}<main id="view" class="view" tabindex="-1">${body}</main></div><div class="scrim" data-act="menu"></div></div>`;
  document.title = `${t(title)} · Immora BCS`;
  if (same) $("#view").scrollTop = scroll; window.__lastRoute = location.hash;
  document.body.classList.remove("nav-open");
  const a = AFTER[name]; if (a) try { a(arg); } catch (e) { console.error(e); }
}
window.addEventListener("hashchange", () => { if (ME) render(); });

/* ---------------------------------------------------------------- building blocks */
const pageHead = (title, sub, actions) => `<div class="page-head"><div><h2>${h(title)}</h2>${sub ? `<p class="sub">${sub}</p>` : ""}</div><div class="actions">${actions || ""}</div></div>`;
const btn = (label, a, data, cls, id) => `<button class="btn ${cls || "btn-ghost"}" data-act="${a}" ${Object.entries(data || {}).map(([k, v]) => `data-${k}="${h(v)}"`).join(" ")} ${id ? `id="${id}"` : ""}>${label}</button>`;
const link = (label, route) => `<a href="#/${route}">${h(label)}</a>`;
const chip = (s, tone) => `<span class="chip ${tone || "c-" + String(s).replace(/[^a-z_]/g, "")}">${h(L(s))}</span>`;
const kpi = (label, value, sub, icon, tone, extra) => `<div class="kpi ${tone || ""}"><div class="kpi-ic">${ic(icon || "chart")}</div><div><div class="kpi-l">${h(label)}</div><div class="kpi-v">${value}</div>${sub ? `<div class="kpi-s">${sub}</div>` : ""}</div>${extra || ""}</div>`;
const empty = (msg, action) => `<div class="empty">${ic("file")}<p>${h(msg)}</p>${action || ""}</div>`;
function table(cols, rows, o) {
  o = o || {};
  if (!rows.length) return empty(o.empty || t("Nothing here yet."), o.emptyAction);
  return `<div class="table-wrap"><table class="tbl ${o.cls || ""}" ${o.id ? `id="${o.id}"` : ""}><thead><tr>${cols.map(c => `<th class="${c.cls || ""}">${h(t(c.label))}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r => `<tr ${o.rowAttr ? o.rowAttr(r) : ""}>${cols.map(c => `<td data-label="${h(t(c.label))}" class="${c.cls || ""}">${c.f ? c.f(r) : h(r[c.k])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
const filterBox = (target, ph) => `<div class="filter"><span>${ic("search")}</span><input type="search" data-live="filter" data-target="${target}" placeholder="${h(ph || t("Filter this list…"))}" aria-label="${t("Filter")}"></div>`;
LIVE.filter = el => { const q = el.value.trim().toLowerCase(), tb = document.getElementById(el.dataset.target); if (!tb) return; $$("tbody tr", tb).forEach(tr => tr.hidden = q && !tr.textContent.toLowerCase().includes(q)); };
function fld(label, input, o) { o = o || {}; return `<label class="fld ${o.wide ? "wide" : ""} ${o.cls || ""}"><span class="fl">${h(label)}${o.req ? ' <i class="req">*</i>' : ""}</span>${input}${o.hint ? `<small class="hint">${o.hint}</small>` : ""}<small class="ferr"></small></label>`; }
const inp = (n, v, a) => `<input name="${n}" value="${h(v === undefined || v === null ? "" : v)}" ${a || ""}>`;
const numInp = (n, v, a) => `<input name="${n}" data-type="num" inputmode="decimal" value="${h(v === undefined || v === null ? "" : v)}" ${a || ""}>`;
const dateInp = (n, v, a) => `<input name="${n}" data-type="date" placeholder="DD-MM-YYYY" inputmode="numeric" maxlength="10" value="${h(fmtD(v))}" ${a || ""}>`;
const selInp = (n, list, v, blank, a) => `<select name="${n}" ${a || ""}>${opts(list, v, blank)}</select>`;
const txt = (n, v, a) => `<textarea name="${n}" rows="3" ${a || ""}>${h(v || "")}</textarea>`;
function fieldError(form, field, msg) {
  const el = form && form.querySelector(`[name="${field}"]`); if (!el) return;
  const f = el.closest(".fld"); if (f) { f.classList.add("bad"); const e = $(".ferr", f); if (e) e.textContent = msg; }
  el.focus();
}
function formData(form) {
  const d = {}; let bad = false;
  $$(".fld.bad", form).forEach(f => { f.classList.remove("bad"); const e = $(".ferr", f); if (e) e.textContent = ""; });
  for (const el of form.elements) {
    if (!el.name || el.disabled) continue;
    let v = el.type === "checkbox" ? el.checked : el.value;
    if (el.type === "radio" && !el.checked) continue;
    if (el.multiple) v = Array.from(el.selectedOptions).map(o => o.value);
    if (el.dataset.type === "date" && typeof v === "string") { const p = parseD(v); if (p === null) { fieldError(form, el.name, t("Use DD-MM-YYYY")); bad = true; continue; } v = p; }
    if (el.dataset.type === "num" && typeof v === "string") { v = v.replace(/,/g, "").trim(); if (v !== "" && !isFinite(Number(v))) { fieldError(form, el.name, t("Enter a number")); bad = true; continue; } v = v === "" ? "" : Number(v); }
    if (el.required && (v === "" || v === false)) { fieldError(form, el.name, t("Required")); bad = true; continue; }
    if (el.name.endsWith("[]")) { const k = el.name.slice(0, -2); (d[k] = d[k] || []).push(v); } else d[el.name] = v;
  }
  if (bad) throw new Error("invalid");
  return d;
}
/* type-as-you-go date mask + inline check on blur */
document.addEventListener("input", ev => {
  const el = ev.target;
  if (el.dataset && el.dataset.type === "date" && ev.inputType && ev.inputType.startsWith("insert")) { let v = el.value.replace(/[^\d]/g, "").slice(0, 8); if (v.length > 4) v = v.slice(0, 2) + "-" + v.slice(2, 4) + "-" + v.slice(4); else if (v.length > 2) v = v.slice(0, 2) + "-" + v.slice(2); el.value = v; }
  if (el.dataset && el.dataset.live && LIVE[el.dataset.live] && el.tagName !== "SELECT") LIVE[el.dataset.live](el, ev);
});
document.addEventListener("change", ev => { const el = ev.target; if (el.dataset && el.dataset.live && LIVE[el.dataset.live] && (el.tagName === "SELECT" || el.type === "checkbox")) LIVE[el.dataset.live](el, ev); });
document.addEventListener("focusout", ev => {
  const el = ev.target; if (!el.closest || !el.closest(".fld")) return; const f = el.closest(".fld"), e = $(".ferr", f);
  let msg = "";
  if (el.dataset.type === "date" && el.value && parseD(el.value) === null) msg = t("Use DD-MM-YYYY");
  else if (el.required && !el.value && el.dataset.touched) msg = t("Required");
  else if (el.type === "email" && el.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value)) msg = t("Enter a valid email address");
  el.dataset.touched = "1"; f.classList.toggle("bad", !!msg); if (e) e.textContent = msg;
});
document.addEventListener("submit", async ev => {
  const form = ev.target; const name = form.dataset.form; if (!name || !FORMS[name]) return;
  ev.preventDefault(); let d; try { d = formData(form); } catch (e) { toast(t("Please fix the highlighted fields"), "err"); return; }
  const b = form.querySelector("button[type=submit],button:not([type])"); if (b) b.disabled = true;
  try { await FORMS[name](d, form, ev); } finally { if (b && document.body.contains(b)) b.disabled = false; }
});
document.addEventListener("click", ev => {
  const a = ev.target.closest("[data-act]");
  if (!ev.target.closest(".dd-lang") && (!a || !a.closest(".dd"))) closeDD();
  if (a && ACT[a.dataset.act]) { if (a.tagName === "A" || a.tagName === "BUTTON") ev.preventDefault(); ACT[a.dataset.act](a, ev); return; }
  const g = ev.target.closest("[data-go]"); if (g && !ev.target.closest("a,button,input,select")) go(g.dataset.go);
});

/* ---------------------------------------------------------------- modal */
function modal(title, body, o) {
  o = o || {}; closeModal(true);
  const m = document.createElement("div"); m.className = "modal-bg"; m.id = "modal";
  m.innerHTML = `<div class="modal ${o.wide ? "wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><h3 id="modal-title">${h(title)}</h3><button class="btn-icon" data-act="close-modal" aria-label="${t("Close")}">${ic("x")}</button></div><div class="modal-body">${body}</div></div>`;
  document.body.appendChild(m); window.__modalFocus = document.activeElement;
  setTimeout(() => { const f = m.querySelector("input:not([type=hidden]):not([readonly]),select,textarea,button.btn-primary"); if (f) f.focus(); }, 30);
  m.addEventListener("mousedown", ev => { if (ev.target === m) closeModal(); });
  return m;
}
function closeModal(quiet) { const m = $("#modal"); if (m) m.remove(); if (!quiet && window.__modalFocus && document.body.contains(window.__modalFocus)) try { window.__modalFocus.focus(); } catch (e) { /* ignore */ } }
ACT["close-modal"] = () => closeModal();
function confirmBox(msg, okLabel, danger) {
  return new Promise(res => {
    const m = modal(t("Please confirm"), `<p>${h(msg)}</p><div class="form-foot"><button class="btn btn-ghost" id="cf-no">${t("Cancel")}</button><button class="btn ${danger ? "btn-danger" : "btn-primary"}" id="cf-yes">${h(okLabel || t("OK"))}</button></div>`);
    $("#cf-yes", m).onclick = () => { closeModal(); res(true); }; $("#cf-no", m).onclick = () => { closeModal(); res(false); };
  });
}
function promptBox(title, label, val) {
  return new Promise(res => {
    const m = modal(title, `<form id="pb-form" class="grid-form">${fld(label, `<input name="v" id="pb-v" value="${h(val || "")}" required>`, { wide: true })}<div class="form-foot wide"><button type="button" class="btn btn-ghost" id="pb-no">${t("Cancel")}</button><button class="btn btn-primary" id="pb-ok">${t("OK")}</button></div></form>`);
    $("#pb-form", m).onsubmit = ev => { ev.preventDefault(); const v = $("#pb-v").value.trim(); if (!v) return fieldError($("#pb-form"), "v", t("Required")); closeModal(); res(v); };
    $("#pb-no", m).onclick = () => { closeModal(); res(null); };
  });
}

/* ---------------------------------------------------------------- command palette (Ctrl+K) */
function paletteItems() {
  const items = [];
  if (ME.role === "member") PORTAL_NAV.forEach(([k, l]) => items.push({ label: t(l), hint: t("Page"), run: () => go(k) }));
  else {
    NAV.forEach(g => g.items.forEach(([k, l]) => { if (routeOK(k)) items.push({ label: t(l), hint: t(g.label), run: () => go(k) }); }));
    QUICK.forEach(q => { if (!q[2] || q[2]()) items.push({ label: t("New") + ": " + t(q[1]), hint: t("Action"), run: () => ACT.quick({ dataset: { k: q[0] } }) }); });
    if (canAct("billing_run")) items.push({ label: t("Run billing for this month"), hint: t("Action"), run: () => go("billingrun") });
    if (canAct("card_tap")) items.push({ label: t("Simulate an access-card tap"), hint: t("Action"), run: () => cardTapModal() });
    DB.members.forEach(m => items.push({ label: m.name, hint: t("Member") + (m.companyId ? " · " + ((byId("companies", m.companyId) || {}).legalName || "") : ""), run: () => go("member/" + m.id) }));
    DB.companies.forEach(c => items.push({ label: c.legalName, hint: t("Company"), run: () => go("company/" + c.id) }));
    DB.spaces.forEach(s => items.push({ label: `${s.code} · ${s.name}`, hint: L(s.type), run: () => spaceModal(s.id) }));
    DB.invoices.filter(i => i.number).forEach(i => items.push({ label: `${i.number} · ${(i.customer || {}).name || ""}`, hint: t("Invoice") + " · " + money(i.total), run: () => go("invoice/" + i.id) }));
    DB.contracts.forEach(c => items.push({ label: `${c.number} · ${partyName(c)}`, hint: t("Contract"), run: () => go("contract/" + c.id) }));
    DB.leads.forEach(l => items.push({ label: `${l.name}${l.company ? " · " + l.company : ""}`, hint: t("Lead") + " · " + L(l.stage), run: () => leadModal(l.id) }));
  }
  items.push({ label: t("Switch light / dark"), hint: t("Action"), run: () => ACT.theme() });
  items.push({ label: t("Take the guided tour"), hint: t("Help"), run: () => startTour() });
  return items;
}
ACT.palette = () => {
  const m = modal(t("Search or jump to…"), `<input id="pal-q" class="pal-q" placeholder="${t("Type a page, member, company, invoice, space…")}" autocomplete="off"><div id="pal-list" class="pal-list" role="listbox"></div><p class="hint">↑ ↓ ${t("to move")} · Enter ${t("to open")} · Esc ${t("to close")}</p>`);
  m.classList.add("palette");
  const all = paletteItems(); let sel = 0, shown = [];
  const draw = () => {
    const q = $("#pal-q").value.trim().toLowerCase(); const words = q.split(/\s+/).filter(Boolean);
    shown = all.filter(i => words.every(w => (i.label + " " + i.hint).toLowerCase().includes(w))).slice(0, 40); sel = Math.min(sel, Math.max(0, shown.length - 1));
    $("#pal-list").innerHTML = shown.length ? shown.map((i, n) => `<button class="pal-item ${n === sel ? "on" : ""}" data-n="${n}" role="option"><span>${h(i.label)}</span><small>${h(i.hint)}</small></button>`).join("") : `<p class="hint">${t("No matches")}</p>`;
  };
  draw();
  $("#pal-q").addEventListener("input", () => { sel = 0; draw(); });
  $("#pal-q").addEventListener("keydown", ev => {
    if (ev.key === "ArrowDown") { sel = Math.min(sel + 1, shown.length - 1); draw(); ev.preventDefault(); }
    else if (ev.key === "ArrowUp") { sel = Math.max(sel - 1, 0); draw(); ev.preventDefault(); }
    else if (ev.key === "Enter" && shown[sel]) { ev.preventDefault(); const it = shown[sel]; closeModal(true); it.run(); }
  });
  $("#pal-list").addEventListener("click", ev => { const b = ev.target.closest(".pal-item"); if (b) { const it = shown[Number(b.dataset.n)]; closeModal(true); it.run(); } });
};
document.addEventListener("keydown", ev => {
  if (!ME) return;
  if ((ev.ctrlKey || ev.metaKey) && (ev.key === "k" || ev.key === "K")) { ev.preventDefault(); ACT.palette(); return; }
  if (ev.key === "Escape") { if ($("#tour")) endTour(); else closeModal(); closeDD(); return; }
  const typing = /INPUT|SELECT|TEXTAREA/.test((ev.target.tagName || "")) || ev.target.isContentEditable;
  if (!typing && ev.key === "?" && !$("#modal")) ACT.shortcuts();
  if (!typing && ev.key === "/" && !$("#modal")) { ev.preventDefault(); ACT.palette(); }
});
ACT.shortcuts = () => modal(t("Keyboard shortcuts"), `<table class="tbl"><tbody>
  <tr><td><kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>/</kbd></td><td>${t("Search or jump to any page, member, invoice or space")}</td></tr>
  <tr><td><kbd>Esc</kbd></td><td>${t("Close a window")}</td></tr><tr><td><kbd>?</kbd></td><td>${t("Show this help")}</td></tr>
  <tr><td><kbd>Enter</kbd></td><td>${t("Save the open form")}</td></tr></tbody></table>`);
ACT.password = () => {
  modal(t("Change password"), `<form data-form="password" class="grid-form">${fld(t("Current password"), `<input type="password" name="old" required autocomplete="current-password">`, { wide: true })}${fld(t("New password"), `<input type="password" name="new" required minlength="8" autocomplete="new-password">`, { wide: true, hint: t("At least 8 characters") })}<div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`);
};
FORMS.password = async (d, form) => { try { await Backend.password(d.old, d.new); closeModal(); toast(t("Password changed")); } catch (e) { fail(e, form); } };
ACT["reset-demo"] = async () => { if (await confirmBox(t("Replace all data in this browser with the fictional demo data?"), t("Reset"), true)) { await LocalBackend.resetDemo(); await refresh(); toast(t("Demo data restored")); } };

/* ---------------------------------------------------------------- guided tour */
const TOURS = {
  common: [["#sidebar", "Menu", "Everything is grouped here. Click a heading to open or close its group."], ["#btn-search", "Search anything", "Press Ctrl + K to jump to a page, member, company, invoice or space."], ["#btn-new", "One-click create", "Create a booking, member, visitor, mail item or invoice from any screen."], ["#btn-theme", "Light or dark", "Switch the look any time. Your language choice is next to it."]],
  admin: [["#home-actions", "Your home screen", "Today's key numbers and one-click actions for the centre manager."]],
  frontdesk: [["#home-actions", "Front desk home", "Check in visitors and members, log mail and calls, and see today's rooms."]],
  community: [["#home-actions", "Community home", "Your pipeline, tours and renewals due, with one-click actions."]],
  finance: [["#home-actions", "Finance home", "Draft invoices, overdue balances, billing run and reminders."]],
  viewer: [["#home-actions", "Read-only home", "You can see everything but not change it."]],
  member: [["#portal-actions", "Welcome to your member portal", "Book rooms with your credits, see invoices, raise requests and invite guests."]],
};
let tourStep = 0, TOUR_STEPS = [];
function startTour() {
  if (!ME) return; closeModal(true);
  TOUR_STEPS = (ME.role === "member" ? [] : TOURS.common).concat(TOURS[ME.role] || []).filter(s => $(s[0]) && $(s[0]).getBoundingClientRect().width > 0);
  if (window.innerWidth < 900) TOUR_STEPS = TOUR_STEPS.filter(s => s[0] !== "#sidebar");
  tourStep = 0; drawTour();
}
function drawTour() {
  let o = $("#tour"); if (o) o.remove();
  if (tourStep >= TOUR_STEPS.length) return endTour();
  const [sel, title, text] = TOUR_STEPS[tourStep], el = $(sel); if (!el) { tourStep++; return drawTour(); }
  el.scrollIntoView({ block: "nearest" }); const r = el.getBoundingClientRect();
  o = document.createElement("div"); o.id = "tour"; o.className = "tour";
  const top = Math.min(window.innerHeight - 190, r.bottom + 12), left = Math.max(12, Math.min(window.innerWidth - 332, r.left));
  o.innerHTML = `<div class="tour-hole" style="top:${r.top - 6}px;left:${r.left - 6}px;width:${r.width + 12}px;height:${r.height + 12}px"></div>
    <div class="tour-box" role="dialog" aria-label="${t("Guided tour")}" style="top:${r.bottom + 190 > window.innerHeight ? Math.max(12, r.top - 180) : top}px;left:${left}px"><small>${tourStep + 1} / ${TOUR_STEPS.length}</small><h4>${t(title)}</h4><p>${t(text)}</p>
    <div class="tour-foot"><button class="btn btn-ghost btn-sm" data-act="tour-end">${t("Skip")}</button><button class="btn btn-primary btn-sm" data-act="tour-next" id="tour-next">${tourStep + 1 < TOUR_STEPS.length ? t("Next") : t("Done")}</button></div></div>`;
  document.body.appendChild(o);
}
function endTour() { const o = $("#tour"); if (o) o.remove(); if (ME) localStorage.setItem("immora-bcs-tour-" + ME.role, "1"); }
ACT.tour = () => startTour(); ACT["tour-next"] = () => { tourStep++; drawTour(); }; ACT["tour-end"] = () => endTour();

/* names */
const partyName = r => r.companyId ? ((byId("companies", r.companyId) || {}).legalName || "—") : r.memberId ? ((byId("members", r.memberId) || {}).name || "—") : (r.customerName || "—");
const memberName = id => (byId("members", id) || {}).name || "—";
const spaceName = id => { const s = byId("spaces", id); return s ? `${s.code} · ${s.name}` : "—"; };
const partyOptions = (sel) => `<optgroup label="${t("Companies")}">${DB.companies.filter(c => c.status !== "ended").map(c => `<option value="c:${c.id}" ${sel === "c:" + c.id ? "selected" : ""}>${h(c.legalName)}</option>`).join("")}</optgroup><optgroup label="${t("Members (individuals)")}">${DB.members.filter(m => !m.companyId).map(m => `<option value="m:${m.id}" ${sel === "m:" + m.id ? "selected" : ""}>${h(m.name)}</option>`).join("")}</optgroup>`;
const partyKeyOf = r => r.companyId ? "c:" + r.companyId : r.memberId ? "m:" + r.memberId : "";
const splitParty = v => ({ companyId: v && v.startsWith("c:") ? v.slice(2) : "", memberId: v && v.startsWith("m:") ? v.slice(2) : "" });
const memberOpts = (sel, blank) => opts(DB.members.filter(m => m.status === "active" || m.id === sel).map(m => [m.id, m.name + (m.companyId ? " · " + ((byId("companies", m.companyId) || {}).legalName || "") : "")]), sel, blank === undefined ? t("— choose —") : blank);
