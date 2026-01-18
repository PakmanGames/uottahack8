// lib/order-generator.ts
import { Order, OrderComponent, Customer } from "./types";
import { CUSTOMERS } from "./customers-data";

// Order scenarios - real software engineering infrastructure needs
const ORDER_SCENARIOS = [
  {
    id: "web-app",
    scenario: "Web Application Stack",
    descriptions: [
      "We need a scalable web app with database backend.",
      "Build us a production-ready web application infrastructure.",
      "Set up our new SaaS platform with proper data persistence.",
    ],
    requiredComponents: [
      { componentType: "droplet-general", quantity: 2 },
      { componentType: "load-balancer", quantity: 1 },
      { componentType: "postgres", quantity: 1 },
      { componentType: "spaces", quantity: 1 },
    ],
    baseReward: 400,
  },
  {
    id: "microservices",
    scenario: "Microservices Platform",
    descriptions: [
      "Build us a containerized microservices setup.",
      "We're going cloud-native! Set up our container orchestration.",
      "Our monolith needs to become microservices. Container time!",
    ],
    requiredComponents: [
      { componentType: "kubernetes", quantity: 1 },
      { componentType: "container-registry", quantity: 1 },
      { componentType: "redis", quantity: 1 },
      { componentType: "load-balancer", quantity: 1 },
    ],
    baseReward: 500,
  },
  {
    id: "data-pipeline",
    scenario: "Data Pipeline",
    descriptions: [
      "We need real-time data processing infrastructure.",
      "Build us a high-throughput data ingestion system.",
      "Our analytics platform needs serious compute power.",
    ],
    requiredComponents: [
      { componentType: "droplet-cpu", quantity: 3 },
      { componentType: "mongodb", quantity: 1 },
      { componentType: "redis", quantity: 1 },
      { componentType: "block-storage", quantity: 1 },
    ],
    baseReward: 550,
  },
  {
    id: "static-site",
    scenario: "Static Website with CDN",
    descriptions: [
      "Simple marketing site with global delivery.",
      "We need a blazing fast static site for our landing pages.",
      "Set up our docs site with worldwide CDN distribution.",
    ],
    requiredComponents: [
      { componentType: "spaces", quantity: 1 },
      { componentType: "cdn", quantity: 1 },
      { componentType: "floating-ip", quantity: 1 },
    ],
    baseReward: 200,
  },
  {
    id: "api-backend",
    scenario: "API Backend",
    descriptions: [
      "RESTful API with caching and storage.",
      "Build our mobile app backend infrastructure.",
      "We need a robust API layer for our services.",
    ],
    requiredComponents: [
      { componentType: "droplet-general", quantity: 2 },
      { componentType: "postgres", quantity: 1 },
      { componentType: "redis", quantity: 1 },
      { componentType: "load-balancer", quantity: 1 },
    ],
    baseReward: 450,
  },
  {
    id: "ml-platform",
    scenario: "Machine Learning Platform",
    descriptions: [
      "Infrastructure for ML model training and serving.",
      "We're training AI models. Need serious compute!",
      "Build our MLOps pipeline infrastructure.",
    ],
    requiredComponents: [
      { componentType: "droplet-cpu", quantity: 2 },
      { componentType: "droplet-memory", quantity: 1 },
      { componentType: "block-storage", quantity: 1 },
      { componentType: "spaces", quantity: 1 },
    ],
    baseReward: 600,
  },
  {
    id: "ecommerce",
    scenario: "E-commerce Platform",
    descriptions: [
      "Full e-commerce with payments and inventory.",
      "Black Friday is coming! Build us a scalable store.",
      "Set up our online marketplace infrastructure.",
    ],
    requiredComponents: [
      { componentType: "droplet-general", quantity: 2 },
      { componentType: "postgres", quantity: 1 },
      { componentType: "redis", quantity: 1 },
      { componentType: "load-balancer", quantity: 1 },
      { componentType: "spaces", quantity: 1 },
    ],
    baseReward: 550,
  },
  {
    id: "realtime-chat",
    scenario: "Real-time Chat System",
    descriptions: [
      "WebSocket-based messaging infrastructure.",
      "Build us a Slack competitor! Real-time is key.",
      "We need chat infrastructure for millions of users.",
    ],
    requiredComponents: [
      { componentType: "droplet-memory", quantity: 2 },
      { componentType: "redis", quantity: 1 },
      { componentType: "mongodb", quantity: 1 },
      { componentType: "load-balancer", quantity: 1 },
    ],
    baseReward: 500,
  },
  {
    id: "cicd",
    scenario: "CI/CD Pipeline",
    descriptions: [
      "Continuous integration and deployment setup.",
      "Automate our deployments! Build a proper pipeline.",
      "We need DevOps infrastructure for our team.",
    ],
    requiredComponents: [
      { componentType: "droplet-general", quantity: 1 },
      { componentType: "container-registry", quantity: 1 },
      { componentType: "spaces", quantity: 1 },
      { componentType: "functions", quantity: 1 },
    ],
    baseReward: 350,
  },
  {
    id: "gaming",
    scenario: "Gaming Backend",
    descriptions: [
      "Multiplayer game server infrastructure.",
      "Gamers hate lag! Build us low-latency servers.",
      "Set up our esports tournament infrastructure.",
    ],
    requiredComponents: [
      { componentType: "droplet-cpu", quantity: 3 },
      { componentType: "redis", quantity: 1 },
      { componentType: "postgres", quantity: 1 },
      { componentType: "load-balancer", quantity: 1 },
    ],
    baseReward: 600,
  },
  {
    id: "video-streaming",
    scenario: "Video Streaming Platform",
    descriptions: [
      "Build us the next Netflix! Streaming infrastructure needed.",
      "Our content needs to reach millions of viewers smoothly.",
      "Set up video transcoding and delivery infrastructure.",
    ],
    requiredComponents: [
      { componentType: "droplet-cpu", quantity: 2 },
      { componentType: "spaces", quantity: 1 },
      { componentType: "cdn", quantity: 1 },
      { componentType: "load-balancer", quantity: 1 },
      { componentType: "redis", quantity: 1 },
    ],
    baseReward: 650,
  },
  {
    id: "iot-platform",
    scenario: "IoT Platform",
    descriptions: [
      "Millions of sensors need a home. Build our IoT backend!",
      "Smart devices everywhere! We need real-time data ingestion.",
      "Set up our industrial IoT monitoring platform.",
    ],
    requiredComponents: [
      { componentType: "droplet-general", quantity: 2 },
      { componentType: "mongodb", quantity: 1 },
      { componentType: "redis", quantity: 1 },
      { componentType: "functions", quantity: 1 },
      { componentType: "monitoring", quantity: 1 },
    ],
    baseReward: 500,
  },
];

