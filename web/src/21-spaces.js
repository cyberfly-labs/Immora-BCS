/* Floor plan, space inventory, plans and add-on products. */
const FLOORS = () => Array.from(new Set(DB.spaces.map(s => s.floor || "1"))).sort((a, b) => (a === "B1" ? -1 : b === "B1" ? 1 : a.localeCompare(b, undefined, { numeric: true })));
let FP_FLOOR = null, FP_EDIT = false;
PAGES.floorplan = arg => {
  const floors = FLOORS(); if (!FP_FLOOR || !floors.includes(FP_FLOOR)) FP_FLOOR = floors.includes("12") ? "12" : floors[0];
  const list = DB.spaces.filter(s => (s.floor || "1") === FP_FLOOR);
  const W = Math.max(900, ...list.map(s => (s.x || 0) + (s.w || 60) + 30)), H = Math.max(420, ...list.map(s => (s.y || 0) + (s.h || 50) + 30));
  const counts = { available: 0, occupied: 0, reserved: 0, maintenance: 0 }; list.forEach(s => counts[spaceState(s)]++);
  const rects = list.map(s => { const st = spaceState(s), hd = holderOf(s), small = (s.w || 60) < 70;
    return `<g class="sp st-${st} ty-${s.type}" data-act="space" data-id="${s.id}" tabindex="0" role="button" aria-label="${h(s.code)} ${h(L(st))}" transform="translate(${s.x || 0},${s.y || 0})">
      <rect width="${s.w || 60}" height="${s.h || 50}" rx="8"/><text x="8" y="${small ? 20 : 22}" class="sp-code">${h(s.code)}</text>
      ${small ? "" : `<text x="8" y="40" class="sp-sub">${h(hd ? hd.name.slice(0, Math.floor((s.w || 60) / 7)) : L(st))}</text>`}${s.capacity > 1 && !small ? `<text x="${(s.w || 60) - 8}" y="22" text-anchor="end" class="sp-cap">${s.capacity}👤</text>` : ""}</g>`; }).join("");
  return { title: "Floor plan", html: pageHead(t("Floor plan"), t("Live status of every desk, office and room. Click a space for details and one-click actions."),
    `<div class="seg">${floors.map(f => `<button class="${f === FP_FLOOR ? "on" : ""}" data-act="fp-floor" data-f="${h(f)}">${t("Floor")} ${h(f)}</button>`).join("")}</div>${can("spaces") ? btn(FP_EDIT ? t("Done editing") : t("Edit layout"), "fp-edit", {}, FP_EDIT ? "btn-primary" : "btn-ghost", "btn-fp-edit") : ""}`) +
    `<div class="legend fp-legend">${Object.entries(counts).map(([k, v]) => `<span><i class="sw st-${k}"></i>${L(k)} <b>${v}</b></span>`).join("")}</div>
    ${FP_EDIT ? `<div class="note">${t("Drag spaces to move them. Changes save when you let go.")}</div>` : ""}
    <div class="card fp-card"><svg id="floorplan" class="floorplan ${FP_EDIT ? "editing" : ""}" viewBox="0 0 ${W} ${H}" role="group" aria-label="${t("Floor plan")}"><rect class="fp-bg" width="${W}" height="${H}" rx="14"/>${rects}</svg></div>` };
};
AFTER.floorplan = () => {
  const svg = $("#floorplan"); if (!svg || !FP_EDIT) return;
  let drag = null;
  const pt = ev => { const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  svg.addEventListener("pointerdown", ev => { const g = ev.target.closest(".sp"); if (!g) return; const s = byId("spaces", g.dataset.id), p = pt(ev); drag = { g, s, dx: p.x - (s.x || 0), dy: p.y - (s.y || 0), moved: false }; g.setPointerCapture(ev.pointerId); ev.preventDefault(); });
  svg.addEventListener("pointermove", ev => { if (!drag) return; const p = pt(ev); drag.nx = Math.max(0, Math.round((p.x - drag.dx) / 10) * 10); drag.ny = Math.max(0, Math.round((p.y - drag.dy) / 10) * 10); drag.moved = true; drag.g.setAttribute("transform", `translate(${drag.nx},${drag.ny})`); });
  svg.addEventListener("pointerup", async () => { if (!drag) return; const d = drag; drag = null; if (d.moved) { window.__fpNoClick = Date.now(); await save("spaces", Object.assign({}, d.s, { x: d.nx, y: d.ny }), { msg: t("Layout saved") }); } });
};
ACT["fp-floor"] = el => { FP_FLOOR = el.dataset.f; render(); };
ACT["fp-edit"] = () => { FP_EDIT = !FP_EDIT; render(); };
ACT.space = el => { if (FP_EDIT || (window.__fpNoClick && Date.now() - window.__fpNoClick < 400)) return; spaceModal(el.dataset.id); };
document.addEventListener("keydown", ev => { if (ev.key === "Enter" && ev.target.classList && ev.target.classList.contains("sp")) ACT.space(ev.target); });

function spaceModal(id) {
  const s = byId("spaces", id); if (!s) return;
  const st = spaceState(s), hd = holderOf(s), bookable = SHARED.BOOKABLE.includes(s.type);
  const next = DB.bookings.filter(b => b.spaceId === s.id && b.status !== "cancelled" && b.end >= `${TODAY}T${NOW}`).sort((a, b) => a.start < b.start ? -1 : 1).slice(0, 5);
  const price = [s.priceMonth ? `${money(s.priceMonth)} ${t("/ month")}` : "", s.priceDay ? `${money(s.priceDay)} ${t("/ day")}` : "", s.priceHour ? `${money(s.priceHour)} ${t("/ hour")}` : "", bookable && s.creditRate ? `${s.creditRate} ${t("credit(s) / hour")}` : ""].filter(Boolean).join(" · ");
  modal(`${s.code} · ${s.name}`, `<div class="space-sum">${chip(st, "st-" + st)} <span class="hint">${L(s.type)} · ${t("Floor")} ${h(s.floor || "")}${s.capacity ? ` · ${s.capacity} ${t("seats")}` : ""}${s.area ? ` · ${s.area} m²` : ""}</span></div>
    <p><b>${t("Example price")}:</b> ${price || "—"}</p>${s.amenities ? `<p class="hint">${h(s.amenities)}</p>` : ""}${s.note ? `<div class="note">${h(s.note)}</div>` : ""}
    ${hd ? `<p><b>${t("Contracted to")}:</b> ${h(hd.name)} · ${link(hd.contract.number, "contract/" + hd.contract.id)} (${t("until")} ${fmtD(hd.contract.end)})</p>` : ""}
    ${bookable ? `<h4>${t("Next bookings")}</h4>${next.length ? `<ul class="timeline">${next.map(b => `<li><b>${fmtD(b.start)} ${b.start.slice(11)}–${b.end.slice(11)}</b><span>${h(memberName(b.memberId))}</span></li>`).join("")}</ul>` : `<p class="hint">${t("Free for now.")}</p>`}` : ""}
    <div class="form-foot">${bookable && can("bookings") ? btn(t("Book this room"), "space-book", { id: s.id }, "btn-primary") : ""}${!bookable && st === "available" && can("contracts") && s.type !== "virtual_office" ? btn(t("New contract for this space"), "space-contract", { id: s.id }, "btn-primary") : ""}
    ${can("spaces") ? `${s.status !== "maintenance" ? btn(t("Mark under maintenance"), "space-status", { id: s.id, s: "maintenance" }) : btn(t("Back in service"), "space-status", { id: s.id, s: "available" })}${btn(t("Edit"), "space-edit", { id: s.id })}` : ""}</div>`);
}
ACT["space-book"] = el => { closeModal(true); bookingModal({ spaceId: el.dataset.id }); };
ACT["space-contract"] = el => { closeModal(true); go("contract/new?space=" + el.dataset.id); };
ACT["space-status"] = async el => { const s = byId("spaces", el.dataset.id); const note = el.dataset.s === "maintenance" ? await promptBox(t("Mark under maintenance"), t("What is being fixed?"), "") : ""; if (note === null) return; if (await save("spaces", Object.assign({}, s, { status: el.dataset.s, note: note || "" }))) { closeModal(); render(); } };
ACT["space-edit"] = el => spaceForm(el.dataset.id);
ACT["space-new"] = () => spaceForm();
function spaceForm(id) {
  const s = id ? byId("spaces", id) : { type: "private_office", floor: FP_FLOOR || "12", status: "available", x: 40, y: 40, w: 120, h: 90, creditRate: 1 };
  modal(id ? t("Edit space") : t("New space"), `<form data-form="space" data-id="${h(id || "")}" class="grid-form">
    ${fld(t("Code"), inp("code", s.code, "required maxlength=20"), { req: true })}${fld(t("Name"), inp("name", s.name, "required"), { req: true })}
    ${fld(t("Type"), selInp("type", SHARED.SPACE_TYPES.map(x => [x, L(x)]), s.type))}${fld(t("Floor"), inp("floor", s.floor))}
    ${fld(t("Seats"), numInp("capacity", s.capacity))}${fld(t("Area (m²)"), numInp("area", s.area))}
    ${fld(t("Example price / month"), numInp("priceMonth", s.priceMonth))}${fld(t("Example price / day"), numInp("priceDay", s.priceDay))}
    ${fld(t("Example price / hour"), numInp("priceHour", s.priceHour))}${fld(t("Credits per hour"), numInp("creditRate", s.creditRate), { hint: t("For bookable rooms") })}
    ${fld(t("Status"), selInp("status", SHARED.SPACE_STATUS.map(x => [x, L(x)]), s.status))}${fld(t("Amenities"), inp("amenities", s.amenities))}
    <div class="form-foot wide">${id && can("spaces") ? btn(t("Delete"), "space-del", { id }, "btn-danger-ghost") : ""}<button class="btn btn-primary">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.space = async (d, form) => { const id = form.dataset.id, old = id ? byId("spaces", id) : {}; const r = await save("spaces", Object.assign({}, old, d, { id: id || uid("SP") }), { form }); if (r) { closeModal(); render(); } };
ACT["space-del"] = async el => { if (DB.contracts.some(c => (c.spaceIds || []).includes(el.dataset.id)) || DB.bookings.some(b => b.spaceId === el.dataset.id)) return toast(t("This space has contracts or bookings. Mark it under maintenance instead."), "err"); if (await confirmBox(t("Delete this space?"), t("Delete"), true) && await remove("spaces", el.dataset.id)) { closeModal(); render(); } };

PAGES.spaces = () => {
  const rows = DB.spaces.slice().sort((a, b) => SHARED.SPACE_TYPES.indexOf(a.type) - SHARED.SPACE_TYPES.indexOf(b.type) || a.code.localeCompare(b.code, undefined, { numeric: true }));
  const byType = SHARED.SPACE_TYPES.map(ty => { const l = DB.spaces.filter(s => s.type === ty); return `<div class="mini"><b>${l.length}</b><span>${L(ty)}</span></div>`; }).join("");
  return { title: "Spaces & prices", html: pageHead(t("Spaces & prices"), t("Your inventory. Prices shown are example placeholders; set your own."), (can("spaces") ? btn(ic("plus") + t("New space"), "space-new", {}, "btn-primary", "btn-space-new") : "") + btn(t("Export CSV"), "spaces-csv")) +
    `<div class="minis">${byType}</div><div class="card">${filterBox("tbl-spaces")}${table([{ label: "Code", f: s => `<b>${h(s.code)}</b>` }, { label: "Name", k: "name" }, { label: "Type", f: s => L(s.type) }, { label: "Floor", k: "floor" }, { label: "Seats", k: "capacity", cls: "num" },
      { label: "Status", f: s => chip(spaceState(s), "st-" + spaceState(s)) }, { label: "Held by", f: s => { const x = holderOf(s); return x ? h(x.name) : "—"; } }, { label: "Price / month", f: s => s.priceMonth ? money(s.priceMonth) : "—", cls: "num" }, { label: "Price / hour", f: s => s.priceHour ? money(s.priceHour) : "—", cls: "num" }],
      rows, { id: "tbl-spaces", rowAttr: s => `data-act="space" data-id="${s.id}" class="click"` })}</div>` };
};
ACT["spaces-csv"] = () => download(`spaces-${TODAY}.csv`, csv(DB.spaces, [["code", "Code"], ["name", "Name"], [s => L(s.type), "Type"], ["floor", "Floor"], ["capacity", "Seats"], ["area", "Area m2"], [s => spaceState(s), "Status"], ["priceMonth", "Price per month"], ["priceDay", "Price per day"], ["priceHour", "Price per hour"], ["creditRate", "Credits per hour"]]), "text/csv");

PAGES.plans = () => ({ title: "Plans & add-ons", html: pageHead(t("Plans & add-ons"), t("Membership plans set monthly meeting-room credits. Add-ons are billed as charges (printing, coffee, parking…). Prices are example placeholders.")) +
  `<div class="grid-2"><div class="card"><div class="card-head"><h3>${t("Membership plans")}</h3>${can("plans") ? btn(ic("plus") + t("New plan"), "plan-edit", {}, "btn-ghost btn-sm") : ""}</div>
    ${table([{ label: "Plan", k: "name" }, { label: "Type", f: p => L(p.type) }, { label: "Example price", f: p => money(p.price), cls: "num" }, { label: "Room credits / month", k: "credits", cls: "num" }, { label: "Members", f: p => DB.members.filter(m => m.planId === p.id && m.status === "active").length, cls: "num" }], DB.plans, { rowAttr: p => can("plans") ? `data-act="plan-edit" data-id="${p.id}" class="click"` : "" })}</div>
  <div class="card"><div class="card-head"><h3>${t("Add-ons & services")}</h3>${can("products") ? btn(ic("plus") + t("New add-on"), "product-edit", {}, "btn-ghost btn-sm") : ""}</div>
    ${table([{ label: "Name", k: "name" }, { label: "Category", f: p => h(p.category || "") }, { label: "Example price", f: p => money(p.price), cls: "num" }], DB.products, { rowAttr: p => can("products") ? `data-act="product-edit" data-id="${p.id}" class="click"` : "" })}</div></div>
  <div class="card"><h3>${t("How credits work")}</h3><p class="hint">${t("Each plan gives a member a number of credits every calendar month. Each room uses a set number of credits per hour. When a member runs out, the rest of the booking is charged at the room's hourly price and added to the next invoice automatically.")}</p></div>` });
ACT["plan-edit"] = el => { const id = el.dataset.id, p = id ? byId("plans", id) : { type: "hot_desk", credits: 0, price: 0 };
  modal(id ? t("Edit plan") : t("New plan"), `<form data-form="plan" data-id="${h(id || "")}" class="grid-form">${fld(t("Plan name"), inp("name", p.name, "required"), { req: true, wide: true })}${fld(t("Type"), selInp("type", SHARED.SPACE_TYPES.map(x => [x, L(x)]), p.type))}${fld(t("Example price / month"), numInp("price", p.price))}${fld(t("Room credits / month"), numInp("credits", p.credits))}<div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`); };
FORMS.plan = async (d, form) => { const id = form.dataset.id; if (await save("plans", Object.assign({}, id ? byId("plans", id) : {}, d, { id: id || uid("PL") }), { form })) { closeModal(); render(); } };
ACT["product-edit"] = el => { const id = el.dataset.id, p = id ? byId("products", id) : { price: 0 };
  modal(id ? t("Edit add-on") : t("New add-on"), `<form data-form="product" data-id="${h(id || "")}" class="grid-form">${fld(t("Name"), inp("name", p.name, "required"), { req: true, wide: true })}${fld(t("Category"), selInp("category", ["printing", "coffee", "parking", "catering", "mail", "virtual_office", "other"].map(x => [x, L(x)]), p.category))}${fld(t("Example price"), numInp("price", p.price))}<div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`); };
FORMS.product = async (d, form) => { const id = form.dataset.id; if (await save("products", Object.assign({}, id ? byId("products", id) : {}, d, { id: id || uid("PR") }), { form })) { closeModal(); render(); } };
