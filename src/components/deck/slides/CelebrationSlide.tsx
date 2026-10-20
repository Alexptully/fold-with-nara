"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { FujiPaper } from "@/components/art/FujiPaper";
import { Rays } from "@/components/art/Rays";
import { HANG_SPOT, INSIDE, TentInside } from "@/components/art/TentInside";
import { LessonResults } from "@/components/lesson/LessonResults";
import { celebration } from "@/content/content";
import { duration, ease, spring } from "@/lib/motion";
import { Confetti } from "../Confetti";
import type { NaraSpot } from "../NaraActor";
import type { SlideProps } from "../types";
import { useReportToKiosk } from "../useKioskLink";
import { useRevealSound } from "../useRevealSound";

/**
 * The station's completion screen. Step 1: the finished Mt. Fuji, the score and two
 * choices while Nara cheers. Step 2: "Hang it in the tent" flies the model into our
 * drawing of the tent's inside, where it hangs from the dome among the other origami.
 */

export function celebrationSpot(step: number): NaraSpot {
  if (step >= 2) return { x: 1200, y: 330, h: 640, pose: "love" };
  return { x: 1230, y: 200, h: 780, pose: "cheer" };
}

// The finished model's box in step 1 (FujiPaper's tight frame, 192 by 108: the peak is
// 10 units down), and the tent card in step 2, showing the room around its back corner.
const HERO = { left: 230, top: 230, width: 640, height: 360 };
const PEAK_Y = (HERO.height * 10) / 108;
const TENT = { left: 160, top: 180, width: 1000, height: 780 };
const roomScale = TENT.height / INSIDE.height;
const roomShift = TENT.width / 2 - HANG_SPOT.x * roomScale;

// Where it hangs: its peak at the room's hanging spot, the string running up to the dome.
const HUNG_WIDTH = 150;
const HUNG_SCALE = HUNG_WIDTH / HERO.width;
const hungPeak = { x: TENT.left + roomShift + HANG_SPOT.x * roomScale, y: TENT.top + HANG_SPOT.peakY * roomScale };
const hungCenterY = hungPeak.y + (HERO.height / 2 - PEAK_Y) * HUNG_SCALE;
const flight = { x: hungPeak.x - (HERO.left + HERO.width / 2), y: hungCenterY - (HERO.top + HERO.height / 2) };
// The string's length in the model's own (unscaled) pixels, from its peak to the top of the card.
const STRING_LENGTH = (hungPeak.y - TENT.top) / HUNG_SCALE;

export function CelebrationSlide({ step, print, advance }: SlideProps) {
  const hung = step >= 2;
  const [kept, setKept] = useState(false);
  useRevealSound(hung, print, "pop", 1250);
  useReportToKiosk({ kept });
  return (
    <div className="absolute inset-0 overflow-hidden px-24 pt-16">
      {hung ? null : <Confetti />}
      <h1 className="relative z-10 text-h1 text-accent-ink">{celebration.heading}</h1>
      <HeroRays show={!hung} />
      <TentCard show={hung} />
      <motion.div
        className="absolute"
        initial={false}
        animate={{ opacity: hung ? 0 : 1, x: hung ? -60 : 0 }}
        transition={{ duration: duration.base, ease: ease.outSoft }}
        aria-hidden={hung}
      >
        <LessonResults kept={kept} onKeep={() => setKept(true)} onHang={advance} className="absolute left-[230px] top-[600px] w-[640px]" />
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

/** The rays sit centered behind the model in step 1. */
function HeroRays({ show }: { show: boolean }) {
  const left = HERO.left + HERO.width / 2 - 330;
  const top = HERO.top + HERO.height / 2 - 330;
  return <Rays show={show} className="absolute" style={{ left, top, width: 660, height: 660 }} />;
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
          <line x1={HERO.width / 2} y1={0} x2={HERO.width / 2} y2={STRING_LENGTH} stroke="var(--color-ink-faint)" strokeWidth={2 / HUNG_SCALE} />
        </motion.svg>
        <FujiPaper state={3} tight className="h-full w-full" label="The finished origami Mt. Fuji" />
      </motion.div>
    </motion.div>
  );
}

/** Our drawing of the tent's inside, framed on the back corner where the model hangs. */
function TentCard({ show }: { show: boolean }) {
  return (
    <motion.div
      className="absolute overflow-hidden rounded-card shadow-card"
      style={TENT}
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.94 }}
      transition={{ duration: duration.slow, delay: show ? 0.1 : 0, ease: ease.outSoft }}
      aria-hidden={!show}
    >
      <div style={{ ...INSIDE, transform: `translateX(${roomShift}px) scale(${roomScale})`, transformOrigin: "0 0" }}>
        <TentInside />
      </div>
    </motion.div>
  );
}
