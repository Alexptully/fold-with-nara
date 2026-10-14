"use client";

import { motion, type TargetAndTransition, type Transition } from "motion/react";
import { useId } from "react";
import { duration, ease } from "@/lib/motion";
import { NaraEffect } from "./effects";
import { NARA_VIEWBOX, partsFor, poses, type Layer, type Part, type Pose, type ShapeKind, type Tone } from "./geometry";

export type { Pose, ShapeKind } from "./geometry";
export { shapeCounts } from "./geometry";

export type NaraMode = "color" | "outline";

const toneVar: Record<Tone, string> = {
  deer: "var(--color-deer)",
  cream: "var(--color-deer-cream)",
  ear: "var(--color-deer-ear)",
  antler: "var(--color-deer-antler)",
  hoof: "var(--color-deer-hoof)",
  eye: "var(--color-deer-eye)",
  white: "var(--color-deer-eye-white)",
  mouth: "var(--color-deer-mouth)",
  tongue: "var(--color-deer-tongue)",
  card: "var(--color-accent)",
  cardShade: "var(--color-accent-ink)",
  heart: "var(--color-love)",
};

type Look = { mode: NaraMode; highlight: ShapeKind | null; drawIn: boolean; uid: string };

type NaraProps = {
  pose?: Pose;
  mode?: NaraMode;
  /** Lights every part made from one of the guide's shapes; the rest dims. */
  highlight?: ShapeKind | null;
  /** In outline mode, draws the sketch in stroke by stroke. */
  drawIn?: boolean;
  className?: string;
  title?: string;
};

export function Nara({ pose = "smile", mode = "color", highlight = null, drawIn = false, className, title = "Nara the sika deer" }: NaraProps) {
  const uid = useId().replace(/:/g, "");
  const spec = poses[pose];
  const parts = partsFor(pose);
  const look: Look = { mode, highlight, drawIn, uid };
  const layer = (name: Layer) => parts.filter((part) => part.layer === name);
  const [hx, hy] = spec.headOffset;
  return (
    <svg viewBox={NARA_VIEWBOX} className={className} role="img" aria-label={title} overflow="visible">
      <GroundShadow bounce={spec.loop === "bounce"} />
      <motion.g {...figureLoop(spec.loop)}>
        <PartList parts={layer("body")} look={look} />
        <motion.g
          style={{ transformOrigin: "200px 300px", transformBox: "view-box" }}
          initial={false}
          animate={headMotion(spec.loop, hx, hy, spec.headTilt)}
          transition={headTransition(spec.loop)}
        >
          <PartList parts={layer("head")} look={look} />
        </motion.g>
        <PartList parts={layer("front")} look={look} />
        {mode === "color" ? <NaraEffect effect={spec.effect} /> : null}
      </motion.g>
    </svg>
  );
}

