# DigitalOcean Setup Guide

This guide covers:

1. **Part A**: Deploying the Papa's DO-eria game on App Platform
2. **Part B**: Running generated Terraform code from a Droplet

---

# Part A: Deploy the Game (App Platform)

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
git commit -m "Initial commit: Papa's DO-eria game"
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

---

# Part B: Deploy Generated Terraform Code

After playing Papa's DO-eria, you can deploy the generated Terraform infrastructure to DigitalOcean. This section shows how to run Terraform from a DO Droplet.

---

## Step 1: Get a DigitalOcean API Token

1. Go to [API Tokens](https://cloud.digitalocean.com/account/api/tokens)
2. Click **Generate New Token**
3. Name it (e.g., `terraform-deploy`)
4. Select **Full Access** (Read + Write)
5. Click **Generate Token**
6. **Copy and save the token** - it won't be shown again!

---

## Step 2: Create a Terraform Runner Droplet

This droplet is just for running `terraform` commands - it only makes API calls to DigitalOcean, so it needs minimal resources. The **$4/mo droplet is sufficient**.

> **Note**: This "runner" droplet is separate from the infrastructure your Terraform code creates. You can even destroy it after deploying and your created resources will continue running.

### Option A: Via Console (Recommended)

1. Go to [Droplets](https://cloud.digitalocean.com/droplets)
2. Click **Create Droplet**
3. Choose:
   - **Region**: NYC3 (same region as your app)
   - **Image**: Ubuntu 22.04 (LTS) x64
   - **Size**: Click **Basic** → **Regular** → **$4/mo** (512 MB / 1 CPU)
   - **Authentication**: SSH Key (recommended) or Password
4. Click **Create Droplet**
5. Wait ~30 seconds for the droplet to spin up
6. Copy the IP address shown in the console

### Option B: Via doctl CLI

```bash
doctl compute droplet create terraform-runner \
  --image ubuntu-22-04-x64 \
  --size s-1vcpu-512mb-10gb \
  --region nyc3 \
  --ssh-keys YOUR_SSH_KEY_ID
```

---

## Step 3: SSH into the Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

If prompted about fingerprint, type `yes` to continue.

---

## Step 4: Install Terraform (One-Time Setup)

Run these commands on the Droplet. This only needs to be done once - Terraform will persist for future deployments.

```bash
# Install required packages
apt-get update && apt-get install -y gnupg software-properties-common curl

# Add HashiCorp GPG key
curl -fsSL https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

# Add HashiCorp repository
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list

# Install Terraform
apt-get update && apt-get install -y terraform

# Verify installation
terraform --version
```

---

## Step 5: Deploy Your Infrastructure (Repeat for Each New Config)

> **Note**: Steps 1-4 are one-time setup. From now on, repeat Step 5 each time you want to deploy a new Terraform config from the game.

### 5a. Create a working directory

```bash
mkdir ~/infrastructure && cd ~/infrastructure
```

For subsequent deployments, use a new directory:

```bash
mkdir ~/deploy-$(date +%s) && cd $_
```

### 5b. Create the Terraform file

```bash
nano main.tf
```

**Paste the Terraform code from Papa's DO-eria** into the editor, then save:

- Press `Ctrl+X`
- Press `Y` to confirm
- Press `Enter` to save

**Alternative (faster for demos)**: Paste directly from clipboard:

```bash
cat > main.tf << 'EOF'
# Paste your Terraform code here, then type EOF on a new line
EOF
```

### 5c. Initialize Terraform

```bash
terraform init
```

Expected output:

```
Initializing the backend...
Initializing provider plugins...
- Finding digitalocean/digitalocean versions matching "~> 2.0"...
- Installing digitalocean/digitalocean...

Terraform has been successfully initialized!
```

### 5d. Preview the deployment

```bash
terraform plan -var="do_token=YOUR_API_TOKEN"
```

This shows what resources will be created without actually creating them.

### 5e. Deploy

```bash
terraform apply -var="do_token=YOUR_API_TOKEN"
```

- Review the plan
- Type `yes` when prompted
- Wait for resources to be created (databases may take 5-10 minutes)

### 5f. View outputs

After deployment, Terraform displays useful information:

```
Outputs:

droplet_ips = {
  "droplet_memory_1" = "164.90.xxx.xxx"
  "droplet_memory_2" = "164.90.xxx.yyy"
}

load_balancer_ip = "164.90.xxx.zzz"

database_connection_info = <sensitive>
```

To see sensitive values:

```bash
terraform output database_connection_info
```

---

## Step 6: Clean Up (Important!)

**To avoid charges**, destroy the resources when done:

```bash
terraform destroy -var="do_token=YOUR_API_TOKEN"
```

Type `yes` to confirm. All created resources will be deleted.

---

## Pro Tips

### Save your token as an environment variable

```bash
export DO_TOKEN="dop_v1_your_token_here"
terraform apply -var="do_token=$DO_TOKEN"
```

### Use a terraform.tfvars file

```bash
echo 'do_token = "dop_v1_your_token_here"' > terraform.tfvars
terraform apply  # Automatically uses terraform.tfvars
```

**Note**: Don't commit `terraform.tfvars` to git!

### Quick one-liner deployment

```bash
# Copy code from game, then:
cat > main.tf << 'EOF'
# Paste your Terraform code here
EOF
terraform init && terraform apply -var="do_token=$DO_TOKEN"
```

---

## Estimated Costs

| Resource | Cost |
|----------|------|
| Terraform Runner Droplet | ~$4/month |
| Deployed Infrastructure | Varies (shown in game) |

**Remember to `terraform destroy` after demos to avoid charges on created infrastructure!**

> **Tip**: The runner droplet costs ~$0.006/hour. You can destroy it after demos and recreate when needed, or keep it running as your permanent Terraform workstation.

---

## Troubleshooting

### "Error: Error creating DatabaseCluster"

Database names must be unique. The generated code uses random suffixes, but if you've deployed before, destroy first:

```bash
terraform destroy -var="do_token=$DO_TOKEN"
```

### "Error: Only one container registry allowed per account"

You already have a container registry. Either:

- Remove the registry resource from `main.tf`, or
- Delete your existing registry in the DO console

### "Error: Spaces bucket name already exists"

Bucket names are globally unique. Edit `main.tf` and change the bucket name, or destroy and re-apply (new random suffix will be generated).

### Terraform is slow

Database clusters take 5-10 minutes to provision. This is normal.

---

## Quick Reference: One-Time vs Repeated Steps

### One-Time Setup (do once)

| Step | Command/Action |
|------|----------------|
| Get API Token | DO Console → API → Generate Token |
| Create Runner Droplet | DO Console → Create Droplet ($4/mo) |
| SSH + Install Terraform | `ssh root@IP` then install commands |
| Set token env var | `echo 'export DO_TOKEN="..."' >> ~/.bashrc` |

### Each New Deployment (repeat)

```bash
# 1. SSH into runner (if not already connected)
ssh root@YOUR_DROPLET_IP

# 2. New directory for this deployment
mkdir ~/deploy-$(date +%s) && cd $_

# 3. Create and paste Terraform code
nano main.tf   # paste code, Ctrl+X, Y, Enter

# 4. Deploy
terraform init
terraform apply -var="do_token=$DO_TOKEN"

# 5. When done, clean up
terraform destroy -var="do_token=$DO_TOKEN"
```
