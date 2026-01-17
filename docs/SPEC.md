# Papa's DO-eria - Technical Specification

> A Papa's Pizzeria-style web game where players build DigitalOcean infrastructure for enterprise customers.  
> **Stack:** Next.js 15 (App Router) + Tailwind CSS + TypeScript  
> **Hosting:** DigitalOcean App Platform  
> **Mode:** Simulation with Terraform code generation

---

## ⚠️ AI Implementation Context

**Time Constraint:** ~5 hours total development time  
**Purpose:** This spec is context for AI tools to build/extend the project  
**Priority:** Core gameplay loop > Polish > Stretch features

### Implementation Priorities
1. **P0 (Must Have):** Working game loop, component selection, scoring, terraform preview
2. **P1 (Should Have):** Visual polish, better feedback, mobile support  
3. **P2 (Nice to Have):** Sound effects, animations, shop system
4. **P3 (Stretch):** Leaderboard, difficulty levels

### Related Docs
- **`IMPLEMENTATION_STATUS.md`** - What's done vs needs work (check this first!)
- **`DIGITALOCEAN_SETUP.md`** - Deployment instructions

---

## 1) Game Concept

Players run a cloud infrastructure shop where enterprise customers (AMD, Amazon, Meta, Netflix, Spotify, etc.) order cloud configurations for their software engineering needs. Players drag-and-drop DigitalOcean components to fulfill orders, then submit to earn cash.

### Core Loop
```
MENU → START_GAME → CUSTOMER_ARRIVES → READ_ORDER → DRAG_COMPONENTS → SUBMIT_ORDER → EARN_CASH → NEXT_CUSTOMER → (repeat x5) → ROUND_END → VIEW_EARNINGS → NEXT_ROUND
```

---

## 2) Acceptance Criteria

### Core Gameplay (P0)
- [x] Enterprise customers arrive with infrastructure requests
- [x] Orders display required components visually
- [x] Player clicks/drags DO components to a build area
- [x] Terraform code generates in real-time as components are added
- [x] Validation checks if order matches requirements
- [x] Timer counts down (dynamic based on order complexity)
- [x] Cash awarded based on accuracy + speed bonus
- [x] Round ends after 5 orders
- [x] End-of-round screen shows total cash and stats
- [x] Menu screen with game instructions

### Polish & UX (P1)
- [x] Feedback banner shows order result
- [x] Components organized by category in palette
- [ ] Mobile-friendly tap-to-add interaction
- [ ] Visual indicators for matched/missing components

### Deployment (P0)
- [ ] Deployed on DO App Platform

---

## 3) DigitalOcean Components (Draggable Items)

### Compute
| Component | Icon | Base Cost | Description |
|-----------|------|-----------|-------------|
| Droplet (Basic) | 💧 | $5/mo | 1 vCPU, 1GB RAM |
| Droplet (General) | 💧💧 | $20/mo | 2 vCPU, 4GB RAM |
| Droplet (CPU-Optimized) | ⚡ | $40/mo | 4 vCPU, 8GB RAM |
| Droplet (Memory-Optimized) | 🧠 | $60/mo | 2 vCPU, 16GB RAM |
| App Platform | 📦 | $12/mo | Managed deployment |
| Kubernetes Cluster | ☸️ | $50/mo | Managed K8s |

### Storage & Database
| Component | Icon | Base Cost | Description |
|-----------|------|-----------|-------------|
| Spaces (Object Storage) | 📁 | $5/mo | 250GB storage |
| Managed Database (PostgreSQL) | 🐘 | $15/mo | 1 vCPU, 1GB RAM |
| Managed Database (MySQL) | 🐬 | $15/mo | 1 vCPU, 1GB RAM |
| Managed Database (Redis) | 🔴 | $15/mo | Cache layer |
| Managed Database (MongoDB) | 🍃 | $15/mo | Document DB |
| Block Storage | 💾 | $10/mo | 100GB volume |

### Networking
| Component | Icon | Base Cost | Description |
|-----------|------|-----------|-------------|
| Load Balancer | ⚖️ | $12/mo | Traffic distribution |
| VPC | 🔒 | $0/mo | Private network |
| Floating IP | 🌐 | $5/mo | Static IP |
| CDN | 🚀 | $5/mo | Content delivery |
| Firewall | 🛡️ | $0/mo | Security rules |

