"use client";

import { motion } from "motion/react";
import type { OrigamiModel } from "@/content/content";
import { polygon, roundedRect, circle, type Pt } from "@/lib/shapes";
import { Kiosk } from "./Kiosk";
import { OrigamiIcon } from "./OrigamiIcon";
import { Lantern } from "./Tent";

/**
 * Inside the event tent, from the team's render, drawn as a corner of the room in
 * the same isometric view as the kiosks: the folded-paper dome overhead, two wooden
 * walls meeting at the back, and kiosks standing against both walls, facing into the
 * room. A painted Mt. Fuji and a board of finished origami hang between them.
 * Drawn in 1728 by 730 pixels, the size of the "Where it pops up" viewer, so the
 * camera can zoom straight in.
 */

export const INSIDE = { width: 1728, height: 730 };

// Each kiosk is the compact kiosk drawing (554 by 860, its floor corner at 295, 580)
// at this size. The room shares its isometric scale, so kiosks stand true on the floor.
export const KIOSK_SCALE = 0.36;
const KIOSK_BOX = { width: 554 * KIOSK_SCALE, height: 860 * KIOSK_SCALE };
const KIOSK_ORIGIN = { x: 295 * KIOSK_SCALE, mirroredX: (554 - 295) * KIOSK_SCALE, y: 580 * KIOSK_SCALE };

// Room units are centimeters. x runs along the right wall, y along the left wall, z up.
const SCALE = 2.6 * KIOSK_SCALE;
const COS30 = Math.cos(Math.PI / 6);
const CORNER: Pt = [INSIDE.width / 2, 330];
/** Where a newly finished model hangs: above the back corner, its peak this far down from the dome. */
export const HANG_SPOT = { x: CORNER[0], peakY: 96 };
const WALL_HEIGHT = 280;
const iso = (x: number, y: number, z = 0): Pt => [CORNER[0] + (x - y) * COS30 * SCALE, CORNER[1] + (x + y) * 0.5 * SCALE - z * SCALE];

type Placed = { along: number; wall: "left" | "right"; visitor?: string };

// Two kiosks on each wall, the room's mirror image. The back kiosk on the right is the
// one the camera zooms into next, so it stays free of visitors.
const kiosks: Placed[] = [
  { along: 140, wall: "right" },
  { along: 140, wall: "left" },
  { along: 470, wall: "right", visitor: "var(--color-love-soft)" },
  { along: 470, wall: "left", visitor: "var(--color-macaw-ring)" },
];

/** Where a kiosk's drawing box sits: its floor corner on the wall, mirrored on the left wall so it faces into the room. */
function kioskBox({ along, wall }: Placed): Pt {
  const [x, y] = wall === "right" ? iso(along, 0) : iso(0, along);
  const originX = wall === "right" ? KIOSK_ORIGIN.x : KIOSK_ORIGIN.mirroredX;
  return [x - originX, y - KIOSK_ORIGIN.y];
}

/** The kiosk the camera zooms into on the next build step: its box's top-left corner. */
export const featuredKiosk: Pt = kioskBox(kiosks[0]);

/** A transform that lays flat artwork onto a wall, starting `along` cm from the corner, its top edge at `top` cm. */
function onWall(wall: "left" | "right", along: number, top: number) {
  const [x, y] = wall === "right" ? iso(along, 0, top) : iso(0, along, top);
  const run = (wall === "right" ? 1 : -1) * COS30 * SCALE;
  return `matrix(${run} ${0.5 * SCALE} 0 ${SCALE} ${x} ${y})`;
}

const wallTopY = (x: number) => iso(0, 0, WALL_HEIGHT)[1] + (Math.abs(x - CORNER[0]) * 0.5) / COS30;
const shellTones = ["var(--color-shell-top)", "var(--color-shell-left)", "var(--color-shell-right)", "var(--color-shell-deep)"];

