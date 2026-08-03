import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  ...(process.env.SITES_STATIC_EXPORT === "1" ? { output: "export" as const } : {}),
  images: { unoptimized: true },
  experimental: { cpus: 1, webpackBuildWorker: false },
};

export default nextConfig;