### Other
| Component | Icon | Base Cost | Description |
|-----------|------|-----------|-------------|
| Container Registry | 📋 | $5/mo | Docker images |
| Functions | ⚡ | $2/mo | Serverless |
| Monitoring | 📊 | $0/mo | Metrics & alerts |

---

## 4) Enterprise Customers

### Customer Profiles
```typescript
type Customer = {
  id: string;
  name: string;           // "AMD", "Meta", "Netflix"
  logo: string;           // Emoji icon
  color: string;          // Brand color (hex)
  patience: number;       // 1-5, affects timer duration
  tipMultiplier: number;  // Bonus multiplier for perfect orders
  personality: string;    // Flavor text for order descriptions
};
```

### Customer List (12 customers implemented)
| Customer | Logo | Color | Patience | Tip | Personality |
|----------|------|-------|----------|-----|-------------|
| AMD | 🔺 | #ED1C24 | 3 | 1.2x | Technical, precise |
| Amazon | 📦 | #FF9900 | 2 | 1.0x | Fast-paced, demanding |
| Meta | Ⓜ️ | #0668E1 | 4 | 1.5x | Scale-focused |
| Netflix | 🎬 | #E50914 | 3 | 1.3x | Streaming expertise |
| Spotify | 🎵 | #1DB954 | 4 | 1.4x | Real-time audio |
| Shopify | 🛒 | #96BF48 | 3 | 1.2x | E-commerce focused |
| Stripe | 💳 | #635BFF | 2 | 1.1x | Security-conscious |
| Uber | 🚗 | #000000 | 2 | 1.0x | High availability |
| Airbnb | 🏠 | #FF5A5F | 4 | 1.3x | User experience |
| Slack | 💬 | #4A154B | 3 | 1.2x | Real-time messaging |
| Discord | 🎮 | #5865F2 | 3 | 1.3x | Gamers, low latency |
| Twitch | 📺 | #9146FF | 2 | 1.2x | Live streaming |

---

## 5) Order Types (Software Engineering Scenarios)

### Order Categories
Orders are real software engineering infrastructure needs. Each scenario has multiple description variants for variety. **12 scenarios implemented:**

#### 1. Web Application Stack ($400 base)
- **Required**: 2x Droplet (General), 1x Load Balancer, 1x PostgreSQL, 1x Spaces

#### 2. Microservices Platform ($500 base)
- **Required**: 1x Kubernetes, 1x Container Registry, 1x Redis, 1x Load Balancer

#### 3. Data Pipeline ($550 base)
- **Required**: 3x Droplet (CPU), 1x MongoDB, 1x Redis, 1x Block Storage

#### 4. Static Website with CDN ($200 base)
- **Required**: 1x Spaces, 1x CDN, 1x Floating IP

#### 5. API Backend ($450 base)
- **Required**: 2x Droplet (General), 1x PostgreSQL, 1x Redis, 1x Load Balancer

#### 6. Machine Learning Platform ($600 base)
- **Required**: 2x Droplet (CPU), 1x Droplet (Memory), 1x Block Storage, 1x Spaces

#### 7. E-commerce Platform ($550 base)
- **Required**: 2x Droplet (General), 1x PostgreSQL, 1x Redis, 1x Load Balancer, 1x Spaces

#### 8. Real-time Chat System ($500 base)
- **Required**: 2x Droplet (Memory), 1x Redis, 1x MongoDB, 1x Load Balancer

#### 9. CI/CD Pipeline ($350 base)
- **Required**: 1x Droplet (General), 1x Container Registry, 1x Spaces, 1x Functions

#### 10. Gaming Backend ($600 base)
- **Required**: 3x Droplet (CPU), 1x Redis, 1x PostgreSQL, 1x Load Balancer

#### 11. Video Streaming Platform ($650 base)
- **Required**: 2x Droplet (CPU), 1x Spaces, 1x CDN, 1x Load Balancer, 1x Redis

#### 12. IoT Platform ($500 base)
- **Required**: 2x Droplet (General), 1x MongoDB, 1x Redis, 1x Functions, 1x Monitoring

