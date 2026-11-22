// The site goes live only when everything shown is real. While UNDER_CONSTRUCTION is true this only lists
// what's left; once it's false, the build fails if any listed piece, the Baze case study or About still has
// placeholder copy. (Ideas, which aren't listed, don't count.) Called from the home page, so `astro build` runs it.
import { getCollection } from 'astro:content';
import { UNDER_CONSTRUCTION, forLang, isPh } from '../data/site';
import { listed } from './posts';
import { UI } from '../i18n';

const GAP = /\[Sean:|Placeholder:|작성 예정/;

export async function contentLeft(): Promise<string[]> {
  const left: string[] = [];
  for (const c of ['writing', 'writingKo'] as const) {
    const en = await getCollection('writing');
    for (const p of await getCollection(c)) {
      const meta = en.find((x) => x.id === p.id);
      if (!meta || !listed(meta)) continue;
      const n = (p.body ?? '').split(GAP).length - 1 + (p.data.tldr && isPh(p.data.tldr) ? 1 : 0);
      if (n) left.push(`${c}/${p.id}: ${n} gap${n > 1 ? 's' : ''}`);
    }
  }
  for (const lang of ['en', 'ko'] as const) {
    const { BAZE } = forLang(lang);
    for (const k of ['tldr', 'bet', 'call', 'result'] as const) if (isPh(BAZE[k])) left.push(`Baze case study (${lang}): ${k}`);
    if (isPh(UI[lang].aboutPh)) left.push(`About (${lang}): how I work`);
  }
  return left;
}

export async function assertReady() {
  if (UNDER_CONSTRUCTION) return;
  const left = await contentLeft();
  if (left.length) throw new Error(`Not ready to go live, still placeholder copy in:\n- ${left.join('\n- ')}`);
}
