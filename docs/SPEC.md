# Rain Maker - Technical Specification

> *"Rainy with a chance of rogue tech, infrastructure as clouds (IaC) to make it rain"*
>
> A rogue-like web game where players build DigitalOcean infrastructure with Terraform and make it rain!  
> **Stack:** Next.js 15 (App Router) + Tailwind CSS + TypeScript  
> **Hosting:** DigitalOcean App Platform  
> **Mode:** Simulation with Terraform code generation

---

## ⚠️ AI Implementation Context

**Time Constraint:** ~5 hours total development time  
**Purpose:** This spec is context for AI tools to build/extend the project  
**Priority:** Core gameplay loop > Polish > Stretch features

### Implementation Priorities

1. **P0 (Must Have):** Working game loop, component selection, scoring, terraform preview ✅
2. **P1 (Should Have):** Visual polish, better feedback, mobile support ✅ (theme done)
3. **P2 (Nice to Have):** Sound effects, animations, shop system ✅ (shop done)
4. **P3 (Stretch):** Leaderboard, difficulty levels

### Related Docs

- **`IMPLEMENTATION_STATUS.md`** - What's done vs needs work (check this first!)
- **`DIGITALOCEAN_SETUP.md`** - Deployment instructions

---

## 1) Game Concept

Players weather the storm as enterprise customers (AMD, Amazon, Meta, Netflix, Spotify, etc.) request cloud configurations for their software engineering needs. Players build cloud infrastructure by dragging-and-dropping DigitalOcean components, generate Terraform code, and "make it rain" with cloud cash!

### Theme

- **Weather/Storm Aesthetic** - Dark storm backgrounds, rain animations, lightning effects
- **Cloud Infrastructure** - Components are "clouds" forming infrastructure
- **Rogue-like Elements** - Power-ups between rounds, increasing difficulty
- **"Make It Rain"** - Success = cash raining down

### Core Loop

```
MENU → START_STORM → CUSTOMER_ARRIVES → READ_FORECAST → BUILD_CLOUDS → MAKE_IT_RAIN → EARN_CASH → NEXT_CUSTOMER → (repeat x5) → STORM_END → POWER_UPS → NEXT_STORM
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
- [x] Weather-themed UI with rain effects and storm animations
- [ ] Mobile-friendly tap-to-add interaction
- [ ] Visual indicators for matched/missing components

### Deployment (P0)

- [ ] Deployed on DO App Platform

---

## 3) DigitalOcean Components (Cloud Components)

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
  logo: string;           // SVG logo path
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

## 5) Order Types (Infrastructure Scenarios)

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

// Shop upgrades state (Power-Ups)
export type ShopState = {
  timeBonusLevel: number;      // 0-3, +10s per order per level
  tipMultiplierLevel: number;  // 0-3, +20% tips per level
  autoCompleteLevel: number;   // 0-2, auto-fills N component types
  premiumOrdersUnlocked: boolean; // Unlocks higher-reward orders
};

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
  shopState: ShopState;
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
├── globals.css                 # Tailwind + storm theme styles + rain animations
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
├── OrderTicket.tsx             # Customer order display (forecast style)
├── ComponentPalette.tsx        # Cloud components sidebar
├── BuildArea.tsx               # Cloud formation zone
├── TerraformPreview.tsx        # Live TF code display with demo mode toggle
├── CashDisplay.tsx             # Current cash with rain animation
├── Timer.tsx                   # Storm countdown timer
├── FeedbackBanner.tsx          # Order result display
├── RoundEnd.tsx                # End of storm screen with stats + shop button
└── Shop.tsx                    # Power-up shop with 4 purchasable upgrades

scripts/
├── raincloud.sh                # Creates demo folder + main.tf for droplet
├── makeitrain.sh               # Runs terraform init && apply
└── cleanup.sh                  # Destroys all demo resources + folders

docs/
├── SPEC.md                     # This specification
├── IMPLEMENTATION_STATUS.md    # What's done vs needs work
├── DIGITALOCEAN_SETUP.md       # Deployment instructions
└── TERRAFORM_QUICK_REFERENCE.md # Shell scripts setup and demo workflow
```

### Not Yet Implemented

- `components/CustomerAvatar.tsx` - Standalone customer display (merged into OrderTicket)

---

## 8) API Contracts

### POST `/api/order`

Generates a new random order for current storm.

**Response:**

