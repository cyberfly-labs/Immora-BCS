/* Member portal: book rooms with credits, see invoices, raise requests, invite guests, see mail. */
const meMember = () => byId("members", ME.memberId) || {};
PAGES["p-home"] = () => {
  const m = meMember(), left = R.creditsLeft(m, TODAY, DB.bookings, DB.plans), allow = R.allowance(m, DB.plans);
  const up = DB.bookings.filter(b => b.memberId === m.id && b.status !== "cancelled" && b.end >= `${TODAY}T${NOW}`).sort((a, b) => a.start < b.start ? -1 : 1).slice(0, 5);
  const unpaid = DB.invoices.filter(i => ["issued", "part_paid"].includes(i.status) && invBal(i) > 0), mail = DB.mail.filter(x => ["received", "notified"].includes(x.status));
  const c = cfg();
  return { title: "Home", html: `<div class="hero portal-hero"><div><h2>${t("Welcome")}, ${h((m.name || "").split(" ")[0])}</h2><p class="sub">${h(c.tradeName || c.legalName)} · ${fmtD(TODAY)}</p></div></div>
    <div class="quick-grid" id="portal-actions"><button class="quick" data-act="quick" data-k="p-book">${ic("cal")}<span>${t("Book a room")}</span></button><button class="quick" data-act="quick" data-k="p-ticket-new">${ic("ticket")}<span>${t("Raise a request")}</span></button><button class="quick" data-act="quick" data-k="p-guest-new">${ic("qr")}<span>${t("Invite a guest")}</span></button><a class="quick" href="#/p-invoices">${ic("bill")}<span>${t("My invoices")}</span></a></div>
    <div class="kpis">${kpi(t("Room credits left"), `${left} / ${allow}`, t("this month"), "cal", "violet", meter(allow ? 100 * left / allow : 0))}${kpi(t("Upcoming bookings"), up.length, "", "file", "blue")}${kpi(t("To pay"), money(sum(unpaid, invBal)), `${unpaid.length} ${t("invoices")}`, "bill", unpaid.length ? "amber" : "green")}${kpi(t("Mail waiting"), mail.length, t("at reception"), "mail", mail.length ? "teal" : "green")}</div>
    <div class="grid-2"><div class="card"><div class="card-head"><h3>${t("My next bookings")}</h3>${link(t("Book a room"), "p-book")}</div>${up.length ? `<ul class="timeline">${up.map(b => `<li><b>${fmtD(b.start)} ${b.start.slice(11)}–${b.end.slice(11)}</b><span>${h(spaceName(b.spaceId))}</span><small>${h(b.title || "")}</small></li>`).join("")}</ul>` : empty(t("No bookings yet."))}</div>
    <div class="card"><div class="card-head"><h3>${t("Mail for me")}</h3></div>${mail.length ? `<ul class="alerts">${mail.map(x => `<li>${ic("mail")}<span>${L(x.type)} ${t("from")} ${h(x.sender)} · ${fmtD(x.received)}</span></li>`).join("")}</ul>` : empty(t("Nothing waiting."))}</div></div>` };
};
let P_DAY = null;
PAGES["p-book"] = () => {
  if (!P_DAY || P_DAY < TODAY) P_DAY = TODAY;
  const m = meMember(), left = R.creditsLeft(m, P_DAY, DB.bookings, DB.plans);
  return { title: "Book a room", html: pageHead(t("Book a room"), `${t("You have")} <b>${left}</b> ${t("credits left this month. Tap a free slot to book.")}`, `<div class="seg"><button data-act="p-move" data-n="-1" ${P_DAY <= TODAY ? "disabled" : ""}>‹</button><button class="on">${fmtD(P_DAY)}</button><button data-act="p-move" data-n="1">›</button></div>`) +
    `<div class="card cal-card" id="portal-cal">${calGrid(P_DAY, DB.spaces.filter(s => ["meeting_room", "event_space"].includes(s.type)), DB.bookings, { slotAct: "p-slot", mine: b => b.memberId === m.id, label: b => b.title || t("My booking"), open: false })}</div>
    <p class="hint">${t("Your bookings are highlighted. Other members' bookings show only as Booked.")}</p>` };
};
ACT["p-move"] = el => { P_DAY = R.addDays(P_DAY, Number(el.dataset.n)); if (P_DAY < TODAY) P_DAY = TODAY; render(); };
ACT["p-slot"] = el => { const s = Math.min(hm2m(el.dataset.t) + 60, 22 * 60); portalBookModal(el.dataset.space, P_DAY, el.dataset.t, `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`); };
function portalBookModal(spaceId, day, from, to) {
  const rooms = DB.spaces.filter(s => ["meeting_room", "event_space"].includes(s.type));
  modal(t("Book a room"), `<form data-form="p-book" class="grid-form" id="booking-form"><input type="hidden" name="memberId" value="${h(ME.memberId)}">
    ${fld(t("Room"), `<select name="spaceId" data-live="bk-preview">${opts(rooms.map(s => [s.id, `${s.name} (${s.capacity} ${t("seats")})`]), spaceId)}</select>`, { wide: true })}${fld(t("Date"), dateInp("date", day, 'data-live="bk-preview"'))}
    <div class="fld-pair">${fld(t("From"), `<select name="from" data-live="bk-preview">${timeOpts(from)}</select>`)}${fld(t("To"), `<select name="to" data-live="bk-preview">${timeOpts(to)}</select>`)}</div>${fld(t("Title"), inp("title", "", `placeholder="${t("e.g. Client meeting")}"`))}${fld(t("Attendees"), numInp("attendees", 2))}
    <div class="wide" id="bk-preview"></div><div class="form-foot wide"><button class="btn btn-primary" id="btn-p-book">${t("Book")}</button></div></form>`, { wide: true });
  LIVE["bk-preview"]();
}
FORMS["p-book"] = async (d, form) => { const r = await save("bookings", { id: uid("BK"), spaceId: d.spaceId, memberId: ME.memberId, start: `${d.date}T${d.from}`, end: `${d.date}T${d.to}`, title: d.title, attendees: d.attendees || 1, status: "confirmed" }, { form, msg: t("Room booked") }); if (r) { closeModal(); render(); } };
PAGES["p-bookings"] = () => ({ title: "My bookings", html: pageHead(t("My bookings"), "", btn(ic("plus") + t("Book a room"), "quick", { k: "p-book" }, "btn-primary")) +
  `<div class="card">${table([{ label: "Date", f: b => fmtD(b.start) }, { label: "Time", f: b => `${b.start.slice(11)}–${b.end.slice(11)}` }, { label: "Room", f: b => h(spaceName(b.spaceId)) }, { label: "Title", k: "title" }, { label: "Credits", k: "creditsUsed", cls: "num" }, { label: "Extra charge", f: b => b.overageAmount ? money(b.overageAmount) : "—", cls: "num" }, { label: "Status", f: b => chip(b.status) },
    { label: "", f: b => b.status === "confirmed" && b.start > `${TODAY}T${NOW}` ? btn(t("Cancel"), "p-cancel", { id: b.id }, "btn-ghost btn-sm") : "" }], DB.bookings.filter(b => b.memberId === ME.memberId).sort((a, b) => a.start < b.start ? 1 : -1))}</div>` });
