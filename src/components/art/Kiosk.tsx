"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { hull, makeProjector, type Vec3 } from "@/lib/iso";
import { duration, ease } from "@/lib/motion";
import { polygon, type Pt } from "@/lib/shapes";
import { OrigamiIcon } from "./OrigamiIcon";
import type { OrigamiModel } from "@/content/content";

/**
 * The airport kiosk from the team's render: a wooden cabinet about 7 ft tall on a
 * 2.5 ft square footprint, a touchscreen tower, an overhead camera and projector
 * arm, a folding ledge where the light lands, a paper dispenser and storage below.
 * World units are centimeters; x runs to the back right, y toward the viewer, z up.
 */

const S = 2.6;
const COS30 = Math.cos(Math.PI / 6);
const ORIGIN: Pt = [400, 650];
const iso = makeProjector(S, ORIGIN);
const W = 76;
const D = 76;

const wood = { top: "var(--color-wood-top)", left: "var(--color-wood-left)", right: "var(--color-wood-right)" };
const dark = { top: "var(--color-device-face)", left: "var(--color-device)", right: "var(--color-device)" };

function Box({ at, size, colors }: { at: Vec3; size: Vec3; colors: typeof wood }) {
  const faces = iso.box(at[0], at[1], at[2], size[0], size[1], size[2]);
  return (
    <g strokeLinejoin="round">
      <polygon points={polygon(faces.left)} fill={colors.left} />
      <polygon points={polygon(faces.right)} fill={colors.right} />
      <polygon points={polygon(faces.top)} fill={colors.top} />
    </g>
  );
}

/** Draws flat content onto the face that looks toward the visitor (the plane y = depth). */
function FrontFace({ depth, x, z, children }: { depth: number; x: number; z: number; children: ReactNode }) {
  const [X, Y] = iso.project([x, depth, z]);
  return <g transform={`matrix(${COS30 * S} ${0.5 * S} 0 ${S} ${X} ${Y})`}>{children}</g>;
}

/** Draws flat content onto the right-hand side face (the plane x = W), reading front to back. */
function SideFace({ y, z, children }: { y: number; z: number; children: ReactNode }) {
  const [X, Y] = iso.project([W, y, z]);
  return <g transform={`matrix(${COS30 * S} ${-0.5 * S} 0 ${S} ${X} ${Y})`}>{children}</g>;
}

const screenModels: OrigamiModel[] = ["sakura", "fuji", "crane", "koi", "kabuto", "duo"];

function ScreenContent() {
  return (
    <>
      <rect x={-3} y={-3} width={60} height={78} rx={3} fill="var(--color-screen-frame)" />
      <rect x={0} y={0} width={54} height={72} rx={1.5} fill="var(--color-screen)" />
      {screenModels.map((model, i) => (
        <g key={model}>
          <rect x={3 + (i % 3) * 16.5} y={13 + Math.floor(i / 3) * 19} width={15} height={17} rx={2} fill={model === "fuji" ? "var(--color-macaw-soft)" : "var(--color-paper-sunk)"} />
          {model === "duo" ? (
            <text x={10.5 + (i % 3) * 16.5} y={25 + Math.floor(i / 3) * 19} textAnchor="middle" fontSize={9} fontWeight={800} fill="var(--color-accent)">
              ?
            </text>
          ) : (
            <svg x={4.5 + (i % 3) * 16.5} y={14 + Math.floor(i / 3) * 19} width={12} height={12} viewBox="0 0 200 200" overflow="visible">
              <OrigamiIcon model={model} label="" className="" />
            </svg>
          )}
        </g>
      ))}
      <rect x={4} y={56} width={46} height={7} rx={3.5} fill="var(--color-accent)" />
    </>
  );
}

