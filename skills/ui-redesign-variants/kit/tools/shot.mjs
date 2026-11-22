// Screenshot prototype files.
//   node tools/shot.mjs [--sizes 1440x900,1280x800] [--full] <file[#state]> ...
// Every file opens with ?shot=1 (hides the variant switcher). A `#state`
// suffix adds &state=<state>, so a variant can render a key interaction
// (open menu, filled form, error) on load.
// Writes out/shots/<size>/<file without .html>[--state].png and prints any
// page or console errors. Exits 1 if a page threw.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
let sizes = ['1440x900'];
let full = false;
const targets = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--sizes') sizes = args[++i].split(',');
  else if (args[i] === '--full') full = true;
  else targets.push(args[i]);
}

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch()); // installed Chrome, else Playwright's Chromium
let failed = false;
for (const size of sizes) {
  const [width, height] = size.split('x').map(Number);
  const ctx = await browser.newContext({ viewport: { width, height } });
  for (const target of targets) {
    const [file, state] = target.split('#');
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    const url = pathToFileURL(resolve(file)).href + '?shot=1' + (state ? `&state=${encodeURIComponent(state)}` : '');
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(400);
    const out = `out/shots/${size}/${file.replace(/\.html$/, '')}${state ? `--${state}` : ''}.png`;
    mkdirSync(dirname(out), { recursive: true });
    await page.screenshot({ path: out, fullPage: full });
    if (errors.length) failed = true;
    console.log(`${errors.length ? 'ERR' : 'ok '} ${out}${errors.length ? '  ' + errors.join(' | ') : ''}`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
