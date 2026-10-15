"use client";

import { motion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { Crease, FoldArrow } from "@/components/deck/primitives";
import { duration, ease } from "@/lib/motion";
import type { Pt } from "@/lib/shapes";

/**
 * The visitor's printed sheet at every stage of the origami Mt. Fuji, from the
 * team's fold sheet. State 0 is the printed square (white sky, blue mountain with a
 * jagged snowline and dashed guide lines, measured from the photo); state 3 is the
 * standing mountain after three folds.
 *
 * `FujiPaper` draws one state. `FoldPlayer` performs one fold: it starts from the
 * last fold's result, and once the fold is unlocked the projector draws its crease
 * and arrow, the flap folds over, and the paper settles into the new fold.
 */

type Tone = "paper" | "sky" | "snow" | "lit" | "shade" | "flap";
type Face = { pts: Pt[]; tone: Tone };
type Segment = readonly [Pt, Pt];
type PaperState = { faces: Face[]; creases?: Segment[] };

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
const leftHalf: Pt[] = [APEX, BASE_C, BASE_L];
const rightHalf: Pt[] = [APEX, BASE_C, BASE_R];

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
  // The left half lies folded over the right half.
  { faces: [{ pts: rightHalf, tone: "flap" }, { pts: snowRight, tone: "snow" }] },
  {
    faces: [
      { pts: leftHalf, tone: "lit" },
      { pts: rightHalf, tone: "shade" },
      { pts: [...snowRight, ...snowLeft], tone: "snow" },
    ],
    creases: [centerLine],
  },
];

/**
 * How each fold moves. `stay` is the part of the paper that holds still (clipped to
 * `clip`); the flap swings from `from` to `to`. Fold 1 then turns the triangle
 * upright so its long edge sits at the bottom.
 */
type FoldMove = {
  stay: Face[];
  clip: Pt[];
  from: Pt[];
  to: Pt[];
  tones: [Tone, Tone];
  upright?: boolean;
  lines: Segment[];
  arrows: { from: Pt; to: Pt; bend: number }[];
};

