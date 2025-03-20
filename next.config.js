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
      "react-aria-components",
      "date-fns",
      "@hugeicons-pro/core-stroke-rounded",
      "@hugeicons-pro/core-solid-rounded",
      "@hugeicons/react",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(config);
