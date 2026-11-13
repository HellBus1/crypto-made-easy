import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({
    base: './src/content/lessons',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    chapter: z.number().int().min(1),
    track: z.string().default('Core'),
    durationMinutes: z.number().int().min(1).default(4),
    interactiveFocus: z.string(),
    goals: z.array(z.string()).default([]),
    realWorldWhy: z.string().default(''),
    terms: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { lessons };
