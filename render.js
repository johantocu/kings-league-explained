// Pure render functions: content object in, HTML string out.
// Used in the browser (language switch) and by tools/prerender.mjs (no-JS fallback).
// Visual language: Kings League Explainer DS (design/tokens.css + design/components.css, prefix kx-).

export const LANGS = ['en', 'it', 'es'];

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const fill = (tpl, vars) => String(tpl).replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));

// Two-tone heading: the last word (or an explicit gold phrase) goes in gold.
export function twoTone(title, gold) {
  const t = String(title);
  let head = t, tail = '';
  if (gold && t.endsWith(gold)) { head = t.slice(0, -gold.length); tail = gold; }
  else { const i = t.trimEnd().lastIndexOf(' '); if (i > 0) { head = t.slice(0, i + 1); tail = t.slice(i + 1); } }
  return tail ? `${esc(head)}<em>${esc(tail)}</em>` : esc(t);
}

const sectionHead = (s, id) => `
      <header class="sec-head">
        ${s.kicker ? `<p class="kx-kicker">${esc(s.kicker)}</p>` : ''}
        <h2 class="kx-h2" id="${id}-title">${twoTone(s.title, s.titleGold)}</h2>
        ${s.lead ? `<p class="kx-lead">${esc(s.lead)}</p>` : ''}
      </header>`;

/* ---------- Generic badge for the dice "logo" face (own design, not the league's) ---------- */
export const BADGE = `<svg class="badge" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="24" r="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3"/><text x="24" y="31" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="20" fill="currentColor">7</text></svg>`;

/* ---------- Card icons (own strokes, 64-unit grid, drawn at 34px) ---------- */
const T = 'font-family="Archivo, Arial Black, sans-serif" font-weight="900"';
const ICONS = {
  x2: `<text x="32" y="43" text-anchor="middle" ${T} font-size="28" fill="currentColor">x2</text>`,
  suspension: `<circle cx="32" cy="35" r="19" fill="none" stroke="currentColor" stroke-width="4"/><path d="M32 23v12l8 5M25 9h14" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
  star: `<path d="m32 7 7.5 15.5 17 2.3-12.4 11.9 3 16.8L32 45.3l-15.1 8.2 3-16.8L7.5 24.8l17-2.3Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>`,
  shootout: `<circle cx="16" cy="40" r="9" fill="none" stroke="currentColor" stroke-width="4"/><path d="M30 40h24m-8-8 8 8-8 8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="42" y="22" text-anchor="middle" ${T} font-size="14" fill="currentColor">5s</text>`,
  joker: `<rect x="12" y="8" width="26" height="36" rx="4" fill="none" stroke="currentColor" stroke-width="4"/><rect x="26" y="20" width="26" height="36" rx="4" fill="#1C1C1C" stroke="currentColor" stroke-width="4"/><text x="39" y="45" text-anchor="middle" ${T} font-size="18" fill="currentColor">?</text>`,
  reverse: `<path d="M50 27a19 19 0 0 0-33-9M14 37a19 19 0 0 0 33 9" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="m15 9 1 9 9-1M49 55l-1-9-9 1" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
  penalty: `<path d="M6 44V14h52v30" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M6 24h52M6 34h52M19 14v30M32 14v30M45 14v30" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><circle cx="32" cy="55" r="5" fill="currentColor"/>`
};

/* ---------- Arena pitch (SVG; colours come from CSS classes in styles.css) ---------- */
let uid = 0;
function arena(w, h, spots, alt, cls) {
  const id = `ar${++uid}`;
  const boxW = w * 0.12, boxH = h * 0.44;
  return `<svg class="arena ${cls}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(alt)}">
    <defs><radialGradient id="${id}" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#1A1550"/><stop offset="1" stop-color="#000"/></radialGradient></defs>
    <rect width="${w}" height="${h}" rx="14" fill="url(#${id})"/>
    <g class="arena-lines">
      <rect x="6" y="6" width="${w - 12}" height="${h - 12}" rx="8"/>
      <line x1="${w / 2}" y1="6" x2="${w / 2}" y2="${h - 6}"/>
      <circle cx="${w / 2}" cy="${h / 2}" r="${h * 0.15}"/>
    </g>
    <g class="arena-box">
      <rect x="6" y="${(h - boxH) / 2}" width="${boxW}" height="${boxH}"/>
      <rect x="${w - 6 - boxW}" y="${(h - boxH) / 2}" width="${boxW}" height="${boxH}"/>
    </g>
    <circle class="arena-spot" cx="${w / 2}" cy="${h / 2}" r="3"/>
    <rect class="gk gk-a" x="${14}" y="${h / 2 - 7}" width="14" height="14" rx="3"/>
    <rect class="gk gk-b" x="${w - 28}" y="${h / 2 - 7}" width="14" height="14" rx="3"/>
    ${spots.map(([x, y], i) => `<circle class="pl pl-a" style="--i:${i}" cx="${x}" cy="${y}" r="7.5"/>`).join('')}
    ${spots.map(([x, y], i) => `<circle class="pl pl-b" style="--i:${i}" cx="${w - x}" cy="${y}" r="6.5"/>`).join('')}
  </svg>`;
}

