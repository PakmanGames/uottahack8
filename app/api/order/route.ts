// app/api/order/route.ts
import { NextResponse } from "next/server";
import { generateOrder } from "@/lib/order-generator";

export async function POST() {
  const order = generateOrder();
  return NextResponse.json(order);
}
