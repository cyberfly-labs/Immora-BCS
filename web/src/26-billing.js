/* Billing: invoices, billing run with prorations, charges/add-ons, receipts, credit notes, dunning, payment links, Books export. */
function linesEditor(lines, ro) {
  const rate = cfg().vatRate === undefined ? 5 : cfg().vatRate;
  return `<div class="lines" id="lines"><div class="line-row head"><span>${t("Description")}</span><span>${t("Qty")}</span><span>${t("Unit price")}</span><span>${cfg().vatName || "VAT"} %</span><span>${t("Amount")}</span><span></span></div>
    ${(lines && lines.length ? lines : [{ qty: 1, price: 0, vat: rate }]).map(l => lineRow(l, ro, rate)).join("")}</div>
    ${ro ? "" : `<div class="lines-tools">${btn(ic("plus") + t("Add line"), "line-add", {}, "btn-ghost btn-sm")}<select data-live="line-product" aria-label="${t("Add an add-on")}"><option value="">${t("+ add-on / product…")}</option>${DB.products.map(p => `<option value="${p.id}">${h(p.name)} · ${money(p.price)}</option>`).join("")}</select></div>`}
    <div class="totals" id="totals"></div>`;
}
const lineRow = (l, ro, rate) => `<div class="line-row"><input name="ln_desc[]" value="${h(l.desc || "")}" placeholder="${t("Description")}" ${ro ? "disabled" : ""} data-live="totals" aria-label="${t("Description")}"><input name="ln_qty[]" data-type="num" value="${h(l.qty === undefined ? 1 : l.qty)}" ${ro ? "disabled" : ""} data-live="totals" aria-label="${t("Qty")}"><input name="ln_price[]" data-type="num" value="${h(l.price === undefined ? "" : l.price)}" ${ro ? "disabled" : ""} data-live="totals" aria-label="${t("Unit price")}"><input name="ln_vat[]" data-type="num" value="${h(l.vat === undefined ? rate : l.vat)}" ${ro ? "disabled" : ""} data-live="totals" aria-label="VAT %"><span class="ln-amt num">${money(R.r2((l.qty === undefined ? 1 : l.qty) * (l.price || 0)), false)}</span>${ro ? "<span></span>" : `<button type="button" class="btn-icon sm" data-act="line-del" aria-label="${t("Remove line")}">${ic("x")}</button>`}</div>`;
function readLines(form) {
  const ds = $$("[name='ln_desc[]']", form), q = $$("[name='ln_qty[]']", form), p = $$("[name='ln_price[]']", form), v = $$("[name='ln_vat[]']", form);
  return ds.map((d, i) => ({ desc: d.value.trim(), qty: Number(String(q[i].value).replace(/,/g, "")) || 0, price: Number(String(p[i].value).replace(/,/g, "")) || 0, vat: v[i].value === "" ? 0 : Number(v[i].value) })).filter(l => l.desc || l.price);
}
LIVE.totals = () => {
  const f = $("#lines"); if (!f) return; const rows = $$(".line-row:not(.head)", f);
  let sub = 0, vat = 0; rows.forEach(r => { const [d, q, p, v] = $$("input", r).map(x => x.value); const net = R.r2((Number(q) || 0) * (Number(String(p).replace(/,/g, "")) || 0)); sub += net; vat += R.r2(net * (Number(v) || 0) / 100); $(".ln-amt", r).textContent = money(net, false); });
  $("#totals").innerHTML = `<div><span>${t("Subtotal")}</span><b>${money(R.r2(sub))}</b></div><div><span>${cfg().vatName || "VAT"}</span><b>${money(R.r2(vat))}</b></div><div class="grand"><span>${t("Total")}</span><b>${money(R.r2(sub + vat))}</b></div>`;
};
ACT["line-add"] = () => { $("#lines").insertAdjacentHTML("beforeend", lineRow({ qty: 1 }, false, cfg().vatRate)); LIVE.totals(); };
ACT["line-del"] = el => { el.closest(".line-row").remove(); LIVE.totals(); };
LIVE["line-product"] = el => { const p = byId("products", el.value); if (!p) return; $("#lines").insertAdjacentHTML("beforeend", lineRow({ desc: p.name, qty: 1, price: p.price }, false, cfg().vatRate)); el.value = ""; LIVE.totals(); };
AFTER.invoice = () => LIVE.totals(); AFTER.quote = () => LIVE.totals();

