"use client";

import { motion } from "motion/react";
import { hull, makeProjector, type Vec3 } from "@/lib/iso";
import { duration, ease } from "@/lib/motion";
import { circle, polygon, roundedRect, type Pt } from "@/lib/shapes";
import { paperStates } from "./CranePaper";

/**
 * The event version: the same folding station repeated under a pleated,
 * paper-like roof, with finished cranes hanging from a line overhead.
 * World units are centimeters.
 */

const iso = makeProjector(0.82, [470, 330]);
const W = 720;
const D = 440;

const shell = { top: "var(--color-shell-top)", left: "var(--color-shell-left)", right: "var(--color-shell-right)" };
const device = { top: "var(--color-device-face)", left: "var(--color-device)", right: "var(--color-device)" };

function Box({ x, y, z, w, d, h, colors }: { x: number; y: number; z: number; w: number; d: number; h: number; colors: typeof shell }) {
  const faces = iso.box(x, y, z, w, d, h);
  return (
    <g>
      <polygon points={polygon(faces.left)} fill={colors.left} />
      <polygon points={polygon(faces.right)} fill={colors.right} />
      <polygon points={polygon(faces.top)} fill={colors.top} />
    </g>
  );
}

const stations: Pt[] = [
  [80, 70],
  [320, 70],
  [560, 70],
  [200, 270],
  [440, 270],
];

function Station({ at, index, show }: { at: Pt; index: number; show: boolean }) {
  const [x, y] = at;
  const paper: Vec3[] = [[x + 24, y + 12, 72.5], [x + 48, y + 12, 72.5], [x + 48, y + 36, 72.5], [x + 24, y + 36, 72.5]];
  const lens: Vec3[] = [[x + 30, y + 18, 150], [x + 42, y + 18, 150], [x + 42, y + 30, 150], [x + 30, y + 30, 150]];
  const cone = hull([...paper, ...lens].map(iso.project));
  return (
    <g>
      <Box x={x} y={y} z={10} w={72} d={48} h={62} colors={shell} />
      <polygon points={polygon(paper.map(iso.project))} fill="var(--color-sheet)" />
      <Box x={x + 4} y={y} z={72} w={8} d={8} h={92} colors={device} />
      <motion.polygon
        points={polygon(cone)}
        fill="var(--color-accent)"
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? [0.1, 0.22, 0.1] : 0 }}
        transition={{ duration: 3, delay: index * 0.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <Box x={x + 4} y={y + 4} z={160} w={40} d={8} h={6} colors={device} />
      <Box x={x + 26} y={y + 14} z={150} w={20} d={20} h={12} colors={device} />
    </g>
  );
}

/** A visitor in the same simple-shape style as Nara: a rounded body and a round head. */
function Visitor({ at, tone }: { at: Vec3; tone: string }) {
  const [px, py] = iso.project(at);
  return (
    <g>
      <path d={roundedRect(px - 14, py - 66, 28, 66, 13)} fill={tone} />
      <path d={circle(px, py - 80, 13)} fill={tone} />
    </g>
  );
}

const crane = paperStates[10];

function HangingCrane({ x, y, drop, index, show }: { x: number; y: number; drop: number; index: number; show: boolean }) {
  const top = iso.project([x, y, 300]);
  const bottom = iso.project([x, y, 300 - drop]);
  return (
    <motion.g
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : -20 }}
      transition={{ duration: duration.base, delay: 0.6 + index * 0.06, ease: ease.outSoft }}
    >
      <line x1={top[0]} y1={top[1]} x2={bottom[0]} y2={bottom[1]} stroke="var(--color-ink-faint)" strokeWidth={1.2} />
      <g transform={`translate(${bottom[0] - 34} ${bottom[1] - 8}) scale(0.28)`}>
        {crane.faces.map((face, i) => (
          <polygon key={i} points={polygon(face.pts)} fill={i % 2 ? "var(--color-sheet-fold)" : "var(--color-accent)"} stroke="var(--color-accent-ink)" strokeWidth={3} />
        ))}
      </g>
    </motion.g>
  );
}

const hanging = [
  { x: 120, y: 200, drop: 70 },
  { x: 200, y: 160, drop: 95 },
  { x: 270, y: 220, drop: 60 },
  { x: 360, y: 180, drop: 85 },
  { x: 440, y: 210, drop: 70 },
  { x: 520, y: 170, drop: 100 },
  { x: 600, y: 210, drop: 65 },
  { x: 160, y: 330, drop: 80 },
  { x: 330, y: 360, drop: 60 },
  { x: 500, y: 350, drop: 90 },
  { x: 640, y: 330, drop: 70 },
];

/** Accordion-pleated roof panels, like a folded paper fan. */
function Roof() {
  const pleats = 8;
  const panels = Array.from({ length: pleats }, (_, i) => {
    const x0 = (W / pleats) * i;
    const x1 = (W / pleats) * (i + 1);
    const z0 = i % 2 === 0 ? 300 : 340;
    const z1 = i % 2 === 0 ? 340 : 300;
    const corners: Vec3[] = [[x0, -20, z0], [x1, -20, z1], [x1, D + 20, z1], [x0, D + 20, z0]];
    return { points: polygon(corners.map(iso.project)), tone: i % 2 === 0 ? shell.top : shell.left };
  });
  return (
    <g opacity={0.6}>
      {panels.map((panel, i) => (
        <polygon key={i} points={panel.points} fill={panel.tone} stroke="var(--color-line-strong)" strokeWidth={1} />
      ))}
    </g>
  );
}

function Post({ x, y }: { x: number; y: number }) {
  return <Box x={x} y={y} z={10} w={8} d={8} h={300} colors={device} />;
}

export function Tent({ show = true }: { show?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 940 760"
      className="h-full w-full"
      role="img"
      aria-label="Tent pop-up: five folding stations under a pleated roof, with paper cranes hanging overhead"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 30 }}
      transition={{ duration: duration.slow, ease: ease.outSoft }}
    >
      <polygon points={polygon(iso.floorRect(-30, -30, W + 60, D + 60, 0))} fill="var(--color-ink)" opacity={0.06} />
      <Box x={0} y={0} z={0} w={W} d={D} h={10} colors={shell} />
      <Post x={0} y={0} />
      <Post x={W - 8} y={0} />
      {stations.map((at, i) => (
        <Station key={i} at={at} index={i} show={show} />
      ))}
      <Visitor at={[236, 360, 10]} tone="var(--color-ink-faint)" />
      <Visitor at={[476, 360, 10]} tone="var(--color-line-strong)" />
      <Visitor at={[116, 160, 10]} tone="var(--color-line-strong)" />
      {hanging.map((item, i) => (
        <HangingCrane key={i} {...item} index={i} show={show} />
      ))}
      <Roof />
      <Post x={0} y={D - 8} />
      <Post x={W - 8} y={D - 8} />
    </motion.svg>
  );
}
