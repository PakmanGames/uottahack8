#!/bin/bash
# Papa's DO-eria - Rain Cloud
# Creates a demo directory and main.tf file
#
# NOTE: This is a SCRIPT version. For the cd to work after running,
# add the FUNCTION version to your ~/.bashrc instead (see bottom of file).
#
# SETUP (script version):
#   1. Copy to ~/bin/raincloud
#   2. chmod +x ~/bin/raincloud
#
# USAGE:
#   raincloud my-demo    # Creates ~/my-demo/main.tf
#   raincloud            # Creates ~/demo-TIMESTAMP/main.tf

set -e

NAME="${1:-demo-$(date +%s)}"
DIR=~/"$NAME"

mkdir -p "$DIR"

echo "📁 Created: $DIR"
echo ""
echo "Paste your Terraform code, then press Ctrl+D:"
cat > "$DIR/main.tf"

echo ""
echo "✅ Saved to $DIR/main.tf"
echo ""
echo "To deploy, run:"
echo "  cd $DIR && makeitrain"

# ============================================
# FUNCTION VERSION (add to ~/.bashrc)
# This version will cd into the directory after creating it
# ============================================
#
# raincloud() {
#     NAME="${1:-demo-$(date +%s)}"
#     DIR=~/"$NAME"
#     
#     mkdir -p "$DIR"
#     
#     echo "📁 Created: $DIR"
#     echo ""
#     echo "Paste your Terraform code, then press Ctrl+D:"
#     cat > "$DIR/main.tf"
#     
#     echo ""
#     echo "✅ Saved to $DIR/main.tf"
#     
#     cd "$DIR"
#     echo "📂 Now in: $(pwd)"
#     echo ""
#     echo "Run 'makeitrain' to deploy"
# }
