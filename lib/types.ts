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
  type: string; // "droplet-basic", "postgres", "load-balancer"
  name: string; // Display name
  icon: string; // Emoji icon
  category: ComponentCategory;
  monthlyCost: number;
  description: string;
  terraformResource: string; // "digitalocean_droplet"
  terraformConfig: Record<string, unknown>; // Terraform-specific config
};

// Customer placing order
export type Customer = {
  id: string;
  name: string;
  logo: string;
  color: string;
  patience: number; // 1-5, affects timer
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
  scenario: string; // "Web Application Stack"
  description: string; // Customer's request text
  requiredComponents: OrderComponent[];
  timeLimitSec: number;
  baseReward: number;
};

// Placed component in build area
export type PlacedComponent = {
  instanceId: string; // Unique per placement
  component: DOComponent;
};

// Player's current build
export type BuildArea = {
  placedComponents: PlacedComponent[];
};

// Order result
export type OrderResult = {
  success: boolean;
  accuracy: number; // 0-100%
  cashEarned: number;
  tip: number;
  message: string;
  missing: string[]; // Missing component types
  extra: string[]; // Unnecessary component types
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

// For API responses
export type OrderResponse = Order;

export type SubmitRequest = {
  orderId: string;
  placedComponents: { instanceId: string; componentType: string }[];
  timeRemaining: number;
};

export type SubmitResponse = OrderResult;
