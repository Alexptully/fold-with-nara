"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { FujiPaper } from "@/components/art/FujiPaper";
import { whyOrigami } from "@/content/content";
import { ease, spring } from "@/lib/motion";
import type { Pt } from "@/lib/shapes";
import { FoldArrow, Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

/**
 * Why we chose origami, as a before and after. Step 1: the printed square becomes
 * Mt. Fuji, a Japanese art you learn by doing. Step 2: the same mountain travels
 * along the crease to a shelf at home, a reminder of the event, with the study that
 * explains why people keep what they fold.
 */

// Boxes on the 1920 by 1080 stage. The mountain uses FujiPaper's tight frame (192 by 108).
const SHEET = { left: 110, top: 330, size: 440 };
const MOUNTAIN = { left: 620, top: 470, width: 480, height: 270 };
const HOME = { left: 1180, top: 230, width: 640, height: 500 };
const SHELF_TOP = 380;
const LANDED = { width: 280, centerX: 430 };
const CAPTION_TOP = 790;

const landedScale = LANDED.width / MOUNTAIN.width;
// Inside the tight frame, the peak sits 10 of 108 units down and the base 100.
const PEAK = 10 / 108;
const BASE = 100 / 108;
const landedHeight = MOUNTAIN.height * landedScale;
const start: Pt = [MOUNTAIN.left + MOUNTAIN.width / 2, MOUNTAIN.top + MOUNTAIN.height / 2];
const end: Pt = [HOME.left + LANDED.centerX, HOME.top + SHELF_TOP - landedHeight * BASE + landedHeight / 2];
const lift: Pt = [(start[0] + end[0]) / 2, Math.min(start[1], end[1]) - 300];

/** A point on the flight's curve, `t` from 0 (the event) to 1 (the shelf). */
function curve(t: number, from: Pt, via: Pt, to: Pt): Pt {
  const u = 1 - t;
  return [u * u * from[0] + 2 * u * t * via[0] + t * t * to[0], u * u * from[1] + 2 * u * t * via[1] + t * t * to[1]];
}

const flight = Array.from({ length: 13 }, (_, i) => curve(i / 12, start, lift, end));
const flightX = flight.map(([x]) => x - start[0]);
const flightY = flight.map(([, y]) => y - start[1]);

// The trail runs peak to peak, so it stays visible above both mountains.
const trailFrom: Pt = [start[0], MOUNTAIN.top + MOUNTAIN.height * PEAK - 24];
const trailTo: Pt = [end[0], end[1] - landedHeight / 2 + landedHeight * PEAK - 24];
const trailVia: Pt = [lift[0], lift[1] - 24];

const FLIGHT = { delay: 0.35, length: 1.3 };

export function WhyOrigamiSlide({ step }: SlideProps) {
  const home = step >= 2;
  return (
    <SlideShell heading={whyOrigami.heading}>
      <div className="absolute" style={{ left: SHEET.left, top: SHEET.top, width: SHEET.size, height: SHEET.size }}>
        <FujiPaper state={0} className="h-full w-full" label="The printed paper square" />
      </div>
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 1920 1080" aria-hidden="true">
        <FoldArrow from={[520, 600]} to={[735, 600]} bend={-0.3} delay={0.5} />
      </svg>
      <PoppingFuji />
      <Reveal delay={0.4} className="absolute left-0 top-0">
        <h2 className="absolute w-[900px] text-h3 text-ink" style={{ left: SHEET.left + 55, top: CAPTION_TOP }}>
          {whyOrigami.doing}
        </h2>
      </Reveal>
      <Reveal show={home} delay={0.05} className="absolute left-0 top-0">
        <div className="absolute overflow-hidden rounded-card bg-paper-sunk shadow-tile" style={HOME}>
          <Shelf />
        </div>
      </Reveal>
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 1920 1080" aria-hidden="true">
        <Trail show={home} />
      </svg>
      <Reveal show={home} delay={1.2} className="absolute left-0 top-0">
        <div className="absolute" style={{ left: HOME.left, top: CAPTION_TOP, width: HOME.width }}>
          <h2 className="text-h3 text-ink">{whyOrigami.keepsake}</h2>
          <p className="mt-3 text-body text-ink-muted">{whyOrigami.study}</p>
        </div>
      </Reveal>
      <TravelingFuji home={home} />
    </SlideShell>
  );
}

const mountainBox = { left: MOUNTAIN.left, top: MOUNTAIN.top, width: MOUNTAIN.width, height: MOUNTAIN.height };

/** The folded mountain pops in beside the sheet and stays there: this is the event. */
function PoppingFuji() {
  return (
    <motion.div
      className="absolute"
      style={mountainBox}
      initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ ...spring, delay: 0.9 }}
    >
      <FujiPaper state={3} tight appear={false} className="h-full w-full" label="The folded Mt. Fuji" />
    </motion.div>
  );
}

