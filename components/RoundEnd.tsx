"use client";

import { useState, useEffect } from "react";

type RoundEndProps = {
  cash: number;
  round: number;
  ordersCompleted: number;
  perfectOrders: number;
  onNextRound: () => void;
  onBackToMenu: () => void;
  onOpenShop: () => void;
};

// Rain effect component - client-side only
function RainDrops() {
  const [drops, setDrops] = useState<{ left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const newDrops = [...Array(40)].map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${0.5 + Math.random() * 1}s`,
    }));
    setDrops(newDrops);
  }, []);

  if (drops.length === 0) return null;

  return (
    <div className="rain-container">
      {drops.map((drop, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
          }}
        />
      ))}
    </div>
  );
}

export default function RoundEnd({
  cash,
  round,
  ordersCompleted,
  perfectOrders,
  onNextRound,
  onBackToMenu,
  onOpenShop,
}: RoundEndProps) {
  const rating =
    perfectOrders >= 4 ? "⛈️⛈️⛈️" : perfectOrders >= 2 ? "🌧️🌧️" : "🌦️";
  const message =
    perfectOrders >= 4
      ? "Storm Chaser Elite!"
      : perfectOrders >= 2
        ? "Rain Maker Pro!"
        : "Keep Brewing!";

  return (
    <div className="fixed inset-0 storm-bg flex items-center justify-center z-50 overflow-hidden">
      {/* Rain effect */}
      <RainDrops />
      
      {/* Lightning flash */}
      <div className="lightning-flash" />
      
      {/* Floating clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 text-6xl opacity-20 animate-cloud-float">☁️</div>
        <div className="absolute bottom-40 right-20 text-5xl opacity-20 animate-cloud-float" style={{ animationDelay: '3s' }}>🌧️</div>
        <div className="absolute top-1/3 right-10 text-4xl opacity-20 animate-cloud-float" style={{ animationDelay: '1.5s' }}>💰</div>
      </div>
      
      <div className="cloud-card border border-slate-700 rounded-3xl p-10 max-w-lg w-full mx-4 text-center shadow-2xl relative z-10">
        <div className="text-5xl mb-4">🌧️</div>
        <h2 className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          STORM {round} COMPLETE!
        </h2>
        <p className="text-slate-400 mb-6">The clouds have cleared... for now.</p>

        <div className="text-5xl mb-4">{rating}</div>
        <p className="text-xl text-slate-300 mb-6">{message}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-cyan-500/20">
            <p className="text-slate-400 text-sm mb-1 flex items-center justify-center gap-1">
              <span>☁️</span> Deployments
            </p>
            <p className="font-mono text-2xl font-bold text-slate-200">
              {ordersCompleted}/5
            </p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-emerald-500/20">
            <p className="text-slate-400 text-sm mb-1 flex items-center justify-center gap-1">
              <span>⛈️</span> Perfect Storms
            </p>
            <p className="font-mono text-2xl font-bold text-amber-400">
              {perfectOrders}
            </p>
          </div>
        </div>

        {/* Cash Display */}
        <div className="bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-xl p-6 mb-6 border border-emerald-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-4xl opacity-10">💰</div>
          <p className="text-slate-400 text-sm mb-2 flex items-center justify-center gap-2">
            <span>🌧️</span> TOTAL EARNINGS <span>💸</span>
          </p>
          <p className="font-mono text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            ${cash.toLocaleString()}
          </p>
          <p className="text-emerald-400/60 text-xs mt-2">You made it rain!</p>
        </div>

        {/* Shop Button */}
        <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 rounded-xl p-4 mb-6 border border-purple-500/30">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">⚡</span>
            <h3 className="text-slate-200 font-bold text-lg">POWER-UPS</h3>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Upgrade your storm-making abilities!
          </p>
          <button
            onClick={onOpenShop}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-600 hover:from-purple-400 hover:via-pink-400 hover:to-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            <span>🛒</span> Browse Power-Ups
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBackToMenu}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-4 px-8 rounded-xl transition-all duration-200"
          >
            🏠 Main Menu
          </button>
          <button
            onClick={onNextRound}
            className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 text-lg flex items-center justify-center gap-2"
          >
            <span>⛈️</span> Next Storm →
          </button>
        </div>
      </div>
    </div>
  );
}
