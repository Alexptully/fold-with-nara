"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { duration, ease } from "@/lib/motion";

/**
 * Slides change like a sheet of paper folding back along its left edge.
 * Forward: the old page folds away and reveals the next one underneath.
 * Back: the previous page folds back over the current one.
 * Only transform and opacity animate, so the browser can composite the turn
 * on the GPU instead of repainting the whole slide every frame.
 */

export type LayerRole = "current" | "leaving";

const FOLDED = 96;
const turn = { duration: duration.pageTurn, ease: ease.fold };

type Motion = { rotate: [number, number]; shade: [number, number]; z: number };

// role, then direction (1 forward, -1 back) to the page's rotation, its own shade and stacking.
const plans: Record<LayerRole, Record<"1" | "-1", Motion>> = {
  leaving: {
    "1": { rotate: [0, FOLDED], shade: [0, 0.3], z: 2 },
    "-1": { rotate: [0, 0], shade: [0, 0.22], z: 1 },
  },
  current: {
    "1": { rotate: [0, 0], shade: [0.22, 0], z: 1 },
    "-1": { rotate: [FOLDED, 0], shade: [0.3, 0], z: 2 },
  },
};

export function PageLayer({
  role,
  direction,
  turning,
  children,
}: {
  role: LayerRole;
  direction: 1 | -1;
  turning: boolean;
  children: ReactNode;
}) {
  const plan = plans[role][direction > 0 ? "1" : "-1"];
  const still = !turning;
  const revealDelay = role === "current" && turning && direction > 0;
  const [ready, setReady] = useState(!revealDelay);

  // A page revealed underneath fills in once the turning page has lifted off it.
  useEffect(() => {
    if (ready) return;
    const timer = window.setTimeout(() => setReady(true), duration.pageTurn * 1000 * 0.28);
    return () => window.clearTimeout(timer);
  }, [ready]);

  return (
    <motion.div
      className="absolute inset-0 bg-paper"
      style={{ transformOrigin: "0% 50%", backfaceVisibility: "hidden", zIndex: still ? 1 : plan.z, willChange: "transform" }}
      initial={{ rotateY: still ? 0 : plan.rotate[0] }}
      animate={{ rotateY: still ? 0 : plan.rotate[1] }}
      transition={turn}
    >
      {ready ? children : null}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink"
        initial={{ opacity: still ? 0 : plan.shade[0] }}
        animate={{ opacity: still ? 0 : plan.shade[1] }}
        transition={turn}
      />
    </motion.div>
  );
}

/** The motif at the hinge: a green crease flashes along the fold line during a turn. */
export function HingeCrease({ id }: { id: number }) {
  return (
    <motion.svg
      key={id}
      className="pointer-events-none absolute left-0 top-0 z-20"
      width={14}
      height={1080}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: duration.pageTurn, times: [0, 0.35, 1] }}
    >
      <line x1={7} y1={0} x2={7} y2={1080} stroke="var(--color-accent)" strokeWidth={5} strokeDasharray="18 14" strokeLinecap="round" />
    </motion.svg>
  );
}
