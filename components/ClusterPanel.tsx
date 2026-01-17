"use client";

import { ClusterState } from "@/lib/types";

type ClusterPanelProps = {
  clusterState: ClusterState;
};

export default function ClusterPanel({ clusterState }: ClusterPanelProps) {
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Cluster State
        </h3>
        <span className="text-xs text-slate-500 font-mono ml-auto">
          ns/{clusterState.namespace}
        </span>
      </div>
      <div className="space-y-3">
        {clusterState.deployments.map((dep) => {
          const pods = clusterState.pods.filter((p) => p.owner === dep.name);
          const allReady = dep.readyReplicas === dep.replicas;

          return (
            <div
              key={dep.name}
              className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      allReady ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  ></div>
                  <span className="font-mono text-slate-200">{dep.name}</span>
                </div>
                <span
                  className={`font-mono text-sm ${
                    allReady ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {dep.readyReplicas}/{dep.replicas} ready
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {pods.map((pod) => (
                  <span
                    key={pod.name}
                    className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono"
                    title={`Status: ${pod.status}`}
                  >
                    {pod.name.split("-").slice(-1)[0]}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
