import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const fieldNotes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/field-notes' }),
  schema: z.object({
    company: z.string(),
    category: z.string(),
    summary: z.string(),
    theAgentEraMove: z.string(),
    takeaways: z.array(z.string()),
    pubDate: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { writing, 'field-notes': fieldNotes };
