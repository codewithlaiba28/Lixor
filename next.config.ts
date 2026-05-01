import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@xenova/transformers"],

  // Empty turbopack config silences the "webpack config but no turbopack config" error
  // that Next.js 16 throws when Turbopack is the default dev server.
  turbopack: {},

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "@xenova/transformers",
      ];
    }
    return config;
  },
};

export default nextConfig;
