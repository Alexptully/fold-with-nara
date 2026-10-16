"use client";

import { animate, motion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { Crease, FoldArrow } from "@/components/deck/primitives";
import { duration, ease } from "@/lib/motion";
import type { Pt } from "@/lib/shapes";

/**
 * The visitor's printed sheet at every stage of the origami Mt. Fuji. State 0 is
 * the printed square from the team's paper sketch: a blue sheet with dashed guide
 * lines on both diagonals and a zigzag snowline across two opposite corners (top
 * right and bottom left). Fold 1 tucks the bottom-left half behind, so both snowy
 * corners stay outside and meet at the peak. State 3 is the standing mountain.
 *
 * `FujiPaper` draws one state. `FoldPlayer` performs one fold: it starts from the
 * last fold's result, and once the fold is unlocked the projector draws its crease
 * and arrow, the flap folds, and the paper settles into the new fold.
 */

type Tone = "paper" | "snow" | "lit" | "shade" | "flap";
type Face = { pts: Pt[]; tone: Tone };
type Segment = readonly [Pt, Pt];
type PaperState = { faces: Face[]; creases?: Segment[] };

const square: Pt[] = [[30, 30], [210, 30], [210, 210], [30, 210]];
const diagonalA: Segment = [[30, 30], [210, 210]];
const diagonalB: Segment = [[210, 30], [30, 210]];
const topRightHalf: Pt[] = [[30, 30], [210, 30], [210, 210]];
const bottomLeftHalf: Pt[] = [[30, 30], [30, 210], [210, 210]];

// The folded triangle: long edge at the bottom, the snowy corner on top as the peak.
const APEX: Pt = [120, 92];
const BASE_L: Pt = [30, 182];
const BASE_R: Pt = [210, 182];
const BASE_C: Pt = [120, 182];
// The zigzag snowline, drawn on the standing triangle and split down the middle for fold 2.
const snowRight: Pt[] = [APEX, [152, 124], [144, 131], [136, 116], [128, 131], [120, 116]];
const snowLeft: Pt[] = [[120, 116], [112, 131], [104, 116], [96, 131], [88, 124]];
const snowCap: Pt[] = [...snowRight, ...snowLeft];
const centerLine: Segment = [APEX, BASE_C];
const leftHalf: Pt[] = [APEX, BASE_C, BASE_L];
const rightHalf: Pt[] = [APEX, BASE_C, BASE_R];

/**
 * Where a point on the standing triangle sits on the flat sheet: undo fold 1's
 * turn upright (rotate 45 degrees, scale by the square root of 2, lift 62).
 * The peak lands on the sheet's top-right corner.
 */
const onSheet = ([x, y]: Pt): Pt => [120 + (x - 120) - (y - 182), 120 + (x - 120) + (y - 182)];
/** The bottom-left corner is the top-right one mirrored across the fold line. */
const mirrorAcrossFold = ([x, y]: Pt): Pt => [y, x];
const sheetSnowTopRight = snowCap.map(onSheet);
const sheetSnowBottomLeft = sheetSnowTopRight.map(mirrorAcrossFold);

export const fujiStates: PaperState[] = [
  {
    faces: [
      { pts: square, tone: "paper" },
      { pts: sheetSnowTopRight, tone: "snow" },
      { pts: sheetSnowBottomLeft, tone: "snow" },
    ],
    creases: [diagonalA, diagonalB],
  },
  {
    faces: [
      { pts: [BASE_L, BASE_R, APEX], tone: "paper" },
      { pts: snowCap, tone: "snow" },
    ],
    creases: [centerLine],
  },
  // The left half lies folded over the right half.
  { faces: [{ pts: rightHalf, tone: "flap" }, { pts: snowRight, tone: "snow" }] },
  {
    faces: [
      { pts: leftHalf, tone: "lit" },
      { pts: rightHalf, tone: "shade" },
      { pts: snowCap, tone: "snow" },
    ],
    creases: [centerLine],
  },
];

/**
 * How the flap moves. `over`: it swings across the front from `from` to `to`,
 * showing its other side. `behind`: it turns away around the fold line (the
 * sheet's diagonal) and tucks behind the part that stays, printed side out.
 */
type OverFlap = { kind: "over"; from: Pt[]; to: Pt[]; tones: [Tone, Tone] };
type BehindFlap = { kind: "behind"; faces: Face[]; clip: Pt[] };

/**
 * How each fold moves. `stay` is the part of the paper that holds still (clipped
 * to `clip`). Fold 1 then turns the triangle upright so its long edge sits at the bottom.
 */
type FoldMove = {
  stay: Face[];
  clip: Pt[];
  flap: OverFlap | BehindFlap;
  upright?: boolean;
  lines: Segment[];
  arrows: { from: Pt; to: Pt; bend: number }[];
};

const moves: Record<number, FoldMove> = {
  1: {
    stay: fujiStates[0].faces,
    clip: topRightHalf,
    flap: { kind: "behind", faces: fujiStates[0].faces, clip: bottomLeftHalf },
    upright: true,
    lines: [diagonalA],
    arrows: [{ from: [40, 200], to: [200, 40], bend: 0.3 }],
  },
  2: {
    stay: fujiStates[1].faces,
    clip: rightHalf,
    flap: { kind: "over", from: leftHalf, to: rightHalf, tones: ["paper", "flap"] },
    lines: [centerLine],
    arrows: [{ from: [38, 176], to: [202, 176], bend: -0.32 }],
  },
  3: {
    stay: [{ pts: rightHalf, tone: "shade" }, { pts: snowRight, tone: "snow" }],
    clip: rightHalf,
    flap: { kind: "over", from: rightHalf, to: leftHalf, tones: ["flap", "lit"] },
    lines: [centerLine],
    arrows: [{ from: [168, 150], to: [56, 156], bend: 0.38 }],
  },
};

const toneFill: Record<Tone, string> = {
  paper: "var(--color-fuji-paper)",
  snow: "var(--color-snow)",
  lit: "var(--color-fuji-lit)",
  shade: "var(--color-fuji-shade)",
  flap: "var(--color-fuji-light)",
};

const toPoints = (pts: Pt[]) => pts.map((p) => p.join(",")).join(" ");
const toPath = (pts: Pt[]) => `M${pts.map((p) => p.join(" ")).join(" L")} Z`;
const clampState = (state: number) => Math.max(0, Math.min(state, fujiStates.length - 1));
// White snow needs an outline to stand out from the white slide.
const edgeFor = (tone: Tone) => (tone === "snow" ? "var(--color-line-strong)" : "none");

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

/** The still part of the paper, with the flap folding over or behind it, then (fold 1) turning upright. */
function Folding({ move, phase }: { move: FoldMove; phase: Phase }) {
  const upright = phase === "upright" || (phase === "done" && Boolean(move.upright));
  const { flap } = move;
  return (
    <motion.g
      style={{ transformOrigin: "120px 120px", transformBox: "view-box" }}
      initial={false}
      animate={upright ? { rotate: -45, scale: Math.SQRT1_2, y: 62 } : { rotate: 0, scale: 1, y: 0 }}
      transition={{ duration: UPRIGHT_LENGTH, ease: ease.outSoft }}
    >
      {flap.kind === "behind" && phase === "fold" ? <FlapBehind flap={flap} /> : null}
      <Clipped faces={move.stay} clip={move.clip} />
      {flap.kind === "over" ? <FlapOver flap={flap} /> : null}
    </motion.g>
  );
}

function Clipped({ faces, clip }: { faces: Face[]; clip: Pt[] }) {
  const clipId = useId();
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <polygon points={toPoints(clip)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <Faces faces={faces} appear={false} />
      </g>
    </>
  );
}

/** The flap swings across the front and shows its other side. */
function FlapOver({ flap }: { flap: OverFlap }) {
  return (
    <motion.path
      d={toPath(flap.from)}
      fill={toneFill[flap.tones[0]]}
      stroke="var(--color-fuji-shade)"
      strokeWidth={1}
      strokeLinejoin="round"
      initial={{ d: toPath(flap.from), fill: toneFill[flap.tones[0]] }}
      animate={{ d: toPath(flap.to), fill: toneFill[flap.tones[1]] }}
      transition={{ duration: FOLD_LENGTH, ease: ease.fold }}
    />
  );
}

/**
 * The flap turns away around the sheet's diagonal (the line y = x) and slips
 * behind the half that stays. `turn` runs from 0 (flat) to 0.5 (edge-on): the
 * matrix squeezes the flap onto the fold line, and it darkens as it faces away.
 */
function FlapBehind({ flap }: { flap: BehindFlap }) {
  const [turn, setTurn] = useState(0);
  useEffect(() => {
    const controls = animate(0, 0.5, { duration: FOLD_LENGTH, ease: ease.fold, onUpdate: setTurn });
    return () => controls.stop();
  }, []);
  const keep = 1 - turn;
  return (
    <g transform={`matrix(${keep} ${turn} ${turn} ${keep} 0 0)`}>
      <Clipped faces={flap.faces} clip={flap.clip} />
      <polygon points={toPoints(flap.clip)} fill="var(--color-ink)" opacity={turn * 0.5} />
    </g>
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
