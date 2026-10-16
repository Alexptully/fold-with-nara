"use client";

import { motion, type TargetAndTransition, type Transition } from "motion/react";
import { duration, ease } from "@/lib/motion";
import { NaraEffect } from "./effects";
import {
  BODY_VIEWBOX,
  HEAD_VIEWBOX,
  partsFor,
  poses,
  sketchParts,
  type Layer,
  type Part,
  type Pose,
  type PoseSpec,
  type ShapeKind,
  type Tone,
} from "./geometry";

export type { Pose, ShapeKind } from "./geometry";
export { shapeCounts } from "./geometry";

const toneVar: Record<Tone, string> = {
  deer: "var(--color-deer)",
  cream: "var(--color-deer-cream)",
  antler: "var(--color-deer-antler)",
  dark: "var(--color-deer-dark)",
  white: "var(--color-deer-eye-white)",
  mouth: "var(--color-deer-mouth)",
  tongue: "var(--color-deer-tongue)",
  line: "var(--color-deer-line)",
  card: "var(--color-accent)",
  cardShade: "var(--color-accent-ink)",
  heart: "var(--color-love)",
};

const box = (v: typeof BODY_VIEWBOX) => `${v.x} ${v.y} ${v.w} ${v.h}`;

type NaraProps = {
  pose?: Pose;
  /** Lights every part made from one of the guide's shapes; the rest dims. */
  highlight?: ShapeKind | null;
  className?: string;
  title?: string;
};

/** Nara in color, in any of her poses, with the small motions from the team's animation. */
export function Nara({ pose = "smile", highlight = null, className, title = "Nara the sika deer" }: NaraProps) {
  const spec = poses[pose];
  const parts = partsFor(pose);
  const layer = (name: Layer) => parts.filter((part) => part.layer === name);
  return (
    <svg viewBox={box(BODY_VIEWBOX)} className={className} role="img" aria-label={title} overflow="visible">
      <GroundShadow bounce={spec.loop === "bounce"} />
      <motion.g style={{ transformOrigin: "460px 893px", transformBox: "view-box" }} {...figureLoop(spec.loop)}>
        <PartList parts={layer("back")} highlight={highlight} />
        <PartList parts={layer("body").filter((part) => !isWavingArm(spec, part))} highlight={highlight} />
        {spec.loop === "wave" ? <WavingArm parts={layer("body").filter((part) => isWavingArm(spec, part))} highlight={highlight} /> : null}
        <Head spec={spec} parts={layer("head")} highlight={highlight} />
        <PartList parts={layer("front")} highlight={highlight} />
        <NaraEffect effect={spec.effect} />
      </motion.g>
    </svg>
  );
}

const isWavingArm = (spec: PoseSpec, part: Part) => spec.loop === "wave" && part.id.endsWith("-right");

