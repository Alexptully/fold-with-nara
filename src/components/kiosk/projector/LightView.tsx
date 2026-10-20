"use client";

import { motion } from "motion/react";
import { Crease, FoldArrow } from "@/components/deck/primitives";
import type { Light } from "@/lib/kiosk/light";
import type { Pt } from "@/lib/shapes";
import { useLoop } from "../useLoop";
import { CENTER, SHEET, foldLight, paperOutline, toPoints } from "./lightGeometry";

/**
 * What the projector draws, in the paper's own units (see lightGeometry). Black is
 * no light, so only these lines reach the ledge: the green frame, the paper's edge
 * as a faint guide, the crease and arrow, and sparkles.
 */
export function LightView({ light }: { light: Light }) {
  if (light.kind === "frame") return <FrameCorners bright={light.bright} />;
  if (light.kind === "sparkle") return <Sparkle />;
  if (light.kind === "paper") return <PaperGuide state={light.state} missed={light.missed} />;
  if (light.kind === "done") return <Finished />;
  return <FoldMarks fold={light.fold} lit={light.lit} missed={light.missed} replay={light.replay} />;
}

const ARM = 30;
const OUTSET = 10;
const cornerPoints: { at: Pt; dir: Pt }[] = [
  { at: [SHEET.min - OUTSET, SHEET.min - OUTSET], dir: [1, 1] },
  { at: [SHEET.max + OUTSET, SHEET.min - OUTSET], dir: [-1, 1] },
  { at: [SHEET.max + OUTSET, SHEET.max + OUTSET], dir: [-1, -1] },
  { at: [SHEET.min - OUTSET, SHEET.max + OUTSET], dir: [1, -1] },
];

const cornerPath = ({ at: [x, y], dir: [dx, dy] }: { at: Pt; dir: Pt }) => `M${x} ${y + dy * ARM} L${x} ${y} L${x + dx * ARM} ${y}`;

/** The four corners of the folding area. They breathe while the kiosk waits, and turn red after a miss. */
function FrameCorners({ bright, missed = false }: { bright: boolean; missed?: boolean }) {
  const range = bright ? [0.6, 1, 0.6] : [0.3, 0.6, 0.3];
  return (
    <motion.g className="projected" animate={{ opacity: range }} transition={{ duration: bright ? 1.2 : 2.6, repeat: Infinity, ease: "easeInOut" }}>
      {cornerPoints.map((corner, i) => (
        <path
          key={i}
          d={cornerPath(corner)}
          fill="none"
          stroke={missed ? "var(--color-wrong)" : "var(--color-accent)"}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 0.3s" }}
        />
      ))}
    </motion.g>
  );
}

/** The paper's edge, faint, so the visitor can line their sheet up with it. */
function Edge({ points }: { points: Pt[] }) {
  return <polygon points={toPoints(points)} fill="none" stroke="var(--color-projector-guide)" strokeOpacity={0.3} strokeWidth={1.5} strokeLinejoin="round" />;
}

function PaperGuide({ state, missed }: { state: number; missed: boolean }) {
  return (
    <>
      <FrameCorners bright={false} missed={missed} />
      <Edge points={paperOutline(state)} />
    </>
  );
}

// The crease draws, then the arrow; both hold, fade, and draw again.
const FOLD_LOOP_MS = 4200;

function FoldMarks({ fold, lit, missed, replay }: { fold: number; lit: boolean; missed: boolean; replay: number }) {
  const loop = useLoop(FOLD_LOOP_MS, lit);
  const marks = foldLight(fold);
  return (
    <>
      <FrameCorners bright={false} missed={missed} />
      <Edge points={marks.outline} />
      {lit ? (
        <motion.g
          key={`${replay}-${loop}`}
          className="projected"
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: FOLD_LOOP_MS / 1000, times: [0, 0.9, 1], ease: "easeIn" }}
        >
          {marks.lines.map(([from, to], i) => (
            <Crease key={`l${i}`} from={from} to={to} width={4} delay={0.1 + i * 0.1} />
          ))}
          {marks.arrows.map((arrow, i) => (
            <FoldArrow key={`a${i}`} from={arrow.from} to={arrow.to} bend={arrow.bend} width={4.5} delay={0.9 + i * 0.12} />
          ))}
        </motion.g>
      ) : null}
    </>
  );
}

const rays = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6);

/** A ring of short yellow rays bursting out from the middle of the ledge. */
function Burst({ delay = 0, radius = 70 }: { delay?: number; radius?: number }) {
  return (
    <g>
      {rays.map((angle, i) => {
        const [cx, cy] = [Math.cos(angle), Math.sin(angle)];
        const reach = radius + (i % 2) * 18;
        return (
          <motion.line
            key={i}
            x1={CENTER + cx * reach}
            y1={CENTER + cy * reach}
            x2={CENTER + cx * (reach + 22)}
            y2={CENTER + cy * (reach + 22)}
            stroke="var(--color-spark)"
            strokeWidth={6}
            strokeLinecap="round"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.15, 1.3] }}
            style={{ transformOrigin: `${CENTER}px ${CENTER}px`, transformBox: "view-box" }}
            transition={{ duration: 1.1, delay: delay + (i % 2) * 0.08, ease: "easeOut" }}
          />
        );
      })}
    </g>
  );
}

function Sparkle() {
  return (
    <>
      <FrameCorners bright={false} />
      <Burst delay={0.3} />
      <Burst delay={0.8} radius={100} />
    </>
  );
}

const SPARKLE_LOOP_MS = 2600;

/** The finished mountain's outline glowing green, with sparkles on a loop. */
function Finished() {
  const loop = useLoop(SPARKLE_LOOP_MS);
  return (
    <>
      <motion.polygon
        className="projected"
        points={toPoints(paperOutline(1))}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={4}
        strokeLinejoin="round"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <Burst key={loop} radius={118} />
    </>
  );
}
