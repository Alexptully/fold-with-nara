"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowCounterClockwise,
  ArrowClockwise,
  ArrowsOutSimple,
  FlipHorizontal,
  Minus,
  Plus,
  type Icon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { kioskProjector } from "@/content/content";
import type { Light } from "@/lib/kiosk/light";
import { goFullScreen } from "../useKioskFeed";
import { LightView } from "./LightView";
import { CENTER, SHEET, VIEWBOX } from "./lightGeometry";
import { fitTransform, nudgeKeys, nudges, useProjectorFit, type Fit, type NudgeName } from "./useProjectorFit";

/**
 * The projector's picture: black, with the light for the current kiosk screen.
 * Tap it (or press C) to line it up with a sheet of paper on the ledge.
 */
export function ProjectorStage({ light, storageKey, linked }: { light: Light; storageKey: string; linked: boolean }) {
  const { fit, fitted, change } = useProjectorFit(storageKey);
  const [adjusting, setAdjusting] = useState(false);
  useFitKeys(adjusting, setAdjusting, fit, change);
  const nudge = (name: NudgeName) => change(nudges[name](fit, false));
  return (
    <div
      className={`relative h-full w-full touch-manipulation overflow-hidden bg-projector ${adjusting ? "" : "cursor-none"}`}
      onClick={adjusting ? undefined : () => setAdjusting(true)}
    >
      <svg viewBox={VIEWBOX} className="absolute inset-0 h-full w-full" aria-label="Projected fold lines">
        <g transform={fitTransform(fit, CENTER)}>
          <LightView light={light} />
        </g>
      </svg>
      {adjusting ? <FitPanel onNudge={nudge} onDone={() => setAdjusting(false)} /> : <FirstRunHint show={!fitted} />}
      {/* The guide square sits above the panel, so a small projector screen still shows all of it. */}
      {adjusting ? (
        <svg viewBox={VIEWBOX} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <g transform={fitTransform(fit, CENTER)}>
            <FitGuide />
          </g>
        </svg>
      ) : null}
      {linked ? null : <span className="absolute right-4 top-4 h-3 w-3 rounded-pill bg-ink-muted" role="status" aria-label="Reconnecting to the deck" />}
    </div>
  );
}

function useFitKeys(adjusting: boolean, setAdjusting: (next: boolean) => void, fit: Fit, change: (next: Fit) => void) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return setAdjusting(false);
      if (event.key.toLowerCase() === "c") return setAdjusting(!adjusting);
      const name = nudgeKeys[event.key] ?? nudgeKeys[event.key.toLowerCase()];
      if (!adjusting || !name) return;
      event.preventDefault();
      change(nudges[name](fit, event.shiftKey));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [adjusting, setAdjusting, fit, change]);
}

/** A white square the size of the printed sheet, with its middle marked, to line up with real paper. */
function FitGuide() {
  const size = SHEET.max - SHEET.min;
  return (
    <g stroke="var(--color-projector-guide)" strokeWidth={1.5} fill="none">
      <rect x={SHEET.min} y={SHEET.min} width={size} height={size} />
      <line x1={CENTER - 12} y1={CENTER} x2={CENTER + 12} y2={CENTER} />
      <line x1={CENTER} y1={CENTER - 12} x2={CENTER} y2={CENTER + 12} />
    </g>
  );
}

function FirstRunHint({ show }: { show: boolean }) {
  if (!show) return null;
  return <p className="absolute inset-x-0 bottom-6 text-center text-panel text-projector-guide opacity-70">{kioskProjector.adjustHint}</p>;
}

const pad: { name: NudgeName; icon: Icon; label: string; area: string }[] = [
  { name: "up", icon: ArrowUp, label: kioskProjector.move.up, area: "col-start-2" },
  { name: "left", icon: ArrowLeft, label: kioskProjector.move.left, area: "col-start-1 row-start-2" },
  { name: "right", icon: ArrowRight, label: kioskProjector.move.right, area: "col-start-3 row-start-2" },
  { name: "down", icon: ArrowDown, label: kioskProjector.move.down, area: "col-start-2 row-start-3" },
];

const tools: { name: NudgeName; icon: Icon; label: string }[] = [
  { name: "smaller", icon: Minus, label: kioskProjector.smaller },
  { name: "bigger", icon: Plus, label: kioskProjector.bigger },
  { name: "turnLeft", icon: ArrowCounterClockwise, label: kioskProjector.turnLeft },
  { name: "turnRight", icon: ArrowClockwise, label: kioskProjector.turnRight },
  { name: "mirror", icon: FlipHorizontal, label: kioskProjector.mirror },
];

/** Sits in the left margin, which a wide projector leaves free beside the square sheet. */
function FitPanel({ onNudge, onDone }: { onNudge: (name: NudgeName) => void; onDone: () => void }) {
  return (
    <div className="absolute bottom-4 left-4 top-4 flex w-[340px] flex-col gap-4 overflow-y-auto rounded-card bg-projector-panel p-5 text-panel text-paper max-lg:w-[280px] max-lg:p-4">
      <div>
        <h1 className="text-h4">{kioskProjector.fitTitle}</h1>
        <p className="mt-1 opacity-80">{kioskProjector.fitLine}</p>
      </div>
      <div className="grid grid-cols-3 grid-rows-3 gap-1.5 self-center" role="group" aria-label="Move">
        {pad.map(({ name, icon: PadIcon, label, area }) => (
          <Button key={name} size="icon" className={area} onClick={() => onNudge(name)} aria-label={label} sound={null}>
            <PadIcon size={24} weight="bold" aria-hidden="true" />
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {tools.map(({ name, icon: ToolIcon, label }) => (
          <Button key={name} size="panel" className="flex items-center gap-2" onClick={() => onNudge(name)} sound={null}>
            <ToolIcon size={20} weight="bold" aria-hidden="true" />
            {label}
          </Button>
        ))}
        <Button size="panel" onClick={() => onNudge("reset")} sound={null}>
          {kioskProjector.reset}
        </Button>
        <Button size="panel" className="flex items-center gap-2" onClick={goFullScreen} sound={null}>
          <ArrowsOutSimple size={20} weight="bold" aria-hidden="true" />
          {kioskProjector.fullScreen}
        </Button>
      </div>
      <Button variant="primary" size="panel" className="self-start px-8" onClick={onDone} sound={null}>
        {kioskProjector.done}
      </Button>
      <p className="mt-auto opacity-60">{kioskProjector.keys}</p>
    </div>
  );
}
