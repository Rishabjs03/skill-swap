import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // yahan Cloudinary ka domain add karo
  },
  eslint: {
    // Build ke time ESLint errors ko ignore kare
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
