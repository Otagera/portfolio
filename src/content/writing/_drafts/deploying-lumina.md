---
title: "Deploying Lumina: A Scalable AI Photo App on Hetzner & Coolify"
date: "2026-05-02"
readTime: "8 min"
summary: "How I deployed a complex monorepo stack for $4/month using Coolify, while overcoming OOM crashes and configuration drift."
tags: ["deployment", "hetzner", "coolify", "docker", "devops"]
draft: true
---

# Deploying Lumina: A Scalable AI Photo App on Hetzner & Coolify

When it comes to deploying side projects, the modern indie hacker is spoiled for choice. I have used platforms like Railway and Render that offer a smooth "git push to deploy" experience. But as your architecture grows—especially when dealing with databases, background workers, and AI services—those managed platforms can quickly burn a hole in your wallet with usage-based billing.

For [Lumina](https://lumina.otagera.xyz/) (an AI-powered photo sharing and face-matching application), I wanted the magic of PaaS. Railway could have worked, but the educational value of managing my own server, plus the absolute cost predictability of a VPS, made me reconsider. Previously, my deployments involved manually SSHing into a GCP instance, running `git pull`, and restarting `pm2`. It was tedious.

This time, I chose the **Hetzner CX23 plan (2 vCPUs, 4GB RAM for ~€4/month)** paired with [**Coolify**](https://coolify.io/). It's like having your own personal Vercel and Railway, but for a fraction of the cost and with total control over the environment.

Here is the technical breakdown of how I deployed a Monorepo containing a React Client, Bun API, Python AI Service, BullMQ Worker, Postgres (pgvector), and Redis—starting from absolute scratch, and the trials I faced along the way.

---

## The Setup (From Bare Metal to First Deploy)

If you are moving from a managed PaaS to a VPS, the initial setup can seem daunting. Here is the step-by-step guide on how I bridged the gap using Coolify.

### Step 1: Provisioning the Server & DNS
Before you can install anything, you need a server and a way to reach it.

1. **Get a Server:** I signed up for Hetzner Cloud and created a new project. I selected the **CX23** instance running **Ubuntu 22.04**. I chose the Helsinki, Finland location and selected IPv4 (Coolify works best with an IPv4 address). 
2. **Get the IP Address:** Once the server booted up, Hetzner provided a public IP address (e.g., `123.45.67.89`).
3. **Configure DNS (Cloudflare):** I logged into Cloudflare and created a new **A Record**:
   * Name: `admin` (This creates `admin.otagera.xyz` for the Coolify dashboard).
   * Content/IPv4 address: Paste the Hetzner IP address here.
   * Proxy status: **DNS Only** for the initial setup.

### Step 2: Installing Coolify
Coolify installs its entire orchestration stack (Docker, Traefik proxy, its own database, and dashboard) with a single command.

1. Open your terminal and SSH into your new Hetzner server:
   ```bash
   ssh root@123.45.67.89
   ```
2. Run the official Coolify installation script:
   ```bash
   curl -fsSL https://get.coollabs.io/coolify/install.sh | bash
   ```
3. Go grab a coffee. This process takes 5-10 minutes. When it finishes, Coolify will be running at `http://<server-ip>:8000`.

### Step 3: Securing the Dashboard
1. Open a browser and visit `http://123.45.67.89:8000`.
2. Create your admin account and complete the onboarding.
3. In the Coolify dashboard, navigate to **Settings** -> **General**.
4. Change the "Instance URL" to your secure domain: `https://admin.otagera.xyz`. 
5. Save the settings. Coolify will automatically provision an SSL certificate via Let's Encrypt.

### Step 4: Configuring the Resources
Lumina is a monorepo, meaning both the frontend and backend live in the same Git repository. I navigated to **Projects** -> **Add New Project**, connected my GitHub repository, and set up two distinct resources:

#### 1. The Client (Frontend)
For the React/Vite frontend, I used the **Static** build pack.
* **Base Directory:** `apps/client`
* **Build Command:** `bun run build`
* **Output Directory:** `dist`
* **FQDN (Domain):** `https://lumina.otagera.xyz`

#### 2. The Backend Stack (API, DB, Worker, AI)
For the backend, I used the **Docker Compose** build pack.
* Coolify automatically parsed my root `docker-compose.yml` (`db`, `redis`, `api`, `worker`, `ai_service`).
* I set the **api** service **FQDN** to `https://lumina-api.otagera.xyz`. 

By assigning a public domain *only* to the `api` service, the Database, Redis, and AI Service remain safely hidden behind the firewall on the internal Docker network.

---

## The Trials: Heading to Production

### Trial 1: The Prisma "Drift" Dilemma

The first deployment failed during `bunx prisma db seed` with: `Error: The table public.plans does not exist.`

**The Issue:**
During local development, I relied on `prisma db push`. In production, I used `prisma migrate deploy`, which strictly follows the `prisma/migrations` folder. I had added new tables but forgotten to generate the migration files, causing a "Drift" between the schema and the migration history.

**The Fix:**
I synchronized the schema locally and generated the missing SQL:
```bash
cd apps/api
bunx prisma migrate dev --name add_plans_and_notifications
```
Once pushed, Coolify ran `migrate deploy` successfully.

---

### Trial 2: Cloudflare SSL and the Nested Subdomain

Hitting the API returned a **Cloudflare Error 526: Invalid SSL Certificate**.

**The Issue:**
Cloudflare's free Universal SSL certificate covers exactly *one* level of subdomains (`*.domain.com`). It does **not** cover nested subdomains like `api.lumina.otagera.xyz`.

**The Fix:**
I flattened the architecture to keep everything on the first level:
* Frontend: `https://lumina.otagera.xyz`
* API: `https://lumina-api.otagera.xyz`

*(Bonus: For the SPA 404 issue on refresh, I toggled the "Is SPA" setting in Coolify to inject the `try_files` routing rule.)*

---

### Trial 3: Hunting Down Configuration Drift

After deployment, uploads failed with: `http://localhost:undefined/api/v1/...`.

**The Issue:**
My `production` config block was missing keys I'd added to `development`. Specifically, the `cors_origin` and the base URL logic were falling back to defaults that only made sense locally.

**The Fix:**
I explicitly mapped the public URLs in the production config:
```typescript
production: {
  base_api_url: process.env.BASE_API_URL || "https://lumina-api.otagera.xyz",
  elysia_port: process.env.ELYSIA_PORT || 3005,
  cors_origin: process.env.CORS_ORIGIN,
  ai_service_url: "http://ai_service:8000",
}
```

---

### Trial 4: The OOM Server Crash

The 4GB of RAM on the CX23 instance ran out, freezing the server during deployments. Coolify threw 504 errors, and SSH connections dropped.

**The Issue:**
The `apps/ai/Dockerfile` was compiling `dlib`—a heavy C++ library—from source. This process consumed massive amounts of CPU and RAM, triggering the Linux Out-Of-Memory (OOM) killer which took down the entire server.

**The Fix:**
1. **Swap File:** Added a 4GB swap file as a safety net.
2. **Dependency Pruning:** Removed `dlib` and `face-recognition` after realizing our code had migrated to `insightface`. Build time dropped from 15 minutes to 2.
3. **Resource Limits:** Added memory limits to `docker-compose.yml`:
```yaml
deploy:
  resources:
    limits:
      memory: 2G
    reservations:
      memory: 1G
```

---

### Trial 5: The R2 Image URL Mystery

Images uploaded to Cloudflare R2 wouldn't display, showing filesystem paths like `/app/uploads/...` instead of URLs.

**The Issue:**
The `StorageService` defaulted to the `LocalProvider` because the `r2` config block was missing from the production environment, even though the environment variables were present. Additionally, `normalizeImagePath()` wasn't aware of the R2 public URL in production.

**The Fix:**
I added the `r2` block to the production config and updated `normalizeImagePath()` to construct proper R2 URLs, with a fallback to the API's static endpoint. I also implemented JWT-based authentication for presigned URLs to fix an "Unauthorized" bug when using local storage.

---

### Conclusion

Transitioning to Coolify and Docker Compose has transformed Lumina's deployment. I now have a robust, GitOps-driven pipeline running on a **~€4/mo Hetzner CX23** instance.

Working through these trials—from Prisma migrations to Linux memory management—has been a masterclass in systems engineering. PaaS platforms like Vercel are incredible, but occasionally stepping down to the "bare metal" is what truly makes you a better engineer.

### Additional Resources
If you're looking to replicate this setup, I highly recommend this video guide:

📺 [**Self-host EVERYTHING with Coolify - Full Guide**](https://www.youtube.com/watch?v=kCRDidMJRsY)
