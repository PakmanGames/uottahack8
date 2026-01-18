"use client";

type FeedbackBannerProps = {
  success: boolean;
  message: string;
  points: number; // Actually cash now
};

export default function FeedbackBanner({
  success,
  message,
  points,
}: FeedbackBannerProps) {
  return (
    <div
      className={`rounded-xl p-4 border relative overflow-hidden ${
        success
          ? "bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 border-emerald-500/50 text-emerald-300"
          : "bg-gradient-to-r from-red-500/20 via-amber-500/20 to-red-500/20 border-red-500/50 text-red-300"
      }`}
    >
      {/* Background decoration */}
      {success && (
        <div className="absolute top-0 right-0 text-4xl opacity-10">🌧️</div>
      )}
      {!success && (
        <div className="absolute top-0 right-0 text-4xl opacity-10">⛈️</div>
      )}
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {success ? "☀️" : "🌩️"}
          </span>
          <div>
            <span className="font-medium">{message}</span>
            {success && points > 0 && (
              <p className="text-xs text-emerald-400/80 mt-1">
                You made it rain! 💸
              </p>
            )}
          </div>
        </div>
        {points > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <span className="font-mono font-bold text-xl text-emerald-400">
              +${points.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