function WavingArm({ parts, highlight }: { parts: Part[]; highlight: ShapeKind | null }) {
  return (
    <motion.g
      style={{ transformOrigin: "542px 500px", transformBox: "view-box" }}
      animate={{ rotate: [-8, 14, -8] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
    >
      <PartList parts={parts} highlight={highlight} />
    </motion.g>
  );
}

function GroundShadow({ bounce }: { bounce: boolean }) {
  return (
    <motion.ellipse
      cx={459.5}
      cy={895.5}
      rx={172}
      ry={16}
      fill="var(--color-deer-shadow)"
      style={{ transformOrigin: "460px 896px", transformBox: "view-box" }}
      animate={bounce ? { scaleX: [1, 0.74, 1] } : { scaleX: 1 }}
      transition={bounce ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
    />
  );
}

function figureLoop(kind: PoseSpec["loop"]): { animate?: TargetAndTransition; transition?: Transition } {
  if (kind === "bounce") return { animate: { y: [0, -40, 0] }, transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" } };
  if (kind === "hop") {
    return {
      animate: { scaleX: [1, 1.05, 0.96, 1], scaleY: [1, 0.94, 1.05, 1], y: [0, 0, -26, 0] },
      transition: { duration: 0.8, times: [0, 0.25, 0.6, 1], repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" },
    };
  }
  if (kind === "breathe") return { animate: { scaleY: [1, 1.012, 1] }, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } };
  return {};
}

function headMotion(spec: PoseSpec): TargetAndTransition {
  const drop = spec.headDrop;
  if (spec.loop === "bow") return { y: [drop - 8, drop + 6, drop - 8], rotate: spec.headTilt };
  if (spec.loop === "nod") return { y: [0, 6, 0], rotate: spec.headTilt };
  if (spec.loop === "sway") return { y: drop, rotate: [spec.headTilt, spec.headTilt - 4, spec.headTilt] };
  return { y: drop, rotate: spec.headTilt };
}

function headTransition(kind: PoseSpec["loop"]): Transition {
  const lengths: Partial<Record<PoseSpec["loop"], number>> = { bow: 2.4, nod: 1.4, sway: 2.2 };
  const length = lengths[kind];
  return length ? { duration: length, repeat: Infinity, ease: "easeInOut" } : { duration: duration.base, ease: ease.outSoft };
}

/** The head sways, nods or bows as one piece; antlers fold back when Nara bows. */
function Head({ spec, parts, highlight }: { spec: PoseSpec; parts: Part[]; highlight: ShapeKind | null }) {
  const antlers = parts.filter((part) => part.id.startsWith("antler"));
  const ears = (side: "l" | "r") => parts.filter((part) => part.id.startsWith("ear") && part.id.endsWith(side));
  const face = parts.filter((part) => !part.id.startsWith("antler") && !part.id.startsWith("ear"));
  const bowing = spec.headDrop > 0;
  return (
    <motion.g
      style={{ transformOrigin: "460px 486px", transformBox: "view-box" }}
      initial={false}
      animate={headMotion(spec)}
      transition={headTransition(spec.loop)}
    >
      <g style={{ transformOrigin: "460px 230px", transformBox: "view-box", transform: bowing ? "scaleY(0.66)" : undefined }}>
        <PartList parts={antlers} highlight={highlight} />
      </g>
      <Ear parts={ears("l")} highlight={highlight} side={-1} />
      <Ear parts={ears("r")} highlight={highlight} side={1} />
      <PartList parts={face} highlight={highlight} />
    </motion.g>
  );
}

/** Ears flick now and then, like in the animation. */
function Ear({ parts, highlight, side }: { parts: Part[]; highlight: ShapeKind | null; side: 1 | -1 }) {
  const pivot = side < 0 ? "350px 270px" : "570px 270px";
  return (
    <motion.g
      style={{ transformOrigin: pivot, transformBox: "view-box" }}
      animate={{ rotate: [0, 0, side * -10, 0] }}
      transition={{ duration: 3.6, times: [0, 0.82, 0.9, 1], repeat: Infinity, delay: side > 0 ? 0.12 : 0 }}
    >
      <PartList parts={parts} highlight={highlight} />
    </motion.g>
  );
}

function PartList({ parts, highlight }: { parts: Part[]; highlight: ShapeKind | null }) {
  const eyes = parts.filter((part) => part.eye);
  const eyeStart = parts.findIndex((part) => part.eye);
  const before = eyeStart < 0 ? parts : parts.slice(0, eyeStart);
  const after = eyeStart < 0 ? [] : parts.slice(eyeStart).filter((part) => !part.eye);
  return (
    <>
      {before.map((part) => <PartView key={part.id} part={part} highlight={highlight} />)}
      {eyes.length > 0 ? <BlinkingEyes parts={eyes} highlight={highlight} /> : null}
      {after.map((part) => <PartView key={part.id} part={part} highlight={highlight} />)}
    </>
  );
}

/** Open eyes blink every few seconds. */
function BlinkingEyes({ parts, highlight }: { parts: Part[]; highlight: ShapeKind | null }) {
  return (
    <motion.g
      style={{ transformOrigin: "460px 349px", transformBox: "view-box" }}
      animate={{ scaleY: [1, 1, 0.1, 1] }}
      transition={{ duration: 4.2, times: [0, 0.93, 0.96, 1], repeat: Infinity, repeatDelay: 0.4 }}
    >
      {parts.map((part) => <PartView key={part.id} part={part} highlight={highlight} />)}
    </motion.g>
  );
}

function PartView({ part, highlight }: { part: Part; highlight: ShapeKind | null }) {
  const lit = highlight === part.kind;
  const dim = highlight !== null && !lit;
  const color = toneVar[part.tone];
  return (
    <motion.g initial={false} animate={{ opacity: dim ? 0.25 : 1 }} transition={{ duration: duration.quick }}>
      {part.stroke ? <StrokePart part={part} color={color} lit={lit} /> : <FillPart part={part} color={color} lit={lit} />}
    </motion.g>
  );
}

function StrokePart({ part, color, lit }: { part: Part; color: string; lit: boolean }) {
  const width = part.stroke ?? 0;
  return (
    <>
      {part.outline || lit ? (
        <path d={part.d} fill="none" stroke={lit ? "var(--color-accent-ink)" : "var(--color-deer-line)"} strokeWidth={width + (lit ? 10 : 4)} strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
      <path d={part.d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function FillPart({ part, color, lit }: { part: Part; color: string; lit: boolean }) {
  return (
    <path
      d={part.d}
      fill={color}
      stroke={edgeColor(part, lit)}
      strokeWidth={lit ? 6 : 2.5}
      strokeLinejoin="round"
    />
  );
}

function edgeColor(part: Part, lit: boolean): string {
  if (lit) return "var(--color-accent-ink)";
  return part.outline ? "var(--color-deer-line)" : "none";
}

/** The construction sheet: Nara's head drawn as grey outlines of rounded capsules and ovals. */
export function NaraSketch({ drawIn = true, highlight = null, className, title = "Nara, outline sketch" }: { drawIn?: boolean; highlight?: ShapeKind | null; className?: string; title?: string }) {
  return (
    <svg viewBox={box(HEAD_VIEWBOX)} className={className} role="img" aria-label={title} overflow="visible">
      {sketchParts().map((part, i) => {
        const lit = highlight === part.kind;
        return (
          <motion.path
            key={part.id}
            d={part.d}
            fill="none"
            stroke={lit ? "var(--color-accent-ink)" : "var(--color-sketch)"}
            strokeWidth={lit ? 6 : 4}
            strokeLinejoin="round"
            initial={drawIn ? { pathLength: 0 } : false}
            animate={{ pathLength: 1, opacity: highlight !== null && !lit ? 0.3 : 1 }}
            transition={{ pathLength: { duration: duration.slow, delay: i * 0.05, ease: ease.fold }, opacity: { duration: duration.quick } }}
          />
        );
      })}
    </svg>
  );
}
