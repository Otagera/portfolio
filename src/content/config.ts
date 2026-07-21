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

const projects = defineCollection({
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		year: z.string(),
		tech: z.array(z.string()),
		link: z.string(),
		writeup: z.string().optional(),
	}),
});

export const collections = { writing, projects };
