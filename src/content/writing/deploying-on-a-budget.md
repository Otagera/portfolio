---
title: "Deploying React on a Budget"
date: "2026-02-10"
readTime: "4 min"
summary: "Moving from Netlify to a 1GB VPS: Tackling memory limits with swap space and Nginx configuration."
tags: ["deployment", "react", "linux", "devops"]
---

# Deploying React on a Budget

I recently decided to move my portfolio from Netlify to a self-managed VPS to better understand the deployment lifecycle. Transitioning to a cost-effective cloud instance (a small Google Cloud Compute Engine VM) was a great learning experience that came with its own set of technical hurdles.

## How it Started

After provisioning my GCP VM, I updated the system and installed Nginx:

```bash
sudo apt update
sudo apt install nginx -y
```

Next, I installed Node.js using NVM, cloned my repository, and attempted to build the application:

```bash
npm install
npm run build
```

The first issue arose immediately: compatibility. I had to downgrade to Node.js 15 to match the environment requirements of the original portfolio. After the downgrade, I ran the build again, but the process hung indefinitely at `Creating an optimized production build...`.

## The Challenge: Memory Constraints

The root cause was RAM. My instance had only 1GB of RAM. During the build process, Node.js attempts to load the entire application into memory for optimization, hitting the system limit and causing the process to freeze or be killed by the OS.

### Step 1: Creating Swap Space

Since I couldn't "download more RAM," I implemented a Swap file. This allows Linux to use a portion of the hard drive as virtual memory—slower than RAM, but enough to prevent crashes.

I created a 2GB swap file with the following commands:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Step 2: Optimizing Node Memory Usage

Even with swap space, Node.js has its own internal heap limits. I explicitly increased this limit using an environment variable to ensure the build could complete:

```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

It was slower due to the disk I/O, but the build finally finished successfully.

## Configuring the Web Server

With the build artifacts ready, I configured Nginx to serve the static files:

```bash
sudo nano /etc/nginx/sites-available/default
```

I updated the `root` directive to point to the production build directory:

```nginx
root /home/otagera/portfolio/build;
```

After restarting the service (`sudo systemctl restart nginx`), the site was live on the server's IP address.

## DNS and Security

Finally, I pointed my domain (`otagera.xyz`) to the server's External IP using an **A Record**. To secure the site, I used **Certbot** to install a Let's Encrypt SSL certificate:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx
```

I enabled the "Redirect" option to ensure all traffic is automatically upgraded to HTTPS. The result is a fully self-hosted, secure portfolio running on a budget-friendly instance.
