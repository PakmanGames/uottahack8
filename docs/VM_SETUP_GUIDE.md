# VM Setup Guide for Terraform Demos

This guide walks through setting up a fresh DigitalOcean Droplet to run Terraform deployments from the Rain Maker game.

---

## Prerequisites

Before starting, you'll need:

1. A [DigitalOcean account](https://cloud.digitalocean.com/registrations/new)
2. A DigitalOcean API token with **Full Access** (Read + Write)

### Get Your API Token

1. Go to [API Tokens](https://cloud.digitalocean.com/account/api/tokens)
2. Click **Generate New Token**
3. Name it (e.g., `terraform-demo`)
4. Select **Full Access**
5. Click **Generate Token**
6. **Copy and save the token** — it won't be shown again!

---

## Step 1: Create a Terraform Runner Droplet

This droplet runs Terraform commands to deploy infrastructure. Since it only makes API calls, a minimal **$4/mo droplet** is sufficient.

### Via DigitalOcean Console

1. Go to [Droplets](https://cloud.digitalocean.com/droplets)
2. Click **Create Droplet**
3. Configure:
   - **Region**: NYC3 (or your preferred region)
   - **Image**: Ubuntu 22.04 (LTS) x64
   - **Size**: Basic → Regular → **$4/mo** (512 MB / 1 CPU)
   - **Authentication**: SSH Key (recommended) or Password
4. Click **Create Droplet**
5. Wait ~30 seconds, then copy the IP address

---

## Step 2: SSH into the Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

Type `yes` if prompted about the fingerprint.

---

## Step 3: Install Terraform

Run these commands to install Terraform on the droplet:

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

## Step 4: Set Up Environment

### Configure API Token

Add your DigitalOcean API token as an environment variable:

```bash
echo 'export DO_TOKEN="dop_v1_your_token_here"' >> ~/.bashrc
source ~/.bashrc
```

> **Important**: Replace `dop_v1_your_token_here` with your actual token.

### Create Scripts Directory

```bash
mkdir -p ~/bin
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

---

## Step 5: Install Demo Scripts

The project includes three helper scripts for quick demo deployments:

### 5a. Install `raincloud` Function

Since `raincloud.sh` needs to change your working directory, it must be set up as a shell function. Add this to your `~/.bashrc`:

```bash
cat >> ~/.bashrc << 'EOF'

# Rain Maker: Create demo folder and accept terraform code
raincloud() {
    NAME="${1:-demo-$(date +%s)}"
    DIR=~/"$NAME"

    mkdir -p "$DIR"
    cd "$DIR"

    echo "Clouds at: $DIR"
    echo ""
    echo "Paste your Terraform code, then press Ctrl+D:"
    cat > main.tf

    echo ""
    echo "It might just rain soon..."
    echo ""
    cd "$DIR"
}
EOF
source ~/.bashrc
```

### 5b. Install `makeitrain` Script

Create the script that runs Terraform:

```bash
cat > ~/bin/makeitrain << 'EOF'
#!/bin/bash
set -e
DO_TOKEN="PUT_YOUR_TOKEN_HERE"
if [ ! -f "main.tf" ]; then echo "ERROR: No main.tf here"; exit 1; fi
echo "💧 Making it rain... watch out for falling droplets"
terraform init
terraform apply -var="do_token=$DO_TOKEN"
EOF
chmod +x ~/bin/makeitrain
```

> **Important**: Edit the script and replace `PUT_YOUR_TOKEN_HERE` with your actual DO token:
>
> ```bash
> nano ~/bin/makeitrain
> ```

### 5c. Install `cleanup` Script

Create the script that destroys all demo resources:

```bash
cat > ~/bin/cleanup << 'EOF'
#!/bin/bash
set -e
DO_TOKEN="PUT_YOUR_TOKEN_HERE"

echo "Wiping away all the rain..."

for dir in ~/demo-* ~/deploy-* ~/demo* ~/papa-*; do
    if [ -d "$dir" ] && [ -f "$dir/terraform.tfstate" ]; then
        echo "Destroying $dir..."
        cd "$dir"
        terraform destroy -var="do_token=$DO_TOKEN" -auto-approve
    fi
done

echo "✅ No more droplets in sight"
EOF
chmod +x ~/bin/cleanup
```

> **Important**: Edit the script and replace `PUT_YOUR_TOKEN_HERE` with your actual DO token:
>
> ```bash
> nano ~/bin/cleanup
> ```

---

## Step 6: Verify Setup

Test that everything is installed correctly:

```bash
# Check Terraform
terraform --version

# Check scripts are in PATH
which makeitrain
which cleanup

# Check raincloud function
type raincloud
```

---

## Demo Workflow

Once setup is complete, deploying Terraform code from Rain Maker is simple:

### 1. Create a Demo and Paste Code

```bash
raincloud my-demo
```

1. Paste your Terraform code from the game
2. Press **Ctrl+D** to save
3. You're now in `~/my-demo` with `main.tf` ready

### 2. Deploy the Infrastructure

```bash
makeitrain
```

- Review the Terraform plan
- Type `yes` to confirm
- Wait for resources to be created (droplets take ~1-2 min, databases take 5-10 min)

### 3. View Created Resources

```bash
terraform output
```

Or check the DigitalOcean console.

### 4. Clean Up When Done

From any directory, destroy all demo resources:

```bash
cleanup
```

This automatically finds and destroys all `~/demo-*`, `~/deploy-*`, and `~/papa-*` directories with Terraform state.

---

## Quick Reference

| Action | Command |
|--------|---------|
| Create new demo | `raincloud demo-name` |
| Deploy infrastructure | `makeitrain` |
| Preview plan only | `terraform plan -var="do_token=$DO_TOKEN"` |
| View outputs | `terraform output` |
| Destroy current demo | `terraform destroy -var="do_token=$DO_TOKEN"` |
| Destroy ALL demos | `cleanup` |

---

## Troubleshooting

### "Command not found: makeitrain"

Ensure `~/bin` is in your PATH:

```bash
source ~/.bashrc
```

### "ERROR: No main.tf here"

Run `makeitrain` from a directory containing `main.tf`:

```bash
cd ~/demo-name
makeitrain
```

### "Error: Only one container registry allowed per account"

You already have a container registry. Either:

- Remove the registry resource from `main.tf`
- Delete existing registry in DO Console (Container Registry → Settings → Destroy)

### Terraform is slow

Database clusters take 5-10 minutes to provision. This is normal. Use **Demo Mode** in the game to filter out slow-provisioning resources.

### Token not working

Verify your token is set correctly:

```bash
echo $DO_TOKEN
```

If empty, re-run:

```bash
source ~/.bashrc
```

---

## Cost Awareness

| Resource | Approx. Cost |
|----------|--------------|
| Runner Droplet | $4/month (~$0.006/hour) |
| Created Droplets | $4-84/month each |
| Load Balancer | $12/month |
| Databases | $15+/month |

**Remember**: Always run `cleanup` or `terraform destroy` after demos to avoid unexpected charges!

---

## Related Documentation

- [DIGITALOCEAN_SETUP.md](./DIGITALOCEAN_SETUP.md) — Full setup guide including App Platform deployment
- [TERRAFORM_QUICK_REFERENCE.md](./TERRAFORM_QUICK_REFERENCE.md) — Quick command reference for demos
- [SPEC.md](./SPEC.md) — Full technical specification

---
