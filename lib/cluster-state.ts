// lib/cluster-state.ts

import { ClusterState, Deployment, Pod } from "./types";

const INITIAL_DEPLOYMENTS: Deployment[] = [
  { name: "smoothie-api", replicas: 2, readyReplicas: 2 },
  { name: "toppings-worker", replicas: 1, readyReplicas: 1 },
  { name: "order-queue", replicas: 2, readyReplicas: 2 },
];

// In-memory state (resets on server restart)
let deployments = structuredClone(INITIAL_DEPLOYMENTS);
let pods = generatePods(deployments);

function randomSuffix(): string {
  return Math.random().toString(36).substring(2, 7);
}

function generatePods(deps: Deployment[]): Pod[] {
  return deps.flatMap((dep) =>
    Array.from({ length: dep.replicas }, () => ({
      name: `${dep.name}-${randomSuffix()}`,
      ready: true,
      status: "Running",
      owner: dep.name,
    }))
  );
}

export function getClusterState(): ClusterState {
  return { namespace: "kuberia", deployments, pods };
}

export function scaleDeployment(name: string, replicas: number): void {
  const dep = deployments.find((d) => d.name === name);
  if (dep) {
    dep.replicas = replicas;
    dep.readyReplicas = replicas;
    pods = generatePods(deployments);
  }
}

export function restartPod(podName: string): void {
  const pod = pods.find((p) => p.name === podName);
  if (pod) {
    pod.name = `${pod.owner}-${randomSuffix()}`;
  }
}

export function resetState(): void {
  deployments = structuredClone(INITIAL_DEPLOYMENTS);
  pods = generatePods(deployments);
}
