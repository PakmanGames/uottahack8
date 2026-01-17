// GET /api/cluster - Returns current cluster state

import { NextResponse } from "next/server";
import { getClusterState } from "@/lib/cluster-state";

export async function GET() {
  const clusterState = getClusterState();
  return NextResponse.json(clusterState);
}
