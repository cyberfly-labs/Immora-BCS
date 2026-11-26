/* Members, companies, lead pipeline, tours and quotes. */
const planName = id => (byId("plans", id) || {}).name || "—";
PAGES.members = () => {
  const rows = DB.members.slice().sort((a, b) => (a.status === b.status ? a.name.localeCompare(b.name) : a.status === "active" ? -1 : 1));
  return { title: "Members", html: pageHead(t("Members"), `${DB.members.filter(m => m.status === "active").length} ${t("active members")}`, (can("members") ? btn(ic("plus") + t("Add member"), "member-new", {}, "btn-primary", "btn-member-new") : "") + btn(t("Export CSV"), "members-csv")) +
    `<div class="card">${filterBox("tbl-members", t("Filter by name, company, card…"))}${table([{ label: "Name", f: m => `<b>${h(m.name)}</b><small class="sub-line">${h(m.email || "")}</small>` }, { label: "Company", f: m => m.companyId ? h((byId("companies", m.companyId) || {}).legalName) : "—" }, { label: "Plan", f: m => h(planName(m.planId)) },
      { label: "Credits left", f: m => R.creditsLeft(m, TODAY, DB.bookings, DB.plans), cls: "num" }, { label: "Card", f: m => h(m.cardNo || "—") + (m.cardBlocked ? " " + chip("denied") : "") }, { label: "Since", f: m => fmtD(m.start) }, { label: "Status", f: m => chip(m.status) }], rows, { id: "tbl-members", rowAttr: m => `data-go="member/${m.id}" class="click"` })}</div>` };
};
ACT["members-csv"] = () => download(`members-${TODAY}.csv`, csv(DB.members, [["id", "ID"], ["name", "Name"], ["email", "Email"], ["phone", "Phone"], [m => (byId("companies", m.companyId) || {}).legalName || "", "Company"], [m => planName(m.planId), "Plan"], ["cardNo", "Card"], [m => fmtD(m.start), "Start"], ["status", "Status"]]), "text/csv");
ACT["member-new"] = () => memberModal();
function memberModal(id) {
  const m = id ? byId("members", id) : { status: "active", start: TODAY };
  modal(id ? t("Edit member") : t("Add member"), `<form data-form="member" data-id="${h(id || "")}" class="grid-form">
    ${fld(t("Full name"), inp("name", m.name, "required"), { req: true })}${fld(t("Email"), inp("email", m.email, 'type="email"'))}${fld(t("Mobile"), inp("phone", m.phone, 'type="tel"'))}
    ${fld(t("Company"), selInp("companyId", DB.companies.map(c => [c.id, c.legalName]), m.companyId, t("— individual —")))}${fld(t("Plan"), selInp("planId", DB.plans.map(p => [p.id, `${p.name} · ${p.credits} ${t("credits")}`]), m.planId, "—"))}
    ${fld(t("Extra credits this month"), numInp("extraCredits", m.extraCredits || 0))}${fld(t("Access card no."), inp("cardNo", m.cardNo))}${fld(t("Start date"), dateInp("start", m.start), { req: true })}${fld(t("End date"), dateInp("end", m.end))}
    ${fld(t("Status"), selInp("status", ["active", "paused", "ended"].map(x => [x, L(x)]), m.status))}${fld(t("Address (for invoices)"), inp("address", m.address))}${fld(t("TRN (if VAT-registered)"), inp("trn", m.trn))}
    <div class="form-foot wide"><button class="btn btn-primary" id="btn-member-save">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.member = async (d, form) => { const id = form.dataset.id; const r = await save("members", Object.assign({}, id ? byId("members", id) : {}, d, { id: id || nextMemberId() }), { form }); if (r) { closeModal(); id ? render() : go("member/" + r.id); } };
function nextMemberId() { let n = 0; DB.members.forEach(m => { const x = /^M-(\d+)$/.exec(m.id); if (x) n = Math.max(n, Number(x[1])); }); return "M-" + String(n + 1).padStart(4, "0"); }
PAGES.member = id => {
  const m = byId("members", id); if (!m) return empty(t("Member not found."));
  const co = byId("companies", m.companyId), left = R.creditsLeft(m, TODAY, DB.bookings, DB.plans), allow = R.allowance(m, DB.plans);
  const bks = DB.bookings.filter(b => b.memberId === id).sort((a, b) => a.start < b.start ? 1 : -1).slice(0, 12);
  const invs = DB.invoices.filter(i => i.memberId === id || (m.companyId && i.companyId === m.companyId)).sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 8);
  return { title: m.name, html: pageHead(m.name, `${chip(m.status)} ${co ? link(co.legalName, "company/" + co.id) : t("Individual member")} · ${h(planName(m.planId))}`,
    (can("members") ? btn(t("Edit"), "member-edit", { id }) : "") + (can("bookings") ? btn(t("Book a room"), "member-book", { id }, "btn-ghost") : "") + (can("charges") ? btn(t("Add charge"), "member-charge", { id }) : "") + (can("members") ? btn(m.cardBlocked ? t("Unblock card") : t("Block card"), "member-card", { id }, m.cardBlocked ? "btn-ghost" : "btn-danger-ghost") : "") + (ME.role === "admin" ? btn(t("Portal login"), "member-portal", { id }) : "")) +
    `<div class="kpis">${kpi(t("Credits left this month"), `${left} / ${allow}`, t("meeting-room credits"), "cal", "violet", meter(allow ? 100 * left / allow : 0))}${kpi(t("Access card"), h(m.cardNo || "—"), m.cardBlocked ? t("blocked") : t("active"), "card", m.cardBlocked ? "red" : "teal")}${kpi(t("Member since"), fmtD(m.start), m.end ? t("until") + " " + fmtD(m.end) : "", "users", "blue")}${kpi(t("Check-ins (30 days)"), DB.checkins.filter(c => c.memberId === id && c.date >= R.addDays(TODAY, -30)).length, "", "check", "green")}</div>
    <div class="grid-2"><div class="card"><h3>${t("Details")}</h3><dl class="dl"><dt>${t("Email")}</dt><dd>${h(m.email || "—")}</dd><dt>${t("Mobile")}</dt><dd>${h(m.phone || "—")}</dd><dt>${t("Address")}</dt><dd>${h(m.address || "—")}</dd><dt>ID</dt><dd>${h(m.id)}</dd></dl></div>
    <div class="card"><div class="card-head"><h3>${t("Bookings")}</h3></div>${table([{ label: "Date", f: b => fmtD(b.start) }, { label: "Time", f: b => `${b.start.slice(11)}–${b.end.slice(11)}` }, { label: "Room", f: b => h(spaceName(b.spaceId)) }, { label: "Credits", k: "creditsUsed", cls: "num" }, { label: "Status", f: b => chip(b.status) }], bks, { rowAttr: b => `data-act="bk-open" data-id="${b.id}" class="click"` })}</div></div>
    <div class="card"><h3>${t("Invoices")}</h3>${invoiceTable(invs)}</div>` };
};
ACT["member-edit"] = el => memberModal(el.dataset.id);
ACT["member-book"] = el => bookingModal({ memberId: el.dataset.id, date: TODAY });
ACT["member-charge"] = el => chargeModal({ memberId: el.dataset.id });
ACT["member-card"] = async el => { const m = byId("members", el.dataset.id); if (await save("members", Object.assign({}, m, { cardBlocked: !m.cardBlocked }), { msg: m.cardBlocked ? t("Card unblocked") : t("Card blocked") })) render(); };
ACT["member-portal"] = el => { const m = byId("members", el.dataset.id); userModal({ username: (m.email || m.name).split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "."), name: m.name, role: "member", memberId: m.id, isNew: true }); };

PAGES.companies = () => ({ title: "Companies", html: pageHead(t("Companies"), t("Client companies: legal name, trade licence and TRN as printed on tax invoices."), can("companies") ? btn(ic("plus") + t("Add company"), "company-new", {}, "btn-primary") : "") +
  `<div class="card">${filterBox("tbl-co")}${table([{ label: "Legal name", f: c => `<b>${h(c.legalName)}</b>` }, { label: cfg().taxLabel || "TRN", k: "trn" }, { label: "Trade licence", f: c => h(c.licenceNo || "—") + (c.licenceExpiry ? `<small class="sub-line">${t("expires")} ${fmtD(c.licenceExpiry)}</small>` : "") },
    { label: "Members", f: c => DB.members.filter(m => m.companyId === c.id && m.status === "active").length, cls: "num" }, { label: "Monthly value", f: c => money(sum(DB.contracts.filter(x => x.companyId === c.id && contractCovers(x, TODAY)), monthlyValue)), cls: "num" },
    { label: "Balance due", f: c => money(sum(openInvoices().filter(i => i.companyId === c.id), invBal)), cls: "num" }], DB.companies.slice().sort((a, b) => a.legalName.localeCompare(b.legalName)), { id: "tbl-co", rowAttr: c => `data-go="company/${c.id}" class="click"` })}</div>` });
ACT["company-new"] = () => companyModal();
function companyModal(id) {
  const c = id ? byId("companies", id) : { status: "active", since: TODAY }, tl = cfg().taxLabel || "TRN";
  modal(id ? t("Edit company") : t("Add company"), `<form data-form="company" data-id="${h(id || "")}" class="grid-form">
    ${fld(t("Legal name (as on trade licence)"), inp("legalName", c.legalName, "required"), { req: true, wide: true })}${fld(tl, inp("trn", c.trn, 'inputmode="numeric"'), { hint: cfg().taxIdDigits ? `${cfg().taxIdDigits} ${t("digits")}` : "" })}${fld(t("Email (billing)"), inp("email", c.email, 'type="email"'))}
    ${fld(t("Phone"), inp("phone", c.phone))}${fld(t("Trade licence no."), inp("licenceNo", c.licenceNo))}${fld(t("Licensing authority"), inp("licenceAuthority", c.licenceAuthority))}${fld(t("Licence expiry"), dateInp("licenceExpiry", c.licenceExpiry))}
    ${fld(t("Address (printed on invoices)"), txt("address", c.address), { wide: true })}<div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.company = async (d, form) => { const id = form.dataset.id; const r = await save("companies", Object.assign({}, id ? byId("companies", id) : {}, d, { id: id || uid("CO") }), { form }); if (r) { closeModal(); id ? render() : go("company/" + r.id); } };
PAGES.company = id => {
  const c = byId("companies", id); if (!c) return empty(t("Company not found."));
  const ms = DB.members.filter(m => m.companyId === id), cts = DB.contracts.filter(x => x.companyId === id), invs = DB.invoices.filter(i => i.companyId === id).sort((a, b) => a.date < b.date ? 1 : -1);
  return { title: c.legalName, html: pageHead(c.legalName, `${h(cfg().taxLabel || "TRN")} ${h(c.trn || "—")} · ${t("Trade licence")} ${h(c.licenceNo || "—")}`, (can("companies") ? btn(t("Edit"), "company-edit", { id }) : "") + (can("contracts") ? btn(t("New contract"), "company-contract", { id }, "btn-primary") : "") + (can("charges") ? btn(t("Add charge"), "company-charge", { id }) : "")) +
    `<div class="grid-2"><div class="card"><h3>${t("Details")}</h3><dl class="dl"><dt>${t("Address")}</dt><dd>${h(c.address || "—")}</dd><dt>${t("Email")}</dt><dd>${h(c.email || "—")}</dd><dt>${t("Phone")}</dt><dd>${h(c.phone || "—")}</dd><dt>${t("Licensing authority")}</dt><dd>${h(c.licenceAuthority || "—")}</dd><dt>${t("Licence expiry")}</dt><dd>${fmtD(c.licenceExpiry) || "—"}</dd></dl></div>
    <div class="card"><h3>${t("Members")}</h3>${table([{ label: "Name", f: m => link(m.name, "member/" + m.id) }, { label: "Plan", f: m => h(planName(m.planId)) }, { label: "Status", f: m => chip(m.status) }], ms)}</div></div>
    <div class="card"><h3>${t("Contracts")}</h3>${contractTable(cts)}</div><div class="card"><h3>${t("Invoices")}</h3>${invoiceTable(invs)}</div>` };
};
ACT["company-edit"] = el => companyModal(el.dataset.id);
ACT["company-contract"] = el => go("contract/new?party=c:" + el.dataset.id);
ACT["company-charge"] = el => chargeModal({ companyId: el.dataset.id });

/* ---------------- lead pipeline */
PAGES.leads = () => {
  const cols = SHARED.LEAD_STAGES;
  return { title: "Lead pipeline", html: pageHead(t("Lead pipeline"), t("Move a lead along with one click. Book a tour, send a quote, then convert it to a member."), (can("leads") ? btn(ic("plus") + t("New lead"), "lead-new", {}, "btn-primary", "btn-lead-new") : "") + btn(t("Export CSV"), "leads-csv")) +
    `<div class="kanban" id="pipeline">${cols.map(st => { const l = DB.leads.filter(x => x.stage === st); return `<div class="kcol k-${st}"><div class="khead"><b>${L(st)}</b><span>${l.length}</span><small>${money0(sum(l, x => x.budget))}</small></div>
      ${l.map(x => `<div class="kcard" data-act="lead-open" data-id="${x.id}" role="button" tabindex="0"><b>${h(x.name)}</b><small>${h(x.company || t("Individual"))}</small><div class="kmeta">${chip(x.interest || "other", "c-type")}<span>${money0(x.budget)}</span></div>
        ${can("leads") && !["won", "lost"].includes(st) ? `<div class="kact"><button class="mini-btn" data-act="lead-move" data-id="${x.id}" data-d="1" title="${t("Move to next stage")}">${t("Next")} ›</button></div>` : ""}</div>`).join("")}</div>`; }).join("")}</div>` };
};
ACT["leads-csv"] = () => download(`leads-${TODAY}.csv`, csv(DB.leads, [["name", "Name"], ["company", "Company"], ["email", "Email"], ["phone", "Phone"], ["stage", "Stage"], ["interest", "Interest"], ["budget", "Budget / month"], ["source", "Source"], [l => fmtD(l.created), "Created"]]), "text/csv");
ACT["lead-new"] = () => leadModal();
ACT["lead-open"] = el => leadModal(el.dataset.id);
ACT["lead-move"] = async (el, ev) => { ev.stopPropagation(); const l = byId("leads", el.dataset.id), i = SHARED.LEAD_STAGES.indexOf(l.stage); const nx = SHARED.LEAD_STAGES[Math.min(i + 1, 5)]; if (await save("leads", Object.assign({}, l, { stage: nx }), { msg: `${l.name} → ${L(nx)}` })) render(); };
function leadModal(id) {
  const l = id ? byId("leads", id) : { stage: "new", interest: "private_office", source: "Website", created: TODAY };
  const tours = id ? DB.tours.filter(x => x.leadId === id) : [], quotes = id ? DB.quotes.filter(q => q.leadId === id) : [];
  modal(id ? l.name : t("New lead"), `<form data-form="lead" data-id="${h(id || "")}" class="grid-form">
    ${fld(t("Name"), inp("name", l.name, "required"), { req: true })}${fld(t("Company"), inp("company", l.company))}${fld(t("Email"), inp("email", l.email, 'type="email"'))}${fld(t("Mobile"), inp("phone", l.phone))}
    ${fld(t("Stage"), selInp("stage", SHARED.LEAD_STAGES.map(x => [x, L(x)]), l.stage))}${fld(t("Interested in"), selInp("interest", SHARED.SPACE_TYPES.map(x => [x, L(x)]), l.interest))}
    ${fld(t("Budget / month"), numInp("budget", l.budget))}${fld(t("Source"), selInp("source", ["Website", "Walk-in", "Referral", "Broker", "Google", "Instagram", "LinkedIn", "Other"], l.source))}
    ${fld(t("Notes"), txt("notes", l.notes), { wide: true })}
    ${id ? `<div class="wide"><h4>${t("Tours")}</h4>${tours.length ? tourList(tours) : `<p class="hint">${t("No tours yet.")}</p>`}<h4>${t("Quotes")}</h4>${quotes.length ? quotes.map(q => `<p>${link(q.number, "quote/" + q.id)} · ${money(q.total)} · ${chip(q.status)}</p>`).join("") : `<p class="hint">${t("No quotes yet.")}</p>`}</div>` : ""}
    <div class="form-foot wide">${id && can("tours") ? btn(t("Book a tour"), "lead-tour", { id }) : ""}${id && can("quotes") ? btn(t("Create quote"), "lead-quote", { id }) : ""}${id && canAct("convert_lead") && !l.memberId ? btn(t("Convert to member"), "lead-convert", { id }, "btn-ghost", "btn-lead-convert") : ""}${l.memberId ? link(t("Open member"), "member/" + l.memberId) : ""}${can("leads") ? `<button class="btn btn-primary">${t("Save")}</button>` : ""}</div></form>`, { wide: true });
}
FORMS.lead = async (d, form) => { const id = form.dataset.id; if (await save("leads", Object.assign({}, id ? byId("leads", id) : {}, d, { id: id || uid("LD") }), { form })) { closeModal(); render(); } };
ACT["lead-tour"] = el => tourModal({ leadId: el.dataset.id });
ACT["lead-quote"] = el => { closeModal(true); go("quote/new?lead=" + el.dataset.id); };
ACT["lead-convert"] = async el => {
  const l = byId("leads", el.dataset.id);
  modal(t("Convert to member"), `<form data-form="convert" data-id="${l.id}" class="grid-form"><p class="wide">${t("Creates the member")}${l.company ? " " + t("and the company") : ""} ${t("and marks the lead as won.")}</p>${fld(t("Plan"), selInp("planId", DB.plans.map(p => [p.id, p.name]), "", "—"), { wide: true })}<div class="form-foot wide"><button class="btn btn-primary" id="btn-convert-go">${t("Convert")}</button></div></form>`);
};
FORMS.convert = async (d, form) => { const r = await act("convert_lead", { id: form.dataset.id, planId: d.planId }, t("Member created")); if (r) { closeModal(); go("member/" + r.memberId); } };

/* ---------------- tours */
function tourList(l) { return l.length ? `<ul class="timeline">${l.map(x => { const ld = byId("leads", x.leadId); return `<li><b>${fmtDT(x.when)}</b><span>${h(ld ? ld.name + (ld.company ? " · " + ld.company : "") : x.name || "")}</span><small>${chip(x.status)} ${can("tours") && x.status === "booked" ? btn(t("Done"), "tour-done", { id: x.id }, "mini-btn") : ""}</small></li>`; }).join("")}</ul>` : empty(t("No tours booked.")); }
PAGES.tours = () => ({ title: "Tours", html: pageHead(t("Tours"), t("Show prospects around. Mark a tour done to move the lead on."), can("tours") ? btn(ic("plus") + t("Book a tour"), "tour-new", {}, "btn-primary") : "") +
  `<div class="card">${table([{ label: "When", f: x => fmtDT(x.when) }, { label: "Lead", f: x => { const l = byId("leads", x.leadId); return l ? `<a href="#" data-act="lead-open" data-id="${l.id}">${h(l.name)}</a>` : h(x.name || ""); } }, { label: "Company", f: x => h((byId("leads", x.leadId) || {}).company || "") }, { label: "Status", f: x => chip(x.status) }, { label: "", f: x => can("tours") && x.status === "booked" ? btn(t("Done"), "tour-done", { id: x.id }, "btn-ghost btn-sm") + btn(L("no_show"), "tour-noshow", { id: x.id }, "btn-ghost btn-sm") : "" }], DB.tours.slice().sort((a, b) => a.when < b.when ? 1 : -1))}</div>` });
ACT["tour-new"] = () => tourModal();
function tourModal(o) {
  o = o || {};
  modal(t("Book a tour"), `<form data-form="tour" class="grid-form">${fld(t("Lead"), selInp("leadId", DB.leads.filter(l => !["won", "lost"].includes(l.stage)).map(l => [l.id, l.name + (l.company ? " · " + l.company : "")]), o.leadId, t("— choose —")), { wide: true })}
    ${fld(t("Date"), dateInp("date", R.addDays(TODAY, 1), "required"), { req: true })}${fld(t("Time"), `<select name="time">${timeOpts("11:00", 8, 20)}</select>`)}${fld(t("Notes"), inp("notes", ""), { wide: true })}<div class="form-foot wide"><button class="btn btn-primary">${t("Book tour")}</button></div></form>`);
}
FORMS.tour = async (d, form) => { const r = await save("tours", { id: uid("TR"), leadId: d.leadId, when: `${d.date}T${d.time}`, status: "booked", notes: d.notes, staff: ME.username }, { form, msg: t("Tour booked") }); if (r) { const l = byId("leads", d.leadId); if (l && ["new", "contacted"].includes(l.stage)) await save("leads", Object.assign({}, l, { stage: "tour" }), { toast: false }); closeModal(); render(); } };
ACT["tour-done"] = async el => { const x = byId("tours", el.dataset.id); if (await save("tours", Object.assign({}, x, { status: "done" }))) { const l = byId("leads", x.leadId); if (l && SHARED.LEAD_STAGES.indexOf(l.stage) < 3) await save("leads", Object.assign({}, l, { stage: "proposal" }), { toast: false }); render(); } };
ACT["tour-noshow"] = async el => { const x = byId("tours", el.dataset.id); if (await save("tours", Object.assign({}, x, { status: "no_show" }))) render(); };

/* ---------------- quotes */
PAGES.quotes = () => ({ title: "Quotes", html: pageHead(t("Quotes"), t("Proposals for leads and clients. Prices are example placeholders."), can("quotes") ? btn(ic("plus") + t("New quote"), "quote-new", {}, "btn-primary") : "") +
  `<div class="card">${table([{ label: "Number", f: q => `<b>${h(q.number)}</b>` }, { label: "Date", f: q => fmtD(q.date) }, { label: "For", f: q => h(q.leadId ? ((byId("leads", q.leadId) || {}).company || (byId("leads", q.leadId) || {}).name) : partyName(q)) }, { label: "Valid until", f: q => fmtD(q.validUntil) }, { label: "Total", f: q => money(q.total), cls: "num" }, { label: "Status", f: q => chip(q.status) }], DB.quotes.slice().sort((a, b) => a.date < b.date ? 1 : -1), { rowAttr: q => `data-go="quote/${q.id}" class="click"` })}</div>` });
ACT["quote-new"] = () => go("quote/new");
PAGES.quote = arg => {
  const isNew = arg.startsWith("new"), q = isNew ? { lines: [{ desc: "", qty: 1, price: 0 }], date: TODAY, validUntil: R.addDays(TODAY, 14), status: "draft", leadId: (/lead=([^&]+)/.exec(arg) || [])[1] || "" } : byId("quotes", arg);
  if (!q) return empty(t("Quote not found."));
  const ro = !can("quotes");
  return { title: isNew ? "New quote" : q.number, html: pageHead(isNew ? t("New quote") : `${t("Quote")} ${q.number}`, isNew ? "" : chip(q.status), !isNew ? btn(ic("print") + t("Print"), "print-doc", { kind: "quote", id: q.id }) : "") +
    `<form data-form="quote" data-id="${h(isNew ? "" : q.id)}" class="card grid-form" id="quote-form">
      ${fld(t("Lead"), selInp("leadId", DB.leads.map(l => [l.id, l.name + (l.company ? " · " + l.company : "")]), q.leadId, "—"))}${fld(t("Or client"), `<select name="party"><option value="">—</option>${partyOptions(partyKeyOf(q))}</select>`)}
      ${fld(t("Date"), dateInp("date", q.date))}${fld(t("Valid until"), dateInp("validUntil", q.validUntil))}${fld(t("Status"), selInp("status", ["draft", "sent", "accepted", "declined", "expired"].map(x => [x, L(x)]), q.status))}
      <div class="wide">${linesEditor(q.lines, ro)}</div>${fld(t("Notes"), txt("notes", q.notes), { wide: true })}
      <div class="form-foot wide">${ro ? "" : `<button class="btn btn-primary">${t("Save quote")}</button>`}</div></form>` };
};
FORMS.quote = async (d, form) => { const id = form.dataset.id, p = splitParty(d.party); const rec = Object.assign({}, id ? byId("quotes", id) : {}, { leadId: d.leadId, companyId: p.companyId, memberId: p.memberId, date: d.date, validUntil: d.validUntil, status: d.status, notes: d.notes, lines: readLines(form), id: id || uid("Q") }); const r = await save("quotes", rec, { form }); if (r) go("quote/" + r.id); };

function pipelineMini() {
  const open = DB.leads.filter(l => !["won", "lost"].includes(l.stage)), max = Math.max(1, ...SHARED.LEAD_STAGES.map(st => DB.leads.filter(l => l.stage === st).length));
  return `<div class="pipe-mini">${SHARED.LEAD_STAGES.filter(st => st !== "lost").map(st => { const n = DB.leads.filter(l => l.stage === st).length; return `<div class="pm-row"><span>${h(L(st))}</span>${meter(100 * n / max, st === "won" ? "teal" : "")}<b>${n}</b></div>`; }).join("")}
    <p class="muted small">${t("Open leads")}: <b>${open.length}</b> · ${t("Pipeline value")}: <b>${money(open.reduce((a, l) => a + (+l.budget || 0), 0))}</b>/${t("mo")}</p></div>`;
}
