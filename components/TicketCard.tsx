"use client";

import { Ticket } from "@/lib/types";

type TicketCardProps = {
  ticket: Ticket;
  ticketNumber: number;
  maxTickets: number;
};

export default function TicketCard({
  ticket,
  ticketNumber,
  maxTickets,
}: TicketCardProps) {
  const typeLabel =
    ticket.type === "SCALE_DEPLOYMENT" ? "⚖️ SCALE" : "🔄 RESTART";
  const typeColor =
    ticket.type === "SCALE_DEPLOYMENT"
      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
      : "bg-cyan-500/20 text-cyan-300 border-cyan-500/50";

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 font-mono text-sm">
          TICKET #{ticketNumber} / {maxTickets}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${typeColor}`}
        >
          {typeLabel}
        </span>
      </div>
      <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
        <p className="text-xl font-semibold text-slate-100 leading-relaxed">
          &ldquo;{ticket.description}&rdquo;
        </p>
      </div>
      <div className="mt-4 text-xs text-slate-500 font-mono">
        ID: {ticket.ticketId}
      </div>
    </div>
  );
}
