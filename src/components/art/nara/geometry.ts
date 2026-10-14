import { circle, ellipse, heart, mirrorX, roundedRect, type Pt } from "@/lib/shapes";

/**
 * Nara's geometry, following the team's character sheet: a sika deer standing
 * upright with a big rounded head, sideways leaf ears, two-tine antlers, tall
 * oval eyes, a cream belly and dark hooves. Every pose reuses the same parts;
 * a pose only changes arms, legs, eyes, mouth, a held object and an effect.
 * The canvas is 400 by 600 and the figure is symmetric around x = 200.
 */

export const NARA_VIEWBOX = "0 0 400 600";
const AXIS = 200;

export type Pose = "smile" | "talk" | "present" | "think" | "love" | "laugh" | "cheer" | "bow";
export type ShapeKind = "roundedSquare" | "circle" | "roundedTriangle" | "semicircle";
export type Tone =
  | "deer"
  | "cream"
  | "ear"
  | "antler"
  | "hoof"
  | "eye"
  | "white"
  | "mouth"
  | "tongue"
  | "card"
  | "cardShade"
  | "heart";
export type Layer = "body" | "head" | "front";
export type Effect = "sparkleLeft" | "sparkleRight" | "question" | "hearts" | "burst" | "motionLines";

export type Part = {
  id: string;
  kind: ShapeKind;
  layer: Layer;
  d: string;
  tone: Tone;
  /** Stroke width for limbs and antlers, which are drawn as round-capped strokes. */
  stroke?: number;
  /** Fill parts that get a darker crescent on their lower right edge. */
  shade?: boolean;
  /** Parts that close together when Nara blinks. */
  eye?: boolean;
  /** Limbs get a darker edge so they read against the body. */
  edge?: boolean;
  transform?: string;
};

type Arm = { d: string; hand: Pt; layer?: Layer };
type Eyes = "open" | "happy" | "calm";
type Mouth = "open" | "laugh" | "smile" | "o";
type Held = "card" | "heart";

export type PoseSpec = {
  left: Arm;
  right: Arm;
  kick: boolean;
  eyes: Eyes;
  gaze: Pt;
  mouth: Mouth;
  held?: Held;
  effect?: Effect;
  headOffset: Pt;
  headTilt: number;
  /** Whole-figure loop: a bounce, a bow or a gentle sway. */
  loop: "none" | "bounce" | "bow" | "sway" | "nod";
};

const mirrorArm = (arm: Arm): Arm => ({ ...arm, d: mirrorX(arm.d, AXIS), hand: [AXIS * 2 - arm.hand[0], arm.hand[1]] });

const chest: Arm = { d: "M160 336 C150 364 160 394 182 400", hand: [184, 400] };
const holdCard: Arm = { d: "M160 336 C144 360 144 392 156 404", hand: [158, 404] };
const holdHeart: Arm = { d: "M160 336 C148 362 152 396 172 410", hand: [174, 410] };
const acrossBelly: Arm = { d: "M160 336 C150 372 172 404 196 410", hand: [196, 410] };
const toChin: Arm = { d: "M242 338 C272 332 266 298 238 290", hand: [234, 288], layer: "front" };
const raised: Arm = { d: "M160 336 C132 322 108 300 100 274", hand: [98, 270] };
const clasped: Arm = { d: "M160 336 C152 382 172 428 192 438", hand: [193, 438] };

const base = { kick: false, gaze: [0, 5] as Pt, headOffset: [0, 0] as Pt, headTilt: 0, loop: "none" as const };

export const poses: Record<Pose, PoseSpec> = {
  smile: { ...base, left: chest, right: mirrorArm(chest), eyes: "open", mouth: "smile" },
  talk: { ...base, left: chest, right: mirrorArm(chest), eyes: "open", mouth: "open", effect: "sparkleLeft", loop: "nod" },
  present: { ...base, left: holdCard, right: mirrorArm(holdCard), eyes: "open", gaze: [9, 2], mouth: "open", held: "card" },
  think: {
    ...base,
    left: acrossBelly,
    right: toChin,
    eyes: "open",
    gaze: [8, -10],
    mouth: "o",
    effect: "question",
    headTilt: -5,
    loop: "sway",
  },
  love: { ...base, left: holdHeart, right: mirrorArm(holdHeart), eyes: "happy", mouth: "smile", held: "heart", effect: "hearts" },
  laugh: { ...base, left: chest, right: mirrorArm(chest), eyes: "happy", mouth: "laugh", effect: "sparkleRight", loop: "nod" },
  cheer: { ...base, left: raised, right: mirrorArm(raised), kick: true, eyes: "happy", mouth: "laugh", effect: "burst", loop: "bounce" },
  bow: {
    ...base,
    left: clasped,
    right: mirrorArm(clasped),
    eyes: "calm",
    mouth: "smile",
    effect: "motionLines",
    headOffset: [0, 22],
    loop: "bow",
  },
};

