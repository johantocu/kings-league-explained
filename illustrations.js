// Code-drawn illustrations for the seven secret cards (no photos, no league artwork).
// Each one is a 160 x 110 SVG with its own gradients; ids are prefixed per card so they never clash.

const W = 160, H = 110;
const ANTON = 'font-family="Anton, Impact, sans-serif"';

// Night sky with soft out-of-focus stadium lights.
const sky = (p, y1, lights = true) => `
  <linearGradient id="${p}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121820"/><stop offset="1" stop-color="#060708"/></linearGradient>
  <rect width="${W}" height="${y1}" fill="url(#${p}-sky)"/>
  ${lights ? `<g filter="url(#${p}-blur)" fill="#fff6dc">
    <circle cx="18" cy="9" r="3.2" opacity=".55"/><circle cx="28" cy="7" r="2.4" opacity=".4"/>
    <circle cx="134" cy="8" r="3.4" opacity=".55"/><circle cx="144" cy="11" r="2.2" opacity=".35"/>
    <circle cx="80" cy="4" r="2" fill="#ffd27a" opacity=".35"/>
  </g>` : ''}`;

// Grass seen in perspective: mowing bands that get taller towards the viewer, plus distance haze.
function grass(p, y0, y1 = H, n = 7) {
  let y = y0, out = '';
  const total = y1 - y0, ratio = 1.32;
  const first = (total * (ratio - 1)) / (Math.pow(ratio, n) - 1);
  for (let i = 0; i < n; i++) {
    const h = first * Math.pow(ratio, i);
    out += `<rect x="0" y="${y.toFixed(2)}" width="${W}" height="${(h + 0.4).toFixed(2)}" fill="${i % 2 ? '#1b4d20' : '#215a26'}"/>`;
    y += h;
  }
  return `${out}
  <linearGradient id="${p}-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05140a" stop-opacity=".75"/><stop offset=".55" stop-color="#05140a" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
  <rect x="0" y="${y0}" width="${W}" height="${total}" fill="url(#${p}-haze)"/>`;
}

const defs = (p, extra = '') => `<defs>
  <filter id="${p}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
  <filter id="${p}-ds" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="1.6" stdDeviation="1.4" flood-color="#000" flood-opacity=".85"/></filter>
  <pattern id="${p}-net" width="3.2" height="3.2" patternUnits="userSpaceOnUse"><path d="M0 0L3.2 3.2M3.2 0L0 3.2" stroke="#fff" stroke-opacity=".42" stroke-width=".42"/></pattern>
  <radialGradient id="${p}-ball" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#e3e3e3"/><stop offset="1" stop-color="#7d7d7d"/></radialGradient>
  <linearGradient id="${p}-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD866"/><stop offset=".5" stop-color="#F4AF23"/><stop offset="1" stop-color="#B87C08"/></linearGradient>
  <linearGradient id="${p}-post" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9d9d9"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#bdbdbd"/></linearGradient>
  ${extra}
</defs>`;

// A football with a few shaded panels.
const f = (n) => Number(n.toFixed(2));
function ball(p, cx, cy, r) {
  const k = (m) => f(r * m);
  return `
  <ellipse cx="${cx}" cy="${f(cy + r * 0.92)}" rx="${k(0.95)}" ry="${k(0.24)}" fill="#000" opacity=".55" filter="url(#${p}-blur)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}-ball)"/>
  <path d="M${cx} ${f(cy - r * 0.32)} l${k(0.3)} ${k(0.22)} l${-k(0.11)} ${k(0.36)} h${-k(0.38)} l${-k(0.11)} ${-k(0.36)} z" fill="#1a1a1a"/>
  <path d="M${f(cx - r * 0.98)} ${f(cy - r * 0.1)} l${k(0.34)} ${k(0.05)} l${k(0.08)} ${k(0.34)} l${-k(0.3)} ${k(0.24)} A${r} ${r} 0 0 1 ${f(cx - r * 0.98)} ${f(cy - r * 0.1)} z" fill="#1a1a1a" opacity=".85"/>
  <path d="M${f(cx + r * 0.98)} ${f(cy - r * 0.1)} l${-k(0.34)} ${k(0.05)} l${-k(0.08)} ${k(0.34)} l${k(0.3)} ${k(0.24)} A${r} ${r} 0 0 0 ${f(cx + r * 0.98)} ${f(cy - r * 0.1)} z" fill="#1a1a1a" opacity=".85"/>
  <path d="M${f(cx - r * 0.34)} ${f(cy - r * 0.94)} l${k(0.1)} ${k(0.32)} h${k(0.48)} l${k(0.1)} ${-k(0.32)} A${r} ${r} 0 0 0 ${f(cx - r * 0.34)} ${f(cy - r * 0.94)} z" fill="#1a1a1a" opacity=".8"/>
  <ellipse cx="${f(cx - r * 0.35)}" cy="${f(cy - r * 0.42)}" rx="${k(0.28)}" ry="${k(0.16)}" fill="#fff" opacity=".55" transform="rotate(-30 ${f(cx - r * 0.35)} ${f(cy - r * 0.42)})"/>`;
}