function GroundShadow({ bounce }: { bounce: boolean }) {
  return (
    <motion.ellipse
      cx={200}
      cy={580}
      rx={96}
      ry={12}
      fill="var(--color-line)"
      style={{ transformOrigin: "200px 580px", transformBox: "view-box" }}
      animate={bounce ? { scaleX: [1, 0.78, 1] } : { scaleX: 1 }}
      transition={bounce ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
    />
  );
}

function figureLoop(kind: string): { animate?: TargetAndTransition; transition?: Transition } {
  if (kind !== "bounce") return {};
  return { animate: { y: [0, -26, 0] }, transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" } };
}

function headMotion(kind: string, x: number, y: number, tilt: number): TargetAndTransition {
  if (kind === "bow") return { x, y: [y - 4, y + 6, y - 4], rotate: tilt };
  if (kind === "nod") return { x, y: [y, y + 3, y], rotate: tilt };
  if (kind === "sway") return { x, y, rotate: [tilt, tilt - 3, tilt] };
  return { x, y, rotate: tilt };
}

function headTransition(kind: string): Transition {
  if (kind === "none") return { duration: duration.base, ease: ease.outSoft };
  const lengths: Record<string, number> = { bow: 2.4, nod: 1.6, sway: 2.2, bounce: 0.9 };
  return { duration: lengths[kind] ?? 2, repeat: Infinity, ease: "easeInOut" };
}

function PartList({ parts, look }: { parts: Part[]; look: Look }) {
  const eyes = parts.filter((part) => part.eye);
  const rest = parts.filter((part) => !part.eye);
  const eyeStart = parts.findIndex((part) => part.eye);
  const before = eyeStart < 0 ? rest : rest.filter((part) => parts.indexOf(part) < eyeStart);
  const after = eyeStart < 0 ? [] : rest.filter((part) => parts.indexOf(part) > eyeStart);
  return (
    <>
      {before.map((part, i) => <PartView key={part.id} part={part} look={look} index={i} />)}
      {eyes.length > 0 ? <BlinkingEyes parts={eyes} look={look} /> : null}
      {after.map((part, i) => <PartView key={part.id} part={part} look={look} index={before.length + i} />)}
    </>
  );
}

/** Open eyes blink every few seconds, the way Duolingo's characters do. */
function BlinkingEyes({ parts, look }: { parts: Part[]; look: Look }) {
  const blink = look.mode === "color";
  return (
    <motion.g
      style={{ transformOrigin: "200px 200px", transformBox: "view-box" }}
      animate={blink ? { scaleY: [1, 1, 0.08, 1] } : { scaleY: 1 }}
      transition={blink ? { duration: 4.2, times: [0, 0.93, 0.96, 1], repeat: Infinity, repeatDelay: 0.4 } : { duration: 0.2 }}
    >
      {parts.map((part, i) => <PartView key={part.id} part={part} look={look} index={20 + i} />)}
    </motion.g>
  );
}

function PartView({ part, look, index }: { part: Part; look: Look; index: number }) {
  const lit = look.highlight === part.kind;
  const dim = look.highlight !== null && !lit;
  return (
    <motion.g initial={false} animate={{ opacity: dim ? 0.28 : 1 }} transition={{ duration: duration.quick }}>
      {look.mode === "outline" ? <OutlinePart part={part} look={look} index={index} /> : <ColorPart part={part} look={look} lit={lit} />}
    </motion.g>
  );
}

function ColorPart({ part, look, lit }: { part: Part; look: Look; lit: boolean }) {
  const color = toneVar[part.tone];
  if (part.stroke) {
    return (
      <>
        {lit ? <path d={part.d} fill="none" stroke="var(--color-accent-ink)" strokeWidth={part.stroke + 8} strokeLinecap="round" /> : null}
        {part.edge && !lit ? <path d={part.d} fill="none" stroke="var(--color-deer-shade)" strokeWidth={part.stroke + 5} strokeLinecap="round" /> : null}
        <path d={part.d} fill="none" stroke={color} strokeWidth={part.stroke} strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  }
  return (
    <>
      {part.shade ? <ShadedFill part={part} uid={look.uid} /> : <path d={part.d} fill={color} transform={part.transform} />}
      {lit ? <path d={part.d} fill="none" stroke="var(--color-accent-ink)" strokeWidth={4} /> : null}
    </>
  );
}

/** A flat fill with a darker crescent on the lower right, the only shading Nara gets. */
function ShadedFill({ part, uid }: { part: Part; uid: string }) {
  const clip = `${uid}-${part.id}`;
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <path d={part.d} />
        </clipPath>
      </defs>
      <path d={part.d} fill="var(--color-deer-shade)" />
      <path d={part.d} fill={toneVar[part.tone]} transform="translate(-9 -10)" clipPath={`url(#${clip})`} />
    </>
  );
}

/** The construction sketch: grey outlines on white, like the first page of the character sheet. */
function OutlinePart({ part, look, index }: { part: Part; look: Look; index: number }) {
  const draw = look.drawIn
    ? { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: duration.slow, delay: index * 0.04, ease: ease.fold } }
    : {};
  if (part.stroke) {
    return (
      <>
        <motion.path d={part.d} fill="none" stroke="var(--color-sketch)" strokeWidth={part.stroke + 6} strokeLinecap="round" {...draw} />
        <path d={part.d} fill="none" stroke="var(--color-paper)" strokeWidth={part.stroke} strokeLinecap="round" />
      </>
    );
  }
  return <motion.path d={part.d} fill="var(--color-paper)" stroke="var(--color-sketch)" strokeWidth={3} strokeLinejoin="round" {...draw} />;
}
