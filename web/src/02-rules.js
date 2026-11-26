/* Business rules for the offline edition: a line-by-line port of immora_bcs/rules.py and actions.py.
   tests/test_parity.py runs both on the same data and compares the results. */
const R = (() => {
  const S = SHARED;
  class RuleError extends Error { constructor(msg, field, status) { super(msg); this.field = field || null; this.status = status || 400; } }
  const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/, DATE_RE = /^\d{4}-\d{2}-\d{2}$/, DT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  const r2 = x => { x = Number(x || 0); return Math.sign(x) * Math.round(Math.abs(x) * 100 + 1e-7) / 100 + 0; };
  const pad = n => String(n).padStart(2, "0");
  const dObj = s => { const [y, m, d] = String(s).slice(0, 10).split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const isoD = dt => `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
  const addDays = (s, n) => { const x = dObj(s); x.setUTCDate(x.getUTCDate() + n); return isoD(x); };
  const dim = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate(); // m 1-12
  const addMonths = (s, n) => { const [y0, m0, d0] = String(s).slice(0, 10).split("-").map(Number); let m = m0 - 1 + n; const y = y0 + Math.floor(m / 12); m = ((m % 12) + 12) % 12 + 1; return `${y}-${pad(m)}-${pad(Math.min(d0, dim(y, m)))}`; };
  const monthBounds = s => { const [y, m] = String(s).slice(0, 10).split("-").map(Number); return [`${y}-${pad(m)}-01`, `${y}-${pad(m)}-${pad(dim(y, m))}`]; };
  const daysBetween = (a, b) => Math.round((dObj(b) - dObj(a)) / 86400000);
  const fmtDate = s => s ? `${String(s).slice(8, 10)}-${String(s).slice(5, 7)}-${String(s).slice(0, 4)}` : "";
  const validDate = v => { if (!DATE_RE.test(String(v))) return false; const x = dObj(v); return isoD(x) === String(v); };
  const hoursBetween = (a, b) => (Date.parse(b + ":00Z") - Date.parse(a + ":00Z")) / 3600000;
  const fmtNum = (f) => (Number.isInteger(f) ? String(f) : String(f));
  const fmtG = f => { const x = Number(f); return Number.isInteger(x) ? String(x) : String(x); };

  function num(v, field, minimum = 0, allowNone = false) {
    if ((v === null || v === undefined || v === "") && allowNone) return null;
    const f = typeof v === "number" ? v : (v === null || v === undefined || String(v).trim() === "" ? NaN : Number(v));
    if (!isFinite(f)) throw new RuleError(`${field}: enter a number`, field);
    if (minimum !== null && f < minimum) throw new RuleError(`${field}: must be ${fmtG(minimum)} or more`, field);
    return f;
  }
  function checkDate(v, field, required = true) {
    if (v === null || v === undefined || v === "") { if (required) throw new RuleError(`${field}: date is required`, field); return null; }
    if (!validDate(v)) throw new RuleError(`${field}: use a valid date (DD-MM-YYYY)`, field);
    return v;
  }
  function checkDt(v, field) {
    if (!v || !DT_RE.test(String(v))) throw new RuleError(`${field}: date and time are required`, field);
    const [dd, tt] = v.split("T"); const [h, m] = tt.split(":").map(Number);
    if (!validDate(dd) || h > 23 || m > 59) throw new RuleError(`${field}: use a valid date and time`, field);
    return v;
  }
  function lineTotals(lines, defRate) {
    const out = []; let sub = 0, vat = 0;
    (lines || []).forEach((ln, i) => {
      const desc = String(ln.desc || "").trim();
      if (!desc) throw new RuleError(`Line ${i + 1}: description is required`, "lines");
      const qty = num(ln.qty === undefined ? 1 : ln.qty, `Line ${i + 1} quantity`, 0);
      const price = num(ln.price === undefined ? 0 : ln.price, `Line ${i + 1} price`, null);
      const rate = num(ln.vat === undefined ? defRate : ln.vat, `Line ${i + 1} VAT %`, 0);
      if (rate > 100) throw new RuleError(`Line ${i + 1}: VAT % must be 100 or less`, "lines");
      const net = r2(qty * price), tax = r2(net * rate / 100);
      out.push(Object.assign({}, ln, { desc, qty, price: r2(price), vat: rate, net, tax })); sub += net; vat += tax;
    });
    sub = r2(sub); vat = r2(vat);
    return [out, sub, vat, r2(sub + vat)];
  }
  function prorate(amount, from, to, ps, pe) {
    const a = from > ps ? from : ps, b = to ? (to < pe ? to : pe) : pe;
    const total = daysBetween(ps, pe) + 1, days = daysBetween(a, b) + 1;
    if (days <= 0) return [0, 0, total];
    if (days >= total) return [r2(amount), total, total];
    return [r2(Number(amount) * days / total), days, total];
  }
  function validTrn(trn, cfg) {
    const t = String(trn || "").replace(/[\s-]/g, ""); if (!t) return true;
    const n = Number((cfg || {}).taxIdDigits || 0);
    if (n) return /^\d+$/.test(t) && t.length === n;
    return t.length >= 3 && t.length <= 20;
  }
  const find = (db, c, id) => (db[c] || []).find(r => r.id === id) || null;
  const cfgOf = db => (db.cfg || []).find(r => r.id === "centre") || Object.assign({}, S.COUNTRY_PRESETS.AE);
  const allowance = (m, plans) => { const p = plans.find(x => x.id === m.planId); return Number((p || {}).credits || 0) + Number(m.extraCredits || 0); };
  function creditsUsed(mid, month, bookings, excl) {
    const [ms, me] = monthBounds(month); let t = 0;
    for (const b of bookings) { if (b.memberId !== mid || b.status === "cancelled" || b.id === excl) continue; const d = String(b.start || "").slice(0, 10); if (d >= ms && d <= me) t += Number(b.creditsUsed || 0); }
    return r2(t);
  }
  const creditsLeft = (m, today, bookings, plans, excl) => r2(allowance(m, plans) - creditsUsed(m.id, today, bookings, excl));
  function priceBooking(b, sp, m, bookings, plans) {
    const hrs = r2(hoursBetween(b.start, b.end)), rate = Number(sp.creditRate || 1), need = r2(hrs * rate);
    if (!m) return [0, hrs, r2(hrs * Number(sp.priceHour || 0))];
    const left = Math.max(0, creditsLeft(m, b.start.slice(0, 10), bookings, plans, b.id));
    const use = Math.min(need, left), shortH = rate ? r2((need - use) / rate) : 0;
    return [r2(use), shortH, r2(shortH * Number(sp.priceHour || 0))];
  }
  const req = (rec, f, label) => { const v = rec[f]; if (v === null || v === undefined || (typeof v === "string" && !v.trim())) throw new RuleError(`${label || f} is required`, f); return v; };
  const en = (rec, f, values, def) => { const v = rec[f] || def; if (!values.includes(v)) throw new RuleError(`${f}: choose one of ${values.join(", ")}`, f); rec[f] = v; return v; };
  const setdef = (rec, k, v) => { if (!(k in rec)) rec[k] = v; };

  function nextNumber(coll, db, today) {
    const p = S.PREFIX[coll], y = String(today).slice(0, 4);
    const simple = coll === "tickets" || coll === "visitors";
    const re = simple ? new RegExp(`^${p}-(\\d+)$`) : new RegExp(`^${p}-${y}-(\\d+)$`);
    let top = 0; for (const r of db[coll] || []) { const m = re.exec(String(r.number || "")); if (m) top = Math.max(top, Number(m[1])); }
    return `${simple ? p + "-" : p + "-" + y + "-"}${String(top + 1).padStart(4, "0")}`;
  }
  function numberIt(rec, old, coll, db, today) {
    if (old && old.number) { rec.number = old.number; return; }
    if (rec.number && !old) { if ((db[coll] || []).some(r => r.number === rec.number)) throw new RuleError(`Number ${rec.number} is already used`, "number"); return; }
    rec.number = nextNumber(coll, db, today);
  }
  function party(rec, db) {
    if (rec.companyId) { const c = find(db, "companies", rec.companyId); if (!c) throw new RuleError("Company not found", "companyId"); return c; }
    if (rec.memberId) { const m = find(db, "members", rec.memberId); if (!m) throw new RuleError("Member not found", "memberId"); return m; }
    return null;
  }
  function partySnapshot(rec, db) {
    const c = rec.companyId ? find(db, "companies", rec.companyId) : null;
    if (c) return { name: c.legalName, address: c.address || "", trn: c.trn || "", email: c.email || "" };
    const m = rec.memberId ? find(db, "members", rec.memberId) : null;
    if (m) return { name: m.name, address: m.address || "", trn: m.trn || "", email: m.email || "" };
    return { name: rec.customerName || "", address: "", trn: "", email: "" };
  }
  const supplierSnapshot = cfg => Object.fromEntries(["legalName", "address", "trn", "licenceNo", "phone", "email", "taxLabel", "invoiceTitle", "currency"].map(k => [k, cfg[k] === undefined ? "" : cfg[k]]));
  const balance = (inv, db) => r2(Number(inv.total || 0) - Number(inv.paid || 0) - (db.creditnotes || []).filter(c => c.invoiceId === inv.id).reduce((a, c) => a + Number(c.total || 0), 0));
  function refresh(inv, db) {
    if (inv.status === "void") return inv;
    const bal = balance(inv, db);
    inv.status = bal <= 0.004 ? "paid" : ((Number(inv.paid || 0) > 0 || inv.credited) ? "part_paid" : "issued");
    return inv;
  }
  const isMember = u => u.role === "member";

  const V = {
    spaces(rec, old, db) {
      req(rec, "code", "Code"); req(rec, "name", "Name"); en(rec, "type", S.SPACE_TYPES); en(rec, "status", S.SPACE_STATUS, "available");
      for (const f of ["priceMonth", "priceHour", "priceDay", "creditRate", "capacity", "area"]) if (rec[f] !== undefined && rec[f] !== null && rec[f] !== "") rec[f] = num(rec[f], f, 0);
      rec.code = rec.code.trim().toUpperCase();
      if ((db.spaces || []).some(s => String(s.code || "").toUpperCase() === rec.code && s.id !== rec.id)) throw new RuleError(`Space code ${rec.code} is already used`, "code");
    },
    plans(rec) { req(rec, "name", "Plan name"); rec.price = num(rec.price === undefined ? 0 : rec.price, "price", 0); rec.credits = num(rec.credits === undefined ? 0 : rec.credits, "credits", 0); },
    products(rec) { req(rec, "name", "Name"); rec.price = num(rec.price === undefined ? 0 : rec.price, "price", 0); },
    companies(rec, old, db, u, today, cfg) {
      req(rec, "legalName", "Legal name");
      if (rec.email && !EMAIL_RE.test(rec.email)) throw new RuleError("Email: enter a valid email address", "email");
      if (!validTrn(rec.trn, cfg)) { const n = cfg.taxIdDigits; throw new RuleError(n ? `${cfg.taxLabel || "TRN"}: must be ${n} digits` : "Tax ID looks wrong", "trn"); }
      if (rec.licenceExpiry) checkDate(rec.licenceExpiry, "Licence expiry");
    },
    members(rec, old, db, u, today) {
      req(rec, "name", "Name"); en(rec, "status", ["active", "paused", "ended"], "active");
      if (rec.email && !EMAIL_RE.test(rec.email)) throw new RuleError("Email: enter a valid email address", "email");
      if (rec.companyId && !find(db, "companies", rec.companyId)) throw new RuleError("Company not found", "companyId");
      checkDate(rec.start || today, "Start date"); setdef(rec, "start", today);
      if (rec.end) checkDate(rec.end, "End date");
      const card = String(rec.cardNo || "").trim();
      if (card && (db.members || []).some(m => m.cardNo === card && m.id !== rec.id)) throw new RuleError(`Access card ${card} is already given to another member`, "cardNo");
      rec.extraCredits = num(rec.extraCredits || 0, "extraCredits", null);
    },
    leads(rec, old, db, u, today) {
      req(rec, "name", "Name"); en(rec, "stage", S.LEAD_STAGES, "new");
      if (rec.email && !EMAIL_RE.test(rec.email)) throw new RuleError("Email: enter a valid email address", "email");
      rec.budget = num(rec.budget || 0, "budget", 0); setdef(rec, "created", today);
    },
    tours(rec) { checkDt(rec.when, "Tour date and time"); en(rec, "status", ["booked", "done", "no_show", "cancelled"], "booked"); if (!rec.leadId && !rec.name) throw new RuleError("Choose a lead or enter the visitor's name", "leadId"); },
    quotes(rec, old, db, u, today, cfg) {
      if (!rec.leadId && !rec.companyId && !rec.memberId) throw new RuleError("Choose a lead, company or member", "leadId");
      checkDate(rec.date || today, "Quote date"); setdef(rec, "date", today);
      rec.validUntil = checkDate(rec.validUntil || addDays(rec.date, 14), "Valid until");
      en(rec, "status", ["draft", "sent", "accepted", "declined", "expired"], "draft");
      [rec.lines, rec.subtotal, rec.vatTotal, rec.total] = lineTotals(rec.lines, cfg.vatRate === undefined ? 5 : cfg.vatRate);
      if (!rec.lines.length) throw new RuleError("Add at least one line", "lines");
      numberIt(rec, old, "quotes", db, today);
    },
    contracts(rec, old, db, u, today) {
      if (!rec.companyId && !rec.memberId) throw new RuleError("Choose the client (company or member)", "companyId");
      party(rec, db); checkDate(rec.start, "Start date"); checkDate(rec.end, "End date");
      if (rec.end < rec.start) throw new RuleError("End date must be after the start date", "end");
      en(rec, "status", S.CONTRACT_STATUS, "draft");
      rec.monthlyFee = num(rec.monthlyFee === undefined ? 0 : rec.monthlyFee, "Monthly fee", 0);
      rec.deposit = num(rec.deposit || 0, "Deposit", 0);
      rec.noticeDays = Math.trunc(num(rec.noticeDays === undefined ? 60 : (rec.noticeDays || 0), "Notice period", 0));
      en(rec, "depositStatus", ["not_due", "due", "received", "refunded", "part_refunded"], rec.deposit ? "due" : "not_due");
      rec.spaceIds = (rec.spaceIds || []).filter(Boolean);
      for (const sid of rec.spaceIds) {
        const sp = find(db, "spaces", sid); if (!sp) throw new RuleError("Space not found", "spaceIds");
        if (["active", "notice", "draft"].includes(rec.status) && ["private_office", "dedicated_desk", "parking", "locker"].includes(sp.type))
          for (const c of db.contracts || []) {
            if (c.id === rec.id || !["active", "notice"].includes(c.status)) continue;
            if ((c.spaceIds || []).includes(sid) && c.start <= rec.end && rec.start <= c.end) throw new RuleError(`${sp.code} is already contracted to ${c.number} for those dates`, "spaceIds");
          }
      }
      rec.addons = (rec.addons || []).filter(a => a.name).map(a => Object.assign({}, a, { qty: num(a.qty === undefined ? 1 : a.qty, "Add-on quantity", 0), price: num(a.price === undefined ? 0 : a.price, "Add-on price", 0) }));
      setdef(rec, "termMonths", 12);
      numberIt(rec, old, "contracts", db, today);
    },
    bookings(rec, old, db, u, today, cfg) {
      const sp = find(db, "spaces", rec.spaceId);
      if (!sp) throw new RuleError("Choose a room or space", "spaceId");
      if (!S.BOOKABLE.includes(sp.type)) throw new RuleError(`${sp.name} cannot be booked by the hour`, "spaceId");
      if (sp.status === "maintenance" && rec.status !== "cancelled") throw new RuleError(`${sp.name} is under maintenance`, "spaceId");
      checkDt(rec.start, "Start"); checkDt(rec.end, "End");
      if (rec.end <= rec.start) throw new RuleError("End time must be after the start time", "end");
      if (rec.start.slice(0, 10) !== rec.end.slice(0, 10)) throw new RuleError("A booking must start and end on the same day", "end");
      if (hoursBetween(rec.start, rec.end) > 14) throw new RuleError("A booking can be at most 14 hours", "end");
      en(rec, "status", ["confirmed", "tentative", "cancelled", "checked_in"], "confirmed");
      rec.attendees = Math.trunc(num(rec.attendees || 1, "Attendees", 1));
      if (sp.capacity && rec.attendees > Number(sp.capacity)) throw new RuleError(`${sp.name} seats ${Math.trunc(Number(sp.capacity))}; you entered ${rec.attendees}`, "attendees");
      const m = rec.memberId ? find(db, "members", rec.memberId) : null;
      if (rec.memberId && !m) throw new RuleError("Member not found", "memberId");
      if (isMember(u)) {
        if (rec.memberId !== u.memberId) throw new RuleError("You can only book for yourself", "memberId", 403);
        if (!old && rec.start.slice(0, 10) < today) throw new RuleError("Choose a time in the future", "start");
      }
      if (rec.status !== "cancelled")
        for (const b of db.bookings || [])
          if (b.id !== rec.id && b.spaceId === rec.spaceId && b.status !== "cancelled" && b.start < rec.end && rec.start < b.end)
            throw new RuleError(`${sp.name} is already booked ${b.start.slice(11)}–${b.end.slice(11)}`, "start", 409);
      const extra = [];
      const changed = !old || ["start", "end", "spaceId", "memberId"].some(k => old[k] !== rec[k]) || ((old.status === "cancelled") !== (rec.status === "cancelled"));
      if (changed) {
        if (rec.status === "cancelled") { rec.creditsUsed = 0; rec.overageHours = 0; rec.overageAmount = 0; }
        else [rec.creditsUsed, rec.overageHours, rec.overageAmount] = priceBooking(rec, sp, m, db.bookings || [], db.plans || []);
        const ch = (db.charges || []).find(c => c.bookingId === rec.id) || null;
        if (ch && ch.invoiceId) { if (rec.overageAmount !== ch.amount) throw new RuleError("This booking's charge is already invoiced; issue a credit note instead", "start"); }
        else if (rec.overageAmount > 0 && (m || rec.companyId)) {
          const c2 = Object.assign({}, ch || { id: "CHG-" + rec.id });
          Object.assign(c2, { date: rec.start.slice(0, 10), bookingId: rec.id, memberId: rec.memberId || "", companyId: (m || {}).companyId || rec.companyId || "",
            desc: `${sp.name} booking ${fmtDate(rec.start.slice(0, 10))} ${rec.start.slice(11)}–${rec.end.slice(11)} (${fmtG(rec.overageHours)} h beyond credits)`,
            qty: rec.overageHours, price: r2(Number(sp.priceHour || 0)), amount: rec.overageAmount, vat: cfg.vatRate === undefined ? 5 : cfg.vatRate, invoiceId: "" });
          extra.push(["charges", c2, "put"]);
        } else if (ch) extra.push(["charges", ch, "delete"]);
      }
      return extra;
    },
    invoices(rec, old, db, u, today, cfg) {
      en(rec, "status", S.INVOICE_STATUS, "draft");
      if (old && old.status !== "draft") {
        const free = ["status", "paid", "dunningLevel", "lastReminder", "paymentLink", "voidReason", "voidedOn", "notes", "credited"];
        for (const k of Object.keys(old)) if (!free.includes(k) && stableStr(rec[k]) !== stableStr(old[k])) throw new RuleError("An issued tax invoice cannot be changed. Issue a credit note, or void it with a reason.", k);
        if (rec.status === "draft") throw new RuleError("An issued invoice cannot go back to draft", "status");
        if (rec.status === "void" && old.status !== "void") {
          if (!String(rec.voidReason || "").trim()) throw new RuleError("Give a reason for voiding", "voidReason");
          if (Number(old.paid || 0) > 0) throw new RuleError("This invoice has payments; issue a credit note instead of voiding", "status");
          rec.voidedOn = today;
        }
        return [];
      }
      if (!party(rec, db)) req(rec, "customerName", "Customer");
      checkDate(rec.date || today, "Invoice date"); setdef(rec, "date", today);
      rec.dueDate = checkDate(rec.dueDate || addDays(rec.date, Number(cfg.paymentTermsDays || 14)), "Due date");
      if (rec.dueDate < rec.date) throw new RuleError("Due date must be on or after the invoice date", "dueDate");
      [rec.lines, rec.subtotal, rec.vatTotal, rec.total] = lineTotals(rec.lines, cfg.vatRate === undefined ? 5 : cfg.vatRate);
      rec.paid = r2(rec.paid || 0); setdef(rec, "dunningLevel", 0);
      if (rec.status === "void") throw new RuleError("Delete a draft instead of voiding it", "status");
      if (rec.status !== "draft") {
        if (!rec.lines.length) throw new RuleError("Add at least one line before issuing", "lines");
        if (rec.total <= 0) throw new RuleError("The invoice total must be more than zero", "lines");
        rec.status = "issued"; rec.number = nextNumber("invoices", db, rec.date);
        rec.customer = partySnapshot(rec, db); rec.supplier = supplierSnapshot(cfg); rec.issuedOn = today;
      }
      return [];
    },
    creditnotes(rec, old, db, u, today, cfg) {
      if (old) throw new RuleError("A credit note cannot be changed once issued", "lines");
      const inv = find(db, "invoices", rec.invoiceId);
      if (!inv || ["draft", "void"].includes(inv.status)) throw new RuleError("Choose an issued invoice", "invoiceId");
      req(rec, "reason", "Reason"); checkDate(rec.date || today, "Date"); setdef(rec, "date", today);
      [rec.lines, rec.subtotal, rec.vatTotal, rec.total] = lineTotals(rec.lines, cfg.vatRate === undefined ? 5 : cfg.vatRate);
      if (rec.total <= 0) throw new RuleError("The credit note total must be more than zero", "lines");
      const bal = balance(inv, db);
      if (rec.total > bal + 0.004) throw new RuleError(`The credit note is more than the invoice balance (${bal.toFixed(2)})`, "lines");
      rec.number = nextNumber("creditnotes", db, rec.date);
      rec.companyId = inv.companyId || ""; rec.memberId = inv.memberId || "";
      rec.customer = inv.customer || partySnapshot(inv, db); rec.supplier = supplierSnapshot(cfg); rec.invoiceNumber = inv.number;
      const inv2 = Object.assign({}, inv, { credited: r2(Number(inv.credited || 0) + rec.total) });
      const db2 = Object.assign({}, db, { creditnotes: (db.creditnotes || []).concat([rec]) });
      return [["invoices", refresh(inv2, db2), "put"]];
    },
    receipts(rec, old, db, u, today) {
      if (old) throw new RuleError("A receipt cannot be changed; record a refund or credit note instead", "amount");
      const inv = find(db, "invoices", rec.invoiceId);
      if (!inv || ["draft", "void"].includes(inv.status)) throw new RuleError("Choose an issued invoice", "invoiceId");
      rec.amount = r2(num(rec.amount, "Amount", 0.01));
      en(rec, "method", S.PAY_METHODS, "bank_transfer"); checkDate(rec.date || today, "Date"); setdef(rec, "date", today);
      const bal = balance(inv, db);
      if (rec.amount > bal + 0.004) throw new RuleError(`The amount is more than the balance due (${bal.toFixed(2)})`, "amount");
      rec.number = nextNumber("receipts", db, rec.date);
      rec.companyId = inv.companyId || ""; rec.memberId = inv.memberId || ""; rec.invoiceNumber = inv.number; rec.customerName = (inv.customer || {}).name || "";
      const inv2 = Object.assign({}, inv, { paid: r2(Number(inv.paid || 0) + rec.amount) });
      return [["invoices", refresh(inv2, db), "put"]];
    },
    charges(rec, old, db, u, today, cfg) {
      req(rec, "desc", "Description");
      if (!rec.companyId && !rec.memberId) throw new RuleError("Choose who to charge", "memberId");
      party(rec, db);
      if (old && old.invoiceId) throw new RuleError("This charge is already invoiced", "desc");
      rec.qty = num(rec.qty === undefined ? 1 : rec.qty, "Quantity", 0); rec.price = num(rec.price === undefined ? 0 : rec.price, "Price", 0);
      rec.amount = r2(rec.qty * rec.price); rec.vat = num(rec.vat === undefined ? (cfg.vatRate === undefined ? 5 : cfg.vatRate) : rec.vat, "VAT %", 0);
      rec.date = checkDate(rec.date || today, "Date"); setdef(rec, "invoiceId", "");
    },
    visitors(rec, old, db, u, today) {
      req(rec, "name", "Visitor name"); checkDate(rec.date || today, "Visit date"); setdef(rec, "date", today);
      en(rec, "status", ["expected", "checked_in", "checked_out", "cancelled"], "expected");
      if (isMember(u)) {
        if (rec.hostId !== u.memberId) throw new RuleError("You can only invite guests for yourself", "hostId", 403);
        if (old && old.status !== rec.status && rec.status !== "cancelled") throw new RuleError("Reception checks guests in", "status", 403);
      }
      if (rec.hostId && !find(db, "members", rec.hostId)) throw new RuleError("Host member not found", "hostId");
      numberIt(rec, old, "visitors", db, today);
      if (rec.status === "checked_in" && !rec.inAt) rec.inAt = rec.nowTime || "09:00";
      delete rec.nowTime;
    },
    checkins(rec, old, db, u, today) { if (!find(db, "members", rec.memberId)) throw new RuleError("Member not found", "memberId"); rec.date = checkDate(rec.date || today, "Date"); },
    mail(rec, old, db, u, today) {
      if (!rec.companyId && !rec.memberId) throw new RuleError("Choose who the mail is for", "companyId");
      party(rec, db); en(rec, "type", S.MAIL_TYPES, "letter"); en(rec, "status", S.MAIL_STATUS, "received");
      rec.received = checkDate(rec.received || today, "Received date"); req(rec, "sender", "Sender");
    },
    calls(rec, old, db, u, today) {
      if (!rec.companyId && !rec.memberId) throw new RuleError("Choose who the call was for", "companyId");
      party(rec, db); req(rec, "caller", "Caller name"); req(rec, "message", "Message"); en(rec, "status", ["new", "passed_on", "closed"], "new");
      setdef(rec, "when", today + "T09:00");
    },
    tickets(rec, old, db, u, today) {
      req(rec, "subject", "Subject"); en(rec, "category", S.TICKET_CATS, "maintenance"); en(rec, "priority", S.PRIORITIES, "normal"); en(rec, "status", S.TICKET_STATUS, "open");
      setdef(rec, "opened", today);
      if (isMember(u)) {
        if (rec.memberId !== u.memberId) throw new RuleError("You can only raise tickets for yourself", "memberId", 403);
        if (old) for (const k of new Set(Object.keys(old).concat(Object.keys(rec))))
          if (k !== "comments" && stableStr(old[k]) !== stableStr(rec[k]) && !(k === "status" && rec.status === "closed")) throw new RuleError("Only the centre team can change this ticket", k, 403);
      }
      if (["resolved", "closed"].includes(rec.status) && !rec.closedOn) rec.closedOn = today;
      numberIt(rec, old, "tickets", db, today);
    },
    access(rec) { req(rec, "cardNo", "Card number"); req(rec, "door", "Door"); en(rec, "result", ["granted", "denied"], "granted"); },
    outbox(rec) { req(rec, "to", "Recipient"); req(rec, "subject", "Subject"); en(rec, "status", ["queued", "sent_simulated", "cancelled"], "queued"); },
    addressuse(rec, old, db, u, today) {
      if (!find(db, "companies", rec.companyId)) throw new RuleError("Choose the company", "companyId");
      req(rec, "licenceNo", "Trade licence number"); checkDate(rec.from || today, "From"); setdef(rec, "from", today);
      if (rec.to) checkDate(rec.to, "To"); en(rec, "status", ["active", "ended"], "active");
    },
    cfg(rec) {
      if (rec.id === "centre") {
        req(rec, "legalName", "Centre legal name");
        if (!S.COUNTRY_PRESETS[rec.country]) throw new RuleError("Choose a country preset", "country");
        rec.vatRate = num(rec.vatRate === undefined ? 5 : rec.vatRate, "VAT rate", 0);
        if (!validTrn(rec.trn, rec)) throw new RuleError(`${rec.taxLabel || "TRN"}: must be ${rec.taxIdDigits} digits`, "trn");
        rec.paymentTermsDays = Math.trunc(num(rec.paymentTermsDays === undefined ? 14 : rec.paymentTermsDays, "Payment terms", 0));
      }
    },
  };
  function validate(coll, rec, old, db, user, today) { const f = V[coll]; return f ? (f(rec, old, db, user, today, cfgOf(db)) || []) : []; }
  const DEL = {
    invoices: r => r.status === "draft" || "Issued invoices cannot be deleted. Void it with a reason or issue a credit note.",
    creditnotes: () => "Credit notes cannot be deleted", receipts: () => "Receipts cannot be deleted",
    charges: r => !r.invoiceId || "This charge is already invoiced",
    contracts: r => ["draft", "cancelled"].includes(r.status) || "Only draft or cancelled contracts can be deleted. End it instead.",
    cfg: () => "Settings cannot be deleted",
  };
  const canDelete = (coll, rec) => { const f = DEL[coll]; if (!f) return true; const r = f(rec); return typeof r === "string" ? r : true; };

  const partyKey = x => x.companyId ? "c:" + x.companyId : "m:" + (x.memberId || "");
  function billingRun(db, period, today, cfg) {
    const [ps, pe] = monthBounds(period), rate = cfg.vatRate === undefined ? 5 : cfg.vatRate, terms = Number(cfg.paymentTermsDays || 14);
    const invs = {}, skipped = [];
    const billed = new Set((db.invoices || []).filter(i => i.status !== "void").map(i => i.contractId + "|" + i.periodStart));
    const spaces = Object.fromEntries((db.spaces || []).map(s => [s.id, s]));
    const invFor = p => { const k = partyKey(p); if (!invs[k]) invs[k] = { id: "", status: "draft", companyId: p.companyId || "", memberId: p.companyId ? "" : (p.memberId || ""), date: ps > today ? ps : today, dueDate: addDays(ps > today ? ps : today, terms), periodStart: ps, periodEnd: pe, lines: [], source: "billing_run", contractId: "", contractIds: [] }; return invs[k]; };
    const sorted = (db.contracts || []).slice().sort((a, b) => cmp(a.number || "", b.number || ""));
    for (const c of sorted) {
      if (!["active", "notice"].includes(c.status) || c.start > pe || c.end < ps) continue;
      if (billed.has(c.id + "|" + ps) || (db.invoices || []).some(i => (i.contractIds || []).includes(c.id) && i.periodStart === ps && i.status !== "void")) { skipped.push(c.number); continue; }
      const inv = invFor(c); inv.contractIds.push(c.id); if (!inv.contractId) inv.contractId = c.id;
      const codes = (c.spaceIds || []).filter(s => spaces[s]).map(s => spaces[s].code || "").join(", ");
      const [amt, days, total] = prorate(c.monthlyFee, c.start, c.end, ps, pe);
      const span = `${fmtDate(c.start > ps ? c.start : ps)} to ${fmtDate(c.end < pe ? c.end : pe)}`, note = days < total ? ` (prorated ${days}/${total} days)` : "";
      if (amt > 0) inv.lines.push({ desc: `${c.title || "Membership"}${codes ? " – " + codes : ""} · ${span}${note}`, qty: 1, price: amt, vat: c.vatExempt ? 0 : rate, kind: "fee", contractId: c.id });
      for (const a of c.addons || []) { const [aa] = prorate(r2(Number(a.qty) * Number(a.price)), c.start, c.end, ps, pe); if (aa > 0) inv.lines.push({ desc: `${a.name} · ${span}${note}`, qty: 1, price: aa, vat: rate, kind: "addon", contractId: c.id }); }
    }
    const chUpd = [];
    const chs = (db.charges || []).slice().sort((a, b) => cmp(a.date || "", b.date || "") || cmp(a.id, b.id));
    for (const ch of chs) {
      if (ch.invoiceId || (ch.date || "") > pe) continue;
      invFor(ch).lines.push({ desc: `${ch.desc} (${fmtDate(ch.date)})`, qty: ch.qty === undefined ? 1 : ch.qty, price: ch.price || 0, vat: ch.vat === undefined ? rate : ch.vat, kind: "charge", chargeId: ch.id });
      chUpd.push(ch);
    }
    const out = [];
    for (const k of Object.keys(invs).sort(cmp)) { const inv = invs[k]; if (!inv.lines.length) continue; [inv.lines, inv.subtotal, inv.vatTotal, inv.total] = lineTotals(inv.lines, rate); out.push(inv); }
    return [out, chUpd, skipped];
  }
  const dunningLevel = over => { let l = 0; S.DUNNING_DAYS.forEach((t, i) => { if (over >= t) l = i + 1; }); return l; };
  function dunningRun(db, today) {
    const out = [];
    for (const inv of (db.invoices || []).slice().sort((a, b) => cmp(a.number || "", b.number || ""))) {
      if (!["issued", "part_paid"].includes(inv.status)) continue;
      const bal = balance(inv, db); if (bal <= 0) continue;
      const over = daysBetween(inv.dueDate, today), lvl = dunningLevel(over);
      if (lvl > Number(inv.dunningLevel || 0)) out.push([inv, lvl, over, bal]);
    }
    return out;
  }
  function noticeDue(c, today) { const nd = addDays(c.end, -Number(c.noticeDays || 0)); return [nd, ["active", "notice"].includes(c.status) && today >= addDays(nd, -S.NOTICE_WINDOW_DAYS) && c.end >= today]; }
  function renewalOf(c, today, uplift) {
    const start = addDays(c.end, 1), months = Number(c.termMonths || 12), end = addDays(addMonths(start, months), -1);
    const fee = r2(Number(c.monthlyFee) * (1 + Number(uplift || 0) / 100));
    const keep = {}; for (const [k, v] of Object.entries(c)) if (!["id", "number", "status", "start", "end", "monthlyFee", "noticeReminded", "renewedTo", "_v", "renewals", "depositStatus"].includes(k)) keep[k] = v;
    return Object.assign(keep, { start, end, monthlyFee: fee, status: "active", renewedFrom: c.id, depositStatus: c.depositStatus || "not_due" });
  }
  const cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0;
  return { RuleError, r2, addDays, addMonths, monthBounds, daysBetween, fmtDate, validDate, hoursBetween, num, checkDate, lineTotals, prorate, validTrn,
    cfgOf, allowance, creditsUsed, creditsLeft, priceBooking, nextNumber, partySnapshot, balance, validate, canDelete, billingRun, dunningRun, dunningLevel,
    noticeDue, renewalOf, find, fmtG };
})();
