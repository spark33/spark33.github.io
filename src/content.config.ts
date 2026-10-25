import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Writing. Each piece is a claim; the title is the claim.
// specimen: a live demo shown inside the piece (sparkle | agent | system).
// published: set it (YYYY-MM-DD) when the piece is out. Until then it's a draft: listed on the
// home page, but noindex and left out of the sitemap, feed and llms.txt. updated: last real edit.
// keywords: a few search phrases the piece answers (JSON-LD + meta).
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    lens: z.string(),
    status: z.string().default('Drafting'),
    order: z.number(),
    tldr: z.string().optional(),
    project: z.string().optional(),
    specimen: z.enum(['sparkle', 'agent', 'system']).optional(),
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    keywords: z.array(z.string()).default([]),
  }),
});

export const collections = { writing };
