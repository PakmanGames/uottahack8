"use client";

import { useEffect, useState } from "react";

type CashDisplayProps = {
  cash: number;
};

export default function CashDisplay({ cash }: CashDisplayProps) {
  const [displayCash, setDisplayCash] = useState(cash);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (cash !== displayCash) {
      setIsAnimating(true);
      // Animate the cash change
      const diff = cash - displayCash;
      const steps = 20;
      const stepValue = diff / steps;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        if (step >= steps) {
          setDisplayCash(cash);
          setIsAnimating(false);
          clearInterval(interval);
        } else {
          setDisplayCash((prev) => prev + stepValue);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [cash, displayCash]);

  return (
    <div
      className={`flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/50 rounded-xl px-4 py-2 transition-all ${
        isAnimating ? "scale-110 bg-emerald-500/30" : ""
      }`}
    >
      <span className="text-xl">💰</span>
      <span className="font-mono font-bold text-emerald-400 text-lg">
        ${Math.round(displayCash).toLocaleString()}
      </span>
    </div>
  );
}
