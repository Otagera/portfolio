# Othniel Agera

Othniel Agera's portfolio and blog.

Built with **Astro**, **Tailwind CSS**, and **SQLite**, this project follows a monospace, terminal-inspired aesthetic focusing on performance and technical clarity.

## 🚀 Features

- **Astro v5**: High-performance static site generation.
- **Terminal UI**: A minimalist, dark-themed design ('The Terminal Journal').
- **Writing Collections**: Markdown-based content with automated RSS and tag filtering.
- **Live View Counts**: Real-time stats powered by SQLite and Astro's server-side rendering.
- **Legacy Reference**: The original React/Chakra UI implementation is preserved in the `legacy-react/` directory.

## 🤖 Gemini CLI Skills

This project includes custom Gemini CLI skills to assist with development and content creation.

### `writing-editor`
A specialized skill for technical editing and metadata validation. It ensures all blog posts in `src/content/writing/` follow the correct schema and maintain high technical standards.

**To use:**
1. Install [Gemini CLI](https://gemini.google.com).
2. Run `/skills reload` in your session.
3. Ask Gemini to "Review my latest blog post" or "Check the frontmatter for my new entry".


Each post card shows:

- Title (1-3 lines with ellipsis overflow)
- Date • Read time
- Tags
- Link to `https://otagera.xyz/writing/{slug}`

### OG Images

OG images are generated via Node scripts using `sharp` + inline SVG templating.

- **Per-post:** `scripts/generate-blog-og-images.js` — creates `public/og-images/{slug}.png`
- **Default:** `scripts/generate-og-image.js` — creates `public/og-image.png`

To generate OG images for a new post:

```bash
npm run generate:og
```

This is also part of the build command (`npm run build`).

## 🛠️ Development

### Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview production build locally.
- `npm run lint`: Check code quality with Biome.

## 📄 License
MIT