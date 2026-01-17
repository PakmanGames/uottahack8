# Papa's Kuberia 🎮☸️

A Papa's Freezeria-style web game where "orders" are Kubernetes ops tickets!

## About

Papa's Kuberia is a fun, educational game that teaches Kubernetes operations in an engaging way. Players take on the role of a Kubernetes operator, completing tickets to scale deployments and restart pods before time runs out.

## Features

- 🎫 **Ticket-based gameplay** - Complete ops tickets one at a time
- ⚖️ **Scale Deployments** - Select the right deployment and replica count
- 🔄 **Restart Pods** - Choose the correct pod to restart
- ⏱️ **Time pressure** - 30 seconds per ticket with time bonus scoring
- 📊 **Score tracking** - Base 100 points + 2 points per remaining second
- 🏆 **Star ratings** - Get rated based on your final score

## Tech Stack

- **Framework:** Next.js 14 (App Router)
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
git clone https://github.com/yourusername/papas-kuberia.git
cd papas-kuberia

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

## Game Rules

1. Each game consists of 5 tickets
2. Complete each ticket within 30 seconds
3. For **SCALE_DEPLOYMENT**: Select the correct deployment and set the target replica count
4. For **RESTART_POD**: Select the correct pod to restart
5. Score = 100 base points + (remaining seconds × 2)
6. Wrong answers or timeouts = 0 points

## Project Structure

```
app/
├── page.tsx                    # Main game UI
├── layout.tsx
├── globals.css
└── api/
    ├── cluster/route.ts        # GET - returns cluster state
    ├── ticket/route.ts         # POST - generates new ticket
    ├── action/route.ts         # POST - validates and applies action
    └── reset/route.ts          # POST - resets game state

lib/
├── types.ts                    # TypeScript types
├── cluster-state.ts            # In-memory state manager
└── ticket-generator.ts         # Random ticket generation

components/
├── TicketCard.tsx
├── ActionControls.tsx
├── ClusterPanel.tsx
├── Timer.tsx
├── ScoreDisplay.tsx
├── FeedbackBanner.tsx
└── GameOver.tsx
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
- [DigitalOcean Setup Guide](docs/DIGITALOCEAN_SETUP.md)

## License

MIT
