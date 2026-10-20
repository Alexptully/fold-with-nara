import os from "node:os";
import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo-name>. The deploy workflow sets
// PAGES_BASE_PATH; local dev and `npm run present` leave it empty.
const basePath = process.env.PAGES_BASE_PATH ?? "";

// The dev server only answers other devices it's told about, so the iPad and the
// projector can open the kiosk pages from this laptop's Wi-Fi address while rehearsing.
const lanAddresses = Object.values(os.networkInterfaces())
  .flat()
  .filter((entry) => entry && entry.family === "IPv4" && !entry.internal)
  .map((entry) => entry!.address);

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  allowedDevOrigins: lanAddresses,
};

export default nextConfig;
