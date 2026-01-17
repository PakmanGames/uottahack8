// POST /api/action - Validates player action against current ticket and updates cluster state

import { NextRequest, NextResponse } from "next/server";
import {
  getClusterState,
  scaleDeployment,
  restartPod,
} from "@/lib/cluster-state";
import { Action, ActionResult, Ticket } from "@/lib/types";

type ActionRequest = {
  ticketId: string;
  action: Action;
  ticket: Ticket;
  timeRemaining: number;
};

export async function POST(request: NextRequest) {
  const body: ActionRequest = await request.json();
  const { action, ticket, timeRemaining } = body;

  let success = false;
  let message = "";
  let points = 0;

  if (ticket.type === "SCALE_DEPLOYMENT" && action.type === "SCALE_DEPLOYMENT") {
    // Validate deployment name and replica count
    if (
      action.deployment === ticket.target.deployment &&
      action.replicas === ticket.target.replicas
    ) {
      scaleDeployment(action.deployment, action.replicas);
      success = true;
      points = 100 + timeRemaining * 2;
      message = `Scaled ${action.deployment} to ${action.replicas} replicas!`;
    } else if (action.deployment !== ticket.target.deployment) {
      message = "Wrong deployment selected";
    } else {
      message = "Wrong replica count";
    }
  } else if (ticket.type === "RESTART_POD" && action.type === "RESTART_POD") {
    // Validate pod belongs to correct deployment
    const clusterState = getClusterState();
    const pod = clusterState.pods.find((p) => p.name === action.pod);

    if (pod && action.pod === ticket.target.pod) {
      restartPod(action.pod);
      success = true;
      points = 100 + timeRemaining * 2;
      message = `Restarted pod ${action.pod}!`;
    } else if (!pod) {
      message = "Pod not found";
    } else {
      message = "Wrong pod selected";
    }
  } else {
    message = "Action type does not match ticket type";
  }

  const result: ActionResult = {
    success,
    points,
    message,
    newClusterState: getClusterState(),
  };

  return NextResponse.json(result);
}
