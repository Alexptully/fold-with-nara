"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export type TileState = "idle" | "selected" | "correct" | "wrong" | "done";

const looks: Record<TileState, string> = {
  idle: "bg-paper-raised shadow-tile text-ink",
  selected: "bg-paper-sunk shadow-tile-selected text-ink",
  correct: "bg-accent-soft shadow-tile-correct text-accent-ink",
  wrong: "bg-wrong-soft shadow-tile-wrong text-wrong-ink",
  done: "bg-paper-sunk text-ink-faint shadow-none",
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
  const shake = state === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 };
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      animate={shake}
      transition={{ duration: 0.4 }}
      className={`rounded-tile px-6 py-4 text-left text-small font-bold transition-colors ${looks[state]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
