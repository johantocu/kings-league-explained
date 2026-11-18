// Pure render functions: content object in, HTML string out.
// Used in the browser (language switch) and by tools/prerender.mjs (no-JS fallback).

export const LANGS = ['en', 'it', 'es'];

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const fill = (tpl, vars) => String(tpl).replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));

const sectionHead = (s, id) => `
      <header class="sec-head">
        ${s.kicker ? `<p class="kicker">${esc(s.kicker)}</p>` : ''}
        <h2 id="${id}-title">${esc(s.title)}</h2>
        ${s.lead ? `<p class="lead">${esc(s.lead)}</p>` : ''}
      </header>`;

/* ---------- Generic badge used on the dice and favicon (own design, not the league's) ---------- */
export const BADGE = `<svg class="badge" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M24 3 42 13.5v21L24 45 6 34.5v-21Z" fill="none" stroke="currentColor" stroke-width="3"/><text x="24" y="31.5" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-weight="700" font-size="20" fill="currentColor">7</text></svg>`;

/* ---------- Card icons ---------- */
const ICONS = {
  x2: `<text x="32" y="42" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-weight="700" font-size="26" fill="currentColor">x2</text>`,
  suspension: `<circle cx="32" cy="34" r="18" fill="none" stroke="currentColor" stroke-width="3"/><path d="M32 22v12l8 5M26 10h12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><text x="32" y="62" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="9" font-weight="700" fill="currentColor">4:00</text>`,
  star: `<path d="m32 8 7 15 16 2-12 11 3 16-14-8-14 8 3-16L9 25l16-2Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>`,
  shootout: `<circle cx="18" cy="40" r="9" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 34h22m-7-7 7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="40" y="20" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="11" font-weight="700" fill="currentColor">5s</text>`,
  joker: `<rect x="14" y="10" width="24" height="34" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><rect x="26" y="20" width="24" height="34" rx="4" fill="#0B1A2A" stroke="currentColor" stroke-width="3"/><text x="38" y="43" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="16" font-weight="700" fill="currentColor">?</text>`,
  reverse: `<path d="M48 26a17 17 0 0 0-30-8M16 38a17 17 0 0 0 30 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="m17 10 1 8 8-1M47 54l-1-8-8 1" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  penalty: `<path d="M8 46V16h48v30" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M8 26h48M8 36h48M20 16v30M32 16v30M44 16v30" stroke="currentColor" stroke-opacity=".3" stroke-width="1.5"/><circle cx="32" cy="54" r="5" fill="currentColor"/>`
};

/* ---------- Pitch diagrams ---------- */
const pitchLines = (w, h) => `
  <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="6" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2"/>
  <line x1="${w / 2}" y1="4" x2="${w / 2}" y2="${h - 4}" stroke="rgba(255,255,255,.22)" stroke-width="2"/>
  <circle cx="${w / 2}" cy="${h / 2}" r="${h * 0.16}" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2"/>
  <rect x="4" y="${h * 0.3}" width="${w * 0.1}" height="${h * 0.4}" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2"/>
  <rect x="${w - 4 - w * 0.1}" y="${h * 0.3}" width="${w * 0.1}" height="${h * 0.4}" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2"/>`;

const player = (x, y, team, i = 0) =>
  team === 'a'
    ? `<circle class="pl" style="--i:${i}" cx="${x}" cy="${y}" r="7" fill="#39FF14"/>`
    : `<circle class="pl" style="--i:${i}" cx="${x}" cy="${y}" r="6" fill="#081521" stroke="#FFFFFF" stroke-width="2.5"/>`;

const keeper = (x, y, team) =>
  `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" rx="3" fill="${team === 'a' ? '#39FF14' : '#081521'}" stroke="${team === 'a' ? '#39FF14' : '#FFFFFF'}" stroke-width="2.5"/>`;

// Hero: 7v7 in a simple 1-3-3 shape.
export function heroPitch(alt) {
  const w = 320, h = 200;
  const spotsA = [[60, 45], [60, 100], [60, 155], [110, 70], [110, 130], [140, 100]];
  const spotsB = spotsA.map(([x, y]) => [w - x, y]);
  return `<svg class="hero-pitch" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(alt)}">
    <rect width="${w}" height="${h}" rx="14" fill="#081521"/>
    ${pitchLines(w, h)}
    ${keeper(20, 100, 'a')}${keeper(w - 20, 100, 'b')}
    ${spotsA.map(([x, y], i) => player(x, y, 'a', i)).join('')}
    ${spotsB.map(([x, y], i) => player(x, y, 'b', i)).join('')}
  </svg>`;
}

