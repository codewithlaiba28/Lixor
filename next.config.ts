import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@xenova/transformers'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-node$": false,
    }
    return config;
  },
  turbopack: {
    resolveAlias: {
      "onnxruntime-node": false,
    },
  },
};

export default nextConfig;
