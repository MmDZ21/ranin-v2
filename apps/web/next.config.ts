import type { NextConfig } from "next";
import path from "path";

const isVercel = process.env.VERCEL === "1";
const workspaceRoot = path.join(__dirname, "..", "..");

const nextConfig: NextConfig = {
  // Vercel owns its build output and tracing paths. The standalone monorepo
  // settings remain enabled for the later Docker/VPS deployment.
  ...(isVercel
    ? {}
    : {
        output: "standalone" as const,
        outputFileTracingRoot: workspaceRoot,
        turbopack: {
          root: workspaceRoot,
        },
      }),
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
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
