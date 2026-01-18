"use client";

import { DOComponent, ComponentCategory } from "@/lib/types";
import { DO_COMPONENTS } from "@/lib/components-data";
import { useState } from "react";

type ComponentPaletteProps = {
  onDragStart: (component: DOComponent) => void;
  onComponentClick: (component: DOComponent) => void;
};

const CATEGORIES: { id: ComponentCategory; name: string; icon: string }[] = [
  { id: "compute", name: "Compute", icon: "💻" },
  { id: "database", name: "Database", icon: "🗄️" },
  { id: "storage", name: "Storage", icon: "📁" },
  { id: "networking", name: "Network", icon: "🌐" },
  { id: "other", name: "Other", icon: "⚙️" },
];

export default function ComponentPalette({
  onDragStart,
  onComponentClick,
}: ComponentPaletteProps) {
  const [activeCategory, setActiveCategory] =
    useState<ComponentCategory>("compute");

  const filteredComponents = DO_COMPONENTS.filter(
    (c) => c.category === activeCategory
  );

  return (
    <div className="cloud-card rounded-2xl p-4 shadow-xl h-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-4 -right-4 text-6xl opacity-5 pointer-events-none">⛅</div>
      
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 relative z-10">
        <span>🌩️</span>
        Cloud Components
      </h3>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 relative z-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2 py-1 text-xs rounded-lg transition-all ${
              activeCategory === cat.id
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Component List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 relative z-10">
        {filteredComponents.map((component) => (
          <div
            key={component.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("component", JSON.stringify(component));
              onDragStart(component);
            }}
            onClick={() => onComponentClick(component)}
            className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-900/80 to-slate-800/60 border border-slate-600/50 rounded-lg cursor-grab active:cursor-grabbing hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all group hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {component.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-sm font-medium truncate">
                {component.name}
              </p>
              <p className="text-slate-500 text-xs truncate">
                {component.description}
              </p>
            </div>
            <span className="text-emerald-400 text-xs font-mono whitespace-nowrap">
              ${component.monthlyCost}/mo
            </span>
          </div>
        ))}
      </div>

      <p className="text-slate-500 text-xs mt-3 text-center flex items-center justify-center gap-1 relative z-10">
        <span>☁️</span>
        Drag or click to add clouds
      </p>
    </div>
  );
}