// Premium orders - harder and more complex, but much higher rewards
const PREMIUM_ORDER_SCENARIOS = [
  {
    id: "enterprise-hybrid-cloud",
    scenario: "Enterprise Hybrid Cloud",
    descriptions: [
      "Build us a full hybrid cloud setup with on-prem integration!",
      "We need enterprise-grade multi-region infrastructure.",
      "Set up our global infrastructure with complete redundancy.",
    ],
    requiredComponents: [
      { componentType: "kubernetes", quantity: 2 },
      { componentType: "droplet-cpu", quantity: 4 },
      { componentType: "postgres", quantity: 2 },
      { componentType: "redis", quantity: 2 },
      { componentType: "load-balancer", quantity: 2 },
      { componentType: "spaces", quantity: 1 },
      { componentType: "monitoring", quantity: 1 },
    ],
    baseReward: 1200,
  },
  {
    id: "global-cdn-platform",
    scenario: "Global CDN Platform",
    descriptions: [
      "Worldwide content delivery for billions of users!",
      "Build us a planetary-scale CDN infrastructure.",
      "We need ultra-low latency content delivery everywhere.",
    ],
    requiredComponents: [
      { componentType: "cdn", quantity: 3 },
      { componentType: "spaces", quantity: 3 },
      { componentType: "droplet-general", quantity: 3 },
      { componentType: "load-balancer", quantity: 2 },
      { componentType: "redis", quantity: 1 },
    ],
    baseReward: 1000,
  },
  {
    id: "ai-training-cluster",
    scenario: "AI Training Cluster",
    descriptions: [
      "Train our foundation models! We need MASSIVE compute.",
      "Build infrastructure for training GPT-level AI models.",
      "Set up our AI research cluster with petabytes of storage.",
    ],
    requiredComponents: [
      { componentType: "droplet-cpu", quantity: 5 },
      { componentType: "droplet-memory", quantity: 3 },
      { componentType: "block-storage", quantity: 3 },
      { componentType: "spaces", quantity: 2 },
      { componentType: "monitoring", quantity: 1 },
    ],
    baseReward: 1300,
  },
  {
    id: "financial-trading-platform",
    scenario: "Financial Trading Platform",
    descriptions: [
      "Microseconds matter! Build ultra-low-latency trading infrastructure.",
      "We need NYSE-grade infrastructure for high-frequency trading.",
      "Set up our quantitative trading platform with zero downtime.",
    ],
    requiredComponents: [
      { componentType: "droplet-cpu", quantity: 4 },
      { componentType: "postgres", quantity: 2 },
      { componentType: "redis", quantity: 3 },
      { componentType: "load-balancer", quantity: 2 },
      { componentType: "monitoring", quantity: 1 },
      { componentType: "vpc", quantity: 1 },
      { componentType: "firewall", quantity: 1 },
    ],
    baseReward: 1400,
  },
  {
    id: "metaverse-platform",
    scenario: "Metaverse Platform",
    descriptions: [
      "Build the infrastructure for the next internet!",
      "We need real-time 3D rendering for millions of avatars.",
      "Set up our virtual world with seamless social experiences.",
    ],
    requiredComponents: [
      { componentType: "kubernetes", quantity: 1 },
      { componentType: "droplet-cpu", quantity: 4 },
      { componentType: "droplet-memory", quantity: 2 },
      { componentType: "redis", quantity: 2 },
      { componentType: "mongodb", quantity: 1 },
      { componentType: "load-balancer", quantity: 2 },
      { componentType: "spaces", quantity: 2 },
    ],
    baseReward: 1250,
  },
  {
    id: "quantum-computing-gateway",
    scenario: "Quantum Computing Gateway",
    descriptions: [
      "Interface classical systems with quantum computers!",
      "Build infrastructure to manage quantum algorithm execution.",
      "We need hybrid classical-quantum computing infrastructure.",
    ],
    requiredComponents: [
      { componentType: "droplet-memory", quantity: 4 },
      { componentType: "droplet-cpu", quantity: 3 },
      { componentType: "postgres", quantity: 1 },
      { componentType: "redis", quantity: 2 },
      { componentType: "functions", quantity: 2 },
      { componentType: "monitoring", quantity: 1 },
    ],
    baseReward: 1100,
  },
];

