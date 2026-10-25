import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Writing. Each piece is a claim; the title is the claim.
// specimen: a live demo shown inside the piece (sparkle | agent | system).
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
  }),
});

export const collections = { writing };
