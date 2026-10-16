import type { Metadata } from "next";
import type { ReactNode } from "react";
import { config } from "@/content/config";
import "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: config.productName,
  description: config.tagline,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