/** The dome: pleats of folded paper from the top of the view down to the tops of the walls. */
function Dome() {
  const xs = Array.from({ length: 13 }, (_, i) => i * (INSIDE.width / 12));
  const pleats = xs.slice(0, -1).flatMap((x0, i) => {
    const x1 = xs[i + 1];
    const side = x1 <= CORNER[0] ? 0 : 1;
    return [
      { pts: [[x0, 0], [x1, 0], [x0, wallTopY(x0)]] as Pt[], fill: shellTones[side] },
      { pts: [[x1, 0], [x1, wallTopY(x1)], [x0, wallTopY(x0)]] as Pt[], fill: shellTones[side + 1] },
    ];
  });
  return (
    <g>
      {pleats.map((pleat, i) => (
        <polygon key={i} points={polygon(pleat.pts)} fill={pleat.fill} stroke="var(--color-shell-deep)" strokeWidth={1.5} strokeLinejoin="round" />
      ))}
    </g>
  );
}

/** Two wooden walls meeting at the back corner, with panel seams and a darker skirting at the floor. */
function Walls() {
  const far = 1100;
  const right: Pt[] = [iso(0, 0, WALL_HEIGHT), iso(far, 0, WALL_HEIGHT), iso(far, 0), iso(0, 0)];
  const left: Pt[] = [iso(0, 0, WALL_HEIGHT), iso(0, far, WALL_HEIGHT), iso(0, far), iso(0, 0)];
  const seams = [110, 230, 350, 470, 590, 710, 830];
  return (
    <g>
      <polygon points={polygon(left)} fill="var(--color-wood-left)" />
      <polygon points={polygon(right)} fill="var(--color-wood-top)" />
      {seams.map((u) => (
        <g key={u} stroke="var(--color-wood-right)" strokeWidth={2} opacity={0.45}>
          <line x1={iso(u, 0)[0]} y1={iso(u, 0)[1]} x2={iso(u, 0, WALL_HEIGHT)[0]} y2={iso(u, 0, WALL_HEIGHT)[1]} />
          <line x1={iso(0, u)[0]} y1={iso(0, u)[1]} x2={iso(0, u, WALL_HEIGHT)[0]} y2={iso(0, u, WALL_HEIGHT)[1]} />
        </g>
      ))}
      <line x1={CORNER[0]} y1={iso(0, 0, WALL_HEIGHT)[1]} x2={CORNER[0]} y2={CORNER[1]} stroke="var(--color-wood-right)" strokeWidth={3} />
      <polyline points={polygon([iso(0, far), iso(0, 0), iso(far, 0)])} fill="none" stroke="var(--color-wood-dark)" strokeWidth={8} opacity={0.55} />
    </g>
  );
}

/** Wooden planks running across the room, and a round rug in the middle. */
function Floor() {
  const far = 1100;
  const planks = Array.from({ length: 10 }, (_, i) => 70 + i * 70);
  const [cx, cy] = iso(330, 330);
  const r = 110 * Math.SQRT2 * SCALE;
  return (
    <g>
      <polygon points={polygon([iso(0, 0), iso(far, 0), iso(far, far), iso(0, far)])} fill="var(--color-wood-right)" />
      {planks.map((v) => (
        <line key={v} x1={iso(0, v)[0]} y1={iso(0, v)[1]} x2={iso(far, v)[0]} y2={iso(far, v)[1]} stroke="var(--color-wood-dark)" strokeWidth={1.5} opacity={0.3} />
      ))}
      <ellipse cx={cx} cy={cy} rx={r * COS30} ry={r * 0.5} fill="var(--color-wood-top)" />
      <ellipse cx={cx} cy={cy} rx={r * COS30 - 12} ry={r * 0.5 - 7} fill="none" stroke="var(--color-sakura)" strokeWidth={4} />
    </g>
  );
}

/** A framed painting of Mt. Fuji on the left wall, between its two kiosks. */
function Painting() {
  return (
    <g transform={onWall("left", 232, 226)}>
      <rect x={0} y={0} width={190} height={118} rx={8} fill="var(--color-shell-top)" />
      <polygon points={polygon([[22, 104], [95, 24], [168, 104]])} fill="var(--color-fuji-light)" />
      <polygon points={polygon([[95, 24], [78, 43], [87, 39], [92, 48], [99, 39], [105, 46], [112, 43]])} fill="var(--color-snow)" />
      {[[28, 26], [162, 30]].map(([x, y]) => (
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
        return <circle key={i} cx={x + Math.cos(a) * 9} cy={y + Math.sin(a) * 9} r={7} fill="var(--color-sakura)" />;
      })}
      <circle cx={x} cy={y} r={4} fill="var(--color-sakura-deep)" />
    </g>
  );
}

