/* Centre settings (country presets), users, outbox, audit trail, backup. */
PAGES.settings = () => {
  const c = cfg();
  return { title: "Centre settings", html: pageHead(t("Centre settings"), t("Your company details print on every tax invoice. The Immora logo never appears on your documents.")) +
    `<form data-form="settings" class="card grid-form" id="settings-form"><h3 class="wide">${t("Country preset")}</h3>
      ${fld(t("Country"), `<select name="country" data-live="preset">${Object.values(SHARED.COUNTRY_PRESETS).map(p => `<option value="${p.country}" ${p.country === c.country ? "selected" : ""}>${h(t(p.countryName))}</option>`).join("")}</select>`, { hint: t("Sets currency, VAT rate, tax ID label and invoice title. Check the rules with your tax adviser.") })}
      ${fld(t("Currency"), inp("currency", c.currency, "maxlength=3"))}${fld(t("VAT / tax rate %"), numInp("vatRate", c.vatRate))}${fld(t("Tax ID label"), inp("taxLabel", c.taxLabel))}${fld(t("Invoice title"), inp("invoiceTitle", c.invoiceTitle))}${fld(t("Tax ID digits (0 = any)"), numInp("taxIdDigits", c.taxIdDigits))}
      <h3 class="wide">${t("Your company (printed on invoices)")}</h3>
      ${fld(t("Legal name"), inp("legalName", c.legalName, "required"), { req: true, wide: true })}${fld(t("Trading name"), inp("tradeName", c.tradeName))}${fld(c.taxLabel || "TRN", inp("trn", c.trn))}${fld(t("Trade licence no."), inp("licenceNo", c.licenceNo))}
      ${fld(t("Phone"), inp("phone", c.phone))}${fld(t("Email"), inp("email", c.email, 'type="email"'))}${fld(t("Address"), txt("address", c.address), { wide: true })}${fld(t("Bank details"), txt("bank", c.bank), { wide: true })}
      ${fld(t("Payment terms (days)"), numInp("paymentTermsDays", c.paymentTermsDays))}${fld(t("Opening time"), `<select name="openFrom">${timeOpts(c.openFrom || "07:00", 0, 23)}</select>`)}${fld(t("Closing time"), `<select name="openTo">${timeOpts(c.openTo || "22:00", 1, 24)}</select>`)}${fld(t("Invoice footer"), inp("footer", c.footer), { wide: true })}
      ${fld(t("Your logo (optional)"), `<input type="file" accept="image/png,image/jpeg" data-live="img" data-k="logo">`, { hint: c.logo ? t("Logo uploaded") : t("PNG or JPG, shown on your invoices") })}${fld(t("Company stamp (optional)"), `<input type="file" accept="image/png,image/jpeg" data-live="img" data-k="stamp">`, { hint: c.stamp ? t("Stamp uploaded") : "" })}
      <div class="form-foot wide">${c.logo ? btn(t("Remove logo"), "rm-img", { k: "logo" }, "btn-ghost") : ""}<button class="btn btn-primary" id="btn-settings-save">${t("Save settings")}</button></div></form>` };
};
LIVE.preset = el => { const p = SHARED.COUNTRY_PRESETS[el.value], f = $("#settings-form"); for (const k of ["currency", "vatRate", "taxLabel", "invoiceTitle", "taxIdDigits"]) f[k].value = p[k]; toast(t("Preset applied — press Save")); };
LIVE.img = async el => { const f = el.files[0]; if (!f) return; if (f.size > 400000) return toast(t("Image too large (max 400 KB)"), "err"); const url = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(f); }); if (await save("cfg", Object.assign({}, cfg(), { [el.dataset.k]: url }), { msg: t("Image saved") })) render(); };
ACT["rm-img"] = async el => { const c = Object.assign({}, cfg()); delete c[el.dataset.k]; if (await save("cfg", c)) render(); };
FORMS.settings = async (d, form) => { const p = SHARED.COUNTRY_PRESETS[d.country]; const rec = Object.assign({}, cfg(), d, { id: "centre", ejari: p.ejari, tz: p.tz, vatName: p.vatName, countryName: p.countryName }); if (await save("cfg", rec, { form, msg: t("Settings saved") })) render(); };