// Goal seen from the front: front frame, net box behind it, shadow on the grass.
function goal(p, x1, x2, top, ground, depth) {
  const bx1 = x1 + depth, bx2 = x2 - depth, btop = top + depth * 0.7, bground = ground - depth * 0.55;
  const post = 2.4;
  return `
  <polygon points="${x1},${ground} ${x2},${ground} ${bx2 + 6},${bground + 4} ${bx1 - 6},${bground + 4}" fill="#000" opacity=".35"/>
  <rect x="${bx1}" y="${btop}" width="${bx2 - bx1}" height="${bground - btop}" fill="url(#${p}-net)"/>
  <polygon points="${x1},${top} ${x2},${top} ${bx2},${btop} ${bx1},${btop}" fill="url(#${p}-net)"/>
  <polygon points="${x1},${top} ${bx1},${btop} ${bx1},${bground} ${x1},${ground}" fill="url(#${p}-net)"/>
  <polygon points="${x2},${top} ${bx2},${btop} ${bx2},${bground} ${x2},${ground}" fill="url(#${p}-net)"/>
  <path d="M${bx1} ${bground}V${btop}H${bx2}V${bground}" fill="none" stroke="#cfcfcf" stroke-opacity=".55" stroke-width=".9"/>
  <rect x="${x1 - post / 2}" y="${top - post / 2}" width="${post}" height="${ground - top + post / 2}" fill="url(#${p}-post)"/>
  <rect x="${x2 - post / 2}" y="${top - post / 2}" width="${post}" height="${ground - top + post / 2}" fill="url(#${p}-post)"/>
  <rect x="${x1 - post / 2}" y="${top - post / 2}" width="${x2 - x1 + post}" height="${post}" fill="#f2f2f2"/>`;
}

const svg = (p, label, body, extra) =>
  `<svg class="card-art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${defs(p, extra)}${body}</svg>`;

