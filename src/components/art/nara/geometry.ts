import { ellipse, heart, mirrorX, type Pt } from "@/lib/shapes";

/**
 * Nara's geometry, measured from the team's animation of the character (frame
 * coordinates, 918 by 926, figure centered on x = 460). Flat colors, no shading:
 * a rounded head, leaf ears, two-pronged antlers with the tine pointing inward,
 * tall white eyes with solid pupils, a wide nose, arms folded at the chest,
 * a cream belly, square hooves and a two-tone tail.
 *
 * Every pose reuses the same parts. A pose only changes the arms, the eyes,
 * the mouth, a held object, an effect and how the head sits.
 */

export const AXIS = 460;
/** The full figure, with room for effects on both sides. */
export const BODY_VIEWBOX = { x: 150, y: 20, w: 620, h: 900 };
/** The head alone, as on the outline sheet. */
export const HEAD_VIEWBOX = { x: 196, y: 50, w: 528, h: 450 };

export type Pose = "smile" | "wave" | "talk" | "present" | "think" | "love" | "laugh" | "cheer" | "bow";
export type ShapeKind = "roundedSquare" | "circle" | "roundedTriangle" | "semicircle";
export type Tone = "deer" | "cream" | "antler" | "dark" | "white" | "mouth" | "tongue" | "line" | "card" | "cardShade" | "heart";
export type Layer = "back" | "body" | "head" | "front";
export type Effect = "sparkleLeft" | "sparkleRight" | "question" | "hearts" | "burst" | "motionLines";
export type Eyes = "open" | "happy" | "calm";
export type Mouth = "open" | "laugh" | "smile" | "o" | "none";

export type Part = {
  id: string;
  kind: ShapeKind;
  layer: Layer;
  d: string;
  tone: Tone;
  /** Stroke width for antlers, raised arms and kicked legs, drawn as round-capped strokes. */
  stroke?: number;
  /** Arms get the faint darker outline they have in the animation. */
  outline?: boolean;
  /** Parts that close when Nara blinks. */
  eye?: boolean;
};

type ArmStyle = "folded" | "raised" | "out" | "wave" | "chin" | "clasped" | "holding";

export type PoseSpec = {
  left: ArmStyle;
  right: ArmStyle;
  kick: boolean;
  eyes: Eyes;
  gaze: Pt;
  mouth: Mouth;
  held?: "card" | "heart";
  effect?: Effect;
  /** How far the head drops and how much it tips forward (bow). */
  headDrop: number;
  headTilt: number;
  loop: "breathe" | "bounce" | "hop" | "bow" | "sway" | "nod" | "wave";
};

const base = { kick: false, gaze: [0, 0] as Pt, headDrop: 0, headTilt: 0, loop: "breathe" as const, mouth: "open" as const };

export const poses: Record<Pose, PoseSpec> = {
  smile: { ...base, left: "folded", right: "folded", eyes: "open", mouth: "smile" },
  wave: { ...base, left: "folded", right: "wave", eyes: "open", loop: "wave" },
  talk: { ...base, left: "folded", right: "folded", eyes: "open", effect: "sparkleLeft", loop: "nod" },
  present: { ...base, left: "holding", right: "holding", eyes: "open", gaze: [12, 2], held: "card" },
  think: { ...base, left: "folded", right: "chin", eyes: "open", gaze: [10, -14], mouth: "o", effect: "question", headTilt: -4, loop: "sway" },
  love: { ...base, left: "holding", right: "holding", eyes: "happy", mouth: "smile", held: "heart", effect: "hearts" },
  laugh: { ...base, left: "folded", right: "folded", eyes: "happy", mouth: "laugh", effect: "sparkleRight", loop: "hop" },
  cheer: { ...base, left: "out", right: "raised", kick: true, eyes: "happy", mouth: "laugh", effect: "burst", loop: "bounce" },
  bow: { ...base, left: "clasped", right: "clasped", eyes: "calm", mouth: "none", effect: "motionLines", headDrop: 150, loop: "bow" },
};

