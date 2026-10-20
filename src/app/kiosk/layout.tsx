import type { Metadata } from "next";
import type { ReactNode } from "react";
import { config } from "@/content/config";

// Added to an iPad's home screen, the kiosk pages open full screen like an app.
export const metadata: Metadata = {
  title: `${config.productName} kiosk`,
  appleWebApp: { capable: true, title: config.productName, statusBarStyle: "black-translucent" },
};

export default function KioskLayout({ children }: { children: ReactNode }) {
  return children;
}
