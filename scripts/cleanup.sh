#!/bin/bash
# Papa's DO-eria - Cleanup
# Destroys all demo resources and removes directories
#
# SETUP:
#   1. Copy to ~/bin/cleanup
#   2. chmod +x ~/bin/cleanup
#   3. Replace YOUR_TOKEN_HERE with your actual DO token
#
# USAGE:
#   cleanup              # Destroys all demo resources and folders

set -e

# REPLACE WITH YOUR ACTUAL TOKEN
DO_TOKEN="dop_v1_YOUR_TOKEN_HERE"

echo "🧹 Cleaning up all demos..."
echo ""

found=0
for dir in ~/demo-* ~/deploy-* ~/papa-*; do
    if [ -d "$dir" ] && [ -f "$dir/terraform.tfstate" ]; then
        found=1
        echo "Destroying $(basename "$dir")..."
        cd "$dir"
        terraform destroy -var="do_token=$DO_TOKEN" -auto-approve
        cd ~
        rm -rf "$dir"
        echo "Removed $dir"
        echo ""
    fi
done

if [ $found -eq 0 ]; then
    echo "No deployed demos found."
else
    echo "✅ Cleanup complete!"
fi
