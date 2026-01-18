#!/bin/bash
# Papa's DO-eria - Make It Rain
# Runs terraform init && apply in current directory
#
# SETUP:
#   1. Copy to ~/bin/makeitrain (no .sh extension)
#   2. chmod +x ~/bin/makeitrain
#   3. Replace YOUR_TOKEN_HERE with your actual DO token
#
# USAGE:
#   cd ~/demo-myproject
#   makeitrain

set -e

# REPLACE WITH YOUR ACTUAL TOKEN
DO_TOKEN="dop_v1_YOUR_TOKEN_HERE"

if [ ! -f "main.tf" ]; then
    echo "ERROR: No main.tf in current directory"
    echo "Run 'raincloud my-demo' first to create one"
    exit 1
fi

echo "💰 Making it rain..."
echo ""

terraform init
terraform apply -var="do_token=$DO_TOKEN"
