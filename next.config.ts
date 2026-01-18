import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during production builds (for Vercel deployment)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during production builds (for Vercel deployment)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