```json
{
  "orderId": "order_001",
  "customer": {
    "id": "netflix",
    "name": "Netflix",
    "logo": "/logos/netflix.svg",
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

As players add components, generate real Terraform code.

### Budget Mode (Default)

**Important:** The Terraform code uses **minimal/budget-friendly specs** for demos, while the game UI displays the "ideal" specs for educational purposes. This keeps demo costs low.

| Component | UI Display | Terraform Actual | Reason |
|-----------|------------|------------------|--------|
| Droplet (Basic) | 1 vCPU, 1GB | `s-1vcpu-512mb-10gb` ($4/mo) | Smallest available |
| Droplet (General) | 2 vCPU, 4GB | `s-1vcpu-1gb` ($6/mo) | Budget alternative |
| Droplet (CPU) | 4 vCPU, 8GB | `c-2` ($42/mo) | Smallest CPU-optimized |
| Droplet (Memory) | 2 vCPU, 16GB | `m-16gb` ($84/mo) | Smallest memory-optimized |
| Kubernetes | 3 nodes | 1 node, `s-1vcpu-2gb` | Demo-sized cluster |
| Block Storage | 100GB | 10GB ($1/mo) | Minimum size |
| Databases | 1 vCPU, 1GB | `db-s-1vcpu-1gb` | Already smallest |

This is intentional for hackathon demos where real infrastructure gets created. The game teaches the *concepts* of infrastructure sizing while keeping actual deployment costs manageable.

To use production-ready specs, modify `lib/terraform-generator.ts` and update the size mappings.

### Demo Mode Toggle

The Terraform Preview includes a **Demo Mode** toggle that filters components to only include resources that are:

- On-demand pricing (billed hourly, can be destroyed immediately)
- Quick to provision (seconds to minutes, not 5-10 minutes)
- No extra credentials required (just the DO API token)

#### Included in Demo Mode

| Service | Terraform Resource | Approx. Hourly Cost | Notes |
|---------|-------------------|---------------------|-------|
| Droplet (all types) | `digitalocean_droplet` | $0.006-0.125/hr | Provisions in ~1 min |
| Block Storage | `digitalocean_volume` | $0.0015/hr (10GB) | Instant |
| Load Balancer | `digitalocean_loadbalancer` | $0.018/hr | ~2 min |
| VPC | `digitalocean_vpc` | FREE | Instant |
| Firewall | `digitalocean_firewall` | FREE | Instant |
| Floating IP | `digitalocean_floating_ip` | FREE (attached) | Instant |

**Estimated demo cost**: 2 droplets + 1 load balancer for 1 hour = ~$0.05

#### Excluded in Demo Mode

| Service | Reason |
|---------|--------|
| PostgreSQL, MySQL, Redis, MongoDB | $15/mo minimum, 5-10 min provision |
| Kubernetes | $12/mo control plane + nodes, slow |
| Container Registry | Only 1 per account, may conflict |
| App Platform | Requires git repo |
| Functions | Requires git repo |
| Spaces | Requires separate API keys |
| CDN | Requires Spaces bucket |
| Monitoring | Requires valid email |

#### Demo Workflow

1. Build infrastructure with any components in the game
2. Toggle **Demo Mode ON** in Terraform Preview
3. Excluded components are filtered out automatically
4. Copy the filtered code
5. SSH to your Terraform runner droplet
6. Run `terraform init && terraform apply -var="do_token=$DO_TOKEN"`
7. Resources created in ~2 minutes
8. Run `terraform destroy` when done

### Example Output

```hcl
# Generated by Rain Maker
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

### Theme Elements

- **Storm Background** - Dark gradient with rain animations
- **Lightning Flash** - Subtle flash effect for atmosphere
- **Floating Clouds** - Decorative cloud elements
- **Rain Drops** - CSS animated rain effect (client-side rendered)
- **Neon Glow** - Cyan/blue/purple color palette

### Main Game Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🌧️ RAIN MAKER                          ⛈️ Storm 1    💰 $2,450    ⏱️ 45s    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  [LOGO] NETFLIX                              🌧️ Deploy #3/5            ││
│  │  ☁️ Web Application Stack                                               ││
│  │  ─────────────────────────────────────────────────────────────────────  ││
│  │  📡 INCOMING REQUEST                                                    ││
│  │  "We need WebSocket infrastructure for our new messaging feature!"     ││
│  │                                                                         ││
│  │  ⛅ CLOUD INFRASTRUCTURE NEEDED                                         ││
│  │  💧💧 x2   🔴 x1   🍃 x1   ⚖️ x1                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌───────────────┐  ┌──────────────────────────────────────────────────────┐│
│  │ 🌩️ CLOUD      │  │  ☁️ CLOUD FORMATION                      💵 $127/mo  ││
│  │  COMPONENTS   │  │  ┌────────────────────────────────────────────────┐  ││
│  │  ───────────  │  │  │  💧💧  🔴  🍃  ⚖️                                │  ││
│  │  💧 Droplet   │  │  │                                                │  ││
│  │  🐘 Postgres  │  │  │  [Drop cloud components here]                  │  ││
│  │  🔴 Redis     │  │  └────────────────────────────────────────────────┘  ││
│  │  ⚖️ Load Bal  │  │                                                      ││
│  │  ...          │  │  🌬️ Click a cloud to remove it                       ││
│  └───────────────┘  └──────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  ☁️ INFRASTRUCTURE CODE                                          │       │
│  │  ```hcl                                                          │       │
│  │  resource "digitalocean_droplet" "server_1" {                    │       │
│  │    image = "ubuntu-22-04-x64"                                    │       │
│  │    ...                                                           │       │
│  │  ```                                                             │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        [ 🌧️ MAKE IT RAIN ]                             ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12) Storm End / Power-Up Shop

