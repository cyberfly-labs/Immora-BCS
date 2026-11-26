/* Virtual office: business address use on trade licences, mail handling log, call answering notes. */
PAGES.addressuse = () => ({ title: "Business address use", html: pageHead(t("Business address use"), t("Companies using the centre's address on their trade licence. Keep the licence details and dates here."), can("addressuse") ? btn(ic("plus") + t("Add company"), "au-new", {}, "btn-primary") : "") +
  `<div class="card">${table([{ label: "Company", f: a => link((byId("companies", a.companyId) || {}).legalName || "—", "company/" + a.companyId) }, { label: "Trade licence", k: "licenceNo" }, { label: "Authority", k: "authority" }, { label: "Address used", k: "addressText" }, { label: "From", f: a => fmtD(a.from) }, { label: "To", f: a => fmtD(a.to) || "—" },
    { label: "Licence expiry", f: a => { const e = (byId("companies", a.companyId) || {}).licenceExpiry; return e ? fmtD(e) + (e <= R.addDays(TODAY, 45) ? " " + chip("due", "c-warn") : "") : "—"; } }, { label: "Status", f: a => chip(a.status) }], DB.addressuse, { rowAttr: a => can("addressuse") ? `data-act="au-edit" data-id="${a.id}" class="click"` : "" })}</div>
  <div class="card"><h3>${t("Virtual office clients")}</h3>${contractTable(DB.contracts.filter(c => (c.spaceIds || []).some(s => (byId("spaces", s) || {}).type === "virtual_office")))}</div>` });