let USERS = null;
PAGES.users = () => {
  if (!USERS) { Backend.users().then(u => { USERS = u; render(); }).catch(fail); return { title: "Users & logins", html: `<div class="card skeleton">${t("Loading…")}</div>` }; }
  const u = USERS; USERS = null;
  return { title: "Users & logins", html: pageHead(t("Users & logins"), t("Staff roles control what each person can change. Members sign in on the member portal tab."), btn(ic("plus") + t("Add user"), "user-new", {}, "btn-primary", "btn-user-new")) +
    `<div class="card">${table([{ label: "Username", f: x => `<b>${h(x.username)}</b>` }, { label: "Name", k: "name" }, { label: "Role", f: x => L(x.role) }, { label: "Member", f: x => x.memberId ? h(memberName(x.memberId)) : "—" }, { label: "Status", f: x => chip(x.active ? "active" : "paused") }], u, { rowAttr: x => `data-act="user-edit" data-u="${h(JSON.stringify(x))}" class="click"` })}</div>
    <div class="card"><h3>${t("What each role can do")}</h3>${table([{ label: "Role", f: r => L(r) }, { label: "Can change", f: r => h((SHARED.WRITE[r] || []).join(", ") || t("nothing (read-only)")) }], SHARED.ROLES.concat(["member"]))}</div>` };
};
ACT["user-new"] = () => userModal({ role: "frontdesk", isNew: true, active: 1 });
ACT["user-edit"] = el => userModal(JSON.parse(el.dataset.u));
function userModal(u) {
  modal(u.isNew ? t("Add user") : u.username, `<form data-form="user" class="grid-form">${fld(t("Username"), inp("username", u.username, `required ${u.isNew ? "" : "readonly"}`), { req: true })}${fld(t("Name"), inp("name", u.name))}
    ${fld(t("Role"), selInp("role", SHARED.ROLES.concat(["member"]).map(r => [r, L(r)]), u.role))}${fld(t("Member (portal logins)"), `<select name="memberId">${memberOpts(u.memberId, "—")}</select>`)}
    ${fld(u.isNew ? t("Password") : t("New password (leave empty to keep)"), `<input type="password" name="password" autocomplete="new-password" ${u.isNew ? "required" : ""} minlength="8">`, { hint: t("At least 8 characters") })}<label class="fld check"><input type="checkbox" name="active" ${u.active === undefined || u.active ? "checked" : ""}><span>${t("Active")}</span></label>
    <div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.user = async (d, form) => { try { await Backend.saveUser(d); closeModal(); toast(t("User saved")); if (curRoute().name === "users") render(); } catch (e) { fail(e, form); } };

PAGES.outbox = () => ({ title: "Outbox (simulated)", html: pageHead(t("Outbox (simulated)"), t("Reminders, mail notices and other messages are queued here. Nothing is emailed: connecting an email service is a separate step.")) +
  `<div class="card">${table([{ label: "Date", f: o => fmtD(o.date) }, { label: "To", k: "to" }, { label: "Subject", k: "subject" }, { label: "Type", k: "kind" }, { label: "Status", f: o => chip(o.status) }, { label: "", f: o => btn(t("View"), "ob-view", { id: o.id }, "btn-ghost btn-sm") + (o.status === "queued" && can("outbox") ? btn(t("Mark sent (simulated)"), "ob-sent", { id: o.id }, "btn-ghost btn-sm") : "") }], DB.outbox.slice().sort((a, b) => a.date < b.date ? 1 : -1))}</div>` });
ACT["ob-view"] = el => { const o = byId("outbox", el.dataset.id); modal(o.subject, `<p class="hint">${t("To")}: ${h(o.to)} · ${fmtD(o.date)} · ${chip(o.status)}</p><pre class="mail-body">${h(o.body || "")}</pre>`); };
ACT["ob-sent"] = async el => { const o = byId("outbox", el.dataset.id); if (await save("outbox", Object.assign({}, o, { status: "sent_simulated" }))) render(); };

let AUDIT = null;
PAGES.audit = () => {
  if (!AUDIT) { Backend.audit().then(a => { AUDIT = a; render(); }).catch(fail); return { title: "Audit trail", html: `<div class="card skeleton">${t("Loading…")}</div>` }; }
  const a = AUDIT; AUDIT = null;
  return { title: "Audit trail", html: pageHead(t("Audit trail"), t("Every sign-in, change, billing run and export, newest first.")) + `<div class="card">${filterBox("tbl-audit")}${table([{ label: "When", f: x => fmtDT(String(x.ts).replace(" ", "T")) }, { label: "User", k: "username" }, { label: "Action", k: "action" }, { label: "List", k: "coll" }, { label: "Record", k: "summary" }], a, { id: "tbl-audit" })}</div>` };
};
PAGES.backup = () => ({ title: "Backup & restore", html: pageHead(t("Backup & restore"), BUILD_MODE === "offline" ? t("The offline edition keeps data in this browser only. Download a backup regularly.") : t("Download a full copy of your data, or restore one.")) +
  `<div class="grid-2"><div class="card"><h3>${t("Download backup")}</h3><p class="hint">${t("A JSON file with all records (no passwords).")}</p>${btn(ic("download") + t("Download backup"), "backup", {}, "btn-primary", "btn-backup")}</div>
   <div class="card"><h3>${t("Restore")}</h3><p class="hint">${t("Replaces all current data with the backup file.")}</p><input type="file" accept="application/json" data-live="restore" id="restore-file"></div></div>` });
ACT.backup = async () => { try { download(`immora-bcs-backup-${TODAY}.json`, await Backend.backup(), "application/json"); toast(t("Backup downloaded")); } catch (e) { fail(e); } };
LIVE.restore = async el => { const f = el.files[0]; if (!f) return; let obj; try { obj = JSON.parse(await f.text()); } catch (e) { return toast(t("This is not an Immora BCS backup file"), "err"); } if (!(await confirmBox(t("Replace ALL current data with this backup?"), t("Restore"), true))) return; try { await Backend.restore(obj); await refresh(); toast(t("Backup restored")); } catch (e) { fail(e); } };
