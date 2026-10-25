// Each published piece as plain Markdown (/writing/<slug>.md), linked from llms.txt.
import type { APIRoute } from 'astro';
import { postMd, published } from '../../lib/llms';

export async function getStaticPaths() {
  return (await published()).map((p) => ({ params: { slug: p.id }, props: { post: p } }));
}
export const GET: APIRoute = ({ props }) => new Response(postMd(props.post), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
