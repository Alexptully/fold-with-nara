"use client";

import { motion } from "motion/react";
import { hull, makeProjector, type Vec3 } from "@/lib/iso";
import { duration, ease } from "@/lib/motion";
import { polygon, type Pt } from "@/lib/shapes";

/**
 * The single-visitor kiosk, about the footprint of a photo booth.
 * World units are centimeters (120 wide, 80 deep, 232 tall).
 */

const iso = makeProjector(2.25, [400, 560]);

const shell = {
  top: "var(--color-shell-top)",
  left: "var(--color-shell-left)",
  right: "var(--color-shell-right)",
};
const device = {
  top: "var(--color-device-face)",
  left: "var(--color-device)",
  right: "var(--color-device)",
};

type Faces = ReturnType<typeof iso.box>;

function Box({ faces, colors }: { faces: Faces; colors: typeof shell }) {
  return (
    <g strokeLinejoin="round">
      <polygon points={polygon(faces.left)} fill={colors.left} />
      <polygon points={polygon(faces.right)} fill={colors.right} />
      <polygon points={polygon(faces.top)} fill={colors.top} />
    </g>
  );
}

export type KioskCallout = { label: string; anchor: Pt; labelAt: Pt; align: "start" | "end" };

const paperCorners: Vec3[] = [[40, 30, 92.6], [80, 30, 92.6], [80, 70, 92.6], [40, 70, 92.6]];
const lensCorners: Vec3[] = [[50, 48, 196], [70, 48, 196], [70, 66, 196], [50, 66, 196]];

export const kioskAnchors = {
  screen: iso.project([100, 16, 150]),
  printer: iso.project([93, 80, 65]),
  frame: iso.project([98, 74, 92]),
  head: iso.project([78, 70, 206]),
};

export function Kiosk({ show = true, callouts }: { show?: boolean; callouts: string[] }) {
  const cone = hull([...paperCorners, ...lensCorners].map(iso.project));
  const crease: [Pt, Pt] = [iso.project([40, 70, 92.8]), iso.project([80, 30, 92.8])];
  const [screenLabel, printerLabel, frameLabel, headLabel] = callouts;
  const labels: KioskCallout[] = [
    { label: headLabel, anchor: kioskAnchors.head, labelAt: [620, 70], align: "start" },
    { label: screenLabel, anchor: kioskAnchors.screen, labelAt: [70, 150], align: "end" },
    { label: frameLabel, anchor: kioskAnchors.frame, labelAt: [640, 420], align: "start" },
    { label: printerLabel, anchor: kioskAnchors.printer, labelAt: [640, 610], align: "start" },
  ];
  return (
    <motion.svg
      viewBox="0 0 800 760"
      className="h-full w-full"
      role="img"
      aria-label="Kiosk: a cabinet with a folding frame on top, a screen behind it, and a projector and camera overhead"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 30 }}
      transition={{ duration: duration.slow, ease: ease.outSoft }}
    >
      <polygon points={polygon(iso.floorRect(-16, -16, 154, 114, 0))} fill="var(--color-ink)" opacity={0.07} />
      <Box faces={iso.box(0, 0, 0, 120, 80, 8)} colors={device} />
      <Box faces={iso.box(0, 0, 8, 120, 80, 84)} colors={shell} />
      <line
        x1={iso.project([120, 78, 14])[0]}
        y1={iso.project([120, 78, 14])[1]}
        x2={iso.project([120, 4, 86])[0]}
        y2={iso.project([120, 4, 86])[1]}
        stroke="var(--color-accent)"
        strokeWidth={4}
        strokeDasharray="12 9"
        strokeLinecap="round"
      />
      <polygon points={polygon(iso.leftFaceRect(76, 62, 34, 6, 80.2))} fill="var(--color-device)" />
      <polygon points={polygon(iso.floorRect(82, 80, 22, 16, 64))} fill="var(--color-sheet)" stroke="var(--color-sheet-edge)" strokeWidth={1} />
      <polygon points={polygon(iso.floorRect(22, 22, 76, 54, 92.2))} fill="var(--color-paper-sunk)" stroke="var(--color-line-strong)" strokeWidth={1.5} />
      <Box faces={iso.box(0, 0, 92, 120, 16, 140)} colors={shell} />
      <ScreenFace />
      <polygon points={polygon(paperCorners.map(iso.project))} fill="var(--color-sheet)" stroke="var(--color-sheet-edge)" strokeWidth={1.2} />
      <motion.polygon
        points={polygon(cone)}
        fill="var(--color-accent)"
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? [0.1, 0.2, 0.1] : 0 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <line x1={crease[0][0]} y1={crease[0][1]} x2={crease[1][0]} y2={crease[1][1]} stroke="var(--color-accent)" strokeWidth={3} strokeDasharray="7 5" className="projected" />
      <Box faces={iso.box(50, 16, 214, 20, 40, 10)} colors={device} />
      <Box faces={iso.box(42, 44, 196, 36, 26, 22)} colors={device} />
      <circle cx={iso.project([60, 70, 207])[0]} cy={iso.project([60, 70, 207])[1]} r={6} fill="var(--color-accent)" className="projected" />
      {labels.map((callout) => (
        <Callout key={callout.label} callout={callout} />
      ))}
    </motion.svg>
  );
}

/** The pick-a-fold screen on the front of the back tower. */
function ScreenFace() {
  const face = (x: number, z: number, w: number, h: number) => polygon(iso.leftFaceRect(x, z, w, h, 16.2));
  const nara = iso.project([30, 16.2, 190]);
  return (
    <g>
      <polygon points={face(12, 118, 96, 96)} fill="var(--color-screen)" />
      <circle cx={nara[0]} cy={nara[1]} r={14} fill="var(--color-deer)" />
      <polygon points={face(44, 182, 52, 16)} fill="var(--color-paper-raised)" opacity={0.9} />
      <polygon points={face(20, 134, 24, 30)} fill="var(--color-sheet)" />
      <polygon points={face(48, 134, 24, 30)} fill="var(--color-sheet-fold)" />
      <polygon points={face(76, 134, 24, 30)} fill="var(--color-accent)" />
    </g>
  );
}

export function Callout({ callout }: { callout: KioskCallout }) {
  const { anchor, labelAt, align, label } = callout;
  const elbow: Pt = [labelAt[0] + (align === "start" ? -14 : 14), labelAt[1] - 9];
  return (
    <g>
      <polyline
        points={polygon([anchor, [elbow[0], elbow[1]]])}
        fill="none"
        stroke="var(--color-ink-muted)"
        strokeWidth={1.6}
      />
      <circle cx={anchor[0]} cy={anchor[1]} r={5} fill="var(--color-ink)" />
      <text x={labelAt[0]} y={labelAt[1]} textAnchor={align} className="fill-ink text-small font-bold" fontSize={24}>
        {label}
      </text>
    </g>
  );
}
