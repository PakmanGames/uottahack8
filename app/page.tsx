"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Order,
  PlacedComponent,
  DOComponent,
  OrderResult,
  GamePhase,
  ShopState,
} from "@/lib/types";
import { generateTerraformCodeWithInfo } from "@/lib/terraform-generator";
import { DO_COMPONENTS } from "@/lib/components-data";
import OrderTicket from "@/components/OrderTicket";
import ComponentPalette from "@/components/ComponentPalette";
import BuildArea from "@/components/BuildArea";
import TerraformPreview from "@/components/TerraformPreview";
import CashDisplay from "@/components/CashDisplay";
import Timer from "@/components/Timer";
import FeedbackBanner from "@/components/FeedbackBanner";
import RoundEnd from "@/components/RoundEnd";
import Shop from "@/components/Shop";

const MAX_ORDERS_PER_ROUND = 5;

// Rain effect component - renders only on client to avoid hydration mismatch
function RainEffect() {
  const [drops, setDrops] = useState<{ left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate rain drops only on client side
    const newDrops = [...Array(50)].map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${0.5 + Math.random() * 1}s`,
    }));
    setDrops(newDrops);
  }, []);

  if (drops.length === 0) return null;

  return (
    <div className="rain-container">
      {drops.map((drop, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
          }}
        />
      ))}
    </div>
  );
}

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
  const [shopState, setShopState] = useState<ShopState>({
    timeBonusLevel: 0,
    tipMultiplierLevel: 0,
    autoCompleteLevel: 0,
    premiumOrdersUnlocked: false,
  });
  const [demoMode, setDemoMode] = useState(false);

  // Generate terraform code with demo mode filtering info
  const terraformResult = generateTerraformCodeWithInfo(
    placedComponents,
    currentOrder,
    demoMode
  );

  // Fetch new order
  const fetchOrder = useCallback(async () => {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        premiumOrdersUnlocked: shopState.premiumOrdersUnlocked,
      }),
    });
    const order: Order = await res.json();
    
    // Apply time bonus from shop upgrades
    const timeBonus = shopState.timeBonusLevel * 10;
    order.timeLimitSec += timeBonus;
    
    return order;
  }, [shopState.premiumOrdersUnlocked, shopState.timeBonusLevel]);

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
    setShopState({
      timeBonusLevel: 0,
      tipMultiplierLevel: 0,
      autoCompleteLevel: 0,
      premiumOrdersUnlocked: false,
    });
    setIsLoading(false);
  }, [fetchOrder]);

  // Auto-complete helper
  const applyAutoComplete = useCallback((order: Order) => {
    if (shopState.autoCompleteLevel === 0) return [];
    
    const autoCompleteCount = shopState.autoCompleteLevel;
    const autoPlaced: PlacedComponent[] = [];
    
    // Auto-fill first N unique component types
    const uniqueTypes = Array.from(new Set(order.requiredComponents.map(rc => rc.componentType)));
    const typesToAutoFill = uniqueTypes.slice(0, autoCompleteCount);
    
    typesToAutoFill.forEach(componentType => {
      const component = DO_COMPONENTS.find(c => c.type === componentType);
      if (component) {
        const requiredQty = order.requiredComponents.find(rc => rc.componentType === componentType)?.quantity || 1;
        for (let i = 0; i < requiredQty; i++) {
          autoPlaced.push({
            instanceId: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            component,
          });
        }
      }
    });
    
    return autoPlaced;
  }, [shopState.autoCompleteLevel]);

  // Start next round
  const startNextRound = useCallback(async () => {
    setIsLoading(true);
    const order = await fetchOrder();
    const autoPlaced = applyAutoComplete(order);
    setRound((prev) => prev + 1);
    setOrdersCompleted(0);
    setPerfectOrders(0);
    setCurrentOrder(order);
    setPlacedComponents(autoPlaced);
    setTimeRemaining(order.timeLimitSec);
    setFeedback(null);
    setGamePhase("playing");
    setIsLoading(false);
  }, [fetchOrder, applyAutoComplete]);

  // Handle shop purchase
  const handleShopPurchase = useCallback((upgradeType: string) => {
    const getUpgradeCost = (type: string, currentLevel: number): number => {
      const baseCosts: Record<string, number> = {
        "time-bonus": 300,
        "tip-multiplier": 400,
        "auto-complete": 600,
        "premium-orders": 800,
      };
      return Math.floor(baseCosts[type] * Math.pow(1.5, currentLevel));
    };

    const newShopState = { ...shopState };
    let cost = 0;

    switch (upgradeType) {
      case "time-bonus":
        if (shopState.timeBonusLevel < 3) {
          cost = getUpgradeCost(upgradeType, shopState.timeBonusLevel);
          if (cash >= cost) {
            newShopState.timeBonusLevel++;
            setCash(prev => prev - cost);
            setShopState(newShopState);
          }
        }
        break;
      case "tip-multiplier":
        if (shopState.tipMultiplierLevel < 3) {
          cost = getUpgradeCost(upgradeType, shopState.tipMultiplierLevel);
          if (cash >= cost) {
            newShopState.tipMultiplierLevel++;
            setCash(prev => prev - cost);
            setShopState(newShopState);
          }
        }
        break;
      case "auto-complete":
        if (shopState.autoCompleteLevel < 2) {
          cost = getUpgradeCost(upgradeType, shopState.autoCompleteLevel);
          if (cash >= cost) {
            newShopState.autoCompleteLevel++;
            setCash(prev => prev - cost);
            setShopState(newShopState);
          }
        }
        break;
      case "premium-orders":
        if (!shopState.premiumOrdersUnlocked) {
          cost = getUpgradeCost(upgradeType, 0);
          if (cash >= cost) {
            newShopState.premiumOrdersUnlocked = true;
            setCash(prev => prev - cost);
            setShopState(newShopState);
          }
        }
        break;
    }
  }, [cash, shopState]);

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
        tipMultiplierBonus: shopState.tipMultiplierLevel * 0.2,
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
        const autoPlaced = applyAutoComplete(order);
        setCurrentOrder(order);
        setPlacedComponents(autoPlaced);
        setTimeRemaining(order.timeLimitSec);
        setFeedback(null);
        setGamePhase("playing");
      }
      setIsLoading(false);
    }, 2000);
  }, [currentOrder, gamePhase, placedComponents, timeRemaining, ordersCompleted, fetchOrder, applyAutoComplete, shopState.tipMultiplierLevel]);

  // Handle timeout
  const handleTimeout = useCallback(async () => {
    if (!currentOrder || gamePhase !== "playing") return;

    setGamePhase("feedback");
    setFeedback({
      success: false,
      accuracy: 0,
      cashEarned: 0,
      tip: 0,
      message: `Storm warning! ${currentOrder.customer.name} got swept away by the weather.`,
      missing: currentOrder.requiredComponents.map((r) => r.componentType),
      extra: [],
    });
    setOrdersCompleted((prev) => prev + 1);

    setTimeout(async () => {
      if (ordersCompleted + 1 >= MAX_ORDERS_PER_ROUND) {
        setGamePhase("round_end");
      } else {
        const order = await fetchOrder();
        const autoPlaced = applyAutoComplete(order);
        setCurrentOrder(order);
        setPlacedComponents(autoPlaced);
        setTimeRemaining(order.timeLimitSec);
        setFeedback(null);
        setGamePhase("playing");
      }
    }, 2000);
  }, [currentOrder, gamePhase, ordersCompleted, fetchOrder, applyAutoComplete]);

  // Timer tick
  const handleTick = useCallback(() => {
    setTimeRemaining((prev) => Math.max(0, prev - 1));
  }, []);

  // Menu screen
  if (gamePhase === "menu") {
    return (
      <div className="min-h-screen storm-bg flex items-center justify-center p-6 relative overflow-hidden">
        {/* Rain effect */}
        <RainEffect />
        
        {/* Lightning flash */}
        <div className="lightning-flash" />
        
        {/* Floating clouds background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-8xl opacity-10 animate-cloud-float">☁️</div>
          <div className="absolute top-20 right-20 text-6xl opacity-10 animate-cloud-float" style={{ animationDelay: '2s' }}>🌧️</div>
          <div className="absolute bottom-40 left-1/4 text-7xl opacity-10 animate-cloud-float" style={{ animationDelay: '4s' }}>⛈️</div>
          <div className="absolute top-1/3 right-1/3 text-5xl opacity-10 animate-cloud-float" style={{ animationDelay: '1s' }}>💧</div>
        </div>
        
        <div className="text-center max-w-lg relative z-10">
          <div className="mb-8">
            {/* Cloud icon */}
            <div className="text-7xl mb-4 animate-cloud-float">🌧️</div>
            
            <h1 className="text-6xl font-black mb-2 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                RAIN
              </span>
            </h1>
            <h1 className="text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                MAKER
              </span>
            </h1>
            <p className="text-slate-400 mt-4 text-lg italic">
              &ldquo;Rainy with a chance of rogue tech&rdquo;
            </p>
            <p className="text-cyan-500/80 text-sm mt-1">
              Infrastructure as Clouds (IaC) to Make It Rain
            </p>
          </div>

          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Enterprise customers need cloud infrastructure! Build their 
            DigitalOcean setups with Terraform code. Earn cash, weather 
            the storm, and <span className="text-emerald-400 font-semibold">make it rain!</span>
          </p>

          <div className="cloud-card rounded-xl p-6 mb-8">
            <h3 className="text-slate-300 font-semibold mb-4 flex items-center justify-center gap-2">
              <span>⛈️</span> How to Make It Rain <span>💰</span>
            </h3>
            <ul className="text-slate-400 text-left space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 text-xl">📋</span>
                <span>
                  <strong className="text-slate-200">Read the Forecast</strong> - Check what infrastructure the storm requires
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 text-xl">☁️</span>
                <span>
                  <strong className="text-slate-200">Build the Clouds</strong> - Drag cloud components to your build area
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">📄</span>
                <span>
                  <strong className="text-slate-200">Generate Terraform</strong> - Watch your infrastructure code form
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 text-xl">🌧️</span>
                <span>
                  <strong className="text-slate-200">Make It Rain</strong> - Deploy and collect that sweet cloud cash!
                </span>
              </li>
            </ul>
          </div>

          <button
            onClick={startGame}
            disabled={isLoading}
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-12 rounded-xl transition-all duration-200 shadow-lg hover:shadow-cyan-500/30 text-xl animate-pulse-glow"
          >
            {isLoading ? "BREWING STORM..." : "⛈️ START THE STORM"}
          </button>
          
          <p className="text-slate-600 text-xs mt-4">
            A rogue-like cloud infrastructure game
          </p>
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
        onOpenShop={() => setGamePhase("shop")}
      />
    );
  }

  // Shop screen
  if (gamePhase === "shop") {
    return (
      <Shop
        cash={cash}
        shopState={shopState}
        onPurchase={handleShopPurchase}
        onContinue={startNextRound}
      />
    );
  }

  // Playing / Feedback screen
  return (
    <div className="min-h-screen storm-bg p-4 relative">
      {/* Subtle rain effect during gameplay */}
      <RainEffect />
      
      <div className="max-w-7xl mx-auto space-y-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between cloud-card rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌧️</span>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                RAIN
              </span>{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                MAKER
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-slate-400 text-sm hidden sm:flex items-center gap-2">
              <span>⛈️</span>
              <span>Storm {round}</span>
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
              className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-400 hover:via-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 text-xl disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>🌀 DEPLOYING...</>
              ) : (
                <>🌧️ MAKE IT RAIN</>
              )}
            </button>
          </div>
        </div>

        {/* Terraform Preview */}
        <TerraformPreview
          code={terraformResult.code}
          demoMode={demoMode}
          onDemoModeChange={setDemoMode}
          excludedCount={terraformResult.excludedCount}
        />
      </div>
    </div>
  );
}
