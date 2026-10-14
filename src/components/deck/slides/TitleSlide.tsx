"use client";

import { motion } from "motion/react";
import { NaraFigure } from "@/components/art/NaraFigure";
import { config } from "@/content/config";
import { title } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import { Crease, Reveal } from "../primitives";

export function TitleSlide() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-24 top-[300px] w-[900px]">
        <Reveal>
          <h1 className="text-display text-ink">{title.headline}</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-10 max-w-[800px] text-lead text-ink-muted">{title.tagline}</p>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-24 text-body text-ink">{config.team.join(", ")}</p>
          <p className="mt-2 text-small text-ink-muted">{config.occasion}</p>
        </Reveal>
      </div>
      <TitleSheet />
    </div>
  );
}

/** A big sheet of paper with its first crease. Its top corner folds down while Nara watches. */
function TitleSheet() {
  return (
    <div className="absolute right-[120px] top-[130px] h-[820px] w-[760px]">
      <svg viewBox="0 0 760 820" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g style={{ filter: "var(--shadow-drop-poster)" }}>
          <motion.path
            fill="var(--color-sheet)"
            stroke="var(--color-sheet-edge)"
            strokeWidth="2"
            initial={{ d: "M80 40 L440 40 L680 40 L680 280 L680 640 L80 640 Z" }}
            animate={{ d: "M80 40 L440 40 L560 160 L680 280 L680 640 L80 640 Z" }}
            transition={{ duration: 1.2, delay: 0.9, ease: ease.fold }}
          />
          <Crease from={[80, 640]} to={[440, 280]} width={6} delay={0.4} />
          <motion.path
            fill="var(--color-sheet-shade)"
            stroke="var(--color-sheet-edge)"
            strokeWidth="2"
            initial={{ d: "M440 40 L680 40 L680 280 Z", opacity: 0 }}
            animate={{ d: "M440 40 L440 280 L680 280 Z", opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.9, ease: ease.fold }}
          />
        </g>
        <motion.circle
          cx="440"
          cy="280"
          r="10"
          fill="var(--color-accent)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.4, 1] }}
          transition={{ duration: duration.base, delay: 2.1 }}
        />
      </svg>
      <div className="absolute bottom-0 left-[150px] w-[360px]">
        <NaraFigure />
      </div>
    </div>
  );
}
