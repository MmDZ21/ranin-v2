import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Self-contained server output for Docker/container deploys.
  output: "standalone",
  // Trace workspace files from the monorepo root (also silences the inferred
  // workspace-root warning).
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    // Product/category images are served from Liara S3-compatible storage.
    remotePatterns: [
      { protocol: "https", hostname: "storage.iran.liara.space" },
      { protocol: "https", hostname: "**.liara.space" },
    ],
  },
};

export default nextConfig;
