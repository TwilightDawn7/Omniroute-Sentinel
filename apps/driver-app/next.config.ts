import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // This is needed for Leaflet to work properly
  transpilePackages: ["leaflet"],
};

export default nextConfig;