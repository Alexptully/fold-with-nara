"use client";

import { motion } from "motion/react";
import { FujiPaper } from "@/components/art/FujiPaper";
import { OrigamiIcon } from "@/components/art/OrigamiIcon";
import { config } from "@/content/config";
import { title, type OrigamiModel } from "@/content/content";
import { spring } from "@/lib/motion";
import { Crease, Reveal } from "../primitives";

/**
 * The welcome screen. Nara stays hidden until "Meet Nara", so the title shows the
 * paper the room is holding: the printed Mt. Fuji square, with the projector's
 * green fold line drawn across it and the other fold options drifting around it.
 */

const floaters: { model: OrigamiModel; x: number; y: number; size: number; delay: number }[] = [
  { model: "sakura", x: 1060, y: 150, size: 120, delay: 0.7 },
  { model: "crane", x: 1660, y: 120, size: 160, delay: 0.85 },
  { model: "koi", x: 1050, y: 800, size: 130, delay: 1.0 },
  { model: "kabuto", x: 1690, y: 820, size: 120, delay: 1.15 },
];

const SHEET = { left: 1100, top: 220, size: 640 };

export function TitleSlide() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-24 top-[250px] w-[880px]">
        <Reveal>
          <h1 className="text-display text-accent">{title.headline}</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-10 max-w-[780px] text-lead text-ink-muted">{title.tagline}</p>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-24 text-body text-ink">{config.team.join(", ")}</p>
          <p className="mt-2 text-small text-ink-muted">{config.occasion}</p>
        </Reveal>
      </div>
      <Sheet />
      {floaters.map((item) => (
        <Floater key={item.model} {...item} />
      ))}
    </div>
  );
}

/** The printed square drops in at a tilt, then the fold line is drawn corner to corner. */
function Sheet() {
  return (
    <motion.div
      className="absolute"
      style={{ left: SHEET.left, top: SHEET.top, width: SHEET.size, height: SHEET.size }}
      initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: -8 }}
      transition={{ ...spring, delay: 0.35 }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
      >
        <FujiPaper state={0} appear={false} className="absolute inset-0 h-full w-full" label={title.sheetLabel} />
        <svg viewBox="0 0 240 240" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <Crease from={[30, 30]} to={[210, 210]} width={3} delay={1.2} />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function Floater({ model, x, y, size, delay }: { model: OrigamiModel; x: number; y: number; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, width: size, height: size }}
      initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ ...spring, delay }}
    >
      <motion.div
        className="h-full w-full"
        animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
        transition={{ duration: 3.4 + delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <OrigamiIcon model={model} label="" className="h-full w-full" />
      </motion.div>
    </motion.div>
  );
}
