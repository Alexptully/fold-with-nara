"use client";

import { motion } from "motion/react";

// Dashes at the box's corners and sides, as fractions of its size, each pointing away
// from the center.
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