---

## 6) Types

```typescript
// lib/types.ts

// DO Component Categories
export type ComponentCategory = 
  | "compute" 
  | "storage" 
  | "database" 
  | "networking" 
  | "other";

// Individual DO Component
export type DOComponent = {
  id: string;
  type: string;           // "droplet-basic", "postgres", "load-balancer"
  name: string;           // Display name
  icon: string;           // Emoji icon
  category: ComponentCategory;
  monthlyCost: number;
  description: string;
  terraformResource: string;         // "digitalocean_droplet"
  terraformConfig: Record<string, unknown>;  // Terraform-specific config
};

// Customer placing order
export type Customer = {
  id: string;
  name: string;
  logo: string;
  color: string;
  patience: number;       // 1-5, affects timer
  tipMultiplier: number;
  personality: string;
};

// Component required in order (with quantity)
export type OrderComponent = {
  componentType: string;
  quantity: number;
};

// Order ticket from customer
export type Order = {
  orderId: string;
  customer: Customer;
  scenario: string;        // "Web Application Stack"
  description: string;     // Customer's request text
  requiredComponents: OrderComponent[];
  timeLimitSec: number;
  baseReward: number;
};

// Placed component in build area
export type PlacedComponent = {
  instanceId: string;      // Unique per placement
  component: DOComponent;
};

// Player's current build
export type BuildArea = {
  placedComponents: PlacedComponent[];
};

// Order result
export type OrderResult = {
  success: boolean;
  accuracy: number;        // 0-100%
  cashEarned: number;
  tip: number;
  message: string;
  missing: string[];       // Missing component types
  extra: string[];         // Unnecessary component types
};

// Game phases
export type GamePhase = "menu" | "playing" | "feedback" | "round_end" | "shop";

// Game state
export type GameState = {
  cash: number;
  round: number;
  ordersCompleted: number;
  maxOrdersPerRound: number;
  currentOrder: Order | null;
  buildArea: BuildArea;
  timeRemaining: number;
  feedback: OrderResult | null;
  gamePhase: GamePhase;
  perfectOrders: number;
};

// API types
export type OrderResponse = Order;

export type SubmitRequest = {
  orderId: string;
  placedComponents: { instanceId: string; componentType: string }[];
  timeRemaining: number;
};

export type SubmitResponse = OrderResult;
```

---

## 7) Architecture

```
app/
├── page.tsx                    # Main game UI (menu, playing, round_end states)
├── layout.tsx                  # Root layout with metadata
├── globals.css                 # Tailwind + custom styles
├── favicon.ico
└── api/
    ├── order/route.ts          # POST - generates new order
    ├── submit/route.ts         # POST - validates and scores order
    └── reset/route.ts          # POST - resets game state

lib/
├── types.ts                    # TypeScript types (all game types)
├── components-data.ts          # DO component definitions (20 components)
├── customers-data.ts           # Customer profiles (12 customers)
├── order-generator.ts          # Random order generation (12 scenarios)
├── terraform-generator.ts      # Generate TF code from components
└── scoring.ts                  # Calculate cash/accuracy/tips

components/
├── OrderTicket.tsx             # Customer order display with requirements
├── ComponentPalette.tsx        # Categorized component sidebar
├── BuildArea.tsx               # Drop zone for building
├── TerraformPreview.tsx        # Live TF code display with syntax highlighting
├── CashDisplay.tsx             # Current cash with formatting
├── Timer.tsx                   # Countdown timer with visual indicator
├── FeedbackBanner.tsx          # Order result display
└── RoundEnd.tsx                # End of round screen with stats

docs/
├── SPEC.md                     # This specification
├── IMPLEMENTATION_STATUS.md    # What's done vs needs work
└── DIGITALOCEAN_SETUP.md       # Deployment instructions
```

### Not Yet Implemented
- `components/Shop.tsx` - Upgrade shop (P2 feature)
- `components/CustomerAvatar.tsx` - Standalone customer display (merged into OrderTicket)

---

## 8) API Contracts

### POST `/api/order`
Generates a new random order for current round.

