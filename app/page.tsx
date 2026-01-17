"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Order,
  PlacedComponent,
  DOComponent,
  OrderResult,
  GamePhase,
} from "@/lib/types";
import { generateTerraformCode } from "@/lib/terraform-generator";
import OrderTicket from "@/components/OrderTicket";
import ComponentPalette from "@/components/ComponentPalette";
import BuildArea from "@/components/BuildArea";
import TerraformPreview from "@/components/TerraformPreview";
import CashDisplay from "@/components/CashDisplay";
import Timer from "@/components/Timer";
import FeedbackBanner from "@/components/FeedbackBanner";
import RoundEnd from "@/components/RoundEnd";

const MAX_ORDERS_PER_ROUND = 5;

export default function Home() {
  // Game state
  const [gamePhase, setGamePhase] = useState<GamePhase>("menu");
  const [cash, setCash] = useState(0);
  const [round, setRound] = useState(1);
  const [ordersCompleted, setOrdersCompleted] = useState(0);
  const [perfectOrders, setPerfectOrders] = useState(0);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>(
    []
  );
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [feedback, setFeedback] = useState<OrderResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate terraform code
  const terraformCode = generateTerraformCode(placedComponents, currentOrder);

  // Fetch new order
  const fetchOrder = useCallback(async () => {
    const res = await fetch("/api/order", { method: "POST" });
    const order: Order = await res.json();
    return order;
  }, []);

  // Start new game
  const startGame = useCallback(async () => {
    setIsLoading(true);
    await fetch("/api/reset", { method: "POST" });

    const order = await fetchOrder();
    setCash(0);
    setRound(1);
    setOrdersCompleted(0);
    setPerfectOrders(0);
    setCurrentOrder(order);
    setPlacedComponents([]);
    setTimeRemaining(order.timeLimitSec);
    setFeedback(null);
    setGamePhase("playing");
    setIsLoading(false);
  }, [fetchOrder]);

  // Start next round
  const startNextRound = useCallback(async () => {
    setIsLoading(true);
    const order = await fetchOrder();
    setRound((prev) => prev + 1);
    setOrdersCompleted(0);
    setPerfectOrders(0);
    setCurrentOrder(order);
    setPlacedComponents([]);
    setTimeRemaining(order.timeLimitSec);
    setFeedback(null);
    setGamePhase("playing");
    setIsLoading(false);
  }, [fetchOrder]);

  // Handle component drop
  const handleComponentDrop = useCallback((component: DOComponent) => {
    const newPlaced: PlacedComponent = {
      instanceId: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      component,
    };
    setPlacedComponents((prev) => [...prev, newPlaced]);
  }, []);

  // Handle component remove
  const handleComponentRemove = useCallback((instanceId: string) => {
    setPlacedComponents((prev) =>
      prev.filter((p) => p.instanceId !== instanceId)
    );
  }, []);

  // Submit order
  const submitOrder = useCallback(async () => {
    if (!currentOrder || gamePhase !== "playing") return;

    setIsLoading(true);
    setGamePhase("feedback");

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: currentOrder.orderId,
        placedComponents: placedComponents.map((p) => ({
          instanceId: p.instanceId,
          componentType: p.component.type,
        })),
        timeRemaining,
        order: currentOrder,
      }),
    });

    const result: OrderResult = await res.json();
    setFeedback(result);
    setCash((prev) => prev + result.cashEarned);
    setOrdersCompleted((prev) => prev + 1);
    if (result.accuracy === 100) {
      setPerfectOrders((prev) => prev + 1);
    }

    // Advance to next order after delay
    setTimeout(async () => {
      if (ordersCompleted + 1 >= MAX_ORDERS_PER_ROUND) {
        setGamePhase("round_end");
      } else {
        const order = await fetchOrder();
        setCurrentOrder(order);
        setPlacedComponents([]);
        setTimeRemaining(order.timeLimitSec);
        setFeedback(null);
        setGamePhase("playing");
      }
      setIsLoading(false);
    }, 2000);
  }, [currentOrder, gamePhase, placedComponents, timeRemaining, ordersCompleted, fetchOrder]);

  // Handle timeout
  const handleTimeout = useCallback(async () => {
    if (!currentOrder || gamePhase !== "playing") return;

    setGamePhase("feedback");
    setFeedback({
      success: false,
      accuracy: 0,
      cashEarned: 0,
      tip: 0,
      message: `Time's up! ${currentOrder.customer.name} left disappointed.`,
      missing: currentOrder.requiredComponents.map((r) => r.componentType),
      extra: [],
    });
    setOrdersCompleted((prev) => prev + 1);

    setTimeout(async () => {
      if (ordersCompleted + 1 >= MAX_ORDERS_PER_ROUND) {
        setGamePhase("round_end");
      } else {
        const order = await fetchOrder();
        setCurrentOrder(order);
        setPlacedComponents([]);
        setTimeRemaining(order.timeLimitSec);
        setFeedback(null);
        setGamePhase("playing");
      }
    }, 2000);
  }, [currentOrder, gamePhase, ordersCompleted, fetchOrder]);

  // Timer tick
  const handleTick = useCallback(() => {
    setTimeRemaining((prev) => Math.max(0, prev - 1));
  }, []);

  // Menu screen
  if (gamePhase === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-lg">
          <div className="mb-8">
            <h1 className="text-6xl font-black mb-2 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                PAPA&apos;S
              </span>
            </h1>
            <h1 className="text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                DO-ERIA
              </span>
            </h1>
            <p className="text-slate-500 mt-2">DigitalOcean Infrastructure Shop</p>
          </div>

          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Enterprise customers need cloud infrastructure! Drag and drop
            DigitalOcean components to build their requested setups. Earn cash
            for accuracy and speed!
          </p>

          <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700/50">
            <h3 className="text-slate-300 font-semibold mb-4">How to Play</h3>
            <ul className="text-slate-400 text-left space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">📋</span>
                <span>
                  <strong>Read</strong> - Check what components the customer needs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">🖱️</span>
                <span>
                  <strong>Build</strong> - Drag components to the build area
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">📄</span>
                <span>
                  <strong>Review</strong> - Check the Terraform code preview
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">💰</span>
                <span>
                  <strong>Submit</strong> - Deliver and earn cash!
                </span>
              </li>
            </ul>
          </div>

          <button
            onClick={startGame}
            disabled={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-12 rounded-xl transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 text-xl"
          >
            {isLoading ? "LOADING..." : "START SHIFT"}
          </button>
        </div>
      </div>
    );
  }

  // Round end screen
  if (gamePhase === "round_end") {
    return (
      <RoundEnd
        cash={cash}
        round={round}
        ordersCompleted={ordersCompleted}
        perfectOrders={perfectOrders}
        onNextRound={startNextRound}
        onBackToMenu={() => setGamePhase("menu")}
      />
    );
  }

  // Playing / Feedback screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 shadow-xl">
          <h1 className="text-2xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              PAPA&apos;S
            </span>{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              DO-ERIA
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-slate-400 text-sm hidden sm:block">
              Round {round}
            </div>
            <CashDisplay cash={cash} />
            {currentOrder && (
              <Timer
                timeRemaining={timeRemaining}
                maxTime={currentOrder.timeLimitSec}
                onTick={handleTick}
                onTimeout={handleTimeout}
                isRunning={gamePhase === "playing" && !feedback}
              />
            )}
          </div>
        </header>

        {/* Order Ticket */}
        {currentOrder && (
          <OrderTicket
            order={currentOrder}
            orderNumber={ordersCompleted + 1}
            maxOrders={MAX_ORDERS_PER_ROUND}
          />
        )}

        {/* Feedback Banner */}
        {feedback && (
          <FeedbackBanner
            success={feedback.success}
            message={feedback.message}
            points={feedback.cashEarned}
          />
        )}

        {/* Main content: Palette + Build Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Component Palette */}
          <div className="lg:col-span-1">
            <ComponentPalette
              onDragStart={() => {}}
              onComponentClick={handleComponentDrop}
            />
          </div>

          {/* Build Area + Submit */}
          <div className="lg:col-span-3 space-y-4">
            <BuildArea
              placedComponents={placedComponents}
              onDrop={handleComponentDrop}
              onRemove={handleComponentRemove}
            />

            {/* Submit Button */}
            <button
              onClick={submitOrder}
              disabled={
                isLoading ||
                gamePhase !== "playing" ||
                placedComponents.length === 0
              }
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 text-xl disabled:cursor-not-allowed"
            >
              {isLoading ? "PROCESSING..." : "🚀 SUBMIT ORDER"}
            </button>
          </div>
        </div>

        {/* Terraform Preview */}
        <TerraformPreview code={terraformCode} />
      </div>
    </div>
  );
}
