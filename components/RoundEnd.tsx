"use client";

type RoundEndProps = {
  cash: number;
  round: number;
  ordersCompleted: number;
  perfectOrders: number;
  onNextRound: () => void;
  onBackToMenu: () => void;
};

export default function RoundEnd({
  cash,
  round,
  ordersCompleted,
  perfectOrders,
  onNextRound,
  onBackToMenu,
}: RoundEndProps) {
  const rating =
    perfectOrders >= 4 ? "⭐⭐⭐" : perfectOrders >= 2 ? "⭐⭐" : "⭐";
  const message =
    perfectOrders >= 4
      ? "Cloud Architect Master!"
      : perfectOrders >= 2
        ? "Solid Infrastructure Work!"
        : "Keep Building!";

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 max-w-lg w-full mx-4 text-center shadow-2xl">
        <h2 className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          ROUND {round} COMPLETE!
        </h2>
        <p className="text-slate-400 mb-6">Great work today!</p>

        <div className="text-6xl mb-4">{rating}</div>
        <p className="text-xl text-slate-300 mb-6">{message}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-sm mb-1">Orders Completed</p>
            <p className="font-mono text-2xl font-bold text-slate-200">
              {ordersCompleted}/5
            </p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-sm mb-1">Perfect Orders</p>
            <p className="font-mono text-2xl font-bold text-amber-400">
              {perfectOrders}
            </p>
          </div>
        </div>

        {/* Cash Display */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl p-6 mb-6 border border-emerald-500/30">
          <p className="text-slate-400 text-sm mb-2">TOTAL CASH</p>
          <p className="font-mono text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            ${cash.toLocaleString()}
          </p>
        </div>

        {/* Shop Placeholder */}
        <div className="bg-slate-900/40 rounded-xl p-4 mb-6 border border-slate-700/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl">🏪</span>
            <h3 className="text-slate-300 font-bold">SHOP</h3>
            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
              Coming Soon
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Upgrades will be available in a future update:
          </p>
          <ul className="text-slate-600 text-xs mt-2 space-y-1">
            <li>• Faster drag speed</li>
            <li>• More time per order</li>
            <li>• Auto-complete hints</li>
            <li>• Premium customers</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBackToMenu}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-4 px-8 rounded-xl transition-all duration-200"
          >
            Main Menu
          </button>
          <button
            onClick={onNextRound}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 text-lg"
          >
            Next Round →
          </button>
        </div>
      </div>
    </div>
  );
}
