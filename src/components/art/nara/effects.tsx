"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { heart } from "@/lib/shapes";
import type { Effect } from "./geometry";

/**
 * The marks around Nara from the animation: two yellow dashes when she talks or
 * laughs, a blue question mark, pink hearts, a cheer burst and the blue bow lines.
 * Positions are in the same frame coordinates as the geometry.
 */

const loop = (duration: number, delay = 0) => ({ duration, delay, repeat: Infinity, ease: "easeInOut" as const });

type Dash = { cx: number; cy: number; angle: number };

function Dashes({ dashes }: { dashes: Dash[] }) {
  return (
    <>
      {dashes.map((d, i) => (
        <g key={i} transform={`rotate(${d.angle} ${d.cx} ${d.cy})`}>
          <motion.rect
            x={d.cx - 27}
            y={d.cy - 13}
            width={54}
            height={26}
            rx={5}
            fill="var(--color-spark)"
            style={{ transformOrigin: `${d.cx}px ${d.cy}px`, transformBox: "view-box" }}
            animate={{ opacity: [1, 0.45, 1], scaleX: [1, 0.78, 1] }}
            transition={loop(1.2, i * 0.18)}
          />
        </g>
      ))}
    </>
  );
}

const sparkleLeft: Dash[] = [
  { cx: 277, cy: 413, angle: 40 },
  { cx: 279, cy: 505, angle: -25 },
];
const sparkleRight: Dash[] = sparkleLeft.map((d) => ({ cx: 920 - d.cx, cy: d.cy, angle: -d.angle }));
// Three dashes radiating from the raised hand when Nara cheers.
const burst: Dash[] = [
  { cx: 668, cy: 290, angle: -80 },
  { cx: 742, cy: 316, angle: -42 },
  { cx: 782, cy: 384, angle: -6 },
];

function Question() {
  return (
    <motion.text
      x={640}
      y={300}
      fontSize={132}
      fontWeight={700}
      fill="var(--color-macaw)"
      fontFamily="var(--font-display)"
      style={{ transformOrigin: "676px 260px", transformBox: "view-box" }}
      animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
      transition={loop(1.8)}
    >
      ?
    </motion.text>
  );
}

function FloatingHearts() {
  const hearts = [
    { x: 646, y: 470, s: 24, delay: 0 },
    { x: 690, y: 540, s: 17, delay: 0.6 },
  ];
  return (
    <>
      {hearts.map((h) => (
        <motion.path
          key={h.x}
          d={heart(h.x, h.y, h.s)}
          fill="var(--color-love)"
          animate={{ y: [0, -22, 0], opacity: [1, 0.7, 1] }}
          transition={loop(2, h.delay)}
        />
      ))}
    </>
  );
}

const mirror = (d: string) => d.replace(/(\d+) (\d+)/g, (_, x: string, y: string) => `${920 - Number(x)} ${y}`);

function MotionLines() {
  const left = ["M290 492 Q246 531 290 570", "M268 510 Q244 531 268 552"];
  return (
    <motion.g animate={{ opacity: [1, 0.35, 1] }} transition={loop(1.3)}>
      {[...left, ...left.map(mirror)].map((d) => (
        <path key={d} d={d} fill="none" stroke="var(--color-motion)" strokeWidth={9} strokeLinecap="round" />
      ))}
    </motion.g>
  );
}

const effects: Record<Effect, () => ReactNode> = {
  sparkleLeft: () => <Dashes dashes={sparkleLeft} />,
  sparkleRight: () => <Dashes dashes={sparkleRight} />,
  burst: () => <Dashes dashes={burst} />,
  question: () => <Question />,
  hearts: () => <FloatingHearts />,
  motionLines: () => <MotionLines />,
};

export function NaraEffect({ effect }: { effect?: Effect }) {
  if (!effect) return null;
  return <g aria-hidden="true">{effects[effect]()}</g>;
}
