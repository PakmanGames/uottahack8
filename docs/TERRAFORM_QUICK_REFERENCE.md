# Terraform Quick Reference for Demos

Quick commands for deploying generated Terraform code from Papa's DO-eria.

---

## Prerequisites (One-Time Setup)

These steps are already done if you have a Terraform Runner Droplet set up:

1. **Terraform Runner Droplet**: $4/mo Ubuntu 22.04 droplet on DigitalOcean
2. **Terraform installed**: `terraform --version` should show v1.14+
3. **DO API Token**: Get from <https://cloud.digitalocean.com/account/api/tokens>

### Set Token as Environment Variable (Recommended)

Run once per SSH session, or add to `~/.bashrc` for persistence:

```bash
export DO_TOKEN="dop_v1_your_token_here"
```

To make permanent:

```bash
echo 'export DO_TOKEN="dop_v1_your_token_here"' >> ~/.bashrc
source ~/.bashrc
```

---

## Per-Demo Commands

### 1. Create New Directory for This Demo

```bash
mkdir ~/demo-NAME && cd ~/demo-NAME
```

Or with timestamp:

```bash
mkdir ~/deploy-$(date +%s) && cd $_
```

### 2. Create Terraform File

```bash
nano main.tf
```

1. Paste the Terraform code from Papa's DO-eria
2. Press `Ctrl+X`
3. Press `Y`
4. Press `Enter`

### 3. Initialize Terraform

```bash
terraform init
```

Expected output: "Terraform has been successfully initialized!"

### 4. Preview (Optional)

```bash
terraform plan -var="do_token=$DO_TOKEN"
```

Shows what will be created without creating it.

### 5. Deploy

```bash
terraform apply -var="do_token=$DO_TOKEN"
```

- Review the plan
- Type `yes` to confirm
- Wait for resources (databases take 5-10 min)

### 6. View Outputs

```bash
terraform output
```

For sensitive values (database credentials):

```bash
terraform output database_connection_info
```

### 7. Destroy When Done

```bash
terraform destroy -var="do_token=$DO_TOKEN"
```

Type `yes` to confirm. **Important to avoid charges!**

---

## Managing Multiple Demos

### List All Demo Directories

```bash
ls -la ~/
```

### Switch Between Demos

```bash
cd ~/demo-1
terraform show  # See what's deployed

cd ~/demo-2
terraform show
```

### Destroy All Demos (End of Session)

```bash
for dir in ~/demo-* ~/deploy-*; do
  if [ -d "$dir" ]; then
    cd "$dir"
    terraform destroy -var="do_token=$DO_TOKEN" -auto-approve
  fi
done
```

---

## Common Errors & Fixes

### "Error: Only one container registry allowed per account"

```bash
# Option 1: Remove from main.tf before applying
nano main.tf  # Delete the container_registry resource

# Option 2: Delete existing registry in DO Console
# Go to: Container Registry → Settings → Destroy
```

### "Error: Spaces bucket name already exists"

Bucket names are globally unique. The generated code uses random suffixes, but if collision occurs:

```bash
nano main.tf
# Change bucket name to something unique
```

### "Error creating DatabaseCluster"

Destroy existing and re-apply:

```bash
terraform destroy -var="do_token=$DO_TOKEN"
terraform apply -var="do_token=$DO_TOKEN"
```

### Terraform Command Not Found

Re-run install:

```bash
apt-get update && apt-get install -y terraform
```

---

## Demo Scripts

Three scripts in `scripts/` for easy demo workflow:

| Script | Purpose |
|--------|---------|
| `raincloud.sh` | Create demo folder + paste terraform code |
| `makeitrain.sh` | Run `terraform init && apply` |
| `cleanup.sh` | Destroy all resources + delete folders |

### One-Time Setup on Droplet

```bash
# Create ~/bin and add to PATH
mkdir -p ~/bin
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Copy scripts (replace YOUR_TOKEN in makeitrain and cleanup)
# See scripts/*.sh for contents

# For raincloud to cd into the directory, add the function to ~/.bashrc:
cat >> ~/.bashrc << 'EOF'
raincloud() {
    NAME="${1:-demo-$(date +%s)}"
    DIR=~/"$NAME"
    mkdir -p "$DIR"
    echo "📁 Created: $DIR"
    echo ""
    echo "Paste your Terraform code, then press Ctrl+D:"
    cat > "$DIR/main.tf"
    echo ""
    echo "✅ Saved to $DIR/main.tf"
    cd "$DIR"
    echo "📂 Now in: $(pwd)"
    echo "Run 'makeitrain' to deploy"
}
EOF
source ~/.bashrc
```

### Workflow

```bash
# Step 1: Create demo and paste code
raincloud my-demo
# [paste terraform code, Ctrl+D]
# Now you're in ~/my-demo

# Step 2: Deploy
makeitrain

# Step 3: When done, cleanup all
cleanup
```

---

## Cheat Sheet

| Action | Command |
|--------|---------|
| New demo directory | `mkdir ~/demo-X && cd ~/demo-X` |
| Create config file | `nano main.tf` (paste, Ctrl+X, Y, Enter) |
| Initialize | `terraform init` |
| Deploy | `terraform apply -var="do_token=$DO_TOKEN"` |
| See outputs | `terraform output` |
| See deployed resources | `terraform show` |
| Destroy | `terraform destroy -var="do_token=$DO_TOKEN"` |
| Check version | `terraform --version` |
