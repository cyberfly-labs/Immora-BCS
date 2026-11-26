/* Contracts / office agreements, Ejari-ready fields, deposits, renewals and notice reminders. */
function contractTable(list) {
  return table([{ label: "Number", f: c => `<b>${h(c.number)}</b>` }, { label: "Client", f: c => h(partyName(c)) }, { label: "Spaces", f: c => h((c.spaceIds || []).map(s => (byId("spaces", s) || {}).code).join(", ")) }, { label: "Term", f: c => `${fmtD(c.start)} → ${fmtD(c.end)}` },
    { label: "Monthly", f: c => money(monthlyValue(c)), cls: "num" }, { label: "Deposit", f: c => c.deposit ? `${money(c.deposit)} ${chip(c.depositStatus)}` : "—" }, { label: "Status", f: c => chip(c.status) + (R.noticeDue(c, TODAY)[1] ? " " + chip("notice", "c-warn") : "") }],
    list.slice().sort((a, b) => (a.number || "") < (b.number || "") ? 1 : -1), { id: "tbl-ct", rowAttr: c => `data-go="contract/${c.id}" class="click"` });
}
PAGES.contracts = () => {
  const act = DB.contracts.filter(c => contractCovers(c, TODAY));
  return { title: "Contracts", html: pageHead(t("Contracts"), `${act.length} ${t("active")} · ${money(mrr())} ${t("/ month before VAT")}`, (can("contracts") ? btn(ic("plus") + t("New contract"), "ct-new", {}, "btn-primary", "btn-ct-new") : "") + btn(t("Export CSV"), "ct-csv")) +
    `<div class="card">${filterBox("tbl-ct")}${contractTable(DB.contracts)}</div>` };
};
ACT["ct-new"] = () => go("contract/new");
ACT["ct-csv"] = () => download(`contracts-${TODAY}.csv`, csv(DB.contracts, [["number", "Number"], [c => partyName(c), "Client"], [c => (c.spaceIds || []).map(s => (byId("spaces", s) || {}).code).join(" "), "Spaces"], [c => fmtD(c.start), "Start"], [c => fmtD(c.end), "End"], ["monthlyFee", "Monthly fee"], ["deposit", "Deposit"], ["depositStatus", "Deposit status"], ["noticeDays", "Notice days"], ["status", "Status"], [c => (c.ejari || {}).contractNo || "", "Ejari contract no."]]), "text/csv");