function invoiceTable(list, o) {
  o = o || {};
  return table([{ label: "Number", f: i => i.number ? `<b>${h(i.number)}</b>` : `<i class="hint">${t("Draft")}</i>` }, { label: "Date", f: i => fmtD(i.date) }, { label: "Client", f: i => h((i.customer || {}).name || partyName(i)) }, { label: "Due", f: i => fmtD(i.dueDate) + (["issued", "part_paid"].includes(i.status) && i.dueDate < TODAY ? ` <small class="bad-t">${R.daysBetween(i.dueDate, TODAY)}d</small>` : "") },
    { label: "Total", f: i => money(i.total), cls: "num" }, { label: "Balance", f: i => i.status === "draft" || i.status === "void" ? "—" : money(invBal(i)), cls: "num" }, { label: "Status", f: i => chip(i.status) + (i.dunningLevel ? ` <small class="bad-t">R${i.dunningLevel}</small>` : "") }],
    list, { id: o.id, rowAttr: i => `data-go="invoice/${i.id}" class="click"`, empty: t("No invoices yet.") });
}
let INV_FILTER = "all";
PAGES.invoices = () => {
  const f = { all: () => true, draft: i => i.status === "draft", open: i => ["issued", "part_paid"].includes(i.status), overdue: i => ["issued", "part_paid"].includes(i.status) && i.dueDate < TODAY, paid: i => i.status === "paid", void: i => i.status === "void" };
  const rows = DB.invoices.filter(f[INV_FILTER]).sort((a, b) => (a.status === "draft") !== (b.status === "draft") ? (a.status === "draft" ? -1 : 1) : ((a.number || "") < (b.number || "") ? 1 : -1));
  const drafts = DB.invoices.filter(i => i.status === "draft");
  return { title: "Invoices", html: pageHead(t("Invoices"), `${t("Open balance")} ${money(sum(openInvoices(), invBal))} · ${t("overdue")} ${money(sum(overdue(), invBal))}`,
    (can("invoices") && drafts.length ? btn(ic("check") + `${t("Issue all drafts")} (${drafts.length})`, "inv-issue-all", {}, "btn-ghost", "btn-issue-all") : "") + (can("invoices") ? btn(ic("plus") + t("New invoice"), "inv-new", {}, "btn-primary", "btn-inv-new") : "") + btn(t("Export CSV"), "inv-csv")) +
    `<div class="seg">${Object.keys(f).map(k => `<button class="${INV_FILTER === k ? "on" : ""}" data-act="inv-filter" data-f="${k}">${t({ all: "All", draft: "Drafts", open: "Unpaid", overdue: "Overdue", paid: "Paid", void: "Void" }[k])} <small>${DB.invoices.filter(f[k]).length}</small></button>`).join("")}</div>
    <div class="card">${filterBox("tbl-inv")}${invoiceTable(rows, { id: "tbl-inv" })}</div>` };
};
ACT["inv-filter"] = el => { INV_FILTER = el.dataset.f; render(); };
ACT["inv-new"] = () => go("invoice/new");
ACT["inv-csv"] = () => download(`invoices-${TODAY}.csv`, csv(DB.invoices.filter(i => i.number), [["number", "Number"], [i => fmtD(i.date), "Date"], [i => fmtD(i.dueDate), "Due"], [i => (i.customer || {}).name, "Customer"], [i => (i.customer || {}).trn, "Customer TRN"], ["subtotal", "Subtotal"], ["vatTotal", "VAT"], ["total", "Total"], ["paid", "Paid"], [i => invBal(i), "Balance"], ["status", "Status"]]), "text/csv");
ACT["inv-issue-all"] = async () => {
  const drafts = DB.invoices.filter(i => i.status === "draft").sort((a, b) => a.date < b.date ? -1 : 1);
  if (!(await confirmBox(`${t("Issue")} ${drafts.length} ${t("draft invoices? Numbers are given in order and issued tax invoices cannot be edited.")}`, t("Issue all")))) return;
  if (await saveMany(drafts.map(i => ["invoices", Object.assign({}, i, { status: "issued" })]), `${drafts.length} ${t("invoices issued")}`)) render();
};
PAGES.invoice = arg => {
  const isNew = arg.startsWith("new"); const i = isNew ? { status: "draft", date: TODAY, lines: [], companyId: "", memberId: "" } : byId("invoices", arg);
  if (!i) return empty(t("Invoice not found."));
  if (i.status !== "draft") return invoiceView(i);
  const ro = !can("invoices");
  return { title: isNew ? "New invoice" : t("Draft invoice"), html: pageHead(isNew ? t("New invoice") : t("Draft invoice"), t("A draft has no number yet. Issuing gives the next tax invoice number and locks it."), !isNew ? btn(ic("print") + t("Preview"), "print-doc", { kind: "invoice", id: i.id }) : "") +
    `<form data-form="invoice" data-id="${h(isNew ? "" : i.id)}" class="card grid-form" id="invoice-form">
      ${fld(t("Bill to"), `<select name="party" required ${ro ? "disabled" : ""}><option value="">${t("— choose —")}</option>${partyOptions(partyKeyOf(i))}</select>`, { req: true })}${fld(t("Invoice date"), dateInp("date", i.date, ro ? "disabled" : ""))}${fld(t("Due date"), dateInp("dueDate", i.dueDate, `placeholder="${t("auto")}" ${ro ? "disabled" : ""}`), { hint: `${t("Default")}: +${cfg().paymentTermsDays || 14} ${t("days")}` })}
      ${i.periodStart ? `<p class="hint wide">${t("Billing period")}: ${fmtD(i.periodStart)} – ${fmtD(i.periodEnd)}</p>` : ""}
      <div class="wide">${linesEditor(i.lines, ro)}</div>${fld(t("Notes on invoice"), txt("notes", i.notes, ro ? "disabled" : ""), { wide: true })}
      <div class="form-foot wide">${!isNew && can("invoices") ? btn(t("Delete draft"), "inv-del", { id: i.id }, "btn-danger-ghost") : ""}${ro ? "" : `<button class="btn btn-ghost" name="mode" value="draft" id="btn-inv-draft">${t("Save draft")}</button><button class="btn btn-primary" name="mode" value="issue" id="btn-inv-issue">${t("Issue tax invoice")}</button>`}</div></form>` };
};
FORMS.invoice = async (d, form, ev) => {
  const id = form.dataset.id, old = id ? byId("invoices", id) : {}, p = splitParty(d.party), mode = (ev.submitter && ev.submitter.value) || "draft";
  if (mode === "issue" && !(await confirmBox(t("Issue this tax invoice? It gets the next number and can no longer be edited."), t("Issue")))) return;
  const rec = Object.assign({}, old, { companyId: p.companyId, memberId: p.memberId, date: d.date || TODAY, dueDate: d.dueDate || "", lines: readLines(form), notes: d.notes, status: mode === "issue" ? "issued" : "draft", id: id || uid("INV") });
  const r = await save("invoices", rec, { form, msg: mode === "issue" ? t("Tax invoice issued") : t("Draft saved") }); if (r) go("invoice/" + r.id);
};
ACT["inv-del"] = async el => { if (await confirmBox(t("Delete this draft?"), t("Delete"), true) && await remove("invoices", el.dataset.id)) go("invoices"); };
function invoiceView(i) {
  const bal = invBal(i), cns = DB.creditnotes.filter(c => c.invoiceId === i.id), rcs = DB.receipts.filter(r => r.invoiceId === i.id), open = ["issued", "part_paid"].includes(i.status);
  return { title: i.number, html: pageHead(`${(i.supplier || {}).invoiceTitle || t("Tax Invoice")} ${i.number}`, `${chip(i.status)} ${h((i.customer || {}).name || "")} · ${t("balance")} <b>${money(bal)}</b>${i.dunningLevel ? ` · ${t("reminder level")} ${i.dunningLevel}` : ""}`,
    btn(ic("print") + t("Print / PDF"), "print-doc", { kind: "invoice", id: i.id }, "btn-ghost", "btn-inv-print") + (open && can("receipts") ? btn(ic("receipt") + t("Record payment"), "inv-pay", { id: i.id }, "btn-primary", "btn-inv-pay") : "") + (open && canAct("payment_link") ? btn(ic("link") + t("Payment link"), "inv-link", { id: i.id }, "btn-ghost", "btn-inv-link") : "") +
    (open && can("creditnotes") ? btn(t("Credit note"), "inv-cn", { id: i.id }, "btn-ghost", "btn-inv-cn") : "") + (i.status === "issued" && !Number(i.paid) && can("invoices") ? btn(t("Void"), "inv-void", { id: i.id }, "btn-danger-ghost") : "")) +
    `${i.paymentLink ? `<div class="note">${ic("link")} ${t("Payment link (placeholder — no payment provider connected)")}: <code>${h(i.paymentLink)}</code></div>` : ""}${i.status === "void" ? `<div class="note bad">${t("Voided on")} ${fmtD(i.voidedOn)}: ${h(i.voidReason)}</div>` : ""}
    <div class="doc-preview">${docHTML("invoice", i)}</div>
    <div class="grid-2"><div class="card"><h3>${t("Payments")}</h3>${table([{ label: "Receipt", k: "number" }, { label: "Date", f: r => fmtD(r.date) }, { label: "Method", f: r => L(r.method) }, { label: "Amount", f: r => money(r.amount), cls: "num" }, { label: "", f: r => btn(ic("print"), "print-doc", { kind: "receipt", id: r.id }, "btn-icon sm") }], rcs, { empty: t("No payments yet.") })}</div>
    <div class="card"><h3>${t("Credit notes")}</h3>${table([{ label: "Number", k: "number" }, { label: "Date", f: c => fmtD(c.date) }, { label: "Reason", k: "reason" }, { label: "Total", f: c => money(c.total), cls: "num" }, { label: "", f: c => btn(ic("print"), "print-doc", { kind: "creditnote", id: c.id }, "btn-icon sm") }], cns, { empty: t("None.") })}</div></div>` };
}
ACT["inv-void"] = async el => { const i = byId("invoices", el.dataset.id); const why = await promptBox(t("Void invoice"), t("Reason for voiding"), ""); if (!why) return; if (await save("invoices", Object.assign({}, i, { status: "void", voidReason: why }), { msg: t("Invoice voided") })) render(); };
ACT["inv-link"] = async el => { const r = await act("payment_link", { id: el.dataset.id }, t("Payment link created (placeholder)")); if (r) render(); };
ACT["inv-pay"] = el => receiptModal(el.dataset.id);
function receiptModal(invId) {
  const list = openInvoices().filter(i => invBal(i) > 0).sort((a, b) => a.dueDate < b.dueDate ? -1 : 1), i = invId ? byId("invoices", invId) : list[0];
  modal(t("Record payment"), `<form data-form="receipt" class="grid-form">${fld(t("Invoice"), `<select name="invoiceId" required data-live="rc-inv">${opts(list.map(x => [x.id, `${x.number} · ${(x.customer || {}).name} · ${money(invBal(x))}`]), i ? i.id : "")}</select>`, { req: true, wide: true })}
    ${fld(t("Amount"), numInp("amount", i ? invBal(i) : "", "required id=rc-amt"), { req: true })}${fld(t("Date"), dateInp("date", TODAY))}${fld(t("Method"), selInp("method", SHARED.PAY_METHODS.map(x => [x, L(x)]), "bank_transfer"))}${fld(t("Reference"), inp("ref", ""))}
    <div class="form-foot wide"><button class="btn btn-primary" id="btn-rc-save">${t("Save receipt")}</button></div></form>`, { wide: true });
}
LIVE["rc-inv"] = el => { const i = byId("invoices", el.value); if (i) $("#rc-amt").value = invBal(i); };
FORMS.receipt = async (d, form) => { const r = await save("receipts", { id: uid("RC"), invoiceId: d.invoiceId, amount: d.amount, date: d.date || TODAY, method: d.method, ref: d.ref }, { form, msg: t("Payment recorded") }); if (r) { closeModal(); render(); } };
ACT["inv-cn"] = el => { const i = byId("invoices", el.dataset.id);
  modal(t("Credit note"), `<form data-form="cn" data-id="${i.id}" class="grid-form"><p class="wide">${t("For invoice")} <b>${h(i.number)}</b> · ${t("balance")} ${money(invBal(i))}</p>${fld(t("Reason"), inp("reason", "", "required"), { req: true, wide: true })}
    <div class="wide">${linesEditor([{ desc: t("Credit for") + " " + i.number, qty: 1, price: 0, vat: cfg().vatRate }])}</div><div class="form-foot wide"><button class="btn btn-primary" id="btn-cn-save">${t("Issue credit note")}</button></div></form>`, { wide: true }); LIVE.totals(); };