// Finished origami pinned to a board on the right wall: the shared display.
const pinned: OrigamiModel[] = ["crane", "fuji", "sakura", "koi", "fuji", "kabuto", "crane", "sakura"];

function DisplayBoard() {
  return (
    <g transform={onWall("right", 232, 226)}>
      <rect x={0} y={0} width={190} height={118} rx={8} fill="var(--color-shell-top)" />
      {pinned.map((model, i) => (
        <svg key={i} x={14 + (i % 4) * 44} y={12 + Math.floor(i / 4) * 52} width={40} height={40} viewBox="0 0 200 200" overflow="visible">
          <OrigamiIcon model={model} label="" />
        </svg>
      ))}
    </g>
  );
}

// More finished origami hanging from the dome on strings, clear of the kiosks below.
// The spot above the back corner stays free: "You folded Mt. Fuji" hangs the visitor's model there.
const hanging: { model: OrigamiModel; x: number; drop: number }[] = [
  { model: "crane", x: 110, drop: 150 },
  { model: "sakura", x: 260, drop: 230 },
  { model: "koi", x: 420, drop: 160 },
  { model: "fuji", x: 730, drop: 70 },
  { model: "crane", x: 1000, drop: 90 },
  { model: "sakura", x: 1310, drop: 170 },
  { model: "fuji", x: 1470, drop: 230 },
  { model: "crane", x: 1620, drop: 150 },
];

function Hanging({ model, x, drop, index }: { model: OrigamiModel; x: number; drop: number; index: number }) {
  return (
    <motion.g
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 3 + (index % 4) * 0.4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: `${x}px 0px`, transformBox: "view-box" }}
    >
      <line x1={x} y1={0} x2={x} y2={drop} stroke="var(--color-ink-faint)" strokeWidth={2} />
      <svg x={x - 32} y={drop - 6} width={64} height={64} viewBox="0 0 200 200" overflow="visible">
        <OrigamiIcon model={model} label="" />
      </svg>
    </motion.g>
  );
}

/** A visitor at the folding ledge, standing just in front of their kiosk. */
function Visitor({ placed }: { placed: Placed }) {
  const [x, y] = placed.wall === "right" ? iso(placed.along + 38, 150) : iso(150, placed.along + 38);
  const tone = placed.visitor ?? "var(--color-line)";
  return (
    <g>
      <ellipse cx={x} cy={y} rx={30} ry={12} fill="var(--color-wood-dark)" opacity={0.25} />
      <path d={roundedRect(x - 24, y - 104, 48, 104, 24)} fill={tone} />
      <path d={circle(x, y - 126, 23)} fill={tone} />
    </g>
  );
}

function PlacedKiosk({ placed }: { placed: Placed }) {
  const [left, top] = kioskBox(placed);
  return (
    <div
      className="absolute"
      style={{ left, top, ...KIOSK_BOX, transform: placed.wall === "left" ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      <Kiosk />
    </div>
  );
}

const layer = { viewBox: `0 0 ${INSIDE.width} ${INSIDE.height}`, className: "pointer-events-none absolute inset-0 h-full w-full" };

export function TentInside() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ width: INSIDE.width, height: INSIDE.height }}
      role="img"
      aria-label="Inside the event tent: a corner of the room with kiosks against both wooden walls, a painted Mt. Fuji, a board of finished origami, and more origami hanging from the folded-paper dome"
    >
      <svg {...layer} aria-hidden="true">
        <Dome />
        <Walls />
        <Floor />
        <Painting />
        <DisplayBoard />
      </svg>
      {kiosks.map((placed) => (
        <PlacedKiosk key={`${placed.wall}-${placed.along}`} placed={placed} />
      ))}
      <svg {...layer} aria-hidden="true">
        {kiosks.filter((placed) => placed.visitor).map((placed) => (
          <Visitor key={`${placed.wall}-${placed.along}`} placed={placed} />
        ))}
        {hanging.map((item, i) => (
          <Hanging key={i} {...item} index={i} />
        ))}
        {[640, 1090].map((x) => (
          <g key={x} transform={`translate(${x} 150) scale(2)`}>
            <Lantern x={0} y={0} />
          </g>
        ))}
      </svg>
    </div>
  );
}
