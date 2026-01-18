"use client";

import { useEffect } from "react";

type TimerProps = {
  timeRemaining: number;
  maxTime?: number;
  onTick: () => void;
  onTimeout: () => void;
  isRunning: boolean;
};

export default function Timer({
  timeRemaining,
  maxTime = 60,
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

  const isWarning = timeRemaining <= 15;
  const isCritical = timeRemaining <= 5;
  const percentage = (timeRemaining / maxTime) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        {/* Background glow when critical */}
        {isCritical && (
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
        )}
        
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
              isCritical 
                ? "text-red-500" 
                : isWarning 
                  ? "text-amber-500" 
                  : "text-cyan-400"
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-mono font-bold text-lg ${
              isCritical 
                ? "text-red-500 animate-pulse" 
                : isWarning 
                  ? "text-amber-500" 
                  : "text-slate-200"
            }`}
          >
            {timeRemaining}
          </span>
          <span className="text-[8px] text-slate-500">
            {isCritical ? "⚡" : isWarning ? "🌧️" : "☁️"}
          </span>
        </div>
      </div>
    </div>
  );
}
