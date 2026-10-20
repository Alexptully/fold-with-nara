import type { Metadata } from "next";
import { ProjectorPage } from "@/components/kiosk/KioskPages";
import { config } from "@/content/config";

export const metadata: Metadata = { title: `${config.productName} projector` };

export default function KioskProjectorPage() {
  return <ProjectorPage />;
}
