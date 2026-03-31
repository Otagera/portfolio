---
name: writing-editor
description: Technical editor and reviewer for blog posts and writing entries. Use when writing, editing, or reviewing markdown files in 'src/content/writing/' to ensure technical clarity, consistency, and proper Astro frontmatter formatting.
---

# Writing Editor

## Overview

This skill provides an automated editorial review for technical blog posts. It ensures content adheres to the project's standards for clarity, formatting, and metadata accuracy.

## Workflow

When asked to edit or review a writing entry:

1.  **Frontmatter Validation**: Check the post's frontmatter against the schema in [references/schema.md](references/schema.md).
    *   Ensure all required fields (`title`, `date`, `readTime`, `summary`) are present.
    *   Verify `date` format (e.g., "MMM YYYY").
    *   Check that `tags` is an array of strings.
2.  **Structural Review**:
    *   The H1 header should match the `title` in frontmatter.
    *   Check for logical flow and consistent use of subheaders (H2, H3).
3.  **Technical Proofreading**:
    *   Check for grammar and spelling errors.
    *   Verify technical terms and code block formatting.
    *   Ensure the tone is professional, direct, and engaging.
4.  **Optimization Suggestions**:
    *   Suggest a more punchy `summary` if needed.
    *   Recalculate `readTime` (approx. 200 words per minute).
    *   Suggest relevant `tags` if they are missing or generic.

## Guidelines

- **Conciseness**: Technical readers value brevity. Avoid fluff.
- **Clarity**: Explain complex concepts simply but without losing technical depth.
- **Formatting**: Use standard Markdown. Ensure code blocks have language identifiers (e.g., ```typescript).