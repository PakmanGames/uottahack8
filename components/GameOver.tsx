"use client";

type GameOverProps = {
  score: number;
  onPlayAgain: () => void;
};

export default function GameOver({ score, onPlayAgain }: GameOverProps) {
  const rating = score >= 400 ? "⭐⭐⭐" : score >= 250 ? "⭐⭐" : "⭐";
  const message =
    score >= 400
      ? "Kubernetes Master!"
      : score >= 250
        ? "Solid SRE Work!"
        : "Keep Practicing!";

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 max-w-md w-full mx-4 text-center shadow-2xl">
        <h2 className="text-4xl font-black mb-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          SHIFT OVER
        </h2>
        <p className="text-slate-400 mb-8">Great work today!</p>

        <div className="text-6xl mb-4">{rating}</div>
        <p className="text-xl text-slate-300 mb-2">{message}</p>

        <div className="bg-slate-900/60 rounded-xl p-6 mb-8 border border-slate-700/50">
          <p className="text-slate-400 text-sm mb-2">FINAL SCORE</p>
          <p className="font-mono text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            {score}
          </p>
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/25 text-lg"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}
