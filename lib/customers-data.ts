// lib/customers-data.ts
import { Customer } from "./types";

export const CUSTOMERS: Customer[] = [
  {
    id: "amd",
    name: "AMD",
    logo: "🔺",
    color: "#ED1C24",
    patience: 3,
    tipMultiplier: 1.2,
    personality: "We need precision engineering here. Our Ryzen workloads demand optimal configurations.",
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "📦",
    color: "#FF9900",
    patience: 2,
    tipMultiplier: 1.0,
    personality: "Time is money. We need this infrastructure deployed yesterday!",
  },
  {
    id: "meta",
    name: "Meta",
    logo: "Ⓜ️",
    color: "#0668E1",
    patience: 4,
    tipMultiplier: 1.5,
    personality: "We're building for billions of users. Scale is everything.",
  },
  {
    id: "netflix",
    name: "Netflix",
    logo: "🎬",
    color: "#E50914",
    patience: 3,
    tipMultiplier: 1.3,
    personality: "Our viewers expect 4K streaming without buffering. Make it happen!",
  },
  {
    id: "spotify",
    name: "Spotify",
    logo: "🎵",
    color: "#1DB954",
    patience: 4,
    tipMultiplier: 1.4,
    personality: "Music needs to flow seamlessly. Low latency is our jam!",
  },
  {
    id: "shopify",
    name: "Shopify",
    logo: "🛒",
    color: "#96BF48",
    patience: 3,
    tipMultiplier: 1.2,
    personality: "Black Friday is coming. We need an infrastructure that won't buckle!",
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "💳",
    color: "#635BFF",
    patience: 2,
    tipMultiplier: 1.1,
    personality: "Payment processing requires bulletproof security and uptime.",
  },
  {
    id: "uber",
    name: "Uber",
    logo: "🚗",
    color: "#000000",
    patience: 2,
    tipMultiplier: 1.0,
    personality: "Riders are waiting! We need real-time location services NOW.",
  },
  {
    id: "airbnb",
    name: "Airbnb",
    logo: "🏠",
    color: "#FF5A5F",
    patience: 4,
    tipMultiplier: 1.3,
    personality: "Our guests deserve a seamless booking experience worldwide.",
  },
  {
    id: "slack",
    name: "Slack",
    logo: "💬",
    color: "#4A154B",
    patience: 3,
    tipMultiplier: 1.2,
    personality: "Real-time messaging for millions of teams. WebSockets are life!",
  },
  {
    id: "discord",
    name: "Discord",
    logo: "🎮",
    color: "#5865F2",
    patience: 3,
    tipMultiplier: 1.3,
    personality: "Gamers demand low ping. Voice chat can't lag!",
  },
  {
    id: "twitch",
    name: "Twitch",
    logo: "📺",
    color: "#9146FF",
    patience: 2,
    tipMultiplier: 1.2,
    personality: "Live streaming means LIVE. No buffer, no delay, no excuses!",
  },
];

export function getRandomCustomer(): Customer {
  return CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
}

export function getCustomerById(id: string): Customer | undefined {
  return CUSTOMERS.find((c) => c.id === id);
}