function SidePanel({ jp }: { jp: string }) {
  const lines = jp.split(" ");
  return (
    <>
      {lines.map((line, i) => (
        <text key={line} x={8} y={14 + i * 11} fontSize={9} fontWeight={800} fill="var(--color-ink)" fontFamily="var(--font-jp)">
          {line}
        </text>
      ))}
      {[
        [56, 62, 4.5],
        [64, 70, 3.5],
        [50, 72, 3],
        [62, 58, 3],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="var(--color-sakura)" />
      ))}
      <path d="M44 80 Q54 70 68 62" fill="none" stroke="var(--color-wood-dark)" strokeWidth={1.2} strokeLinecap="round" />
    </>
  );
}

const COMPACT_VIEWBOX = "105 70 554 860";

const sheetCorners: Vec3[] = [[22, 56, 95.6], [54, 56, 95.6], [54, 86, 95.6], [22, 86, 95.6]];
const lensCorners: Vec3[] = [[32, 62, 206], [44, 62, 206], [44, 74, 206], [32, 74, 206]];

export type KioskLabels = { head: string; screen: string; workspace: string; dispenser: string; storage: string };

export const kioskAnchors: Record<keyof KioskLabels, Pt> = {
  head: iso.project([38, 68, 214]),
  screen: iso.project([62, 22, 160]),
  workspace: iso.project([60, 80, 95]),
  dispenser: iso.project([52, D, 77]),
  storage: iso.project([60, D, 36]),
};

type KioskProps = { labels?: KioskLabels; sideJp: string; height?: string; edge?: string };

/** With labels, the drawing carries callouts and dimensions; without them, it's the kiosk alone, framed tight. */
export function Kiosk({ labels, sideJp, height, edge }: KioskProps) {
  const cone = hull([...sheetCorners, ...lensCorners].map(iso.project));
  const viewBox = labels ? "0 0 1150 900" : COMPACT_VIEWBOX;
  return (
    <svg viewBox={viewBox} className="h-full w-full" role="img" aria-label="Kiosk: a tall wooden cabinet with a touchscreen, an overhead camera and projector, a folding ledge, a paper dispenser and storage">
      <polygon points={polygon(iso.floorRect(-14, -14, W + 28, D + 44, 0))} fill="var(--color-line)" opacity={0.7} />
      <Box at={[0, 0, 0]} size={[W, D, 6]} colors={dark} />
      <Box at={[0, 0, 6]} size={[W, D, 84]} colors={wood} />
      <FrontFace depth={D} x={0} z={90}>
        <rect x={6} y={22} width={31} height={56} rx={2} fill="var(--color-wood-right)" opacity={0.35} />
        <rect x={39} y={22} width={31} height={56} rx={2} fill="var(--color-wood-right)" opacity={0.35} />
        <circle cx={34} cy={48} r={1.4} fill="var(--color-wood-dark)" />
        <circle cx={42} cy={48} r={1.4} fill="var(--color-wood-dark)" />
        <rect x={16} y={10} width={44} height={6} rx={2} fill="var(--color-device)" />
      </FrontFace>
      <polygon points={polygon(iso.floorRect(24, D, 28, 16, 77))} fill="var(--color-sakura)" />
      <SideFace y={D} z={88}>
        <SidePanel jp={sideJp} />
      </SideFace>
      <Box at={[0, 0, 90]} size={[W, 96, 5]} colors={wood} />
      <polygon points={polygon(iso.floorRect(12, 48, 52, 42, 95.2))} fill="var(--color-paper-sunk)" />
      <polygon points={polygon(sheetCorners.map(iso.project))} fill="var(--color-sakura)" />
      <Box at={[0, 0, 95]} size={[W, 22, 118]} colors={wood} />
      <FrontFace depth={22.2} x={11} z={204}>
        <ScreenContent />
      </FrontFace>
      <ProjectedLight cone={cone} />
      <Box at={[34, 6, 213]} size={[8, 8, 14]} colors={dark} />
      <Box at={[34, 6, 221]} size={[8, 68, 6]} colors={dark} />
      <Box at={[26, 56, 206]} size={[24, 24, 16]} colors={dark} />
      <circle cx={iso.project([38, 80, 214])[0]} cy={iso.project([38, 80, 214])[1]} r={6} fill="var(--color-accent)" className="projected" />
      {height && edge ? <Dimensions height={height} edge={edge} /> : null}
      {labels ? <Callouts labels={labels} /> : null}
    </svg>
  );
}

