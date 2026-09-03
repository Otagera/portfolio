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
		// Chronological entry in a series (e.g. "Part 2" of a dev-log).
		series: z
			.object({
				id: z.string(),
				title: z.string(),
				part: z.number(),
				// Short, commit-subject-style description (not the full title —
				// this shows up next to *other* parts in the series nav, where
				// repeating the full title would be redundant with their own H1).
				blurb: z.string(),
			})
			.optional(),
		// A tangent that zooms into one part of a series without being
		// numbered into its main sequence (e.g. a deep-dive spun off Part 1).
		spinoffOf: z
			.object({
				seriesId: z.string(),
				part: z.number(),
				label: z.string(),
			})
			.optional(),
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

// Living reference docs (a project's build curriculum, updated in place as
// work progresses) — distinct from `writing`, which is dated articles.
const curricula = defineCollection({
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		updatedDate: z.coerce.date(),
		project: z.string().optional(),
		// Links this curriculum to a writing `series.id` / `spinoffOf.seriesId`
		// so posts can find their way back to the plan they're following.
		seriesId: z.string().optional(),
	}),
});

export const collections = { writing, projects, curricula };
