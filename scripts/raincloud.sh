#!/bin/bash
set -e

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