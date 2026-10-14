"use client";

import { circle, roundedPolygon, roundedRect, semicircle } from "@/lib/shapes";
import { naraShapeCounts, type ShapeKind } from "./Nara";

const shapes: { kind: ShapeKind; d: string }[] = [
  { kind: "roundedSquare", d: roundedRect(8, 8, 64, 64, 16) },
  { kind: "circle", d: circle(40, 40, 33) },
  { kind: "roundedTriangle", d: roundedPolygon([[40, 6], [76, 70], [4, 70]], 10) },
  { kind: "semicircle", d: semicircle(40, 24, 36, "top") },
];

/**
 * The four shapes from Duolingo's character guide. Hovering one lights up
 * every part of Nara made from it; the count says how many parts that is.
 */
export function ShapeKit({
  labels,
  active,
  onHover,
}: {
  labels: Record<ShapeKind, string>;
  active: ShapeKind | null;
  onHover: (kind: ShapeKind | null) => void;
}) {
  return (
    <ul className="flex flex-col gap-6" onMouseLeave={() => onHover(null)}>
      {shapes.map((shape) => {
        const lit = active === shape.kind;
        return (
          <li key={shape.kind}>
            <button
              type="button"
              onMouseEnter={() => onHover(shape.kind)}
              onFocus={() => onHover(shape.kind)}
              onClick={() => onHover(lit ? null : shape.kind)}
              className="flex w-full items-center gap-5 text-left"
              aria-pressed={lit}
            >
              <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0" aria-hidden="true">
                <path
                  d={shape.d}
                  fill={lit ? "var(--color-accent-soft)" : "var(--color-paper-raised)"}
                  stroke={lit ? "var(--color-accent-ink)" : "var(--color-ink-muted)"}
                  strokeWidth={lit ? 4 : 2.5}
                />
              </svg>
              <span className={`text-small font-bold ${lit ? "text-accent-ink" : "text-ink"}`}>
                {labels[shape.kind]}
                <span className="block text-ink-muted font-semibold">{naraShapeCounts[shape.kind]} parts</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
