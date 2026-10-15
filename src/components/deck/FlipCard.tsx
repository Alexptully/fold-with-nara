"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * A Duolingo-style reveal: the card squashes down, flips over on a bouncy spring
 * and lands with a burst of yellow sparkle dashes, like a lesson reward. Only
 * transform and opacity animate. On the print route it shows the chosen face flat.
 */

// Ease-out with a little overshoot, so the card swings past flat and settles back.
const flipEase = [0.34, 1.45, 0.64, 1] as const;

export function FlipCard({
  flipped,
  front,
  back,
  delay = 0,
  print = false,
}: {
  flipped: boolean;
  front: ReactNode;
  back: ReactNode;
  delay?: number;
  print?: boolean;
}) {
  if (print) return <Face>{flipped ? back : front}</Face>;
  return (
    <div className="relative h-full w-full" style={{ perspective: 2200 }}>
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={flipped ? { rotateY: 180, scale: [1, 0.9, 1.05, 1], y: [0, -18, 0] } : { rotateY: 0, scale: 1, y: 0 }}
        transition={{
          rotateY: { duration: 0.85, ease: flipEase, delay: delay + 0.12 },
          scale: { duration: 0.95, times: [0, 0.18, 0.65, 1], delay },
          y: { duration: 0.95, times: [0, 0.45, 1], delay },
        }}
      >
        <Face>{front}</Face>
        <Face flip>{back}</Face>
      </motion.div>
      <SparkleBurst on={flipped} delay={delay + 0.6} />
    </div>
  );
}

function Face({ children, flip = false }: { children: ReactNode; flip?: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-card bg-paper-raised shadow-card"
      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: flip ? "rotateY(180deg)" : undefined }}
    >
      {children}
    </div>
  );
}

// Dashes at the card's corners and sides, as fractions of its box, each pointing away
// from the center. None sit above or below, where the heading and label are.
const dashes = [
  { x: -0.05, y: 0.06, angle: -150 },
  { x: 1.05, y: 0.06, angle: -30 },
  { x: 1.07, y: 0.5, angle: 0 },
  { x: 1.05, y: 0.94, angle: 30 },
  { x: -0.05, y: 0.94, angle: 150 },
  { x: -0.07, y: 0.5, angle: 180 },
];

/** Yellow dashes that pop outward once when `on` turns true. Nothing plays on first render. */
export function SparkleBurst({ on, delay = 0 }: { on: boolean; delay?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {dashes.map((dash, i) => {
        const rad = (dash.angle * Math.PI) / 180;
        return (
          <motion.span
            key={i}
            className="absolute -ml-[23px] -mt-[9px] h-[18px] w-[46px] rounded-md bg-spark"
            style={{ left: `${dash.x * 100}%`, top: `${dash.y * 100}%`, rotate: dash.angle }}
            initial={false}
            animate={on ? { opacity: [0, 1, 0], scale: [0.3, 1.1, 0.7], x: [0, Math.cos(rad) * 34], y: [0, Math.sin(rad) * 34] } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: delay + (i % 2) * 0.05, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
