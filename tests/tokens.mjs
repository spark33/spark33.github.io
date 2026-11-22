// Token check (2026-11-23): the site's type, leading, spacing and radii come only from the tokens at the top of
// src/styles/global.css (see DESIGN.md, "Tokens"). Run from the repo root: node tests/tokens.mjs. Exits 1 on any miss.
// Allowed raw values: em (sup, code, list markers scale with their text), 0, 1–3px optical nudges in spacing,
// 50% radius for circles, pt inside @media print, and the token definitions themselves.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
let css = readFileSync('src/styles/global.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
css = css.replace(/@media print\{[\s\S]*?\n\}/, ''); // print sizes stay in pt
const bad = [];
const decls = [...css.matchAll(/(?<![-\w])([a-z-]+)\s*:\s*([^;{}]+)/g)].map((m) => [m[1], m[2].trim()]);
for (const [prop, val] of decls) {
  if (prop === 'font-size' && !/^(var\(--t-[\w]+\)|[\d.]+em|inherit)$/.test(val)) bad.push(`${prop}:${val}`);
  if (prop === 'font' && !/^inherit$/.test(val) && !/^(\d{3} )?(var\(--t-\w+\)|[\d.]+em)(\/(var\(--lh-\w+\)))? /.test(val)) bad.push(`${prop}:${val}`);
  if (prop === 'line-height' && !/^(var\(--lh-\w+\)|0|normal|inherit)$/.test(val)) bad.push(`${prop}:${val}`);
  if (/^(margin|padding|scroll-margin)(-[a-z-]+)?$|^(row-|column-)?gap$/.test(prop)) for (const n of val.matchAll(/(\d+(?:\.\d+)?)px/g)) if (+n[1] > 3) bad.push(`${prop}:${val}`);
  if (prop === 'border-radius' && !/^(var\(--r-\w+\)|50%|0)( (var\(--r-\w+\)|50%|0))*$/.test(val)) bad.push(`${prop}:${val}`);
}
// inline styles in templates may not set type or spacing either
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
for (const f of walk('src').filter((f) => /\.(astro|ts|md)$/.test(f) && !/under-construction/.test(f)))
  for (const m of readFileSync(f, 'utf8').matchAll(/style=["'{`][^"'}`]*(font-size|line-height|margin|padding)\s*:\s*[^;"'}`]*\d+px/g)) bad.push(`${f}: ${m[0].slice(0, 80)}`);
const uniq = [...new Set(bad)];
console.log(uniq.length ? 'FAIL tokens:\n  ' + uniq.join('\n  ') : 'PASS tokens: type, leading, spacing and radii all come from the scale');
process.exit(uniq.length ? 1 : 0);
