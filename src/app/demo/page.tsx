import type { Metadata } from "next";
import { DemoKiosk } from "@/components/demo/DemoKiosk";
import { demoKiosk } from "@/content/content";

export const metadata: Metadata = { title: demoKiosk.title };

/** The demo kiosk on its own, full window, for embedding in the team's portfolios. */
export default function DemoPage() {
  return (
    <main className="fixed inset-0 touch-manipulation select-none">
      <DemoKiosk />
    </main>
  );
}
