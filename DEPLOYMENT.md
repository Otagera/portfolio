# Deployment Guide: Astro SSR on VM

This guide explains how to deploy and update the portfolio on your VM using **Nginx** as a reverse proxy and **PM2** as the process manager.

## 1. Prerequisites (Run these on the VM)

Ensure you have Node.js and PM2 installed:
```bash
# Install PM2 globally if not already present
npm install -g pm2
```

## 2. Initial Migration (From React Static to Astro SSR)

### Step A: Update Nginx Configuration
Edit your Nginx config (`/etc/nginx/sites-available/default`) to replace the static `root` and `try_files` with the reverse proxy block:

```nginx
# Replace your current 'location /' block with this:
location / {
    proxy_pass http://localhost:4321;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
**Test and Reload Nginx:**
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Step B: Build and Start the Application
```bash
# 1. Install dependencies
npm install

# 2. Build the project (creates the dist/ folder)
npm run build

# 3. Start with PM2
pm2 start dist/server/entry.mjs --name "portfolio"

# 4. Save PM2 list so it restarts on VM reboot
pm2 save
```

---

## 3. Workflow for Code Changes

When you make changes to your code locally and push them to GitHub, follow these steps on the VM to apply the updates:

### Step 1: Pull the latest code
```bash
git pull origin main
```

### Step 2: Rebuild the application
Astro SSR requires a fresh build to generate the updated server-side logic.
```bash
npm run build
```

### Step 3: Restart the process
Since the server is already running under PM2, you just need to tell it to reload the new build.
```bash
pm2 restart portfolio
```

**Note:** You do **NOT** need to restart Nginx when you change your application code. Nginx only needs a reload if you modify the `.conf` files in `/etc/nginx/`.

---

## 4. Useful Commands

| Command | Purpose |
| :--- | :--- |
| `pm2 status` | Check if the portfolio is running |
| `pm2 logs portfolio` | See real-time server logs (useful for debugging) |
| `pm2 stop portfolio` | Stop the server |
| `sudo systemctl status nginx` | Check Nginx status |
