"use client";

import { lightFor } from "@/lib/kiosk/light";
import { KioskScreen } from "./KioskScreen";
import { ProjectorStage } from "./projector/ProjectorStage";
import { useKioskFeed, useStayAwake } from "./useKioskFeed";

/**
 * The demo kiosk's pages. Each one follows the deck: the iPad screen, the projector,
 * and both together for a projector that can only copy the iPad's screen.
 */

export function ScreenPage() {
  useStayAwake();
  const { message, linked } = useKioskFeed("screen");
  return (
    <main className="fixed inset-0 touch-manipulation select-none">
      <KioskScreen message={message} linked={linked} />
    </main>
  );
}

/** `right` keeps the light in the right half, for a projector whose left half is blocked by the booth. */
export function ProjectorPage({ side = "full" }: { side?: "full" | "right" }) {
  useStayAwake();
  const { message, linked } = useKioskFeed("projector");
  return (
    <main className="fixed inset-0 select-none bg-projector">
      <div className={side === "right" ? "absolute inset-y-0 right-0 w-1/2" : "absolute inset-0"}>
        <ProjectorStage light={lightFor(message?.scene ?? { kind: "welcome" })} storageKey={`fold-with-nara:projector-fit-${side}`} linked={linked} />
      </div>
    </main>
  );
}

/** The kiosk screen beside (or above) the projector's black panel, for a projector that mirrors the iPad. */
export function CombinedPage() {
  useStayAwake();
  const { message, linked } = useKioskFeed("screen");
  return (
    <main className="fixed inset-0 flex touch-manipulation select-none bg-projector portrait:flex-col">
      <div className="relative min-h-0 min-w-0 flex-[3]">
        <KioskScreen message={message} linked={linked} />
      </div>
      <div className="relative min-h-0 min-w-0 flex-[2]">
        <ProjectorStage light={lightFor(message?.scene ?? { kind: "welcome" })} storageKey="fold-with-nara:combined-fit" linked={linked} />
      </div>
    </main>
  );
}
