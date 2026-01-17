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
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 shadow-xl h-full">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
        Components
      </h3>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2 py-1 text-xs rounded-lg transition-all ${
              activeCategory === cat.id
                ? "bg-cyan-600 text-white"
                : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Component List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {filteredComponents.map((component) => (
          <div
            key={component.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("component", JSON.stringify(component));
              onDragStart(component);
            }}
            onClick={() => onComponentClick(component)}
            className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-600 rounded-lg cursor-grab active:cursor-grabbing hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all group"
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

      <p className="text-slate-500 text-xs mt-3 text-center">
        Drag or click to add
      </p>
    </div>
  );
}
