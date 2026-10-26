// sitemap.xml: only pages that should be in search. While the site is gated that's just the
// holding page; after launch it's home, the case study and every published piece.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { UNDER_CONSTRUCTION } from '../data/site';
import { abs, isPublished, iso } from '../lib/seo';
import { LANGS, loc } from '../i18n';

export const GET: APIRoute = async () => {
  const today = iso(new Date())!;
  const posts = (await getCollection('writing')).filter(isPublished);
  // every page in both languages (each page's head carries the hreflang pairs)
  const pages: [string, string][] = [['/', today], ['/work/baze/', today], ...posts.map((p) => [`/writing/${p.id}/`, iso(p.data.updated || p.data.published)!] as [string, string])];
  const urls: [string, string][] = UNDER_CONSTRUCTION
    ? [['/under-construction/', today]]
    : LANGS.flatMap((l) => pages.map(([u, d]) => [loc(u, l), d] as [string, string]));
  const body = urls.map(([u, d]) => `  <url><loc>${abs(u)}</loc><lastmod>${d}</lastmod></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
