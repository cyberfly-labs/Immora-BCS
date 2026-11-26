/* Helpdesk and maintenance tickets. */
function ticketMini(list) { return list.length ? `<ul class="alerts">${list.slice(0, 6).map(x => `<li class="${x.priority === "high" || x.priority === "urgent" ? "bad" : ""}">${ic("ticket")}<span><a href="#" data-act="tk-open" data-id="${x.id}">${h(x.number)}</a> ${h(x.subject)} · ${chip(x.status)}</span></li>`).join("")}</ul>` : empty(t("No open tickets.")); }
let TK_FILTER = "open";
PAGES.tickets = () => {
  const open = ["open", "in_progress", "waiting"], rows = DB.tickets.filter(x => TK_FILTER === "all" || (TK_FILTER === "open" ? open.includes(x.status) : !open.includes(x.status))).sort((a, b) => (PRI[b.priority] - PRI[a.priority]) || (a.opened < b.opened ? 1 : -1));
  return { title: "Tickets", html: pageHead(t("Tickets"), t("Maintenance, IT, cleaning and billing requests from members and staff."), `<div class="seg">${[["open", "Open"], ["done", "Resolved"], ["all", "All"]].map(([k, l]) => `<button class="${TK_FILTER === k ? "on" : ""}" data-act="tk-filter" data-f="${k}">${t(l)}</button>`).join("")}</div>${can("tickets") ? btn(ic("plus") + t("New ticket"), "tk-new", {}, "btn-primary", "btn-tk-new") : ""}`) +
    `<div class="card">${table([{ label: "No.", f: x => `<b>${h(x.number)}</b>` }, { label: "Subject", k: "subject" }, { label: "Category", f: x => L(x.category === "maintenance" ? "maintenance_c" : x.category) }, { label: "Priority", f: x => chip(x.priority, "p-" + x.priority) }, { label: "From", f: x => x.memberId ? h(memberName(x.memberId)) : t("Staff") }, { label: "Opened", f: x => fmtD(x.opened) }, { label: "Assigned", k: "assignee" }, { label: "Status", f: x => chip(x.status) }], rows, { rowAttr: x => `data-act="tk-open" data-id="${x.id}" class="click"` })}</div>` };
};
const PRI = { low: 0, normal: 1, high: 2, urgent: 3 };
ACT["tk-filter"] = el => { TK_FILTER = el.dataset.f; render(); };
ACT["tk-new"] = () => ticketModal(); ACT["tk-open"] = el => ticketModal(el.dataset.id);
function ticketModal(id) {
  const x = id ? byId("tickets", id) : { status: "open", priority: "normal", category: "maintenance" }, ro = !can("tickets");
  modal(id ? `${x.number} · ${x.subject}` : t("New ticket"), `<form data-form="ticket" data-id="${h(id || "")}" class="grid-form">${fld(t("Subject"), inp("subject", x.subject, `required ${ro ? "disabled" : ""}`), { req: true, wide: true })}
    ${fld(t("Category"), selInp("category", SHARED.TICKET_CATS.map(c => [c, L(c === "maintenance" ? "maintenance_c" : c)]), x.category, undefined, ro ? "disabled" : ""))}${fld(t("Priority"), selInp("priority", SHARED.PRIORITIES.map(c => [c, L(c)]), x.priority, undefined, ro ? "disabled" : ""))}
    ${fld(t("Raised by member"), `<select name="memberId" ${ro ? "disabled" : ""}>${memberOpts(x.memberId, t("— staff —"))}</select>`)}${fld(t("Assigned to"), selInp("assignee", ["frontdesk", "community", "finance", "admin", "Facilities contractor"], x.assignee, "—", ro ? "disabled" : ""))}
    ${fld(t("Status"), selInp("status", SHARED.TICKET_STATUS.map(c => [c, L(c)]), x.status, undefined, ro ? "disabled" : ""))}${fld(t("Location / space"), inp("location", x.location, ro ? "disabled" : ""))}
    ${fld(t("Description"), txt("description", x.description, ro ? "disabled" : ""), { wide: true })}
    ${id ? `<div class="wide"><h4>${t("Updates")}</h4>${(x.comments || []).length ? `<ul class="comments">${x.comments.map(c => `<li><b>${h(c.by)}</b> <small>${fmtD(c.at)}</small><p>${h(c.text)}</p></li>`).join("")}</ul>` : `<p class="hint">${t("No updates yet.")}</p>`}${ro ? "" : fld(t("Add an update"), txt("comment", ""), { wide: true })}</div>` : ""}
    <div class="form-foot wide">${ro ? "" : `<button class="btn btn-primary" id="btn-tk-save">${t("Save")}</button>`}</div></form>`, { wide: true });
}
FORMS.ticket = async (d, form) => { const id = form.dataset.id, old = id ? byId("tickets", id) : {}; const comments = (old.comments || []).slice(); if (d.comment) comments.push({ by: ME.username, at: TODAY, text: d.comment }); delete d.comment;
  if (await save("tickets", Object.assign({}, old, d, { comments, id: id || uid("TK") }), { form })) { closeModal(); render(); } };
