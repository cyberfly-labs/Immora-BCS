/* Role home screens + shared calculations. */
function contractCovers(c, day) { return ["active", "notice"].includes(c.status) && c.start <= day && c.end >= day; }
function spaceState(s, day) {
  day = day || TODAY;
  if (s.status === "maintenance") return "maintenance";
  if (["meeting_room", "event_space"].includes(s.type)) return DB.bookings.some(b => b.spaceId === s.id && b.status !== "cancelled" && b.start <= `${TODAY}T${NOW}` && b.end > `${TODAY}T${NOW}`) ? "occupied" : "available";
  if (s.type === "virtual_office") return "available";
  const c = DB.contracts.find(c => (c.spaceIds || []).includes(s.id) && contractCovers(c, day));
  if (c) return "occupied";
  if (s.status === "reserved" || DB.contracts.some(c => (c.spaceIds || []).includes(s.id) && c.status === "draft")) return "reserved";
  return "available";
}
function holderOf(s) { const c = DB.contracts.find(c => (c.spaceIds || []).includes(s.id) && contractCovers(c, TODAY)); return c ? { contract: c, name: partyName(c) } : null; }
function occupancy(types) {
  const list = DB.spaces.filter(s => types.includes(s.type));
  const occ = list.filter(s => spaceState(s) === "occupied").length, maint = list.filter(s => s.status === "maintenance").length;
  return { total: list.length, occ, maint, pct: list.length ? 100 * occ / Math.max(1, list.length - maint) : 0 };
}
const monthlyValue = c => Number(c.monthlyFee || 0) + sum(c.addons || [], a => Number(a.qty || 0) * Number(a.price || 0));
const mrr = () => sum(DB.contracts.filter(c => contractCovers(c, TODAY)), monthlyValue);
const openInvoices = () => DB.invoices.filter(i => ["issued", "part_paid"].includes(i.status));
const invBal = i => R.balance(i, DB);
const overdue = () => openInvoices().filter(i => i.dueDate < TODAY && invBal(i) > 0);
const todaysBookings = () => DB.bookings.filter(b => b.start.slice(0, 10) === TODAY && b.status !== "cancelled").sort((a, b) => a.start < b.start ? -1 : 1);
function noticeList() { return DB.contracts.filter(c => R.noticeDue(c, TODAY)[1]).sort((a, b) => a.end < b.end ? -1 : 1); }
function revenueByMonth(n) {
  const out = []; for (let k = n - 1; k >= 0; k--) { const ms = R.addMonths(R.monthBounds(TODAY)[0], -k), [a, b] = R.monthBounds(ms);
    const inv = DB.invoices.filter(i => i.number && i.status !== "void" && i.date >= a && i.date <= b), cn = DB.creditnotes.filter(c => c.date >= a && c.date <= b);
    out.push({ label: `${ms.slice(5, 7)}-${ms.slice(2, 4)}`, month: ms, value: R.r2(sum(inv, i => i.subtotal) - sum(cn, c => c.subtotal)), vat: R.r2(sum(inv, i => i.vatTotal) - sum(cn, c => c.vatTotal)) }); }
  return out;
}

