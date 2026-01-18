"use client";

import { ShopState, Upgrade } from "@/lib/types";

type ShopProps = {
  cash: number;
  shopState: ShopState;
  onPurchase: (upgradeType: string) => void;
  onContinue: () => void;
};

const UPGRADES: Upgrade[] = [
  {
    id: "time-bonus",
    type: "time-bonus",
    name: "Extra Time",
    description: "Add more time to each order",
    icon: "⏰",
    baseCost: 300,
    maxLevel: 3,
    effect: "+10 seconds per level",
  },
  {
    id: "tip-multiplier",
    type: "tip-multiplier",
    name: "Charm School",
    description: "Increase tip amounts from customers",
    icon: "💎",
    baseCost: 400,
    maxLevel: 3,
    effect: "+20% tip bonus per level",
  },
  {
    id: "auto-complete",
    type: "auto-complete",
    name: "Smart Assistant",
    description: "Auto-fills components when you start building",
    icon: "🤖",
    baseCost: 600,
    maxLevel: 2,
    effect: "Auto-place components",
  },
  {
    id: "premium-orders",
    type: "premium-orders",
    name: "Premium Orders",
    description: "Unlock harder orders with bigger payouts",
    icon: "💰",
    baseCost: 800,
    maxLevel: 1,
    effect: "High-reward challenges",
  },
];

export default function Shop({ cash, shopState, onPurchase, onContinue }: ShopProps) {
  const getUpgradeLevel = (type: string): number => {
    switch (type) {
      case "time-bonus":
        return shopState.timeBonusLevel;
      case "tip-multiplier":
        return shopState.tipMultiplierLevel;
      case "auto-complete":
        return shopState.autoCompleteLevel;
      case "premium-orders":
        return shopState.premiumOrdersUnlocked ? 1 : 0;
      default:
        return 0;
    }
  };

  const getUpgradeCost = (upgrade: Upgrade, currentLevel: number): number => {
    return Math.floor(upgrade.baseCost * Math.pow(1.5, currentLevel));
  };

  const canAfford = (cost: number): boolean => cash >= cost;
  const isMaxLevel = (upgrade: Upgrade, level: number): boolean => level >= upgrade.maxLevel;

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            🏪 UPGRADE SHOP
          </h2>
          <p className="text-slate-400">Invest in your infrastructure business</p>
          
          {/* Cash Display */}
          <div className="mt-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl p-4 border border-emerald-500/30 inline-block">
            <p className="text-slate-400 text-sm mb-1">Available Cash</p>
            <p className="font-mono text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              ${cash.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Upgrades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {UPGRADES.map((upgrade) => {
            const currentLevel = getUpgradeLevel(upgrade.type);
            const cost = getUpgradeCost(upgrade, currentLevel);
            const maxed = isMaxLevel(upgrade, currentLevel);
            const affordable = canAfford(cost);

            return (
              <div
                key={upgrade.id}
                className={`bg-slate-900/60 rounded-xl p-6 border ${
                  maxed
                    ? "border-amber-500/50 bg-amber-500/5"
                    : affordable
                      ? "border-slate-700/50 hover:border-cyan-500/50"
                      : "border-slate-700/30 opacity-60"
                } transition-all duration-200`}
              >
                {/* Upgrade Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{upgrade.icon}</span>
                    <div>
                      <h3 className="font-bold text-slate-200 text-lg">{upgrade.name}</h3>
                      <p className="text-slate-400 text-sm">{upgrade.description}</p>
                    </div>
                  </div>
                </div>

                {/* Level Indicator */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-500">Level</span>
                    <span className="text-slate-300 font-bold">
                      {currentLevel} / {upgrade.maxLevel}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: upgrade.maxLevel }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded-full ${
                          i < currentLevel
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                            : "bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Effect */}
                <div className="bg-slate-800/60 rounded-lg p-3 mb-4 border border-slate-700/30">
                  <p className="text-slate-300 text-sm">
                    <span className="text-cyan-400 font-mono">↪</span> {upgrade.effect}
                  </p>
                  {currentLevel > 0 && (
                    <p className="text-emerald-400 text-xs mt-1">
                      ✓ Currently active: Level {currentLevel}
                    </p>
                  )}
                </div>

                {/* Purchase Button */}
                {maxed ? (
                  <div className="bg-amber-500/20 text-amber-400 font-bold py-3 px-4 rounded-lg text-center border border-amber-500/30">
                    ⭐ MAX LEVEL
                  </div>
                ) : (
                  <button
                    onClick={() => onPurchase(upgrade.type)}
                    disabled={!affordable}
                    className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-200 ${
                      affordable
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-lg hover:shadow-emerald-500/25"
                        : "bg-slate-700 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {affordable ? (
                      <>💰 Purchase - ${cost.toLocaleString()}</>
                    ) : (
                      <>🔒 Need ${cost.toLocaleString()}</>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 text-lg"
        >
          Continue to Next Round →
        </button>
      </div>
    </div>
  );
}
