"use client";

import { useState, useEffect } from "react";
import { Ticket, Action, ClusterState } from "@/lib/types";

type ActionControlsProps = {
  ticket: Ticket;
  clusterState: ClusterState;
  onSubmit: (action: Action) => void;
  disabled: boolean;
};

export default function ActionControls({
  ticket,
  clusterState,
  onSubmit,
  disabled,
}: ActionControlsProps) {
  const [selectedDeployment, setSelectedDeployment] = useState("");
  const [selectedPod, setSelectedPod] = useState("");
  const [replicas, setReplicas] = useState(1);

  // Reset selections when ticket changes
  useEffect(() => {
    setSelectedDeployment("");
    setSelectedPod("");
    setReplicas(1);
  }, [ticket.ticketId]);

  const handleSubmit = () => {
    if (ticket.type === "SCALE_DEPLOYMENT") {
      if (!selectedDeployment) return;
      onSubmit({
        type: "SCALE_DEPLOYMENT",
        deployment: selectedDeployment,
        replicas,
      });
    } else {
      if (!selectedPod) return;
      onSubmit({
        type: "RESTART_POD",
        pod: selectedPod,
      });
    }
  };

  const isValid =
    ticket.type === "SCALE_DEPLOYMENT" ? !!selectedDeployment : !!selectedPod;

  if (ticket.type === "SCALE_DEPLOYMENT") {
    return (
      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Action: Scale Deployment
        </h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-slate-400 mb-2">
              Deployment
            </label>
            <select
              value={selectedDeployment}
              onChange={(e) => setSelectedDeployment(e.target.value)}
              disabled={disabled}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
            >
              <option value="">Select deployment...</option>
              {clusterState.deployments.map((dep) => (
                <option key={dep.name} value={dep.name}>
                  {dep.name} ({dep.readyReplicas}/{dep.replicas})
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-sm text-slate-400 mb-2">
              Replicas
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={replicas}
              onChange={(e) => setReplicas(parseInt(e.target.value) || 1)}
              disabled={disabled}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={disabled || !isValid}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-amber-500/25 disabled:shadow-none disabled:cursor-not-allowed"
          >
            SUBMIT
          </button>
        </div>
      </div>
    );
  }

  // RESTART_POD
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
        Action: Restart Pod
      </h3>
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm text-slate-400 mb-2">Pod</label>
          <select
            value={selectedPod}
            onChange={(e) => setSelectedPod(e.target.value)}
            disabled={disabled}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:opacity-50"
          >
            <option value="">Select pod...</option>
            {clusterState.pods.map((pod) => (
              <option key={pod.name} value={pod.name}>
                {pod.name} ({pod.status})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSubmit}
          disabled={disabled || !isValid}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 disabled:shadow-none disabled:cursor-not-allowed"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}
