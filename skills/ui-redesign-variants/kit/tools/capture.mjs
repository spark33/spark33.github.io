// Capture live pages: the current app and the reference products.
//   node tools/capture.mjs refs.json            (default viewport 1920x1080)
// refs.json: [{ "name": "linear-issues", "url": "https://linear.app/...",
//               "viewport": "1440x900", "wait": 1500, "scroll": 0, "full": false }]
// Writes out/refs/<name>.png and out/capture.json. Each entry is flagged
// `suspect` when it looks like an error, bot wall or login page: Read those
// PNGs before using them, and drop the ones that really are.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const list = JSON.parse(readFileSync(process.argv[2] || 'refs.json', 'utf8'));
const WALL = /access denied|just a moment|attention required|captcha|verify you are human|page not found|404|log ?in|sign ?in|로그인/i;

mkdirSync('out/refs', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch()); // installed Chrome, else Playwright's Chromium
const results = [];
for (const ref of list) {
  const [width, height] = (ref.viewport || '1920x1080').split('x').map(Number);
  const ctx = await browser.newContext({
    viewport: { width, height },
    locale: ref.locale || 'en-US',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
  });
  const page = await ctx.newPage();
  const r = { name: ref.name, url: ref.url };
  try {
    const resp = await page.goto(ref.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(ref.wait ?? 1500);
    if (ref.scroll) await page.evaluate((y) => window.scrollTo(0, y), ref.scroll);
    r.status = resp ? resp.status() : null;
    r.finalUrl = page.url();
    r.title = await page.title();
    r.textLength = await page.evaluate(() => document.body?.innerText.trim().length || 0);
    await page.screenshot({ path: `out/refs/${ref.name}.png`, fullPage: !!ref.full });
    r.suspect = (r.status ?? 0) >= 400 || r.textLength < 200 || WALL.test(r.title);
  } catch (e) {
    r.error = e.message.split('\n')[0];
    r.suspect = true;
  }
  results.push(r);
  console.log(`${r.suspect ? 'SUSPECT' : 'ok     '} ${r.name}  ${r.status ?? ''} ${r.title ?? r.error ?? ''}`);
  await ctx.close();
}
writeFileSync('out/capture.json', JSON.stringify(results, null, 2));
await browser.close();
