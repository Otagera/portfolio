---
title: "Rewriting the Terminal Journal: Philosophy and Process"
date: "Feb 2026"
readTime: "8 min"
summary: "A deep dive into the technical migration from React to Astro, SQLite-backed view tracking, and the engineering behind a terminal-inspired UI."
tags: ["web-design", "astro", "philosophy", "performance", "sqlite"]
---

# Rewriting the Terminal Journal

My original portfolio was a typical React single-page application (SPA). It used Chakra UI, handled routing on the client side, and featured smooth, animated transitions. It was "modern" in the way we've been taught to build for the web over the last decade.

But as I spent more time in the terminal—writing CLI tools in TypeScript and Go, and managing servers via SSH—my taste shifted. I wanted something that reflected my work: minimalist, high-performance, and fundamentally text-driven.

## The Technical Shift: From SPA to Multi-Page Static

The migration was more than just a CSS change. Moving to **Astro v5** allowed me to rethink the "why" of every component. In the React version, even a simple text page required a JavaScript bundle to hydrate. In the new version, the site is 99% static HTML, with JavaScript used only for minor interactions like the tag filtering logic.

### 1. The SQLite View Engine

One of the most complex parts of the rewrite was moving away from third-party analytics. I wanted a self-hosted, privacy-first way to track post popularity. I chose **better-sqlite3** to manage a local database directly on the VPS.

The implementation uses a simple `post_views` table:

```sql
CREATE TABLE IF NOT EXISTS post_views (
  slug TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0
);
```

In `src/pages/writing/[slug].astro`, I leverage Astro's server-side rendering (SSR) to increment views on every request:

```javascript
// src/lib/db.js
export function incrementViews(slug) {
  return db.prepare(`
    INSERT INTO post_views (slug, count) 
    VALUES (?, 1) 
    ON CONFLICT(slug) DO UPDATE SET count = count + 1
  `).run(slug);
}
```

This "upsert" logic ensures that view counts are updated atomically without needing an external API or a heavy database server like PostgreSQL. Also in the future if I decide to add interactions (likes, comments) working with sqlite helps.

### 2. AI-Augmented Engineering

One of the most unique aspects of this rewrite was the collaboration with **Gemini CLI**. This wasn't just a solo effort; I used the agent as a pair programmer to navigate the more tedious parts of the migration and to enforce engineering standards.

*   **Architectural Guidance**: The agent helped implement the **Draft System** and ensured that the production filtering logic was robust across the RSS feed and tag pages.
*   **Performance & SEO Tuning**: After an initial Lighthouse audit, the CLI identified missing Open Graph tags and redundant font imports, proactively refactoring the `BaseLayout` to boost SEO scores.
*   **The `writing-editor` Skill**: To maintain long-term quality, we developed a custom **Gemini CLI skill**. This tool acts as an automated technical reviewer, checking for schema compliance, calculating read times, and suggesting improvements to technical clarity before I commit.

This partnership allowed me to focus on the high-level philosophy while the CLI handled the "plumbing" of a modern Astro site.

### 3. Engineering the Terminal UI

The aesthetic is driven by **Tailwind CSS** and a focus on monospace typography. 

*   **Typography**: I standardized on `JetBrains Mono` for both headers and body text to maintain the "IDE feel."
*   **The "Directory" Aesthetic**: Using CSS border-left utilities and custom pseudo-elements, I recreated the look of a file explorer for the project list.
*   **Monospace Prose**: I customized the `@tailwindcss/typography` plugin to ensure that headers, lists, and tables inside Markdown files maintain the terminal aesthetic without looking like a generic Bootstrap site.

```javascript
// tailwind.config.mjs excerpt
theme: {
  extend: {
    fontFamily: {
      mono: ['JetBrains Mono', 'monospace'],
    },
    colors: {
      terminal: {
        green: '#14b8a6', // Teal 500
        bg: '#0a0a0a',
      }
    }
  }
}
```

## The "Hybrid" Repository Strategy

A unique aspect of this project is that it isn't just a rewrite; it's a migration. I've preserved the entire original React implementation in a `legacy-react/` directory. 

It serves as a benchmark. By comparing the two, I can see the performance gains: the new Astro build is ~10x smaller in bundle size. While I'm still fine-tuning (current Lighthouse Performance is at 67, with Best Practices at 100 and Accessibility at 97), the shift proves the value of a static-first approach.

## Conclusion

Rewriting this site wasn't about following a trend. It was about aligning my digital home with my engineering philosophy: **Simplicity is the ultimate sophistication.** By stripping away the layers of modern web abstraction and returning to fundamentals—SQLite, Static HTML, and clean Typography—I've built a platform that is as efficient as the code I write.