FORMS.cn = async (d, form) => { const r = await save("creditnotes", { id: uid("CN"), invoiceId: form.dataset.id, reason: d.reason, date: TODAY, lines: readLines(form) }, { form, msg: t("Credit note issued") }); if (r) { closeModal(); render(); } };

/* ---------------- billing run */
let BR_MONTH = null;
PAGES.billingrun = () => {
  if (!BR_MONTH) BR_MONTH = R.monthBounds(TODAY)[0];
  const [invs, , skipped] = R.billingRun(DB, BR_MONTH, TODAY, cfg());
  const total = sum(invs, i => i.total);
  return { title: "Billing run", html: pageHead(t("Billing run"), t("Creates draft invoices for every active contract (first and last months prorated by day), monthly add-ons, and pending charges such as printing, coffee, parking and extra room hours."),
    `<div class="seg"><button data-act="br-move" data-n="-1">‹</button><button class="on">${R.monthBounds(BR_MONTH).map(fmtD).join(" – ")}</button><button data-act="br-move" data-n="1">›</button></div>${canAct("billing_run") ? btn(ic("refresh") + `${t("Create")} ${invs.length} ${t("draft invoices")}`, "br-run", {}, "btn-primary", "btn-br-run") : ""}`) +
    `<div class="kpis">${kpi(t("Invoices to create"), invs.length, `${skipped.length} ${t("contracts already billed")}`, "bill", "blue")}${kpi(t("Subtotal"), money0(sum(invs, i => i.subtotal)), "", "chart", "teal")}${kpi(cfg().vatName || "VAT", money0(sum(invs, i => i.vatTotal)), `${cfg().vatRate}%`, "receipt", "violet")}${kpi(t("Total"), money0(total), "", "bill", "green")}</div>
    <div class="card"><h3>${t("Preview")}</h3>${invs.length ? `<div class="br-list">${invs.map(i => `<details class="br-item"><summary><b>${h(partyName(i))}</b><span>${i.lines.length} ${t("lines")}</span><b class="num">${money(i.total)}</b></summary>${table([{ label: "Description", k: "desc" }, { label: "Amount", f: l => money(l.net), cls: "num" }, { label: cfg().vatName || "VAT", f: l => money(l.tax), cls: "num" }], i.lines)}</details>`).join("")}</div>` : empty(t("Nothing to bill for this month — every active contract already has an invoice."))}</div>` };
};
ACT["br-move"] = el => { BR_MONTH = R.addMonths(BR_MONTH, Number(el.dataset.n)); render(); };
ACT["br-run"] = async () => { const r = await act("billing_run", { period: BR_MONTH }, x => `${x.created} ${t("draft invoices created")}`); if (r) { INV_FILTER = "draft"; go("invoices"); } };

