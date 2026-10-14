"use client";

import { motion } from "motion/react";
import { Crease, FoldArrow } from "@/components/deck/primitives";
import { duration, ease } from "@/lib/motion";
import type { Pt } from "@/lib/shapes";
import type { Guidance } from "@/content/content";

/**
 * The visitor's sheet at every stage of the traditional crane, drawn flat the way
 * an origami diagram shows it. State 0 is the blank square; state 10 is the crane.
 * A `guide` overlays the projector's marks for the next fold.
 */

type Tone = "sheet" | "fold" | "shade";
type Face = { pts: Pt[]; tone: Tone };
type Segment = readonly [Pt, Pt];
type PaperState = { faces: Face[]; creases?: Segment[] };
type Ghost = { from: Pt[]; to: Pt[] };
type FoldGuide = {
  lines: Segment[];
  arrows: { from: Pt; to: Pt; bend: number }[];
  ghost?: Ghost;
  turnOver?: boolean;
};

const square: Pt[] = [[30, 30], [210, 30], [210, 210], [30, 210]];
const diamond: Pt[] = [[120, 40], [200, 120], [120, 200], [40, 120]];
const P: Pt = [73.2, 86.8];
const P2: Pt = [166.8, 86.8];
const B: Pt = [120, 200];
const kiteCenter: Pt = [120, 86.9];
const diagonals: Segment[] = [[[30, 30], [210, 210]], [[210, 30], [30, 210]]];
const midlines: Segment[] = [[[120, 30], [120, 210]], [[30, 120], [210, 120]]];
const birdTop: Pt[] = [[120, 14], [164, 120], [76, 120]];
const narrowL: Pt = [98.9, 120];
const narrowR: Pt = [141.1, 120];

export const paperStates: PaperState[] = [
  { faces: [{ pts: square, tone: "sheet" }] },
  { faces: [{ pts: square, tone: "sheet" }], creases: diagonals },
  { faces: [{ pts: square, tone: "sheet" }], creases: [...diagonals, ...midlines] },
  { faces: [{ pts: diamond, tone: "sheet" }] },
  {
    faces: [
      { pts: diamond, tone: "shade" },
      { pts: [[120, 40], P2, B, P], tone: "sheet" },
      { pts: [P, B, kiteCenter], tone: "fold" },
      { pts: [P2, B, kiteCenter], tone: "fold" },
    ],
  },
  { faces: [{ pts: diamond, tone: "sheet" }], creases: [[P, B], [P2, B], [P, P2]] },
  {
    faces: [
      { pts: [[120, 76], [195, 151], [120, 226], [45, 151]], tone: "shade" },
      { pts: [[164, 120], [120, 226], [76, 120]], tone: "fold" },
      { pts: birdTop, tone: "sheet" },
    ],
  },
  {
    faces: [
      { pts: [[164, 120], [120, 226], [76, 120]], tone: "fold" },
      { pts: birdTop, tone: "sheet" },
    ],
    creases: [[[120, 120], [120, 226]]],
  },
  {
    faces: [
      { pts: [narrowL, narrowR, [120, 226]], tone: "fold" },
      { pts: birdTop, tone: "sheet" },
      { pts: [narrowL, [120, 226], [120, 111]], tone: "shade" },
      { pts: [narrowR, [120, 226], [120, 111]], tone: "shade" },
    ],
  },
  {
    faces: [
      { pts: [[100, 122], [114, 130], [36, 34]], tone: "fold" },
      { pts: [[126, 130], [140, 122], [204, 34]], tone: "fold" },
      { pts: [narrowL, narrowR, [120, 150]], tone: "shade" },
      { pts: birdTop, tone: "sheet" },
    ],
  },
  {
    faces: [
      { pts: [[96, 128], [126, 128], [90, 30]], tone: "shade" },
      { pts: [[102, 140], [114, 148], [40, 54]], tone: "sheet" },
      { pts: [[132, 148], [146, 140], [206, 50]], tone: "sheet" },
      { pts: [[94, 128], [152, 128], [122, 162]], tone: "fold" },
      { pts: [[118, 128], [150, 128], [154, 22]], tone: "sheet" },
      { pts: [[40, 54], [50, 52], [30, 82]], tone: "shade" },
    ],
  },
];

