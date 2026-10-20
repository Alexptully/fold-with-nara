import { foldMarks, fujiStates } from "@/components/art/FujiPaper";
import { hull } from "@/lib/iso";
import type { Pt } from "@/lib/shapes";

/**
 * Where the projector draws, in FujiPaper's units: the printed square spans 30 to
 * 210, so once the white square is lined up with a real sheet, every line lands on
 * the paper at its real size.
 *
 * FujiPaper draws the folded triangle turned upright and shrunk by the square root
 * of 2, so it fits the slide. On the ledge it lies flat at full size, long edge
 * toward the visitor, centered in the frame.
 */

export const VIEWBOX = "-40 -40 320 320";
export const CENTER = 120;
export const SHEET = { min: 30, max: 210 };

// Halfway between the triangle's peak (y 92) and its long edge (y 182) in FujiPaper's drawing.
const TRIANGLE_MIDDLE_Y = 137;
const flatOnLedge = ([x, y]: Pt): Pt => [CENTER + Math.SQRT2 * (x - CENTER), CENTER + Math.SQRT2 * (y - TRIANGLE_MIDDLE_Y)];
/** The square (state 0) is drawn at full size already; every later state is the flattened triangle. */
const placeOnLedge = (state: number) => (point: Pt): Pt => (state === 0 ? point : flatOnLedge(point));

/** The paper's edge after `state` folds. */
export function paperOutline(state: number): Pt[] {
  const points = fujiStates[state].faces.flatMap((face) => face.pts);
  return hull(points).map(placeOnLedge(state));
}

export type FoldLight = {
  outline: Pt[];
  lines: [Pt, Pt][];
  arrows: { from: Pt; to: Pt; bend: number }[];
};

/** The crease and arrow for a fold, on the paper as the last fold left it. */
export function foldLight(fold: number): FoldLight {
  const marks = foldMarks(fold);
  const place = placeOnLedge(fold - 1);
  return {
    outline: paperOutline(fold - 1),
    lines: marks.lines.map(([a, b]) => [place(a), place(b)]),
    arrows: marks.arrows.map((arrow) => ({ from: place(arrow.from), to: place(arrow.to), bend: arrow.bend })),
  };
}

export const toPoints = (points: Pt[]) => points.map((point) => point.join(",")).join(" ");
