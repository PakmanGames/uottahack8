// lib/types.ts

export type TicketType = "SCALE_DEPLOYMENT" | "RESTART_POD";

export type Ticket = {
  ticketId: string;
  type: TicketType;
  target: {
    deployment?: string;
    pod?: string;
    replicas?: number;
  };
  description: string;
  timeLimitSec: number;
};

export type Action =
  | { type: "SCALE_DEPLOYMENT"; deployment: string; replicas: number }
  | { type: "RESTART_POD"; pod: string };

export type Deployment = {
  name: string;
  replicas: number;
  readyReplicas: number;
};

export type Pod = {
  name: string;
  ready: boolean;
  status: string;
  owner: string; // deployment name
};

export type ClusterState = {
  namespace: string;
  deployments: Deployment[];
  pods: Pod[];
};

export type ActionResult = {
  success: boolean;
  points: number;
  message: string;
  newClusterState: ClusterState;
};

export type GameState = {
  score: number;
  ticketNumber: number;
  maxTickets: number;
  currentTicket: Ticket | null;
  gameOver: boolean;
};

export type ClientGameState = {
  score: number;
  ticketNumber: number;
  currentTicket: Ticket | null;
  clusterState: ClusterState | null;
  timeRemaining: number;
  feedback: { success: boolean; message: string; points: number } | null;
  gameOver: boolean;
};
