# Papa's DO-eria - Technical Specification

> A Papa's Pizzeria-style web game where players build DigitalOcean infrastructure for enterprise customers.  
> **Stack:** Next.js 14 (App Router) + Tailwind CSS  
> **Hosting:** DigitalOcean App Platform  
> **Mode:** Simulation with Terraform code generation

---

## 1) Game Concept

Players run a cloud infrastructure shop where enterprise customers (AMD, Amazon, Meta, Netflix, Spotify, etc.) order cloud configurations for their software engineering needs. Players drag-and-drop DigitalOcean components to fulfill orders, then submit to earn cash.

### Core Loop
```
CUSTOMER_ARRIVES → READ_ORDER → DRAG_COMPONENTS → SUBMIT_ORDER → EARN_CASH → NEXT_CUSTOMER → (repeat) → ROUND_END → VIEW_EARNINGS → (SHOP) → NEXT_ROUND
```

---

## 2) Acceptance Criteria

- [ ] Enterprise customers arrive with infrastructure requests
- [ ] Orders display required components visually
- [ ] Player drags DO components to a build area
- [ ] Terraform code generates in real-time as components are added
- [ ] Validation checks if order matches requirements
- [ ] Timer counts down (60s per order)
- [ ] Cash awarded based on accuracy + speed bonus
- [ ] Round ends after 5 orders
- [ ] End-of-round screen shows total cash (shop placeholder)
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
  logo: string;           // Emoji or icon
  color: string;          // Brand color
  patience: number;       // 1-5, affects timer
  tipMultiplier: number;  // Bonus for perfect orders
  personality: string;    // Flavor text style
};
```

### Customer List
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

---

## 5) Order Types (Software Engineering Scenarios)

### Order Categories
Orders are real software engineering infrastructure needs:

#### 1. Web Application Stack
- **Description**: "We need a scalable web app with database"
- **Required**: 2x Droplet (General), 1x Load Balancer, 1x PostgreSQL, 1x Spaces

#### 2. Microservices Platform
- **Description**: "Build us a containerized microservices setup"
- **Required**: 1x Kubernetes Cluster, 1x Container Registry, 1x Redis, 1x Load Balancer

#### 3. Data Pipeline
- **Description**: "We need real-time data processing infrastructure"
- **Required**: 3x Droplet (CPU-Optimized), 1x MongoDB, 1x Redis, 1x Block Storage

#### 4. Static Website with CDN
- **Description**: "Simple marketing site with global delivery"
- **Required**: 1x Spaces, 1x CDN, 1x Floating IP

#### 5. API Backend
- **Description**: "RESTful API with caching and storage"
- **Required**: 2x Droplet (General), 1x PostgreSQL, 1x Redis, 1x Load Balancer

#### 6. Machine Learning Platform
- **Description**: "Infrastructure for ML model training and serving"
- **Required**: 2x Droplet (CPU-Optimized), 1x Droplet (Memory-Optimized), 1x Block Storage, 1x Spaces

#### 7. E-commerce Platform
- **Description**: "Full e-commerce with payments and inventory"
- **Required**: 2x Droplet (General), 1x PostgreSQL, 1x Redis, 1x Load Balancer, 1x Spaces

#### 8. Real-time Chat System
- **Description**: "WebSocket-based messaging infrastructure"
- **Required**: 2x Droplet (Memory-Optimized), 1x Redis, 1x MongoDB, 1x Load Balancer

#### 9. CI/CD Pipeline
- **Description**: "Continuous integration and deployment setup"
- **Required**: 1x Droplet (General), 1x Container Registry, 1x Spaces, 1x Functions

#### 10. Gaming Backend
- **Description**: "Multiplayer game server infrastructure"
- **Required**: 3x Droplet (CPU-Optimized), 1x Redis, 1x PostgreSQL, 1x Load Balancer

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
  terraformResource: string;  // "digitalocean_droplet"
};

// Customer placing order
export type Customer = {
  id: string;
  name: string;
  logo: string;
  color: string;
  patience: number;
  tipMultiplier: number;
  personality: string;
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

// Component required in order (with quantity)
export type OrderComponent = {
  componentType: string;
  quantity: number;
};

// Player's current build
export type BuildArea = {
  placedComponents: PlacedComponent[];
};

export type PlacedComponent = {
  instanceId: string;      // Unique per placement
  component: DOComponent;
};

// Terraform output
export type TerraformConfig = {
  code: string;
  valid: boolean;
  estimatedMonthlyCost: number;
};

// Order result
export type OrderResult = {
  success: boolean;
  accuracy: number;        // 0-100%
  cashEarned: number;
  tip: number;
  message: string;
  missing: string[];       // Missing components
  extra: string[];         // Unnecessary components
};

// Game state
export type GameState = {
  cash: number;
  round: number;
  ordersCompleted: number;
  ordersInRound: number;
  maxOrdersPerRound: number;
  currentOrder: Order | null;
  buildArea: BuildArea;
  timeRemaining: number;
  feedback: OrderResult | null;
  gamePhase: "menu" | "playing" | "round_end" | "shop";
};
```

---

## 7) Architecture

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
├── terraform-generator.ts      # Generate TF code from components
└── scoring.ts                  # Calculate cash/accuracy

components/
├── OrderTicket.tsx             # Customer order display
├── ComponentPalette.tsx        # Draggable components sidebar
├── BuildArea.tsx               # Drop zone for building
├── TerraformPreview.tsx        # Live TF code display
├── CashDisplay.tsx             # Current cash
├── Timer.tsx                   # Countdown timer
├── CustomerAvatar.tsx          # Customer display
├── FeedbackBanner.tsx          # Order result
├── RoundEnd.tsx                # End of round screen
└── Shop.tsx                    # Upgrades (placeholder)
```

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

### Base Calculation
```
Base Reward = Order base value ($200-$800)
Accuracy Multiplier = Components matched / Components required
Time Bonus = (timeRemaining / totalTime) * 0.25 * baseReward
Tip = (accuracy == 100%) ? baseReward * customer.tipMultiplier - baseReward : 0

Total = (baseReward * accuracyMultiplier) + timeBonus + tip
```

### Penalties
- Missing component: -20% per missing
- Extra unnecessary component: -5% per extra
- Timeout: 0 cash, order fails

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

### Drag and Drop
- Use native HTML5 drag and drop or react-dnd
- Components can be dragged from palette to build area
- Click to remove from build area
- Visual feedback on valid drop zones

### Real-time Terraform
- Update TF code on every component add/remove
- Syntax highlighting with CSS
- Collapse/expand toggle

### Responsive Design
- Desktop-first (drag-drop works best)
- Mobile: tap-to-add instead of drag

---

## 14) Setup Commands

```bash
npx create-next-app@latest papas-do-eria --typescript --tailwind --app --eslint
cd papas-do-eria
npm run dev
```

---

## 15) Deployment

Push to GitHub. Connect repo to DO App Platform.

**Build command:** `npm run build`  
**Run command:** `npm start`  
**Port:** 3000

---

## 16) Stretch Goals (Priority Order)

1. Sound effects (cash register, component placement)
2. Animations (component slide, cash pop)
3. Real customer logos (with permission)
4. Leaderboard
5. More order scenarios
6. Functional shop with upgrades
7. Difficulty levels
