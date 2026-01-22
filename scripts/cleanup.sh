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