/* ---------- Anatomy, in frame coordinates ---------- */

export const HEAD = "M430 212 H490 A118 118 0 0 1 608 330 V359 A127 127 0 0 1 481 486 H439 A127 127 0 0 1 312 359 V330 A118 118 0 0 1 430 212 Z";
const BODY = "M384 462 C366 520 350 560 350 640 C350 700 356 742 384 762 L536 762 C564 742 570 700 570 640 C570 560 554 520 536 462 Z";
const BELLY = "M420 494 Q460 486 500 494 C512 560 520 610 520 660 C520 712 494 744 460 744 C426 744 400 712 400 660 C400 610 408 560 420 494 Z";
// The folded arm is the bulge at the chest; its inner edge hides under the belly.
const FOLDED_ARM = "M392 470 C360 488 328 528 328 578 C328 610 336 630 356 636 C376 641 400 637 422 628 L432 520 C430 494 412 476 392 470 Z";
const ELBOW_CREASE = "M387 554 Q377 572 385 590";
const TAIL = "M362 648 C330 645 290 650 277 664 C284 682 322 692 360 692 Z";
const TAIL_UNDER = "M360 692 C322 694 286 698 280 706 C288 724 330 734 362 718 Z";
export const EAR_CENTER: Pt = [290, 236];
const EAR_ANGLE = 33;
const ANTLER_BEAM = "M410 228 C404 196 388 168 372 140 C362 124 352 108 352 90";
const ANTLER_TINE = "M384 152 C394 142 406 134 416 126";
export const EYE_CENTERS: Pt[] = [
  [397.5, 349],
  [523.5, 349],
];

/** An exact ellipse tilted by `angle` degrees, drawn with two arcs. */
function rotatedEllipse(cx: number, cy: number, rx: number, ry: number, angle: number): string {
  const a = (angle * Math.PI) / 180;
  const dx = Math.round(rx * Math.cos(a) * 10) / 10;
  const dy = Math.round(rx * Math.sin(a) * 10) / 10;
  return `M${cx - dx} ${cy - dy} A${rx} ${ry} ${angle} 1 0 ${cx + dx} ${cy + dy} A${rx} ${ry} ${angle} 1 0 ${cx - dx} ${cy - dy} Z`;
}

// Ears are leaf-shaped tilted ovals; the right ear mirrors the left across the axis.
const earShape = (side: 1 | -1, cx: number, cy: number, rx: number, ry: number) =>
  rotatedEllipse(side < 0 ? cx : AXIS * 2 - cx, cy, rx, ry, side * -EAR_ANGLE);
export const EAR = earShape(-1, 290, 236, 79, 53);
export const EAR_INNER = earShape(-1, 294, 236, 63, 32);
const EAR_RIGHT = earShape(1, 290, 236, 79, 53);
const EAR_INNER_RIGHT = earShape(1, 294, 236, 63, 32);

function earParts(): Part[] {
  return [
    { id: "ear-l", kind: "roundedTriangle", layer: "head", d: EAR, tone: "deer" },
    { id: "ear-r", kind: "roundedTriangle", layer: "head", d: EAR_RIGHT, tone: "deer" },
    { id: "ear-in-l", kind: "roundedTriangle", layer: "head", d: EAR_INNER, tone: "cream" },
    { id: "ear-in-r", kind: "roundedTriangle", layer: "head", d: EAR_INNER_RIGHT, tone: "cream" },
  ];
}

function antlerParts(): Part[] {
  return [
    { id: "antler-beam-l", kind: "roundedSquare", layer: "head", d: ANTLER_BEAM, tone: "antler", stroke: 43 },
    { id: "antler-tine-l", kind: "roundedSquare", layer: "head", d: ANTLER_TINE, tone: "antler", stroke: 34 },
    { id: "antler-beam-r", kind: "roundedSquare", layer: "head", d: mirrorX(ANTLER_BEAM, AXIS), tone: "antler", stroke: 43 },
    { id: "antler-tine-r", kind: "roundedSquare", layer: "head", d: mirrorX(ANTLER_TINE, AXIS), tone: "antler", stroke: 34 },
  ];
}