/* ---------------- charges */
PAGES.charges = () => {
  const rows = DB.charges.slice().sort((a, b) => (!!a.invoiceId - !!b.invoiceId) || (a.date < b.date ? 1 : -1));
  return { title: "Charges & add-ons", html: pageHead(t("Charges & add-ons"), t("One-off items (printing, coffee, parking, catering, extra room hours) waiting for the next billing run."), can("charges") ? btn(ic("plus") + t("Add charge"), "charge-new", {}, "btn-primary", "btn-charge-new") : "") +
    `<div class="kpis">${kpi(t("Not invoiced yet"), money0(sum(DB.charges.filter(c => !c.invoiceId), c => c.amount)), `${DB.charges.filter(c => !c.invoiceId).length} ${t("charges")}`, "coffee", "amber")}</div>
    <div class="card">${table([{ label: "Date", f: c => fmtD(c.date) }, { label: "For", f: c => h(partyName(c)) }, { label: "Description", k: "desc" }, { label: "Qty", k: "qty", cls: "num" }, { label: "Price", f: c => money(c.price), cls: "num" }, { label: "Amount", f: c => money(c.amount), cls: "num" },
      { label: "Invoice", f: c => c.invoiceId ? link((byId("invoices", c.invoiceId) || {}).number || t("Draft"), "invoice/" + c.invoiceId) : chip("due", "c-warn") }, { label: "", f: c => !c.invoiceId && can("charges") && !c.bookingId ? btn(ic("x"), "charge-del", { id: c.id }, "btn-icon sm") : "" }], rows)}</div>` };
};
ACT["charge-new"] = () => chargeModal();
function chargeModal(o) {
  o = o || {}; const key = o.companyId ? "c:" + o.companyId : o.memberId ? "m:" + o.memberId : "";
  modal(t("Add charge"), `<form data-form="charge" class="grid-form" id="charge-form">${fld(t("Charge to"), `<select name="party" required><option value="">${t("— choose —")}</option>${partyOptions(key)}<optgroup label="${t("Members of companies")}">${DB.members.filter(m => m.companyId).map(m => `<option value="m:${m.id}" ${key === "m:" + m.id ? "selected" : ""}>${h(m.name)} (${h((byId("companies", m.companyId) || {}).legalName || "")})</option>`).join("")}</optgroup></select>`, { req: true, wide: true, hint: t("Charges for a company member go on the company's invoice.") })}
    ${fld(t("Add-on"), `<select name="productId" data-live="ch-product">${opts(DB.products.map(p => [p.id, `${p.name} · ${money(p.price)}`]), "", t("— custom —"))}</select>`)}${fld(t("Description"), inp("desc", "", "required id=ch-desc"), { req: true })}
    ${fld(t("Quantity"), numInp("qty", 1, "id=ch-qty"))}${fld(t("Unit price"), numInp("price", "", "required id=ch-price"), { req: true })}${fld(t("Date"), dateInp("date", TODAY))}<div class="form-foot wide"><button class="btn btn-primary" id="btn-charge-save">${t("Add charge")}</button></div></form>`, { wide: true });
}
LIVE["ch-product"] = el => { const p = byId("products", el.value); if (p) { $("#ch-desc").value = p.name; $("#ch-price").value = p.price; } };
FORMS.charge = async (d, form) => { const p = splitParty(d.party); const m = p.memberId ? byId("members", p.memberId) : null; if (m && m.companyId) { p.companyId = m.companyId; }
  if (await save("charges", { id: uid("CHG"), companyId: p.companyId, memberId: p.companyId ? "" : p.memberId, byMember: p.memberId, productId: d.productId, desc: d.desc + (m && m.companyId ? ` – ${m.name}` : ""), qty: d.qty === "" ? 1 : d.qty, price: d.price, date: d.date || TODAY }, { form, msg: t("Charge added") })) { closeModal(); render(); } };
