"use client";

import { motion } from "motion/react";

// Paper confetti in the deck's colors, falling and turning like folded squares.
const pieces = [
  { x: 120, color: "var(--color-accent)", delay: 0, size: 26 },
  { x: 340, color: "var(--color-sakura)", delay: 0.6, size: 20 },
  { x: 560, color: "var(--color-bee)", delay: 1.1, size: 24 },
  { x: 820, color: "var(--color-macaw)", delay: 0.3, size: 18 },
  { x: 1060, color: "var(--color-love)", delay: 0.9, size: 22 },
  { x: 1280, color: "var(--color-accent-bright)", delay: 1.5, size: 26 },
  { x: 1500, color: "var(--color-fox)", delay: 0.2, size: 20 },
  { x: 1720, color: "var(--color-sakura-deep)", delay: 1.2, size: 24 },
  { x: 940, color: "var(--color-bee)", delay: 2, size: 16 },
  { x: 220, color: "var(--color-macaw-ring)", delay: 1.8, size: 18 },
];

/** Squares of paper drifting down the whole stage, on a loop. */
export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <motion.span
          key={piece.x}
          className="absolute top-0 rounded-sm"
          style={{ left: piece.x, width: piece.size, height: piece.size, background: piece.color }}
          initial={{ y: -60, rotate: 0, opacity: 0 }}
          animate={{ y: [-60, 1140], rotate: [0, 540], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 5.5, delay: piece.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