PAGES.dashboard = () => {
  const r = ME.role, c = cfg();
  const occO = occupancy(["private_office"]), occD = occupancy(["dedicated_desk"]), od = overdue(), rev = revenueByMonth(6);
  const tb = todaysBookings(), vis = DB.visitors.filter(v => v.date === TODAY && v.status !== "cancelled"), mailNew = DB.mail.filter(m => m.status === "received");
  const tickets = DB.tickets.filter(x => ["open", "in_progress", "waiting"].includes(x.status)), notices = noticeList();
  const drafts = DB.invoices.filter(i => i.status === "draft");
  const hello = `${t("Good day")}, ${h((ME.name || "").split(" ")[0])}`;
  const actions = {
    admin: [["booking", "New booking", "cal"], ["member", "Add member", "users"], ["go:billingrun", "Run billing", "refresh"], ["go:contract/new", "New contract", "file"], ["go:floorplan", "Floor plan", "map"], ["go:reports", "Reports", "chart"]],
    frontdesk: [["visitor", "Register visitor", "qr"], ["go:checkin", "Member check-in", "check"], ["mailitem", "Log mail", "mail"], ["call", "Log a call", "phone"], ["cardtap", "Card tap (simulated)", "card"], ["ticket", "New ticket", "ticket"]],
    community: [["lead", "New lead", "funnel"], ["tour", "Book a tour", "door"], ["go:quote/new", "New quote", "file"], ["go:contract/new", "New contract", "file"], ["booking", "New booking", "cal"], ["go:renewals", "Renewals", "bell"]],
    finance: [["go:billingrun", "Run billing", "refresh"], ["dunning", "Send reminders", "alert"], ["receipt", "Record payment", "receipt"], ["go:invoice/new", "New invoice", "bill"], ["charge", "Add charge", "coffee"], ["go:books", "Export to Books", "download"]],
    viewer: [["go:reports", "Reports", "chart"], ["go:floorplan", "Floor plan", "map"], ["go:calendar", "Room calendar", "cal"], ["go:invoices", "Invoices", "bill"]],
  }[r] || [];
  const actHtml = `<div class="quick-grid" id="home-actions">${actions.map(([k, l, i]) => `<button class="quick" data-act="home-act" data-k="${k}">${ic(i)}<span>${t(l)}</span></button>`).join("")}</div>`;
  const k = [];
  if (r !== "frontdesk") k.push(kpi(t("Office occupancy"), pct(occO.pct), `${occO.occ}/${occO.total - occO.maint} ${t("offices")}`, "building", "blue", meter(occO.pct)));
  if (r === "frontdesk") k.push(kpi(t("Visitors today"), vis.length, `${vis.filter(v => v.status === "checked_in").length} ${t("in the building")}`, "qr", "blue"));
  k.push(kpi(t("Desk occupancy"), pct(occD.pct), `${occD.occ}/${occD.total} ${t("dedicated desks")}`, "grid", "teal", meter(occD.pct, "teal")));
  k.push(kpi(t("Room bookings today"), tb.length, `${sum(tb, b => R.hoursBetween(b.start, b.end)).toFixed(1)} ${t("hours booked")}`, "cal", "violet"));
  if (["admin", "finance", "viewer"].includes(r)) { k.push(kpi(t("Monthly recurring revenue"), money0(mrr()), t("active contracts, before VAT"), "chart", "green", spark(rev.map(x => x.value)))); k.push(kpi(t("Overdue"), money0(sum(od, invBal)), `${od.length} ${t("invoices")}`, "alert", od.length ? "red" : "green")); }
  if (r === "community") { k.push(kpi(t("Open leads"), DB.leads.filter(l => !["won", "lost"].includes(l.stage)).length, money0(sum(DB.leads.filter(l => !["won", "lost"].includes(l.stage)), l => l.budget)) + " " + t("/month potential"), "funnel", "green")); k.push(kpi(t("Renewals due"), notices.length, t("in the notice window"), "bell", notices.length ? "amber" : "green")); }
  if (r === "frontdesk") { k.push(kpi(t("Mail to hand out"), mailNew.length, t("received, not yet notified"), "mail", mailNew.length ? "amber" : "green")); k.push(kpi(t("Open tickets"), tickets.length, "", "ticket", "red")); }
  const bookingsCard = `<div class="card"><div class="card-head"><h3>${t("Today's rooms")}</h3>${link(t("Open calendar"), "calendar")}</div>${tb.length ? `<ul class="timeline">${tb.map(b => `<li><b>${b.start.slice(11)}–${b.end.slice(11)}</b><span>${h(spaceName(b.spaceId))}</span><small>${h(memberName(b.memberId))} · ${h(b.title || "")}</small></li>`).join("")}</ul>` : empty(t("No rooms booked today."))}</div>`;
  const alerts = [];
  notices.slice(0, 4).forEach(x => alerts.push(`<li>${ic("bell")}<span>${link(x.number, "contract/" + x.id)} ${h(partyName(x))} — ${t("ends")} ${fmtD(x.end)}, ${t("notice by")} ${fmtD(R.noticeDue(x, TODAY)[0])}</span></li>`));
  od.slice(0, 4).forEach(i => alerts.push(`<li class="bad">${ic("alert")}<span>${link(i.number, "invoice/" + i.id)} ${h((i.customer || {}).name)} — ${money(invBal(i))} ${t("overdue since")} ${fmtD(i.dueDate)}</span></li>`));
  if (drafts.length && ["admin", "finance"].includes(r)) alerts.push(`<li>${ic("bill")}<span>${drafts.length} ${t("draft invoices waiting to be issued")} — ${link(t("review"), "invoices")}</span></li>`);
  DB.companies.filter(x => x.licenceExpiry && x.licenceExpiry <= R.addDays(TODAY, 45)).slice(0, 3).forEach(x => alerts.push(`<li>${ic("file")}<span>${h(x.legalName)} — ${t("trade licence expires")} ${fmtD(x.licenceExpiry)}</span></li>`));
  const alertCard = `<div class="card"><div class="card-head"><h3>${t("Needs attention")}</h3></div>${alerts.length ? `<ul class="alerts">${alerts.join("")}</ul>` : empty(t("All clear."))}</div>`;
  let mid = "";
  if (r === "frontdesk") mid = `<div class="grid-2"><div class="card"><div class="card-head"><h3>${t("Visitors today")}</h3>${link(t("All visitors"), "visitors")}</div>${visitorList(vis)}</div>${bookingsCard}</div>
     <div class="grid-2"><div class="card"><div class="card-head"><h3>${t("Mail waiting")}</h3>${link(t("Mail log"), "mail")}</div>${table([{ label: "For", f: m => h(partyName(m)) }, { label: "Type", f: m => L(m.type) }, { label: "From", k: "sender" }, { label: "", f: m => can("mail") ? btn(t("Notify"), "mail-status", { id: m.id, s: "notified" }, "btn-ghost btn-sm") : "" }], mailNew)}</div>
     <div class="card"><div class="card-head"><h3>${t("Open tickets")}</h3>${link(t("Helpdesk"), "tickets")}</div>${ticketMini(tickets)}</div></div>`;
  else if (r === "community") mid = `<div class="grid-2"><div class="card"><div class="card-head"><h3>${t("Pipeline")}</h3>${link(t("Open pipeline"), "leads")}</div>${pipelineMini()}</div>
     <div class="card"><div class="card-head"><h3>${t("Upcoming tours")}</h3>${link(t("All tours"), "tours")}</div>${tourList(DB.tours.filter(x => x.status === "booked" && x.when.slice(0, 10) >= TODAY).sort((a, b) => a.when < b.when ? -1 : 1).slice(0, 6))}</div></div><div class="grid-2">${bookingsCard}${alertCard}</div>`;
  else if (r === "finance") mid = `<div class="grid-2"><div class="card"><div class="card-head"><h3>${t("Revenue (6 months, before VAT)")}</h3>${link(t("Reports"), "reports")}</div>${barChart(rev, { fmt: v => Math.round(v / 1000) + "k", label: t("Revenue") })}</div>
     <div class="card"><div class="card-head"><h3>${t("Aged receivables")}</h3>${link(t("Overdue & reminders"), "dunning")}</div>${agingCard()}</div></div>${alertCard}`;
  else mid = `<div class="grid-2"><div class="card"><div class="card-head"><h3>${t("Revenue (6 months, before VAT)")}</h3>${link(t("Reports"), "reports")}</div>${barChart(rev, { fmt: v => Math.round(v / 1000) + "k", label: t("Revenue") })}</div>
     <div class="card"><div class="card-head"><h3>${t("Space status now")}</h3>${link(t("Floor plan"), "floorplan")}</div>${spaceDonut()}</div></div><div class="grid-2">${bookingsCard}${alertCard}</div>`;
  return { title: "Dashboard", html: `<div class="hero"><div><h2>${hello}</h2><p class="sub">${h(c.tradeName || c.legalName || "")} · ${fmtD(TODAY)} · ${L(ME.role)}${ME.role === "viewer" ? " · " + t("read-only") : ""}</p></div></div>${actHtml}<div class="kpis">${k.join("")}</div>${mid}` };
};
ACT["home-act"] = el => { const k = el.dataset.k; if (k.startsWith("go:")) return go(k.slice(3)); ({ booking: () => bookingModal({}), member: () => memberModal(), visitor: () => visitorModal(), mailitem: () => mailModal(), call: () => callModal(), cardtap: () => cardTapModal(), ticket: () => ticketModal(), lead: () => leadModal(), tour: () => tourModal(), dunning: () => go("dunning"), receipt: () => receiptModal(), charge: () => chargeModal() })[k](); };
function spaceDonut() {
  const st = { available: 0, occupied: 0, reserved: 0, maintenance: 0 };
  DB.spaces.filter(s => ["private_office", "dedicated_desk", "hot_desk", "meeting_room", "event_space"].includes(s.type)).forEach(s => st[spaceState(s)]++);
  return donut([{ label: L("occupied"), value: st.occupied, cls: "s-occ" }, { label: L("available"), value: st.available, cls: "s-av" }, { label: L("reserved"), value: st.reserved, cls: "s-res" }, { label: L("maintenance"), value: st.maintenance, cls: "s-mt" }], { center: String(st.occupied), sub: t("in use") });
}
function agingBuckets() {
  const b = [["Current", 0], ["1–30 days", 0], ["31–60 days", 0], ["61–90 days", 0], ["90+ days", 0]];
  for (const i of openInvoices()) { const bal = invBal(i); if (bal <= 0) continue; const d = R.daysBetween(i.dueDate, TODAY); b[d <= 0 ? 0 : d <= 30 ? 1 : d <= 60 ? 2 : d <= 90 ? 3 : 4][1] += bal; }
  return b;
}
function agingCard() { const b = agingBuckets(); return barChart(b.map(([l, v], i) => ({ label: t(l), value: R.r2(v), cls: ["ok", "warn", "warn2", "bad", "bad2"][i] })), { fmt: v => money0(v).replace(CUR() + " ", ""), label: t("Aged receivables") }); }
