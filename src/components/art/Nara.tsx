"use client";

import { motion } from "motion/react";
import { duration, ease } from "@/lib/motion";
import { circle, roundedPolygon, roundedRect, semicircle, type Pt } from "@/lib/shapes";

/**
 * Nara the sika deer, drawn only from the four shapes in Duolingo's character
 * guide. Each part records which shape it is, so the "Meet Nara" slide can
 * highlight every rounded triangle at once.
 */

export type ShapeKind = "roundedSquare" | "circle" | "roundedTriangle" | "semicircle";
type Tone = "deer" | "deerDark" | "cream" | "spot" | "eye" | "white" | "blush" | "scarf" | "scarfBand";

type Part = { id: string; kind: ShapeKind; d: string; tone: Tone; layer: "body" | "head" | "eyes" };

const toneFill: Record<Tone, string> = {
  deer: "var(--color-deer)",
  deerDark: "var(--color-deer-dark)",
  cream: "var(--color-deer-cream)",
  spot: "var(--color-deer-spot)",
  eye: "var(--color-deer-eye)",
  white: "var(--color-deer-eye-white)",
  blush: "var(--color-deer-blush)",
  scarf: "var(--color-accent)",
  scarfBand: "var(--color-accent-ink)",
};

const mirror = (points: Pt[]): Pt[] => points.map(([x, y]) => [400 - x, y] as Pt);
const leftEar: Pt[] = [[122, 92], [132, 146], [34, 100]];
const leftInnerEar: Pt[] = [[118, 104], [124, 134], [66, 106]];

// Draw order matters: later parts sit on top.
const parts: Part[] = [
  { id: "leg-back-l", kind: "roundedSquare", d: roundedRect(132, 360, 34, 74, 16), tone: "deerDark", layer: "body" },
  { id: "leg-back-r", kind: "roundedSquare", d: roundedRect(234, 360, 34, 74, 16), tone: "deerDark", layer: "body" },
  { id: "body", kind: "roundedSquare", d: roundedRect(116, 246, 168, 156, 54), tone: "deer", layer: "body" },
  { id: "leg-front-l", kind: "roundedSquare", d: roundedRect(156, 372, 36, 72, 16), tone: "deer", layer: "body" },
  { id: "leg-front-r", kind: "roundedSquare", d: roundedRect(208, 372, 36, 72, 16), tone: "deer", layer: "body" },
  { id: "hoof-l", kind: "semicircle", d: semicircle(174, 444, 18, "bottom"), tone: "eye", layer: "body" },
  { id: "hoof-r", kind: "semicircle", d: semicircle(226, 444, 18, "bottom"), tone: "eye", layer: "body" },
  { id: "spot-1", kind: "circle", d: circle(146, 316, 9), tone: "spot", layer: "body" },
  { id: "spot-2", kind: "circle", d: circle(168, 350, 7), tone: "spot", layer: "body" },
  { id: "spot-3", kind: "circle", d: circle(254, 316, 9), tone: "spot", layer: "body" },
  { id: "spot-4", kind: "circle", d: circle(232, 350, 7), tone: "spot", layer: "body" },
  { id: "spot-5", kind: "circle", d: circle(200, 372, 6), tone: "spot", layer: "body" },
  { id: "scarf-band", kind: "roundedSquare", d: roundedRect(136, 236, 128, 26, 13), tone: "scarfBand", layer: "body" },
  { id: "scarf", kind: "roundedTriangle", d: roundedPolygon([[150, 248], [250, 248], [200, 316]], 12), tone: "scarf", layer: "body" },
  { id: "ear-l", kind: "roundedTriangle", d: roundedPolygon(leftEar, 14), tone: "deer", layer: "head" },
  { id: "ear-r", kind: "roundedTriangle", d: roundedPolygon(mirror(leftEar), 14), tone: "deer", layer: "head" },
  { id: "ear-inner-l", kind: "roundedTriangle", d: roundedPolygon(leftInnerEar, 10), tone: "blush", layer: "head" },
  { id: "ear-inner-r", kind: "roundedTriangle", d: roundedPolygon(mirror(leftInnerEar), 10), tone: "blush", layer: "head" },
  { id: "head", kind: "circle", d: circle(200, 156, 100), tone: "deer", layer: "head" },
  { id: "head-spot-1", kind: "circle", d: circle(200, 76, 8), tone: "spot", layer: "head" },
  { id: "head-spot-2", kind: "circle", d: circle(174, 86, 6), tone: "spot", layer: "head" },
  { id: "head-spot-3", kind: "circle", d: circle(226, 86, 6), tone: "spot", layer: "head" },
  { id: "muzzle", kind: "semicircle", d: semicircle(200, 186, 56, "top"), tone: "cream", layer: "head" },
  { id: "blush-l", kind: "circle", d: circle(132, 180, 13), tone: "blush", layer: "head" },
  { id: "blush-r", kind: "circle", d: circle(268, 180, 13), tone: "blush", layer: "head" },
  { id: "nose", kind: "roundedTriangle", d: roundedPolygon([[180, 184], [220, 184], [200, 208]], 7), tone: "eye", layer: "head" },
  { id: "eye-white-l", kind: "circle", d: circle(160, 138, 25), tone: "white", layer: "eyes" },
  { id: "eye-white-r", kind: "circle", d: circle(240, 138, 25), tone: "white", layer: "eyes" },
  { id: "pupil-l", kind: "circle", d: circle(165, 142, 14), tone: "eye", layer: "eyes" },
  { id: "pupil-r", kind: "circle", d: circle(235, 142, 14), tone: "eye", layer: "eyes" },
  { id: "shine-l", kind: "circle", d: circle(170, 136, 5), tone: "white", layer: "eyes" },
  { id: "shine-r", kind: "circle", d: circle(240, 136, 5), tone: "white", layer: "eyes" },
];

