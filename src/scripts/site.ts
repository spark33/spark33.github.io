// Site-wide behaviour: theme, the moon, the rail's "where you are" line, the footer clocks,
// copy buttons, and hover cards (feedforward: anything clickable says what it is before you click).
export const T = { press: 150, move: 280, reveal: 420 };
export const EASE = 'cubic-bezier(.23,1,.32,1)';
export const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
import { client, counterpart, langOf, loc } from '../i18n';
const $ = (s: string, r: ParentNode = document) => r.querySelector(s) as HTMLElement | null;
const $$ = (s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as HTMLElement[];

// ── moon geometry, shared with the living titles
const SYN = 29.530588853, REF = Date.UTC(2000, 0, 6, 18, 14);
export const phaseNow = () => (((Date.now() - REF) / 864e5) % SYN + SYN) % SYN / SYN;
export function moonPath(p: number, r: number, c: number) {
  const w = p < .5, k = Math.cos(2 * Math.PI * p), rx = Math.max(Math.abs(k) * r, .001);
  return `M ${c} ${c - r} A ${r} ${r} 0 0 ${w ? 1 : 0} ${c} ${c + r} A ${rx} ${r} 0 0 ${k > 0 ? (w ? 0 : 1) : (w ? 1 : 0)} ${c} ${c - r} Z`;
}
export const data = () => JSON.parse($('#site-data')!.textContent || '{}');
// the browser bar matches the theme you picked (the two <meta name=theme-color> only know the OS setting)
const BAR = { light: '#eeeadf', dark: '#12110f' } as Record<string, string>;
export const themeColor = (doc: Document) => doc.querySelectorAll('meta[name=theme-color]').forEach((m) => m.setAttribute('content', BAR[document.documentElement.dataset.theme || 'light']));
themeColor(document);

// ── pages swap in place (Astro's ClientRouter), so nothing reloads. The document lives on:
// set things up once, and redo the per-page parts with everyPage(); onLeave() tidies up before the swap.
const leaving: (() => void)[] = [];
let loaded = false;
export const onLeave = (f: () => void) => { leaving.push(f); };
// a script first loaded by a later page can arrive after that page's astro:page-load, so it also runs right away
export const everyPage = (f: () => void) => { document.addEventListener('astro:page-load', f); if (loaded) f(); };
document.addEventListener('astro:page-load', () => { loaded = true; document.documentElement.style.scrollBehavior = ''; });
document.addEventListener('astro:before-swap', (e: any) => {
  leaving.splice(0).forEach((f) => f()); loaded = false;
  const h = e.newDocument.documentElement; h.dataset.theme = document.documentElement.dataset.theme; themeColor(e.newDocument);
  h.style.scrollBehavior = 'auto'; // jump to the new page's top (or #hash) instead of smooth-scrolling there
});


let started = false;
export function initSite() {
  if (started) return; started = true;
  const where = $('#where')!, pct = $('#pct')!; // in the rail, which stays put across pages
  let page = '', intro = '', marks: HTMLElement[] = [];

  // ── the rail: which section you're in, and a line about it (elements carry data-where / data-desc)
  let current = '', lastY = 0;
  const setWhere = (label: string, desc: string) => {
    const key = label + '|' + desc; if (key === current) return; const down = scrollY >= lastY; current = key;
    $$('.w', where).forEach((o) => { o.classList.add(down ? 'to-above' : 'from-below'); setTimeout(() => o.remove(), T.move); });
    if (!label && !desc) return;
    const n = document.createElement('div'); n.className = 'w ' + (down ? 'from-below' : 'to-above');
    n.innerHTML = `${label ? `<b>${label}</b>` : ''}${desc ? `<span>${desc}</span>` : ''}`; where.append(n);
    requestAnimationFrame(() => requestAnimationFrame(() => (n.className = 'w')));
  };
  const tickWhere = () => {
    const atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 4, line = innerHeight * (atEnd ? .8 : .3);
    let label = '', desc = '';
    for (const m of marks) if (m.getBoundingClientRect().top < line) { label = m.dataset.where || ''; desc = m.dataset.desc || ''; }
    if (!label) desc = intro;
    setWhere(label, desc); lastY = scrollY;
  };

  // ── the moon: a spring-smoothed phase that fills as you scroll; % read on pieces; click = theme
  const mp = $('#mp')!; let target = .06, pos = .06, vel = 0, raf = 0;
  const spring = () => {
    const f = -170 * (pos - target) - 26 * vel; vel += f / 60; pos += vel / 60;
    mp.setAttribute('d', moonPath(Math.max(.02, Math.min(.4999, pos)), 7.5, 9));
    raf = Math.abs(pos - target) > .0005 || Math.abs(vel) > .0005 ? requestAnimationFrame(spring) : 0;
  };
  const tick = () => {
    const max = document.documentElement.scrollHeight - innerHeight, s = max > 0 ? Math.min(1, scrollY / max) : 0;
    target = .06 + s * (.4999 - .06);
    if (page === 'post') { const done = s >= .995; if (done) target = .5; pct.textContent = done ? client().finished : client().read(Math.round(s * 100)); }
    if (!raf) raf = requestAnimationFrame(spring);
    tickWhere();
  };
  addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick);
  if (document.documentElement.classList.contains('intro')) moonrise();

  $('#moon')!.addEventListener('click', (e) => {
    const h = document.documentElement, t = h.dataset.theme === 'light' ? 'dark' : 'light', swap = () => { h.dataset.theme = t; localStorage.setItem('theme', t); themeColor(document); };
    if (!(document as any).startViewTransition || RM()) return swap();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    h.classList.add('theming');
    const vt = (document as any).startViewTransition(swap);
    vt.ready.then(() => h.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] }, { duration: T.reveal, easing: EASE, pseudoElement: '::view-transition-new(root)' })).catch(() => {});
    vt.finished.catch(() => {}).finally(() => h.classList.remove('theming'));
  });

  // ── copy buttons
  document.addEventListener('click', (e) => {
    const c = (e.target as HTMLElement).closest('[data-copy]') as HTMLElement | null; if (!c) return;
    const label = (c.dataset.label ??= c.textContent || ''); // the real label, kept even if clicked again while it says "Copied"
    const done = (ok: boolean) => { c.dataset.done = ''; c.textContent = ok ? client().copied : client().pressC; clearTimeout((c as any)._t); (c as any)._t = setTimeout(() => { delete c.dataset.done; c.textContent = label; }, 1400); };
    navigator.clipboard ? navigator.clipboard.writeText(c.dataset.copy!).then(() => done(true), () => done(false)) : done(false);
  });

  // "← Back" / "← Writing" go back (keeping your scroll) when the page you came from is the one they point to;
  // otherwise (you arrived from elsewhere, or from another piece) they're a normal link
  let prev = '', here = location.pathname;
  try { const r = new URL(document.referrer); if (r.origin === location.origin) prev = r.pathname; } catch (err) {}
  document.addEventListener('astro:after-swap', () => { prev = here; here = location.pathname; });
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a[data-back]') as HTMLAnchorElement | null; if (!a || history.length < 2) return;
    if (prev && prev === a.pathname) { e.preventDefault(); history.back(); }
  }, true); // capture: runs before the router's own link handler, which would otherwise navigate too

  const cards = initCards();
  const lang = initLang();

  // ── per page
  everyPage(() => {
    page = document.body.dataset.page || ''; intro = document.body.dataset.intro || ''; marks = $$('[data-where]');
    pct.textContent = ''; lastY = 0; cards.attach(); lang.update();
    // footer: tonight's moon, and the time in Seoul and New York
    const p = Math.min(Math.max(phaseNow(), .001), .999);
    const L = client();
    $('#dmoon')!.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="var(--moon-dark)" stroke="var(--rule)"/><path fill="var(--fg)" d="${moonPath(p, 6, 7)}"/></svg>${L.phases[Math.floor(phaseNow() * 8 + .5) % 8]}`;
    const fmt = (tz: string) => new Intl.DateTimeFormat(L.locale, { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(new Date());
    const clocks = [() => ($('#clock')!.textContent = L.clock(fmt('Asia/Seoul'), fmt('America/New_York'))),
      ...$$('[data-seoul-now]').map((el) => () => (el.textContent = L.locale === 'en-US' ? fmt('Asia/Seoul').toLowerCase() : fmt('Asia/Seoul')))];
    clocks.forEach((f) => f()); const iv = setInterval(() => clocks.forEach((f) => f()), 30000);
    onLeave(() => { clearInterval(iv); cards.close(); });
    tick();
  });
}

// ── moonrise: the first-visit loader (Base.astro decides whether it runs). In the other theme's paper, the moon
// waxes to tonight's real phase while the font loads, fills to full, then grows until your theme's colour covers
// the page, and the page inks in behind it, top to bottom. Any click, key or scroll skips straight to the page.
function moonrise() {
  const h = document.documentElement, svg = $('#loader svg')!, path = $('#loader path')!, fill = $('#loader .fill')!;
  const WAX = 600, MAXWAIT = 1100, FULL = 260, GROW = 640, STEP = 60, MAXI = 6;
  const tonight = Math.min(Math.max(phaseNow(), .001), .999), out3 = (t: number) => 1 - Math.pow(1 - t, 3);
  const toFull = ((.5 - tonight + 1.5) % 1) - .5; // the short way round to a full moon
  const draw = (p: number) => path.setAttribute('d', moonPath((p % 1 + 1) % 1 || .001, 7.5, 9));
  const inks = [$('.rail .mast'), ...$$('.lede>p'), ...$$('main>:not(.lede-wrap)')].filter(Boolean) as HTMLElement[];
  inks.forEach((el, i) => el.style.setProperty('--i', String(Math.min(i, MAXI))));
  $('.rail .where')!.style.setProperty('--i', '1'); $('.rail .bottom')!.style.setProperty('--i', '3');
  let fonts = false, t0 = 0, full0 = 0, raf = 0, over = false, grow: Animation | null = null;
  document.fonts.ready.then(() => (fonts = true));
  const cleanup = () => { h.classList.remove('intro', 'inked', 'landed'); [...inks, $('.rail .where')!, $('.rail .bottom')!].forEach((el) => el.style.removeProperty('--i')); };
  const end = (skip: boolean) => {
    if (over) return; over = true; cancelAnimationFrame(raf); grow?.cancel(); sessionStorage.setItem('sp-intro', '1');
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) => removeEventListener(ev, skipIt));
    if (skip) return cleanup();
    h.classList.add('landed', 'inked'); setTimeout(cleanup, T.reveal + MAXI * STEP + 60);
  };
  // a tap that skips the intro shouldn't also press whatever invisible link was under it
  const swallow = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
  const skipIt = (e: Event) => { if (e.type === 'pointerdown' && !h.classList.contains('inked')) { addEventListener('click', swallow, { capture: true, once: true }); setTimeout(() => removeEventListener('click', swallow, true), 600); } end(true); };
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) => addEventListener(ev, skipIt, { passive: true }));
  // the full moon becomes a circle of your theme's paper, the same size, which then opens past the corners
  const open = () => {
    const r = svg.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, r0 = r.width * 7.5 / 18;
    const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 2;
    grow = fill.animate({ clipPath: [`circle(${r0}px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] }, { duration: GROW, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' });
    grow.finished.then(() => end(false), () => {});
  };
  draw(.001);
  const frame = (now: number) => {
    if (h.classList.contains('gated') || !t0) t0 = now; // the clock starts once the page is allowed to show
    const t = now - t0;
    if (!full0) {
      draw(tonight * out3(Math.min(1, t / WAX)));
      if (t >= WAX && (fonts || t >= MAXWAIT)) full0 = now;
    } else {
      const f = Math.abs(toFull) < .01 ? 1 : Math.min(1, (now - full0) / FULL);
      draw(tonight + toFull * out3(f));
      if (f >= 1) return open();
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
}

// ── 한/EN: the other language's link in the rail. The rail persists across pages, so its href is kept current
// (on a 404 it goes to the other home). Switching reloads the page (the rail and every label change), and you land
// on the same spot: the block at the top of the screen is found again by its position among the page's blocks,
// which line up one to one between the two languages.
const BLOCKS = 'main :is(h1,h2,h3,p,li,tr,figure,pre,blockquote,dl,.proj)';
function initLang() {
  const KEY = 'sp-lang-spot';
  const link = () => $('.rail .lang a[data-lang]') as HTMLAnchorElement | null;
  const target = () => (document.body.dataset.page === '404' ? loc('/', langOf(counterpart(location.pathname))) : counterpart(location.pathname) + location.hash);
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('.rail .lang a[data-lang]') as HTMLAnchorElement | null; if (!a) return;
    a.href = target();
    const top = innerWidth <= 900 ? ($('.rail')!.getBoundingClientRect().bottom) : 0;
    const bs = $$(BLOCKS), i = bs.findIndex((b) => b.getBoundingClientRect().bottom > top + 8);
    if (scrollY > 40 && i >= 0) sessionStorage.setItem(KEY, JSON.stringify({ to: new URL(a.href).pathname, i, dy: bs[i].getBoundingClientRect().top, f: scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) }));
  }, true);
  // arriving from the switch: find the same block and put it where it was
  let spot: any = null; try { spot = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) {}
  sessionStorage.removeItem(KEY);
  if (spot && spot.to === location.pathname && !location.hash) {
    const go = () => {
      const b = $$(BLOCKS)[spot.i];
      const y = b ? scrollY + b.getBoundingClientRect().top - spot.dy : spot.f * (document.documentElement.scrollHeight - innerHeight);
      document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, Math.max(0, y)); document.documentElement.style.scrollBehavior = '';
    };
    if (history.scrollRestoration) history.scrollRestoration = 'manual';
    go(); requestAnimationFrame(go); document.fonts.ready.then(go);
  }
  return { update: () => { const a = link(); if (a) a.href = target(); } };
}

