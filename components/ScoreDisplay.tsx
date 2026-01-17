"use client";

type ScoreDisplayProps = {
  score: number;
};

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-400 text-sm font-medium">SCORE</span>
      <span className="font-mono text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
        {score.toString().padStart(4, "0")}
      </span>
    </div>
  );
}
