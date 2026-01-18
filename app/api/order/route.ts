// app/api/order/route.ts
import { NextResponse } from "next/server";
import { generateOrder } from "@/lib/order-generator";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const premiumOrdersUnlocked = body.premiumOrdersUnlocked || false;
  const order = generateOrder(premiumOrdersUnlocked);
  return NextResponse.json(order);
}
