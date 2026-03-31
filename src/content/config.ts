import { defineCollection, z } from 'astro:content';

const writing = defineCollection({
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		readTime: z.string(),
		summary: z.string(),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().optional(),
	}),
});

export const collections = { writing };
