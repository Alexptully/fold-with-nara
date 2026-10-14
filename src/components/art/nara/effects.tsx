"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { heart } from "@/lib/shapes";
import type { Effect } from "./geometry";

/** The little marks around Nara from the character sheet: sparkles, a question mark, hearts and bow lines. */

const loop = (duration: number, delay = 0) => ({ duration, delay, repeat: Infinity, ease: "easeInOut" as const });

function Ticks({ lines, color }: { lines: string[]; color: string }) {
  return (
    <>
      {lines.map((d) => (
        <path key={d} d={d} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
      ))}
    </>
  );
}

function Pulse({ children, origin }: { children: ReactNode; origin: string }) {
  return (
    <motion.g
      style={{ transformOrigin: origin, transformBox: "view-box" }}
      animate={{ scale: [0.85, 1.08, 0.85], opacity: [0.75, 1, 0.75] }}
      transition={loop(1.4)}
    >
      {children}
    </motion.g>
  );
}

const sparkleLeft = ["M104 338 L80 326", "M100 358 L74 360", "M104 378 L84 392"];
const sparkleRight = sparkleLeft.map((d) => d.replace(/(\d+) (\d+)/g, (_, x: string, y: string) => `${412 - Number(x)} ${Number(y) - 120}`));
const burst = ["M92 66 L76 42", "M64 84 L40 74", "M308 66 L324 42", "M336 84 L360 74"];

function Question() {
  return (
    <motion.text
      x={318}
      y={150}
      fontSize={84}
      fontWeight={800}
      fill="var(--color-macaw)"
      fontFamily="var(--font-display)"
      animate={{ y: [150, 140, 150], rotate: [0, 6, 0] }}
      transition={loop(1.8)}
    >
      ?
    </motion.text>
  );
}

function FloatingHearts() {
  const hearts = [
    { x: 306, y: 300, s: 17, delay: 0 },
    { x: 330, y: 344, s: 12, delay: 0.6 },
  ];
  return (
    <>
      {hearts.map((h) => (
        <motion.path
          key={h.x}
          d={heart(h.x, h.y, h.s)}
          fill="var(--color-love)"
          animate={{ y: [0, -18, 0], opacity: [0.7, 1, 0.7] }}
          transition={loop(2, h.delay)}
        />
      ))}
    </>
  );
}

function MotionLines() {
  const arcs = ["M90 216 Q78 246 90 276", "M68 228 Q60 246 68 264"];
  return (
    <motion.g animate={{ opacity: [0.4, 1, 0.4] }} transition={loop(1.3)}>
      {[...arcs, ...arcs.map((d) => d.replace(/(\d+) (\d+)/g, (_, x: string, y: string) => `${400 - Number(x)} ${y}`))].map((d) => (
        <path key={d} d={d} fill="none" stroke="var(--color-macaw-ring)" strokeWidth={6} strokeLinecap="round" />
      ))}
    </motion.g>
  );
}

const effects: Record<Effect, () => ReactNode> = {
  sparkleLeft: () => (
    <Pulse origin="90px 358px">
      <Ticks lines={sparkleLeft} color="var(--color-bee)" />
    </Pulse>
  ),
  sparkleRight: () => (
    <Pulse origin="310px 238px">
      <Ticks lines={sparkleRight} color="var(--color-bee)" />
    </Pulse>
  ),
  burst: () => (
    <Pulse origin="200px 150px">
      <Ticks lines={burst} color="var(--color-bee)" />
    </Pulse>
  ),
  question: () => <Question />,
  hearts: () => <FloatingHearts />,
  motionLines: () => <MotionLines />,
};

export function NaraEffect({ effect }: { effect?: Effect }) {
  if (!effect) return null;
  return <g aria-hidden="true">{effects[effect]()}</g>;
}
