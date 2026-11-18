import { LANGS, renderApp, quizView, freshQuiz, dicePitch, footer, DICE_FACES, segBug, scoreBug } from './render.js';

const root = document.documentElement;
const app = document.getElementById('app');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
const STORAGE_KEY = 'kl-lang';

const cache = {};
let content = null;
let quiz = freshQuiz();

root.classList.add('js');

/* ---------- Storage (wrapped: can throw in private mode) ---------- */
const store = {
  get() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch { return null; }
  },
  set(v) {
    try { window.localStorage.setItem(STORAGE_KEY, v); } catch { /* ignore */ }
  }
};

async function load(lang) {
  if (!cache[lang]) {
    const res = await fetch(`content/${lang}.json`);
    if (!res.ok) throw new Error(`Could not load ${lang}`);
    cache[lang] = await res.json();
  }
  return cache[lang];
}

function setMeta(c) {
  document.title = c.meta.title;
  const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.setAttribute('content', val); };
  set('meta[name="description"]', c.meta.description);
  set('meta[property="og:title"]', c.meta.ogTitle);
  set('meta[property="og:description"]', c.meta.ogDescription);
  set('meta[property="og:locale"]', { en: 'en_GB', it: 'it_IT', es: 'es_419' }[c.meta.lang]);
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = el.dataset.i18n.split('.').reduce((o, k) => (o ? o[k] : undefined), c);
    if (typeof v === 'string') el.textContent = v;
  });
  const nav = document.querySelector('.kx-lang');
  if (nav) nav.setAttribute('aria-label', c.ui.langLabel);
  document.getElementById('site-footer').innerHTML = footer(c);
}

function markLangButtons(lang) {
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
}

async function setLang(lang, { initial = false } = {}) {
  if (!LANGS.includes(lang)) lang = 'en';
  markLangButtons(lang);
  try {
    const c = await load(lang);
    content = c;
    if (!initial || lang !== 'en') {
      app.innerHTML = renderApp(c);
      quiz = freshQuiz();
      setMeta(c);
      revealAll(initial);
    }
    root.lang = lang;
    if (!initial) store.set(lang);
  } catch (err) {
    console.warn(err);
  }
}

/* ---------- Scroll reveal ---------- */
let observer = null;
function revealAll(observe) {
  const els = app.querySelectorAll('.reveal');
  if (!observe || reduceMotion.matches || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target); }
    }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  els.forEach((el) => observer.observe(el));
}

/* ---------- Timeline ---------- */
function selectSegment(i) {
  const seg = content.timeline.segments[i];
  if (!seg) return;
  app.querySelectorAll('[data-seg]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.seg) === i)));
  const panel = document.getElementById('tl-panel');
  panel.querySelector('.tl-bug').innerHTML = segBug(content, i);
  panel.querySelector('.tl-title').textContent = seg.title;
  panel.querySelector('.tl-body').textContent = seg.body;
  bump(panel);
  panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
}

// Score-bug number "jumps" when it changes (DS motion rule).
function bump(scope) {
  const el = scope.querySelector('[data-bump]');
  if (!el || reduceMotion.matches) return;
  el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
}

/* ---------- Dice ---------- */
// Rotation that brings each face (same order as DICE_FACES) to the front.
const FACE_ROT = [[0, 0], [0, -90], [-90, 0], [0, 180], [0, 90], [90, 0]];
let cubeRot = { x: -20, y: 30 };
let rolling = false;

function rollDice(btn) {
  if (rolling) return;
  rolling = true;
  const s = content.dice;
  const cube = app.querySelector('[data-cube]');
  const bugBox = app.querySelector('[data-dice-bug]');
  const text = app.querySelector('[data-dice-text]');
  const pitch = app.querySelector('[data-dice-pitch]');
  const idx = Math.floor(Math.random() * 6);
  const [fx, fy] = FACE_ROT[idx];
  const spinsX = reduceMotion.matches ? 0 : 2 + Math.floor(Math.random() * 2);
  const spinsY = reduceMotion.matches ? 0 : 2 + Math.floor(Math.random() * 2);
  const nx = Math.ceil(cubeRot.x / 360) * 360 + spinsX * 360 + fx;
  const ny = Math.ceil(cubeRot.y / 360) * 360 + spinsY * 360 + fy;
  cubeRot = { x: nx, y: ny };
  btn.disabled = true;
  btn.textContent = s.rolling;
  bugBox.querySelector('[data-bump]').textContent = '…';
  cube.style.transform = `rotateX(${nx}deg) rotateY(${ny}deg)`;
  const done = () => {
    const face = DICE_FACES[idx];
    const f = s.faces[face];
    const n = face === 'logo' ? 1 : Number(face);
    bugBox.innerHTML = scoreBug({ home: content.ui.home, away: content.ui.away, mid: f.label, min: '20:00', label: `${s.resultLabel}: ${f.label}` });
    bump(bugBox);
    text.textContent = f.text;
    pitch.innerHTML = dicePitch(n, s.pitchAlt);
    btn.disabled = false;
    btn.textContent = s.again;
    rolling = false;
  };
  setTimeout(done, reduceMotion.matches ? 50 : 850);
}

/* ---------- Quiz ---------- */
function drawQuiz(focus = true) {
  const box = app.querySelector('[data-quiz]');
  box.innerHTML = quizView(content, quiz);
  if (focus) box.querySelector('[data-focus]')?.focus({ preventScroll: true });
  bump(box);
}

/* ---------- Events (delegated, so they survive re-renders) ---------- */
document.addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;

  if (t.dataset.lang) { setLang(t.dataset.lang); return; }
  if (!content) return;

  if (t.dataset.seg !== undefined) { selectSegment(Number(t.dataset.seg)); return; }

  if (t.classList.contains('kx-card')) {
    t.setAttribute('aria-pressed', String(t.getAttribute('aria-pressed') !== 'true'));
    return;
  }

  if (t.hasAttribute('data-roll')) { rollDice(t); return; }

  if (t.dataset.quizOption !== undefined) {
    if (quiz.picked !== null) return;
    const pick = Number(t.dataset.quizOption);
    const ok = pick === content.quiz.questions[quiz.i].answer;
    quiz.picked = pick;
    quiz.answers.push(ok);
    if (ok) quiz.score += 1;
    drawQuiz(false);
    app.querySelector('[data-quiz-next]')?.focus({ preventScroll: true });
    return;
  }
  if (t.hasAttribute('data-quiz-next')) {
    if (quiz.i + 1 >= content.quiz.questions.length) quiz.done = true;
    else { quiz.i += 1; quiz.picked = null; }
    drawQuiz();
    return;
  }
  if (t.hasAttribute('data-quiz-retry')) { quiz = freshQuiz(); drawQuiz(); }
});

document.addEventListener('mouseover', (e) => {
  if (!canHover.matches || !content) return;
  const seg = e.target.closest('[data-seg]');
  if (seg && seg.getAttribute('aria-pressed') !== 'true') selectSegment(Number(seg.dataset.seg));
});

/* ---------- Start ---------- */
const saved = store.get();
setLang(saved && LANGS.includes(saved) ? saved : 'en', { initial: true }).then(() => {
  if (!saved || saved === 'en') revealAll(true);
});
