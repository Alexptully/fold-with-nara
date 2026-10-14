"use client";

import { motion } from "motion/react";
import { duration, ease } from "@/lib/motion";
import { stageSize } from "./usePresenterKeys";

// The next slide unfolds from a corner along a diagonal crease: from the
// top-left going forward, from the bottom-right going back.
const REACH = stageSize.width + stageSize.height;
const { width: W, height: H } = stageSize;

const closed = (direction: number) =>
  direction > 0 ? "polygon(0px 0px, 0px 0px, 0px 0px)" : `polygon(${W}px ${H}px, ${W}px ${H}px, ${W}px ${H}px)`;
const open = (direction: number) =>
  direction > 0
    ? `polygon(0px 0px, ${REACH}px 0px, 0px ${REACH}px)`
    : `polygon(${W}px ${H}px, ${W - REACH}px ${H}px, ${W}px ${H - REACH}px)`;

// The outgoing slide stays underneath and dims slightly, as if the new page casts
// a shadow on it. The dimming is also what keeps it mounted until the fold finishes.
export const foldVariants = {
  enter: (direction: number) => ({ clipPath: closed(direction), zIndex: 2, filter: "brightness(1)" }),
  center: (direction: number) => ({
    clipPath: open(direction),
    zIndex: 2,
    filter: "brightness(1)",
    transition: { duration: duration.slideFold, ease: ease.fold },
  }),
  exit: () => ({
    zIndex: 1,
    filter: "brightness(0.93)",
    transition: { duration: duration.slideFold, ease: ease.fold },
  }),
};

/** The dashed crease that sweeps across the stage with the unfolding slide. */
export function CreaseSweep({ direction }: { direction: number }) {
  const forward = direction > 0;
  const start = forward ? { x1: 0, y1: 0, x2: 0, y2: 0 } : { x1: W, y1: H, x2: W, y2: H };
  const end = forward ? { x1: REACH, y1: 0, x2: 0, y2: REACH } : { x1: W - REACH, y1: H, x2: W, y2: H - REACH };
  const transition = { duration: duration.slideFold, ease: ease.fold };
  return (
    <svg className="pointer-events-none absolute inset-0 z-20" width={W} height={H} aria-hidden="true">
      <motion.line
        initial={{ ...start, opacity: 0.5 }}
        animate={{ ...end, opacity: 0 }}
        transition={{ ...transition, opacity: { duration: duration.slideFold, ease: [0.8, 0, 1, 1] } }}
        stroke="var(--color-ink)"
        strokeOpacity={0.12}
        strokeWidth={28}
      />
      <motion.line
        initial={{ ...start, opacity: 1 }}
        animate={{ ...end, opacity: 0 }}
        transition={{ ...transition, opacity: { duration: duration.slideFold, ease: [0.8, 0, 1, 1] } }}
        stroke="var(--color-accent)"
        strokeWidth={5}
        strokeDasharray="18 14"
        strokeLinecap="round"
      />
    </svg>
  );
}
