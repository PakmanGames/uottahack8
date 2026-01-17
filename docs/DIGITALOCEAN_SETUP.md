# DigitalOcean App Platform Setup Guide

This guide walks you through deploying Papa's Kuberia on DigitalOcean App Platform.

---

## Prerequisites

1. A [DigitalOcean account](https://cloud.digitalocean.com/registrations/new)
2. Your code pushed to a GitHub repository
3. GitHub account connected to DigitalOcean

---

## Step 1: Push Code to GitHub

Ensure your repository contains the complete Next.js application:

```bash
git add .
git commit -m "Initial commit: Papa's Kuberia game"
git push origin main
```

---

## Step 2: Create a New App on DigitalOcean

1. Log in to [DigitalOcean Cloud Console](https://cloud.digitalocean.com/)
2. Navigate to **Apps** in the left sidebar
3. Click **Create App**

---

## Step 3: Connect Your Repository

1. Select **GitHub** as your source
2. If prompted, authorize DigitalOcean to access your GitHub account
3. Select your repository (e.g., `yourusername/papas-kuberia`)
4. Choose the branch to deploy (typically `main`)
5. Enable **Autodeploy** if you want automatic deployments on push

---

## Step 4: Configure Build Settings

DigitalOcean should auto-detect Next.js, but verify these settings:

| Setting | Value |
|---------|-------|
| **Type** | Web Service |
| **Environment** | Node.js |
| **Build Command** | `npm run build` |
| **Run Command** | `npm start` |
| **HTTP Port** | `3000` |

### Resource Size

For this application, the **Basic** plan ($5/month) is sufficient:
- 512 MB RAM
- 1 vCPU

---

## Step 5: Environment Variables (Optional)

No environment variables are required for the base game. However, if you add features later:

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Set to `production` (auto-set by DO) |

---

## Step 6: Review and Launch

1. Review your app configuration
2. Choose your plan (Basic is fine for hackathons/demos)
3. Click **Create Resources**

---

## Step 7: Wait for Deployment

1. DigitalOcean will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build the app (`npm run build`)
   - Start the server (`npm start`)

2. Deployment typically takes 2-5 minutes

3. Once complete, you'll receive a URL like:
   ```
   https://papas-kuberia-xxxxx.ondigitalocean.app
   ```

---

## Post-Deployment

### Custom Domain (Optional)

1. Go to your app's **Settings** tab
2. Click **Domains**
3. Add your custom domain
4. Update your DNS records as instructed

### Monitoring

- View logs in the **Runtime Logs** tab
- Monitor resource usage in the **Insights** tab

### Scaling

If you need more resources:
1. Go to **Settings** > **App Spec**
2. Upgrade to a larger instance size

---

## Troubleshooting

### Build Fails

- Check **Build Logs** for specific errors
- Ensure `package.json` has correct scripts:
  ```json
  {
    "scripts": {
      "build": "next build",
      "start": "next start"
    }
  }
  ```

### App Crashes on Start

- Check **Runtime Logs** for errors
- Verify port is set to `3000`
- Ensure no hardcoded localhost references

### Slow Performance

- Upgrade to a larger instance
- Consider enabling caching headers

---

## Estimated Costs

| Resource | Cost |
|----------|------|
| Basic Web Service | ~$5/month |
| Pro Web Service | ~$12/month |
| Custom Domain | Free (BYO domain) |

---

## Quick Reference

| Item | Value |
|------|-------|
| Build Command | `npm run build` |
| Run Command | `npm start` |
| Port | `3000` |
| Node Version | 18+ (auto-detected) |
| Health Check Path | `/` |

---

## Need Help?

- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [DigitalOcean Community](https://www.digitalocean.com/community)