// ── hover cards. Rich ones for the things worth explaining; a short note for everything else.
function initCards() {
  const D = data(), L = client(), C = L.card;
  const card = document.createElement('div'); card.className = 'card'; card.id = 'card'; card.setAttribute('role', 'tooltip');
  let owner: HTMLElement | null = null, openT = 0, closeT = 0, warm = 0, loop = 0;
  const ext = (label: string, href: string) => `<a href="${href}" target="_blank" rel="noopener">${label} ↗</a>`;
  const job = (k: string, host: string) => { const j = D.jobs.find((x: any) => x.card === k); return j ? `<p><b>${j.company}</b>, ${j.where}. ${j.role}, ${j.years}.</p><p>${j.line}</p><p class="acts">${ext(host, j.url)}</p>` : ''; };
  const bz = `<div class="cv cv-baze" aria-hidden="true"><span class="bz">Baze</span><span class="pill">${C.talking} <span class="mdl">GPT-6 Astra</span></span></div>`;
  const RICH: Record<string, () => string> = {
    baze: () => bz + C.baze(D),
    case: () => bz + C.caseText,
    mindlogic: () => `<div class="cv cv-chat" aria-hidden="true"><span class="bb u">${C.chatQ}</span><span class="bb a"><i></i><i></i><i></i></span></div>` + C.mindlogic(D),
    mongodb: () => job('mongodb', 'mongodb.com'),
    deloitte: () => job('deloitte', 'deloittedigital.com'),
    email: () => C.email(D),
    writing: () => C.writing(D.posts.length) + `<ul class="cl">${D.posts.map((p: any) => `<li><a href="${D.base}/writing/${p.s}/">${p.t}</a></li>`).join('')}</ul>`,
    work: () => C.work + `<ul class="cl">${D.jobs.map((j: any) => `<li>${j.company}, ${j.where} · ${j.years}</li>`).join('')}</ul>`,
  };
  const postCard = (slug: string) => { const p = D.posts.find((x: any) => x.s === slug); return p ? `<p><b>${p.t}</b></p><p>${p.x}</p><p class="faint">${p.l} · ${p.st}</p>` : ''; };
  const note = (el: HTMLElement) => {
    if (el.dataset.ff) return el.dataset.ff;
    if (el.id === 'moon') return L.themeTo(document.documentElement.dataset.theme === 'light');
    if (el.matches('[data-copy]')) return L.copyX(el.dataset.copy!);
    if (el instanceof HTMLAnchorElement) {
      if (el.target === '_blank') { try { return L.newTab(new URL(el.href).hostname.replace(/^www\./, '')); } catch (e) {} }
      if (el.hash && el.pathname === location.pathname) return L.jump;
    }
    return el.getAttribute('aria-label') || '';
  };
  const content = (el: HTMLElement) => {
    const k = el.dataset.card; if (k && RICH[k]) return { rich: true, html: RICH[k]() };
    const m = el instanceof HTMLAnchorElement && el.pathname.match(/^(?:\/ko)?\/writing\/([^/]+)\/?$/); if (m) return { rich: true, html: postCard(m[1]) };
    const t = note(el); return t ? { rich: false, html: t } : null;
  };
  const place = (el: HTMLElement) => {
    const r = el.getBoundingClientRect(), w = card.offsetWidth, h = card.offsetHeight, below = r.bottom + 10 + h < innerHeight;
    card.style.left = Math.min(innerWidth - 12 - w, Math.max(12, r.left + r.width / 2 - w / 2)) + 'px';
    card.style.top = (below ? r.bottom + 10 : Math.max(12, r.top - h - 10)) + 'px';
    card.style.transformOrigin = below ? 'top center' : 'bottom center';
  };
  const animate = () => { // little loops inside the rich cards
    clearInterval(loop); const mdl = $('.mdl', card); if (!mdl || RM()) return;
    const M = ['GPT-6 Astra', 'Claude Opus 5', 'Gemini 3.1 Pro', 'Grok 4.6', 'DeepSeek V4 Pro', 'Kling 3.0']; let i = 0;
    loop = window.setInterval(() => { mdl.classList.add('out'); setTimeout(() => { mdl.textContent = M[i = (i + 1) % M.length]; mdl.classList.remove('out'); }, T.press); }, 1100);
  };
  const open = (el: HTMLElement) => {
    const c = content(el); if (!c) return;
    owner = el; card.className = 'card' + (c.rich ? ' rich' : ''); card.innerHTML = c.html; place(el);
    requestAnimationFrame(() => card.classList.add('on')); el.setAttribute('aria-describedby', 'card'); animate();
  };
  const close = () => { clearTimeout(openT); clearTimeout(closeT); clearInterval(loop); if (owner) { owner.removeAttribute('aria-describedby'); warm = performance.now() + 300; } owner = null; card.classList.remove('on'); };
  const skip = (el: HTMLElement | null) => !el || !!el.closest('.livel,.card,.mmenu,[data-nocard]');
  document.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse') return;
    if ((e.target as HTMLElement).closest('.card')) { clearTimeout(closeT); return; }
    const el = (e.target as HTMLElement).closest('a[href],button') as HTMLElement | null; if (skip(el) || el === owner) { if (el === owner) clearTimeout(closeT); return; }
    const now = owner || performance.now() < warm; clearTimeout(openT);
    openT = window.setTimeout(() => { if (owner) close(); open(el!); }, now ? 0 : 350);
  });
  document.addEventListener('pointerout', (e) => {
    if (e.pointerType !== 'mouse') return; const to = e.relatedTarget as HTMLElement | null;
    if (to && (to.closest('.card') || (owner && owner.contains(to)))) return;
    clearTimeout(openT); if (owner) closeT = window.setTimeout(close, 220);
  });
  document.addEventListener('focusin', (e) => { const el = (e.target as HTMLElement).closest('a[href],button') as HTMLElement | null; if (!skip(el) && el!.matches(':focus-visible')) { close(); open(el!); } });
  document.addEventListener('focusout', (e) => { if (!card.contains(e.relatedTarget as Node)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && owner) { const o = owner; close(); o.focus(); } });
  document.addEventListener('pointerdown', (e) => { if (!(e.target as HTMLElement).closest('.card')) close(); }, true);
  addEventListener('scroll', () => { if (owner && !card.matches(':hover')) close(); }, { passive: true });
  // the body is replaced on every page, so the card goes back in each time
  return { close, attach: () => { if (!card.isConnected) document.body.append(card); } };
}
