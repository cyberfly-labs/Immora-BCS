/* Reports with charts and CSV export: occupancy, revenue, churn, aged receivables, room utilisation. */
let REP_TAB = "occupancy";
const months = n => Array.from({ length: n }, (_, k) => R.addMonths(R.monthBounds(TODAY)[0], k - n + 1));
function occByMonth(n) {
  return months(n).map(ms => { const mid = R.addDays(ms, 14), [, me] = R.monthBounds(ms), day = mid > TODAY && ms <= TODAY ? TODAY : mid;
    const row = { label: `${ms.slice(5, 7)}-${ms.slice(2, 4)}` };
    for (const ty of ["private_office", "dedicated_desk"]) { const sp = DB.spaces.filter(s => s.type === ty); const occ = sp.filter(s => DB.contracts.some(c => (c.spaceIds || []).includes(s.id) && ["active", "notice", "renewed", "ended"].includes(c.status) && c.start <= day && c.end >= day)).length; row[ty] = sp.length ? Math.round(100 * occ / sp.length) : 0; }
    return row; });
}
function revenueSplit(n) {
  return months(n).map(ms => { const [a, b] = R.monthBounds(ms), row = { label: `${ms.slice(5, 7)}-${ms.slice(2, 4)}`, fee: 0, addon: 0, charge: 0, other: 0 };
    DB.invoices.filter(i => i.number && i.status !== "void" && i.date >= a && i.date <= b).forEach(i => i.lines.forEach(l => { row[["fee", "addon", "charge"].includes(l.kind) ? l.kind : "other"] += l.net; }));
    DB.creditnotes.filter(c => c.date >= a && c.date <= b).forEach(c => row.other -= c.subtotal);
    for (const k of ["fee", "addon", "charge", "other"]) row[k] = R.r2(row[k]); return row; });
}
function churnByMonth(n) {
  return months(n).map(ms => { const [a, b] = R.monthBounds(ms); const live = c => !["draft", "cancelled"].includes(c.status);
    const activeStart = DB.contracts.filter(c => live(c) && c.start < a && c.end >= a).length;
    const ended = DB.contracts.filter(c => live(c) && c.end >= a && c.end <= b && c.status !== "renewed" && !DB.contracts.some(x => x.renewedFrom === c.id)).length;
    const started = DB.contracts.filter(c => live(c) && c.start >= a && c.start <= b && !c.renewedFrom).length;
    return { label: `${ms.slice(5, 7)}-${ms.slice(2, 4)}`, month: ms, activeStart, started, ended, rate: activeStart ? Math.round(1000 * ended / activeStart) / 10 : 0 }; });
}
function roomUtil(days) {
  const c = cfg(), open = (hm2m(c.openTo || "22:00") - hm2m(c.openFrom || "07:00")) / 60, from = R.addDays(TODAY, -days + 1);
  return roomList().map(s => { const hrs = sum(DB.bookings.filter(b => b.spaceId === s.id && b.status !== "cancelled" && b.start.slice(0, 10) >= from && b.start.slice(0, 10) <= TODAY), b => R.hoursBetween(b.start, b.end)); return { label: s.name, hours: R.r2(hrs), value: Math.round(100 * hrs / (open * days)) }; });
}
PAGES.reports = () => {
  const tabs = [["occupancy", "Occupancy"], ["revenue", "Revenue"], ["churn", "Churn"], ["receivables", "Aged receivables"], ["rooms", "Room use"]];
  let body = "";
  if (REP_TAB === "occupancy") { const o = occByMonth(6), now = ["private_office", "dedicated_desk", "hot_desk", "parking", "locker"].map(ty => ({ ty, ...occupancy([ty]) }));
    body = `<div class="kpis">${now.map(x => kpi(L(x.ty), pct(x.pct), `${x.occ}/${x.total - x.maint}${x.maint ? ` · ${x.maint} ${t("in maintenance")}` : ""}`, "building", "blue", meter(x.pct))).join("")}</div>
      <div class="card"><h3>${t("Occupancy by month (mid-month, % of spaces under contract)")}</h3>${stackChart(o.map(r => ({ label: r.label, a: r.private_office, b: r.dedicated_desk })), [["a", L("private_office") + " %", "c1"], ["b", L("dedicated_desk") + " %", "c2"]], { fmt: v => Math.round(v) })}</div>`; }
  if (REP_TAB === "revenue") { const r = revenueSplit(6), top = Object.values(DB.invoices.filter(i => i.number && i.status !== "void" && i.date >= R.addMonths(R.monthBounds(TODAY)[0], -5)).reduce((a, i) => { const n = (i.customer || {}).name; a[n] = a[n] || { name: n, v: 0 }; a[n].v += i.subtotal; return a; }, {})).sort((a, b) => b.v - a.v).slice(0, 10);
    body = `<div class="kpis">${kpi(t("This month (invoiced, before VAT)"), money0(sum(Object.values(r[5]).filter(v => typeof v === "number"))), "", "chart", "green")}${kpi(t("Last 6 months"), money0(sum(r, x => x.fee + x.addon + x.charge + x.other)), "", "chart", "blue")}${kpi(t("Monthly recurring revenue"), money0(mrr()), t("active contracts"), "refresh", "teal")}</div>
      <div class="card"><h3>${t("Revenue by month and type (before VAT)")}</h3>${stackChart(r, [["fee", t("Membership & office fees"), "c1"], ["addon", t("Monthly add-ons"), "c2"], ["charge", t("Charges (printing, coffee, rooms…)"), "c3"], ["other", t("Other / credits"), "c4"]], { fmt: v => Math.round(v / 1000) + "k" })}</div>
      <div class="card"><h3>${t("Top clients (6 months)")}</h3>${table([{ label: "Client", k: "name" }, { label: "Invoiced before VAT", f: x => money(x.v), cls: "num" }], top)}</div>`; }
  if (REP_TAB === "churn") { const c = churnByMonth(6);
    body = `<div class="kpis">${kpi(t("Average monthly churn"), (sum(c, x => x.rate) / c.length).toFixed(1) + "%", t("contracts ending without renewal"), "users", "amber")}${kpi(t("New contracts (6 months)"), sum(c, x => x.started), "", "plus", "green")}${kpi(t("Ended (6 months)"), sum(c, x => x.ended), "", "x", "red")}</div>
      <div class="card"><h3>${t("New vs ended contracts")}</h3>${stackChart(c.map(x => ({ label: x.label, s: x.started, e: x.ended })), [["s", t("New"), "c2"], ["e", t("Ended"), "c5"]], { fmt: v => Math.round(v) })}</div>
      <div class="card">${table([{ label: "Month", k: "label" }, { label: "Active at start", k: "activeStart", cls: "num" }, { label: "New", k: "started", cls: "num" }, { label: "Ended", k: "ended", cls: "num" }, { label: "Churn %", f: x => x.rate + "%", cls: "num" }], c)}</div>`; }
  if (REP_TAB === "receivables") { const rows = Object.values(openInvoices().reduce((a, i) => { const n = (i.customer || {}).name, b = invBal(i), d = R.daysBetween(i.dueDate, TODAY); if (b <= 0) return a; a[n] = a[n] || { name: n, cur: 0, d30: 0, d60: 0, d90: 0, d90p: 0, total: 0 }; a[n][d <= 0 ? "cur" : d <= 30 ? "d30" : d <= 60 ? "d60" : d <= 90 ? "d90" : "d90p"] += b; a[n].total += b; return a; }, {})).sort((a, b) => b.total - a.total);
    body = `<div class="card"><h3>${t("Aged receivables")}</h3>${agingCard()}</div><div class="card">${table([{ label: "Client", k: "name" }, { label: "Current", f: x => money(x.cur, false), cls: "num" }, { label: "1–30 days", f: x => money(x.d30, false), cls: "num" }, { label: "31–60 days", f: x => money(x.d60, false), cls: "num" }, { label: "61–90 days", f: x => money(x.d90, false), cls: "num" }, { label: "90+ days", f: x => money(x.d90p, false), cls: "num" }, { label: "Total", f: x => `<b>${money(x.total)}</b>`, cls: "num" }], rows, { id: "tbl-aging" })}</div>`; }
  if (REP_TAB === "rooms") { const u = roomUtil(30);
    body = `<div class="card"><h3>${t("Meeting-room use, last 30 days (% of opening hours)")}</h3>${barChart(u, { fmt: v => Math.round(v) + "%" })}</div><div class="card">${table([{ label: "Room", k: "label" }, { label: "Hours booked", k: "hours", cls: "num" }, { label: "Use %", f: x => x.value + "%", cls: "num" }], u)}</div>`; }
  return { title: "Reports", html: pageHead(t("Reports"), t("Live from your data. Export any report to CSV."), btn(ic("download") + t("Export CSV"), "rep-csv", {}, "btn-ghost", "btn-rep-csv")) +
    `<div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" class="tab ${REP_TAB === k ? "on" : ""}" data-act="rep-tab" data-t="${k}" id="rep-${k}">${t(l)}</button>`).join("")}</div><div id="report">${body}</div>` };
};
ACT["rep-tab"] = el => { REP_TAB = el.dataset.t; render(); };
ACT["rep-csv"] = () => {
  const m = {
    occupancy: () => csv(occByMonth(6), [["label", "Month"], ["private_office", "Private offices %"], ["dedicated_desk", "Dedicated desks %"]]),
    revenue: () => csv(revenueSplit(6), [["label", "Month"], ["fee", "Fees"], ["addon", "Add-ons"], ["charge", "Charges"], ["other", "Other / credits"]]),
    churn: () => csv(churnByMonth(6), [["label", "Month"], ["activeStart", "Active at start"], ["started", "New"], ["ended", "Ended"], ["rate", "Churn %"]]),
    receivables: () => csv(openInvoices().filter(i => invBal(i) > 0), [["number", "Invoice"], [i => (i.customer || {}).name, "Client"], [i => fmtD(i.dueDate), "Due"], [i => R.daysBetween(i.dueDate, TODAY), "Days overdue"], [i => invBal(i), "Balance"]]),
    rooms: () => csv(roomUtil(30), [["label", "Room"], ["hours", "Hours booked"], ["value", "Use %"]]),
  };
  download(`report-${REP_TAB}-${TODAY}.csv`, m[REP_TAB](), "text/csv"); toast(t("Report exported"));
};