ACT["au-new"] = () => auModal(); ACT["au-edit"] = el => auModal(el.dataset.id);
function auModal(id) {
  const a = id ? byId("addressuse", id) : { from: TODAY, status: "active", addressText: cfg().address };
  modal(id ? t("Business address use") : t("Add company"), `<form data-form="au" data-id="${h(id || "")}" class="grid-form">${fld(t("Company"), selInp("companyId", DB.companies.map(c => [c.id, c.legalName]), a.companyId, t("— choose —"), "required"), { req: true, wide: true })}
    ${fld(t("Trade licence no."), inp("licenceNo", a.licenceNo, "required"), { req: true })}${fld(t("Licensing authority"), inp("authority", a.authority))}${fld(t("Address as written on the licence"), inp("addressText", a.addressText), { wide: true })}
    ${fld(t("From"), dateInp("from", a.from))}${fld(t("To"), dateInp("to", a.to))}${fld(t("Status"), selInp("status", ["active", "ended"].map(x => [x, L(x)]), a.status))}${fld(t("Notes"), inp("notes", a.notes))}<div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.au = async (d, form) => { const id = form.dataset.id; if (await save("addressuse", Object.assign({}, id ? byId("addressuse", id) : {}, d, { id: id || uid("AU") }), { form })) { closeModal(); render(); } };

PAGES.mail = () => {
  const rows = DB.mail.slice().sort((a, b) => a.received < b.received ? 1 : -1);
  return { title: "Mail log", html: pageHead(t("Mail log"), t("Every letter and parcel received for members and virtual-office clients. One click to notify, mark collected, forwarded or scanned."), (can("mail") ? btn(ic("plus") + t("Log mail"), "mail-new", {}, "btn-primary", "btn-mail-new") : "") + btn(t("Export CSV"), "mail-csv")) +
    `<div class="minis">${SHARED.MAIL_STATUS.map(s => `<div class="mini"><b>${DB.mail.filter(m => m.status === s).length}</b><span>${L(s)}</span></div>`).join("")}</div>
    <div class="card">${filterBox("tbl-mail")}${table([{ label: "Received", f: m => fmtD(m.received) }, { label: "For", f: m => h(partyName(m)) }, { label: "Type", f: m => L(m.type) }, { label: "From", k: "sender" }, { label: "Tracking", k: "tracking" }, { label: "Status", f: m => chip(m.status) },
      { label: "", f: m => can("mail") ? mailButtons(m) : "" }], rows, { id: "tbl-mail" })}</div>` };
};
const mailButtons = m => ({ received: [["notified", "Notify"]], notified: [["collected", "Collected"], ["scanned", "Scanned"], ["forwarded", "Forwarded"]] }[m.status] || []).map(([s, l]) => btn(t(l), "mail-status", { id: m.id, s }, "btn-ghost btn-sm")).join("");
ACT["mail-csv"] = () => download(`mail-${TODAY}.csv`, csv(DB.mail, [[m => fmtD(m.received), "Received"], [m => partyName(m), "For"], ["type", "Type"], ["sender", "From"], ["tracking", "Tracking"], ["status", "Status"], ["notes", "Notes"]]), "text/csv");
ACT["mail-new"] = () => mailModal();
function mailModal() {
  modal(t("Log mail"), `<form data-form="mail" class="grid-form">${fld(t("For"), `<select name="party" required><option value="">${t("— choose —")}</option>${partyOptions("")}</select>`, { req: true, wide: true })}
    ${fld(t("Type"), selInp("type", SHARED.MAIL_TYPES.map(x => [x, L(x)]), "letter"))}${fld(t("From (sender)"), inp("sender", "", "required"), { req: true })}${fld(t("Tracking no."), inp("tracking", ""))}${fld(t("Received"), dateInp("received", TODAY))}
    ${fld(t("Notes"), inp("notes", ""), { wide: true })}<label class="fld check wide"><input type="checkbox" name="notify" checked><span>${t("Notify the client now (simulated email in the Outbox)")}</span></label><div class="form-foot wide"><button class="btn btn-primary" id="btn-mail-save">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.mail = async (d, form) => {
  const p = splitParty(d.party), rec = { id: uid("ML"), companyId: p.companyId, memberId: p.memberId, type: d.type, sender: d.sender, tracking: d.tracking, received: d.received || TODAY, notes: d.notes, status: d.notify ? "notified" : "received" };
  const r = await save("mail", rec, { form, msg: t("Mail logged") }); if (!r) return;
  if (d.notify) await notifyMail(r);
  closeModal(); render();
};
async function notifyMail(m) { const to = m.companyId ? (byId("companies", m.companyId) || {}).email : (byId("members", m.memberId) || {}).email; if (can("outbox")) await save("outbox", { id: uid("OUT"), to: to || partyName(m), subject: `${t("Mail for you")}: ${L(m.type)} ${t("from")} ${m.sender}`, body: `${L(m.type)} ${t("from")} ${m.sender} ${t("received on")} ${fmtD(m.received)}. ${t("Please collect it from reception.")}`, status: "queued", date: TODAY, kind: "mail" }, { toast: false }); }
ACT["mail-status"] = async el => { const m = byId("mail", el.dataset.id); const r = await save("mail", Object.assign({}, m, { status: el.dataset.s, [el.dataset.s + "On"]: TODAY }), { msg: `${t("Mail")}: ${L(el.dataset.s)}` }); if (r) { if (el.dataset.s === "notified") await notifyMail(r); render(); } };

PAGES.calls = () => ({ title: "Call answering", html: pageHead(t("Call answering"), t("Messages taken for virtual-office and member companies."), can("calls") ? btn(ic("plus") + t("Log a call"), "call-new", {}, "btn-primary") : "") +
  `<div class="card">${table([{ label: "When", f: c => fmtDT(c.when) }, { label: "For", f: c => h(partyName(c)) }, { label: "Caller", k: "caller" }, { label: "Number", k: "phone" }, { label: "Message", k: "message" }, { label: "Status", f: c => chip(c.status) },
    { label: "", f: c => can("calls") && c.status !== "closed" ? btn(c.status === "new" ? t("Passed on") : t("Close"), "call-status", { id: c.id, s: c.status === "new" ? "passed_on" : "closed" }, "btn-ghost btn-sm") : "" }], DB.calls.slice().sort((a, b) => a.when < b.when ? 1 : -1))}</div>` });
ACT["call-new"] = () => callModal();
function callModal() {
  modal(t("Log a call"), `<form data-form="call" class="grid-form">${fld(t("For"), `<select name="party" required><option value="">${t("— choose —")}</option>${partyOptions("")}</select>`, { req: true, wide: true })}${fld(t("Caller name"), inp("caller", "", "required"), { req: true })}${fld(t("Call-back number"), inp("phone", "", 'type="tel"'))}
    ${fld(t("Message"), txt("message", "", "required"), { req: true, wide: true })}<div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.call = async (d, form) => { const p = splitParty(d.party); if (await save("calls", { id: uid("CL"), companyId: p.companyId, memberId: p.memberId, caller: d.caller, phone: d.phone, message: d.message, status: "new", when: `${TODAY}T${NOW}` }, { form, msg: t("Call logged") })) { closeModal(); render(); } };
ACT["call-status"] = async el => { const c = byId("calls", el.dataset.id); if (await save("calls", Object.assign({}, c, { status: el.dataset.s }))) render(); };
