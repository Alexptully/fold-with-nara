// A tiny isometric projector for the kiosk and tent drawings.
// World units are centimeters; x runs to the right-back, y to the left-front, z up.

import type { Pt } from "./shapes";

const COS30 = Math.cos(Math.PI / 6);

export type Vec3 = readonly [number, number, number];

export function makeProjector(scale: number, origin: Pt) {
  const project = ([x, y, z]: Vec3): Pt => [
    origin[0] + (x - y) * COS30 * scale,
    origin[1] + (x + y) * 0.5 * scale - z * scale,
  ];
  const poly = (corners: Vec3[]) => corners.map(project);
  const box = (x: number, y: number, z: number, w: number, d: number, h: number) => ({
    top: poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]),
    left: poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]),
    right: poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]),
  });
  /** A flat rectangle lying on the plane z = height. */
  const floorRect = (x: number, y: number, w: number, d: number, z: number) =>
    poly([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]]);
  /** A rectangle drawn on the front-left face plane y = depth. */
  const leftFaceRect = (x: number, z: number, w: number, h: number, depth: number) =>
    poly([[x, depth, z], [x + w, depth, z], [x + w, depth, z + h], [x, depth, z + h]]);
  return { project, poly, box, floorRect, leftFaceRect };
}

/** Convex hull (monotone chain), used to draw a projector's light cone. */
export function hull(points: Pt[]): Pt[] {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const build = (pts: Pt[]) =>
    pts.reduce<Pt[]>((chain, p) => {
      while (chain.length >= 2 && cross(chain[chain.length - 2], chain[chain.length - 1], p) <= 0) chain.pop();
      return [...chain, p];
    }, []);
  const lower = build(sorted);
  const upper = build([...sorted].reverse());
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
