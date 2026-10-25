// robots.txt: everyone is welcome, AI crawlers by name. Being quotable by ChatGPT, Claude,
// Perplexity and Google's AI answers is the point (GEO), so none of them are blocked.
// Gated pages and drafts are kept out with <meta name="robots" content="noindex">, not here:
// a Disallow would stop crawlers from ever seeing that noindex.
import type { APIRoute } from 'astro';
import { abs } from '../lib/seo';

const AI = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot',
  'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot', 'MistralAI-User', 'CCBot'];

export const GET: APIRoute = () => new Response(
  ['User-agent: *', 'Allow: /', '', ...AI.flatMap((a) => [`User-agent: ${a}`, 'Allow: /', '']),
    `Sitemap: ${abs('/sitemap.xml')}`, ''].join('\n'),
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
