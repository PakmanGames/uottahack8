# Papa's DO-eria 🎮☁️

A Papa's Pizzeria-style web game where players build DigitalOcean infrastructure for enterprise customers!

## About

Papa's DO-eria is a fun, educational game that teaches cloud infrastructure concepts. Players run a cloud infrastructure shop where enterprise customers (AMD, Amazon, Meta, Netflix, etc.) order cloud configurations. Drag and drop DigitalOcean components to fulfill orders and earn cash!

## Features

- 🏢 **Enterprise Customers** - 12 real tech companies with unique personalities
- 📦 **20 DO Components** - Droplets, Databases, Load Balancers, Kubernetes, and more
- 📋 **12 Infrastructure Scenarios** - Web apps, microservices, ML platforms, gaming backends
- 📄 **Real Terraform Code** - See your infrastructure as Terraform HCL in real-time
- ⏱️ **Time Pressure** - Dynamic timers based on customer patience and order complexity
- 💰 **Scoring System** - Earn cash based on accuracy, speed, and customer tips

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
git clone https://github.com/yourusername/papas-do-eria.git
cd papas-do-eria

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

## How to Play

1. **Read the Order** - Check what components the customer needs
2. **Build Infrastructure** - Click components to add them to the build area
3. **Review Terraform** - Check the live Terraform code preview
4. **Submit** - Deliver the order and earn cash!

### Scoring

- **Base Reward:** $200-$650 depending on order complexity
- **Time Bonus:** Up to 25% extra for fast completion
- **Tips:** Perfect orders earn customer tips (1.0x-1.5x multiplier)
- **Penalties:** Missing components reduce payment; <50% accuracy = $0

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
├── ComponentPalette.tsx        # Draggable components sidebar
├── BuildArea.tsx               # Drop zone for building
├── TerraformPreview.tsx        # Live TF code display
├── CashDisplay.tsx             # Current cash
├── Timer.tsx                   # Countdown timer
├── FeedbackBanner.tsx          # Order result
└── RoundEnd.tsx                # End of round screen
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

## License

MIT
