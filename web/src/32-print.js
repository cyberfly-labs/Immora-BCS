/* Printable documents. These carry only the centre's own details (and its own logo/stamp if uploaded) — never the Immora logo. */
function docHead(sup, title, meta) {
  const c = cfg();
  return `<header class="doc-head"><div class="doc-from">${c.logo ? `<img src="${h(c.logo)}" alt="" class="doc-logo">` : ""}<div><div class="doc-legal">${h(sup.legalName || c.legalName)}</div><div>${h(sup.address || c.address || "")}</div>
      <div>${h(sup.taxLabel || c.taxLabel || "TRN")}: <b>${h(sup.trn || c.trn || "")}</b>${(sup.licenceNo || c.licenceNo) ? ` · ${t("Trade licence")}: ${h(sup.licenceNo || c.licenceNo)}` : ""}</div><div>${h([sup.phone || c.phone, sup.email || c.email].filter(Boolean).join(" · "))}</div></div></div>
    <div class="doc-title"><h1>${h(title)}</h1>${meta.map(([k, v]) => `<div><span>${h(k)}</span><b>${h(v)}</b></div>`).join("")}</div></header>`;
}
const docTo = (cust, label) => `<section class="doc-to"><small>${h(label || t("Bill to"))}</small><div class="doc-legal sm">${h(cust.name || "")}</div><div>${h(cust.address || "")}</div>${cust.trn ? `<div>${h(cfg().taxLabel || "TRN")}: <b>${h(cust.trn)}</b></div>` : ""}</section>`;
function docLines(lines, cur) {
  return `<table class="doc-lines"><thead><tr><th>#</th><th>${t("Description")}</th><th class="num">${t("Qty")}</th><th class="num">${t("Unit price")}</th><th class="num">${t("Taxable amount")}</th><th class="num">${cfg().vatName || "VAT"} %</th><th class="num">${cfg().vatName || "VAT"}</th><th class="num">${t("Total")} (${h(cur)})</th></tr></thead>
    <tbody>${lines.map((l, i) => `<tr><td>${i + 1}</td><td>${h(l.desc)}</td><td class="num">${R.fmtG(l.qty)}</td><td class="num">${money(l.price, false)}</td><td class="num">${money(l.net, false)}</td><td class="num">${R.fmtG(l.vat)}%</td><td class="num">${money(l.tax, false)}</td><td class="num">${money(R.r2(l.net + l.tax), false)}</td></tr>`).join("")}</tbody></table>`;
}
const docTotals = (d, cur, extra) => `<div class="doc-totals"><div><span>${t("Total excluding")} ${cfg().vatName || "VAT"}</span><b>${money(d.subtotal, cur)}</b></div><div><span>${t("Total")} ${cfg().vatName || "VAT"} (${R.fmtG(cfg().vatRate)}%)</span><b>${money(d.vatTotal, cur)}</b></div><div class="grand"><span>${t("Total amount due")}</span><b>${money(d.total, cur)}</b></div>${extra || ""}</div>`;
const docSign = () => `<div class="doc-sign">${cfg().stamp ? `<img src="${h(cfg().stamp)}" alt="" class="doc-stamp">` : ""}<div><span></span><small>${t("Authorised signature & stamp")}</small></div><div><span></span><small>${t("Received by")}</small></div></div>`;
function docHTML(kind, r) {
  const c = cfg(), sup = r.supplier || c, cur = sup.currency || c.currency || "AED";
  if (kind === "invoice") {
    const bal = r.status === "draft" ? r.total : invBal(r);
    return `<article class="doc">${r.status === "draft" ? `<div class="doc-water">${t("DRAFT – not a tax invoice")}</div>` : r.status === "void" ? `<div class="doc-water">${t("VOID")}</div>` : ""}
      ${docHead(sup, sup.invoiceTitle || c.invoiceTitle || "Tax Invoice", [[t("Invoice no."), r.number || t("Draft")], [t("Invoice date"), fmtD(r.date)], [t("Date of supply"), r.periodStart ? `${fmtD(r.periodStart)} – ${fmtD(r.periodEnd)}` : fmtD(r.date)], [t("Due date"), fmtD(r.dueDate)]])}
      ${docTo(r.customer || R.partySnapshot(r, DB))}${docLines(r.lines, cur)}${docTotals(r, cur, r.status !== "draft" && Number(r.paid || 0) + Number(r.credited || 0) > 0 ? `<div><span>${t("Paid / credited")}</span><b>${money(Number(r.paid || 0) + Number(r.credited || 0), cur)}</b></div><div class="grand"><span>${t("Balance due")}</span><b>${money(bal, cur)}</b></div>` : "")}
      <section class="doc-foot"><div>${c.bank ? `<b>${t("Bank details")}</b><br>${h(c.bank)}` : ""}${r.paymentLink ? `<br><b>${t("Pay online")}</b>: ${h(r.paymentLink)} <small>(${t("placeholder")})</small>` : ""}${r.notes ? `<p>${h(r.notes)}</p>` : ""}</div><div class="doc-qr">${r.number ? qrSvg(`${sup.legalName}|${sup.trn}|${r.number}|${r.date}|${r.total}|${r.vatTotal}`, 96) : ""}</div></section>${docSign()}
      <p class="doc-note">${h(c.footer || "")} ${t("Amounts in")} ${h(cur)}.</p></article>`;
  }
  if (kind === "creditnote") return `<article class="doc">${docHead(sup, "Tax Credit Note", [[t("Credit note no."), r.number], [t("Date"), fmtD(r.date)], [t("Against invoice"), r.invoiceNumber || ""]])}${docTo(r.customer || {})}<p><b>${t("Reason")}:</b> ${h(r.reason)}</p>${docLines(r.lines, cur)}${docTotals(r, cur).replace(t("Total amount due"), t("Total credit"))}${docSign()}</article>`;
  if (kind === "receipt") { const inv = byId("invoices", r.invoiceId) || {}; return `<article class="doc">${docHead(c, "Payment Receipt", [[t("Receipt no."), r.number], [t("Date"), fmtD(r.date)], [t("Invoice"), r.invoiceNumber || ""]])}${docTo(inv.customer || {}, t("Received from"))}
    <div class="doc-totals"><div><span>${t("Method")}</span><b>${L(r.method)}</b></div><div><span>${t("Reference")}</span><b>${h(r.ref || "—")}</b></div><div class="grand"><span>${t("Amount received")}</span><b>${money(r.amount, cur)}</b></div><div><span>${t("Balance remaining on invoice")}</span><b>${money(inv.id ? invBal(inv) : 0, cur)}</b></div></div>${docSign()}</article>`; }
  if (kind === "quote") { const ld = byId("leads", r.leadId); const cust = ld ? { name: ld.company || ld.name, address: "" } : R.partySnapshot(r, DB);
    return `<article class="doc">${docHead(c, "Quotation", [[t("Quote no."), r.number], [t("Date"), fmtD(r.date)], [t("Valid until"), fmtD(r.validUntil)]])}${docTo(cust, t("Prepared for"))}${docLines(r.lines, cur)}${docTotals(r, cur).replace(t("Total amount due"), t("Total"))}${r.notes ? `<p>${h(r.notes)}</p>` : ""}<p class="doc-note">${t("This quotation is not a tax invoice. Prices are valid until the date shown.")}</p></article>`; }
  if (kind === "contract") { const p = R.partySnapshot(r, DB), ej = r.ejari || {}, [nd] = R.noticeDue(r, TODAY);
    return `<article class="doc">${docHead(c, "Office Services Agreement – Summary", [[t("Contract no."), r.number], [t("Start"), fmtD(r.start)], [t("End"), fmtD(r.end)]])}${docTo(p, t("Client"))}
      <table class="doc-lines kv"><tbody><tr><th>${t("Spaces")}</th><td>${h((r.spaceIds || []).map(s => spaceName(s)).join(", "))}</td></tr><tr><th>${t("Monthly fee")}</th><td>${money(r.monthlyFee, cur)} + ${cfg().vatName || "VAT"}${r.vatExempt ? " (" + t("zero-rated") + ")" : ""}</td></tr>
      ${(r.addons || []).map(a => `<tr><th>${h(a.name)}</th><td>${R.fmtG(a.qty)} × ${money(a.price, cur)} ${t("/ month")}</td></tr>`).join("")}<tr><th>${t("Security deposit")}</th><td>${money(r.deposit, cur)} (${L(r.depositStatus)})</td></tr>
      <tr><th>${t("Notice period")}</th><td>${r.noticeDays} ${t("days")} — ${t("notice by")} ${fmtD(nd)}</td></tr><tr><th>${t("Renewal term")}</th><td>${r.termMonths || 12} ${t("months")}</td></tr></tbody></table>
      ${(c.country || "AE") === "AE" ? `<h3>${t("Ejari-ready details")}</h3><p class="doc-note">${t("For registration by the parties on the official Ejari system.")}</p><table class="doc-lines kv"><tbody>${EJARI_FIELDS.map(([k, l]) => `<tr><th>${t(l)}</th><td>${h(ej[k] === undefined || ej[k] === "" ? "—" : ej[k])}</td></tr>`).join("")}</tbody></table>` : ""}
      <div class="doc-sign"><div><span></span><small>${t("For")} ${h(c.legalName)}</small></div><div><span></span><small>${t("For")} ${h(p.name)}</small></div></div></article>`; }
  return "";
}
ACT["print-doc"] = el => { const coll = { invoice: "invoices", creditnote: "creditnotes", receipt: "receipts", quote: "quotes", contract: "contracts" }[el.dataset.kind]; const r = byId(coll, el.dataset.id); if (r) printHTML(docHTML(el.dataset.kind, r), el.dataset.kind); };
function printHTML(html, kind) {
  let root = $("#print-root"); if (root) root.remove();
  root = document.createElement("div"); root.id = "print-root"; root.className = "print-" + (kind || "doc"); root.innerHTML = html; document.body.appendChild(root);
  document.body.classList.add("printing");
  const done = () => { document.body.classList.remove("printing"); const r2 = $("#print-root"); if (r2 && !window.__keepPrint) r2.remove(); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  if (window.__noPrintDialog) return; setTimeout(() => { try { window.print(); } catch (e) { /* ignore */ } setTimeout(done, 1500); }, 60);
}
