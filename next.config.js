/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import bundleAnalyzer from "@next/bundle-analyzer";

/** @type {import("next").NextConfig} */
const config = {
  trailingSlash: true,
  reactStrictMode: false,

  experimental: {
    reactCompiler: true,
    optimizePackageImports: [
      "@hugeicons/react",
      "@hugeicons-pro/core-solid-rounded",
      "@hugeicons-pro/core-stroke-rounded",
    ],
  },

  // Optimize bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(config);
