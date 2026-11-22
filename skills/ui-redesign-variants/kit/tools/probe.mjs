// Measure prototypes at a real, smaller viewport: the red team's numbers.
//   node tools/probe.mjs [--sizes 1280x800] <file[#state]> ...
// Per page: where the [data-primary] module starts and how much of the
// viewport it gets, clipped text (with samples), horizontal overflow,
// filled buttons (heuristic), hit targets under 24px, Hangul text without
// word-break: keep-all, and page errors. Writes out/probe.json and prints
// one line per page.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
let sizes = ['1280x800'];
const targets = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--sizes') sizes = args[++i].split(',');
  else targets.push(args[i]);
}

function measure() {
  const vh = innerHeight;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
  };
  const primary = document.querySelector('[data-primary]');
  const pr = primary?.getBoundingClientRect();
  const clipped = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || !el.childNodes.length) continue;
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!ownText) continue;
    const s = getComputedStyle(el);
    const hides = s.overflow !== 'visible' || s.textOverflow === 'ellipsis' || s.webkitLineClamp !== 'none';
    if (hides && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 2)) {
      clipped.push(el.textContent.trim().slice(0, 40));
    }
  }
  const lum = (c) => {
    const m = c.match(/[\d.]+/g);
    if (!m || (m[3] !== undefined && +m[3] < 0.5)) return null;
    const [r, g, b] = m.map(Number);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  };
  const bodyLum = lum(getComputedStyle(document.body).backgroundColor) ?? 1;
  const controls = [...document.querySelectorAll('button, a[role=button], a.btn, [role=button], input[type=submit]')]
    .filter(visible)
    .filter((el) => !el.closest('[data-chrome]'));
  const filled = controls.filter((el) => {
    const l = lum(getComputedStyle(el).backgroundColor);
    return l !== null && Math.abs(l - bodyLum) > 0.35;
  });
  const small = [...document.querySelectorAll('button, a, input, select, [role=button]')]
    .filter(visible)
    .filter((el) => !el.closest('[data-chrome]'))
    .filter((el) => el.getBoundingClientRect().height < 24 && el.getBoundingClientRect().width < 24);
  const hangul = /[가-힣]/.test(document.body.innerText);
  return {
    primaryTop: pr ? Math.round(pr.top) : null,
    primaryVisiblePct: pr ? Math.round((100 * Math.max(0, Math.min(pr.bottom, vh) - Math.max(pr.top, 0))) / vh) : null,
    clipped: clipped.length,
    clippedSamples: clipped.slice(0, 5),
    hOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    filledButtons: filled.length,
    smallTargets: small.length,
    koreanBreakRisk: hangul && getComputedStyle(document.body).wordBreak !== 'keep-all',
  };
}

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch()); // installed Chrome, else Playwright's Chromium
const results = [];
for (const size of sizes) {
  const [width, height] = size.split('x').map(Number);
  const ctx = await browser.newContext({ viewport: { width, height } });
  for (const target of targets) {
    const [file, state] = target.split('#');
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const url = pathToFileURL(resolve(file)).href + '?shot=1' + (state ? `&state=${encodeURIComponent(state)}` : '');
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const m = { file: target, size, ...(await page.evaluate(measure)), errors };
    results.push(m);
    const flags = [
      m.primaryTop === null ? 'NO data-primary' : `primary@${m.primaryTop}px (${m.primaryVisiblePct}% of viewport)`,
      m.clipped ? `clipped ${m.clipped}: ${m.clippedSamples.join(' / ')}` : '',
      m.hOverflow ? 'H-OVERFLOW' : '',
      m.filledButtons !== 1 ? `filled buttons ${m.filledButtons}` : '',
      m.smallTargets ? `small targets ${m.smallTargets}` : '',
      m.koreanBreakRisk ? 'Korean without keep-all' : '',
      errors.length ? `ERRORS ${errors.join(' | ')}` : '',
    ].filter(Boolean);
    console.log(`${size} ${target}: ${flags.join(' · ')}`);
    await page.close();
  }
  await ctx.close();
}
mkdirSync('out', { recursive: true });
writeFileSync('out/probe.json', JSON.stringify(results, null, 2));
await browser.close();
