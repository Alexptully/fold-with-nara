"use client";

import { motion } from "motion/react";
import { duration, ease } from "@/lib/motion";
import { polygon, roundedRect, circle, type Pt } from "@/lib/shapes";
import { OrigamiIcon } from "./OrigamiIcon";
import type { OrigamiModel } from "@/content/content";

/**
 * The event pop-up from the team's render: a dome made of white folded-paper
 * facets with an arched entrance. Inside, folding stations line the walls under
 * a canopy of hanging origami and paper lanterns. Drawn front-on in 1000 by 640.
 */

const A: Pt[] = [
  [60, 600], [40, 430], [110, 300], [210, 205], [300, 250], [400, 145],
  [500, 212], [610, 136], [710, 218], [810, 168], [900, 290], [962, 440], [950, 600],
];
const B: Pt[] = [
  [130, 470], [230, 360], [330, 330], [420, 300], [520, 320], [610, 290], [700, 322], [800, 322], [880, 420],
];
const E: Pt[] = [[330, 600], [322, 468], [382, 390], [480, 350], [580, 360], [660, 410], [692, 500], [692, 600]];
const C1: Pt = [200, 600];
const C3: Pt = [830, 600];

type Tri = [Pt, Pt, Pt];

// Upper band: alternate peaks (pointing up) and valleys between the outline and the inner ridge.
const upper: Tri[] = [
  [A[0], A[1], B[0]], [A[1], A[2], B[0]], [A[2], B[1], B[0]], [A[2], A[3], B[1]], [A[3], A[4], B[1]],
  [A[4], B[2], B[1]], [A[4], A[5], B[2]], [A[5], B[3], B[2]], [A[5], A[6], B[3]], [A[6], B[4], B[3]],
  [A[6], A[7], B[4]], [A[7], B[5], B[4]], [A[7], A[8], B[5]], [A[8], B[6], B[5]], [A[8], A[9], B[6]],
  [A[9], B[7], B[6]], [A[9], A[10], B[7]], [A[10], B[8], B[7]], [A[10], A[11], B[8]], [A[11], A[12], B[8]],
];

// Lower band: the walls on each side of the entrance and the facets over the arch.
const lower: Tri[] = [
  [A[0], B[0], C1], [B[0], B[1], C1], [B[1], E[1], C1], [C1, E[1], E[0]], [B[1], E[2], E[1]], [B[1], B[2], E[2]],
  [B[2], B[3], E[2]], [B[3], E[3], E[2]], [B[3], B[4], E[3]], [B[4], E[4], E[3]], [B[4], B[5], E[4]], [B[5], B[6], E[4]],
  [B[6], E[5], E[4]], [B[6], B[7], E[5]], [B[7], E[6], E[5]], [B[7], B[8], E[6]], [B[8], C3, E[6]], [C3, E[7], E[6]], [B[8], A[12], C3],
];

const shades = ["var(--color-shell-top)", "var(--color-shell-left)", "var(--color-shell-right)", "var(--color-shell-deep)"];

/** Light comes from the upper left: left-hand facets are brighter, alternate folds trade tones. */
function shadeFor(tri: Tri, index: number, band: "upper" | "lower"): string {
  const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
  const left = cx < 480;
  const odd = index % 2 === 1;
  if (band === "upper") return shades[(left ? 0 : 1) + (odd ? 1 : 0)];
  return shades[left ? 1 : 2 + (odd ? 1 : 0)];
}

const Facets = ({ tris, band }: { tris: Tri[]; band: "upper" | "lower" }) => (
  <>
    {tris.map((tri, i) => (
      <polygon key={i} points={polygon(tri)} fill={shadeFor(tri, i, band)} stroke="var(--color-shell-deep)" strokeWidth={1.2} strokeLinejoin="round" />
    ))}
  </>
);

const hanging: { model: OrigamiModel; x: number; drop: number }[] = [
  { model: "crane", x: 400, drop: 40 },
  { model: "sakura", x: 440, drop: 70 },
  { model: "crane", x: 492, drop: 30 },
  { model: "sakura", x: 540, drop: 60 },
  { model: "crane", x: 590, drop: 44 },
  { model: "koi", x: 630, drop: 74 },
];

function Interior() {
  return (
    <g>
      <defs>
        <clipPath id="tent-door">
          <polygon points={polygon(E)} />
        </clipPath>
      </defs>
      <g clipPath="url(#tent-door)">
        <rect x={300} y={330} width={420} height={280} fill="var(--color-wood-top)" />
        <polygon points={polygon([[420, 460], [470, 400], [520, 460]])} fill="var(--color-fuji-light)" opacity={0.7} />
        <polygon points={polygon([[470, 400], [458, 416], [482, 416]])} fill="var(--color-snow)" />
        {[[380, 440], [392, 452], [372, 458], [600, 440], [612, 428], [626, 446]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={7} fill="var(--color-sakura)" />
        ))}
        <rect x={300} y={540} width={420} height={70} fill="var(--color-wood-left)" />
        <Station x={360} />
        <Station x={560} />
        <path d={roundedRect(452, 500, 22, 44, 11)} fill="var(--color-ink-faint)" />
        <path d={circle(463, 488, 12)} fill="var(--color-ink-faint)" />
        {hanging.map((item, i) => (
          <HangingOrigami key={i} {...item} index={i} />
        ))}
        <Lantern x={360} y={392} />
        <Lantern x={652} y={420} />
      </g>
      <polygon points={polygon([E[1], E[2], E[3], [E[3][0] + 6, E[3][1] + 16], [E[2][0] + 14, E[2][1] + 14], [E[1][0] + 16, E[1][1] + 8], [E[0][0] + 16, E[0][1]], E[0]])} fill="var(--color-shell-deep)" />
    </g>
  );
}

