// End-to-end checks for the site, both languages (2026-10-26). Run via the bot's offload job (CI): build with a
// throwaway preview key (PREVIEW_HASH = sha256('testkey')), serve dist/ on :4321, then: H=<that hash> node tests/e2e.mjs
// (needs puppeteer-core and Chrome at /usr/bin/google-chrome). See tests/run.sh.
import puppeteer from 'puppeteer-core';
const B = 'http://localhost:4321', H = process.env.H;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--font-render-hinting=none'], headless: 'new' });
let fails = 0;
const ok = (name, cond, extra = '') => { if (!cond) fails++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); };
const errors = []; let phase = '';
async function mk({ w = 1440, h = 900, mobile = false, theme = null, reduced = false, key = true, intro = false } = {}) {
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  if (reduced) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  p.on('pageerror', (e) => errors.push(`[${w}] {${phase}} pageerror ${p.url()}: ${e.message} ${(e.stack||'').split('\n').slice(0,4).join(' / ')}`));
  p.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g|cloudflareinsights|ERR_FAILED/.test(m.text())) errors.push(`[${w}] console ${p.url()}: ${m.text()}`); });
  p.on('requestfailed', (r) => { if (!/fonts\.g|cloudflareinsights|googletagmanager/.test(r.url())) if (r.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(`[${w}] reqfail ${r.url()} ${r.failure()?.errorText}`); });
  await p.evaluateOnNewDocument(({ H, theme, key, intro }) => {
    if (key) localStorage.setItem('sp-preview', H);
    if (theme && !sessionStorage.getItem('__t')) { localStorage.setItem('theme', theme); sessionStorage.setItem('__t', '1'); }
    if (!intro) sessionStorage.setItem('sp-intro', '1');
  }, { H, theme, key, intro });
  return p;
}
const EN = ['/', '/work/baze/', '/writing/the-sheet/', '/writing/palette/', '/writing/attention/', '/writing/sparkle/', '/writing/data-model/', '/writing/chemistry/', '/writing/sola/', '/writing/this-site/'];
const KO = EN.map((p) => '/ko' + p);
const PAGES = [...EN, ...KO, '/404.html'];
const audit = () => {
  const W = document.documentElement.clientWidth, out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('.sr-only,svg,.grain,.card,.loader,[hidden]')) continue;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    if (!r.width || cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    if (cs.position === 'fixed' && el.classList.contains('grain')) continue;
    if (r.right > W + 1 || r.left < -1) {
      // skip things inside a horizontally scrolling box
      let a = el.parentElement, scroller = false; while (a) { const o = getComputedStyle(a).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') { scroller = true; break; } a = a.parentElement; }
      if (!scroller) out.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} [${Math.round(r.left)},${Math.round(r.right)}] "${(el.textContent || '').trim().slice(0, 30)}"`);
    }
  }
  return { sw: document.documentElement.scrollWidth, W, over: out.slice(0, 6), n: out.length };
};

// ── 1. every page, at four sizes, light + dark: overflow, errors, screenshots
for (const [w, h, mobile] of [[1440, 900, false], [1024, 768, false], [768, 1024, true], [390, 844, true]]) {
  for (const theme of ['light', 'dark']) {
    const p = await mk({ w, h, mobile, theme });
    for (const path of PAGES) {
      await p.goto(B + path, { waitUntil: 'networkidle0' }); await sleep(400);
      const a = await p.evaluate(audit);
      ok(`layout ${w} ${theme} ${path}: no horizontal overflow`, a.sw <= a.W + 1 && a.n === 0, `sw=${a.sw} W=${a.W} ${a.over.join(' | ')}`);
      if (theme === 'light' || w === 390) await p.screenshot({ path: `../out/shots/${w}-${theme}-${path.replace(/\W+/g, '_') || 'home'}.png`, fullPage: true });
      const vis = await p.evaluate(() => getComputedStyle(document.body).visibility);
      ok(`gate ${w} ${theme} ${path}: page visible with key`, vis === 'visible');
    }
    await p.close();
  }
}

// ── 2. content widths on phones (grids that keep their desktop columns squeeze text)
{
  const p = await mk({ w: 390, h: 844, mobile: true });
  for (const [path, sel] of [['/writing/attention/', '.post .dek'], ['/writing/attention/', '.post h1'], ['/work/baze/', '.cs .body p'], ['/writing/attention/', '.more .livel'], ['/', '.colophon p'], ['/', '.colophon .dm'], ['/work/baze/', '.summary']]) {
    await p.goto(B + path, { waitUntil: 'networkidle0' });
    const wd = await p.$eval(sel, (e) => Math.round(e.getBoundingClientRect().width));
    ok(`phone ${path} ${sel} uses the width`, wd >= 300, `width=${wd}`);
  }
  // rail bar on phones: sticky, shows the section, no email
  await p.goto(B + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.querySelector('#work').scrollIntoView({ behavior: 'instant' })); await sleep(500);
  const bar = await p.evaluate(() => { const r = document.querySelector('.rail').getBoundingClientRect(); return { top: Math.round(r.top), h: Math.round(r.height), txt: document.querySelector('#where').textContent }; });
  ok('phone: rail bar sticks to the top', bar.top === 0, JSON.stringify(bar));
  ok('phone: rail bar shows the section', /worked/.test(bar.txt), bar.txt);
  const hy = await p.evaluate(() => Math.round(document.querySelector('#work').getBoundingClientRect().top));
  ok('phone: #work heading not hidden under the bar', hy >= bar.h - 2, `heading top=${hy} bar=${bar.h}`);
  await p.close();
}

// ── 2b. mid widths: post text column
{
  const p = await mk({ w: 1024, h: 768 });
  await p.goto(B + '/writing/sola/', { waitUntil: 'networkidle0' });
  const wd = await p.$eval('.post .dek', (e) => Math.round(e.getBoundingClientRect().width));
  ok('1024: post text column is readable', wd >= 480, 'width=' + wd);
  await sleep(800);
  const op = await p.evaluate(() => [...document.querySelectorAll('#where .w')].map((w) => getComputedStyle(w).opacity + ' ' + w.className));
  ok('rail section line settles fully visible', op.length === 1 && op[0].startsWith('1 '), JSON.stringify(op));
  await p.close();
}

// ── 2c. no layout jump when the live time fills in
{
  const p = await mk();
  await p.evaluateOnNewDocument(() => { window.__cls = 0; new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true }); });
  await p.goto(B + '/', { waitUntil: 'networkidle0' }); await sleep(1500);
  const cls = await p.evaluate(() => window.__cls);
  ok('home: layout shift on load is tiny (CLS < 0.02)', cls < 0.02, 'CLS=' + cls.toFixed(4));
  ok('home: Seoul time filled', /\d/.test(await p.$eval('[data-seoul-now]', (e) => e.textContent)));
  await p.close();
}

// ── 3. styles that must apply
{
  const p = await mk();
  await p.goto(B + '/writing/sola/', { waitUntil: 'networkidle0' });
  const m = await p.$eval('.medium', (e) => getComputedStyle(e).paddingTop);
  ok('specimen frame (.medium) is styled', m === '22px', m);
  await p.close();
}

// ── 4. soft navigation: no reloads, state carried, scripts re-init, back/forward
{ phase = 'nav';
  const p = await mk(); let loads = 0; p.on('load', () => loads++);
  await p.goto(B + '/', { waitUntil: 'networkidle0' }); await sleep(500); loads = 0;
  await p.evaluate(() => (window.__m = 1));
  const alive = async () => (await p.evaluate(() => window.__m)) === 1;
  await p.evaluate(() => document.querySelector('table.index a[href="/work/baze/"]').click()); await sleep(900);
  ok('nav home→case', p.url().endsWith('/work/baze/') && await alive());
  await p.goBack(); await sleep(900);
  ok('browser Back → home, content matches', new URL(p.url()).pathname === '/' && !!(await p.$('.livel')) && await alive());
  await p.goForward(); await sleep(900);
  ok('browser Forward → case, content matches', !!(await p.$('.cs h1')) && await alive());
  await p.evaluate(() => document.querySelector('.cs .argued a').click()); await sleep(900);
  ok('case → linked piece', /\/writing\//.test(p.url()));
  // post → next post → "← Writing" must land on the writing list, not the previous post
  await p.evaluate(() => document.querySelector('.more .livel a').click()); await sleep(900);
  const before = p.url();
  await p.evaluate(() => document.querySelector('a.back').click()); await sleep(1200);
  ok('"← Writing" after post→post goes to /#writing', new URL(p.url()).pathname === '/' && p.url().endsWith('#writing'), `${before} → ${p.url()}`);
  // home → post → "← Writing" goes back and restores scroll
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await sleep(300);
  await p.mouse.move(700, 400); for (let i = 0; i < 4; i++) { await p.mouse.wheel({ deltaY: 120 }); await sleep(120); } await sleep(600);
  const y0 = await p.evaluate(() => scrollY);
  await p.evaluate(() => document.querySelector('.livel a').click()); await sleep(900);
  await p.mouse.move(40, 600);
  await p.evaluate(() => document.querySelector('a.back').click()); await sleep(1200);
  const y1 = await p.evaluate(() => scrollY);
  ok('"← Writing" after home→post restores scroll', new URL(p.url()).pathname === '/' && Math.abs(y1 - y0) < 60, `y0=${y0} y1=${y1}`);
  // in-post toc link: same-page hash
  await p.evaluate(() => document.querySelector('.livel a[href="/writing/attention/"]').click()); await sleep(900);
  await p.evaluate(() => document.querySelectorAll('#outline a')[1].click()); await sleep(1200);
  const tocY = await p.evaluate(() => Math.round(document.getElementById(decodeURIComponent(location.hash.slice(1))).getBoundingClientRect().top));
  ok('toc link scrolls to its heading', tocY >= 0 && tocY < 140, 'top=' + tocY);
  await sleep(500);
  ok('toc highlights the section you clicked', await p.evaluate(() => document.querySelectorAll('#outline a')[1].hasAttribute('aria-current')));
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await sleep(300);
  ok('contents: nothing marked before the first section', await p.evaluate(() => document.querySelectorAll('#outline a[aria-current]').length === 0));
  await p.evaluate(() => document.querySelectorAll('.prose h2[id]')[0].scrollIntoView({ behavior: 'instant' })); await sleep(400);
  ok('contents: scrolling to a section marks it (only it)', await p.evaluate(() => document.querySelectorAll('#outline a')[0].hasAttribute('aria-current') && document.querySelectorAll('#outline a[aria-current]').length === 1));
  ok('no full reloads during all of the above', loads === 0, 'loads=' + loads);
  // the case study rail line + 404 rail
  await p.close();
}

// ── 5. theme
{ phase = 'theme';
  const p = await mk({ theme: 'light' });
  await p.goto(B + '/', { waitUntil: 'networkidle0' });
  await p.click('#moon'); await sleep(800);
  const t = await p.evaluate(() => ({ t: document.documentElement.dataset.theme, bar: [...document.querySelectorAll('meta[name=theme-color]')].map((m) => m.content) }));
  ok('theme toggles to dark', t.t === 'dark');
  ok('browser bar colour follows the theme', t.bar.every((c) => c === '#12110f'), JSON.stringify(t.bar));
  await p.evaluate(() => document.querySelector('.livel a').click()); await sleep(900);
  const t2 = await p.evaluate(() => ({ t: document.documentElement.dataset.theme, bar: [...document.querySelectorAll('meta[name=theme-color]')].map((m) => m.content) }));
  ok('theme + bar colour survive navigation', t2.t === 'dark' && t2.bar.every((c) => c === '#12110f'), JSON.stringify(t2));
  await p.reload({ waitUntil: 'networkidle0' });
  ok('theme survives a reload', (await p.evaluate(() => document.documentElement.dataset.theme)) === 'dark');
  await p.close();
}

// ── 6. copy button, hover cards, keyboard
{ phase = 'cards';
  const p = await mk();
  const ctx = browser.defaultBrowserContext(); await ctx.overridePermissions(B, ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write']);
  await p.goto(B + '/', { waitUntil: 'networkidle0' }); await sleep(300);
  const btn = '.lede button.copy';
  const label = await p.$eval(btn, (e) => e.textContent);
  await p.click(btn); await sleep(200); await p.click(btn); await sleep(1800);
  ok('copy: label comes back after a double click', (await p.$eval(btn, (e) => e.textContent)) === label, await p.$eval(btn, (e) => e.textContent));
  // hover cards
  for (const sel of ['.lede a[data-card="mindlogic"]', '.lede a[data-card="baze"]', '.lede a[data-card="writing"]', 'table.index a[data-card="mongodb"]', 'table.index a[data-card="deloitte"]', '.rail .me', '#moon']) {
    await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center', behavior: 'instant' }), sel); await sleep(150);
    await p.mouse.move(2, 2); await sleep(400);
    await p.hover(sel); await sleep(700);
    const c = await p.evaluate(() => { const c = document.querySelector('#card'); const r = c.getBoundingClientRect(); return { on: c.classList.contains('on'), t: c.textContent.trim().slice(0, 50), inView: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight }; });
    ok(`card on ${sel}`, c.on && c.t.length > 3 && c.inView, JSON.stringify(c));
  }
  await p.mouse.move(2, 2); await sleep(500);
  ok('card closes when the pointer leaves', !(await p.evaluate(() => document.querySelector('#card').classList.contains('on'))));
  // move from link into a rich card and click inside it (writing list)
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await sleep(200);
  await p.hover('.lede a[data-card="writing"]'); await sleep(700);
  const cr = await p.evaluate(() => { const a = document.querySelector('#card .cl a'); const r = a.getBoundingClientRect(); return [r.x + 5, r.y + r.height / 2]; });
  await p.mouse.move(cr[0], cr[1], { steps: 8 }); await sleep(300);
  ok('rich card stays open while you move into it', await p.evaluate(() => document.querySelector('#card').classList.contains('on')));
  await p.mouse.click(cr[0], cr[1]); await sleep(1000);
  ok('clicking a piece in the card opens it', /\/writing\//.test(p.url()), p.url());
  // keyboard: tab order shows focus and the note card; Escape closes
  await p.goto(B + '/', { waitUntil: 'networkidle0' }); await sleep(300);
  const seen = [];
  for (let i = 0; i < 14; i++) {
    await p.keyboard.press('Tab'); await sleep(120);
    seen.push(await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return `${a.tagName}${a.id ? '#' + a.id : ''}:${(a.textContent || '').trim().slice(0, 14)}:${cs.outlineStyle !== 'none' ? 'ring' : 'NORING'}`; }));
  }
  ok('keyboard: every stop shows a focus ring', seen.every((s) => s.endsWith('ring') && !s.endsWith('NORING')), seen.join(' > '));
  await p.keyboard.press('Escape'); await sleep(200);
  ok('Escape closes the card', !(await p.evaluate(() => document.querySelector('#card').classList.contains('on'))));
  // keyboard on living titles: focusing a row opens it; Enter opens the piece
  const f = await p.evaluate(() => { const a = document.querySelector('.livel a'); a.focus(); return true; }); await sleep(400);
  ok('keyboard: focused row opens', await p.evaluate(() => document.querySelector('.livel li').classList.contains('on')));
  await p.keyboard.press('Enter'); await sleep(1000);
  ok('keyboard: Enter on a row opens the piece', /\/writing\//.test(p.url()), p.url());
  await p.close();
}

// ── 7. touch: first tap opens the row, second opens the piece; no hover card on touch
{ phase = 'touch';
  const p = await mk({ w: 390, h: 844, mobile: true });
  await p.goto(B + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.querySelector('.livel').scrollIntoView({ behavior: 'instant' })); await sleep(300);
  const box = await (await p.$('.livel li:nth-child(2) a')).boundingBox();
  await p.touchscreen.tap(box.x + 30, box.y + 20); await sleep(600);
  ok('touch: first tap opens the row', (await p.evaluate(() => document.querySelector('.livel li:nth-child(2)').classList.contains('on'))) && new URL(p.url()).pathname === '/', p.url());
  ok('touch: no hover card', !(await p.evaluate(() => document.querySelector('#card')?.classList.contains('on'))));
  const box2 = await (await p.$('.livel li:nth-child(2) a')).boundingBox();
  await p.touchscreen.tap(box2.x + 30, box2.y + 20); await sleep(1000);
  ok('touch: second tap opens the piece', /\/writing\//.test(p.url()), p.url());
  // the sparkle specimen on a phone
  await p.goto(B + '/writing/sparkle/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.querySelector('.doors').scrollIntoView({ block: 'center', behavior: 'instant' })); await sleep(300);
  const sb = await (await p.$('.doors .spk')).boundingBox(); await p.touchscreen.tap(sb.x + 10, sb.y + 10); await sleep(1700);
  ok('touch: sparkle opens its popover + hint', await p.evaluate(() => !document.querySelector('.doors .pop').hidden && !!document.querySelector('.doors .hint')));
  await p.close();
}

// ── 8. the Baze mock by hand + replay; the other specimens
{ phase = 'mock';
  const p = await mk();
  await p.goto(B + '/work/baze/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.querySelector('.mock').scrollIntoView({ block: 'center', behavior: 'instant' })); await sleep(7500);
  const y = await p.evaluate(() => scrollY);
  await p.click('.mock .mbtn'); await sleep(200);
  ok('mock: model menu opens by hand', await p.evaluate(() => !document.querySelector('.mmenu').hidden));
  await p.evaluate(() => document.querySelectorAll('.mmenu button')[2].click()); await sleep(200);
  const pick = await p.evaluate(() => ({ btn: document.querySelector('.mbtn').textContent, who: document.querySelector('.mock .who').textContent, open: !document.querySelector('.mmenu').hidden }));
  ok('mock: picking a model updates the button + reply and closes', pick.btn.startsWith(pick.who) && !pick.open, JSON.stringify(pick));
  await p.click('.mock .mbtn'); await sleep(200); await p.keyboard.press('Escape'); await sleep(200);
  ok('mock: Escape closes the model menu', await p.evaluate(() => document.querySelector('.mmenu').hidden));
  await p.click('.mock .mbtn'); await sleep(200); await p.mouse.click(5, 450); await sleep(200);
  ok('mock: clicking outside closes the model menu', await p.evaluate(() => document.querySelector('.mmenu').hidden));
  await p.click('.mock .replay'); await sleep(300); await p.click('.mock .replay'); await sleep(6500);
  ok('mock: double Replay ends cleanly on Baze', (await p.$eval('.mock .mname', (e) => e.textContent)) === 'Baze', await p.$eval('.mock .mname', (e) => JSON.stringify(e.textContent)));
  ok('mock: page did not scroll by itself', Math.abs((await p.evaluate(() => scrollY)) - y) < 5);
  // sola day replay
  await p.goto(B + '/writing/sola/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.querySelector('.medium.agent').scrollIntoView({ block: 'center', behavior: 'instant' })); await sleep(6000);
  const n = await p.$$eval('.log li', (l) => l.length), on = await p.$$eval('.log li.on', (l) => l.length);
  ok('sola day plays to the end', on === n, `${on}/${n}`);
  await p.click('.medium.agent .replay'); await sleep(300);
  ok('sola replay restarts', (await p.$$eval('.log li.on', (l) => l.length)) < n);
  // system specimen run
  await p.goto(B + '/writing/this-site/', { waitUntil: 'networkidle0' });
  await p.click('.system .run'); await sleep(600);
  ok('system: Run moves the dots', await p.evaluate(() => document.querySelector('.tracks').classList.contains('go')));
  // sparkle reset mid-typing
  await p.goto(B + '/writing/sparkle/', { waitUntil: 'networkidle0' });
  await p.click('.doors .txt'); await sleep(300); await p.click('.doors .sp-reset'); await sleep(2500);
  ok('sparkle: Reset mid-typing really resets', await p.evaluate(() => document.querySelector('.doors .out').textContent === '' && !document.querySelector('.doors .txt').disabled));
  await p.close();
}

// ── 9. reduced motion: no intro, things still work
{ phase = 'reduced';
  const p = await mk({ reduced: true, intro: true });
  await p.goto(B + '/?intro=0', { waitUntil: 'networkidle0' }); await sleep(300);
  await p.goto(B + '/', { waitUntil: 'networkidle0' }); await sleep(300);
  ok('reduced motion: no moonrise', !(await p.evaluate(() => document.documentElement.classList.contains('intro'))));
  await p.evaluate(() => document.querySelector('table.index a[href="/work/baze/"]').click()); await sleep(600);
  ok('reduced motion: navigation works', p.url().endsWith('/work/baze/'));
  await p.evaluate(() => document.querySelector('.mock').scrollIntoView({ block: 'center', behavior: 'instant' })); await sleep(800);
  ok('reduced motion: Baze mock jumps to the end state', (await p.$eval('.mock .mname', (e) => e.textContent)) === 'Baze');
  await p.close();
}

// ── 10. moonrise: first visit, then skip by clicking, then later pages don't replay
{ phase = 'moonrise';
  const p = await mk({ intro: true });
  await p.goto(B + '/', { waitUntil: 'domcontentloaded' }); await sleep(200);
  ok('moonrise runs on a first visit', await p.evaluate(() => document.documentElement.classList.contains('intro')));
  await sleep(3500);
  const st = await p.evaluate(() => ({ cls: document.documentElement.className, vis: getComputedStyle(document.querySelector('.lede>p')).opacity, moon: getComputedStyle(document.querySelector('#moon')).opacity }));
  ok('moonrise finishes: page + rail moon visible', !/intro/.test(st.cls) && st.vis === '1' && st.moon === '1', JSON.stringify(st));
  await p.goto(B + '/work/baze/', { waitUntil: 'domcontentloaded' }); await sleep(150);
  ok('moonrise only once per visit', !(await p.evaluate(() => document.documentElement.classList.contains('intro'))));
  const p2 = await mk({ intro: true });
  await p2.goto(B + '/', { waitUntil: 'domcontentloaded' }); await sleep(300);
  const lk = await p2.evaluate(() => { const r = document.querySelector('.lede a[href="#writing"]').getBoundingClientRect(); return [r.x + 5, r.y + 5]; });
  await p2.mouse.click(lk[0], lk[1]); await sleep(500);
  const s2 = await p2.evaluate(() => ({ cls: document.documentElement.className, vis: getComputedStyle(document.querySelector('.lede>p')).opacity, url: location.href, y: scrollY }));
  ok('moonrise: a click skips straight to the page', !/intro/.test(s2.cls) && s2.vis === '1', JSON.stringify(s2));
  ok('moonrise: the skipping click does not also press the invisible link under it', !s2.url.includes('#') && s2.y === 0, JSON.stringify(s2));
  await p.close(); await p2.close();
}

// ── 11. the gate
{ phase = 'gate';
  const ctx2 = await browser.createBrowserContext(); const p = await ctx2.newPage(); await p.setViewport({ width: 1440, height: 900 });
  await p.evaluateOnNewDocument(() => sessionStorage.setItem('sp-intro', '1'));
  await p.goto(B + '/').catch(() => {}); await sleep(1500);
  ok('gate: no key → under construction', (await p.evaluate(() => location.href)).endsWith('/under-construction/'), p.url());
  await p.goto(B + '/work/baze/?preview=wrong', { waitUntil: 'networkidle0' }); await sleep(500);
  ok('gate: wrong key → under construction', p.url().endsWith('/under-construction/'), p.url());
  await p.goto(B + '/work/baze/?preview=testkey#x', { waitUntil: 'networkidle0' }); await sleep(600);
  ok('gate: right key opens the page and cleans the URL', p.url().endsWith('/work/baze/#x') && (await p.evaluate(() => getComputedStyle(document.body).visibility)) === 'visible', p.url());
  await p.evaluate(() => document.querySelector('.csnav a').click()); await sleep(900);
  await p.goBack(); await sleep(1000);
  ok('gate: Back to the first page (after the key) still swaps the content', !!(await p.$('.cs h1')) && p.url().includes('/work/baze/'), p.url());
  await p.goto(B + '/', { waitUntil: 'networkidle0' }); await sleep(300);
  ok('gate: key remembered', new URL(p.url()).pathname === '/');
  await p.goto(B + '/?preview=off', { waitUntil: 'networkidle0' }); await sleep(300);
  ok('gate: ?preview=off forgets', p.url().endsWith('/under-construction/'));
  await p.close();
}

// ── 12. links, endpoints, metadata
{ phase = 'links';
  const p = await mk();
  const hrefs = new Set();
  for (const path of PAGES) { await p.goto(B + path, { waitUntil: 'networkidle0' }); (await p.$$eval('a[href]', (as) => as.map((a) => a.href))).forEach((h) => hrefs.add(h)); }
  const bad = [];
  for (const h of hrefs) { const u = new URL(h); if (u.origin !== B) continue; const r = await fetch(u.origin + u.pathname); if (r.status !== 200) bad.push(`${u.pathname} ${r.status}`);
    if (u.hash) { const page = await (await fetch(u.origin + u.pathname)).text(); if (!page.includes(`id="${decodeURIComponent(u.hash.slice(1))}"`)) bad.push(`missing anchor ${u.pathname}${u.hash}`); } }
  ok('every internal link resolves (incl. #anchors)', bad.length === 0, bad.join(', '));
  const ext = [...hrefs].filter((h) => !h.startsWith(B) && !h.startsWith('mailto:'));
  console.log('external links: ' + ext.join(' '));
  for (const ep of ['/robots.txt', '/sitemap.xml', '/rss.xml', '/llms.txt', '/llms-full.txt', '/og.png', '/favicon.svg']) {
    const r = await fetch(B + ep); ok(`endpoint ${ep}`, r.status === 200, String(r.status));
  }
  for (const ep of ['/sitemap.xml', '/rss.xml']) {
    const x = await (await fetch(B + ep)).text();
    const okXml = await p.evaluate((x) => !new DOMParser().parseFromString(x, 'application/xml').querySelector('parsererror'), x);
    ok(`${ep} is well-formed XML`, okXml);
  }
  for (const path of [...EN, ...KO]) {
    await p.goto(B + path, { waitUntil: 'networkidle0' });
    const m = await p.evaluate(() => ({ t: document.title, d: document.querySelector('meta[name=description]')?.content, c: document.querySelector('link[rel=canonical]')?.href, h1: document.querySelectorAll('h1').length, ld: [...document.querySelectorAll('script[type="application/ld+json"]')].every((s) => { try { JSON.parse(s.textContent); return true; } catch { return false; } }), ids: (() => { const ids = [...document.querySelectorAll('[id]')].map((e) => e.id); return ids.filter((x, i) => ids.indexOf(x) !== i); })() }));
    ok(`meta ${path}: title, description, canonical, one h1, valid JSON-LD, unique ids`, m.t && m.d && m.c && m.h1 === 1 && m.ld && m.ids.length === 0, JSON.stringify(m));
  }
  // after soft nav, head matches the new page
  await p.goto(B + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.querySelector('.livel a[href="/writing/sola/"]').click()); await sleep(900);
  const hm = await p.evaluate(() => ({ t: document.title, c: document.querySelector('link[rel=canonical]')?.href, ld: document.querySelectorAll('script[type="application/ld+json"]').length, desc: document.querySelector('meta[name=description]').content }));
  ok('soft nav swaps title/canonical/JSON-LD', /chief-of-staff|sola/i.test(hm.t) && hm.c.endsWith('/writing/sola/') && hm.ld === 1, JSON.stringify(hm));
  await p.close();
}

// ── 13. 한국어: the /ko/ pages, the 한/EN switch, staying in your language, landing on the same spot
{ phase = 'ko';
  const p = await mk();
  for (const path of KO) {
    await p.goto(B + path, { waitUntil: 'networkidle0' });
    const m = await p.evaluate(() => ({
      lang: document.documentElement.lang,
      alt: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => l.hreflang + ' ' + new URL(l.href).pathname),
      hangul: /[가-힣]/.test(document.querySelector('main').textContent),
      leak: [...document.querySelectorAll('a[href]')].filter((a) => a.origin === location.origin && !a.closest('.rail .lang') && a.pathname !== '/rss.xml' && !a.pathname.startsWith('/ko/')).map((a) => a.pathname),
      sw: document.querySelector('.rail .lang a')?.getAttribute('href'),
      font: document.fonts.check('500 20px "Noto Serif KR"', '가'),
    }));
    ok(`ko ${path}: lang=ko, Korean text, hreflang en+ko`, m.lang === 'ko' && m.hangul && m.alt.includes('ko ' + path) && m.alt.includes('en ' + path.slice(3)), JSON.stringify(m));
    ok(`ko ${path}: every internal link stays in Korean`, m.leak.length === 0, m.leak.join(' '));
    ok(`ko ${path}: EN goes to the same page in English`, m.sw === path.slice(3), m.sw);
    ok(`ko ${path}: Korean serif font loaded`, m.font);
  }
  // English pages point 한 at their Korean twin, and keep it current across soft navigation (the rail persists)
  await p.goto(B + '/', { waitUntil: 'networkidle0' });
  ok('en home: 한 → /ko/', (await p.$eval('.rail .lang a', (a) => a.getAttribute('href'))) === '/ko/');
  await p.evaluate(() => document.querySelector('.livel a[href="/writing/sola/"]').click()); await sleep(900);
  ok('after soft nav, 한 → the Korean twin of this page', (await p.$eval('.rail .lang a', (a) => a.getAttribute('href'))) === '/ko/writing/sola/');
  // switch mid-page: land on the same block, at about the same height
  await p.evaluate(() => document.querySelector('.medium.agent').scrollIntoView({ block: 'start', behavior: 'instant' })); await sleep(400);
  const before = await p.evaluate(() => Math.round(document.querySelector('.medium.agent').getBoundingClientRect().top));
  await Promise.all([p.waitForNavigation({ waitUntil: 'networkidle0' }), p.click('.rail .lang a')]); await sleep(900);
  const after = await p.evaluate(() => ({ path: location.pathname, lang: document.documentElement.lang, top: Math.round(document.querySelector('.medium.agent').getBoundingClientRect().top), intro: document.documentElement.classList.contains('intro') }));
  ok('한 switches to /ko/ (lang ko, no moonrise)', after.path === '/ko/writing/sola/' && after.lang === 'ko' && !after.intro, JSON.stringify(after));
  ok('switching keeps your place on the page', Math.abs(after.top - before) < 120, `before=${before} after=${after.top}`);
  // Korean pages navigate softly among themselves, cards and labels in Korean
  await p.evaluate(() => document.querySelector('a.back').click()); await sleep(1200);
  ok('ko: ← 글 goes to /ko/#writing', new URL(p.url()).pathname === '/ko/', p.url());
  await p.evaluate(() => document.querySelector('.lede a[data-card="writing"]').scrollIntoView({ block: 'center', behavior: 'instant' })); await sleep(200);
  await p.mouse.move(2, 2); await sleep(300); await p.hover('.lede a[data-card="writing"]'); await sleep(700);
  const card = await p.evaluate(() => ({ t: document.querySelector('#card').textContent, links: [...document.querySelectorAll('#card a')].map((a) => a.pathname) }));
  ok('ko: hover card is Korean and links stay in Korean', /[가-힣]/.test(card.t) && card.links.length > 0 && card.links.every((l) => l.startsWith('/ko/')), JSON.stringify(card));
  ok('ko: footer clock in Korean', /서울/.test(await p.$eval('#clock', (e) => e.textContent)));
  await Promise.all([p.waitForNavigation({ waitUntil: 'networkidle0' }), p.click('.rail .lang a')]);
  ok('EN switches back to English', new URL(p.url()).pathname === '/' && (await p.evaluate(() => document.documentElement.lang)) === 'en', p.url());
  // phones: the switch sits in the top bar and is tappable
  const ph = await mk({ w: 390, h: 844, mobile: true });
  await ph.goto(B + '/ko/', { waitUntil: 'networkidle0' });
  const bx = await ph.evaluate(() => { const r = document.querySelector('.rail .lang').getBoundingClientRect(); return { x: r.left, r: r.right, y: r.top, h: r.height }; });
  ok('phone: 한/EN visible in the bar', bx.r <= 390 && bx.y >= 0 && bx.y < 80 && bx.h > 0, JSON.stringify(bx));
  await ph.close(); await p.close();
}

// ── greeting POC: the first sentence follows ?for=, ?src= or the referrer, and remembers it for the session.
// Referers are http:// because Chrome sends none on an https → http://localhost step down.
{
  phase = 'greeting';
  const G = () => document.querySelector('[data-greet]').textContent;
  const greet = async (p, url, opts = {}) => { await p.goto(B + url, { waitUntil: 'networkidle0', ...opts }); return p.evaluate(() => ({ g: document.querySelector('[data-greet]').textContent, url: location.pathname + location.search, tag: !!document.querySelector('.lede b') })); };
  const cases = [
    ['/', {}, "Hi, I'm Sean."],
    ['/?for=stripe', {}, "Hi, Stripe team. I'm Sean."],
    ['/?for=open-ai', {}, "Hi, Open Ai team. I'm Sean."],
    ['/?for=McKinsey%20%26%20Co', {}, "Hi, McKinsey & Co team. I'm Sean."],
    ['/?for=%3Cb%3Ex%3C%2Fb%3E', {}, "Hi, Bxb team. I'm Sean."],
    ['/?src=github', {}, "Hi, and welcome over from GitHub. I'm Sean."],
    ['/?src=bogus', {}, "Hi, I'm Sean."],
    ['/', { referer: 'http://www.linkedin.com/' }, "Hi, and welcome over from LinkedIn. I'm Sean."],
    ['/', { referer: 'http://app.greenhouse.io/people/1' }, "Hi, thanks for reading past the résumé. I'm Sean."],
    ['/', { referer: 'http://www.google.com/' }, "Hi, I'm Sean."],
    ['/ko/?for=토스', {}, '토스 팀 여러분, 안녕하세요. 박상현이에요.'],
    ['/ko/', {}, '안녕하세요, 박상현이에요.'],
  ];
  for (const [url, opts, want] of cases) {
    const p = await mk(); const r = await greet(p, url, opts);
    ok(`greeting ${url} ${opts.referer || ''}`, r.g === want && !/[?&](for|src)=/.test(r.url) && !r.tag, JSON.stringify(r));
    await p.close();
  }
  const p = await mk();
  await greet(p, '/?for=stripe&intro=0#work');
  ok('greeting: other params and hash survive', await p.evaluate(() => location.search === '?intro=0' && location.hash === '#work'));
  const again = await greet(p, '/');
  ok('greeting: kept for the session', again.g === "Hi, Stripe team. I'm Sean.", JSON.stringify(again));
  await p.evaluate(() => document.querySelector('.livel a[href="/writing/sola/"]').click()); await sleep(900);
  await p.evaluate(() => document.querySelector('.rail .me').click()); await sleep(900);
  ok('greeting: survives soft nav back home', (await p.evaluate(G)) === "Hi, Stripe team. I'm Sean.", await p.evaluate(G));
  await p.goto(B + '/writing/sola/?for=figma', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.querySelector('.rail .me').click()); await sleep(900);
  ok('greeting: a ?for= on a post page carries to home', (await p.evaluate(G)) === "Hi, Figma team. I'm Sean." && !(await p.evaluate(() => location.search)), await p.evaluate(G));
  const re = await greet(p, '/?for=notion');
  ok('greeting: a new ?for= replaces the old one', re.g === "Hi, Notion team. I'm Sean.", JSON.stringify(re));
  await p.screenshot({ path: '../out/shots/greeting-1440.png' });
  await p.close();
  const m = await mk({ w: 390, h: 844, mobile: true }); await greet(m, '/?for=mckinsey-and-company');
  await m.screenshot({ path: '../out/shots/greeting-390.png' }); const a = await m.evaluate(audit);
  ok('greeting 390: long company name, no overflow', a.sw <= a.W + 1 && a.n === 0, a.over.join(' | ')); await m.close();
}

// ── 15. real Baze screens, the About photo frame, the case study's alignment, tonight's moon, share cards per piece
{ phase = 'screens';
  for (const lang of ['', '/ko']) {
    const p = await mk();
    await p.goto(B + lang + '/', { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.querySelector('.proj .shot img').scrollIntoView({ block: 'center', behavior: 'instant' })); await sleep(700);
    const home = await p.evaluate(() => { const i = document.querySelector('.proj .shot img'); return { w: i.naturalWidth, alt: i.alt.length, href: i.closest('a').pathname, mock: !!document.querySelector('.proj .mock') }; });
    ok(`screens ${lang || '/'}: home shows the real model picker, linked to the case study`, home.w > 1000 && home.alt > 20 && home.href.endsWith('/work/baze/') && !home.mock, JSON.stringify(home));
    const ph = await p.evaluate(() => { const f = document.querySelector('.about .portrait'), t = document.querySelector('.about .aboutin > div p'); const r = f.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), side: f.getBoundingClientRect().right < t.getBoundingClientRect().left, label: f.querySelector('[role=img]')?.getAttribute('aria-label') }; });
    ok(`screens ${lang || '/'}: About has a 4:5 photo frame beside the words`, ph.w === 152 && Math.abs(ph.h - 190) <= 1 && ph.side && !!ph.label, JSON.stringify(ph));
    await p.goto(B + lang + '/work/baze/', { waitUntil: 'networkidle0' });
    const cs = await p.evaluate(async () => {
      const imgs = [...document.querySelectorAll('.cs .shot img')];
      for (const i of imgs) { i.scrollIntoView({ block: 'center', behavior: 'instant' }); await new Promise((r) => setTimeout(r, 250)); }
      const L = (s) => Math.round(document.querySelector(s).getBoundingClientRect().left);
      return { n: imgs.length, loaded: imgs.every((i) => i.complete && i.naturalWidth > 0), srcs: imgs.map((i) => i.getAttribute('src')), h1: L('.cs h1'), dek: L('.cs .dek'), tldr: L('.cs .tldr'), h2: L('.cs .body h2'), p: L('.cs .body p:not(.tldr)'), fig: L('.cs .body .fig') };
    });
    ok(`screens ${lang || '/'}: the case study has 4 real screens, all loaded, in its language`, cs.n === 4 && cs.loaded && cs.srcs.filter((s) => /-(en|ko)\.webp$/.test(s)).every((s) => s.endsWith((lang ? 'ko' : 'en') + '.webp')), JSON.stringify(cs));
    ok(`screens ${lang || '/'}: case study body lines up with the title`, [cs.dek, cs.tldr, cs.h2, cs.p, cs.fig].every((x) => Math.abs(x - cs.h1) <= 2), JSON.stringify(cs));
    await p.close();
  }
  // the footer's moon: the lit side is the light colour in both themes
  for (const theme of ['light', 'dark']) {
    const p = await mk({ theme });
    await p.goto(B + '/', { waitUntil: 'networkidle0' });
    const m = await p.evaluate(() => { const c = document.querySelector('#dmoon circle'), pth = document.querySelector('#dmoon path'); const lum = (s) => { const [r, g, b] = s.match(/\d+/g).map(Number); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }; return { lit: getComputedStyle(pth).fill, dark: getComputedStyle(c).fill, brighter: lum(getComputedStyle(pth).fill) > lum(getComputedStyle(c).fill) }; });
    ok(`moon ${theme}: footer moon's lit side is brighter than its dark side`, m.brighter, JSON.stringify(m));
    await p.close();
  }
  // every piece has its own share card, in its language, and the file is there
  const p = await mk();
  for (const path of [...EN, ...KO].filter((x) => x.includes('/writing/'))) {
    await p.goto(B + path, { waitUntil: 'networkidle0' });
    const og = await p.evaluate(() => ({ img: document.querySelector('meta[property="og:image"]').content, tw: document.querySelector('meta[name="twitter:image"]').content, alt: document.querySelector('meta[property="og:image:alt"]').content, ld: JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'].find((n) => n['@type'] === 'BlogPosting')?.image }));
    const slug = path.split('/').filter(Boolean).pop(), want = `/og/${path.startsWith('/ko/') ? 'ko/' : ''}${slug}.jpg`;
    const r = await fetch(B + want), bytes = r.ok ? (await r.arrayBuffer()).byteLength : 0;
    ok(`share card ${path}: its own image, file present`, new URL(og.img).pathname === want && og.tw === og.img && og.ld === og.img && og.alt.length > 10 && r.status === 200 && /jpeg/.test(r.headers.get('content-type') || '') && bytes > 10000, JSON.stringify({ ...og, status: r.status, bytes }));
  }
  await p.goto(B + '/', { waitUntil: 'networkidle0' });
  ok('share card: home keeps the site card', (await p.evaluate(() => document.querySelector('meta[property="og:image"]').content)).endsWith('/og.png'));
  await p.close();
  for (const [w, h, mobile] of [[1440, 900, false], [390, 844, true]]) {
    const s = await mk({ w, h, mobile });
    await s.goto(B + '/work/baze/', { waitUntil: 'networkidle0' });
    await s.evaluate(async () => { for (const i of document.querySelectorAll('.cs .shot img')) { i.scrollIntoView({ block: 'center', behavior: 'instant' }); await new Promise((r) => setTimeout(r, 200)); } scrollTo(0, 0); }); await sleep(400);
    const a = await s.evaluate(audit); ok(`screens ${w}: case study has no overflow`, a.sw <= a.W + 1 && a.n === 0, a.over.join(' | '));
    await s.close();
  }
}

ok('no JS errors anywhere', errors.length === 0, [...new Set(errors)].slice(0, 15).join('\n   '));
console.log(`\n${fails} failing`);
await browser.close();
