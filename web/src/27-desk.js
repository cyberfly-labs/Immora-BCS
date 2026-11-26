/* Front desk: member check-in, visitors with QR badges, access-card log (simulated reader). */
function qrSvg(text, size) {
  try { const q = qrcode(0, "M"); q.addData(text); q.make(); const n = q.getModuleCount(), s = size || 120, c = s / (n + 8); let p = "";
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) p += `M${((k + 4) * c).toFixed(2)},${((r + 4) * c).toFixed(2)}h${c.toFixed(2)}v${c.toFixed(2)}h-${c.toFixed(2)}z`;
    return `<svg class="qr" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" role="img" aria-label="QR ${h(text)}"><rect width="${s}" height="${s}" fill="#fff"/><path d="${p}" fill="#000"/></svg>`; }
  catch (e) { return ""; }
}
function visitorList(vis) {
  if (!vis.length) return empty(t("No visitors expected today."), can("visitors") ? btn(t("Register visitor"), "vis-new", {}, "btn-primary btn-sm") : "");
  return `<ul class="people">${vis.map(v => `<li><span class="avatar">${h(v.name.slice(0, 1))}</span><div><b>${h(v.name)}</b><small>${t("Host")}: ${h(memberName(v.hostId))}${v.inAt ? " · " + t("in") + " " + v.inAt : ""}</small></div>${chip(v.status)}
    <div class="row-act">${can("visitors") ? (v.status === "expected" ? btn(t("Check in"), "vis-in", { id: v.id }, "btn-primary btn-sm") : v.status === "checked_in" ? btn(t("Badge"), "vis-badge", { id: v.id }, "btn-ghost btn-sm") + btn(t("Check out"), "vis-out", { id: v.id }, "btn-ghost btn-sm") : "") : ""}</div></li>`).join("")}</ul>`;
}
PAGES.checkin = () => {
  const today = DB.checkins.filter(c => c.date === TODAY).sort((a, b) => a.time < b.time ? 1 : -1), inIds = new Set(today.map(c => c.memberId));
  const act = DB.members.filter(m => m.status === "active");
  return { title: "Check-in", html: pageHead(t("Check-in"), `${today.length} ${t("members checked in today")}`, canAct("card_tap") ? btn(ic("card") + t("Card tap (simulated)"), "cardtap", {}, "btn-ghost", "btn-cardtap") : "") +
    `<div class="grid-2"><div class="card"><h3>${t("Check a member in")}</h3><form data-form="checkin" class="inline-form">${fld(t("Member"), `<select name="memberId" required>${memberOpts("")}</select>`)}<button class="btn btn-primary" id="btn-checkin">${t("Check in")}</button></form>
      <h4>${t("Not in yet")}</h4><div class="chips wrap">${act.filter(m => !inIds.has(m.id)).slice(0, 24).map(m => can("checkins") ? `<button class="chip-btn" data-act="quick-in" data-id="${m.id}">${h(m.name)}</button>` : `<span class="chip">${h(m.name)}</span>`).join("")}</div></div>
    <div class="card"><h3>${t("In today")}</h3>${table([{ label: "Time", k: "time" }, { label: "Member", f: c => link(memberName(c.memberId), "member/" + c.memberId) }, { label: "How", f: c => c.via === "card" ? t("Access card") : t("Front desk") }], today)}</div></div>
    <div class="card"><div class="card-head"><h3>${t("Visitors today")}</h3>${can("visitors") ? btn(ic("plus") + t("Register visitor"), "vis-new", {}, "btn-ghost btn-sm") : ""}</div>${visitorList(DB.visitors.filter(v => v.date === TODAY && v.status !== "cancelled"))}</div>` };
};
FORMS.checkin = async d => { if (DB.checkins.some(c => c.memberId === d.memberId && c.date === TODAY)) return toast(t("Already checked in today"), "err"); if (await save("checkins", { id: uid("CHK"), memberId: d.memberId, date: TODAY, time: NOW, via: "front_desk" }, { msg: t("Checked in") })) render(); };
ACT["quick-in"] = el => FORMS.checkin({ memberId: el.dataset.id });

PAGES.visitors = () => ({ title: "Visitors", html: pageHead(t("Visitors"), t("Pre-register guests, check them in with one click and print a QR badge."), can("visitors") ? btn(ic("plus") + t("Register visitor"), "vis-new", {}, "btn-primary", "btn-vis-new") : "") +
  `<div class="card">${filterBox("tbl-vis")}${table([{ label: "Date", f: v => fmtD(v.date) }, { label: "Visitor", f: v => `<b>${h(v.name)}</b><small class="sub-line">${h(v.company || "")}</small>` }, { label: "Host", f: v => h(memberName(v.hostId)) }, { label: "Badge", k: "number" }, { label: "In", k: "inAt" }, { label: "Out", k: "outAt" }, { label: "Status", f: v => chip(v.status) },
    { label: "", f: v => !can("visitors") ? "" : v.status === "expected" ? btn(t("Check in"), "vis-in", { id: v.id }, "btn-primary btn-sm") : v.status === "checked_in" ? btn(t("Badge"), "vis-badge", { id: v.id }, "btn-ghost btn-sm") + btn(t("Check out"), "vis-out", { id: v.id }, "btn-ghost btn-sm") : "" }], DB.visitors.slice().sort((a, b) => a.date < b.date ? 1 : -1), { id: "tbl-vis" })}</div>` });