/* ---------- Fixed anatomy ---------- */

const HEAD = "M200 118 C266 118 298 150 298 204 C298 258 262 290 200 290 C138 290 102 258 102 204 C102 150 134 118 200 118 Z";
const BODY = "M200 300 C246 300 266 338 270 380 C276 430 262 470 200 474 C138 470 124 430 130 380 C134 338 154 300 200 300 Z";
const BELLY = "M200 322 C224 322 238 352 240 392 C242 434 226 462 200 462 C174 462 158 434 160 392 C162 352 176 322 200 322 Z";
const EAR = "M134 170 C112 124 56 106 16 120 C26 170 88 206 138 198 Z";
const EAR_INNER = "M124 174 C104 140 66 128 38 134 C50 166 92 190 126 188 Z";
const TAIL = "M138 438 C116 430 100 444 104 464 C120 470 136 462 142 450 Z";
const ANTLER = [
  "M170 128 C158 102 142 86 138 48",
  "M150 94 C160 80 164 66 162 48",
  "M142 74 C130 70 122 62 116 50",
];
const EYE_CENTERS: Pt[] = [
  [166, 200],
  [234, 200],
];

function antlerParts(): Part[] {
  return ANTLER.flatMap((d, i) => [
    { id: `antler-l${i}`, kind: "roundedSquare" as const, layer: "head" as const, d, tone: "antler" as const, stroke: 17 },
    { id: `antler-r${i}`, kind: "roundedSquare" as const, layer: "head" as const, d: mirrorX(d, AXIS), tone: "antler" as const, stroke: 17 },
  ]);
}

function earParts(): Part[] {
  return [
    { id: "ear-l", kind: "roundedTriangle", layer: "head", d: EAR, tone: "deer" },
    { id: "ear-r", kind: "roundedTriangle", layer: "head", d: mirrorX(EAR, AXIS), tone: "deer" },
    { id: "ear-in-l", kind: "roundedTriangle", layer: "head", d: EAR_INNER, tone: "ear" },
    { id: "ear-in-r", kind: "roundedTriangle", layer: "head", d: mirrorX(EAR_INNER, AXIS), tone: "ear" },
  ];
}

function legParts(kick: boolean): Part[] {
  const right: Part[] = [
    { id: "leg-r", kind: "roundedSquare", layer: "body", d: "M220 450 L220 556", tone: "deer", stroke: 25, edge: true },
    { id: "hoof-r", kind: "roundedSquare", layer: "body", d: roundedRect(205, 554, 30, 24, 10), tone: "hoof" },
  ];
  if (kick) {
    return [
      { id: "leg-l", kind: "roundedSquare", layer: "body", d: "M182 452 C178 488 160 506 138 508", tone: "deer", stroke: 25, edge: true },
      { id: "hoof-l", kind: "roundedSquare", layer: "body", d: roundedRect(112, 497, 26, 24, 10), tone: "hoof" },
      ...right,
    ];
  }
  return [
    { id: "leg-l", kind: "roundedSquare", layer: "body", d: "M180 450 L180 556", tone: "deer", stroke: 25, edge: true },
    { id: "hoof-l", kind: "roundedSquare", layer: "body", d: roundedRect(165, 554, 30, 24, 10), tone: "hoof" },
    ...right,
  ];
}

function torsoParts(): Part[] {
  return [
    { id: "tail", kind: "roundedTriangle", layer: "body", d: TAIL, tone: "cream" },
    { id: "body", kind: "roundedSquare", layer: "body", d: BODY, tone: "deer", shade: true },
    { id: "belly", kind: "circle", layer: "body", d: BELLY, tone: "cream" },
    { id: "spot-1", kind: "circle", layer: "body", d: circle(148, 428, 7), tone: "cream" },
    { id: "spot-2", kind: "circle", layer: "body", d: circle(141, 449, 5), tone: "cream" },
    { id: "spot-3", kind: "circle", layer: "body", d: circle(158, 452, 5), tone: "cream" },
    { id: "spot-4", kind: "circle", layer: "body", d: circle(253, 430, 6), tone: "cream" },
  ];
}