function ProjectedLight({ cone }: { cone: Pt[] }) {
  const crease: [Pt, Pt] = [iso.project([22, 86, 95.8]), iso.project([54, 56, 95.8])];
  return (
    <g>
      <motion.polygon
        points={polygon(cone)}
        fill="var(--color-accent)"
        initial={{ opacity: 0.12 }}
        animate={{ opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.line
        x1={crease[0][0]}
        y1={crease[0][1]}
        initial={{ x2: crease[0][0], y2: crease[0][1] }}
        animate={{ x2: crease[1][0], y2: crease[1][1] }}
        transition={{ duration: duration.slow, delay: 0.6, ease: ease.fold }}
        stroke="var(--color-accent)"
        strokeWidth={4}
        strokeDasharray="10 7"
        strokeLinecap="round"
        className="projected"
      />
    </g>
  );
}

function Dimensions({ height, edge }: { height: string; edge: string }) {
  const [bx, by] = iso.project([0, D, 0]);
  const top = by - 213 * S;
  const lx = bx - 60;
  const front = [iso.project([0, D, 0]), iso.project([W, D, 0])];
  const side = [iso.project([W, D, 0]), iso.project([W, 0, 0])];
  const offsetFront: Pt = [-16, 34];
  const offsetSide: Pt = [16, 34];
  return (
    <g stroke="var(--color-ink-faint)" strokeWidth={2} fill="var(--color-ink-muted)" fontSize={24} fontWeight={700}>
      <line x1={lx} y1={by} x2={lx} y2={top} />
      <line x1={lx - 10} y1={by} x2={lx + 10} y2={by} />
      <line x1={lx - 10} y1={top} x2={lx + 10} y2={top} />
      <text x={lx - 18} y={(by + top) / 2} textAnchor="middle" stroke="none" transform={`rotate(-90 ${lx - 18} ${(by + top) / 2})`}>
        {height}
      </text>
      <EdgeDimension a={front[0]} b={front[1]} offset={offsetFront} label={edge} angle={30} />
      <EdgeDimension a={side[0]} b={side[1]} offset={offsetSide} label={edge} angle={-30} />
    </g>
  );
}

function EdgeDimension({ a, b, offset, label, angle }: { a: Pt; b: Pt; offset: Pt; label: string; angle: number }) {
  const p = (q: Pt): Pt => [q[0] + offset[0], q[1] + offset[1]];
  const [x1, y1] = p(a);
  const [x2, y2] = p(b);
  const mx = (x1 + x2) / 2 + offset[0] * 0.9;
  const my = (y1 + y2) / 2 + offset[1] * 0.9;
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <text x={mx} y={my} textAnchor="middle" stroke="none" transform={`rotate(${angle} ${mx} ${my})`}>
        {label}
      </text>
    </>
  );
}

const labelRows: { key: keyof KioskLabels; y: number }[] = [
  { key: "head", y: 150 },
  { key: "screen", y: 300 },
  { key: "workspace", y: 450 },
  { key: "dispenser", y: 570 },
  { key: "storage", y: 690 },
];

function Callouts({ labels }: { labels: KioskLabels }) {
  const labelX = 700;
  return (
    <g>
      {labelRows.map(({ key, y }) => {
        const [ax, ay] = kioskAnchors[key];
        return (
          <g key={key}>
            <polyline points={polygon([[ax, ay], [labelX - 40, y - 9], [labelX - 14, y - 9]])} fill="none" stroke="var(--color-ink-faint)" strokeWidth={2} />
            <circle cx={ax} cy={ay} r={6} fill="var(--color-ink)" />
            <text x={labelX} y={y} fontSize={30} fontWeight={700} fill="var(--color-ink)">
              {labels[key]}
            </text>
          </g>
        );
      })}
    </g>
  );
}