export const heroPitch = (alt) =>
  arena(320, 200, [[62, 46], [62, 100], [62, 154], [110, 72], [110, 128], [142, 100]], alt, 'arena-hero');

const DICE_LAYOUT = { 0: [], 1: [[112, 90]], 2: [[96, 58], [116, 122]], 3: [[82, 90], [116, 48], [116, 132]] };
export const dicePitch = (n, alt) => arena(300, 180, DICE_LAYOUT[n] || [], fill(alt, { n }), 'arena-dice');

/* ---------- Broadcast score bug ---------- */
export function scoreBug({ home, away, mid, min, label }) {
  return `<div class="kx-score" role="img" aria-label="${esc(label)}">
    <span class="kx-score__team">${away ? '<span class="kx-score__crest crest-a"></span>' : ''}${esc(home)}</span>
    <span class="kx-score__goals" data-bump>${esc(mid)}</span>
    ${away ? `<span class="kx-score__team">${esc(away)}<span class="kx-score__crest crest-b"></span></span>` : ''}
    ${min ? `<span class="kx-score__min"><span class="kx-dot"></span>${esc(min)}</span>` : ''}
  </div>`;
}

/* ---------- Dice cube ---------- */
const pips = (n) => {
  const pos = n === 2 ? [[28, 28], [72, 72]] : [[26, 26], [50, 50], [74, 74]];
  return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${pos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="currentColor"/>`).join('')}</svg>`;
};
export const DICE_FACES = ['logo', '2', '3', 'logo', '2', '3']; // front, right, top, back, left, bottom
const FACE_CLASSES = ['f-front', 'f-right', 'f-top', 'f-back', 'f-left', 'f-bottom'];
const faceMarkup = (f) => (f === 'logo' ? BADGE : pips(Number(f)));

/* ---------- Timeline constants ---------- */
const SEG_FR = [5, 12, 3, 3, 13, 5];
const SEG_TONE = ['scale', 'cards', 'double', 'dice', 'cards', 'end'];
export const SEG_BUG = [
  { mid: '1v1 → 7v7', min: '00:00' },
  { mid: '7v7', min: '05:00' },
  { mid: 'x2', min: '17:00' },
  { mid: '1 · 2 · 3', min: '20:00' },
  { mid: '7v7', min: '23:00' },
  { mid: '5v5 → 1v1', min: '36:00' }
];
export const segBug = (c, i) =>
  scoreBug({ home: c.ui.home, away: c.ui.away, ...SEG_BUG[i], label: `${c.timeline.segments[i].range}: ${c.timeline.segments[i].title}` });

/* ---------- Sections ---------- */
function hero(c) {
  const h = c.hero;
  return `
  <section class="hero" aria-labelledby="hero-title">
    <div class="kx-halo" aria-hidden="true"></div>
    <div class="kx-container hero-in">
      <div class="kx-row hero-pills">
        <span class="kx-pill kx-pill--gold">${esc(h.kicker)}</span>
        <span class="kx-pill">${esc(h.readTime)}</span>
      </div>
      <h1 class="kx-h1" id="hero-title">${twoTone(h.title, h.titleGold)}</h1>
      <div class="hero-grid">
        <div>
          <p class="kx-lead">${esc(h.subtitle)}</p>
          <p class="byline"><span class="byline-name">${esc(h.byline)}</span>${h.forLine ? `<span class="byline-sep" aria-hidden="true">·</span><span class="byline-for">${esc(h.forLine)}</span>` : ''}</p>
          <p class="byline byline-sub"><span class="byline-date">${esc(h.updated)}</span></p>
        </div>
        <div class="hero-art">${heroPitch(c.ui.pitchAlt)}</div>
      </div>
    </div>
  </section>
  ${ticker(c)}`;
}

function ticker(c) {
  const items = c.ui.ticker.map((t) => `<span>${esc(t)}</span><span class="kx-ticker__sep">·</span>`).join('');
  return `<div class="kx-ticker" aria-hidden="true"><div class="kx-ticker__track">${items}${items}</div></div>`;
}

function intro(c) {
  return `
  <section class="kx-container intro reveal" aria-label="Intro">
    ${c.intro.paragraphs.map((p, i) => `<p class="kx-body${i === 0 ? ' dropcap' : ''}">${esc(p)}</p>`).join('')}
  </section>`;
}

function numbers(c) {
  const s = c.numbers;
  return `
  <section class="kx-container kx-section reveal" aria-labelledby="numbers-title">
    ${sectionHead(s, 'numbers')}
    <ul class="kx-grid-4 plain" role="list">
      ${s.items.map((it) => `<li class="kx-stat"><span class="kx-stat__num">${esc(it.value)}</span><span class="kx-stat__label">${esc(it.label)}</span></li>`).join('')}
    </ul>
    <p class="fine">${esc(s.note)}</p>
  </section>`;
}

function timeline(c) {
  const s = c.timeline;
  const first = s.segments[0];
  const cols = SEG_FR.map((f) => `minmax(46px,${f}fr)`).join(' ');
  return `
  <section class="kx-container kx-section reveal" aria-labelledby="timeline-title">
    ${sectionHead(s, 'timeline')}
    <div class="tl" data-timeline>
      <p class="hint" aria-hidden="true">${esc(s.hint)}</p>
      <div class="tl-bar" style="grid-template-columns:${cols}">
        ${s.segments
          .map(
            (seg, i) => `<button type="button" class="tl-seg tone-${SEG_TONE[i]}" data-seg="${i}" aria-pressed="${i === 0}" aria-controls="tl-panel">
            <span class="tl-range">${esc(seg.range)}</span><span class="tl-short">${esc(seg.short)}</span></button>`
          )
          .join('')}
      </div>
      <div class="tl-ruler" aria-hidden="true" style="grid-template-columns:${cols}">
        ${["0'", "5'", "17'", "20'", "23'", "36'"].map((m) => `<span>${m}</span>`).join('')}
      </div>
      <div class="tl-panel" id="tl-panel" aria-live="polite">
        <div class="tl-bug">${segBug(c, 0)}</div>
        <h3 class="tl-title">${esc(first.title)}</h3>
        <p class="tl-body">${esc(first.body)}</p>
      </div>
    </div>
  </section>`;
}

function cards(c) {
  const s = c.cards;
  return `
  <section class="kx-container kx-section reveal" aria-labelledby="cards-title">
    ${sectionHead(s, 'cards')}
    <ul class="deck plain" role="list">
      ${s.items
        .map(
          (card, i) => `<li>
        <button type="button" class="kx-card" aria-pressed="false" aria-label="${esc(fill(s.aria, { name: card.name }))}">
          <span class="kx-card__inner">
            <span class="kx-card__face kx-card__front">
              <span class="card-no">${String(i + 1).padStart(2, '0')}/07</span>
              <span class="kx-card__title">${esc(card.name)}</span>
              <span class="kx-card__icon"><svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true" focusable="false">${ICONS[card.id] || ''}</svg></span>
              <span class="kx-card__hint">${esc(s.hint)}</span>
            </span>
            <span class="kx-card__face kx-card__back">
              <strong>${esc(card.name)}</strong>
              <p>${esc(card.body)}</p>
              <span class="card-window">${esc(s.window)}</span>
            </span>
          </span>
        </button>
      </li>`
        )
        .join('')}
    </ul>
  </section>`;
}

function dice(c) {
  const s = c.dice;
  return `
  <section class="kx-container kx-section reveal" aria-labelledby="dice-title">
    ${sectionHead(s, 'dice')}
    <div class="dice-box" data-dice>
      <div class="dice-stage">
        <div class="cube-scene" aria-hidden="true">
          <div class="cube" data-cube>
            ${DICE_FACES.map((f, i) => `<div class="cube-face ${FACE_CLASSES[i]}">${faceMarkup(f)}</div>`).join('')}
          </div>
        </div>
        <button type="button" class="kx-btn kx-btn--primary" data-roll>${esc(s.button)}</button>
        <p class="fine">${esc(s.odds)}</p>
      </div>
      <div class="dice-result" aria-live="polite">
        <p class="kx-kicker">${esc(s.resultLabel)}</p>
        <div data-dice-bug>${scoreBug({ home: c.ui.home, away: c.ui.away, mid: '?', min: '20:00', label: s.prompt })}</div>
        <p class="dice-text" data-dice-text>${esc(s.prompt)}</p>
        <div data-dice-pitch>${dicePitch(0, s.pitchAlt)}</div>
      </div>
    </div>
    <p class="fine">${esc(s.logoNote)}</p>
  </section>`;
}

function compare(c) {
  const s = c.compare;
  return `
  <section class="kx-container kx-section reveal" aria-labelledby="compare-title">
    <div class="kx-paper">
      ${sectionHead(s, 'compare')}
      <p class="hint scroll-hint" aria-hidden="true">${esc(s.scrollHint)} →</p>
      <div class="kx-table-wrap" tabindex="0" role="region" aria-labelledby="compare-title">
        <table class="kx-table">
          <thead><tr>${s.headers.map((h, i) => `<th scope="col"${i === 1 ? ' class="is-focus"' : ''}>${esc(h)}</th>`).join('')}</tr></thead>
          <tbody>
            ${s.rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td class="is-focus">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </section>`;
}

function presidents(c) {
  const s = c.presidents;
  return `
  <section class="kx-container kx-section reveal" aria-labelledby="presidents-title">
    ${sectionHead(s, 'presidents')}
    <div class="pres-groups">
      ${s.groups
        .map(
          (g) => `<div class="pres-group">
        <h3 class="kx-kicker">${esc(g.title)}</h3>
        <ul class="plain" role="list">
          ${g.people
            .map(
              (p) => `<li class="person"><span class="avatar" aria-hidden="true">${esc(p.initials)}</span><span class="person-text"><span class="person-name">${esc(p.name)}</span><span class="person-team">${esc(p.team)}</span></span></li>`
            )
            .join('')}
        </ul>
      </div>`
        )
        .join('')}
    </div>
    <p class="fine">${esc(s.note)}</p>
  </section>`;
}

function expansion(c) {
  const s = c.expansion;
  return `
  <section class="kx-container kx-section reveal" aria-labelledby="expansion-title">
    ${sectionHead(s, 'expansion')}
    <ol class="years plain" role="list">
      ${s.years
        .map(
          (y) => `<li class="year">
        <p class="year-label"><span class="year-dot" aria-hidden="true"></span>${esc(y.year)}</p>
        <ul class="plain" role="list">
          ${y.events.map((e) => `<li class="event${e.highlight ? ' hl' : ''}">${e.date ? `<span class="event-date">${esc(e.date)}</span>` : ''}<span>${esc(e.text)}</span></li>`).join('')}
        </ul>
      </li>`
        )
        .join('')}
    </ol>
  </section>`;
}

function quote(c) {
  const t = c.quote.text;
  const cut = t.indexOf('. ');
  const body = cut > 0 ? `${esc(t.slice(0, cut + 1))} <em>${esc(t.slice(cut + 2))}</em>` : esc(t);
  return `
  <section class="kx-container kx-section reveal" aria-label="Quote">
    <figure class="quote-fig">
      <blockquote class="kx-quote"><p>${body}</p></blockquote>
      <figcaption>${esc(c.quote.author)}</figcaption>
    </figure>
  </section>`;
}

function why(c) {
  const s = c.why;
  return `
  <section class="kx-container kx-section reveal" aria-labelledby="why-title">
    ${sectionHead(s, 'why')}
    <ol class="kx-steps">
      ${s.paragraphs.map((p, i) => `<li><span class="kx-steps__num" aria-hidden="true">0${i + 1}</span><div><h3>${esc(p.heading)}</h3><p>${esc(p.text)}</p></div></li>`).join('')}
    </ol>
  </section>`;
}

export function quizView(c, st) {
  const q = c.quiz;
  const total = q.questions.length;
  const bug = (n) => scoreBug({ home: q.scoreLabel, away: '', mid: `${n}/${total}`, label: `${q.scoreLabel}: ${n}/${total}` });
  if (st.done) {
    const tier = st.score === total ? 3 : st.score >= 3 ? 2 : st.score >= 1 ? 1 : 0;
    return `
      <div class="quiz-result">
        ${bug(st.score)}
        <p class="quiz-score" tabindex="-1" data-focus>${esc(fill(q.resultTitle, { score: st.score, total }))}</p>
        <div class="quiz-dots" aria-hidden="true">${st.answers.map((a) => `<span class="${a ? 'ok' : 'ko'}"></span>`).join('')}</div>
        <p class="kx-body">${esc(q.results[tier])}</p>
        <button type="button" class="kx-btn kx-btn--primary" data-quiz-retry>${esc(q.retry)}</button>
      </div>`;
  }
  const item = q.questions[st.i];
  const answered = st.picked !== null;
  return `
      <div class="quiz-top">
        <p class="kx-kicker">${esc(fill(q.progress, { n: st.i + 1, total }))}</p>
        ${bug(st.score)}
      </div>
      <div class="quiz-progress" aria-hidden="true"><span style="width:${(st.i / total) * 100}%"></span></div>
      <h3 class="quiz-q" tabindex="-1" data-focus>${esc(item.q)}</h3>
      <div class="quiz-options">
        ${item.options
          .map((o, i) => {
            let cls = '';
            if (answered) cls = i === item.answer ? ' is-correct' : i === st.picked ? ' is-wrong' : ' is-dim';
            return `<button type="button" class="kx-quiz__opt${cls}" data-quiz-option="${i}"${answered ? ' aria-disabled="true"' : ''}><span class="opt-key" aria-hidden="true">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`;
          })
          .join('')}
      </div>
      <div class="quiz-feedback" aria-live="polite">${
        answered
          ? `<p class="${st.picked === item.answer ? 'fb-ok' : 'fb-ko'}"><strong>${esc(st.picked === item.answer ? q.correct : q.wrong)}</strong> ${esc(item.explain)}</p>
             <button type="button" class="kx-btn kx-btn--primary" data-quiz-next>${esc(st.i + 1 === total ? q.finish : q.next)}</button>`
          : ''
      }</div>`;
}

export const freshQuiz = () => ({ i: 0, score: 0, picked: null, done: false, answers: [] });

function quiz(c) {
  const s = c.quiz;
  return `
  <section class="kx-container kx-section reveal" aria-labelledby="quiz-title">
    ${sectionHead(s, 'quiz')}
    <div class="kx-quiz" data-quiz>${quizView(c, freshQuiz())}</div>
  </section>`;
}

function watch(c) {
  const s = c.watch;
  return `
  <section class="kx-container kx-section reveal" aria-labelledby="watch-title">
    ${sectionHead(s, 'watch')}
    <ul class="kx-grid-2 plain" role="list">
      ${s.items
        .map(
          (it, i) => `<li class="kx-rule"><div class="kx-rule__head"><span class="kx-rule__num">0${i + 1}</span><h3 class="kx-rule__title">${esc(it.name)}</h3></div><p>${esc(it.text)}</p></li>`
        )
        .join('')}
    </ul>
    <p class="fine">${esc(s.verified)}</p>
  </section>`;
}

function sources(c) {
  const s = c.sources;
  return `
  <section class="kx-container kx-section sources reveal" aria-labelledby="sources-title">
    <header class="sec-head">
      <h2 class="kx-h2 kx-h2--sm" id="sources-title">${twoTone(s.title)}</h2>
      <p class="fine">${esc(s.lead)}</p>
    </header>
    <ol>
      ${s.items.map((it) => `<li><a href="${esc(it.url)}" rel="noopener" target="_blank">${esc(it.label)}</a></li>`).join('')}
    </ol>
  </section>`;
}

export function footer(c) {
  return `<div class="kx-container"><p>${esc(c.footer.text)}</p><p>${esc(c.footer.credit)}</p></div>`;
}

export function renderApp(c) {
  return [hero, intro, numbers, timeline, cards, dice, compare, presidents, expansion, quote, why, quiz, watch, sources]
    .map((fn) => fn(c))
    .join('\n');
}
