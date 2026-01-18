"use client";

import { PlacedComponent, DOComponent } from "@/lib/types";
import { useState } from "react";

type BuildAreaProps = {
  placedComponents: PlacedComponent[];
  onDrop: (component: DOComponent) => void;
  onRemove: (instanceId: string) => void;
};

export default function BuildArea({
  placedComponents,
  onDrop,
  onRemove,
}: BuildAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const data = e.dataTransfer.getData("component");
    if (data) {
      const component: DOComponent = JSON.parse(data);
      onDrop(component);
    }
  };

  const totalCost = placedComponents.reduce(
    (sum, p) => sum + p.component.monthlyCost,
    0
  );

  return (
    <div className="cloud-card rounded-2xl p-4 shadow-xl flex-1 relative overflow-hidden">
      {/* Background cloud pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-4 -right-4 text-8xl opacity-5">☁️</div>
        <div className="absolute top-10 -left-4 text-6xl opacity-5">🌧️</div>
      </div>
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <span>☁️</span>
          Cloud Formation
        </h3>
        <span className="text-emerald-400 text-sm font-mono flex items-center gap-1">
          <span>💵</span>
          ${totalCost}/mo
        </span>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`min-h-[200px] rounded-xl border-2 border-dashed p-4 transition-all relative ${
          isDragOver
            ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
            : "border-slate-600 bg-slate-900/40"
        }`}
      >
        {placedComponents.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-center">
            <div>
              <p className="text-5xl mb-3 opacity-50">☁️</p>
              <p className="text-lg">Drop cloud components here</p>
              <p className="text-xs mt-2 text-slate-600">or click components to add</p>
              <p className="text-xs mt-4 text-cyan-500/50">Build your infrastructure</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {placedComponents.map((placed) => (
              <div
                key={placed.instanceId}
                onClick={() => onRemove(placed.instanceId)}
                className="group relative flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-700 border border-cyan-500/30 rounded-lg px-3 py-2 cursor-pointer hover:border-red-500/50 hover:bg-red-500/10 transition-all shadow-sm hover:shadow-red-500/20"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{placed.component.icon}</span>
                <span className="text-slate-300 text-sm">
                  {placed.component.name}
                </span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  ×
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {placedComponents.length > 0 && (
        <p className="text-slate-500 text-xs mt-2 text-center flex items-center justify-center gap-1">
          <span>🌬️</span>
          Click a cloud to remove it
        </p>
      )}
    </div>
  );
}
