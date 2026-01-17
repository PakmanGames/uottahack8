// lib/scoring.ts
import { Order, PlacedComponent, OrderResult } from "./types";

export function scoreOrder(
  order: Order,
  placedComponents: PlacedComponent[],
  timeRemaining: number
): OrderResult {
  // Count placed components by type
  const placedCounts: Record<string, number> = {};
  placedComponents.forEach((p) => {
    const type = p.component.type;
    placedCounts[type] = (placedCounts[type] || 0) + 1;
  });

  // Count required components
  const requiredCounts: Record<string, number> = {};
  order.requiredComponents.forEach((req) => {
    requiredCounts[req.componentType] = req.quantity;
  });

  // Find missing and extra components
  const missing: string[] = [];
  const extra: string[] = [];

  // Check for missing
  for (const [type, required] of Object.entries(requiredCounts)) {
    const placed = placedCounts[type] || 0;
    if (placed < required) {
      for (let i = 0; i < required - placed; i++) {
        missing.push(type);
      }
    }
  }

  // Check for extra
  for (const [type, placed] of Object.entries(placedCounts)) {
    const required = requiredCounts[type] || 0;
    if (placed > required) {
      for (let i = 0; i < placed - required; i++) {
        extra.push(type);
      }
    }
  }

  // Calculate accuracy
  const totalRequired = order.requiredComponents.reduce((sum, r) => sum + r.quantity, 0);
  const correctlyPlaced = totalRequired - missing.length;
  const accuracy = totalRequired > 0 ? Math.round((correctlyPlaced / totalRequired) * 100) : 0;

  // Calculate cash
  let cashEarned = 0;
  let tip = 0;
  let success = false;
  let message = "";

  if (missing.length === 0 && extra.length === 0) {
    // Perfect order!
    success = true;
    cashEarned = order.baseReward;

    // Time bonus: up to 25% of base reward
    const timeBonus = Math.round((timeRemaining / order.timeLimitSec) * 0.25 * order.baseReward);
    cashEarned += timeBonus;

    // Customer tip for perfect orders
    tip = Math.round(order.baseReward * (order.customer.tipMultiplier - 1));
    cashEarned += tip;

    message = `Perfect infrastructure! ${order.customer.name} is impressed! +$${tip} tip!`;
  } else if (missing.length === 0 && extra.length > 0) {
    // All required present, but extras
    success = true;
    const extraPenalty = extra.length * 0.05; // 5% penalty per extra
    cashEarned = Math.round(order.baseReward * (1 - extraPenalty));
    message = `Good work, but you added ${extra.length} unnecessary component(s). Slightly over-provisioned!`;
  } else if (accuracy >= 50) {
    // Partial success
    success = true;
    cashEarned = Math.round(order.baseReward * (accuracy / 100));
    message = `Incomplete infrastructure. Missing: ${missing.join(", ")}. Partial payment.`;
  } else {
    // Failed
    success = false;
    cashEarned = 0;
    message = `Order failed! Missing too many components: ${missing.join(", ")}`;
  }

  return {
    success,
    accuracy,
    cashEarned,
    tip,
    message,
    missing,
    extra,
  };
}

export function scoreTimeout(order: Order): OrderResult {
  return {
    success: false,
    accuracy: 0,
    cashEarned: 0,
    tip: 0,
    message: `Time's up! ${order.customer.name} left disappointed.`,
    missing: order.requiredComponents.map((r) => r.componentType),
    extra: [],
  };
}
