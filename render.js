// Pure render functions: content object in, HTML string out.
// Used in the browser (language switch) and by tools/prerender.mjs (no-JS fallback).
// Visual language: Kings League Explainer DS (design/tokens.css + design/components.css, prefix kx-).

import { cardArt } from './illustrations.js';

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

/* ---------- Stadium (CSS 3D). One component for every pitch on the page. ----------
   Players live inside the grass plane, so they follow the perspective automatically.
   Coordinates are percentages of the pitch: x from the left goal line, y from the far touchline. */
const LINES = `<svg class="st-lines" viewBox="0 0 189.2 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <g fill="none" stroke="#fff" stroke-width=".75" stroke-opacity=".92">
    <rect x="1.6" y="1.6" width="186" height="96.8"/>
    <line x1="94.6" y1="1.6" x2="94.6" y2="98.4"/>
    <circle cx="94.6" cy="50" r="13.5"/>
    <path d="M1.6 25H12A25 25 0 0 1 12 75H1.6"/>
    <path d="M187.6 25H177.2A25 25 0 0 0 177.2 75H187.6"/>
    <path d="M1.6 5.6A4 4 0 0 0 5.6 1.6M183.6 1.6A4 4 0 0 0 187.6 5.6M1.6 94.4A4 4 0 0 1 5.6 98.4M183.6 98.4A4 4 0 0 1 187.6 94.4"/>
  </g>
  <g fill="#fff" fill-opacity=".92"><circle cx="94.6" cy="50" r=".9"/><circle cx="30" cy="50" r=".8"/><circle cx="159.2" cy="50" r=".8"/></g>
</svg>`;

const chip = (team, x, y, i, gk = false) =>
  `<span class="st-pl st-pl--${team}${gk ? ' st-pl--gk' : ''}" style="left:${x}%;top:${y}%;--i:${i}"><i class="pl-sh"></i><i class="pl-l1"></i><i class="pl-l2"></i><i class="pl-l3"></i><i class="pl-top"></i></span>`;

const goal3d = (side) => `<span class="st-goal st-goal--${side}"><i class="g-back"></i><i class="g-top"></i><i class="g-side g-side--a"></i><i class="g-side g-side--b"></i><i class="g-frame"></i></span>`;

const panel = (n) => Array.from({ length: n }, (_, i) => `<i class="ad${i % 3 === 1 ? ' ad--stripe' : ''}"></i>`).join('');

export function stadium(spots, alt, cls = '', screen = '7v7') {
  const home = spots.map(([x, y], i) => chip('a', x, y, i)).join('');
  const away = spots.map(([x, y], i) => chip('b', 100 - x, y, i)).join('');
  return `<div class="stadium ${cls}" role="img" aria-label="${esc(alt)}">
    <div class="st-scene" aria-hidden="true">
      <div class="st-floor">
        <i class="st-stands"></i>
        <span class="st-light st-light--l"><i class="st-pole"></i><i class="st-head"></i></span>
        <span class="st-light st-light--r"><i class="st-pole"></i><i class="st-head"></i></span>
        <span class="st-wall st-wall--far">${panel(8)}</span>
        <span class="st-screen"><b data-screen>${esc(screen)}</b></span>
        <span class="st-wall st-wall--left">${panel(4)}</span>
        <span class="st-wall st-wall--right">${panel(4)}</span>
        <span class="st-pitch">${LINES}${chip('a', 3.4, 50, 0, true)}${chip('b', 96.6, 50, 0, true)}${home}${away}</span>
        ${goal3d('l')}${goal3d('r')}
        <span class="st-wall st-wall--near">${panel(8)}</span>
      </div>
    </div>
  </div>`;
}

const HERO_SPOTS = [[13, 20], [13, 50], [13, 80], [27, 33], [27, 67], [40, 50]];
export const heroPitch = (alt) => stadium(HERO_SPOTS, alt, 'stadium--hero', '7v7');

const DICE_LAYOUT = { 0: [], 1: [[34, 50]], 2: [[27, 30], [36, 70]], 3: [[23, 50], [35, 24], [35, 76]] };
export const dicePitch = (n, alt, screen = '?') => stadium(DICE_LAYOUT[n] || [], fill(alt, { n }), 'stadium--dice', screen);

/* ---------- Broadcast score bug ---------- */
export function scoreBug({ home, away, mid, min, label }) {
  return `<div class="kx-score" role="img" aria-label="${esc(label)}">
    <span class="kx-score__team">${away ? '<span class="kx-score__crest crest-a"></span>' : ''}${esc(home)}</span>
    <span class="kx-score__goals" data-bump>${esc(mid)}</span>
    ${away ? `<span class="kx-score__team">${esc(away)}<span class="kx-score__crest crest-b"></span></span>` : ''}
    ${min ? `<span class="kx-score__min"><span class="kx-dot"></span>${esc(min)}</span>` : ''}
  </div>`;
}

/* ---------- Dice cube (physical die: rounded faces, recessed pips, solid core) ---------- */
const PIPS = { 2: [1, 9], 3: [1, 5, 9] }; // cells of a 3 x 3 grid
const pips = (n) => `<span class="pips">${Array.from({ length: 9 }, (_, k) => `<i class="${PIPS[n].includes(k + 1) ? 'pip' : ''}"></i>`).join('')}</span>`;
export const DICE_FACES = ['logo', '2', '3', 'logo', '2', '3']; // front, right, top, back, left, bottom
const FACE_CLASSES = ['f-front', 'f-right', 'f-top', 'f-back', 'f-left', 'f-bottom'];
const faceMarkup = (f) => (f === 'logo' ? `<span class="die-logo">${BADGE}</span>` : pips(Number(f)));

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
              <span class="cf">
                <span class="cf-top"><span class="card-no">${String(i + 1).padStart(2, '0')}<em>/07</em></span><span class="cf-tag">${esc(s.label)}</span></span>
                <span class="cf-art">${cardArt(card.id)}</span>
                <span class="kx-card__title">${esc(card.name)}</span>
                <span class="kx-card__hint">${esc(s.hint)}</span>
              </span>
            </span>
            <span class="kx-card__face kx-card__back">
              <span class="cb">
                <span class="card-no">${String(i + 1).padStart(2, '0')}<em>/07</em></span>
                <strong>${esc(card.name)}</strong>
                <span class="cb-body">${esc(card.body)}</span>
                <span class="card-window">${esc(s.window)}</span>
              </span>
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
          <div class="die-lift" data-dice-lift>
            <div class="cube" data-cube>
              ${FACE_CLASSES.map((c) => `<i class="core ${c}"></i>`).join('')}
              ${DICE_FACES.map((f, i) => `<div class="cube-face ${FACE_CLASSES[i]}">${faceMarkup(f)}</div>`).join('')}
            </div>
          </div>
          <i class="die-shadow" data-dice-shadow></i>
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
