"use client";

import { motion } from "motion/react";
import { Crease, FoldArrow } from "@/components/deck/primitives";
import { duration, ease } from "@/lib/motion";
import type { Pt } from "@/lib/shapes";
import type { Guidance } from "@/content/content";

/**
 * The visitor's printed sheet at every stage of the origami Mt. Fuji, from the
 * team's fold sheet. State 0 is the printed square (white sky, blue mountain with a
 * jagged snowline and dashed guide lines, measured from the photo); state 3 is the
 * standing mountain after three folds.
 * A `guide` overlays the projector's marks for the next fold.
 */

type Tone = "paper" | "sky" | "snow" | "lit" | "shade" | "flap";
type Face = { pts: Pt[]; tone: Tone };
type Segment = readonly [Pt, Pt];
type PaperState = { faces: Face[]; creases?: Segment[] };
type Ghost = { from: Pt[]; to: Pt[] };
type FoldGuide = {
  lines: Segment[];
  arrows: { from: Pt; to: Pt; bend: number }[];
  ghost?: Ghost;
  turn?: boolean;
};

const square: Pt[] = [[30, 30], [210, 30], [210, 210], [30, 210]];
// The printed mountain, traced from the photo of the sheet (side 180, starting at 30).
const mountain: Pt[] = [
  [30, 125.6], [64.2, 93.9], [70.9, 111.9], [92.1, 93.9], [120, 120],
  [147.9, 93.9], [169.1, 111.9], [175.8, 93.9], [210, 125.6], [210, 210], [30, 210],
];
const diagonalA: Segment = [[30, 30], [210, 210]];
const diagonalB: Segment = [[210, 30], [30, 210]];

// The folded triangle: long edge at the bottom, the white corner on top as snow.
const APEX: Pt = [120, 92];
const BASE_L: Pt = [30, 182];
const BASE_R: Pt = [210, 182];
const BASE_C: Pt = [120, 182];
const snowRight: Pt[] = [APEX, [158, 130], [150, 123], [144, 132], [134, 122], [127, 130], [120, 121]];
const snowLeft: Pt[] = [[120, 121], [113, 130], [106, 122], [96, 132], [90, 123], [82, 130]];
const centerLine: Segment = [APEX, BASE_C];
const liftedFlap: Pt[] = [APEX, BASE_C, [72, 176]];

export const fujiStates: PaperState[] = [
  // The sheet comes printed with its dashed guide lines on both diagonals.
  { faces: [{ pts: square, tone: "sky" }, { pts: mountain, tone: "paper" }], creases: [diagonalA, diagonalB] },
  {
    faces: [
      { pts: [BASE_L, BASE_R, APEX], tone: "paper" },
      { pts: [...snowRight, ...snowLeft], tone: "snow" },
    ],
    creases: [centerLine],
  },
  {
    faces: [
      { pts: [APEX, BASE_C, BASE_R], tone: "shade" },
      { pts: snowRight, tone: "snow" },
      { pts: liftedFlap, tone: "flap" },
    ],
  },
  {
    faces: [
      { pts: [BASE_L, BASE_C, APEX], tone: "lit" },
      { pts: [APEX, BASE_C, BASE_R], tone: "shade" },
      { pts: [...snowRight, ...snowLeft], tone: "snow" },
    ],
    creases: [centerLine],
  },
];

// guides[n] shows fold n, drawn on top of state n - 1.
const guides: Record<number, FoldGuide> = {
  1: {
    lines: [diagonalA],
    arrows: [{ from: [40, 200], to: [200, 40], bend: 0.3 }],
    ghost: { from: [[30, 30], [30, 210], [210, 210]], to: [[30, 30], [210, 30], [210, 210]] },
    turn: true,
  },
  2: {
    lines: [centerLine],
    arrows: [{ from: [38, 176], to: [202, 176], bend: -0.32 }],
    ghost: { from: [BASE_L, BASE_C, APEX], to: [BASE_R, BASE_C, APEX] },
  },
  // The flap lying over the right half swings back out to the left, so the mountain stands.
  3: {
    lines: [centerLine],
    arrows: [{ from: [168, 150], to: [56, 156], bend: 0.38 }],
    ghost: { from: [APEX, BASE_C, [196, 180]], to: [APEX, BASE_C, [40, 180]] },
  },
};

const toneFill: Record<Tone, string> = {
  paper: "var(--color-fuji-paper)",
  sky: "var(--color-fuji-sky)",
  snow: "var(--color-snow)",
  lit: "var(--color-fuji-lit)",
  shade: "var(--color-fuji-shade)",
  flap: "var(--color-fuji-light)",
};

const toPoints = (pts: Pt[]) => pts.map((p) => p.join(",")).join(" ");
const toPath = (pts: Pt[]) => `M${pts.map((p) => p.join(" ")).join(" L")} Z`;

/** The drawing's frame; `tight` crops to the folded mountain for big hero shots. */
const FULL_VIEWBOX = "0 0 240 240";
const TIGHT_VIEWBOX = "24 82 192 108";

export function FujiPaper({
  state,
  guide,
  guidance = "mark",
  tight = false,
  className,
  label,
}: {
  state: number;
  tight?: boolean;
  guide?: number | null;
  guidance?: Guidance;
  className?: string;
  label?: string;
}) {
  const paper = fujiStates[Math.max(0, Math.min(state, fujiStates.length - 1))];
  const fold = guide ? guides[guide] : undefined;
  return (
    <svg viewBox={tight ? TIGHT_VIEWBOX : FULL_VIEWBOX} className={className} role="img" aria-label={label ?? `Origami Mt. Fuji, after fold ${state} of 3`} overflow="visible">
      <g style={{ filter: "var(--shadow-drop-sheet)" }}>
        {paper.faces.map((face, i) => (
          <motion.polygon
            key={`${state}-${i}`}
            points={toPoints(face.pts)}
            fill={toneFill[face.tone]}
            stroke={face.tone === "sky" || face.tone === "snow" ? "var(--color-line-strong)" : "none"}
            strokeWidth={1}
            strokeLinejoin="round"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ originX: "120px", originY: "120px" }}
            transition={{ duration: duration.base, delay: i * 0.05, ease: ease.outSoft }}
          />
        ))}
      </g>
      {paper.creases?.map(([a, b], i) => (
        <line key={`c${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--color-ink-faint)" strokeWidth={1.2} strokeDasharray="4 4" />
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
      {fold.turn ? <TurnMark /> : null}
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

/** A circular arrow: turn the triangle so its long edge sits at the bottom. */
function TurnMark() {
  return (
    <g transform="translate(206 12)">
      <path d="M-14 4 A14 14 0 1 1 6 13" fill="none" stroke="var(--color-accent)" strokeWidth={3} strokeLinecap="round" />
      <path d="M1 7 L9 15 L-1 18 Z" fill="var(--color-accent)" />
    </g>
  );
}
