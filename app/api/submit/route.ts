// app/api/submit/route.ts
import { NextResponse } from "next/server";
import { SubmitRequest, Order, PlacedComponent } from "@/lib/types";
import { scoreOrder } from "@/lib/scoring";
import { getComponentByType } from "@/lib/components-data";

// Store current order (in production, use proper state management)
let currentOrder: Order | null = null;

export function setCurrentOrder(order: Order) {
  currentOrder = order;
}

export async function POST(request: Request) {
  const body: SubmitRequest & { order: Order; tipMultiplierBonus?: number } = await request.json();

  // Use the order from the request (client sends it)
  const order = body.order;
  const tipMultiplierBonus = body.tipMultiplierBonus || 0;

  if (!order) {
    return NextResponse.json(
      { error: "No active order" },
      { status: 400 }
    );
  }

  // Reconstruct placed components from the request
  const placedComponents: PlacedComponent[] = body.placedComponents
    .map((p) => {
      const component = getComponentByType(p.componentType);
      if (!component) return null;
      return {
        instanceId: p.instanceId,
        component,
      };
    })
    .filter((p): p is PlacedComponent => p !== null);

  const result = scoreOrder(order, placedComponents, body.timeRemaining, tipMultiplierBonus);

  return NextResponse.json(result);
}
