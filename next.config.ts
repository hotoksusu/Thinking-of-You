import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  output: "export",
  ...(process.env.CARE_EXPORT_PROFILE === 'legacy-qa' ? { distDir: 'outputs/legacy-site' } : {}),
  images: { unoptimized: true },
  experimental: { cpus: 1, webpackBuildWorker: false },
};

export default nextConfig;
