"use client";

import { useState, useCallback, useEffect } from "react";
import { Ticket, Action, ClusterState, ClientGameState } from "@/lib/types";
import TicketCard from "@/components/TicketCard";
import ActionControls from "@/components/ActionControls";
import ClusterPanel from "@/components/ClusterPanel";
import Timer from "@/components/Timer";
import ScoreDisplay from "@/components/ScoreDisplay";
import FeedbackBanner from "@/components/FeedbackBanner";
import GameOver from "@/components/GameOver";

const MAX_TICKETS = 5;

export default function Home() {
  const [gameState, setGameState] = useState<ClientGameState>({
    score: 0,
    ticketNumber: 0,
    currentTicket: null,
    clusterState: null,
    timeRemaining: 30,
    feedback: null,
    gameOver: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Fetch cluster state
  const fetchClusterState = useCallback(async () => {
    const res = await fetch("/api/cluster");
    const data: ClusterState = await res.json();
    setGameState((prev) => ({ ...prev, clusterState: data }));
    return data;
  }, []);

  // Generate new ticket
  const generateTicket = useCallback(async () => {
    const res = await fetch("/api/ticket", { method: "POST" });
    const ticket: Ticket = await res.json();
    return ticket;
  }, []);

  // Start new game
  const startGame = useCallback(async () => {
    setIsLoading(true);
    await fetch("/api/reset", { method: "POST" });
    const clusterState = await fetchClusterState();

    // Only generate ticket if we have pods
    if (clusterState.pods.length > 0) {
      const ticket = await generateTicket();
      setGameState({
        score: 0,
        ticketNumber: 1,
        currentTicket: ticket,
        clusterState,
        timeRemaining: 30,
        feedback: null,
        gameOver: false,
      });
      setGameStarted(true);
    }
    setIsLoading(false);
  }, [fetchClusterState, generateTicket]);

  // Handle action submission
  const handleAction = useCallback(
    async (action: Action) => {
      if (!gameState.currentTicket) return;

      setIsLoading(true);
      const res = await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: gameState.currentTicket.ticketId,
          action,
          ticket: gameState.currentTicket,
          timeRemaining: gameState.timeRemaining,
        }),
      });

      const result = await res.json();

      setGameState((prev) => ({
        ...prev,
        score: prev.score + result.points,
        clusterState: result.newClusterState,
        feedback: {
          success: result.success,
          message: result.message,
          points: result.points,
        },
      }));

      // Show feedback, then advance
      setTimeout(async () => {
        await advanceToNextTicket();
      }, 1500);

      setIsLoading(false);
    },
    [gameState.currentTicket, gameState.timeRemaining]
  );

  // Advance to next ticket
  const advanceToNextTicket = useCallback(async () => {
    setGameState((prev) => {
      if (prev.ticketNumber >= MAX_TICKETS) {
        return { ...prev, gameOver: true, feedback: null };
      }
      return prev;
    });

    if (gameState.ticketNumber >= MAX_TICKETS) {
      setGameState((prev) => ({ ...prev, gameOver: true, feedback: null }));
      return;
    }

    const ticket = await generateTicket();
    setGameState((prev) => ({
      ...prev,
      ticketNumber: prev.ticketNumber + 1,
      currentTicket: ticket,
      timeRemaining: 30,
      feedback: null,
    }));
  }, [gameState.ticketNumber, generateTicket]);

  // Handle timeout
  const handleTimeout = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      feedback: {
        success: false,
        message: "Time's up!",
        points: 0,
      },
    }));

    setTimeout(async () => {
      await advanceToNextTicket();
    }, 1500);
  }, [advanceToNextTicket]);

  // Timer tick
  const handleTick = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      timeRemaining: Math.max(0, prev.timeRemaining - 1),
    }));
  }, []);

  // Initial load
  useEffect(() => {
    fetchClusterState();
  }, [fetchClusterState]);

  // Start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-lg">
          <div className="mb-8">
            <h1 className="text-6xl font-black mb-2 tracking-tight">
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                PAPA&apos;S
              </span>
            </h1>
            <h1 className="text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                KUBERIA
              </span>
            </h1>
          </div>

          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Welcome to your shift! Complete Kubernetes ops tickets as fast as
            you can. Scale deployments, restart pods, and keep the cluster
            running smoothly.
          </p>

          <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700/50">
            <h3 className="text-slate-300 font-semibold mb-4">How to Play</h3>
            <ul className="text-slate-400 text-left space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-400">⚖️</span>
                <span>
                  <strong>Scale</strong> - Select deployment and set replicas
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">🔄</span>
                <span>
                  <strong>Restart</strong> - Select the correct pod to restart
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">⏱️</span>
                <span>
                  <strong>Speed bonus</strong> - Faster = more points!
                </span>
              </li>
            </ul>
          </div>

          <button
            onClick={startGame}
            disabled={isLoading}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-12 rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/25 text-xl"
          >
            {isLoading ? "LOADING..." : "START SHIFT"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Game Over Modal */}
      {gameState.gameOver && (
        <GameOver
          score={gameState.score}
          onPlayAgain={() => {
            setGameStarted(false);
            setGameState({
              score: 0,
              ticketNumber: 0,
              currentTicket: null,
              clusterState: null,
              timeRemaining: 30,
              feedback: null,
              gameOver: false,
            });
          }}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 shadow-xl">
          <h1 className="text-2xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              PAPA&apos;S
            </span>{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              KUBERIA
            </span>
          </h1>
          <div className="flex items-center gap-6">
            <ScoreDisplay score={gameState.score} />
            <Timer
              timeRemaining={gameState.timeRemaining}
              onTick={handleTick}
              onTimeout={handleTimeout}
              isRunning={!gameState.feedback && !gameState.gameOver}
            />
          </div>
        </header>

        {/* Ticket */}
        {gameState.currentTicket && (
          <TicketCard
            ticket={gameState.currentTicket}
            ticketNumber={gameState.ticketNumber}
            maxTickets={MAX_TICKETS}
          />
        )}

        {/* Action Controls */}
        {gameState.currentTicket && gameState.clusterState && (
          <ActionControls
            ticket={gameState.currentTicket}
            clusterState={gameState.clusterState}
            onSubmit={handleAction}
            disabled={isLoading || !!gameState.feedback}
          />
        )}

        {/* Feedback */}
        {gameState.feedback && (
          <FeedbackBanner
            success={gameState.feedback.success}
            message={gameState.feedback.message}
            points={gameState.feedback.points}
          />
        )}

        {/* Cluster State */}
        {gameState.clusterState && (
          <ClusterPanel clusterState={gameState.clusterState} />
        )}
      </div>
    </div>
  );
}