const rect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

function legParts(kick: boolean): Part[] {
  const right: Part[] = [
    { id: "leg-r", kind: "roundedSquare", layer: "back", d: rect(478, 730, 61, 140, 6), tone: "deer" },
    { id: "hoof-r", kind: "roundedSquare", layer: "back", d: rect(482, 855, 54, 38, 4), tone: "dark" },
  ];
  if (!kick) {
    return [
      { id: "leg-l", kind: "roundedSquare", layer: "back", d: rect(382, 730, 61, 140, 6), tone: "deer" },
      { id: "hoof-l", kind: "roundedSquare", layer: "back", d: rect(386, 855, 54, 38, 4), tone: "dark" },
      ...right,
    ];
  }
  return [
    { id: "leg-l", kind: "roundedSquare", layer: "back", d: "M412 744 C412 792 396 818 352 818", tone: "deer", stroke: 58 },
    { id: "hoof-l", kind: "roundedSquare", layer: "back", d: "M338 817 L320 815", tone: "dark", stroke: 50 },
    ...right,
  ];
}

const tailParts: Part[] = [
  { id: "tail", kind: "roundedTriangle", layer: "back", d: TAIL, tone: "deer" },
  { id: "tail-under", kind: "roundedTriangle", layer: "back", d: TAIL_UNDER, tone: "cream" },
];
const bodyPart: Part = { id: "body", kind: "roundedSquare", layer: "body", d: BODY, tone: "deer" };
const bellyParts: Part[] = [
  { id: "belly", kind: "circle", layer: "body", d: BELLY, tone: "cream" },
  { id: "spot", kind: "circle", layer: "body", d: ellipse(363.5, 680, 6.5, 13), tone: "cream" },
];

function heldParts(held: PoseSpec["held"]): Part[] {
  if (held === "card") {
    return [
      { id: "card-edge", kind: "roundedSquare", layer: "body", d: rect(386, 526, 148, 128, 14), tone: "cardShade" },
      { id: "card", kind: "roundedSquare", layer: "body", d: rect(386, 518, 148, 126, 14), tone: "card" },
    ];
  }
  if (held === "heart") return [{ id: "heart", kind: "circle", layer: "body", d: heart(460, 576, 84), tone: "heart" }];
  return [];
}

/**
 * How an arm is drawn. `over` arms cross in front of the belly (bow, chin);
 * the rest sit under it so only their outer edge shows, as in the animation.
 */
type ArmDraw = { d: string; hand: Pt; stroke?: number; layer?: Layer; over?: boolean; crease?: boolean };

// Left-side arms; the right side mirrors them.
const armShapes: Record<ArmStyle, ArmDraw> = {
  folded: { d: FOLDED_ARM, hand: [416, 600], crease: true },
  holding: { d: FOLDED_ARM, hand: [398, 610], crease: true },
  raised: { d: "M382 506 C330 492 280 456 252 404", hand: [244, 390], stroke: 52 },
  out: { d: "M382 512 C340 524 302 548 280 580", hand: [272, 592], stroke: 52 },
  wave: { d: "M382 506 C324 500 270 470 240 420", hand: [232, 404], stroke: 52 },
  chin: { d: "M384 506 C350 540 340 592 364 608 C390 622 412 560 420 504", hand: [420, 492], stroke: 50, layer: "front" },
  clasped: { d: "M384 492 C352 540 360 640 424 704", hand: [440, 716], stroke: 52, over: true },
};

const sides = ["left", "right"] as const;
type Side = (typeof sides)[number];
const flipFor = (side: Side) => (d: string) => (side === "right" ? mirrorX(d, AXIS) : d);