export const naraShapeCounts = parts.reduce<Record<ShapeKind, number>>(
  (counts, part) => ({ ...counts, [part.kind]: counts[part.kind] + 1 }),
  { roundedSquare: 0, circle: 0, roundedTriangle: 0, semicircle: 0 },
);

export type NaraMode = "wire" | "color";

type NaraProps = {
  mode?: NaraMode;
  highlight?: ShapeKind | null;
  bowing?: boolean;
  className?: string;
  title?: string;
};

export function Nara({ mode = "color", highlight = null, bowing = false, className, title = "Nara the sika deer" }: NaraProps) {
  const bodyParts = parts.filter((p) => p.layer === "body");
  const headParts = parts.filter((p) => p.layer !== "body");
  return (
    <svg viewBox="0 0 400 470" className={className} role="img" aria-label={title}>
      <rect x="110" y="446" width="180" height="16" rx="8" fill="var(--color-ink)" opacity="0.08" />
      <g>{bodyParts.map((part, i) => <NaraPart key={part.id} part={part} index={i} mode={mode} highlight={highlight} />)}</g>
      <motion.g
        style={{ originX: "200px", originY: "250px" }}
        animate={bowing ? { y: [0, 30, 30, 0] } : { y: 0 }}
        transition={bowing ? { duration: 2.4, times: [0, 0.3, 0.7, 1], repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" } : { duration: 0.3 }}
      >
        {headParts.map((part, i) => (
          <NaraPart key={part.id} part={part} index={i + bodyParts.length} mode={mode} highlight={highlight} />
        ))}
        <Mouth mode={mode} />
        {bowing && mode === "color" ? <ClosedEyes /> : null}
      </motion.g>
    </svg>
  );
}

function NaraPart({ part, index, mode, highlight }: { part: Part; index: number; mode: NaraMode; highlight: ShapeKind | null }) {
  const isWire = mode === "wire";
  const isLit = highlight === part.kind;
  const dimmed = highlight !== null && !isLit;
  return (
    <motion.path
      d={part.d}
      initial={{ pathLength: 0, fillOpacity: 0 }}
      animate={{
        pathLength: 1,
        fillOpacity: isWire ? 0 : 1,
        opacity: dimmed ? 0.35 : 1,
      }}
      transition={{
        pathLength: { duration: duration.slow, delay: index * 0.035, ease: ease.fold },
        fillOpacity: { duration: duration.base, delay: isWire ? 0 : index * 0.02 },
        opacity: { duration: duration.quick },
      }}
      fill={toneFill[part.tone]}
      stroke={wireStroke(isWire, isLit)}
      strokeWidth={isLit ? 4 : 2.5}
      strokeLinejoin="round"
    />
  );
}

function wireStroke(isWire: boolean, isLit: boolean): string {
  if (isLit) return "var(--color-accent-ink)";
  return isWire ? "var(--color-ink-muted)" : "transparent";
}

function Mouth({ mode }: { mode: NaraMode }) {
  return (
    <motion.path
      d="M186 216 Q200 228 214 216"
      fill="none"
      stroke={mode === "wire" ? "var(--color-ink-muted)" : "var(--color-deer-eye)"}
      strokeWidth="5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: duration.base, delay: 1.1 }}
    />
  );
}

/** While bowing, Nara closes both eyes into happy arcs. */
function ClosedEyes() {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
      transition={{ duration: 2.4, times: [0, 0.2, 0.3, 0.7, 0.8, 1], repeat: Infinity, repeatDelay: 1.6 }}
    >
      <circle cx="160" cy="138" r="27" fill="var(--color-deer)" />
      <circle cx="240" cy="138" r="27" fill="var(--color-deer)" />
      <path d="M144 142 Q160 128 176 142" fill="none" stroke="var(--color-deer-eye)" strokeWidth="6" strokeLinecap="round" />
      <path d="M224 142 Q240 128 256 142" fill="none" stroke="var(--color-deer-eye)" strokeWidth="6" strokeLinecap="round" />
    </motion.g>
  );
}

/** Just Nara's head, cropped for avatars in the lesson mockups. */
export function NaraAvatar({ className }: { className?: string }) {
  return (
    <svg viewBox="28 40 344 240" className={className} role="img" aria-label="Nara">
      {parts
        .filter((p) => p.layer !== "body")
        .map((part) => (
          <path key={part.id} d={part.d} fill={toneFill[part.tone]} />
        ))}
      <path d="M186 216 Q200 228 214 216" fill="none" stroke="var(--color-deer-eye)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
