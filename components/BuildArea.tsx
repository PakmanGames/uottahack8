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
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 shadow-xl flex-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Build Area
        </h3>
        <span className="text-emerald-400 text-sm font-mono">
          ${totalCost}/mo
        </span>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`min-h-[200px] rounded-xl border-2 border-dashed p-4 transition-all ${
          isDragOver
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-slate-600 bg-slate-900/40"
        }`}
      >
        {placedComponents.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-center">
            <div>
              <p className="text-3xl mb-2">📦</p>
              <p>Drag components here</p>
              <p className="text-xs mt-1">or click components to add</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {placedComponents.map((placed) => (
              <div
                key={placed.instanceId}
                onClick={() => onRemove(placed.instanceId)}
                className="group relative flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 cursor-pointer hover:border-red-500/50 hover:bg-red-500/10 transition-all"
              >
                <span className="text-xl">{placed.component.icon}</span>
                <span className="text-slate-300 text-sm">
                  {placed.component.name}
                </span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ×
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {placedComponents.length > 0 && (
        <p className="text-slate-500 text-xs mt-2 text-center">
          Click a component to remove it
        </p>
      )}
    </div>
  );
}
