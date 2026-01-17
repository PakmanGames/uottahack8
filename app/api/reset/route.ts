// POST /api/reset - Resets cluster state to initial values

import { NextResponse } from "next/server";
import { resetState } from "@/lib/cluster-state";
import { resetTicketCounter } from "@/lib/ticket-generator";

export async function POST() {
  resetState();
  resetTicketCounter();
  return NextResponse.json({ success: true });
}