ACT["charge-del"] = async el => { if (await confirmBox(t("Remove this charge?"), t("Remove"), true) && await remove("charges", el.dataset.id)) render(); };

PAGES.receipts = () => ({ title: "Receipts", html: pageHead(t("Receipts"), t("Payments received against invoices."), (can("receipts") ? btn(ic("plus") + t("Record payment"), "rc-new", {}, "btn-primary") : "") + btn(t("Export CSV"), "rc-csv")) +
  `<div class="card">${table([{ label: "Receipt", f: r => `<b>${h(r.number)}</b>` }, { label: "Date", f: r => fmtD(r.date) }, { label: "Invoice", f: r => link(r.invoiceNumber || "", "invoice/" + r.invoiceId) }, { label: "Client", k: "customerName" }, { label: "Method", f: r => L(r.method) }, { label: "Reference", k: "ref" }, { label: "Amount", f: r => money(r.amount), cls: "num" }, { label: "", f: r => btn(ic("print"), "print-doc", { kind: "receipt", id: r.id }, "btn-icon sm") }], DB.receipts.slice().sort((a, b) => (a.number || "") < (b.number || "") ? 1 : -1))}</div>` });
ACT["rc-new"] = () => receiptModal();
ACT["rc-csv"] = () => download(`receipts-${TODAY}.csv`, csv(DB.receipts, [["number", "Receipt"], [r => fmtD(r.date), "Date"], ["invoiceNumber", "Invoice"], ["customerName", "Client"], ["method", "Method"], ["ref", "Reference"], ["amount", "Amount"]]), "text/csv");
PAGES.creditnotes = () => ({ title: "Credit notes", html: pageHead(t("Credit notes"), t("Tax credit notes reduce an issued invoice. Open the invoice to issue one.")) +
  `<div class="card">${table([{ label: "Number", f: c => `<b>${h(c.number)}</b>` }, { label: "Date", f: c => fmtD(c.date) }, { label: "Invoice", f: c => link(c.invoiceNumber || "", "invoice/" + c.invoiceId) }, { label: "Client", f: c => h((c.customer || {}).name || "") }, { label: "Reason", k: "reason" }, { label: "Total", f: c => money(c.total), cls: "num" }, { label: "", f: c => btn(ic("print"), "print-doc", { kind: "creditnote", id: c.id }, "btn-icon sm") }], DB.creditnotes)}</div>` });

