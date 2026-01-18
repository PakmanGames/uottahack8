"use client";

import { Order } from "@/lib/types";
import { getComponentByType } from "@/lib/components-data";

type OrderTicketProps = {
  order: Order;
  orderNumber: number;
  maxOrders: number;
};

export default function OrderTicket({
  order,
  orderNumber,
  maxOrders,
}: OrderTicketProps) {
  return (
    <div
      className="cloud-card rounded-2xl p-6 shadow-xl relative overflow-hidden"
      style={{ borderColor: order.customer.color, borderWidth: '2px' }}
    >
      {/* Weather pattern decoration */}
      <div className="absolute top-0 right-0 text-6xl opacity-5 pointer-events-none">
        ⛈️
      </div>
      
      {/* Customer Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden relative"
            style={{ backgroundColor: `${order.customer.color}20` }}
          >
            <img 
              src={order.customer.logo} 
              alt={order.customer.name} 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: order.customer.color }}
            >
              {order.customer.name}
            </h2>
            <p className="text-slate-400 text-sm flex items-center gap-1">
              <span>☁️</span>
              {order.scenario}
            </p>
          </div>
        </div>
        <span className="text-slate-400 font-mono text-sm bg-slate-900/60 px-3 py-1 rounded-full flex items-center gap-2">
          <span>🌧️</span>
          Deploy #{orderNumber} / {maxOrders}
        </span>
      </div>

      {/* Description - styled as weather forecast */}
      <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50 mb-4 relative">
        <div className="absolute -top-2 left-4 bg-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded-full border border-cyan-500/30">
          📡 INCOMING REQUEST
        </div>
        <p className="text-lg text-slate-100 leading-relaxed mt-2">
          &ldquo;{order.description}&rdquo;
        </p>
      </div>

      {/* Required Components - styled as weather forecast items */}
      <div className="mt-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>⛅</span>
          Cloud Infrastructure Needed
        </h3>
        <div className="flex flex-wrap gap-2">
          {order.requiredComponents.map((req, idx) => {
            const component = getComponentByType(req.componentType);
            if (!component) return null;

            return (
              <div
                key={idx}
                className="flex items-center gap-2 bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-cyan-500/20 rounded-lg px-3 py-2 hover:border-cyan-500/40 transition-colors"
              >
                <span className="text-xl">{component.icon}</span>
                <span className="text-slate-300 text-sm font-medium">
                  {component.name}
                </span>
                {req.quantity > 1 && (
                  <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded-full">
                    x{req.quantity}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-mono border-t border-slate-700/30 pt-3">
        <span className="flex items-center gap-1">
          <span>📍</span>
          ID: {order.orderId}
        </span>
        <span className="text-emerald-400 flex items-center gap-1">
          <span>💰</span>
          Payout: ${order.baseReward}
        </span>
      </div>
    </div>
  );
}
