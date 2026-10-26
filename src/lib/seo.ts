// Search + answer-engine plumbing: who's indexable, and the JSON-LD graph each page carries.
// One entity graph with stable @ids (#sean, #website, #mindlogic, #baze) so Google, Bing and
// AI crawlers resolve every page to the same Sean Park.
import type { CollectionEntry } from 'astro:content';
import { UNDER_CONSTRUCTION, PERSON, SITE_DESCRIPTION, LINKS, BAZE, forLang } from '../data/site';
import type { Piece } from './posts';
import { UI, loc, type Lang } from '../i18n';

export const SITE = 'https://seanpark.page';
export const abs = (path: string) => new URL(path, SITE).href;
export const OG_IMAGE = { url: abs('/og.png'), width: 1200, height: 630, alt: 'Sean Park: product lead at Mindlogic, Seoul. Writing about building AI products.' };
/** Each piece's own share image (public/og/, made by scripts/og.mjs): its title on the site's paper. A piece not
 *  translated yet uses the English card on /ko/ too. */
export const postOg = (id: string, lang: Lang, fallback = false) => abs(`/og/${lang === 'ko' && !fallback ? 'ko/' : ''}${id}.jpg`);

export const ID = { sean: abs('/#sean'), site: abs('/#website'), mindlogic: abs('/#mindlogic'), baze: abs('/#baze') };

// A piece is public once it has a `published` date. Drafts are listed on the home page but stay
// out of search, the sitemap, the feed and llms.txt, so thin placeholder pages never get indexed.
export const isPublished = (p: CollectionEntry<'writing'>) => !UNDER_CONSTRUCTION && !!p.data.published;
export const iso = (d?: Date) => d?.toISOString().slice(0, 10);

const person = {
  '@type': 'Person', '@id': ID.sean,
  name: PERSON.name, alternateName: PERSON.alternateName,
  url: abs('/'), description: PERSON.description,
  jobTitle: PERSON.jobTitle,
  worksFor: { '@id': ID.mindlogic },
  workLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: PERSON.city, addressCountry: PERSON.country } },
  alumniOf: { '@type': 'CollegeOrUniversity', name: PERSON.alumniOf.name, url: PERSON.alumniOf.url },
  knowsLanguage: PERSON.languages,
  knowsAbout: PERSON.knowsAbout,
  sameAs: PERSON.sameAs,
  ...(PERSON.email && { email: 'mailto:' + PERSON.email }),
  image: OG_IMAGE.url,
};
const mindlogic = { '@type': 'Organization', '@id': ID.mindlogic, name: PERSON.employer.name, url: PERSON.employer.url };
const baze = {
  '@type': 'SoftwareApplication', '@id': ID.baze, name: BAZE.title, alternateName: 'FactChat', url: LINKS.baze,
  applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
  description: BAZE.blurb, publisher: { '@id': ID.mindlogic },
};
const website = {
  '@type': 'WebSite', '@id': ID.site, url: abs('/'), name: PERSON.name,
  description: SITE_DESCRIPTION, inLanguage: ['en', 'ko'], author: { '@id': ID.sean }, publisher: { '@id': ID.sean },
};
const crumbs = (items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
});
const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': [website, person, mindlogic, ...nodes] });

// Each page's node is in its own language (Korean pages live under /ko/); the people and companies are shared.
export const homeLd = (posts: Piece[], lang: Lang = 'en') => graph({
  '@type': 'ProfilePage', '@id': abs(loc('/#page', lang)), url: abs(loc('/', lang)), name: UI[lang].name, description: SITE_DESCRIPTION,
  inLanguage: lang, isPartOf: { '@id': ID.site }, mainEntity: { '@id': ID.sean }, about: { '@id': ID.sean },
  hasPart: posts.filter((p) => isPublished(p.en)).map((p) => ({ '@id': abs(loc(`/writing/${p.id}/#article`, lang)) })),
}, baze);

export const caseLd = (lang: Lang = 'en') => graph(baze, {
  '@type': 'Article', '@id': abs(loc('/work/baze/#article', lang)), url: abs(loc('/work/baze/', lang)), mainEntityOfPage: abs(loc('/work/baze/', lang)),
  headline: `Baze: ${UI[lang].caseStudy}`, description: forLang(lang).BAZE.blurb, about: { '@id': ID.baze },
  author: { '@id': ID.sean }, publisher: { '@id': ID.sean }, isPartOf: { '@id': ID.site }, image: OG_IMAGE.url, inLanguage: lang,
}, crumbs([[UI[lang].name, loc('/', lang)], [UI[lang].now[0], loc('/#now', lang)], ['Baze', loc('/work/baze/', lang)]]));

export const postLd = (p: Piece, words: number, mins: number, lang: Lang = 'en') => {
  const url = abs(loc(`/writing/${p.id}/`, lang)), d = p.data;
  return graph({
    '@type': 'BlogPosting', '@id': url + '#article', url, mainEntityOfPage: url,
    headline: d.title, description: d.dek, ...(d.tldr && !d.tldr.startsWith('Placeholder') && { abstract: d.tldr }),
    articleSection: d.lens, keywords: d.keywords, wordCount: words, timeRequired: `PT${mins}M`, inLanguage: p.fallback ? 'en' : lang,
    creativeWorkStatus: d.published ? 'Published' : 'Draft',
    ...(d.published && { datePublished: iso(d.published) }), ...((d.updated || d.published) && { dateModified: iso(d.updated || d.published) }),
    author: { '@id': ID.sean }, publisher: { '@id': ID.sean }, isPartOf: { '@id': ID.site }, image: postOg(p.id, lang, p.fallback),
    ...(d.project === 'baze' && { about: { '@id': ID.baze } }),
  }, ...(d.project === 'baze' ? [baze] : []), crumbs([[UI[lang].name, loc('/', lang)], [UI[lang].writing[0], loc('/#writing', lang)], [d.title, loc(`/writing/${p.id}/`, lang)]]));
};

// The holding page: just the person, so a search for Sean already finds the right one.
export const holdingLd = () => graph({
  '@type': 'ProfilePage', '@id': abs('/under-construction/#page'), url: abs('/under-construction/'),
  name: PERSON.name, mainEntity: { '@id': ID.sean }, isPartOf: { '@id': ID.site },
});
