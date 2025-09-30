import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Build ke time ESLint errors ko ignore kare
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