const ART = {
  // Goal x2: a goal under the lights with a big yellow X2.
  x2: (p) => svg(p, 'Goal x2', `
    ${sky(p, 66)}
    ${grass(p, 66)}
    ${goal(p, 30, 130, 22, 70, 10)}
    <text x="80" y="101" text-anchor="middle" ${ANTON} font-size="40" fill="url(#${p}-gold)" stroke="#000" stroke-width="1.2" paint-order="stroke" filter="url(#${p}-ds)" letter-spacing="1">X2</text>`),

  // Suspension: a referee's hand holding up a yellow card.
  suspension: (p) => svg(p, 'Suspension', `
    <radialGradient id="${p}-spot" cx=".5" cy=".25" r=".8"><stop offset="0" stop-color="#2b2f36"/><stop offset=".6" stop-color="#0d0f12"/><stop offset="1" stop-color="#050505"/></radialGradient>
    <rect width="${W}" height="${H}" fill="url(#${p}-spot)"/>
    <linearGradient id="${p}-skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9a37b"/><stop offset=".6" stop-color="#b47a54"/><stop offset="1" stop-color="#7f5136"/></linearGradient>
    <linearGradient id="${p}-sleeve" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2a2a"/><stop offset=".5" stop-color="#121212"/><stop offset="1" stop-color="#050505"/></linearGradient>
    <path d="M100 112 L92 86 Q96 78 108 76 L128 80 L140 112 Z" fill="url(#${p}-sleeve)"/>
    <path d="M93 88 Q99 80 109 78 L111 83 Q101 85 96 92 Z" fill="#f2f2f2" opacity=".9"/>
    <path d="M86 74 Q92 66 104 68 L110 80 Q100 84 94 90 Z" fill="url(#${p}-skin)"/>
    <g transform="rotate(-9 80 38)">
      <rect x="61" y="8" width="38" height="54" rx="2.6" fill="url(#${p}-gold)"/>
      <polygon points="61,8 80,8 61,34" fill="#fff" opacity=".22"/>
      <rect x="61" y="8" width="38" height="54" rx="2.6" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".6"/>
    </g>
    <rect x="66" y="52" width="38" height="25" rx="10" fill="url(#${p}-skin)"/>
    <g fill="#c48b63" stroke="#7a4c31" stroke-width=".6">
      <rect x="68" y="54" width="8.4" height="16" rx="4.2"/><rect x="76.6" y="53" width="8.4" height="17" rx="4.2"/>
      <rect x="85.2" y="53.6" width="8.4" height="16.4" rx="4.2"/><rect x="93.8" y="55" width="8" height="15" rx="4"/>
    </g>
    <path d="M64 60 Q62 50 70 47 Q76 46 78 52 L74 60 Z" fill="#d29a71" stroke="#7a4c31" stroke-width=".6"/>
    <g fill="#fff" opacity=".18"><rect x="69" y="56" width="2" height="8" rx="1"/><rect x="77.6" y="55" width="2" height="8" rx="1"/><rect x="86.2" y="55.6" width="2" height="8" rx="1"/></g>`),

  // Star Player: a jersey sleeve with a yellow star armband.
  star: (p) => svg(p, 'Star Player', `
    ${sky(p, H)}
    <linearGradient id="${p}-cyl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3a"/><stop offset=".35" stop-color="#1f1f1f"/><stop offset=".8" stop-color="#0b0b0b"/><stop offset="1" stop-color="#030303"/></linearGradient>
    <linearGradient id="${p}-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE08A"/><stop offset=".3" stop-color="#F4AF23"/><stop offset=".85" stop-color="#9c6806"/><stop offset="1" stop-color="#6e4904"/></linearGradient>
    <g transform="rotate(-12 80 58)">
      <rect x="-20" y="34" width="200" height="46" fill="url(#${p}-cyl)"/>
      <rect x="-20" y="36" width="200" height="1.2" fill="#fff" opacity=".12"/>
      <rect x="132" y="34" width="5" height="46" fill="#F4AF23" opacity=".9"/>
      <rect x="139" y="34" width="2" height="46" fill="#fff" opacity=".7"/>
      <rect x="58" y="30" width="40" height="54" rx="5" fill="url(#${p}-band)" filter="url(#${p}-ds)"/>
      <path d="M58 35H98M58 79H98" stroke="#6e4904" stroke-width=".8" stroke-dasharray="1.6 1.4"/>
      <path d="m78 42 3.6 7.6 8.3 1.1-6 5.8 1.5 8.2L78 60.8l-7.4 3.9 1.5-8.2-6-5.8 8.3-1.1z" fill="#0b0b0b"/>
      <path d="m78 42 3.6 7.6 8.3 1.1-6 5.8 1.5 8.2L78 60.8l-7.4 3.9 1.5-8.2-6-5.8 8.3-1.1z" fill="none" stroke="#FFE08A" stroke-opacity=".5" stroke-width=".6"/>
    </g>`),

  // Shootout: ball on the centre spot, goal waiting in the distance.
  shootout: (p) => svg(p, 'Shootout', `
    ${sky(p, 44)}
    ${grass(p, 44, H, 8)}
    ${goal(p, 62, 98, 31, 46, 3)}
    <ellipse cx="80" cy="93" rx="64" ry="13" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.1"/>
    <path d="M0 93H160" stroke="#fff" stroke-opacity=".8" stroke-width="1.1"/>
    ${ball(p, 80, 80, 15)}`),

  // Joker: a black playing card with a yellow wildcard symbol (no crown).
  joker: (p) => svg(p, 'Joker', `
    <radialGradient id="${p}-bg" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#2a2414"/><stop offset=".55" stop-color="#0e0e0e"/><stop offset="1" stop-color="#050505"/></radialGradient>
    <linearGradient id="${p}-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a9a9a"/><stop offset=".45" stop-color="#3a3a3a"/><stop offset=".6" stop-color="#d4d4d4"/><stop offset="1" stop-color="#4a4a4a"/></linearGradient>
    <rect width="${W}" height="${H}" fill="url(#${p}-bg)"/>
    <g filter="url(#${p}-ds)">
      <rect x="50" y="22" width="44" height="64" rx="4" fill="#161616" stroke="url(#${p}-metal)" stroke-width="1" transform="rotate(-16 72 54)"/>
      <rect x="66" y="22" width="44" height="64" rx="4" fill="#161616" stroke="url(#${p}-metal)" stroke-width="1" transform="rotate(13 88 54)"/>
      <rect x="57" y="16" width="46" height="70" rx="4" fill="#0a0a0a" stroke="url(#${p}-metal)" stroke-width="1.2"/>
    </g>
    <rect x="60.5" y="19.5" width="39" height="63" rx="2.5" fill="none" stroke="#F4AF23" stroke-opacity=".7" stroke-width=".6"/>
    <path d="M80 34 Q82.5 48.5 96 51 Q82.5 53.5 80 68 Q77.5 53.5 64 51 Q77.5 48.5 80 34Z" fill="url(#${p}-gold)"/>
    <path d="M65 24 q.8 3.6 3.8 4 q-3 .4-3.8 4 q-.8-3.6-3.8-4 q3-.4 3.8-4z M95 70 q.8 3.6 3.8 4 q-3 .4-3.8 4 q-.8-3.6-3.8-4 q3-.4 3.8-4z" fill="#F4AF23" opacity=".85"/>`),

  // Reverse Penalty: reversing arrows over a penalty spot at night.
  reverse: (p) => svg(p, 'Reverse Penalty', `
    ${grass(p, 0, H, 6)}
    <rect width="${W}" height="${H}" fill="#000" opacity=".35"/>
    <path d="M14 0V34H146V0" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.1"/>
    <path d="M52 34A30 18 0 0 0 108 34" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.1"/>
    <ellipse cx="80" cy="74" rx="2.4" ry="1.3" fill="#fff" opacity=".85"/>
    ${ball(p, 80, 66, 8)}
    <g fill="none" stroke-linecap="round">
      <path d="M50 64A31 31 0 0 1 104 44" stroke="#000" stroke-opacity=".6" stroke-width="8"/>
      <path d="M110 70A31 31 0 0 1 56 90" stroke="#000" stroke-opacity=".6" stroke-width="8"/>
      <path d="M50 64A31 31 0 0 1 104 44" stroke="url(#${p}-gold)" stroke-width="5"/>
      <path d="M110 70A31 31 0 0 1 56 90" stroke="url(#${p}-gold)" stroke-width="5"/>
    </g>
    <path d="M100 35 L114 44 L99 52 Z" fill="#F4AF23" stroke="#000" stroke-opacity=".5" stroke-width=".8"/>
    <path d="M60 99 L46 90 L61 82 Z" fill="#F4AF23" stroke="#000" stroke-opacity=".5" stroke-width=".8"/>`),

  // Penalty: the goal seen from the penalty spot.
  penalty: (p) => svg(p, 'Penalty', `
    ${sky(p, 66)}
    ${grass(p, 66)}
    ${goal(p, 16, 144, 16, 68, 9)}
    <path d="M28 68 L22 80 H138 L132 68" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1"/>
    <ellipse cx="80" cy="104" rx="3" ry="1.4" fill="#fff" opacity=".9"/>
    ${ball(p, 80, 97, 7)}`)
};

export const cardArt = (id) => (ART[id] ? ART[id](`ca-${id}`) : '');
