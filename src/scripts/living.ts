// Living titles: see components/LivingTitles.astro
import { T, RM, phaseNow, moonPath } from './site';
const list = document.querySelector('.livel') as HTMLElement;
if (list) {
  // tonight's moon in the o's of "moon"
  const p = Math.min(Math.max(phaseNow(), .001), .999);
  list.querySelectorAll('[data-moon]').forEach((m) => (m.innerHTML = `<svg viewBox="0 0 18 18"><circle cx="9" cy="9" r="7.5"/><path d="${moonPath(p, 7.5, 9)}"/></svg>`));

  const GUESS = ['summarize?', 'translate?', 'rewrite?', 'explain?', '…anything?'];
  const nextSola = () => {
    const k = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })), n = new Date(k); n.setHours(9, 17, 0, 0); if (n <= k) n.setDate(n.getDate() + 1);
    const m = Math.round((+n - +k) / 6e4); return `sola · 09:17 · next one in ${Math.floor(m / 60)}h ${m % 60}m`;
  };
  let bleedRaf = 0;
  const bleed = (el: HTMLElement, on: boolean) => {
    const d = document.getElementById('bleedD')!, from = +(d.getAttribute('scale') || 0), to = on ? 3.2 : 0, t0 = performance.now();
    cancelAnimationFrame(bleedRaf); if (RM()) return; if (on) el.style.filter = 'url(#bleed)';
    const step = (now: number) => { const k = Math.min(1, (now - t0) / T.reveal), e = 1 - Math.pow(1 - k, 3); d.setAttribute('scale', (from + (to - from) * e).toFixed(2)); if (k < 1) bleedRaf = requestAnimationFrame(step); else if (!on) el.style.filter = ''; };
    bleedRaf = requestAnimationFrame(step);
  };
  const conn = (el: HTMLElement) => { // the "has many" line between the two entities
    el.querySelector(':scope>.conn')?.remove();
    const r = el.getBoundingClientRect(), a = el.querySelector('[data-e=a]')!.getBoundingClientRect(), b = el.querySelector('[data-e=b]')!.getBoundingClientRect();
    const ax = a.left + a.width / 2 - r.left, ay = a.top - r.top - 5, bx = b.left + b.width / 2 - r.left, by = b.top - r.top - 5, top = Math.min(ay, by) - 22;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'conn'); svg.setAttribute('width', String(r.width)); svg.setAttribute('height', String(r.height)); svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<path d="M${ax} ${ay}C${ax} ${top},${bx} ${top},${bx} ${by}"/><text x="${(ax + bx) / 2}" y="${top + 4}" text-anchor="middle">has many</text>`; el.append(svg);
    const path = svg.querySelector('path')!; path.style.setProperty('--len', String(path.getTotalLength()));
  };
  const ENACT: Record<string, (el: any, on: boolean) => void> = {
    attention(el, on) {
      const lt = el.querySelector('.lt'), ws = [...lt.querySelectorAll('.w')]; clearInterval(el._t); lt.classList.toggle('sweep', on && !RM()); ws.forEach((w) => w.classList.remove('lit'));
      if (!on || RM()) return; let i = 0; const tick = () => { ws.forEach((w, k) => w.classList.toggle('lit', k === i || k === i + 1)); i = (i + 1) % (ws.length + 1); }; tick(); el._t = setInterval(tick, 420);
    },
    sparkle(el, on) {
      const g = el.querySelector('.guess'); el.querySelector('.lspk').classList.toggle('loop', on); clearInterval(el._t); if (!on) return;
      let i = 0; g.textContent = GUESS[0]; if (!RM()) el._t = setInterval(() => (g.textContent = GUESS[(i = (i + 1) % GUESS.length)]), 800);
    },
    'data-model'(el, on) { el.querySelector(':scope>.conn')?.remove(); if (on) conn(el); },
    chemistry(el, on) {
      if (!on || RM()) return; const cs = [...el.querySelectorAll('.ch')] as HTMLElement[];
      cs.forEach((c) => { c.style.transition = 'none'; c.style.translate = `${(Math.random() - .5) * 1.1}em ${(Math.random() - .5) * 1.2}em`; c.style.opacity = '.35'; }); void el.offsetWidth;
      cs.forEach((c, i) => { c.style.transition = `translate var(--t-reveal) var(--ease-out) ${i * 40}ms,opacity var(--t-reveal) var(--ease-out) ${i * 40}ms`; c.style.translate = '0 0'; c.style.opacity = '1'; });
    },
    sola(el, on) { if (on) el.querySelector('.bub').textContent = nextSola(); },
    'this-site'(el, on) { bleed(el.querySelector('.lt'), on); },
  };

  // one row performs at a time
  let cur: any = null;
  const set = (li: any) => {
    if (cur === li) return;
    if (cur) { cur.classList.remove('on'); ENACT[cur.dataset.s]?.(cur, false); }
    cur = li; list.classList.toggle('has', !!li);
    if (li) { li.classList.add('on'); ENACT[li.dataset.s]?.(li, true); }
  };
  // while a row opens, the rows below slide: wait for it to settle, then take whatever is under the pointer
  let lock = 0, px = 0, py = 0;
  const under = () => { const li = document.elementFromPoint(px, py)?.closest('.livel>li'); if (li) set(li); };
  const go = (li: any) => { if (performance.now() < lock) return; set(li); lock = performance.now() + T.move + 60; setTimeout(() => { if (list.matches(':hover')) under(); }, T.move + 80); };
  (list.querySelectorAll(':scope>li') as NodeListOf<any>).forEach((li) => {
    li.addEventListener('pointermove', (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; px = e.clientX; py = e.clientY; if (!li.classList.contains('on')) go(li); });
    li.addEventListener('pointerdown', (e: PointerEvent) => (li._pt = e.pointerType));
    li.addEventListener('focusin', () => { if (!li._pt || li._pt === 'mouse') set(li); });
    li.querySelector('a').addEventListener('click', (e: Event) => { const t = li._pt && li._pt !== 'mouse'; li._pt = null; if (t && !li.classList.contains('on')) { e.preventDefault(); set(li); } });
  });
  list.addEventListener('pointerleave', (e) => { if ((e as PointerEvent).pointerType === 'mouse') set(null); });
}