**Response:**
```json
{
  "orderId": "order_001",
  "customer": {
    "id": "netflix",
    "name": "Netflix",
    "logo": "🎬",
    "color": "#E50914",
    "patience": 3,
    "tipMultiplier": 1.3
  },
  "scenario": "Real-time Chat System",
  "description": "We need WebSocket infrastructure for our new messaging feature. Should handle millions of concurrent connections!",
  "requiredComponents": [
    { "componentType": "droplet-memory", "quantity": 2 },
    { "componentType": "redis", "quantity": 1 },
    { "componentType": "mongodb", "quantity": 1 },
    { "componentType": "load-balancer", "quantity": 1 }
  ],
  "timeLimitSec": 60,
  "baseReward": 500
}
```

### POST `/api/submit`
Validates player's build against order requirements.

**Request:**
```json
{
  "orderId": "order_001",
  "placedComponents": [
    { "instanceId": "inst_1", "componentType": "droplet-memory" },
    { "instanceId": "inst_2", "componentType": "droplet-memory" },
    { "instanceId": "inst_3", "componentType": "redis" },
    { "instanceId": "inst_4", "componentType": "mongodb" },
    { "instanceId": "inst_5", "componentType": "load-balancer" }
  ],
  "timeRemaining": 35
}
```

**Response (success):**
```json
{
  "success": true,
  "accuracy": 100,
  "cashEarned": 500,
  "tip": 150,
  "message": "Perfect infrastructure! Netflix is impressed!",
  "missing": [],
  "extra": []
}
```

**Response (partial):**
```json
{
  "success": true,
  "accuracy": 80,
  "cashEarned": 400,
  "tip": 0,
  "message": "Good effort, but you forgot the Redis cache.",
  "missing": ["redis"],
  "extra": []
}
```

### POST `/api/reset`
Resets game to initial state.

---

## 9) Terraform Generation

As players add components, generate real Terraform code:

```hcl
# Generated by Papa's DO-eria
# Customer: Netflix
# Order: Real-time Chat System

terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

resource "digitalocean_droplet" "chat_server_1" {
  image  = "ubuntu-22-04-x64"
  name   = "chat-server-1"
  region = "nyc3"
  size   = "m-2vcpu-16gb"
  
  tags = ["chat", "websocket"]
}

resource "digitalocean_droplet" "chat_server_2" {
  image  = "ubuntu-22-04-x64"
  name   = "chat-server-2"
  region = "nyc3"
  size   = "m-2vcpu-16gb"
  
  tags = ["chat", "websocket"]
}

resource "digitalocean_database_cluster" "redis" {
  name       = "chat-cache"
  engine     = "redis"
  version    = "7"
  size       = "db-s-1vcpu-1gb"
  region     = "nyc3"
  node_count = 1
}

resource "digitalocean_database_cluster" "mongodb" {
  name       = "chat-db"
  engine     = "mongodb"
  version    = "6"
  size       = "db-s-1vcpu-1gb"
  region     = "nyc3"
  node_count = 1
}

resource "digitalocean_loadbalancer" "chat_lb" {
  name   = "chat-loadbalancer"
  region = "nyc3"

  forwarding_rule {
    entry_port     = 443
    entry_protocol = "https"
    target_port    = 8080
    target_protocol = "http"
  }

  droplet_ids = [
    digitalocean_droplet.chat_server_1.id,
    digitalocean_droplet.chat_server_2.id
  ]
}
```

---

## 10) Scoring System

### Calculation (Implemented in `lib/scoring.ts`)
```
Base Reward = Order base value ($200-$650)

Perfect Order (no missing, no extra):
  Cash = baseReward + timeBonus + tip
  timeBonus = (timeRemaining / totalTime) * 0.25 * baseReward
  tip = baseReward * (customer.tipMultiplier - 1)

All Required Present, But Extras:
  Cash = baseReward * (1 - 0.05 * numExtras)
  No tip

Partial (≥50% accuracy):
  Cash = baseReward * (accuracy / 100)
  No tip

Failed (<50% accuracy):
  Cash = 0
  
Timeout:
  Cash = 0
```

### Accuracy Calculation
```
correctlyPlaced = totalRequired - missingCount
accuracy = (correctlyPlaced / totalRequired) * 100
```

