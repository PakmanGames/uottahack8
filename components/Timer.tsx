"use client";

import { useEffect } from "react";

type TimerProps = {
  timeRemaining: number;
  onTick: () => void;
  onTimeout: () => void;
  isRunning: boolean;
};

export default function Timer({
  timeRemaining,
  onTick,
  onTimeout,
  isRunning,
}: TimerProps) {
  useEffect(() => {
    if (!isRunning) return;

    if (timeRemaining <= 0) {
      onTimeout();
      return;
    }

    const interval = setInterval(() => {
      onTick();
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, isRunning, onTick, onTimeout]);

  const isWarning = timeRemaining <= 10;
  const percentage = (timeRemaining / 30) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-slate-700"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={176}
            strokeDashoffset={176 - (percentage / 100) * 176}
            className={`transition-all duration-1000 ${
              isWarning ? "text-red-500" : "text-emerald-400"
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-mono font-bold text-lg ${
              isWarning ? "text-red-500 animate-pulse" : "text-slate-200"
            }`}
          >
            {timeRemaining}
          </span>
        </div>
      </div>
    </div>
  );
}