### Storm End Screen

```
┌─────────────────────────────────────────────────────────────────┐
│                       🌧️ STORM 1 COMPLETE!                      │
│                                                                 │
│                         ⛈️⛈️⛈️                                  │
│                    Storm Chaser Elite!                          │
│                                                                 │
│                    ☁️ Deployments: 5/5                          │
│                    ⛈️ Perfect Storms: 3                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          🌧️ TOTAL EARNINGS 💸: $2,450                   │   │
│  │                You made it rain!                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│            [ ⚡ POWER-UPS ]    [ ⛈️ NEXT STORM → ]              │
└─────────────────────────────────────────────────────────────────┘
```

### Power-Up Shop (Implemented)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ POWER-UP SHOP                            💰 $2,450          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ⏰ STORM EXTENSION                            $300       │  │
│  │  More time before the storm passes (Level 1/3) [BUY]     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ✨ GOLDEN CLOUDS                              $400       │  │
│  │  Increase bonus earnings (Level 0/3)           [BUY]     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  🤖 CLOUD AUTOMATION                           $600       │  │
│  │  Auto-spawns starting components (Level 0/2)   [BUY]     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  🌀 HURRICANE MODE                             $800       │  │
│  │  High-risk, high-reward storms                 [BUY]     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│                  [ ⛈️ CONTINUE TO NEXT STORM → ]               │
└─────────────────────────────────────────────────────────────────┘
```

### Power-Up Upgrades

| Power-Up | Max Level | Effect | Base Cost |
|----------|-----------|--------|-----------|
| Storm Extension | 3 | +10s per order per level | $300 |
| Golden Clouds | 3 | +20% tips per level | $400 |
| Cloud Automation | 2 | Auto-fills N component types | $600 |
| Hurricane Mode | 1 | Unlocks higher-reward orders | $800 |

Upgrade costs scale by 1.5x per level (e.g., Storm Extension: $300 → $450 → $675).

---

## 13) Implementation Notes

### Component Interaction (Current)

- Click-to-add from palette to build area
- Click-to-remove from build area
- Drag-and-drop also supported

### Real-time Terraform (Implemented)

- Updates on every component add/remove
- Uses `terraformConfig` from component definitions
- Groups resources by type with proper naming
- Includes customer/order context in comments

### Responsive Design

- Desktop-optimized layout (4-column grid)
- Mobile: Single column layout with tap-to-add
- Dark storm theme with cyan/blue/purple gradients

### State Management

- All game state in `app/page.tsx` using React hooks
- No external state library (keep it simple for hackathon)
- API routes are stateless (order counter resets on server restart)

### Rain Animation (Hydration-Safe)

Rain effects use `useEffect` to generate random positions only on the client side, preventing React hydration mismatches.

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

1. Sound effects (thunder, rain, cash register)
2. ~~Animations (component slide, cash increment)~~ ✅ Rain animations done
3. ~~Shop system with upgrades~~ ✅ Done (Power-Ups)
4. ~~Weather-themed UI~~ ✅ Done

### P3 - Stretch Goals (Post-Hackathon)

1. Leaderboard with persistent scores
2. Difficulty levels (more/fewer components, shorter timers)
3. Real company logos (with permission)
4. Additional order scenarios
5. Tutorial mode for new players
6. Rogue-like random events ("Packet Loss Fog", "DB Thunderstorm")

---

## 17) Shell Scripts for Demo Deployment

Scripts in `scripts/` for deploying Terraform code on a DigitalOcean droplet:

### raincloud.sh

Creates a demo folder and accepts pasted Terraform code.

```bash
raincloud my-demo
# Paste terraform code, Ctrl+D
# Creates ~/my-demo/main.tf
```

### makeitrain.sh

Runs `terraform init && terraform apply` in current directory.

```bash
cd ~/my-demo
makeitrain
```

### cleanup.sh

Destroys all demo resources and removes folders.

```bash
cleanup
# Destroys all ~/demo-*, ~/deploy-*, ~/rain-* directories
```

### Setup on Ubuntu Droplet

```bash
# Add raincloud as function (for cd to work)
cat >> ~/.bashrc << 'EOF'
raincloud() {
    NAME="${1:-demo-$(date +%s)}"
    DIR=~/"$NAME"
    mkdir -p "$DIR"
    echo "Paste Terraform code, then Ctrl+D:"
    cat > "$DIR/main.tf"
    cd "$DIR"
    echo "Run 'makeitrain' to deploy"
}
EOF

# Create ~/bin and add scripts
mkdir -p ~/bin
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Copy makeitrain and cleanup scripts (edit to add your DO_TOKEN)
```

See `TERRAFORM_QUICK_REFERENCE.md` for full setup instructions.

---

*Built with ⛈️ for uOttaHack8*
