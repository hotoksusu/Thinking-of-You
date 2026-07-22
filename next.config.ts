import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  output: "export",
  images: { unoptimized: true },
  experimental: { cpus: 1, webpackBuildWorker: false },
};

export default nextConfig;
