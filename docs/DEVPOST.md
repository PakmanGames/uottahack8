# Rain Maker

## Inspiration

What if we made [Papa's Pizzeria](https://papaspizzeria.io/) but for DigitalOcean instances?

## What it does

Rain Maker is a rogue-like game where you speedrun building cloud infrastructure for impatient enterprise clients. Netflix needs a chat system? Drag in some droplets, a Redis cache, and a load balancer. Then copy the Terraform config and make it rain. (Deploys to DigitalOcean)

## How we built it

- Next.js 15 + TypeScript + Tailwind
- DigitalOcean App Platform
- Terraform
- Shell scripts for deploying Terraform code to a DigitalOcean Droplet

## Challenges we ran into

- Translating game logic to Terraform code
- Configuring DigitalOcean services and APIs to work with Terraform and our droplet
- Writing shell scripts for deploying Terraform code to a DigitalOcean Droplet

## Accomplishments that we're proud of

- Learned a lot about Terraform and DigitalOcean
- Deployed our application
- We are a duo and made this in a weekend while exploring Ottawa during uOttaHack8

## What we learned

- How to use DigitalOcean
- Terraform configurations
- Infrastructure as Code

## What's next for Rain Maker

- Let's improve the UI and create real game assets
- Make gameplay loop for exciting and engaging
- Automate the initial setup of the Droplet which runs the Terraform configurations
