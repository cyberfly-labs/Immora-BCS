/* Tiny SVG charts (no libraries). */
function barChart(data, o) {
  o = o || {}; const W = o.w || 560, H = o.h || 220, pl = 54, pb = 34, pt = 14, max = Math.max(1, ...data.map(d => d.value)) * 1.1;
  const bw = (W - pl - 10) / Math.max(1, data.length), y = v => pt + (H - pt - pb) * (1 - v / max);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => max / 1.1 * f);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${h(o.label || "")}">
    ${ticks.map(v => `<line x1="${pl}" x2="${W - 6}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${pl - 6}" y="${y(v) + 4}" class="ax" text-anchor="end">${o.fmt ? o.fmt(v) : Math.round(v)}</text>`).join("")}
    ${data.map((d, i) => `<g><rect x="${pl + i * bw + bw * 0.18}" y="${y(d.value)}" width="${bw * 0.64}" height="${Math.max(0, H - pb - y(d.value))}" rx="5" class="bar ${d.cls || ""}"><title>${h(d.label)}: ${h(o.fmt ? o.fmt(d.value) : d.value)}</title></rect>
      <text x="${pl + i * bw + bw / 2}" y="${H - pb + 16}" class="ax" text-anchor="middle">${h(d.label)}</text></g>`).join("")}</svg>`;
}
function stackChart(data, keys, o) {
  o = o || {}; const W = o.w || 560, H = o.h || 220, pl = 54, pb = 34, pt = 14, max = Math.max(1, ...data.map(d => keys.reduce((a, k) => a + Math.max(0, d[k[0]] || 0), 0))) * 1.1;
  const bw = (W - pl - 10) / Math.max(1, data.length), sc = v => (H - pt - pb) * v / max;
  const ticks = [0, 0.5, 1].map(f => max / 1.1 * f);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${h(o.label || "")}">${ticks.map(v => `<line x1="${pl}" x2="${W - 6}" y1="${H - pb - sc(v)}" y2="${H - pb - sc(v)}" class="grid"/><text x="${pl - 6}" y="${H - pb - sc(v) + 4}" class="ax" text-anchor="end">${o.fmt ? o.fmt(v) : Math.round(v)}</text>`).join("")}
    ${data.map((d, i) => { let acc = 0; return keys.map(([k, , cls]) => { const v = Math.max(0, d[k] || 0), y0 = H - pb - sc(acc + v); acc += v; return `<rect x="${pl + i * bw + bw * 0.18}" y="${y0}" width="${bw * 0.64}" height="${sc(v)}" class="bar ${cls}"><title>${h(d.label)}: ${h(o.fmt ? o.fmt(v) : v)}</title></rect>`; }).join("") + `<text x="${pl + i * bw + bw / 2}" y="${H - pb + 16}" class="ax" text-anchor="middle">${h(d.label)}</text>`; }).join("")}</svg>
    <div class="legend">${keys.map(([, l, cls]) => `<span><i class="sw ${cls}"></i>${h(l)}</span>`).join("")}</div>`;
}
function donut(parts, o) {
  o = o || {}; const total = parts.reduce((a, p) => a + p.value, 0) || 1, R0 = 52, C = 2 * Math.PI * R0; let off = 0;
  return `<div class="donut-wrap"><svg class="donut" viewBox="0 0 140 140" role="img" aria-label="${h(o.label || "")}"><circle cx="70" cy="70" r="${R0}" class="donut-bg"/>
    ${parts.map(p => { const len = C * p.value / total, s = `<circle cx="70" cy="70" r="${R0}" class="dseg ${p.cls}" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}"><title>${h(p.label)}: ${p.value}</title></circle>`; off += len; return s; }).join("")}
    <text x="70" y="68" text-anchor="middle" class="donut-v">${h(o.center || "")}</text><text x="70" y="86" text-anchor="middle" class="donut-l">${h(o.sub || "")}</text></svg>
    <div class="legend col">${parts.map(p => `<span><i class="sw ${p.cls}"></i>${h(p.label)} <b>${h(o.fmt ? o.fmt(p.value) : p.value)}</b></span>`).join("")}</div></div>`;
}
function spark(vals, cls) {
  if (!vals.length) return ""; const W = 90, H = 30, max = Math.max(...vals, 1), min = Math.min(...vals, 0);
  const pts = vals.map((v, i) => `${(i / Math.max(1, vals.length - 1)) * W},${H - 3 - (H - 6) * (v - min) / Math.max(1e-9, max - min)}`).join(" ");
  return `<svg class="spark ${cls || ""}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline points="${pts}"/></svg>`;
}
const meter = (p, cls) => `<div class="meter ${cls || ""}"><i style="width:${Math.max(0, Math.min(100, p))}%"></i></div>`;