/** Its twin lifts off along the crease and lands on the shelf at home. */
function TravelingFuji({ home }: { home: boolean }) {
  return (
    <motion.div
      className="absolute z-10"
      style={mountainBox}
      initial={false}
      animate={home ? { x: flightX, y: flightY, scale: landedScale, opacity: 1 } : { x: 0, y: 0, scale: 1, opacity: 0 }}
      transition={home ? { duration: FLIGHT.length, delay: FLIGHT.delay, ease: ease.fold, opacity: { duration: 0 } } : { duration: 0 }}
      aria-hidden="true"
    >
      <FujiPaper state={3} tight appear={false} className="h-full w-full" />
    </motion.div>
  );
}

/** The deck's dashed crease, drawn behind the mountain as it flies. A solid stroke masks the dashes in. */
function Trail({ show }: { show: boolean }) {
  const maskId = useId();
  const d = `M${trailFrom[0]} ${trailFrom[1]} Q${trailVia[0]} ${trailVia[1]} ${trailTo[0]} ${trailTo[1]}`;
  return (
    <>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
          <motion.path
            d={d}
            fill="none"
            stroke="white"
            strokeWidth={14}
            initial={false}
            animate={{ pathLength: show ? 1 : 0 }}
            transition={show ? { duration: FLIGHT.length, delay: FLIGHT.delay, ease: ease.fold } : { duration: 0.2 }}
          />
        </mask>
      </defs>
      <path d={d} fill="none" stroke="var(--color-accent)" strokeWidth={5} strokeLinecap="round" strokeDasharray="15 12" mask={`url(#${maskId})`} />
    </>
  );
}

/** A shelf on a wall at home: a few books and the spot where Mt. Fuji lands. */
function Shelf() {
  return (
    <svg viewBox={`0 0 ${HOME.width} ${HOME.height}`} className="h-full w-full" role="img" aria-label={whyOrigami.shelfLabel}>
      <rect x={110} y={SHELF_TOP - 150} width={44} height={150} rx={4} fill="var(--color-line-strong)" />
      <rect x={158} y={SHELF_TOP - 128} width={36} height={128} rx={4} fill="var(--color-ink-faint)" />
      <rect x={200} y={SHELF_TOP - 140} width={40} height={140} rx={4} fill="var(--color-line)" transform={`rotate(12 240 ${SHELF_TOP})`} />
      <rect x={60} y={SHELF_TOP} width={520} height={16} rx={3} fill="var(--color-wood-top)" />
      <rect x={60} y={SHELF_TOP + 16} width={520} height={20} rx={3} fill="var(--color-wood-left)" />
      <path d={`M120 ${SHELF_TOP + 36} v56 h18 v-36 h36 v-20 Z`} fill="var(--color-wood-dark)" />
      <path d={`M520 ${SHELF_TOP + 36} v56 h-18 v-36 h-36 v-20 Z`} fill="var(--color-wood-dark)" />
    </svg>
  );
}
