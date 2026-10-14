"use client";

import { motion, type TargetAndTransition } from "motion/react";
import type { ReactNode } from "react";

export type TileState = "idle" | "selected" | "correct" | "wrong" | "done";

// Duolingo's answer tiles: grey ledge at rest, blue when picked, green or red after Check.
const looks: Record<TileState, string> = {
  idle: "bg-paper-raised shadow-tile text-ink",
  selected: "bg-macaw-soft shadow-tile-selected text-macaw-ink",
  correct: "bg-accent-soft shadow-tile-correct text-accent-ink",
  wrong: "bg-wrong-soft shadow-tile-wrong text-wrong-ink",
  done: "bg-paper-sunk text-ink-faint shadow-none",
};

const motions: Record<TileState, TargetAndTransition> = {
  idle: { x: 0, scale: 1 },
  selected: { x: 0, scale: [1, 0.97, 1] },
  correct: { x: 0, scale: [1, 1.05, 1] },
  wrong: { x: [0, -8, 8, -5, 5, 0], scale: 1 },
  done: { x: 0, scale: 1 },
};

/** An answer tile in the lesson mockups. Every state changes fill and ring, not just text. */
export function Tile({
  state = "idle",
  onClick,
  children,
  className = "",
  disabled,
}: {
  state?: TileState;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      animate={motions[state]}
      transition={{ duration: 0.35 }}
      className={`rounded-tile px-6 py-4 text-left text-small font-bold transition-colors active:translate-y-1 ${looks[state]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
