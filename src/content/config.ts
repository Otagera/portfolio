import { defineCollection, z } from 'astro:content';

const writing = defineCollection({
	schema: z.object({
		title: z.string(),
		date: z.string(),
		readTime: z.string(),
		summary: z.string(),
	}),
});

export const collections = { writing };
