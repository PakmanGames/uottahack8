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
      className="bg-slate-800/80 backdrop-blur-sm border-2 rounded-2xl p-6 shadow-xl"
      style={{ borderColor: order.customer.color }}
    >
      {/* Customer Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
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
            <p className="text-slate-400 text-sm">{order.scenario}</p>
          </div>
        </div>
        <span className="text-slate-400 font-mono text-sm bg-slate-900/60 px-3 py-1 rounded-full">
          Order #{orderNumber} / {maxOrders}
        </span>
      </div>

      {/* Description */}
      <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50 mb-4">
        <p className="text-lg text-slate-100 leading-relaxed">
          &ldquo;{order.description}&rdquo;
        </p>
      </div>

      {/* Required Components */}
      <div className="mt-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          Required Components
        </h3>
        <div className="flex flex-wrap gap-2">
          {order.requiredComponents.map((req, idx) => {
            const component = getComponentByType(req.componentType);
            if (!component) return null;

            return (
              <div
                key={idx}
                className="flex items-center gap-2 bg-slate-900/80 border border-slate-600 rounded-lg px-3 py-2"
              >
                <span className="text-xl">{component.icon}</span>
                <span className="text-slate-300 text-sm font-medium">
                  {component.name}
                </span>
                {req.quantity > 1 && (
                  <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full">
                    x{req.quantity}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>ID: {order.orderId}</span>
        <span className="text-emerald-400">
          Base Reward: ${order.baseReward}
        </span>
      </div>
    </div>
  );
}
