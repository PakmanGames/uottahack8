#!/bin/bash
set -e
DO_TOKEN="PUT_YOUR_TOKEN_HERE"
if [ ! -f "main.tf" ]; then echo "ERROR: No main.tf here"; exit 1; fi
echo "💧 Making it rain... watch out for falling droplets"
terraform init
terraform apply -var="do_token=$DO_TOKEN"