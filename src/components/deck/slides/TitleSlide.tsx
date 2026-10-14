"use client";

import { motion } from "motion/react";
import { NaraFigure } from "@/components/art/NaraFigure";
import { OrigamiIcon } from "@/components/art/OrigamiIcon";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { config } from "@/content/config";
import { title, type OrigamiModel } from "@/content/content";
import { spring } from "@/lib/motion";
import { Reveal } from "../primitives";

// The welcome screen: Nara says hello while the fold options drift around her like paper in the air.
const floaters: { model: OrigamiModel; x: number; y: number; size: number; delay: number }[] = [
  { model: "sakura", x: 1080, y: 150, size: 120, delay: 0.5 },
  { model: "crane", x: 1660, y: 120, size: 150, delay: 0.7 },
  { model: "fuji", x: 1720, y: 560, size: 130, delay: 0.9 },
  { model: "koi", x: 1010, y: 640, size: 130, delay: 1.1 },
  { model: "kabuto", x: 1460, y: 820, size: 120, delay: 1.3 },
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
        className="absolute left-[1130px] top-[300px] w-[420px]"
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...spring, delay: 0.35 }}
      >
        <NaraFigure pose="talk" className="h-[620px] w-[420px]" />
      </motion.div>
      <motion.div
        className="absolute left-[1430px] top-[250px] w-[400px]"
        initial={{ opacity: 0, scale: 0.6, x: -40 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ ...spring, delay: 1.1 }}
        style={{ transformOrigin: "0% 80%" }}
      >
        <SpeechBubble>
          <p className="text-small text-ink">{title.welcome}</p>
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
