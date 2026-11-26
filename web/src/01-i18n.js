/* Languages: English is built in; packs in web/locales/*.json map English text -> translation.
   Arabic and Urdu switch the whole layout to right-to-left. */
const LANGS = [["en", "English"], ["ar", "العربية"], ["fr", "Français"], ["hi", "हिन्दी"], ["ur", "اردو"]];
const RTL = new Set(["ar", "ur"]);
let LANG = "en";
function t(s, vars) {
  let out = (LANG !== "en" && LOCALE_PACKS[LANG] && LOCALE_PACKS[LANG][s]) || s;
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.split("{" + k + "}").join(v);
  return out;
}
function setLang(l, persist) {
  LANG = LOCALE_PACKS[l] || l === "en" ? l : "en";
  document.documentElement.lang = LANG; document.documentElement.dir = RTL.has(LANG) ? "rtl" : "ltr";
  try { localStorage.setItem("immora-bcs-lang", LANG); } catch (e) { /* private mode */ }
  if (persist && ME) Backend.setLang(LANG);
}
/* status / type labels go through t() too */
const LABELS = {
  hot_desk: "Hot desk", dedicated_desk: "Dedicated desk", private_office: "Private office", meeting_room: "Meeting room", event_space: "Event space",
  virtual_office: "Virtual office", parking: "Parking", locker: "Locker", available: "Available", occupied: "Occupied", reserved: "Reserved", maintenance: "Maintenance",
  new: "New", contacted: "Contacted", tour: "Tour", proposal: "Proposal", negotiation: "Negotiation", won: "Won", lost: "Lost",
  draft: "Draft", active: "Active", notice: "Notice", ended: "Ended", renewed: "Renewed", cancelled: "Cancelled", issued: "Issued", part_paid: "Part paid",
  paid: "Paid", void: "Void", open: "Open", in_progress: "In progress", waiting: "Waiting", resolved: "Resolved", closed: "Closed", maintenance_c: "Maintenance",
  it: "IT", cleaning: "Cleaning", access: "Access", billing: "Billing", other: "Other", low: "Low", normal: "Normal", high: "High", urgent: "Urgent",
  received: "Received", notified: "Notified", collected: "Collected", forwarded: "Forwarded", scanned: "Scanned", letter: "Letter", parcel: "Parcel",
  registered: "Registered", courier: "Courier", bank_transfer: "Bank transfer", card: "Card", cash: "Cash", cheque: "Cheque", payment_link: "Payment link",
  confirmed: "Confirmed", tentative: "Tentative", checked_in: "Checked in", checked_out: "Checked out", expected: "Expected", booked: "Booked", done: "Done",
  no_show: "No-show", granted: "Granted", denied: "Denied", queued: "Queued", sent_simulated: "Sent (simulated)", passed_on: "Passed on", sent: "Sent",
  accepted: "Accepted", declined: "Declined", expired: "Expired", paused: "Paused", not_due: "Not due", due: "Due", refunded: "Refunded", part_refunded: "Part refunded",
  admin: "Administrator", frontdesk: "Front desk", community: "Community manager", finance: "Finance", viewer: "Viewer", member: "Member",
};
const L = k => t(LABELS[k] || String(k || "").replace(/_/g, " "));
