"use client";

import { motion } from "motion/react";
import type { OrigamiModel } from "@/content/content";
import { polygon, roundedRect, circle, type Pt } from "@/lib/shapes";
import { Kiosk } from "./Kiosk";
import { OrigamiIcon } from "./OrigamiIcon";
import { Lantern } from "./Tent";

/**
 * Inside the event tent, from the team's render: the folded-paper dome overhead,
 * wooden walls with a painted Mt. Fuji, kiosks along the back wall and the shared
 * display of finished origami hanging from the ceiling. Drawn in 1728 by 730 pixels,
 * the size of the "Where it pops up" viewer, so the camera can zoom straight in.
 */

export const INSIDE = { width: 1728, height: 730 };
const RIDGE = [262, 300];
const WALL_BOTTOM = 612;

// Each kiosk is the compact kiosk drawing (554 by 860) at 30% size, standing on the floor.
export const KIOSK_SCALE = 0.3;
const KIOSK_W = 554 * KIOSK_SCALE;
const KIOSK_H = 860 * KIOSK_SCALE;
const KIOSK_TOP = 646 - KIOSK_H;
export const insideKiosks: Pt[] = [170, 520, 1040, 1390].map((left) => [left, KIOSK_TOP]);
/** The kiosk the camera zooms into on the next build step. */
export const FEATURED_KIOSK = 2;

const ceilingTop: Pt[] = Array.from({ length: 10 }, (_, i) => [i * 192, 0]);
const ridge: Pt[] = Array.from({ length: 10 }, (_, i) => [i * 192, RIDGE[i % 2]]);
const shellTones = ["var(--color-shell-top)", "var(--color-shell-left)", "var(--color-shell-right)", "var(--color-shell-deep)"];

/** The dome's folds: light on the left, deeper on the right, alternate facets trading tones. */
function Ceiling() {
  const tris: { pts: Pt[]; fill: string }[] = [];
  for (let i = 0; i < ceilingTop.length - 1; i += 1) {
    const side = i < 4 ? 0 : 1;
    tris.push({ pts: [ceilingTop[i], ceilingTop[i + 1], ridge[i]], fill: shellTones[side] });
    tris.push({ pts: [ceilingTop[i + 1], ridge[i + 1], ridge[i]], fill: shellTones[side + 2] });
  }
  return (
    <g>
      <rect x={0} y={0} width={INSIDE.width} height={RIDGE[1]} fill="var(--color-shell-left)" />
      {tris.map((tri, i) => (
        <polygon key={i} points={polygon(tri.pts)} fill={tri.fill} stroke="var(--color-shell-deep)" strokeWidth={1.5} strokeLinejoin="round" />
      ))}
    </g>
  );
}

/** Wooden wall panels under the dome, with the painted mountain and blossoms. */
function Wall() {
  const top = ridge.map(([x, y]): Pt => [x, y]);
  const wall: Pt[] = [...top, [INSIDE.width, RIDGE[1]], [INSIDE.width, WALL_BOTTOM], [0, WALL_BOTTOM]];
  return (
    <g>
      <polygon points={polygon(wall)} fill="var(--color-wood-top)" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={96 + i * 192} y={RIDGE[1]} width={3} height={WALL_BOTTOM - RIDGE[1]} fill="var(--color-wood-left)" />
      ))}
      <polygon points={polygon([[700, 560], [864, 380], [1028, 560]])} fill="var(--color-fuji-light)" opacity={0.8} />
      <polygon points={polygon([[864, 380], [826, 422], [846, 414], [856, 430], [872, 414], [884, 426], [902, 422]])} fill="var(--color-snow)" />
      {[[742, 400], [770, 382], [990, 396], [962, 380], [1010, 420], [722, 430]].map(([x, y]) => (
        <Blossom key={`${x}-${y}`} x={x} y={y} />
      ))}
    </g>
  );
}

function Blossom({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i * 72 - 90) * (Math.PI / 180);
        return <circle key={i} cx={x + Math.cos(a) * 11} cy={y + Math.sin(a) * 11} r={9} fill="var(--color-sakura)" />;
      })}
      <circle cx={x} cy={y} r={5} fill="var(--color-sakura-deep)" />
    </g>
  );
}

function Floor() {
  return (
    <g>
      <rect x={0} y={WALL_BOTTOM} width={INSIDE.width} height={INSIDE.height - WALL_BOTTOM} fill="var(--color-wood-left)" />
      <rect x={0} y={WALL_BOTTOM} width={INSIDE.width} height={8} fill="var(--color-wood-right)" />
    </g>
  );
}

// The shared display: visitors' finished origami hanging from the dome on strings.
const hanging: { model: OrigamiModel; x: number; drop: number }[] = [
  { model: "crane", x: 120, drop: 120 },
  { model: "sakura", x: 300, drop: 180 },
  { model: "fuji", x: 470, drop: 110 },
  { model: "crane", x: 640, drop: 200 },
  { model: "koi", x: 780, drop: 130 },
  { model: "sakura", x: 960, drop: 190 },
  { model: "fuji", x: 1120, drop: 120 },
  { model: "crane", x: 1290, drop: 170 },
  { model: "sakura", x: 1460, drop: 110 },
  { model: "koi", x: 1620, drop: 190 },
];

function Hanging({ model, x, drop, index }: { model: OrigamiModel; x: number; drop: number; index: number }) {
  return (
    <motion.g
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 3 + (index % 4) * 0.4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: `${x}px 0px`, transformBox: "view-box" }}
    >
      <line x1={x} y1={0} x2={x} y2={drop} stroke="var(--color-ink-faint)" strokeWidth={2} />
      <svg x={x - 34} y={drop - 6} width={68} height={68} viewBox="0 0 200 200" overflow="visible">
        <OrigamiIcon model={model} label="" />
      </svg>
    </motion.g>
  );
}

/** A visitor at a kiosk, drawn from the same rounded shapes as the people outside. */
function Visitor({ x, tone }: { x: number; tone: string }) {
  return (
    <g>
      <path d={roundedRect(x - 30, 560, 60, 104, 28)} fill={tone} />
      <path d={circle(x, 528, 28)} fill={tone} />
    </g>
  );
}

export function TentInside() {
  return (
    <div className="relative" style={{ width: INSIDE.width, height: INSIDE.height }} role="img" aria-label="Inside the event tent: kiosks along the wooden walls, a painted Mt. Fuji, lanterns, and finished origami hanging from the folded-paper dome">
      <svg viewBox={`0 0 ${INSIDE.width} ${INSIDE.height}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <Ceiling />
        <Wall />
        <Floor />
        {hanging.map((item, i) => (
          <Hanging key={i} {...item} index={i} />
        ))}
        {[[420, 300], [1300, 300]].map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y}) scale(2)`}>
            <Lantern x={0} y={0} />
          </g>
        ))}
      </svg>
      {insideKiosks.map(([left, top]) => (
        <div key={left} className="absolute" style={{ left, top, width: KIOSK_W, height: KIOSK_H }} aria-hidden="true">
          <Kiosk />
        </div>
      ))}
      <svg viewBox={`0 0 ${INSIDE.width} ${INSIDE.height}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <Visitor x={150} tone="var(--color-macaw-ring)" />
        <Visitor x={1600} tone="var(--color-love-soft)" />
      </svg>
    </div>
  );
}