const moves: Record<number, FoldMove> = {
  1: {
    stay: fujiStates[0].faces,
    clip: [[30, 30], [210, 30], [210, 210]],
    from: [[30, 30], [30, 210], [210, 210]],
    to: [[30, 30], [210, 30], [210, 210]],
    tones: ["paper", "flap"],
    upright: true,
    lines: [diagonalA],
    arrows: [{ from: [40, 200], to: [200, 40], bend: 0.3 }],
  },
  2: {
    stay: fujiStates[1].faces,
    clip: rightHalf,
    from: leftHalf,
    to: [APEX, BASE_C, BASE_R],
    tones: ["paper", "flap"],
    lines: [centerLine],
    arrows: [{ from: [38, 176], to: [202, 176], bend: -0.32 }],
  },
  3: {
    stay: [{ pts: rightHalf, tone: "shade" }, { pts: snowRight, tone: "snow" }],
    clip: rightHalf,
    from: rightHalf,
    to: leftHalf,
    tones: ["flap", "lit"],
    lines: [centerLine],
    arrows: [{ from: [168, 150], to: [56, 156], bend: 0.38 }],
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
const clampState = (state: number) => Math.max(0, Math.min(state, fujiStates.length - 1));
const edgeFor = (tone: Tone) => (tone === "sky" || tone === "snow" ? "var(--color-line-strong)" : "none");

/** The drawing's frame; `tight` crops to the folded mountain for big hero shots. */
const FULL_VIEWBOX = "0 0 240 240";
const TIGHT_VIEWBOX = "24 82 192 108";

/** One state of the paper. `appear` pops the faces in; without it they're simply there. */
function Faces({ faces, creases, appear }: { faces: Face[]; creases?: Segment[]; appear: boolean }) {
  return (
    <>
      <g style={{ filter: "var(--shadow-drop-sheet)" }}>
        {faces.map((face, i) => (
          <motion.polygon
            key={i}
            points={toPoints(face.pts)}
            fill={toneFill[face.tone]}
            stroke={edgeFor(face.tone)}
            strokeWidth={1}
            strokeLinejoin="round"
            initial={appear ? { opacity: 0, scale: 0.96 } : false}
            animate={{ opacity: 1, scale: 1 }}
            style={{ originX: "120px", originY: "120px" }}
            transition={{ duration: duration.base, delay: i * 0.05, ease: ease.outSoft }}
          />
        ))}
      </g>
      {creases?.map(([a, b], i) => (
        <line key={`c${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--color-ink-faint)" strokeWidth={1.2} strokeDasharray="4 4" />
      ))}
    </>
  );
}

export function FujiPaper({
  state,
  tight = false,
  appear = true,
  className,
  label,
}: {
  state: number;
  tight?: boolean;
  appear?: boolean;
  className?: string;
  label?: string;
}) {
  const paper = fujiStates[clampState(state)];
  return (
    <svg viewBox={tight ? TIGHT_VIEWBOX : FULL_VIEWBOX} className={className} role="img" aria-label={label ?? `Origami Mt. Fuji, after fold ${state} of 3`} overflow="visible">
      <Faces faces={paper.faces} creases={paper.creases} appear={appear} />
    </svg>
  );
}

/* ---------- Performing a fold ---------- */

type Phase = "ready" | "marks" | "fold" | "upright" | "done";

// Seconds into the fold when each phase starts. The projector draws first, then the flap moves.
const FOLD_AT = 0.9;
const FOLD_LENGTH = 1.1;
const UPRIGHT_LENGTH = 0.7;

function phaseTimes(upright: boolean): [Phase, number][] {
  const folded = FOLD_AT + FOLD_LENGTH;
  if (!upright) return [["fold", FOLD_AT], ["done", folded]];
  return [["fold", FOLD_AT], ["upright", folded], ["done", folded + UPRIGHT_LENGTH]];
}

/** Walks the fold through its phases once `play` turns on. `instant` jumps to the end (print). */
function useFoldPhase(play: boolean, instant: boolean, upright: boolean): Phase {
  const [timed, setTimed] = useState<Phase | null>(null);
  useEffect(() => {
    if (!play || instant) return;
    const timers = phaseTimes(upright).map(([phase, at]) => window.setTimeout(() => setTimed(phase), at * 1000));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [play, instant, upright]);
  if (!play) return "ready";
  if (instant) return "done";
  return timed ?? "marks";
}

const reached = (phase: Phase, target: Phase) => {
  const order: Phase[] = ["ready", "marks", "fold", "upright", "done"];
  return order.indexOf(phase) >= order.indexOf(target);
};

export function FoldPlayer({
  fold,
  play,
  instant = false,
  className,
}: {
  /** The fold to perform, 1 to 3. The paper starts as fold `fold - 1` left it. */
  fold: number;
  play: boolean;
  instant?: boolean;
  className?: string;
}) {
  const move = moves[fold];
  const phase = useFoldPhase(play, instant, Boolean(move.upright));
  const done = phase === "done";
  const label = done ? `Origami Mt. Fuji, after fold ${fold} of 3` : `Origami Mt. Fuji, after fold ${fold - 1} of 3`;
  return (
    <svg viewBox={FULL_VIEWBOX} className={className} role="img" aria-label={label} overflow="visible">
      {reached(phase, "fold") ? <Folding move={move} phase={phase} /> : <Faces {...fujiStates[fold - 1]} appear={false} />}
      {done ? (
        <motion.g initial={instant ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: duration.quick }}>
          <Faces {...fujiStates[fold]} appear={false} />
        </motion.g>
      ) : null}
      {phase === "ready" ? null : <Marks move={move} show={phase === "marks" || phase === "fold"} />}
    </svg>
  );
}

/** The still part of the paper, with the flap swinging over it, then (fold 1) turning upright. */
function Folding({ move, phase }: { move: FoldMove; phase: Phase }) {
  const clipId = useId();
  const upright = phase === "upright" || (phase === "done" && Boolean(move.upright));
  return (
    <motion.g
      style={{ transformOrigin: "120px 120px", transformBox: "view-box" }}
      initial={false}
      animate={upright ? { rotate: -45, scale: Math.SQRT1_2, y: 62 } : { rotate: 0, scale: 1, y: 0 }}
      transition={{ duration: UPRIGHT_LENGTH, ease: ease.outSoft }}
    >
      <defs>
        <clipPath id={clipId}>
          <polygon points={toPoints(move.clip)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <Faces faces={move.stay} appear={false} />
      </g>
      <motion.path
        d={toPath(move.from)}
        fill={toneFill[move.tones[0]]}
        stroke="var(--color-fuji-shade)"
        strokeWidth={1}
        strokeLinejoin="round"
        initial={{ d: toPath(move.from), fill: toneFill[move.tones[0]] }}
        animate={{ d: toPath(move.to), fill: toneFill[move.tones[1]] }}
        transition={{ duration: FOLD_LENGTH, ease: ease.fold }}
      />
    </motion.g>
  );
}

/** The projector's crease and arrow for the fold, fading once the flap has landed. */
function Marks({ move, show }: { move: FoldMove; show: boolean }) {
  return (
    <motion.g className="projected" initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: duration.base }}>
      {move.lines.map(([a, b], i) => (
        <Crease key={`l${i}`} from={a} to={b} width={2.6} delay={0.1 + i * 0.1} />
      ))}
      {move.arrows.map((arrow, i) => (
        <FoldArrow key={`a${i}`} from={arrow.from} to={arrow.to} bend={arrow.bend} width={3} delay={0.35 + i * 0.12} />
      ))}
    </motion.g>
  );
}
