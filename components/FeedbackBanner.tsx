"use client";

type FeedbackBannerProps = {
  success: boolean;
  message: string;
  points: number;
};

export default function FeedbackBanner({
  success,
  message,
  points,
}: FeedbackBannerProps) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        success
          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
          : "bg-red-500/20 border-red-500/50 text-red-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{success ? "✓" : "✗"}</span>
          <span className="font-medium">{message}</span>
        </div>
        {points > 0 && (
          <span className="font-mono font-bold text-lg">+{points} pts</span>
        )}
      </div>
    </div>
  );
}
