---
title: "Lumina"
summary: "An AI intelligence layer for photo libraries: distributed face detection, identity clustering, and instant self-search across shared collections, without vendor lock-in."
year: "2026"
tech: ["React", "ElysiaJS", "Bun", "PostgreSQL", "Python (InsightFace)", "BullMQ", "Redis", "FastAPI"]
link: "https://github.com/Otagera/lumina"
writeup: "/writing/lumina"
---

Lumina turns raw photo storage into an **intelligence layer**. It detects faces, clusters identities, and lets people instantly find themselves in large, shared photo collections, the way Google Photos does, but without locking users into a proprietary system or taking control of their data.

## What it does

- **Collaborative Events.** A host shares a QR code, guests upload photos, and instead of scrolling through thousands of strangers a guest just takes a selfie. A vector search finds every photo they appear in within that event.
- **Bring Your Own Storage (BYOS).** Each album defines its own backend (Local, Cloudflare R2, or S3). Lumina holds the intelligence (embeddings, metadata) but never the high-res originals.
- **Asynchronous AI processing.** Uploads return immediately; the heavy work runs in a background pipeline.

## How it's built

The system is a distributed pipeline that keeps heavy computation off the request path:

- **Bun + ElysiaJS API** handles validation, auth, and usage quotas.
- **BullMQ worker** orchestrates the pipeline (image optimization with Sharp, 64-bit dHash perceptual de-duplication, then embedding extraction) with retries, idempotency, and backpressure.
- **FastAPI ML service** keeps the InsightFace `buffalo_l` model warm in memory, extracting 512-dimensional face embeddings. Moving from a per-image Python subprocess to a warm service dropped latency from ~400–800ms to ~40–100ms per image.

## The interesting decision

Face similarity search runs on **plain PostgreSQL without pgvector**: embeddings are stored as `Float[]` arrays and cosine distance is computed on the fly with `unnest()` and standard SQL. That keeps Lumina portable to any Postgres instance (Neon, Supabase, self-hosted) with zero extensions. Because searches are scoped per event or album, the O(n) scan stays small and fast.

For the full architecture, the pgvector-free similarity query, and the reliability/backpressure design, read the deep dive linked above.