const EJARI_FIELDS = [["contractNo", "Ejari contract no. (after you register)"], ["unitNo", "Unit / office no."], ["plotNo", "Plot no."], ["makani", "Makani no."], ["dewaPremise", "DEWA premise no."], ["landlordName", "Landlord / operator name"], ["propertyUsage", "Property usage"], ["annualRent", "Annual rent"]];
PAGES.contract = arg => {
  const isNew = arg.startsWith("new"), qs = new URLSearchParams(arg.split("?")[1] || "");
  const c = isNew ? { status: "draft", start: TODAY, end: R.addDays(R.addMonths(TODAY, 12), -1), noticeDays: 60, termMonths: 12, spaceIds: qs.get("space") ? [qs.get("space")] : [], addons: [], deposit: 0, title: "", ejari: {} } : byId("contracts", arg);
  if (!c) return empty(t("Contract not found."));
  if (isNew && qs.get("party")) Object.assign(c, splitParty(qs.get("party")));
  if (isNew && c.spaceIds.length) { const s = byId("spaces", c.spaceIds[0]); if (s) { c.monthlyFee = s.priceMonth || 0; c.title = L(s.type); } }
  const ro = !can("contracts") || (!isNew && ["ended", "renewed", "cancelled"].includes(c.status));
  const assignable = DB.spaces.filter(s => SHARED.ASSIGNABLE.includes(s.type) || s.type === "hot_desk");
  const [nd, inwin] = isNew ? ["", false] : R.noticeDue(c, TODAY), ej = c.ejari || {}, isAE = (cfg().country || "AE") === "AE";
  const invs = isNew ? [] : DB.invoices.filter(i => (i.contractIds || []).includes(c.id) || i.contractId === c.id);
  return { title: isNew ? "New contract" : c.number, html: pageHead(isNew ? t("New contract") : `${t("Contract")} ${c.number}`, isNew ? t("Office, desk, virtual office, parking or locker agreement.") : `${chip(c.status)} ${h(partyName(c))}${inwin ? ` · <span class="warn-t">${t("Notice due by")} ${fmtD(nd)}</span>` : ""}`,
    isNew ? "" : btn(ic("print") + t("Print summary"), "print-doc", { kind: "contract", id: c.id }) + (canAct("renew_contract") && ["active", "notice"].includes(c.status) ? btn(t("Renew"), "ct-renew", { id: c.id }, "btn-primary", "btn-ct-renew") : "") + (can("contracts") && ["active", "notice"].includes(c.status) ? btn(t("End contract"), "ct-end", { id: c.id }, "btn-danger-ghost") : "")) +
    `<form data-form="contract" data-id="${h(isNew ? "" : c.id)}" class="grid-form card" id="contract-form">
      <h3 class="wide">${t("Agreement")}</h3>
      ${fld(t("Client"), `<select name="party" required ${ro ? "disabled" : ""}><option value="">${t("— choose —")}</option>${partyOptions(partyKeyOf(c))}</select>`, { req: true })}${fld(t("Title on invoices"), inp("title", c.title, `placeholder="${t("e.g. Private office")}" ${ro ? "disabled" : ""}`))}
      ${fld(t("Spaces"), `<select name="spaceIds" multiple size="5" ${ro ? "disabled" : ""}>${assignable.map(s => `<option value="${s.id}" ${(c.spaceIds || []).includes(s.id) ? "selected" : ""}>${h(s.code)} · ${h(s.name)} (${L(spaceState(s))})</option>`).join("")}</select>`, { hint: t("Ctrl/Cmd-click to choose more than one") })}
      <div class="grid-sub">${fld(t("Start date"), dateInp("start", c.start, `required ${ro ? "disabled" : ""}`), { req: true })}${fld(t("End date"), dateInp("end", c.end, `required ${ro ? "disabled" : ""}`), { req: true })}${fld(t("Status"), selInp("status", SHARED.CONTRACT_STATUS.map(x => [x, L(x)]), c.status, undefined, ro ? "disabled" : ""))}</div>
      ${fld(t("Monthly fee (example)"), numInp("monthlyFee", c.monthlyFee, `required ${ro ? "disabled" : ""}`), { req: true, hint: t("before VAT; first and last months are prorated by day") })}${fld(t("Notice period (days)"), numInp("noticeDays", c.noticeDays, ro ? "disabled" : ""))}
      ${fld(t("Security deposit"), numInp("deposit", c.deposit, ro ? "disabled" : ""))}${fld(t("Deposit status"), selInp("depositStatus", ["not_due", "due", "received", "refunded", "part_refunded"].map(x => [x, L(x)]), c.depositStatus || "due", undefined, can("contracts") ? "" : "disabled"))}
      ${fld(t("Renewal term (months)"), numInp("termMonths", c.termMonths, ro ? "disabled" : ""))}<label class="fld check"><input type="checkbox" name="vatExempt" ${c.vatExempt ? "checked" : ""} ${ro ? "disabled" : ""}><span>${t("Zero-rated / outside VAT (ask your tax adviser)")}</span></label>
      <h3 class="wide">${t("Monthly add-ons")}</h3><div class="wide lines" id="addons">${(c.addons || []).concat(ro ? [] : [{}]).map((a, i) => addonRow(a, i, ro)).join("")}</div>${ro ? "" : `<div class="wide">${btn(ic("plus") + t("Add line"), "addon-add", {}, "btn-ghost btn-sm")}</div>`}
      ${isAE ? `<h3 class="wide">${t("Ejari-ready fields")} <span class="tag">${t("for your registration")}</span></h3><p class="hint wide">${t("Kept so you can register the tenancy on the official Ejari system yourself. Immora BCS does not connect to or register with Ejari.")}</p>
      ${EJARI_FIELDS.map(([k, l]) => fld(t(l), inp("ej_" + k, ej[k], ro && k !== "contractNo" ? "disabled" : ""))).join("")}` : ""}
      ${fld(t("Notes"), txt("notes", c.notes, ro ? "disabled" : ""), { wide: true })}
      <div class="form-foot wide">${!isNew && can("contracts") && ["draft", "cancelled"].includes(c.status) ? btn(t("Delete"), "ct-del", { id: c.id }, "btn-danger-ghost") : ""}${can("contracts") ? `<button class="btn btn-primary" id="btn-ct-save">${isNew ? t("Create contract") : t("Save")}</button>` : ""}</div></form>
    ${!isNew ? `<div class="grid-2 r12"><div class="card"><h3>${t("Renewal & notice")}</h3><dl class="dl"><dt>${t("Ends")}</dt><dd>${fmtD(c.end)} (${R.daysBetween(TODAY, c.end)} ${t("days")})</dd><dt>${t("Notice by")}</dt><dd>${fmtD(nd)}</dd><dt>${t("Reminder sent")}</dt><dd>${c.noticeReminded ? fmtD(c.noticeReminded) : "—"}</dd>${c.renewedFrom ? `<dt>${t("Renews")}</dt><dd>${link((byId("contracts", c.renewedFrom) || {}).number || "", "contract/" + c.renewedFrom)}</dd>` : ""}${c.renewedTo ? `<dt>${t("Renewed as")}</dt><dd>${link((byId("contracts", c.renewedTo) || {}).number || "", "contract/" + c.renewedTo)}</dd>` : ""}</dl></div>
      <div class="card"><h3>${t("Invoices")}</h3>${invoiceTable(invs)}</div></div>` : ""}` };
};
const addonRow = (a, i, ro) => `<div class="line-row addon"><input name="ad_name[]" placeholder="${t("e.g. Parking bay, call answering")}" value="${h(a.name || "")}" ${ro ? "disabled" : ""} list="dl-products"><input name="ad_qty[]" data-type="num" value="${h(a.qty === undefined ? 1 : a.qty)}" ${ro ? "disabled" : ""} aria-label="${t("Qty")}"><input name="ad_price[]" data-type="num" value="${h(a.price === undefined ? "" : a.price)}" placeholder="${t("Price / month")}" ${ro ? "disabled" : ""} aria-label="${t("Price")}"></div>${i === 0 ? `<datalist id="dl-products">${DB.products.map(p => `<option value="${h(p.name)}">`).join("")}</datalist>` : ""}`;
ACT["addon-add"] = () => $("#addons").insertAdjacentHTML("beforeend", addonRow({}, 1));
FORMS.contract = async (d, form) => {
  const id = form.dataset.id, old = id ? byId("contracts", id) : {}, p = splitParty(d.party || partyKeyOf(old));
  const ej = Object.assign({}, old.ejari || {}); EJARI_FIELDS.forEach(([k]) => { if (("ej_" + k) in d) ej[k] = d["ej_" + k]; });
  const addons = (d.ad_name || []).map((n, i) => ({ name: n, qty: d.ad_qty[i] === "" ? 1 : d.ad_qty[i], price: d.ad_price[i] === "" ? 0 : d.ad_price[i] })).filter(a => a.name);
  const sp = form.spaceIds ? Array.from(form.spaceIds.selectedOptions).map(o => o.value) : old.spaceIds;
  const rec = Object.assign({}, old, { companyId: p.companyId, memberId: p.memberId, title: d.title, spaceIds: sp, start: d.start || old.start, end: d.end || old.end, status: d.status || old.status, monthlyFee: d.monthlyFee === undefined ? old.monthlyFee : d.monthlyFee,
    noticeDays: d.noticeDays === undefined ? old.noticeDays : d.noticeDays, deposit: d.deposit === undefined ? old.deposit : d.deposit, depositStatus: d.depositStatus || old.depositStatus, termMonths: d.termMonths || old.termMonths || 12, vatExempt: !!d.vatExempt, addons: form.querySelector("[name='ad_name[]']") ? addons : old.addons, ejari: ej, notes: d.notes === undefined ? old.notes : d.notes, id: id || uid("CT") });
  const r = await save("contracts", rec, { form, msg: id ? t("Contract saved") : t("Contract created") }); if (r) go("contract/" + r.id);
};
ACT["ct-renew"] = el => { const c = byId("contracts", el.dataset.id); const s = R.addDays(c.end, 1);
  modal(t("Renew contract"), `<form data-form="renew" data-id="${c.id}" class="grid-form"><p class="wide">${t("Creates a new contract from")} <b>${fmtD(s)}</b> ${t("for")} ${c.termMonths || 12} ${t("months and marks this one as renewed.")}</p>${fld(t("Price change %"), numInp("uplift", 0), { hint: t("e.g. 5 for +5%. Check any rent-increase rules that apply to you.") })}<div class="form-foot wide"><button class="btn btn-primary" id="btn-renew-go">${t("Renew")}</button></div></form>`); };
