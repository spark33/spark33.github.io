// Search + answer-engine plumbing: who's indexable, and the JSON-LD graph each page carries.
// One entity graph with stable @ids (#sean, #website, #mindlogic, #baze) so Google, Bing and
// AI crawlers resolve every page to the same Sean Park.
import type { CollectionEntry } from 'astro:content';
import { UNDER_CONSTRUCTION, PERSON, SITE_DESCRIPTION, LINKS, BAZE } from '../data/site';

export const SITE = 'https://seanpark.page';
export const abs = (path: string) => new URL(path, SITE).href;
export const OG_IMAGE = { url: abs('/og.png'), width: 1200, height: 630, alt: 'Sean Park: product lead at Mindlogic, Seoul. Writing about building AI products.' };

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
  description: SITE_DESCRIPTION, inLanguage: 'en', author: { '@id': ID.sean }, publisher: { '@id': ID.sean },
};
const crumbs = (items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
});
const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': [website, person, mindlogic, ...nodes] });

export const homeLd = (posts: CollectionEntry<'writing'>[]) => graph({
  '@type': 'ProfilePage', '@id': abs('/#page'), url: abs('/'), name: PERSON.name, description: SITE_DESCRIPTION,
  isPartOf: { '@id': ID.site }, mainEntity: { '@id': ID.sean }, about: { '@id': ID.sean },
  hasPart: posts.filter(isPublished).map((p) => ({ '@id': abs(`/writing/${p.id}/#article`) })),
}, baze);

export const caseLd = () => graph(baze, {
  '@type': 'Article', '@id': abs('/work/baze/#article'), url: abs('/work/baze/'), mainEntityOfPage: abs('/work/baze/'),
  headline: 'Baze: case study', description: BAZE.blurb, about: { '@id': ID.baze },
  author: { '@id': ID.sean }, publisher: { '@id': ID.sean }, isPartOf: { '@id': ID.site }, image: OG_IMAGE.url, inLanguage: 'en',
}, crumbs([['Sean Park', '/'], ['Work', '/#now'], ['Baze', '/work/baze/']]));

export const postLd = (p: CollectionEntry<'writing'>, words: number, mins: number) => {
  const url = abs(`/writing/${p.id}/`), d = p.data;
  return graph({
    '@type': 'BlogPosting', '@id': url + '#article', url, mainEntityOfPage: url,
    headline: d.title, description: d.dek, ...(d.tldr && !d.tldr.startsWith('Placeholder') && { abstract: d.tldr }),
    articleSection: d.lens, keywords: d.keywords, wordCount: words, timeRequired: `PT${mins}M`, inLanguage: 'en',
    creativeWorkStatus: d.published ? 'Published' : 'Draft',
    ...(d.published && { datePublished: iso(d.published) }), ...((d.updated || d.published) && { dateModified: iso(d.updated || d.published) }),
    author: { '@id': ID.sean }, publisher: { '@id': ID.sean }, isPartOf: { '@id': ID.site }, image: OG_IMAGE.url,
    ...(d.project === 'baze' && { about: { '@id': ID.baze } }),
  }, ...(d.project === 'baze' ? [baze] : []), crumbs([['Sean Park', '/'], ['Writing', '/#writing'], [d.title, `/writing/${p.id}/`]]));
};

// The holding page: just the person, so a search for Sean already finds the right one.
export const holdingLd = () => graph({
  '@type': 'ProfilePage', '@id': abs('/under-construction/#page'), url: abs('/under-construction/'),
  name: PERSON.name, mainEntity: { '@id': ID.sean }, isPartOf: { '@id': ID.site },
});