function heldParts(held: Held | undefined): Part[] {
  if (held === "card") {
    return [
      { id: "card-edge", kind: "roundedSquare", layer: "body", d: roundedRect(154, 360, 92, 76, 12), tone: "cardShade" },
      { id: "card", kind: "roundedSquare", layer: "body", d: roundedRect(154, 356, 92, 72, 12), tone: "card" },
    ];
  }
  if (held === "heart") return [{ id: "heart", kind: "circle", layer: "body", d: heart(200, 396, 40), tone: "heart" }];
  return [];
}

function armParts(spec: PoseSpec): Part[] {
  return (["left", "right"] as const).flatMap((side) => {
    const arm = spec[side];
    const layer = arm.layer ?? "body";
    return [
      { id: `arm-${side}`, kind: "roundedSquare" as const, layer, d: arm.d, tone: "deer" as const, stroke: 26, edge: true },
      { id: `hand-${side}`, kind: "circle" as const, layer, d: circle(arm.hand[0], arm.hand[1], 15), tone: "hoof" as const },
    ];
  });
}

function eyeParts(eyes: Eyes, gaze: Pt): Part[] {
  if (eyes === "happy") {
    return EYE_CENTERS.map(([cx, cy], i) => ({
      id: `eye-${i}`, kind: "semicircle" as const, layer: "head" as const,
      d: `M${cx - 19} ${cy + 8} Q${cx} ${cy - 18} ${cx + 19} ${cy + 8}`, tone: "eye" as const, stroke: 8,
    }));
  }
  if (eyes === "calm") {
    return EYE_CENTERS.map(([cx, cy], i) => ({
      id: `eye-${i}`, kind: "semicircle" as const, layer: "head" as const,
      d: `M${cx - 19} ${cy + 4} Q${cx} ${cy + 20} ${cx + 19} ${cy + 4}`, tone: "eye" as const, stroke: 8,
    }));
  }
  return EYE_CENTERS.flatMap(([cx, cy], i) => {
    const px = cx + gaze[0];
    const py = cy + gaze[1];
    return [
      { id: `eye-white-${i}`, kind: "roundedSquare" as const, layer: "head" as const, d: roundedRect(cx - 25, cy - 32, 50, 64, 25), tone: "white" as const, eye: true },
      { id: `pupil-${i}`, kind: "circle" as const, layer: "head" as const, d: ellipse(px, py, 16, 22), tone: "eye" as const, eye: true },
      { id: `shine-${i}`, kind: "circle" as const, layer: "head" as const, d: circle(px + 6, py - 10, 5.5), tone: "white" as const, eye: true },
    ];
  });
}

const mouths: Record<Mouth, Part[]> = {
  open: [
    { id: "mouth", kind: "semicircle", layer: "head", d: "M181 250 C187 276 213 276 219 250 Z", tone: "mouth" },
    { id: "tongue", kind: "semicircle", layer: "head", d: "M189 264 Q200 257 211 264 Q207 271 200 271 Q193 271 189 264 Z", tone: "tongue" },
  ],
  laugh: [
    { id: "mouth", kind: "semicircle", layer: "head", d: "M176 248 C182 288 218 288 224 248 Z", tone: "mouth" },
    { id: "tongue", kind: "semicircle", layer: "head", d: "M186 270 Q200 260 214 270 Q209 281 200 281 Q191 281 186 270 Z", tone: "tongue" },
  ],
  smile: [{ id: "mouth", kind: "semicircle", layer: "head", d: "M185 252 Q200 266 215 252", tone: "mouth", stroke: 6 }],
  o: [{ id: "mouth", kind: "circle", layer: "head", d: ellipse(208, 258, 8, 7), tone: "mouth" }],
};

/** Every part for a pose, in drawing order. */
export function partsFor(pose: Pose): Part[] {
  const spec = poses[pose];
  return [
    ...legParts(spec.kick),
    ...torsoParts(),
    ...heldParts(spec.held),
    ...armParts(spec),
    ...antlerParts(),
    ...earParts(),
    { id: "head", kind: "roundedSquare", layer: "head", d: HEAD, tone: "deer", shade: true },
    ...eyeParts(spec.eyes, spec.gaze),
    { id: "nose", kind: "circle", layer: "head", d: ellipse(200, 236, 13, 9), tone: "hoof" },
    ...mouths[spec.mouth],
  ];
}

export function shapeCounts(pose: Pose): Record<ShapeKind, number> {
  return partsFor(pose).reduce<Record<ShapeKind, number>>(
    (counts, part) => ({ ...counts, [part.kind]: counts[part.kind] + 1 }),
    { roundedSquare: 0, circle: 0, roundedTriangle: 0, semicircle: 0 },
  );
}
