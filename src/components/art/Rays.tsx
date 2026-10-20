"use client";

import { motion } from "motion/react";
import { duration } from "@/lib/motion";

/** Light rays turning slowly behind a finished model, like Duolingo's lesson-complete screen. */
export function Rays({ show = true, className, style }: { show?: boolean; className?: string; style?: React.CSSProperties }) {
  const wedges = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <motion.svg
      className={className}
      style={style}
      viewBox="-330 -330 660 660"
      aria-hidden="true"
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: duration.base }}
    >
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
        {wedges.map((angle) => (
          <path key={angle} d="M0 0 L-42 -330 A330 330 0 0 1 42 -330 Z" fill="var(--color-accent-soft)" transform={`rotate(${angle})`} />
        ))}
      </motion.g>
    </motion.svg>
  );
}
