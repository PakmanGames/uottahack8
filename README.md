# Rain Maker 🌧️⛈️💰

> *"Rainy with a chance of rogue tech, infrastructure as clouds (IaC) to make it rain"*

A rogue-like web game where you build DigitalOcean infrastructure with Terraform and make it rain!

## About

Rain Maker is a fun, educational game that teaches cloud infrastructure concepts with a weather/storm theme. Players weather the storm as enterprise customers (AMD, Amazon, Meta, Netflix, etc.) request cloud configurations. Build cloud infrastructure, generate Terraform code, and make it rain with that sweet cloud cash!

## Features

- 🌩️ **Weather-Themed Gameplay** - Storm through infrastructure challenges
- 🏢 **Enterprise Customers** - 12 real tech companies with unique personalities
- ☁️ **20 Cloud Components** - Droplets, Databases, Load Balancers, Kubernetes, and more
- 📋 **12 Infrastructure Scenarios** - Web apps, microservices, ML platforms, gaming backends
- 📄 **Real Terraform Code** - See your infrastructure as Terraform HCL in real-time
- ⏱️ **Storm Timers** - Dynamic timers based on customer patience and order complexity
- 💰 **Make It Rain** - Earn cash based on accuracy, speed, and customer tips
- ⚡ **Power-Ups** - Rogue-like upgrade shop between rounds

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Hosting:** DigitalOcean App Platform

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rain-maker.git
cd rain-maker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start the storm!

## How to Make It Rain ☁️💸

1. **📡 Read the Forecast** - Check what cloud infrastructure the customer needs
2. **☁️ Build the Clouds** - Click components to add them to your cloud formation
3. **📄 Generate Terraform** - Watch your infrastructure code form in real-time
4. **🌧️ Make It Rain** - Deploy and collect that sweet cloud cash!

### Scoring

- **Base Reward:** $200-$650 depending on order complexity
- **Time Bonus:** Up to 25% extra for fast completion
- **Tips:** Perfect storms earn customer tips (1.0x-1.5x multiplier)
- **Penalties:** Missing components reduce payment; <50% accuracy = $0

### Power-Ups

- ⏰ **Storm Extension** - More time before the storm passes
- ✨ **Golden Clouds** - Increase bonus earnings
- 🤖 **Cloud Automation** - Auto-spawns starting components
- 🌀 **Hurricane Mode** - Unlock harder storms with bigger payouts

## Project Structure

```
app/
├── page.tsx                    # Main game UI
├── layout.tsx
├── globals.css
└── api/
    ├── order/route.ts          # POST - generates new order
    ├── submit/route.ts         # POST - validates and scores order
    └── reset/route.ts          # POST - resets game state

lib/
├── types.ts                    # TypeScript types
├── components-data.ts          # DO component definitions
├── customers-data.ts           # Customer profiles
├── order-generator.ts          # Random order generation
├── terraform-generator.ts      # TF code generation
└── scoring.ts                  # Calculate cash/accuracy

components/
├── OrderTicket.tsx             # Customer order display
├── ComponentPalette.tsx        # Cloud components sidebar
├── BuildArea.tsx               # Cloud formation zone
├── TerraformPreview.tsx        # Live TF code display
├── CashDisplay.tsx             # Current cash
├── Timer.tsx                   # Storm countdown timer
├── FeedbackBanner.tsx          # Order result
├── RoundEnd.tsx                # End of storm screen
└── Shop.tsx                    # Power-up shop
```

## Deployment

See [docs/DIGITALOCEAN_SETUP.md](docs/DIGITALOCEAN_SETUP.md) for deployment instructions.

### Quick Deploy

```bash
npm run build
npm start
```

## Documentation

- [Technical Specification](docs/SPEC.md)
- [Implementation Status](docs/IMPLEMENTATION_STATUS.md)
- [DigitalOcean Setup Guide](docs/DIGITALOCEAN_SETUP.md)
- [Terraform Quick Reference](docs/TERRAFORM_QUICK_REFERENCE.md)

## License

MIT

---

*Built with ⛈️ for uOttaHack8*
