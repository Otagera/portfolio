---
title: "Lumina: The Journey of Building a Collaborative AI Photo Intelligence Layer"
date: "Apr 28 2026"
readTime: "12 min"
summary: "A deep dive into building a distributed face-matching platform using Elysia.JS, FastAPI, and PostgreSQL—without pgvector."
tags: ["javascript", "python", "monorepo", "ai", "face-recognition", "postgresql"]
---

# Lumina: The Journey of Building a Collaborative AI Photo Intelligence Layer

For nearly two years, a specific idea has lived in the back of my mind. It started with a simple observation of how effortlessly Google Photos handles face grouping, and it evolved into a question: *Can I build a platform that offers that same "magic" without the privacy trade-offs or the data silos?*

This is the story of **Lumina**. It’s a journey that began with a messy Python script and ended with a distributed monorepo capable of handling collaborative events, "Bring Your Own Storage" (BYOS), and asynchronous AI processing at scale.

## The Evolution: From "Does it Work?" to "Will it Scale?"

### 1. The "Script" Era (Late 2025)
Lumina didn't start as a monorepo. It started as a basic Express app. Every time an image was uploaded, I used `child_process.exec` to call a Python script that utilized the `face_recognition` library.

It was functional but fragile.
*   **The Bottleneck:** Calling Python scripts from Node.js is expensive. The overhead of starting the Python interpreter for every single image was a performance nightmare.
*   **The Accuracy:** While `face_recognition` (based on dlib) is great for hobby projects, it struggled with diverse lighting and profile shots.

### 2. The Migration: Embracing Elysia and Bun (Early 2026)
As I moved into 2026, I realized the "Express + Scripts" approach was a dead end. I migrated to **Elysia.JS** running on **Bun**.
*   **Why Elysia?** I wanted a framework that felt modern and took full advantage of Bun's speed. Elysia's end-to-end type safety (via TypeBox) made refactoring the API significantly less painful.
*   **Decoupling the Engine:** I moved the Python logic into its own **FastAPI** microservice. This allowed the AI engine to stay "warm" in memory, drastically reducing latency for face detection.

### 3. The Collaborative Pivot: "Selfie to Join"
The most significant shift was realizing that Lumina shouldn't just be a personal gallery—it should be a **collaborative hub**. I introduced **Collaborative Events**. 

Imagine a wedding: The host shares a QR code. Guests upload photos. But instead of scrolling through thousands of strangers' photos, a guest can simply **take a selfie**. Lumina uses that selfie to instantly find every photo they appear in within that specific event.

## Under the Hood: The Engineering Deep-Dive

### The Monorepo Strategy
I opted for a manual monorepo using **Bun Workspaces**. I avoided the complexity of TurboRepo, choosing instead to share logic through a `packages/` directory:
*   `packages/models`: Centralizes the Prisma schema.
*   `packages/utils`: Contains the `StorageProvider` abstraction, allowing the app to switch between local storage, Cloudflare R2, and User-defined S3 buckets seamlessly.

### The Background Worker Pipeline (BullMQ)
Processing AI isn't just about calling an API; it's a multi-stage pipeline. I used **BullMQ** to chain these operations:

1.  **Image Optimization:** We use `Sharp` to generate a 2000px WebP version for fast UI rendering.
2.  **Perceptual Hashing (dHash):** We calculate a 64-bit hash to identify "visual duplicates." This allows us to tell a user, *"You've already uploaded this photo in another album,"* even if the file size or name has changed.
3.  **Face Recognition:** The worker calls the FastAPI service, which uses the **InsightFace `buffalo_l`** model.

```javascript
// A look at the dHash implementation for visual duplicate detection
const calculatePerceptualHash = async (imageBuffer) => {
    // Resize to 9x8 grayscale to compare adjacent pixels
    const { data } = await sharp(imageBuffer)
        .grayscale()
        .resize(9, 8, { fit: "fill" })
        .raw()
        .toBuffer({ resolveWithObject: true });

    let hash = "";
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const left = data[row * 9 + col];
            const right = data[row * 9 + col + 1];
            // If the left pixel is brighter than the right, it's a 1
            hash += left > right ? "1" : "0";
        }
    }
    return BigInt(`0b${hash}`).toString(16).padStart(16, "0");
};
```

### The PostgreSQL Vector Hack (Cosine Similarity in SQL)
One of the biggest hurdles was performing vector searches without `pgvector`. Most managed DBs don't support custom extensions. My solution? **Pure SQL Dot Product Math.**

I stored the 512-dimensional embeddings as a standard `Float[]` array. To find similar faces, I wrote a raw query that calculates the **Cosine Distance** using `unnest()` and dot products.

```sql
-- Manual Cosine Similarity: (A · B) / (||A|| * ||B||)
WITH distances AS (
  SELECT
    f.face_id,
    (
      SELECT 1.0 - (
        SUM(u1.val * u2.val) / (SQRT(SUM(u1.val * u1.val)) * SQRT(SUM(u2.val * u2.val)))
      )
      FROM unnest(f.embedding) WITH ORDINALITY AS u1(val, idx)
      JOIN unnest(p_faces.embedding) WITH ORDINALITY AS u2(val, idx) ON u1.idx = u2.idx
    ) as distance
  FROM faces f, faces p_faces
  WHERE p_faces.person_id = $1::uuid
)
SELECT * FROM distances WHERE distance <= $2 ORDER BY distance ASC LIMIT 10;
```
This allowed Lumina to remain **infrastructure-agnostic**. I can deploy this on any standard Postgres instance without a single custom extension.

### Measuring the "Cost of AI"
Compute isn't free. To make Lumina sustainable, I implemented a **Compute Unit** tracking system. Every AI-intensive operation is logged:
*   **Face Recognition:** Logs `n` units where `n` is the number of faces detected.
*   **Storage:** Tracks the delta of bytes added to R2.

This usage is checked against the user's plan (Free vs. Pro) in the `uploadPicturesService` before a single job is even added to the queue. If you're out of quota, your images stay in "Pending" until you upgrade or your month resets.

## Bring Your Own Storage (BYOS)
The final piece of the puzzle was giving users control. Lumina supports **BYOS**. In the `faceRecognition.worker.js`, the code dynamically initializes the storage provider based on the album's configuration:

```typescript
const { provider, isLocal } = getStorageProvider(image, albumStorageConfig);
// If albumStorageConfig exists, we connect to the user's S3/R2 bucket on-the-fly
```
This means Lumina can act as the **intelligence layer** for your data, without ever actually "owning" the files.

## Reflection: 2026 and Beyond
Building Lumina was a lesson in bridging ecosystems. It’s a project that demonstrates why the "JavaScript only" or "Python only" mindsets are limiting. By using **Bun** for the API, **BullMQ** for the orchestration, **Python** for the ML, and **PostgreSQL** as the "vector engine," I was able to build something that feels like magic—but is grounded in solid, standard engineering.

---

> Written with [StackEdit](https://stackedit.io/).