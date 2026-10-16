"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { FujiPaper } from "@/components/art/FujiPaper";
import { Button } from "@/components/ui/Button";
import { config } from "@/content/config";
import { celebration } from "@/content/content";
import { duration, ease, spring } from "@/lib/motion";
import { asset } from "@/lib/paths";
import { Confetti } from "../Confetti";
import type { NaraSpot } from "../NaraActor";
import { Jp } from "../primitives";
import type { SlideProps } from "../types";
import { useRevealSound } from "../useRevealSound";

/**
 * The station's completion screen. Step 1: the finished Mt. Fuji, the score and two
 * choices while Nara cheers. Step 2: "Hang it in the tent" flies the model into the
 * tent's canopy, where it hangs and sways among the other origami.
 */

export function celebrationSpot(step: number): NaraSpot {
  if (step >= 2) return { x: 1200, y: 330, h: 640, pose: "love" };
  return { x: 1230, y: 200, h: 780, pose: "cheer" };
}

// The finished model's box in step 1, and where it hangs inside the tent card in step 2.
const HERO = { left: 230, top: 230, width: 640, height: 360 };
const HUNG = { centerX: 646, centerY: 378, width: 170 };
const HUNG_SCALE = HUNG.width / HERO.width;
const flight = { x: HUNG.centerX - (HERO.left + HERO.width / 2), y: HUNG.centerY - (HERO.top + HERO.height / 2) };
// The string runs from the model's peak up to the roof, in the model's own (unscaled) pixels.
const STRING_LENGTH = 222;
const PEAK_Y = 33;

export function CelebrationSlide({ step, print, advance }: SlideProps) {
  const hung = step >= 2;
  const [kept, setKept] = useState(false);
  useRevealSound(hung, print, "pop", 1250);
  return (
    <div className="absolute inset-0 overflow-hidden px-24 pt-16">
      {hung ? null : <Confetti />}
      <h1 className="relative z-10 text-h1 text-accent-ink">{celebration.heading}</h1>
      <Rays show={!hung} />
      <TentCard show={hung} />
      <motion.div
        className="absolute"
        initial={false}
        animate={{ opacity: hung ? 0 : 1, x: hung ? -60 : 0 }}
        transition={{ duration: duration.base, ease: ease.outSoft }}
        aria-hidden={hung}
      >
        <Results kept={kept} onKeep={() => setKept(true)} onHang={advance} />
      </motion.div>
      <motion.p
        className="absolute left-[1230px] top-[200px] w-[600px] text-lead text-ink"
        initial={false}
        animate={{ opacity: hung ? 1 : 0, y: hung ? 0 : 16 }}
        transition={{ duration: duration.base, delay: hung ? 1.2 : 0 }}
      >
        {celebration.hungLine}
      </motion.p>
      <HangingFuji hung={hung} />
    </div>
  );
}

/** Light rays turning slowly behind the model, like Duolingo's lesson-complete screen. */
function Rays({ show }: { show: boolean }) {
  const wedges = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <motion.svg
      className="absolute"
      style={{ left: HERO.left + HERO.width / 2 - 330, top: HERO.top + HERO.height / 2 - 330 }}
      width={660}
      height={660}
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

/** The finished model: pops in on arrival, then flies up and hangs from a string in step 2. */
function HangingFuji({ hung }: { hung: boolean }) {
  return (
    <motion.div
      className="absolute z-10"
      style={{ left: HERO.left, top: HERO.top, width: HERO.width, height: HERO.height }}
      initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
      animate={hung ? { scale: HUNG_SCALE, rotate: 0, opacity: 1, x: flight.x, y: flight.y } : { scale: 1, rotate: 0, opacity: 1, x: 0, y: 0 }}
      transition={hung ? { duration: 1.1, delay: 0.25, ease: ease.fold } : { ...spring, delay: 0.15 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformOrigin: `50% ${((PEAK_Y - STRING_LENGTH) / HERO.height) * 100}%` }}
        animate={hung ? { rotate: [0, 5, -4, 3, -2, 0] } : { rotate: 0 }}
        transition={hung ? { duration: 3.2, delay: 1.35, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" } : { duration: 0.3 }}
      >
        <motion.svg
          className="absolute left-0 overflow-visible"
          style={{ top: PEAK_Y - STRING_LENGTH }}
          width={HERO.width}
          height={STRING_LENGTH}
          aria-hidden="true"
          initial={false}
          animate={{ opacity: hung ? 1 : 0 }}
          transition={{ duration: 0.3, delay: hung ? 1.3 : 0 }}
        >
          <line x1={HERO.width / 2} y1={0} x2={HERO.width / 2} y2={STRING_LENGTH} stroke="var(--color-paper)" strokeWidth={12} strokeDasharray="30 22" strokeLinecap="round" />
        </motion.svg>
        <FujiPaper state={3} tight className="h-full w-full" label="The finished origami Mt. Fuji" />
      </motion.div>
    </motion.div>
  );
}

/** The tent render, where finished origami hangs on the shared display. */
function TentCard({ show }: { show: boolean }) {
  return (
    <motion.div
      className="absolute left-[160px] top-[180px] h-[780px] w-[1000px] overflow-hidden rounded-card shadow-card"
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.94 }}
      transition={{ duration: duration.slow, delay: show ? 0.1 : 0, ease: ease.outSoft }}
      aria-hidden={!show}
    >
      <img src={asset(config.tentPhoto)} alt={celebration.tentAlt} className="h-full w-full object-cover" draggable={false} />
    </motion.div>
  );
}

/** Name, score and the two choices, under the model. */
function Results({ kept, onKeep, onHang }: { kept: boolean; onKeep: () => void; onHang: () => void }) {
  return (
    <div className="absolute left-[230px] top-[600px] flex w-[640px] flex-col items-center" data-no-advance>
      <p className="flex items-baseline gap-4">
        <Jp className="text-jp-md font-extrabold text-ink">{celebration.jp}</Jp>
        <span className="text-lead text-ink-muted">{celebration.romaji}</span>
      </p>
      <div className="mt-6 flex gap-6">
        {celebration.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="mt-10 flex gap-6">
        <Button variant={kept ? "chosen" : "chunky"} onClick={onKeep}>
          {celebration.keepLabel}
        </Button>
        <Button variant="primary" onClick={onHang}>
          {celebration.hangLabel}
        </Button>
      </div>
      <p className={`mt-3 h-[38px] text-body font-bold text-macaw-ink transition-opacity ${kept ? "opacity-100" : "opacity-0"}`}>{celebration.keptLine}</p>
    </div>
  );
}

const statLook = {
  bee: { frame: "bg-bee", label: "text-ink", value: "text-bee-ink" },
  accent: { frame: "bg-accent", label: "text-paper", value: "text-accent-ink" },
};

/** A Duolingo-style result card: a colored frame with the label on top and the value inside. */
function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  const look = statLook[tone as keyof typeof statLook];
  return (
    <div className={`w-[250px] rounded-tile p-1 ${look.frame}`}>
      <p className={`py-1 text-center text-small font-extrabold ${look.label}`}>{label}</p>
      <p className={`rounded-tile bg-paper py-3 text-center font-display text-h3 ${look.value}`}>{value}</p>
    </div>
  );
}
