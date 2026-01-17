// POST /api/reset - Resets game state to initial values
import { NextResponse } from "next/server";
import { resetOrderCounter } from "@/lib/order-generator";

export async function POST() {
  resetOrderCounter();
  return NextResponse.json({ success: true });
}
