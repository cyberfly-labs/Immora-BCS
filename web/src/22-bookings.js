/* Room calendar (day + week), bookings list and the booking form with live credit preview. */
let CAL_DAY = null, CAL_VIEW = "day";
const roomList = () => DB.spaces.filter(s => ["meeting_room", "event_space"].includes(s.type)).sort((a, b) => (a.type === b.type ? 0 : a.type === "meeting_room" ? -1 : 1) || Number(a.capacity) - Number(b.capacity));
const hm2m = s => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));
function calGrid(day, rooms, bookings, o) {
  o = o || {}; const c = cfg(), from = hm2m(c.openFrom || "07:00"), to = hm2m(c.openTo || "22:00"), span = to - from;
  const hours = []; for (let m = from; m < to; m += 60) hours.push(m);
  const nowM = day === TODAY ? hm2m(NOW) : -1;
  return `<div class="cal" style="--cols:${span / 30}"><div class="cal-head"><div class="cal-room"></div><div class="cal-track hdr">${hours.map(m => `<span style="left:${100 * (m - from) / span}%">${pad2(Math.floor(m / 60))}:00</span>`).join("")}</div></div>
    ${rooms.map(s => `<div class="cal-row"><div class="cal-room"><b>${h(s.name)}</b><small>${s.capacity} ${t("seats")} · ${s.creditRate} ${t("cr/h")}</small></div><div class="cal-track ${s.status === "maintenance" ? "maint" : ""}">
      ${o.click !== false ? Array.from({ length: span / 30 }, (_, i) => { const m = from + i * 30, v = `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`; const past = day < TODAY || (day === TODAY && m + 30 <= nowM); return `<button class="slot ${past ? "past" : ""}" style="left:${100 * i * 30 / span}%;width:${100 * 30 / span}%" data-act="${o.slotAct || "cal-slot"}" data-space="${s.id}" data-t="${v}" aria-label="${h(s.name)} ${v}" ${past ? "disabled" : ""}></button>`; }).join("") : ""}
      ${bookings.filter(b => b.spaceId === s.id && b.start.slice(0, 10) === day && b.status !== "cancelled").map(b => { const a = hm2m(b.start.slice(11)), e = hm2m(b.end.slice(11)); const mine = o.mine && o.mine(b);
        return `<div class="bk ${b.private ? "priv" : ""} ${mine ? "mine" : ""} bk-${b.status}" style="left:${100 * (a - from) / span}%;width:${100 * (e - a) / span}%" ${!b.private && o.open !== false ? `data-act="bk-open" data-id="${b.id}" role="button" tabindex="0"` : ""} title="${h(b.start.slice(11))}–${h(b.end.slice(11))} ${h(b.private ? t("Booked") : (b.title || ""))}"><b>${h(b.start.slice(11))}–${h(b.end.slice(11))}</b><span>${h(b.private ? t("Booked") : (o.label ? o.label(b) : memberName(b.memberId)))}</span></div>`; }).join("")}
      ${nowM >= from && nowM <= to ? `<i class="now" style="left:${100 * (nowM - from) / span}%"></i>` : ""}</div></div>`).join("")}</div>`;
}
PAGES.calendar = () => {
  if (!CAL_DAY) CAL_DAY = TODAY;
  const rooms = roomList(), d = new Date(CAL_DAY + "T00:00:00");
  const dayName = d.toLocaleDateString(LANG === "en" ? "en-GB" : LANG, { weekday: "long" });
  let body;
  if (CAL_VIEW === "day") body = calGrid(CAL_DAY, rooms, DB.bookings);
  else {
    const days = Array.from({ length: 7 }, (_, i) => R.addDays(CAL_DAY, i));
    body = `<div class="table-wrap"><table class="tbl week"><thead><tr><th>${t("Room")}</th>${days.map(x => `<th>${new Date(x + "T00:00:00").toLocaleDateString(LANG === "en" ? "en-GB" : LANG, { weekday: "short" })}<br><small>${fmtD(x)}</small></th>`).join("")}</tr></thead><tbody>
      ${rooms.map(s => `<tr><td data-label="${t("Room")}"><b>${h(s.name)}</b></td>${days.map(x => { const l = DB.bookings.filter(b => b.spaceId === s.id && b.start.slice(0, 10) === x && b.status !== "cancelled").sort((a, b) => a.start < b.start ? -1 : 1); const hrs = sum(l, b => R.hoursBetween(b.start, b.end));
        return `<td data-label="${fmtD(x)}" class="wk ${x === TODAY ? "today" : ""}"><button class="wk-cell" data-act="wk-day" data-d="${x}">${l.length ? `<b>${l.length}</b> · ${hrs.toFixed(1)} h${meter(100 * hrs / 15)}` : `<span class="hint">${t("free")}</span>`}</button></td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  return { title: "Room calendar", html: pageHead(t("Room calendar"), t("Click an empty slot to book. Members' credits are used first; anything beyond is charged at the example hourly price."),
    `<div class="seg"><button class="${CAL_VIEW === "day" ? "on" : ""}" data-act="cal-view" data-v="day">${t("Day")}</button><button class="${CAL_VIEW === "week" ? "on" : ""}" data-act="cal-view" data-v="week">${t("Week")}</button></div>
     <div class="seg"><button data-act="cal-move" data-n="-1" aria-label="${t("Previous")}">‹</button><button data-act="cal-move" data-n="0">${t("Today")}</button><button data-act="cal-move" data-n="1" aria-label="${t("Next")}">›</button></div>
     ${can("bookings") ? btn(ic("plus") + t("New booking"), "bk-new", {}, "btn-primary", "btn-bk-new") : ""}`) +
    `<div class="cal-title"><h3>${h(dayName)} ${fmtD(CAL_DAY)}${CAL_VIEW === "week" ? " – " + fmtD(R.addDays(CAL_DAY, 6)) : ""}</h3><form class="inline" data-form="cal-jump">${dateInp("d", CAL_DAY, `aria-label="${t("Go to date")}"`)}<button class="btn btn-ghost btn-sm">${t("Go")}</button></form></div>
    <div class="card cal-card" id="calendar">${body}</div>` };
};
FORMS["cal-jump"] = d => { if (d.d) { CAL_DAY = d.d; render(); } };
ACT["cal-view"] = el => { CAL_VIEW = el.dataset.v; render(); };
ACT["cal-move"] = el => { const n = Number(el.dataset.n); CAL_DAY = n === 0 ? TODAY : R.addDays(CAL_DAY || TODAY, n * (CAL_VIEW === "week" ? 7 : 1)); render(); };
ACT["wk-day"] = el => { CAL_DAY = el.dataset.d; CAL_VIEW = "day"; render(); };
ACT["cal-slot"] = el => { if (!can("bookings")) return toast(t("Your role cannot book rooms."), "err"); const s = Math.min(hm2m(el.dataset.t) + 60, 22 * 60); bookingModal({ spaceId: el.dataset.space, date: CAL_DAY, from: el.dataset.t, to: `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}` }); };
ACT["bk-new"] = () => bookingModal({ date: CAL_DAY || TODAY });
ACT["bk-open"] = el => bookingModal({ id: el.dataset.id });

function bookingModal(o) {
  o = o || {}; const b = o.id ? byId("bookings", o.id) : null;
  const rooms = DB.spaces.filter(s => SHARED.BOOKABLE.includes(s.type));
  const sp = b ? b.spaceId : (o.spaceId || (roomList()[0] || {}).id), date = b ? b.start.slice(0, 10) : (o.date || TODAY);
  const from = b ? b.start.slice(11) : (o.from || (date === TODAY ? nextHalf() : "09:00")), to = b ? b.end.slice(11) : (o.to || addMin(from, 60));
  const ro = b && !can("bookings");
  modal(b ? t("Booking") : t("New booking"), `<form data-form="booking" data-id="${h(b ? b.id : "")}" class="grid-form" id="booking-form">
    ${fld(t("Room / space"), `<select name="spaceId" data-live="bk-preview" required>${opts(rooms.map(s => [s.id, `${s.name} (${s.capacity} ${t("seats")}${s.status === "maintenance" ? " · " + L("maintenance") : ""})`]), sp)}</select>`, { req: true })}
    ${fld(t("Member"), `<select name="memberId" data-live="bk-preview">${memberOpts(b ? b.memberId : (o.memberId || ""), t("— walk-in / no member —"))}</select>`)}
    ${fld(t("Date"), dateInp("date", date, 'required data-live="bk-preview"'), { req: true })}
    <div class="fld-pair">${fld(t("From"), `<select name="from" data-live="bk-preview">${timeOpts(from)}</select>`)}${fld(t("To"), `<select name="to" data-live="bk-preview">${timeOpts(to, 7, 22)}</select>`)}</div>
    ${fld(t("Title"), inp("title", b ? b.title : "", `placeholder="${t("e.g. Client meeting")}"`))}${fld(t("Attendees"), numInp("attendees", b ? b.attendees : 2))}
    ${fld(t("Status"), selInp("status", ["confirmed", "tentative", "checked_in", "cancelled"].map(x => [x, L(x)]), b ? b.status : "confirmed"))}
    ${fld(t("Notes"), inp("notes", b ? b.notes : ""))}
    <div class="wide" id="bk-preview"></div>
    <div class="form-foot wide">${b && can("bookings") && b.status !== "cancelled" ? btn(t("Cancel booking"), "bk-cancel", { id: b.id }, "btn-danger-ghost", "btn-bk-cancel") : ""}${ro ? "" : `<button class="btn btn-primary" id="btn-bk-save">${b ? t("Save") : t("Book")}</button>`}</div></form>`, { wide: true });
  LIVE["bk-preview"]();
}
const nextHalf = () => { const m = Math.min(hm2m("21:00"), Math.ceil((hm2m(NOW) + 1) / 30) * 30); return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`; };
const addMin = (s, n) => { const m = Math.min(hm2m("22:00"), hm2m(s) + n); return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`; };
LIVE["bk-preview"] = () => {
  const f = $("#booking-form"); if (!f) return; const box = $("#bk-preview");
  const sp = byId("spaces", f.spaceId.value), date = parseD(f.date.value), m = byId("members", f.memberId.value), id = f.dataset.id;
  if (!sp || !date) { box.innerHTML = ""; return; }
  const rec = { id: id || "__new", start: `${date}T${f.from.value}`, end: `${date}T${f.to.value}` };
  if (rec.end <= rec.start) { box.innerHTML = `<div class="note warn">${t("End time must be after the start time")}</div>`; return; }
  const clash = DB.bookings.find(b => b.id !== id && b.spaceId === sp.id && b.status !== "cancelled" && b.start < rec.end && rec.start < b.end);
  const [cr, oh, oa] = R.priceBooking(rec, sp, m, DB.bookings, DB.plans);
  const left = m ? R.creditsLeft(m, date, DB.bookings, DB.plans, id) : 0;
  box.innerHTML = `${clash ? `<div class="note bad">${ic("alert")} ${t("Already booked")} ${clash.start.slice(11)}–${clash.end.slice(11)} (${h(clash.private ? t("Booked") : memberName(clash.memberId))})</div>` : `<div class="note ok">${ic("check")} ${t("Room is free at this time")}</div>`}
    <div class="price-box"><div><small>${t("Duration")}</small><b>${R.hoursBetween(rec.start, rec.end)} h</b></div><div><small>${t("Credits used")}</small><b>${cr}</b>${m ? `<small>${t("of")} ${left} ${t("left this month")}</small>` : ""}</div><div><small>${t("Pay-as-you-go")}</small><b>${money(oa)}</b><small>${oh ? oh + " h × " + money(sp.priceHour) + " + " + (cfg().vatName || "VAT") : t("nothing extra")}</small></div></div>`;
};
FORMS.booking = async (d, form) => {
  const id = form.dataset.id, old = id ? byId("bookings", id) : {};
  const rec = Object.assign({}, old, { spaceId: d.spaceId, memberId: d.memberId, start: `${d.date}T${d.from}`, end: `${d.date}T${d.to}`, title: d.title, attendees: d.attendees || 1, status: d.status, notes: d.notes, id: id || uid("BK") });
  const r = await save("bookings", rec, { form, msg: id ? t("Booking updated") : t("Room booked") }); if (r) { closeModal(); render(); }
};
ACT["bk-cancel"] = async el => { const b = byId("bookings", el.dataset.id); if (!(await confirmBox(t("Cancel this booking? Credits go back to the member."), t("Cancel booking"), true))) return; if (await save("bookings", Object.assign({}, b, { status: "cancelled" }), { msg: t("Booking cancelled") })) { closeModal(); render(); } };

PAGES.bookings = () => {
  const rows = DB.bookings.slice().sort((a, b) => a.start < b.start ? 1 : -1);
  return { title: "All bookings", html: pageHead(t("All bookings"), t("Every room booking, newest first."), (can("bookings") ? btn(ic("plus") + t("New booking"), "bk-new", {}, "btn-primary") : "") + btn(t("Export CSV"), "bk-csv")) +
    `<div class="card">${filterBox("tbl-bk")}${table([{ label: "Date", f: b => fmtD(b.start) }, { label: "Time", f: b => `${b.start.slice(11)}–${b.end.slice(11)}` }, { label: "Room", f: b => h(spaceName(b.spaceId)) }, { label: "Member", f: b => h(memberName(b.memberId)) }, { label: "Title", k: "title" },
      { label: "Credits", k: "creditsUsed", cls: "num" }, { label: "Extra charge", f: b => b.overageAmount ? money(b.overageAmount) : "—", cls: "num" }, { label: "Status", f: b => chip(b.status) }], rows, { id: "tbl-bk", rowAttr: b => `data-act="bk-open" data-id="${b.id}" class="click"` })}</div>` };
};
ACT["bk-csv"] = () => download(`bookings-${TODAY}.csv`, csv(DB.bookings, [[b => fmtD(b.start), "Date"], [b => b.start.slice(11), "From"], [b => b.end.slice(11), "To"], [b => spaceName(b.spaceId), "Room"], [b => memberName(b.memberId), "Member"], ["title", "Title"], ["creditsUsed", "Credits"], ["overageAmount", "Extra charge"], ["status", "Status"]]), "text/csv");
