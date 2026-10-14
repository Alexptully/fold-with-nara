"use client";

import { motion } from "motion/react";
import { OrigamiIcon } from "@/components/art/OrigamiIcon";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { config } from "@/content/config";
import { title, type OrigamiModel } from "@/content/content";
import { spring } from "@/lib/motion";
import type { NaraSpot } from "../NaraActor";
import { Reveal } from "../primitives";

/** Nara waves from the right; the stage-level Nara stands here (see NaraActor). */
export const titleSpot: NaraSpot = { x: 1040, y: 190, h: 800, pose: "wave" };

// The welcome screen: Nara says hello while the fold options drift around her like paper in the air.
const floaters: { model: OrigamiModel; x: number; y: number; size: number; delay: number }[] = [
  { model: "sakura", x: 1010, y: 110, size: 110, delay: 0.5 },
  { model: "crane", x: 1690, y: 110, size: 150, delay: 0.7 },
  { model: "fuji", x: 1700, y: 590, size: 130, delay: 0.9 },
  { model: "koi", x: 990, y: 770, size: 120, delay: 1.1 },
  { model: "kabuto", x: 1720, y: 830, size: 110, delay: 1.3 },
];

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
      {floaters.map((item) => (
        <Floater key={item.model} {...item} />
      ))}
      <motion.div
        className="absolute left-[1560px] top-[300px] w-[320px]"
        initial={{ opacity: 0, scale: 0.6, x: -40 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ ...spring, delay: 1.1 }}
        style={{ transformOrigin: "0% 80%" }}
      >
        <SpeechBubble>
          <p className="text-body font-bold text-ink">{title.welcome}</p>
        </SpeechBubble>
      </motion.div>
    </div>
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