/** One folding station: desk, screen, overhead arm and the green light on the paper. */
function Station({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={520} width={110} height={12} rx={3} fill="var(--color-wood-dark)" />
      <rect x={x + 10} y={532} width={8} height={40} fill="var(--color-wood-dark)" />
      <rect x={x + 92} y={532} width={8} height={40} fill="var(--color-wood-dark)" />
      <rect x={x + 30} y={462} width={50} height={58} rx={4} fill="var(--color-screen-frame)" />
      <rect x={x + 34} y={466} width={42} height={50} rx={2} fill="var(--color-screen)" />
      <rect x={x + 40} y={504} width={30} height={6} rx={3} fill="var(--color-accent)" />
      <path d={`M${x + 55} 430 L${x + 55} 450`} stroke="var(--color-device)" strokeWidth={5} />
      <rect x={x + 44} y={448} width={22} height={10} rx={3} fill="var(--color-device)" />
      <motion.polygon
        points={polygon([[x + 50, 458], [x + 60, 458], [x + 78, 520], [x + 32, 520]])}
        fill="var(--color-accent)"
        animate={{ opacity: [0.12, 0.26, 0.12] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <rect x={x + 38} y={516} width={34} height={5} fill="var(--color-sakura)" />
    </g>
  );
}

function HangingOrigami({ model, x, drop, index }: { model: OrigamiModel; x: number; drop: number; index: number }) {
  return (
    <motion.g
      animate={{ rotate: [-4, 4, -4] }}
      transition={{ duration: 2.8 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: `${x}px 340px`, transformBox: "view-box" }}
    >
      <line x1={x} y1={330} x2={x} y2={340 + drop} stroke="var(--color-ink-faint)" strokeWidth={1.2} />
      <svg x={x - 18} y={336 + drop} width={36} height={36} viewBox="0 0 200 200" overflow="visible">
        <OrigamiIcon model={model} label="" />
      </svg>
    </motion.g>
  );
}

function Lantern({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y - 40} x2={x} y2={y - 14} stroke="var(--color-device)" strokeWidth={2} />
      <motion.ellipse
        cx={x}
        cy={y + 8}
        rx={26}
        ry={30}
        fill="var(--color-lantern-glow)"
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <path d={roundedRect(x - 14, y - 14, 28, 40, 12)} fill="var(--color-lantern)" />
      <rect x={x - 10} y={y - 16} width={20} height={4} rx={2} fill="var(--color-wood-dark)" />
      <rect x={x - 10} y={y + 24} width={20} height={4} rx={2} fill="var(--color-wood-dark)" />
    </g>
  );
}

/** Painted blossoms on the lower walls, and the sign on the left facet. */
function Decoration({ jp }: { jp: string }) {
  const blossoms: Pt[] = [[90, 580], [150, 584], [70, 470], [258, 576], [880, 560], [910, 520], [846, 540], [930, 580], [780, 572]];
  return (
    <g>
      {blossoms.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          {Array.from({ length: 5 }, (_, i) => {
            const a = (i * 72 - 90) * (Math.PI / 180);
            return <circle key={i} cx={x + Math.cos(a) * 7} cy={y + Math.sin(a) * 7} r={6} fill="var(--color-sakura)" />;
          })}
          <circle cx={x} cy={y} r={3} fill="var(--color-sakura-deep)" />
        </g>
      ))}
      <g transform="rotate(-10 190 520)">
        <text x={86} y={512} fontSize={30} fontWeight={800} fill="var(--color-ink)" fontFamily="var(--font-jp)">
          {jp}
        </text>
      </g>
      <text x={150} y={360} fontSize={44} fontWeight={700} fill="var(--color-accent)" fontFamily="var(--font-display)" transform="rotate(-38 210 340)">
        Duolingo
      </text>
    </g>
  );
}

function Visitor({ x, tone }: { x: number; tone: string }) {
  return (
    <g>
      <path d={roundedRect(x - 15, 560, 30, 52, 14)} fill={tone} />
      <path d={circle(x, 544, 14)} fill={tone} />
    </g>
  );
}

export function TentExterior({ jp }: { jp: string }) {
  return (
    <motion.svg
      viewBox="0 0 1000 640"
      className="h-full w-full"
      role="img"
      aria-label="Tent pop-up: a dome of white folded-paper facets with an arched entrance, folding stations, lanterns and hanging origami inside"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, ease: ease.outSoft }}
    >
      <ellipse cx={500} cy={606} rx={480} ry={22} fill="var(--color-line)" />
      <Facets tris={upper} band="upper" />
      <Facets tris={lower} band="lower" />
      <Interior />
      <Decoration jp={jp} />
      <Lantern x={300} y={440} />
      <Lantern x={716} y={450} />
      <Visitor x={760} tone="var(--color-macaw-ring)" />
      <Visitor x={262} tone="var(--color-love-soft)" />
    </motion.svg>
  );
}