// Dice result: n outfield players per team plus keepers.
export function dicePitch(n, alt) {
  const w = 300, h = 180;
  const layouts = {
    1: [[110, 90]],
    2: [[95, 60], [115, 120]],
    3: [[80, 90], [115, 50], [115, 130]]
  };
  const spots = layouts[n] || [];
  return `<svg class="dice-pitch" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(fill(alt, { n }))}">
    <rect width="${w}" height="${h}" rx="12" fill="#081521"/>
    ${pitchLines(w, h)}
    ${keeper(18, 90, 'a')}${keeper(w - 18, 90, 'b')}
    ${spots.map(([x, y], i) => player(x, y, 'a', i)).join('')}
    ${spots.map(([x, y], i) => player(w - x, y, 'b', i)).join('')}
  </svg>`;
}

/* ---------- Dice cube ---------- */
const pips = (n) => {
  const pos = n === 2 ? [[28, 28], [72, 72]] : [[26, 26], [50, 50], [74, 74]];
  return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${pos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="currentColor"/>`).join('')}</svg>`;
};
export const DICE_FACES = ['logo', '2', '3', 'logo', '2', '3']; // front, right, top, back, left, bottom
const FACE_CLASSES = ['f-front', 'f-right', 'f-top', 'f-back', 'f-left', 'f-bottom'];
const faceMarkup = (f) => (f === 'logo' ? BADGE : pips(Number(f)));

/* ---------- Sections ---------- */
function hero(c) {
  const h = c.hero;
  return `
  <section class="hero" aria-labelledby="hero-title">
    <div class="wrap-wide hero-grid">
      <div class="hero-copy">
        <p class="pill-kicker">${esc(h.kicker)}</p>
        <h1 id="hero-title">${esc(h.title)}</h1>
        <p class="hero-sub">${esc(h.subtitle)}</p>
        <p class="byline"><span>${esc(h.byline)}</span><span aria-hidden="true">·</span><span>${esc(h.readTime)}</span><span aria-hidden="true">·</span><span class="byline-date">${esc(h.updated)}</span></p>
      </div>
      <div class="hero-art">${heroPitch(c.ui.pitchAlt)}</div>
    </div>
  </section>`;
}

function intro(c) {
  return `
  <section class="intro wrap prose reveal" aria-label="Intro">
    ${c.intro.paragraphs.map((p, i) => `<p${i === 0 ? ' class="dropcap"' : ''}>${esc(p)}</p>`).join('')}
  </section>`;
}

function numbers(c) {
  const s = c.numbers;
  return `
  <section class="numbers wrap reveal" aria-labelledby="numbers-title">
    ${sectionHead(s, 'numbers')}
    <ul class="stat-grid" role="list">
      ${s.items.map((it) => `<li class="stat"><span class="stat-value">${esc(it.value)}</span><span class="stat-label">${esc(it.label)}</span></li>`).join('')}
    </ul>
    <p class="fine">${esc(s.note)}</p>
  </section>`;
}

const SEG_FR = [5, 12, 3, 3, 13, 5];
const SEG_TONE = ['scale', 'cards', 'double', 'dice', 'cards', 'end'];

function timeline(c) {
  const s = c.timeline;
  const first = s.segments[0];
  return `
  <section class="timeline wrap-wide reveal" aria-labelledby="timeline-title">
    ${sectionHead(s, 'timeline')}
    <div class="tl" data-timeline>
      <p class="hint" aria-hidden="true">${esc(s.hint)}</p>
      <div class="tl-bar" style="grid-template-columns:${SEG_FR.map((f) => `minmax(46px,${f}fr)`).join(' ')}">
        ${s.segments
          .map(
            (seg, i) => `<button type="button" class="tl-seg tone-${SEG_TONE[i]}" data-seg="${i}" aria-pressed="${i === 0}" aria-controls="tl-panel">
            <span class="tl-range">${esc(seg.range)}</span><span class="tl-short">${esc(seg.short)}</span></button>`
          )
          .join('')}
      </div>
      <div class="tl-ruler" aria-hidden="true" style="grid-template-columns:${SEG_FR.map((f) => `minmax(46px,${f}fr)`).join(' ')}">
        ${["0'", "5'", "17'", "20'", "23'", "36'"].map((m) => `<span>${m}</span>`).join('')}
      </div>
      <div class="tl-panel" id="tl-panel" aria-live="polite">
        <p class="tl-panel-range">${esc(first.range)}</p>
        <h3>${esc(first.title)}</h3>
        <p>${esc(first.body)}</p>
      </div>
    </div>
  </section>`;
}

function cards(c) {
  const s = c.cards;
  return `
  <section class="cards wrap-wide reveal" aria-labelledby="cards-title">
    ${sectionHead(s, 'cards')}
    <ul class="deck" role="list">
      ${s.items
        .map(
          (card, i) => `<li>
        <button type="button" class="flip-card" aria-pressed="false" aria-label="${esc(card.name)}: ${esc(s.hint)}">
          <span class="flip-inner">
            <span class="face front">
              <span class="card-top"><span class="card-no">${String(i + 1).padStart(2, '0')}/07</span><span class="card-label">${esc(s.label)}</span></span>
              <svg class="card-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${ICONS[card.id] || ''}</svg>
              <span class="card-name">${esc(card.name)}</span>
              <span class="card-hint" aria-hidden="true">${esc(s.hint)} ↻</span>
            </span>
            <span class="face back">
              <span class="card-top"><span class="card-no">${String(i + 1).padStart(2, '0')}/07</span></span>
              <span class="card-name sm">${esc(card.name)}</span>
              <span class="card-body">${esc(card.body)}</span>
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
  <section class="dice wrap-wide reveal" aria-labelledby="dice-title">
    ${sectionHead(s, 'dice')}
    <div class="dice-box" data-dice>
      <div class="dice-stage">
        <div class="cube-scene" aria-hidden="true">
          <div class="cube" data-cube>
            ${DICE_FACES.map((f, i) => `<div class="cube-face ${FACE_CLASSES[i]}">${faceMarkup(f)}</div>`).join('')}
          </div>
        </div>
        <button type="button" class="btn btn-neon" data-roll>${esc(s.button)}</button>
        <p class="fine">${esc(s.odds)}</p>
      </div>
      <div class="dice-result" aria-live="polite" data-dice-result>
        <p class="kicker">${esc(s.resultLabel)}</p>
        <p class="dice-big" data-dice-label>?</p>
        <p class="dice-text" data-dice-text>${esc(s.prompt)}</p>
        <div class="dice-pitch-wrap" data-dice-pitch>${dicePitch(0, s.pitchAlt)}</div>
      </div>
    </div>
    <p class="fine">${esc(s.logoNote)}</p>
  </section>`;
}

function compare(c) {
  const s = c.compare;
  return `
  <section class="compare wrap-wide reveal" aria-labelledby="compare-title">
    ${sectionHead(s, 'compare')}
    <p class="hint scroll-hint" aria-hidden="true">${esc(s.scrollHint)} →</p>
    <div class="table-wrap" tabindex="0" role="region" aria-labelledby="compare-title">
      <table>
        <thead><tr>${s.headers.map((h, i) => `<th scope="col"${i === 1 ? ' class="col-kings"' : ''}>${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>
          ${s.rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td class="col-kings">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>`;
}

function presidents(c) {
  const s = c.presidents;
  return `
  <section class="presidents wrap-wide reveal" aria-labelledby="presidents-title">
    ${sectionHead(s, 'presidents')}
    <div class="pres-groups">
      ${s.groups
        .map(
          (g, gi) => `<div class="pres-group g${gi}">
        <h3>${esc(g.title)}</h3>
        <ul role="list">
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
  <section class="expansion wrap-wide reveal" aria-labelledby="expansion-title">
    ${sectionHead(s, 'expansion')}
    <ol class="years" role="list">
      ${s.years
        .map(
          (y) => `<li class="year">
        <p class="year-label"><span class="year-dot" aria-hidden="true"></span>${esc(y.year)}</p>
        <ul role="list">
          ${y.events.map((e) => `<li class="event${e.highlight ? ' hl' : ''}">${e.date ? `<span class="event-date">${esc(e.date)}</span>` : ''}<span>${esc(e.text)}</span></li>`).join('')}
        </ul>
      </li>`
        )
        .join('')}
    </ol>
  </section>`;
}

function quote(c) {
  return `
  <section class="quote wrap reveal" aria-label="Quote">
    <figure>
      <blockquote><p>${esc(c.quote.text)}</p></blockquote>
      <figcaption>${esc(c.quote.author)}</figcaption>
    </figure>
  </section>`;
}

function why(c) {
  const s = c.why;
  return `
  <section class="why wrap prose reveal" aria-labelledby="why-title">
    ${sectionHead(s, 'why')}
    ${s.paragraphs.map((p, i) => `<h3><span class="why-no">0${i + 1}</span>${esc(p.heading)}</h3><p>${esc(p.text)}</p>`).join('')}
  </section>`;
}

export function quizView(c, st) {
  const q = c.quiz;
  const total = q.questions.length;
  if (st.done) {
    const tier = st.score === total ? 3 : st.score >= 3 ? 2 : st.score >= 1 ? 1 : 0;
    return `
      <div class="quiz-result">
        <p class="kicker">${esc(q.scoreLabel)}</p>
        <p class="quiz-score" tabindex="-1" data-focus>${esc(fill(q.resultTitle, { score: st.score, total }))}</p>
        <div class="quiz-dots" aria-hidden="true">${st.answers.map((a) => `<span class="${a ? 'ok' : 'ko'}"></span>`).join('')}</div>
        <p>${esc(q.results[tier])}</p>
        <button type="button" class="btn btn-neon" data-quiz-retry>${esc(q.retry)}</button>
      </div>`;
  }
  const item = q.questions[st.i];
  const answered = st.picked !== null;
  return `
      <div class="quiz-top">
        <p class="kicker">${esc(fill(q.progress, { n: st.i + 1, total }))}</p>
        <p class="kicker">${esc(q.scoreLabel)}: <span class="neon">${st.score}</span>/${total}</p>
      </div>
      <div class="quiz-progress" aria-hidden="true"><span style="width:${(st.i / total) * 100}%"></span></div>
      <h3 class="quiz-q" tabindex="-1" data-focus>${esc(item.q)}</h3>
      <div class="quiz-options">
        ${item.options
          .map((o, i) => {
            let cls = '';
            if (answered) {
              if (i === item.answer) cls = ' is-correct';
              else if (i === st.picked) cls = ' is-wrong';
            }
            return `<button type="button" class="quiz-opt${cls}" data-quiz-option="${i}"${answered ? ' aria-disabled="true"' : ''}><span class="opt-key" aria-hidden="true">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`;
          })
          .join('')}
      </div>
      <div class="quiz-feedback" aria-live="polite">${
        answered
          ? `<p class="${st.picked === item.answer ? 'fb-ok' : 'fb-ko'}"><strong>${esc(st.picked === item.answer ? q.correct : q.wrong)}</strong> ${esc(item.explain)}</p>
             <button type="button" class="btn btn-neon" data-quiz-next>${esc(st.i + 1 === total ? q.finish : q.next)}</button>`
          : ''
      }</div>`;
}

export const freshQuiz = () => ({ i: 0, score: 0, picked: null, done: false, answers: [] });

function quiz(c) {
  const s = c.quiz;
  return `
  <section class="quiz wrap reveal" aria-labelledby="quiz-title">
    ${sectionHead(s, 'quiz')}
    <div class="quiz-box" data-quiz>${quizView(c, freshQuiz())}</div>
  </section>`;
}

function watch(c) {
  const s = c.watch;
  return `
  <section class="watch wrap-wide reveal" aria-labelledby="watch-title">
    ${sectionHead(s, 'watch')}
    <ul class="watch-grid" role="list">
      ${s.items.map((it) => `<li class="watch-item"><span class="watch-name">${esc(it.name)}</span><span>${esc(it.text)}</span></li>`).join('')}
    </ul>
    <p class="fine">${esc(s.verified)}</p>
  </section>`;
}

function sources(c) {
  const s = c.sources;
  return `
  <section class="sources wrap reveal" aria-labelledby="sources-title">
    <h2 id="sources-title">${esc(s.title)}</h2>
    <p class="fine">${esc(s.lead)}</p>
    <ol>
      ${s.items.map((it) => `<li><a href="${esc(it.url)}" rel="noopener" target="_blank">${esc(it.label)}</a></li>`).join('')}
    </ol>
  </section>`;
}

export function footer(c) {
  return `<p>${esc(c.footer.text)}</p><p>${esc(c.footer.credit)}</p>`;
}

export function renderApp(c) {
  return [hero, intro, numbers, timeline, cards, dice, compare, presidents, expansion, quote, why, quiz, watch, sources]
    .map((fn) => fn(c))
    .join('\n');
}
