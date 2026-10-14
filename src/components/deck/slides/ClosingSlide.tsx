"use client";

import { motion } from "motion/react";
import { config } from "@/content/config";
import { closing } from "@/content/content";
import type { NaraSpot } from "../NaraActor";
import { Jp, Reveal } from "../primitives";

/** Nara bows on the left while the thank-you comes in on the right. */
export const closingSpot: NaraSpot = { x: 110, y: 170, h: 820, pose: "bow" };

// Paper confetti in the deck's colors, falling and turning like folded squares.
const confetti = [
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

export function ClosingSlide() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {confetti.map((piece) => (
        <motion.span
          key={piece.x}
          className="absolute top-0 rounded-sm"
          style={{ left: piece.x, width: piece.size, height: piece.size, background: piece.color }}
          initial={{ y: -60, rotate: 0, opacity: 0 }}
          animate={{ y: [-60, 1140], rotate: [0, 540], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 5.5, delay: piece.delay, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />
      ))}
      <div className="absolute left-[820px] top-[330px] w-[980px]">
        <Reveal>
          <Jp className="block text-jp-lg font-extrabold text-ink">{closing.jp}</Jp>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-h2 text-accent">{closing.romaji}</p>
          <p className="mt-4 text-lead text-ink">{closing.line}</p>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="mt-20 text-body text-ink">{config.team.join(", ")}</p>
          <p className="mt-1 text-small text-ink-muted">{config.occasion}</p>
        </Reveal>
      </div>
    </div>
  );
}