ACT["p-cancel"] = async el => { const b = byId("bookings", el.dataset.id); if (await confirmBox(t("Cancel this booking? Your credits come back."), t("Cancel booking"), true) && await save("bookings", Object.assign({}, b, { status: "cancelled" }), { msg: t("Booking cancelled") })) render(); };
PAGES["p-invoices"] = () => ({ title: "Invoices", html: pageHead(t("Invoices"), t("Tax invoices for you or your company.")) +
  `<div class="card">${table([{ label: "Number", f: i => `<b>${h(i.number)}</b>` }, { label: "Date", f: i => fmtD(i.date) }, { label: "Due", f: i => fmtD(i.dueDate) }, { label: "Total", f: i => money(i.total), cls: "num" }, { label: "Balance", f: i => money(invBal(i)), cls: "num" }, { label: "Status", f: i => chip(i.status) },
    { label: "", f: i => btn(ic("print") + t("View"), "p-inv", { id: i.id }, "btn-ghost btn-sm") + (i.paymentLink ? ` <small class="hint">${t("Pay online (placeholder)")}</small>` : "") }], DB.invoices.slice().sort((a, b) => (a.number || "") < (b.number || "") ? 1 : -1))}</div>` });
ACT["p-inv"] = el => { const i = byId("invoices", el.dataset.id); modal(i.number, `<div class="doc-preview">${docHTML("invoice", i)}</div><div class="form-foot">${btn(ic("print") + t("Print / PDF"), "print-doc", { kind: "invoice", id: i.id }, "btn-primary")}</div>`, { wide: true }); };
PAGES["p-tickets"] = () => ({ title: "Help & requests", html: pageHead(t("Help & requests"), t("Tell us about anything that needs fixing or help."), btn(ic("plus") + t("Raise a request"), "quick", { k: "p-ticket-new" }, "btn-primary", "btn-p-ticket")) +
  `<div class="card">${table([{ label: "No.", k: "number" }, { label: "Subject", k: "subject" }, { label: "Category", f: x => L(x.category === "maintenance" ? "maintenance_c" : x.category) }, { label: "Opened", f: x => fmtD(x.opened) }, { label: "Status", f: x => chip(x.status) }, { label: "Latest update", f: x => h(((x.comments || []).slice(-1)[0] || {}).text || "—") }], DB.tickets.slice().sort((a, b) => a.opened < b.opened ? 1 : -1))}</div>` });
