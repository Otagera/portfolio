# Writing Content Schema

The blog posts in this project use the following Astro content collection schema (defined in `src/content/config.ts`):

```typescript
{
  title: z.string(),       // The title of the post
  date: z.string(),        // e.g., "Feb 2026"
  readTime: z.string(),    // e.g., "5 min"
  summary: z.string(),     // A brief summary for the feed
  tags: z.array(z.string()).optional(), // Array of strings
}
```

## Frontmatter Example

```yaml
---
title: "Optimizing PostgreSQL for high-concurrency"
date: "Feb 2026"
readTime: "5 min"
summary: "How we reduced lock contention by 60% using partitioning and fine-tuned vacuum settings."
tags: ["database", "postgresql", "performance"]
---
```