/* ---------------- dunning */
PAGES.dunning = () => {
  const od = overdue().sort((a, b) => a.dueDate < b.dueDate ? -1 : 1), next = R.dunningRun(DB, TODAY);
  return { title: "Overdue & reminders", html: pageHead(t("Overdue & reminders"), `${t("Reminder levels")}: 1 = ${SHARED.DUNNING_DAYS[0]}+ ${t("days")}, 2 = ${SHARED.DUNNING_DAYS[1]}+, 3 = ${SHARED.DUNNING_DAYS[2]}+ (${t("final notice")}). ${t("Reminders go to the Outbox (simulated, nothing is emailed).")}`, canAct("dunning_run") ? btn(ic("send") + `${t("Queue")} ${next.length} ${t("reminders")}`, "dun-run", {}, "btn-primary", "btn-dun-run") : "") +
    `<div class="grid-2"><div class="card"><h3>${t("Aged receivables")}</h3>${agingCard()}</div><div class="card"><h3>${t("By client")}</h3>${table([{ label: "Client", k: "name" }, { label: "Overdue", f: x => money(x.v), cls: "num" }], Object.values(od.reduce((a, i) => { const n = (i.customer || {}).name; a[n] = a[n] || { name: n, v: 0 }; a[n].v += invBal(i); return a; }, {})).sort((a, b) => b.v - a.v))}</div></div>
    <div class="card">${table([{ label: "Number", f: i => link(i.number, "invoice/" + i.id) }, { label: "Client", f: i => h((i.customer || {}).name) }, { label: "Due", f: i => fmtD(i.dueDate) }, { label: "Days overdue", f: i => R.daysBetween(i.dueDate, TODAY), cls: "num" }, { label: "Balance", f: i => money(invBal(i)), cls: "num" }, { label: "Reminder sent", f: i => i.dunningLevel ? `${t("Level")} ${i.dunningLevel} · ${fmtD(i.lastReminder)}` : "—" }, { label: "Next", f: i => { const n = next.find(x => x[0].id === i.id); return n ? chip(`L${n[1]}`, "c-warn") : "—"; } }], od, { empty: t("Nothing overdue.") })}</div>` };
};
ACT["dun-run"] = async () => { const r = await act("dunning_run", {}, x => `${x.created} ${t("reminder(s) queued in the Outbox (simulated)")}`); if (r) render(); };

