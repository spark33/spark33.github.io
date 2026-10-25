// The writing as an RSS feed: published pieces only, newest first.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION } from '../data/site';
import { abs, isPublished } from '../lib/seo';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async () => {
  const posts = (await getCollection('writing')).filter(isPublished)
    .sort((a, b) => +b.data.published! - +a.data.published!);
  const items = posts.map((p) => `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${abs(`/writing/${p.id}/`)}</link>
      <guid isPermaLink="true">${abs(`/writing/${p.id}/`)}</guid>
      <description>${esc(p.data.dek)}</description>
      <category>${esc(p.data.lens)}</category>
      <pubDate>${p.data.published!.toUTCString()}</pubDate>
    </item>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sean Park · Writing</title>
    <link>${abs('/')}</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${abs('/rss.xml')}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
