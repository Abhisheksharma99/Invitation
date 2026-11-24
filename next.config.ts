import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One page, no server: `next build` writes a static site to out/.
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
