# Deploying Lumina

This is a about deploying a Scalable AI Photo App on Hetzner

When it comes to deploying side projects, the modern indie hacker is spoiled for choice. I have used platforms like Railway, and Render that offer s smooth "git push to deploy" experience. But as your architecture grows—especially when dealing with databases, background workers, and AI services—those managed platforms can quickly burn a hole in your wallet with usage-based billing.

For [Lumina](https://lumina.otagera.xyz/) (an AI-powered photo sharing and face-matching application), I wanted the magic of PaaS, and Railway could have worked for this application but the educational value of managing my own server was what I was going for plus the cost predictability of Railway was another factor. Previously, my deployments involved manually SSHing into a GCP instance, running `git pull`, and restarting `pm2`. It was tedious.

For this time I chose the **Hetzner CX33 plan (4 vCPUs, 8GB RAM, 80GB NVMe for ~$7/month)** paired with [**Coolify**](https://coolify.io/). It's like having your own personal Vercel, but for a fraction of the cost and with total control over the environment.

However, the journey from a local Docker environment to a stable production cluster wasn't without its challenges. Here is the technical breakdown of how I deployed a Monorepo containing a React Client, Bun API, Python AI Service, BullMQ Worker, Postgres (pgvector), and Redis—and the issues I faced along the way.

---

### Architecture: The "Everything in One Box" Fallacy

When you start with Docker, the temptation is to put *everything* into a single `docker-compose.yml` file. If it works locally with `docker compose up`, why not in production?

**The Production Reality:** I quickly learned that my frontend and backend needed different environments.

By separating the **Client** from the **Docker Compose stack**, I unlocked some significant benefits:
1. **Edge Routing:** I could deploy the React (Vite) client as a pure "Static Site" within Coolify.
2. **Build Isolation:** If I tweak a CSS file, I shouldn't trigger a rebuild of my heavy Python AI service.

In Coolify, I set up two resources from the same GitHub repo:
1. **The Client (Static Resource):** Using Nixpacks. Base Directory: `apps/client`, Build Command: `bun run build`.
2. **The Backend (Docker Compose):** Pointing to my root `docker-compose.yml`, weaving the API, DB, Redis, Worker, and AI Service into a private internal network.

---

### Trial 1: The Prisma "Drift" Dilemma

The first deployment of the API failed during the startup command: `bunx prisma db seed`.
The logs showed: `Error: The table public.plans does not exist in the current database.`

**What happened?**
During local development, it's easy to rely on `prisma db push` to force the database schema to match your `schema.prisma`. In production, I use `prisma migrate deploy`, which strictly runs the SQL files located in the `prisma/migrations` folder.

I had added several new tables (like `plans` and `notifications`) to my schema, but had forgotten to generate the migration files. Prisma detected a "Drift" between the schema and the migration history.

**The Fix:**
I synchronized the schema locally. By running a forceful migration generation, I wiped the local dev DB, allowed Prisma to recalculate the state, and generated the missing SQL.

```bash
cd apps/api
bunx prisma migrate dev --name add_plans_and_notifications
```
Once the new migration folder was committed and pushed, Coolify automatically pulled it, ran `migrate deploy`, and successfully created the missing tables. This cannot happen again so we don't lose data in production.

---

### Trial 2: Cloudflare SSL and The Nested Subdomain

Industry standards dictate separating your API and Frontend domains and it sort of looks good. Naturally, I went with:
* Frontend: `https://lumina.otagera.xyz`
* API: `https://api.lumina.otagera.xyz`

But hitting the API returned a **Cloudflare Error 526: Invalid SSL Certificate**.

**What happened?**
Cloudflare's free Universal SSL certificate is a wildcard for `*.yourdomain.com`. It covers exactly *one* level of subdomains. It does **not** cover nested subdomains like `*.*.yourdomain.com` unless you pay for an Advanced Certificate Manager.

**The Fix:**
I flattened the architecture to keep everything on the first level which doesn't look as good but it works:
* Frontend: `https://lumina.otagera.xyz`
* API: `https://lumina-api.otagera.xyz`

*(Bonus Nginx issue: My static client started throwing 404 errors when users hit refresh on pages like `/home`. Because it's a Single Page Application (SPA), Nginx couldn't find a `home.html` file. Toggling the "Is SPA" setting in Coolify instantly injected the required `try_files $uri /index.html;` routing rule.)*

---

### Trial 3: Configuration Drift and The Missing Production Config

With the servers running, I tried to upload a photo. First, the browser blocked the request: `Blocked by CORS policy`. Once I fixed that, the API responded with a wildly incorrect upload URL: `http://localhost:undefined/api/v1/public/images/upload-direct-local`.

**What happened?**
Applications with multiple environment blocks (`development`, `test`, `production`) can be notorious for configuration drift. I had been adding new configuration keys to the `development` block as I built features, but never mirrored them to `production`:
1. **CORS:** My `production` config was missing the `cors_origin` field entirely.
2. **The Undefined Port:** The presigned URL generator was falling back to default variables that only existed in development.

**The Fix:**
I updated the production configuration block to explicitly map my public URLs:

```typescript
// packages/config/src/index.config.ts
production: {
  base_api_url: process.env.BASE_API_URL || "https://lumina-api.otagera.xyz",
  elysia_port: process.env.ELYSIA_PORT || 3005,
  cors_origin: process.env.CORS_ORIGIN,
  ai_service_url: "http://ai_service:8000", // Internal Docker network routing
}
```

I also updated the `normalizeImagePath` utility to correctly format URLs for the client. Since production uses a consistent `base_api_url`, I could remove the port logic that was causing the `undefined` issue.

---

### Trial 4: The OOM Server Crash

Just as I thought I was in the clear, the 8GB of RAM on my Hetzner CX33 instance ran out, and the server started freezing completely during deployments. The Coolify dashboard would throw a **504 Gateway Timeout**, and SSH connections would drop. I restarted the server over and over again, same thing, I even stopped the client server thinking that could help but same result. So I asked Gemini to look at what we could do to optimize things.

**What happened?**
So what happened was the Linux Out-Of-Memory (OOM) killer was terminating processes to free memory. My `apps/ai/Dockerfile` was running `pip install -r requirements.txt`, which included `dlib`—a notoriously heavy C++ machine learning library. Compiling `dlib` from source consumes massive amounts of CPU and gigabytes of RAM. The deployment container was eating all 8GB of the server's memory, taking down the database and API containers along with it.

**The Fix (A 3-Part Strategy):**

**1. Swap File**
I added a 4GB swap file to my Hetzner instance as a safety net:
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**2. Dependency Pruning**
Gemini audited the Python code and found that `face_utils.py` was exclusively using `insightface`. The `dlib` and `face-recognition` libraries were legacy dependencies that weren't even being imported. I deleted them from `requirements.txt`, dropping build time from 15+ minutes to 2 minutes.

**3. Docker Resource Limits**
Also, memory limits was added to `docker-compose.yml` to prevent any single service from taking down the server:

```yaml
  ai_service:
    build:
      context: .
      dockerfile: apps/ai/Dockerfile
    deploy:
      resources:
        limits:
          memory: 3.5G
        reservations:
          memory: 1.5G
```

---

### Trial 5: The R2 Image URL Bug

With the API running and uploads working, images weren't displaying on the frontend. The browser was trying to load:
```
https://lumina.otagera.xyz/app/apps/api/src/uploads/1777561104304-20251011_092535.jpg
```
A filesystem path disguised as a URL. Meanwhile, the images were actually stored in my Cloudflare R2 bucket.

**What happened?**
Three compounding issues:

1. **Missing R2 Config in Production:** My `production` config was missing the `r2` section entirely. The `StorageService` singleton checks `config[env].r2` to decide between `R2Provider` and `LocalProvider`. Without it, the app always used `LocalProvider`—even though I had `R2_ACCESS_KEY_ID` and `R2_BUCKET` set as environment variables.

2. **Broken Image URL Generation:** `normalizeImagePath()` only transformed paths for development. In production, it returned the raw `image_path` column value—a local filesystem path like `/app/apps/api/src/uploads/filename.jpg`. The frontend prepended its domain to it, creating an invalid URL.

3. **Local Storage Auth Bug:** When using `LocalProvider`, presigned URLs had no authentication. The upload endpoint required either an `Authorization` header or `shareToken`, neither present in the URL—causing `401 Unauthorized` on every upload.

**The Fix:**

I added the `r2` block to production config:
```typescript
r2: {
  access_key_id: process.env.R2_ACCESS_KEY_ID,
  secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET,
  endpoint: process.env.R2_ENDPOINT,
  region: process.env.R2_REGION || "auto",
  public_url: process.env.R2_PUBLIC_URL,
},
```

Then updated `normalizeImagePath()` to construct proper R2 URLs in production, with a fallback to the API's static serving endpoint:
```typescript
const normalizeImagePath = (image_path, storage_provider?, storage_key?) => {
  const env = config.env || "production";
  const envConfig = config[env];

  if (env === "test" || env === "development") {
    const port = envConfig.elysia_port;
    const baseUrl = port ? `${envConfig.base_api_url}:${port}` : envConfig.base_api_url;
    const filename = image_path.split("/").pop();
    return `${baseUrl}/api/uploads/${filename}`;
  } else {
    const r2PublicUrl = envConfig?.r2?.public_url;

    if (r2PublicUrl && image_path) {
      const filename = storage_key || image_path.split("/").pop();
      return `${r2PublicUrl}/${filename}`;
    }

    // Fallback: point to the API's serving endpoint
    if (image_path) {
      const baseUrl = envConfig.base_api_url || "https://lumina-api.otagera.xyz";
      const filename = storage_key || image_path.split("/").pop();
      return `${baseUrl}/api/uploads/${filename}`;
    }

    return image_path;
  }
};
```

I also had to update every call site to pass `storage_provider` and `storage_key` to `normalizeImagePath()`. And for the auth bug, I implemented JWT-based authentication in presigned URLs—the URL itself became self-authenticating, mirroring how S3/R2 presigned URLs work natively.

---

### Conclusion

Transitioning to Coolify and Docker Compose has completely transformed how Lumina is deployed. I now have a robust, GitOps-driven deployment pipeline running on a €3.99/mo Hetzner CX23 instance.

Working through these issues—from Prisma migrations and Nginx SPA routing to Linux memory management and config drift—has been a valuable learning experience. PaaS platforms like Vercel and Railway are incredible, but occasionally stepping down to the bare metal level is what truly makes you a better engineer.