/* ---------------- export to Immora Books */
PAGES.books = () => {
  const [a, b] = R.monthBounds(TODAY);
  return { title: "Export to Immora Books", html: pageHead(t("Export to Immora Books"), t("Invoices, credit notes and receipts for your accounting. Import the CSV files in Immora Books (Settings › Import data), or use the JSON file.")) +
    `<div class="card"><form data-form="books" class="grid-form">${fld(t("From"), dateInp("from", R.addMonths(a, -2)))}${fld(t("To"), dateInp("to", b))}
      <div class="form-foot wide"><button class="btn btn-ghost" name="k" value="invoices" id="btn-books-inv">${t("Invoices CSV")}</button><button class="btn btn-ghost" name="k" value="creditnotes">${t("Credit notes CSV")}</button><button class="btn btn-ghost" name="k" value="receipts" id="btn-books-rc">${t("Receipts CSV")}</button><button class="btn btn-ghost" name="k" value="customers">${t("Customers CSV")}</button><button class="btn btn-primary" name="k" value="json" id="btn-books-json">${t("Everything (JSON)")}</button></div></form>
    <p class="hint">${t("Dates are DD-MM-YYYY; amounts in")} ${h(CUR())}. ${t("Each invoice line carries its VAT rate so Immora Books can post output VAT. Drafts and void invoices are not exported.")}</p></div>` };
};
FORMS.books = (d, form, ev) => {
  const k = (ev.submitter && ev.submitter.value) || "json", from = d.from || "0000-01-01", to = d.to || "9999-12-31", inR = x => x >= from && x <= to, tag = `${fmtD(from)}_${fmtD(to)}`;
  const inv = DB.invoices.filter(i => i.number && i.status !== "void" && inR(i.date)), cns = DB.creditnotes.filter(c => inR(c.date)), rcs = DB.receipts.filter(r => inR(r.date));
  const lines = []; inv.forEach(i => i.lines.forEach((l, n) => lines.push({ i, l, n })));
  const custs = Object.values([...inv, ...cns].reduce((a, x) => { const c = x.customer || {}; a[c.name] = c; return a; }, {}));
  const sup = cfg();
  if (k === "json") { download(`immora-books-export-${tag}.json`, JSON.stringify({ source: "Immora BCS", version: APP_VERSION, supplier: { legalName: sup.legalName, trn: sup.trn, address: sup.address }, currency: CUR(), from, to, customers: custs, invoices: inv, creditNotes: cns, receipts: rcs }, null, 2), "application/json"); toast(`${inv.length} ${t("invoices")}, ${cns.length} ${t("credit notes")}, ${rcs.length} ${t("receipts")}`); return; }
  const maps = {
    invoices: [lines, [[x => x.i.number, "Invoice Number"], [x => fmtD(x.i.date), "Invoice Date"], [x => fmtD(x.i.dueDate), "Due Date"], [x => (x.i.customer || {}).name, "Customer Name"], [x => (x.i.customer || {}).trn, "Customer TRN"], [x => x.l.desc, "Item Description"], [x => x.l.qty, "Quantity"], [x => x.l.price, "Rate"], [x => x.l.vat, "Tax %"], [x => x.l.net, "Line Amount"], [x => x.l.tax, "Tax Amount"], [() => CUR(), "Currency"], [x => x.i.status, "Status"]]],
    creditnotes: [cns, [["number", "Credit Note Number"], [c => fmtD(c.date), "Date"], ["invoiceNumber", "Invoice Number"], [c => (c.customer || {}).name, "Customer Name"], ["reason", "Reason"], ["subtotal", "Subtotal"], ["vatTotal", "Tax Amount"], ["total", "Total"]]],
    receipts: [rcs, [["number", "Payment Number"], [r => fmtD(r.date), "Date"], ["invoiceNumber", "Invoice Number"], ["customerName", "Customer Name"], ["method", "Mode"], ["ref", "Reference"], ["amount", "Amount"]]],
    customers: [custs, [["name", "Customer Name"], ["trn", "TRN"], ["address", "Billing Address"], ["email", "Email"]]],
  };
  const [rows, cols] = maps[k]; download(`immora-books-${k}-${tag}.csv`, csv(rows, cols), "text/csv"); toast(`${rows.length} ${t("rows exported")}`);
};