ACT["vis-new"] = () => visitorModal();
function visitorModal() {
  modal(t("Register visitor"), `<form data-form="visitor" class="grid-form">${fld(t("Visitor name"), inp("name", "", "required"), { req: true })}${fld(t("Visitor company"), inp("company", ""))}${fld(t("Mobile"), inp("phone", "", 'type="tel"'))}
    ${fld(t("Host member"), `<select name="hostId" required>${memberOpts("")}</select>`, { req: true })}${fld(t("Date"), dateInp("date", TODAY))}${fld(t("Purpose"), inp("purpose", "Meeting"))}
    <label class="fld check wide"><input type="checkbox" name="now" checked><span>${t("Check in now and show the QR badge")}</span></label><div class="form-foot wide"><button class="btn btn-primary" id="btn-vis-save">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.visitor = async (d, form) => {
  const now = d.now && (d.date || TODAY) === TODAY;
  const r = await save("visitors", { id: uid("VS"), name: d.name, company: d.company, phone: d.phone, hostId: d.hostId, date: d.date || TODAY, purpose: d.purpose, status: now ? "checked_in" : "expected", inAt: now ? NOW : "" }, { form, msg: now ? t("Visitor checked in") : t("Visitor registered") });
  if (r) { closeModal(true); render(); if (now) badgeModal(r.id); }
};
ACT["vis-in"] = async el => { const v = byId("visitors", el.dataset.id); const r = await save("visitors", Object.assign({}, v, { status: "checked_in", inAt: NOW }), { msg: t("Visitor checked in") }); if (r) { render(); badgeModal(r.id); } };
ACT["vis-out"] = async el => { const v = byId("visitors", el.dataset.id); if (await save("visitors", Object.assign({}, v, { status: "checked_out", outAt: NOW }), { msg: t("Visitor checked out") })) render(); };
ACT["vis-badge"] = el => badgeModal(el.dataset.id);
function badgeModal(id) {
  const v = byId("visitors", id), c = cfg();
  modal(t("Visitor badge"), `<div class="badge-card" id="badge"><div class="badge-top">${h(c.tradeName || c.legalName)}</div><div class="badge-name">${h(v.name)}</div><div class="badge-co">${h(v.company || "")}</div>
    ${qrSvg(`BCS-VISITOR|${v.number}|${v.date}`, 150)}<div class="badge-meta"><b>${h(v.number)}</b> · ${fmtD(v.date)} · ${t("Host")}: ${h(memberName(v.hostId))}</div><div class="badge-foot">${t("VISITOR")}</div></div>
    <p class="hint">${t("QR badge is simulated: the code is real, but no door reader is connected.")}</p><div class="form-foot">${btn(ic("print") + t("Print badge"), "print-badge", { id }, "btn-primary")}</div>`);
}
ACT["print-badge"] = () => printHTML($("#badge").outerHTML, "badge");

PAGES.access = () => ({ title: "Access-card log", html: pageHead(t("Access-card log"), t("Simulated card reader: no real door hardware is connected. Use it to test cards, blocks and check-ins."), canAct("card_tap") ? btn(ic("card") + t("Card tap (simulated)"), "cardtap", {}, "btn-primary", "btn-cardtap") : "") +
  `<div class="card">${table([{ label: "Time", f: a => fmtDT(a.at) }, { label: "Card", k: "cardNo" }, { label: "Member", f: a => a.memberId ? link(memberName(a.memberId), "member/" + a.memberId) : "—" }, { label: "Door", k: "door" }, { label: "Result", f: a => chip(a.result) + (a.reason ? ` <small>${h(t(a.reason))}</small>` : "") }], DB.access.slice().sort((a, b) => a.at < b.at ? 1 : -1))}</div>` });
ACT.cardtap = () => cardTapModal();
function cardTapModal() {
  modal(t("Card tap (simulated)"), `<form data-form="cardtap" class="grid-form">${fld(t("Card number"), `<input name="cardNo" list="dl-cards" required id="tap-card">`, { req: true })}<datalist id="dl-cards">${DB.members.filter(m => m.cardNo).map(m => `<option value="${h(m.cardNo)}">${h(m.name)}</option>`).join("")}</datalist>
    ${fld(t("Door"), selInp("door", ["Main entrance", "Floor 12 coworking", "Floor 14 offices", "Car park"].map(x => [x, t(x)]), "Main entrance"))}<div class="form-foot wide"><button class="btn btn-primary" id="btn-tap">${t("Tap card")}</button></div><div id="tap-res" class="wide"></div></form>`);
}
FORMS.cardtap = async d => { const r = await act("card_tap", d); if (r) { $("#tap-res").innerHTML = `<div class="note ${r.result === "granted" ? "ok" : "bad"}">${ic(r.result === "granted" ? "check" : "alert")} ${L(r.result)}${r.member ? " · " + h(r.member) : ""}${r.reason ? " · " + h(t(r.reason)) : ""}</div>`; if (curRoute().name !== "dashboard") setTimeout(render, 900); } };
