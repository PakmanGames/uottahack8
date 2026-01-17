# Papa's Kuberia - Technical Specification

> A Papa's Freezeria-style web game where "orders" are Kubernetes ops tickets.  
> **Stack:** Next.js 14 (App Router) + Tailwind CSS  
> **Hosting:** DigitalOcean App Platform  
> **Mode:** Simulation only (in-memory state)

---

## 1) Acceptance Criteria

- [ ] Game presents tickets one at a time
- [ ] Player completes SCALE_DEPLOYMENT tickets (select deployment, enter replicas)
- [ ] Player completes RESTART_POD tickets (select pod)
- [ ] Cluster state updates after each action
- [ ] Timer counts down (30s per ticket), auto-fails on timeout
- [ ] Score accumulates (base 100 + time bonus)
- [ ] Game ends after 5 tickets, shows final score
- [ ] Deployed on DO App Platform

---

## 2) Game Flow

```
START_GAME → SHOW_TICKET → PLAYER_ACTION → VALIDATE → SHOW_RESULT → NEXT_TICKET → (repeat 5x) → GAME_OVER
```

### Ticket Types

| Type | Player Input | Validation |
|------|--------------|------------|
| `SCALE_DEPLOYMENT` | deployment name + replica count | action matches ticket target |
| `RESTART_POD` | pod name | pod belongs to correct deployment |

### Scoring

- Base: 100 points
- Time bonus: remaining seconds × 2
- Wrong/timeout: 0 points

---

## 3) Architecture

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
└── ScoreDisplay.tsx
```

---

## 4) Types

```typescript
// lib/types.ts

export type TicketType = "SCALE_DEPLOYMENT" | "RESTART_POD";

export type Ticket = {
  ticketId: string;
  type: TicketType;
  target: {
    deployment?: string;
    pod?: string;
    replicas?: number;
  };
  description: string;
  timeLimitSec: number;
};

export type Action =
  | { type: "SCALE_DEPLOYMENT"; deployment: string; replicas: number }
  | { type: "RESTART_POD"; pod: string };

export type Deployment = {
  name: string;
  replicas: number;
  readyReplicas: number;
};

export type Pod = {
  name: string;
  ready: boolean;
  status: string;
  owner: string; // deployment name
};

export type ClusterState = {
  namespace: string;
  deployments: Deployment[];
  pods: Pod[];
};

export type ActionResult = {
  success: boolean;
  points: number;
  message: string;
  newClusterState: ClusterState;
};

export type GameState = {
  score: number;
  ticketNumber: number;
  maxTickets: number;
  currentTicket: Ticket | null;
  gameOver: boolean;
};
```

---

## 5) API Contracts

### GET `/api/cluster`

Returns current cluster state.

**Response:**

```json
{
  "namespace": "kuberia",
  "deployments": [
    { "name": "smoothie-api", "replicas": 2, "readyReplicas": 2 },
    { "name": "toppings-worker", "replicas": 1, "readyReplicas": 1 },
    { "name": "order-queue", "replicas": 2, "readyReplicas": 2 }
  ],
  "pods": [
    { "name": "smoothie-api-x7k2m", "ready": true, "status": "Running", "owner": "smoothie-api" },
    { "name": "smoothie-api-p9n3q", "ready": true, "status": "Running", "owner": "smoothie-api" }
  ]
}
```

### POST `/api/ticket`

Generates a new random ticket based on current cluster state.

**Response:**

```json
{
  "ticketId": "t_001",
  "type": "SCALE_DEPLOYMENT",
  "target": {
    "deployment": "smoothie-api",
    "replicas": 3
  },
  "description": "Scale smoothie-api to 3 replicas",
  "timeLimitSec": 30
}
```

**Generation logic:**

- Pick random deployment
- For SCALE: choose replica count different from current (1-5 range)
- For RESTART: pick random pod from a deployment

### POST `/api/action`

Validates player action against current ticket and updates cluster state.

**Request:**

```json
{
  "ticketId": "t_001",
  "action": {
    "type": "SCALE_DEPLOYMENT",
    "deployment": "smoothie-api",
    "replicas": 3
  }
}
```

**Response (success):**

```json
{
  "success": true,
  "points": 148,
  "message": "Scaled smoothie-api to 3 replicas!",
  "newClusterState": { ... }
}
```

**Response (failure):**

```json
{
  "success": false,
  "points": 0,
  "message": "Wrong deployment selected",
  "newClusterState": { ... }
}
```

### POST `/api/reset`

Resets cluster state to initial values.

**Response:**

```json
{ "success": true }
```

---

## 6) Cluster State Manager

```typescript
// lib/cluster-state.ts

const INITIAL_DEPLOYMENTS: Deployment[] = [
  { name: "smoothie-api", replicas: 2, readyReplicas: 2 },
  { name: "toppings-worker", replicas: 1, readyReplicas: 1 },
  { name: "order-queue", replicas: 2, readyReplicas: 2 },
];