// guides[n] shows fold n, drawn on top of state n - 1.
const guides: Record<number, FoldGuide> = {
  1: {
    lines: diagonals,
    arrows: [{ from: [200, 200], to: [44, 44], bend: 0.3 }],
    ghost: { from: [[210, 30], [210, 210], [30, 210]], to: [[210, 30], [30, 30], [30, 210]] },
  },
  2: {
    lines: midlines,
    arrows: [{ from: [204, 150], to: [36, 150], bend: 0.3 }],
    ghost: { from: [[120, 30], [210, 30], [210, 210], [120, 210]], to: [[120, 30], [30, 30], [30, 210], [120, 210]] },
    turnOver: true,
  },
  3: {
    lines: diagonals,
    arrows: [
      { from: [34, 120], to: [102, 128], bend: -0.25 },
      { from: [206, 120], to: [138, 128], bend: 0.25 },
    ],
  },
  4: {
    lines: [[P, B], [P2, B]],
    arrows: [
      { from: [46, 122], to: [112, 96], bend: -0.3 },
      { from: [194, 122], to: [128, 96], bend: 0.3 },
    ],
    ghost: { from: [[40, 120], P, B], to: [kiteCenter, P, B] },
  },
  5: {
    lines: [[P, P2]],
    arrows: [{ from: [120, 46], to: [120, 126], bend: 0.45 }],
    ghost: { from: [[120, 40], P2, P], to: [[120, 133.6], P2, P] },
  },
  6: {
    lines: [[P, P2]],
    arrows: [{ from: [120, 194], to: [120, 30], bend: 0.45 }],
    ghost: { from: [P, P2, B], to: [P, P2, [120, -26]] },
  },
  7: {
    lines: [[[76, 120], [164, 120]]],
    arrows: [
      { from: [52, 150], to: [108, 140], bend: -0.3 },
      { from: [188, 150], to: [132, 140], bend: 0.3 },
    ],
    turnOver: true,
  },
  8: {
    lines: [[narrowL, [120, 226]], [narrowR, [120, 226]]],
    arrows: [
      { from: [84, 130], to: [116, 150], bend: -0.3 },
      { from: [156, 130], to: [124, 150], bend: 0.3 },
    ],
    ghost: { from: [[76, 120], narrowL, [120, 226]], to: [[120, 111], narrowL, [120, 226]] },
  },
  9: {
    lines: [[[104, 160], [120, 146]], [[136, 160], [120, 146]]],
    arrows: [
      { from: [114, 218], to: [46, 44], bend: -0.25 },
      { from: [126, 218], to: [194, 44], bend: 0.25 },
    ],
  },
  10: {
    lines: [[[44, 44], [58, 40]]],
    arrows: [
      { from: [38, 36], to: [28, 72], bend: -0.4 },
      { from: [112, 36], to: [84, 60], bend: -0.3 },
      { from: [128, 36], to: [158, 60], bend: 0.3 },
    ],
  },
};

const toneFill: Record<Tone, string> = {
  sheet: "var(--color-sheet)",
  fold: "var(--color-sheet-fold)",
  shade: "var(--color-sheet-shade)",
};

const toPoints = (pts: Pt[]) => pts.map((p) => p.join(",")).join(" ");
const toPath = (pts: Pt[]) => `M${pts.map((p) => p.join(" ")).join(" L")} Z`;

export function CranePaper({
  state,
  guide,
  guidance = "mark",
  className,
  label,
}: {
  state: number;
  guide?: number | null;
  guidance?: Guidance;
  className?: string;
  label?: string;
}) {
  const paper = paperStates[Math.max(0, Math.min(state, paperStates.length - 1))];
  const fold = guide ? guides[guide] : undefined;
  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label={label ?? `Paper crane, step ${state} of 10`} overflow="visible">
      <g style={{ filter: "var(--shadow-drop-sheet)" }}>
        {paper.faces.map((face, i) => (
          <motion.polygon
            key={`${state}-${i}`}
            points={toPoints(face.pts)}
            fill={toneFill[face.tone]}
            stroke="var(--color-sheet-edge)"
            strokeWidth={1.4}
            strokeLinejoin="round"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ originX: "120px", originY: "120px" }}
            transition={{ duration: duration.base, delay: i * 0.05, ease: ease.outSoft }}
          />
        ))}
      </g>
      {paper.creases?.map(([a, b], i) => (
        <line key={`c${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--color-sheet-edge)" strokeWidth={1.2} strokeDasharray="4 4" />
      ))}
      {fold && guidance !== "try" ? <GuideMarks fold={fold} animated={guidance === "show"} /> : null}
    </svg>
  );
}

function GuideMarks({ fold, animated }: { fold: FoldGuide; animated: boolean }) {
  return (
    <g className="projected">
      {fold.ghost && animated ? <GhostFlap ghost={fold.ghost} /> : null}
      {fold.lines.map(([a, b], i) => (
        <Crease key={`l${i}`} from={a} to={b} width={2.6} delay={0.2 + i * 0.1} />
      ))}
      {fold.arrows.map((arrow, i) => (
        <FoldArrow key={`a${i}`} from={arrow.from} to={arrow.to} bend={arrow.bend} width={3} delay={0.5 + i * 0.12} />
      ))}
      {fold.turnOver ? <TurnOverMark /> : null}
    </g>
  );
}

/** The translucent flap that shows the fold happening, on repeat. */
function GhostFlap({ ghost }: { ghost: Ghost }) {
  return (
    <motion.path
      d={toPath(ghost.from)}
      fill="var(--color-accent)"
      fillOpacity={0.22}
      stroke="var(--color-accent)"
      strokeWidth={1.5}
      animate={{ d: [toPath(ghost.from), toPath(ghost.to), toPath(ghost.to), toPath(ghost.from)] }}
      transition={{ duration: 2.6, times: [0, 0.45, 0.75, 1], repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
    />
  );
}

/** A circular arrow meaning "turn the paper over". */
function TurnOverMark() {
  return (
    <g transform="translate(206 12)">
      <path d="M-14 4 A14 14 0 1 1 6 13" fill="none" stroke="var(--color-accent)" strokeWidth={3} strokeLinecap="round" />
      <path d="M1 7 L9 15 L-1 18 Z" fill="var(--color-accent)" />
    </g>
  );
}