FORMS.renew = async (d, form) => { const r = await act("renew_contract", { id: form.dataset.id, uplift: d.uplift || 0 }, t("Contract renewed")); if (r) { closeModal(); go("contract/" + r.id); } };
ACT["ct-end"] = async el => { const c = byId("contracts", el.dataset.id); const day = await promptBox(t("End contract"), t("Last day (DD-MM-YYYY)"), fmtD(c.end)); if (!day) return; const iso = parseD(day); if (!iso) return toast(t("Use DD-MM-YYYY"), "err"); if (await save("contracts", Object.assign({}, c, { end: iso, status: iso < TODAY ? "ended" : "notice", depositStatus: c.depositStatus }), { msg: t("Contract updated") })) render(); };
ACT["ct-del"] = async el => { if (await confirmBox(t("Delete this draft contract?"), t("Delete"), true) && await remove("contracts", el.dataset.id)) go("contracts"); };

PAGES.renewals = () => {
  const due = noticeList(), soon = DB.contracts.filter(c => ["active", "notice"].includes(c.status) && c.end <= R.addDays(TODAY, 120)).sort((a, b) => a.end < b.end ? -1 : 1);
  const deps = DB.contracts.filter(c => c.deposit && ["due"].includes(c.depositStatus));
  return { title: "Renewals & notices", html: pageHead(t("Renewals & notices"), t("Contracts in their notice window get a reminder (simulated email in the Outbox) with one click."), canAct("notice_reminders") ? btn(ic("bell") + t("Queue notice reminders"), "notice-run", {}, "btn-primary", "btn-notice-run") : "") +
    `<div class="kpis">${kpi(t("In notice window"), due.length, `${t("reminder")} ${SHARED.NOTICE_WINDOW_DAYS} ${t("days before the notice date")}`, "bell", due.length ? "amber" : "green")}${kpi(t("Ending in 120 days"), soon.length, money(sum(soon, monthlyValue)) + " " + t("/ month at risk"), "file", "blue")}${kpi(t("Deposits to collect"), deps.length, money(sum(deps, c => c.deposit)), "receipt", deps.length ? "red" : "green")}</div>
    <div class="card"><h3>${t("Ending soon")}</h3>${table([{ label: "Number", f: c => link(c.number, "contract/" + c.id) }, { label: "Client", f: c => h(partyName(c)) }, { label: "Ends", f: c => fmtD(c.end) }, { label: "Notice by", f: c => { const [n, w] = R.noticeDue(c, TODAY); return `${fmtD(n)} ${w ? chip("notice", "c-warn") : ""}`; } }, { label: "Reminder", f: c => c.noticeReminded ? `${t("sent")} ${fmtD(c.noticeReminded)}` : "—" }, { label: "Monthly", f: c => money(monthlyValue(c)), cls: "num" }, { label: "", f: c => canAct("renew_contract") ? btn(t("Renew"), "ct-renew", { id: c.id }, "btn-ghost btn-sm") : "" }], soon)}</div>
    <div class="card"><h3>${t("Deposits")}</h3>${table([{ label: "Number", f: c => link(c.number, "contract/" + c.id) }, { label: "Client", f: c => h(partyName(c)) }, { label: "Deposit", f: c => money(c.deposit), cls: "num" }, { label: "Status", f: c => chip(c.depositStatus) }, { label: "", f: c => can("contracts") && c.depositStatus === "due" ? btn(t("Mark received"), "dep-recv", { id: c.id }, "btn-ghost btn-sm") : "" }], DB.contracts.filter(c => c.deposit && ["active", "notice", "draft"].includes(c.status)))}</div>` };
};
ACT["notice-run"] = async () => { const r = await act("notice_reminders", {}, x => `${x.created} ${t("reminder(s) queued in the Outbox (simulated)")}`); if (r) render(); };
ACT["dep-recv"] = async el => { const c = byId("contracts", el.dataset.id); if (await save("contracts", Object.assign({}, c, { depositStatus: "received" }), { msg: t("Deposit marked received") })) render(); };