function armPart(spec: PoseSpec, side: Side): Part {
  const shape = armShapes[spec[side]];
  const d = flipFor(side)(shape.d);
  const layer = shape.layer ?? "body";
  return shape.stroke
    ? { id: `arm-${side}`, kind: "roundedSquare", layer, d, tone: "deer", stroke: shape.stroke, outline: true }
    : { id: `arm-${side}`, kind: "roundedSquare", layer, d, tone: "deer", outline: true };
}

function handParts(spec: PoseSpec, side: Side): Part[] {
  const shape = armShapes[spec[side]];
  const layer = shape.layer ?? "body";
  const hx = side === "right" ? AXIS * 2 - shape.hand[0] : shape.hand[0];
  const crease: Part[] = shape.crease
    ? [{ id: `crease-${side}`, kind: "semicircle", layer, d: flipFor(side)(ELBOW_CREASE), tone: "line", stroke: 3 }]
    : [];
  return [...crease, { id: `hand-${side}`, kind: "circle", layer, d: ellipse(hx, shape.hand[1], 27.5, 34.5), tone: "dark" }];
}

const armsUnder = (spec: PoseSpec) => sides.filter((side) => !armShapes[spec[side]].over).map((side) => armPart(spec, side));
const armsOver = (spec: PoseSpec) => sides.filter((side) => armShapes[spec[side]].over).map((side) => armPart(spec, side));
const hands = (spec: PoseSpec) => sides.flatMap((side) => handParts(spec, side));

function eyeParts(eyes: Eyes, gaze: Pt): Part[] {
  if (eyes === "happy") {
    return EYE_CENTERS.map(([cx, cy], i) => ({
      id: `eye-${i}`, kind: "semicircle" as const, layer: "head" as const,
      d: `M${cx - 27} ${cy + 14} Q${cx} ${cy - 22} ${cx + 27} ${cy + 14}`, tone: "dark" as const, stroke: 9,
    }));
  }
  if (eyes === "calm") {
    return EYE_CENTERS.map(([cx, cy], i) => ({
      id: `eye-${i}`, kind: "semicircle" as const, layer: "head" as const,
      d: `M${cx - 29} ${cy - 2} Q${cx} ${cy + 26} ${cx + 29} ${cy - 2}`, tone: "dark" as const, stroke: 9,
    }));
  }
  return EYE_CENTERS.flatMap(([cx, cy], i) => {
    const inward = i === 0 ? 13 : -13;
    return [
      { id: `eye-white-${i}`, kind: "roundedSquare" as const, layer: "head" as const, d: ellipse(cx, cy, 36.5, 49), tone: "white" as const, eye: true },
      { id: `pupil-${i}`, kind: "circle" as const, layer: "head" as const, d: ellipse(cx + inward + gaze[0], cy + 2 + gaze[1], 17.5, 30), tone: "dark" as const, eye: true },
    ];
  });
}

const MOUTH_D = "M431 414 Q460 409 490 414 C490 444 476 459 460 459 C444 459 431 444 431 414 Z";
const TONGUE = "M446 451 C448 438 472 438 474 451 C470 459 450 459 446 451 Z";

const mouths: Record<Mouth, Part[]> = {
  open: [
    { id: "mouth", kind: "semicircle", layer: "head", d: MOUTH_D, tone: "mouth" },
    { id: "tongue", kind: "semicircle", layer: "head", d: TONGUE, tone: "tongue" },
  ],
  laugh: [
    { id: "mouth", kind: "semicircle", layer: "head", d: "M428 412 Q460 406 492 412 C492 450 478 466 460 466 C442 466 428 450 428 412 Z", tone: "mouth" },
    { id: "tongue", kind: "semicircle", layer: "head", d: "M444 456 C446 442 474 442 476 456 C471 465 449 465 444 456 Z", tone: "tongue" },
  ],
  smile: [{ id: "mouth", kind: "semicircle", layer: "head", d: "M436 420 Q460 444 484 420", tone: "dark", stroke: 9 }],
  o: [{ id: "mouth", kind: "circle", layer: "head", d: ellipse(474, 432, 12, 13), tone: "mouth" }],
  none: [],
};

