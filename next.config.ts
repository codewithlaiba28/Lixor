import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@xenova/transformers"],

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent webpack from trying to bundle native Xenova binaries.
      // The package is loaded dynamically at runtime via dynamic import.
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "@xenova/transformers",
      ];
    }
    return config;
  },
};

export default nextConfig;
