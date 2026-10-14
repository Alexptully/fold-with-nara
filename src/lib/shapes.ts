// Path builders for the four shapes in Duolingo's character guide
// (rounded square, circle, rounded triangle, semicircle) plus plain polygons.

export type Pt = readonly [number, number];

const fmt = (n: number) => Math.round(n * 100) / 100;
const pt = (p: Pt) => `${fmt(p[0])} ${fmt(p[1])}`;

function towards(from: Pt, to: Pt, distance: number): Pt {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.hypot(dx, dy) || 1;
  const t = Math.min(distance, length / 2) / length;
  return [from[0] + dx * t, from[1] + dy * t];
}

/** A polygon whose corners are softened with quadratic curves. */
export function roundedPolygon(points: Pt[], radius: number): string {
  const n = points.length;
  const segments = points.map((corner, i) => {
    const before = towards(corner, points[(i - 1 + n) % n], radius);
    const after = towards(corner, points[(i + 1) % n], radius);
    const move = i === 0 ? "M" : "L";
    return `${move}${pt(before)} Q${pt(corner)} ${pt(after)}`;
  });
  return `${segments.join(" ")} Z`;
}

export function roundedRect(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.min(r, w / 2, h / 2);
  return [
    `M${fmt(x + rr)} ${fmt(y)}`,
    `H${fmt(x + w - rr)}`,
    `A${rr} ${rr} 0 0 1 ${fmt(x + w)} ${fmt(y + rr)}`,
    `V${fmt(y + h - rr)}`,
    `A${rr} ${rr} 0 0 1 ${fmt(x + w - rr)} ${fmt(y + h)}`,
    `H${fmt(x + rr)}`,
    `A${rr} ${rr} 0 0 1 ${fmt(x)} ${fmt(y + h - rr)}`,
    `V${fmt(y + rr)}`,
    `A${rr} ${rr} 0 0 1 ${fmt(x + rr)} ${fmt(y)}`,
    "Z",
  ].join(" ");
}

export function circle(cx: number, cy: number, r: number): string {
  return `M${fmt(cx - r)} ${fmt(cy)} A${r} ${r} 0 1 0 ${fmt(cx + r)} ${fmt(cy)} A${r} ${r} 0 1 0 ${fmt(cx - r)} ${fmt(cy)} Z`;
}

/** A half circle. "top" keeps the flat edge on top, so the curve hangs below. */
export function semicircle(cx: number, cy: number, r: number, flat: "top" | "bottom"): string {
  const sweep = flat === "top" ? 0 : 1;
  return `M${fmt(cx - r)} ${fmt(cy)} A${r} ${r} 0 0 ${sweep} ${fmt(cx + r)} ${fmt(cy)} Z`;
}

export function polygon(points: Pt[]): string {
  return points.map(pt).join(" ");
}

export function line(points: Pt[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${pt(p)}`).join(" ");
}

export function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${fmt(cx - rx)} ${fmt(cy)} A${rx} ${ry} 0 1 0 ${fmt(cx + rx)} ${fmt(cy)} A${rx} ${ry} 0 1 0 ${fmt(cx - rx)} ${fmt(cy)} Z`;
}

/** A heart centered on (cx, cy); s is roughly its half-width. */
export function heart(cx: number, cy: number, s: number): string {
  const p = (dx: number, dy: number) => `${fmt(cx + dx * s)} ${fmt(cy + dy * s)}`;
  return `M${p(0, 0.95)} C${p(-1.45, 0.1)} ${p(-0.95, -1)} ${p(0, -0.38)} C${p(0.95, -1)} ${p(1.45, 0.1)} ${p(0, 0.95)} Z`;
}

/**
 * Mirrors a path across the vertical line x = axis. Only for paths built from
 * M, L, Q, C and Z, where every number is part of an x,y pair.
 */
export function mirrorX(d: string, axis: number): string {
  let isX = true;
  return d.replace(/-?\d+(\.\d+)?/g, (num) => {
    const value = isX ? fmt(axis * 2 - Number(num)) : Number(num);
    isX = !isX;
    return String(value);
  });
}