let orderCounter = 0;

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateOrder(premiumOrdersUnlocked = false): Order {
  orderCounter++;
  const orderId = `order_${String(orderCounter).padStart(3, "0")}`;

  // Pick random customer
  const customer = randomItem(CUSTOMERS);
  
  // 30% chance of premium order if unlocked
  const usePremium = premiumOrdersUnlocked && Math.random() < 0.3;
  const scenario = usePremium 
    ? randomItem(PREMIUM_ORDER_SCENARIOS)
    : randomItem(ORDER_SCENARIOS);
  const description = randomItem(scenario.descriptions);

  // Adjust time based on customer patience and order complexity
  const baseTime = 60;
  const patienceBonus = (customer.patience - 3) * 10; // -20 to +20 seconds
  const complexityPenalty = scenario.requiredComponents.length * 2; // More components = less time
  const timeLimitSec = Math.max(30, baseTime + patienceBonus - complexityPenalty);

  return {
    orderId,
    customer,
    scenario: scenario.scenario,
    description: `${description} ${customer.personality}`,
    requiredComponents: scenario.requiredComponents,
    timeLimitSec,
    baseReward: scenario.baseReward,
  };
}

export function resetOrderCounter(): void {
  orderCounter = 0;
}

export function getScenarioById(id: string) {
  return ORDER_SCENARIOS.find((s) => s.id === id);
}
