// POST /api/ticket - Generates a new random ticket based on current cluster state

import { NextResponse } from "next/server";
import { getClusterState } from "@/lib/cluster-state";
import { generateTicket } from "@/lib/ticket-generator";

export async function POST() {
  const clusterState = getClusterState();
  const ticket = generateTicket(clusterState);
  return NextResponse.json(ticket);
}