function portalTicketModal() {
  modal(t("Raise a request"), `<form data-form="p-ticket" class="grid-form">${fld(t("What do you need?"), inp("subject", "", "required"), { req: true, wide: true })}${fld(t("Category"), selInp("category", SHARED.TICKET_CATS.map(c => [c, L(c === "maintenance" ? "maintenance_c" : c)]), "maintenance"))}${fld(t("How urgent?"), selInp("priority", ["low", "normal", "high"].map(c => [c, L(c)]), "normal"))}
    ${fld(t("Where?"), inp("location", ""))}${fld(t("Details"), txt("description", ""), { wide: true })}<div class="form-foot wide"><button class="btn btn-primary" id="btn-p-ticket-save">${t("Send request")}</button></div></form>`, { wide: true });
}
FORMS["p-ticket"] = async (d, form) => { if (await save("tickets", Object.assign({ id: uid("TK"), memberId: ME.memberId, status: "open", comments: [] }, d), { form, msg: t("Request sent") })) { closeModal(); go("p-tickets"); } };
PAGES["p-visitors"] = () => ({ title: "My guests", html: pageHead(t("My guests"), t("Pre-register guests so reception can welcome them."), btn(ic("plus") + t("Invite a guest"), "quick", { k: "p-guest-new" }, "btn-primary")) +
  `<div class="card">${table([{ label: "Date", f: v => fmtD(v.date) }, { label: "Guest", k: "name" }, { label: "Company", k: "company" }, { label: "Status", f: v => chip(v.status) }, { label: "", f: v => v.status === "expected" ? btn(t("Cancel"), "p-guest-cancel", { id: v.id }, "btn-ghost btn-sm") : "" }], DB.visitors.slice().sort((a, b) => a.date < b.date ? 1 : -1))}</div>` });
function portalGuestModal() {
  modal(t("Invite a guest"), `<form data-form="p-guest" class="grid-form">${fld(t("Guest name"), inp("name", "", "required"), { req: true })}${fld(t("Guest company"), inp("company", ""))}${fld(t("Date"), dateInp("date", TODAY))}${fld(t("Mobile"), inp("phone", ""))}<div class="form-foot wide"><button class="btn btn-primary">${t("Invite")}</button></div></form>`);
}
FORMS["p-guest"] = async (d, form) => { if (await save("visitors", Object.assign({ id: uid("VS"), hostId: ME.memberId, status: "expected", purpose: "Meeting" }, d), { form, msg: t("Guest registered — reception will check them in") })) { closeModal(); go("p-visitors"); } };
ACT["p-guest-cancel"] = async el => { const v = byId("visitors", el.dataset.id); if (await save("visitors", Object.assign({}, v, { status: "cancelled" }))) render(); };
PAGES["p-mail"] = () => ({ title: "Mail for me", html: pageHead(t("Mail for me"), t("Letters and parcels received for you or your company.")) +
  `<div class="card">${table([{ label: "Received", f: m => fmtD(m.received) }, { label: "Type", f: m => L(m.type) }, { label: "From", k: "sender" }, { label: "Status", f: m => chip(m.status) }], DB.mail.slice().sort((a, b) => a.received < b.received ? 1 : -1))}${DB.calls.length ? `<h3>${t("Messages taken for you")}</h3>${table([{ label: "When", f: c => fmtDT(c.when) }, { label: "Caller", k: "caller" }, { label: "Message", k: "message" }], DB.calls)}` : ""}</div>` });
