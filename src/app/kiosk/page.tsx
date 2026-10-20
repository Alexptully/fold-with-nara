import type { Metadata } from "next";
import { KioskSetup } from "@/components/kiosk/KioskSetup";
import { config } from "@/content/config";

export const metadata: Metadata = { title: `${config.productName} kiosk setup` };

export default function KioskSetupPage() {
  return <KioskSetup />;
}