### Key Values
- Base rewards: $200 (static site) to $650 (video streaming)
- Time bonus: Up to 25% of base reward
- Extra penalty: 5% per unnecessary component
- Tip multipliers: 1.0x to 1.5x (customer dependent)

---

## 11) UI Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PAPA'S DO-ERIA                               💰 $2,450    ⏱️ 45s           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  🎬 NETFLIX                                    Order #3/5              ││
│  │  ─────────────────────────────────────────────────────────────────────  ││
│  │  "We need WebSocket infrastructure for our new messaging feature!"     ││
│  │                                                                         ││
│  │  REQUIRED:  💧💧 x2   🔴 x1   🍃 x1   ⚖️ x1                              ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌───────────────┐  ┌──────────────────────────────────────────────────────┐│
│  │  COMPONENTS   │  │  BUILD AREA                                          ││
│  │  ───────────  │  │  ┌────────────────────────────────────────────────┐  ││
│  │  💧 Droplet   │  │  │  💧💧  🔴  🍃  ⚖️                                │  ││
│  │  🐘 Postgres  │  │  │                                                │  ││
│  │  🔴 Redis     │  │  │  [Drag components here]                        │  ││
│  │  ⚖️ Load Bal  │  │  └────────────────────────────────────────────────┘  ││
│  │  📁 Spaces    │  │                                                      ││
│  │  ...         │  │  Monthly Cost: $127/mo                               ││
│  └───────────────┘  └──────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  TERRAFORM PREVIEW                                                │       │
│  │  ```hcl                                                          │       │
│  │  resource "digitalocean_droplet" "server_1" {                    │       │
│  │    image = "ubuntu-22-04-x64"                                    │       │
│  │    ...                                                           │       │
│  │  ```                                                             │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        [ 🚀 SUBMIT ORDER ]                              ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12) Round End / Shop Screen

```
┌─────────────────────────────────────────────────────────────────┐
│                         ROUND COMPLETE!                         │
│                                                                 │
│                    Orders Completed: 5/5                        │
│                    Total Earnings: $2,450                       │
│                    Perfect Orders: 3                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    💰 TOTAL CASH: $2,450                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   🏪 SHOP (Coming Soon!)                 │   │
│  │                                                         │   │
│  │   Upgrades will be available in a future update:        │   │
│  │   • Faster dragging                                     │   │
│  │   • More time per order                                 │   │
│  │   • Auto-complete hints                                 │   │
│  │   • Unlock premium customers                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                    [ 🎮 NEXT ROUND ]                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13) Implementation Notes

### Component Interaction (Current)
- Click-to-add from palette to build area
- Click-to-remove from build area
- No drag-and-drop currently (could be added with react-dnd)

### Real-time Terraform (Implemented)
- Updates on every component add/remove
- Uses `terraformConfig` from component definitions
- Groups resources by type with proper naming
- Includes customer/order context in comments

### Responsive Design
- Desktop-optimized layout (4-column grid)
- Mobile: Single column layout with tap-to-add
- Dark theme with cyan/blue/purple gradients

### State Management
- All game state in `app/page.tsx` using React hooks
- No external state library (keep it simple for hackathon)
- API routes are stateless (order counter resets on server restart)

---

## 14) Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 15) Deployment

See `docs/DIGITALOCEAN_SETUP.md` for detailed instructions.

### Quick Deploy to DO App Platform
1. Push to GitHub
2. Connect repo to DO App Platform
3. Configure:
   - **Build command:** `npm run build`
   - **Run command:** `npm start`
   - **Port:** 3000
   - **Environment:** Node.js

---

## 16) Remaining Work & Stretch Goals

### P1 - Should Complete (Polish)
1. Mobile-friendly tap interactions
2. Visual feedback for matched/missing components during build
3. Better component count display in build area
4. Improved accessibility (keyboard navigation)

### P2 - Nice to Have (Time Permitting)
1. Sound effects (cash register, component drop)
2. Animations (component slide, cash increment)
3. Shop system with upgrades (more time, hints, auto-complete)

### P3 - Stretch Goals (Post-Hackathon)
1. Leaderboard with persistent scores
2. Difficulty levels (more/fewer components, shorter timers)
3. Real company logos (with permission)
4. Additional order scenarios
5. Tutorial mode for new players
