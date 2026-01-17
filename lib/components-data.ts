// lib/components-data.ts
import { DOComponent } from "./types";

export const DO_COMPONENTS: DOComponent[] = [
  // Compute
  {
    id: "droplet-basic",
    type: "droplet-basic",
    name: "Droplet (Basic)",
    icon: "💧",
    category: "compute",
    monthlyCost: 5,
    description: "1 vCPU, 1GB RAM",
    terraformResource: "digitalocean_droplet",
    terraformConfig: {
      image: "ubuntu-22-04-x64",
      size: "s-1vcpu-1gb",
      region: "nyc3",
    },
  },
  {
    id: "droplet-general",
    type: "droplet-general",
    name: "Droplet (General)",
    icon: "💧",
    category: "compute",
    monthlyCost: 20,
    description: "2 vCPU, 4GB RAM",
    terraformResource: "digitalocean_droplet",
    terraformConfig: {
      image: "ubuntu-22-04-x64",
      size: "s-2vcpu-4gb",
      region: "nyc3",
    },
  },
  {
    id: "droplet-cpu",
    type: "droplet-cpu",
    name: "Droplet (CPU)",
    icon: "⚡",
    category: "compute",
    monthlyCost: 40,
    description: "4 vCPU, 8GB RAM",
    terraformResource: "digitalocean_droplet",
    terraformConfig: {
      image: "ubuntu-22-04-x64",
      size: "c-4",
      region: "nyc3",
    },
  },
  {
    id: "droplet-memory",
    type: "droplet-memory",
    name: "Droplet (Memory)",
    icon: "🧠",
    category: "compute",
    monthlyCost: 60,
    description: "2 vCPU, 16GB RAM",
    terraformResource: "digitalocean_droplet",
    terraformConfig: {
      image: "ubuntu-22-04-x64",
      size: "m-2vcpu-16gb",
      region: "nyc3",
    },
  },
  {
    id: "app-platform",
    type: "app-platform",
    name: "App Platform",
    icon: "📦",
    category: "compute",
    monthlyCost: 12,
    description: "Managed deployment",
    terraformResource: "digitalocean_app",
    terraformConfig: {
      spec: {
        name: "app",
        region: "nyc",
      },
    },
  },
  {
    id: "kubernetes",
    type: "kubernetes",
    name: "Kubernetes",
    icon: "☸️",
    category: "compute",
    monthlyCost: 50,
    description: "Managed K8s cluster",
    terraformResource: "digitalocean_kubernetes_cluster",
    terraformConfig: {
      region: "nyc3",
      version: "1.28.2-do.0",
      node_pool: {
        name: "worker-pool",
        size: "s-2vcpu-4gb",
        node_count: 3,
      },
    },
  },

  // Storage
  {
    id: "spaces",
    type: "spaces",
    name: "Spaces",
    icon: "📁",
    category: "storage",
    monthlyCost: 5,
    description: "250GB object storage",
    terraformResource: "digitalocean_spaces_bucket",
    terraformConfig: {
      region: "nyc3",
      acl: "private",
    },
  },
  {
    id: "block-storage",
    type: "block-storage",
    name: "Block Storage",
    icon: "💾",
    category: "storage",
    monthlyCost: 10,
    description: "100GB volume",
    terraformResource: "digitalocean_volume",
    terraformConfig: {
      region: "nyc3",
      size: 100,
      filesystem_type: "ext4",
    },
  },

  // Database
  {
    id: "postgres",
    type: "postgres",
    name: "PostgreSQL",
    icon: "🐘",
    category: "database",
    monthlyCost: 15,
    description: "Managed PostgreSQL",
    terraformResource: "digitalocean_database_cluster",
    terraformConfig: {
      engine: "pg",
      version: "15",
      size: "db-s-1vcpu-1gb",
      region: "nyc3",
      node_count: 1,
    },
  },
  {
    id: "mysql",
    type: "mysql",
    name: "MySQL",
    icon: "🐬",
    category: "database",
    monthlyCost: 15,
    description: "Managed MySQL",
    terraformResource: "digitalocean_database_cluster",
    terraformConfig: {
      engine: "mysql",
      version: "8",
      size: "db-s-1vcpu-1gb",
      region: "nyc3",
      node_count: 1,
    },
  },
  {
    id: "redis",
    type: "redis",
    name: "Redis",
    icon: "🔴",
    category: "database",
    monthlyCost: 15,
    description: "Managed cache",
    terraformResource: "digitalocean_database_cluster",
    terraformConfig: {
      engine: "redis",
      version: "7",
      size: "db-s-1vcpu-1gb",
      region: "nyc3",
      node_count: 1,
    },
  },
  {
    id: "mongodb",
    type: "mongodb",
    name: "MongoDB",
    icon: "🍃",
    category: "database",
    monthlyCost: 15,
    description: "Managed document DB",
    terraformResource: "digitalocean_database_cluster",
    terraformConfig: {
      engine: "mongodb",
      version: "6",
      size: "db-s-1vcpu-1gb",
      region: "nyc3",
      node_count: 1,
    },
  },

  // Networking
  {
    id: "load-balancer",
    type: "load-balancer",
    name: "Load Balancer",
    icon: "⚖️",
    category: "networking",
    monthlyCost: 12,
    description: "Traffic distribution",
    terraformResource: "digitalocean_loadbalancer",
    terraformConfig: {
      region: "nyc3",
      forwarding_rule: {
        entry_port: 443,
        entry_protocol: "https",
        target_port: 80,
        target_protocol: "http",
      },
    },
  },
  {
    id: "vpc",
    type: "vpc",
    name: "VPC",
    icon: "🔒",
    category: "networking",
    monthlyCost: 0,
    description: "Private network",
    terraformResource: "digitalocean_vpc",
    terraformConfig: {
      region: "nyc3",
      ip_range: "10.10.10.0/24",
    },
  },
  {
    id: "floating-ip",
    type: "floating-ip",
    name: "Floating IP",
    icon: "🌐",
    category: "networking",
    monthlyCost: 5,
    description: "Static IP address",
    terraformResource: "digitalocean_floating_ip",
    terraformConfig: {
      region: "nyc3",
    },
  },
  {
    id: "cdn",
    type: "cdn",
    name: "CDN",
    icon: "🚀",
    category: "networking",
    monthlyCost: 5,
    description: "Content delivery",
    terraformResource: "digitalocean_cdn",
    terraformConfig: {
      origin: "spaces-origin",
    },
  },
  {
    id: "firewall",
    type: "firewall",
    name: "Firewall",
    icon: "🛡️",
    category: "networking",
    monthlyCost: 0,
    description: "Security rules",
    terraformResource: "digitalocean_firewall",
    terraformConfig: {
      inbound_rule: {
        protocol: "tcp",
        port_range: "22",
        source_addresses: ["0.0.0.0/0"],
      },
    },
  },

  // Other
  {
    id: "container-registry",
    type: "container-registry",
    name: "Container Registry",
    icon: "📋",
    category: "other",
    monthlyCost: 5,
    description: "Docker images",
    terraformResource: "digitalocean_container_registry",
    terraformConfig: {
      subscription_tier_slug: "basic",
    },
  },
  {
    id: "functions",
    type: "functions",
    name: "Functions",
    icon: "λ",
    category: "other",
    monthlyCost: 2,
    description: "Serverless compute",
    terraformResource: "digitalocean_app",
    terraformConfig: {
      spec: {
        name: "functions",
        service: {
          name: "function",
          source_dir: "/",
        },
      },
    },
  },
  {
    id: "monitoring",
    type: "monitoring",
    name: "Monitoring",
    icon: "📊",
    category: "other",
    monthlyCost: 0,
    description: "Metrics & alerts",
    terraformResource: "digitalocean_monitor_alert",
    terraformConfig: {
      type: "v1/insights/droplet/cpu",
      compare: "GreaterThan",
      value: 80,
    },
  },
];

export function getComponentByType(type: string): DOComponent | undefined {
  return DO_COMPONENTS.find((c) => c.type === type);
}

export function getComponentsByCategory(
  category: string
): DOComponent[] {
  return DO_COMPONENTS.filter((c) => c.category === category);
}
