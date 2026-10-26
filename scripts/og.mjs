// Share cards for every piece, both languages: public/og/<slug>.jpg and public/og/ko/<slug>.jpg (1200×630).
// Each is a Chrome screenshot of scripts/og-post.html with the piece's title, dek and lens. Run it again whenever a
// title or dek changes, or a piece is added (tests/e2e.mjs fails if a piece has no card). Needs puppeteer-core and
// Chrome at /usr/bin/google-chrome, so run it on CI (the bot's offload job): node scripts/og.mjs
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tpl = fs.readFileSync(path.join(root, 'scripts/og-post.html'), 'utf8');
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const front = (file) => {
  const fm = fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const get = (k) => { const v = fm.match(new RegExp(`^${k}:\\s*(.*)$`, 'm'))?.[1]?.trim() ?? ''; return /^["'].*["']$/.test(v) ? v.slice(1, -1) : v; };
  return { title: get('title'), dek: get('dek'), lens: get('lens') };
};
const LANGS = {
  en: { dir: 'src/content/writing', out: 'public/og', name: 'Sean Park', tag: (l) => `Writing · ${l}` },
  ko: { dir: 'src/content/writing-ko', out: 'public/og/ko', name: '박상현', tag: (l) => `글 · ${l}` },
};

const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--font-render-hinting=none'] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
for (const [lang, L] of Object.entries(LANGS)) {
  fs.mkdirSync(path.join(root, L.out), { recursive: true });
  for (const f of fs.readdirSync(path.join(root, L.dir)).filter((f) => f.endsWith('.md'))) {
    const slug = f.replace(/\.md$/, ''), d = front(path.join(root, L.dir, f));
    const html = tpl.replaceAll('{{lang}}', lang).replaceAll('{{name}}', L.name).replaceAll('{{title}}', esc(d.title))
      .replaceAll('{{dek}}', esc(d.dek)).replaceAll('{{tag}}', esc(L.tag(d.lens)));
    await page.setContent(html, { waitUntil: 'load', timeout: 60000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      // a long title steps down until the title and dek fit above the footer
      const h = document.querySelector('h1'), dek = document.querySelector('p'), room = document.querySelector('.foot').offsetTop - 28;
      for (let s = 84; dek.getBoundingClientRect().bottom > room && s > 52; ) h.style.fontSize = (s -= 4) + 'px';
    });
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const out = path.join(root, L.out, slug + '.jpg');
    await page.screenshot({ path: out, type: 'jpeg', quality: 88 });
    console.log(out.replace(root + '/', ''), d.title);
  }
}
await browser.close();
