"use client";

import { motion, type TargetAndTransition, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { duration, ease } from "@/lib/motion";

/**
 * Slides blend into each other instead of flipping. Each slide names how it
 * arrives, and going back plays the same move in reverse:
 * - blend: a soft crossfade with a slight settle
 * - zoom: the deck leans in, for slides that look closer at one thing
 * - push: content slides along, for slides that continue a path
 * - rise: the next slide lifts up into place
 * Only transform and opacity animate, so the browser composites the whole move.
 */

export type TransitionKind = "blend" | "zoom" | "push" | "rise";
export type TransitionCustom = { kind: TransitionKind | "cut"; direction: 1 | -1 };

type Offset = (direction: 1 | -1) => TargetAndTransition;

const enterFrom: Record<TransitionKind, Offset> = {
  blend: () => ({ scale: 1.03 }),
  zoom: (d) => ({ scale: d > 0 ? 0.86 : 1.14 }),
  push: (d) => ({ x: 220 * d }),
  rise: (d) => ({ y: 120 * d }),
};

const exitTo: Record<TransitionKind, Offset> = {
  blend: () => ({ scale: 0.985 }),
  zoom: (d) => ({ scale: d > 0 ? 1.16 : 0.9 }),
  push: (d) => ({ x: -220 * d }),
  rise: (d) => ({ y: -90 * d }),
};

const glide = { duration: duration.slide, ease: ease.outSoft };

const slideVariants: Variants = {
  enter: ({ kind, direction }: TransitionCustom) => (kind === "cut" ? { opacity: 1 } : { opacity: 0, ...enterFrom[kind](direction) }),
  center: ({ kind }: TransitionCustom) => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    zIndex: 1,
    transition: kind === "cut" ? { duration: 0 } : { ...glide, opacity: { duration: duration.slide * 0.7, delay: duration.slide * 0.12 } },
  }),
  exit: ({ kind, direction }: TransitionCustom) =>
    kind === "cut"
      ? { opacity: 0, zIndex: 0, transition: { duration: 0 } }
      : { opacity: 0, zIndex: 0, ...exitTo[kind](direction), transition: { ...glide, opacity: { duration: duration.slide * 0.6 } } },
};

export function SlideLayer({ custom, label, children }: { custom: TransitionCustom; label: string; children: ReactNode }) {
  return (
    <motion.section
      className="absolute inset-0"
      aria-label={label}
      custom={custom}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.section>
  );
}