// In-memory state (resets on server restart)
let deployments = structuredClone(INITIAL_DEPLOYMENTS);
let pods = generatePods(deployments);

function randomSuffix(): string {
  return Math.random().toString(36).substring(2, 7);
}

function generatePods(deps: Deployment[]): Pod[] {
  return deps.flatMap((dep) =>
    Array.from({ length: dep.replicas }, () => ({
      name: `${dep.name}-${randomSuffix()}`,
      ready: true,
      status: "Running",
      owner: dep.name,
    }))
  );
}

export function getClusterState(): ClusterState {
  return { namespace: "kuberia", deployments, pods };
}

export function scaleDeployment(name: string, replicas: number): void {
  const dep = deployments.find((d) => d.name === name);
  if (dep) {
    dep.replicas = replicas;
    dep.readyReplicas = replicas;
    pods = generatePods(deployments);
  }
}

export function restartPod(podName: string): void {
  const pod = pods.find((p) => p.name === podName);
  if (pod) {
    pod.name = `${pod.owner}-${randomSuffix()}`;
  }
}

export function resetState(): void {
  deployments = structuredClone(INITIAL_DEPLOYMENTS);
  pods = generatePods(deployments);
}
```

---

## 7) Ticket Generator

```typescript
// lib/ticket-generator.ts

let ticketCounter = 0;

export function generateTicket(clusterState: ClusterState): Ticket {
  ticketCounter++;
  const ticketId = `t_${String(ticketCounter).padStart(3, "0")}`;
  
  // Randomly choose ticket type
  const type: TicketType = Math.random() > 0.5 ? "SCALE_DEPLOYMENT" : "RESTART_POD";
  
  if (type === "SCALE_DEPLOYMENT") {
    const dep = randomItem(clusterState.deployments);
    const newReplicas = pickDifferentReplicas(dep.replicas);
    return {
      ticketId,
      type: "SCALE_DEPLOYMENT",
      target: { deployment: dep.name, replicas: newReplicas },
      description: `Scale ${dep.name} to ${newReplicas} replicas`,
      timeLimitSec: 30,
    };
  } else {
    const dep = randomItem(clusterState.deployments);
    const depPods = clusterState.pods.filter((p) => p.owner === dep.name);
    const pod = randomItem(depPods);
    return {
      ticketId,
      type: "RESTART_POD",
      target: { pod: pod.name, deployment: dep.name },
      description: `Restart pod ${pod.name}`,
      timeLimitSec: 30,
    };
  }
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickDifferentReplicas(current: number): number {
  const options = [1, 2, 3, 4, 5].filter((n) => n !== current);
  return randomItem(options);
}

export function resetTicketCounter(): void {
  ticketCounter = 0;
}
```

---

## 8) UI Layout

```
┌─────────────────────────────────────────────────┐
│  PAPA'S KUBERIA           Score: 340    ⏱️ 25s  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  TICKET #3 / 5                            │  │
│  │  "Scale smoothie-api to 3 replicas"       │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────────┐ ┌──────────┐ ┌─────────────┐  │
│  │ Deployment ▼│ │ Replicas │ │   SUBMIT    │  │
│  └─────────────┘ └──────────┘ └─────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  ✓ Success! +148 points                   │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
├─────────────────────────────────────────────────┤
│  CLUSTER STATE                                  │
│  ┌───────────────────────────────────────────┐  │
│  │ smoothie-api       3/3 ready              │  │
│  │ toppings-worker    1/1 ready              │  │
│  │ order-queue        2/2 ready              │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Component Behavior

**ActionControls:**

- If ticket type is `SCALE_DEPLOYMENT`: show deployment dropdown + replicas number input
- If ticket type is `RESTART_POD`: show pod dropdown only

**Timer:**

- Counts down from 30 seconds
- Visual warning (red) when < 10 seconds
- On timeout: submit failure, advance to next ticket

**ClusterPanel:**

- Refreshes after each action
- Shows deployment name and ready/total replicas

---

## 9) Client State

```typescript
// Managed in page.tsx with useState/useReducer

type ClientGameState = {
  score: number;
  ticketNumber: number;
  currentTicket: Ticket | null;
  clusterState: ClusterState | null;
  timeRemaining: number;
  feedback: { success: boolean; message: string; points: number } | null;
  gameOver: boolean;
};
```

---

## 10) Setup Commands

```bash
npx create-next-app@latest papas-kuberia --typescript --tailwind --app --eslint
cd papas-kuberia
npm run dev
```

---

## 11) Deployment

Push to GitHub. Connect repo to DO App Platform.

**Build command:** `npm run build`  
**Run command:** `npm start`  
**Port:** 3000

---

## 12) Stretch Goals (Priority Order)

1. Visual polish (colors, hover states)
2. Sound effects (success ding, fail buzz)
3. Animations (ticket slide in, score pop)
4. Real DOKS cluster integration with mode toggle
