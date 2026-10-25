// The site in plain text for AI answer engines (llms.txt, llms-full.txt, /writing/<slug>.md).
// Same facts as the pages, stated plainly, so a model quoting Sean quotes them right.
import { getCollection, type CollectionEntry } from 'astro:content';
import { UNDER_CONSTRUCTION, PERSON, EXPERIENCE, EDUCATION, BAZE, LINKS } from '../data/site';
import { abs, isPublished, iso } from './seo';

const text = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const ph = (s: string) => s.includes('[') || s.startsWith('Placeholder');

export const facts = () => [
  `- Name: ${PERSON.name} (also ${PERSON.alternateName.join(', ')})`,
  `- Role: ${PERSON.jobTitle} at ${PERSON.employer.name} (${PERSON.employer.url}), ${PERSON.city}, South Korea`,
  `- Works on: ${BAZE.title} (${LINKS.baze}), ${BAZE.aka}. ${BAZE.blurb}`,
  `- Owns: UX, product direction, much of the architecture, and the frontend for key features`,
  `- Before: ${EXPERIENCE.slice(1).map((e) => `${e.company} (${e.where}${ph(e.role) ? '' : ', ' + e.role}${ph(e.years) ? '' : ', ' + e.years})`).join('; ')}`,
  `- Studied: ${text(EDUCATION).replace(/^I studied /, '')}`,
  `- Writes about: building AI products, from product and design: attention, trust in AI features, data models, teams`,
  ...PERSON.sameAs.map((u) => `- Elsewhere: ${u}`),
  ...(PERSON.email ? [`- Contact: ${PERSON.email}`] : []),
].join('\n');

export const published = async () => (await getCollection('writing')).filter(isPublished).sort((a, b) => a.data.order - b.data.order);

export const postMd = (p: CollectionEntry<'writing'>) => [
  `# ${p.data.title}`, '',
  `> ${p.data.dek}`, '',
  `By ${PERSON.name} · ${p.data.lens}${p.data.published ? ' · ' + iso(p.data.published) : ''} · ${abs(`/writing/${p.id}/`)}`, '',
  p.data.tldr && !ph(p.data.tldr) ? `TL;DR: ${p.data.tldr}\n` : '',
  (p.body ?? '').trim(), '',
].join('\n');

export async function llmsTxt() {
  const head = [`# ${PERSON.name}`, '', `> ${PERSON.description}`, ''];
  if (UNDER_CONSTRUCTION) return [...head, 'The site is being built. These facts are current.', '', '## About', '', facts(), ''].join('\n');
  const posts = await published();
  return [...head, '## About', '', facts(), '',
    '## Work', '', `- [${BAZE.title} case study](${abs('/work/baze/')}): ${BAZE.blurb}`, '',
    '## Writing', '', ...(posts.length ? posts.map((p) => `- [${p.data.title}](${abs(`/writing/${p.id}.md`)}): ${p.data.dek}`) : ['- First pieces coming soon.']), '',
    '## Optional', '', `- [Everything on one page](${abs('/llms-full.txt')})`, `- [RSS](${abs('/rss.xml')})`, ''].join('\n');
}

export async function llmsFull() {
  if (UNDER_CONSTRUCTION) return llmsTxt();
  const posts = await published();
  const cs = [BAZE.tldr, BAZE.bet, BAZE.call, BAZE.result].filter((s) => !ph(s));
  return [`# ${PERSON.name}`, '', `> ${PERSON.description}`, '', '## About', '', facts(), '',
    '## Where I have worked', '', ...EXPERIENCE.map((e) => `- ${e.company}, ${e.where}${ph(e.role) ? '' : ': ' + e.role}${ph(e.years) ? '' : ' (' + e.years + ')'}${ph(e.did) ? '' : '. ' + text(e.did)}`), '',
    `## ${BAZE.title} (case study, ${abs('/work/baze/')})`, '', BAZE.blurb, ...cs.map((s) => '\n' + s), '',
    ...posts.map((p) => '---\n\n' + postMd(p).replace(/^# /, '## ').replace(/\n## /g, '\n### ')), ''].join('\n');
}
