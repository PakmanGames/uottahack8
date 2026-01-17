// lib/ticket-generator.ts

import { ClusterState, Ticket, TicketType } from "./types";

let ticketCounter = 0;

export function generateTicket(clusterState: ClusterState): Ticket {
  ticketCounter++;
  const ticketId = `t_${String(ticketCounter).padStart(3, "0")}`;

  // Randomly choose ticket type
  const type: TicketType =
    Math.random() > 0.5 ? "SCALE_DEPLOYMENT" : "RESTART_POD";

  if (type === "SCALE_DEPLOYMENT") {
    const dep = randomItem(clusterState.deployments);
    const newReplicas = pickDifferentReplicas(dep.replicas);
    return {
      ticketId,
      type: "SCALE_DEPLOYMENT",
      target: { deployment: dep.name, replicas: newReplicas },
      description: `Scale ${dep.name} to ${newReplicas} replicas`,
      timeLimitSec: 30,
    };
  } else {
    const dep = randomItem(clusterState.deployments);
    const depPods = clusterState.pods.filter((p) => p.owner === dep.name);
    const pod = randomItem(depPods);
    return {
      ticketId,
      type: "RESTART_POD",
      target: { pod: pod.name, deployment: dep.name },
      description: `Restart pod ${pod.name}`,
      timeLimitSec: 30,
    };
  }
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickDifferentReplicas(current: number): number {
  const options = [1, 2, 3, 4, 5].filter((n) => n !== current);
  return randomItem(options);
}

export function resetTicketCounter(): void {
  ticketCounter = 0;
}
