import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo-name>. The deploy workflow sets
// PAGES_BASE_PATH; local dev and `npm run present` leave it empty.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
