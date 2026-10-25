// Site-wide behaviour: theme, the moon, the rail's "where you are" line, the footer clocks,
// copy buttons, and hover cards (feedforward: anything clickable says what it is before you click).
export const T = { press: 150, move: 280, reveal: 420 };
export const EASE = 'cubic-bezier(.23,1,.32,1)';
export const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s: string, r: ParentNode = document) => r.querySelector(s) as HTMLElement | null;
const $$ = (s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as HTMLElement[];

// ── moon geometry, shared with the living titles
const SYN = 29.530588853, REF = Date.UTC(2000, 0, 6, 18, 14);
export const phaseNow = () => (((Date.now() - REF) / 864e5) % SYN + SYN) % SYN / SYN;
export const PHASES = ['new moon', 'waxing crescent', 'first quarter', 'waxing gibbous', 'full moon', 'waning gibbous', 'last quarter', 'waning crescent'];
export function moonPath(p: number, r: number, c: number) {
  const w = p < .5, k = Math.cos(2 * Math.PI * p), rx = Math.max(Math.abs(k) * r, .001);
  return `M ${c} ${c - r} A ${r} ${r} 0 0 ${w ? 1 : 0} ${c} ${c + r} A ${rx} ${r} 0 0 ${k > 0 ? (w ? 0 : 1) : (w ? 1 : 0)} ${c} ${c - r} Z`;
}
export const data = () => JSON.parse($('#site-data')!.textContent || '{}');

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
  const h = e.newDocument.documentElement; h.dataset.theme = document.documentElement.dataset.theme;
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
    if (page === 'post') { const done = s >= .995; if (done) target = .5; pct.textContent = done ? 'Finished' : Math.round(s * 100) + '% read'; }
    if (!raf) raf = requestAnimationFrame(spring);
    tickWhere();
  };
  addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick);
  if (document.documentElement.classList.contains('intro')) moonrise();

  $('#moon')!.addEventListener('click', (e) => {
    const h = document.documentElement, t = h.dataset.theme === 'light' ? 'dark' : 'light', swap = () => { h.dataset.theme = t; localStorage.setItem('theme', t); };
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
    const done = (ok: boolean) => { const o = c.textContent; c.dataset.done = ''; c.textContent = ok ? 'Copied' : 'Press ⌘C'; setTimeout(() => { delete c.dataset.done; c.textContent = o; }, 1400); };
    navigator.clipboard ? navigator.clipboard.writeText(c.dataset.copy!).then(() => done(true), () => done(false)) : done(false);
  });

  // "← Back" goes back (keeping your scroll) when you came from this site; otherwise it's a normal link
  let inSite = false; document.addEventListener('astro:after-swap', () => (inSite = true));
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a[data-back]'); if (!a || history.length < 2) return;
    let fromHere = inSite; try { fromHere ||= new URL(document.referrer).origin === location.origin; } catch (err) {}
    if (fromHere) { e.preventDefault(); history.back(); }
  }, true); // capture: claim the click before the router starts its own navigation (two at once = a skipped transition)

  const cards = initCards();

  // ── per page
  everyPage(() => {
    page = document.body.dataset.page || ''; intro = document.body.dataset.intro || ''; marks = $$('[data-where]');
    pct.textContent = ''; lastY = 0; cards.attach();
    // footer: tonight's moon, and the time in Seoul and New York
    const p = Math.min(Math.max(phaseNow(), .001), .999);
    $('#dmoon')!.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="var(--moon-dark)" stroke="var(--rule)"/><path fill="var(--fg)" d="${moonPath(p, 6, 7)}"/></svg>${PHASES[Math.floor(phaseNow() * 8 + .5) % 8]}`;
    const fmt = (tz: string) => new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(new Date());
    const clocks = [() => ($('#clock')!.textContent = `Seoul ${fmt('Asia/Seoul')} · New York ${fmt('America/New_York')}`),
      ...$$('[data-seoul-now]').map((el) => () => (el.textContent = fmt('Asia/Seoul').toLowerCase()))];
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
  const skipIt = () => end(true);
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

// ── hover cards. Rich ones for the things worth explaining; a short note for everything else.
function initCards() {
  const D = data();
  const card = document.createElement('div'); card.className = 'card'; card.id = 'card'; card.setAttribute('role', 'tooltip');
  let owner: HTMLElement | null = null, openT = 0, closeT = 0, warm = 0, loop = 0;
  const ext = (label: string, href: string) => `<a href="${href}" target="_blank" rel="noopener">${label} ↗</a>`;
  const job = (k: string, host: string) => { const j = D.jobs.find((x: any) => x.card === k); return j ? `<p><b>${j.company}</b>, ${j.where}. ${j.role}, ${j.years}.</p><p>${j.line}</p><p class="acts">${ext(host, j.url)}</p>` : ''; };
  const RICH: Record<string, () => string> = {
    baze: () => `<div class="cv cv-baze" aria-hidden="true"><span class="bz">Baze</span><span class="pill">talking to <span class="mdl">GPT-6 Astra</span></span></div>
      <p><b>Baze</b>, formerly FactChat. One account for 80+ AI models (GPT, Claude, Gemini, Grok, DeepSeek, Sora, Kling) plus agents for research, slides, images and video. Built for universities, open to everyone since October 2026 from ₩5,900 a month.</p>
      <p class="acts">${ext('baze.co', D.links.baze)}<a href="/work/baze/">The case study →</a></p>`,
    case: () => `<div class="cv cv-baze" aria-hidden="true"><span class="bz">Baze</span><span class="pill">talking to <span class="mdl">GPT-6 Astra</span></span></div>
      <p><b>The Baze case study.</b> The bet, the hardest call, and the result.</p>`,
    mindlogic: () => `<div class="cv cv-chat" aria-hidden="true"><span class="bb u">Can you explain this?</span><span class="bb a"><i></i><i></i><i></i></span></div>
      <p><b>Mindlogic</b>. An AI company in Seoul, founded in 2019. It makes Baze, used by 100+ universities and 750K people, and Informe, an AI agent for customer service. I lead product there.</p>
      <p class="acts">${ext('mindlogic.ai', D.links.mindlogic)}</p>`,
    mongodb: () => job('mongodb', 'mongodb.com'),
    deloitte: () => job('deloitte', 'deloittedigital.com'),
    email: () => `<p><b>${D.email}</b></p><p>Email me, or copy the address.</p><p class="acts"><a href="mailto:${D.email}">Write an email</a><button data-copy="${D.email}">Copy address</button></p>`,
    writing: () => `<p><b>Writing.</b> ${D.posts.length} pieces, all drafts for now.</p><ul class="cl">${D.posts.map((p: any) => `<li><a href="/writing/${p.s}/">${p.t}</a></li>`).join('')}</ul>`,
    work: () => `<p><b>Where I've worked.</b> Newest first.</p><ul class="cl">${D.jobs.map((j: any) => `<li>${j.company}, ${j.where} · ${j.years}</li>`).join('')}</ul>`,
  };
  const postCard = (slug: string) => { const p = D.posts.find((x: any) => x.s === slug); return p ? `<p><b>${p.t}</b></p><p>${p.x}</p><p class="faint">${p.l} · ${p.st}</p>` : ''; };
  const note = (el: HTMLElement) => {
    if (el.dataset.ff) return el.dataset.ff;
    if (el.id === 'moon') return `Switch to ${document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'} mode`;
    if (el.matches('[data-copy]')) return `Copy ${el.dataset.copy}`;
    if (el instanceof HTMLAnchorElement) {
      if (el.target === '_blank') { try { return `${new URL(el.href).hostname.replace(/^www\./, '')} ↗ opens in a new tab`; } catch (e) {} }
      if (el.hash && el.pathname === location.pathname) return 'Jump to this section';
    }
    return el.getAttribute('aria-label') || '';
  };
  const content = (el: HTMLElement) => {
    const k = el.dataset.card; if (k && RICH[k]) return { rich: true, html: RICH[k]() };
    const m = el instanceof HTMLAnchorElement && el.pathname.match(/^\/writing\/([^/]+)\/?$/); if (m) return { rich: true, html: postCard(m[1]) };
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