/** Every part for a pose, in drawing order. */
export function partsFor(pose: Pose): Part[] {
  const spec = poses[pose];
  return [
    ...tailParts,
    ...legParts(spec.kick),
    bodyPart,
    ...armsUnder(spec),
    ...bellyParts,
    ...armsOver(spec),
    ...heldParts(spec.held),
    ...hands(spec),
    ...antlerParts(),
    ...earParts(),
    { id: "head", kind: "roundedSquare", layer: "head", d: HEAD, tone: "deer" },
    ...eyeParts(spec.eyes, spec.gaze),
    { id: "nose", kind: "circle", layer: "head", d: ellipse(460.5, 390.5, 27.5, 17.5), tone: "dark" },
    ...mouths[spec.mouth],
  ];
}

export function shapeCounts(pose: Pose): Record<ShapeKind, number> {
  return partsFor(pose).reduce<Record<ShapeKind, number>>(
    (counts, part) => ({ ...counts, [part.kind]: counts[part.kind] + 1 }),
    { roundedSquare: 0, circle: 0, roundedTriangle: 0, semicircle: 0 },
  );
}

/* ---------- The outline sheet: the head built from rounded capsules and ovals ---------- */

type Capsule = { from: Pt; to: Pt; r: number };

// Each antler as overlapping capsules, the way the construction sketch draws it.
const antlerCapsules: Capsule[] = [
  { from: [410, 228], to: [386, 160], r: 21 },
  { from: [386, 160], to: [358, 108], r: 21 },
  { from: [358, 108], to: [352, 88], r: 21 },
  { from: [388, 150], to: [416, 126], r: 17 },
];

export function capsulePath({ from, to, r }: Capsule): string {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / len) * r;
  const ny = ((x2 - x1) / len) * r;
  const f = (n: number) => Math.round(n * 10) / 10;
  return `M${f(x1 + nx)} ${f(y1 + ny)} L${f(x2 + nx)} ${f(y2 + ny)} A${r} ${r} 0 0 0 ${f(x2 - nx)} ${f(y2 - ny)} L${f(x1 - nx)} ${f(y1 - ny)} A${r} ${r} 0 0 0 ${f(x1 + nx)} ${f(y1 + ny)} Z`;
}

/** Outline paths for the head sketch, each labelled with the guide shape it comes from. */
export function sketchParts(): { id: string; kind: ShapeKind; d: string }[] {
  const capsules = antlerCapsules.flatMap((capsule, i) => [
    { id: `antler-l-${i}`, kind: "roundedSquare" as const, d: capsulePath(capsule) },
    {
      id: `antler-r-${i}`,
      kind: "roundedSquare" as const,
      d: capsulePath({ ...capsule, from: [AXIS * 2 - capsule.from[0], capsule.from[1]], to: [AXIS * 2 - capsule.to[0], capsule.to[1]] }),
    },
  ]);
  return [
    ...capsules,
    { id: "ear-l", kind: "roundedTriangle", d: EAR },
    { id: "ear-in-l", kind: "roundedTriangle", d: EAR_INNER },
    { id: "ear-r", kind: "roundedTriangle", d: EAR_RIGHT },
    { id: "ear-in-r", kind: "roundedTriangle", d: EAR_INNER_RIGHT },
    { id: "head", kind: "roundedSquare", d: HEAD },
    ...EYE_CENTERS.flatMap(([cx, cy], i) => [
      { id: `eye-${i}`, kind: "roundedSquare" as const, d: rect(cx - 36.5, cy - 49, 73, 98, 34) },
      { id: `pupil-${i}`, kind: "roundedSquare" as const, d: rect(cx + (i === 0 ? 13 : -13) - 17.5, cy - 28, 35, 60, 16) },
    ]),
    { id: "nose", kind: "circle", d: ellipse(460.5, 390.5, 27.5, 17.5) },
    { id: "mouth", kind: "semicircle", d: MOUTH_D },
    { id: "tongue", kind: "semicircle", d: TONGUE },
  ];
}
