"use client";

import { Lock, Question } from "@phosphor-icons/react";
import type { OrigamiModel } from "@/content/content";
import type { Pt } from "@/lib/shapes";

/**
 * Flat, faceted icons for the fold options, drawn the way folded paper looks:
 * two tones per face, light on the left and shade on the right.
 */

type Facet = { pts: Pt[]; fill: string };

// Rounded to hundredths: the server and the browser can disagree in the last digit
// of a sine, which made the page's first render mismatch.
const round = (n: number) => Math.round(n * 100) / 100;
const polar = (angleDeg: number, r: number): Pt => {
  const a = (angleDeg * Math.PI) / 180;
  return [round(100 + r * Math.cos(a)), round(100 + r * Math.sin(a))];
};

function sakuraFacets(): Facet[] {
  return Array.from({ length: 5 }, (_, i) => -90 + i * 72).flatMap((a) => [
    { pts: [[100, 100], polar(a - 24, 50), polar(a - 9, 84), polar(a, 70)], fill: "var(--color-sakura)" },
    { pts: [[100, 100], polar(a, 70), polar(a + 9, 84), polar(a + 24, 50)], fill: "var(--color-sakura-deep)" },
  ]);
}

const facets: Record<Exclude<OrigamiModel, "duo">, () => Facet[]> = {
  sakura: sakuraFacets,
  fuji: () => [
    { pts: [[16, 164], [100, 36], [100, 164]], fill: "var(--color-fuji-light)" },
    { pts: [[100, 36], [184, 164], [100, 164]], fill: "var(--color-fuji)" },
    { pts: [[100, 36], [70, 82], [84, 74], [92, 90], [100, 78]], fill: "var(--color-snow)" },
    { pts: [[100, 36], [130, 82], [116, 76], [108, 90], [100, 78]], fill: "var(--color-line)" },
  ],
  crane: () => [
    { pts: [[100, 112], [36, 34], [88, 102]], fill: "var(--color-crane-shade)" },
    { pts: [[70, 124], [100, 102], [130, 124], [100, 144]], fill: "var(--color-crane)" },
    { pts: [[70, 124], [100, 144], [130, 124]], fill: "var(--color-crane-shade)" },
    { pts: [[74, 126], [28, 68], [86, 120]], fill: "var(--color-crane)" },
    { pts: [[28, 68], [14, 84], [36, 76]], fill: "var(--color-crane-shade)" },
    { pts: [[126, 126], [180, 80], [116, 120]], fill: "var(--color-crane)" },
    { pts: [[100, 112], [156, 26], [114, 104]], fill: "var(--color-crane)" },
  ],
  koi: () => [
    { pts: [[22, 100], [64, 68], [128, 76], [150, 100]], fill: "var(--color-koi)" },
    { pts: [[22, 100], [150, 100], [128, 124], [64, 132]], fill: "var(--color-koi-light)" },
    { pts: [[148, 100], [186, 66], [174, 100]], fill: "var(--color-koi)" },
    { pts: [[148, 100], [174, 100], [186, 134]], fill: "var(--color-koi-light)" },
    { pts: [[86, 126], [98, 154], [116, 128]], fill: "var(--color-koi)" },
    { pts: [[78, 72], [96, 46], [110, 74]], fill: "var(--color-koi-light)" },
  ],
  kabuto: () => [
    { pts: [[100, 98], [48, 26], [82, 102]], fill: "var(--color-kabuto)" },
    { pts: [[100, 98], [152, 26], [118, 102]], fill: "var(--color-kabuto-shade)" },
    { pts: [[36, 136], [100, 72], [100, 136]], fill: "var(--color-kabuto)" },
    { pts: [[100, 72], [164, 136], [100, 136]], fill: "var(--color-kabuto-shade)" },
    { pts: [[22, 136], [178, 136], [158, 160], [42, 160]], fill: "var(--color-kabuto-band)" },
    { pts: [[22, 136], [8, 112], [44, 130]], fill: "var(--color-kabuto)" },
    { pts: [[178, 136], [192, 112], [156, 130]], fill: "var(--color-kabuto-shade)" },
    { pts: [[100, 78], [92, 96], [100, 112], [108, 96]], fill: "var(--color-kabuto-band)" },
  ],
};

const points = (pts: Pt[]) => pts.map((p) => p.join(",")).join(" ");

export function OrigamiIcon({ model, className, label }: { model: OrigamiModel; className?: string; label: string }) {
  if (model === "duo") return <MysteryTile className={className} label={label} />;
  return (
    <svg viewBox="0 0 200 200" className={className} role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}>
      <g style={{ filter: "var(--shadow-drop-sheet)" }} strokeLinejoin="round">
        {facets[model]().map((facet, i) => (
          <polygon key={i} points={points(facet.pts)} fill={facet.fill} />
        ))}
      </g>
      {model === "sakura" ? <circle cx={100} cy={100} r={11} fill="var(--color-bee)" /> : null}
      {model === "koi" ? <circle cx={46} cy={94} r={6} fill="var(--color-ink)" /> : null}
    </svg>
  );
}

/** The Duo option stays a locked surprise, so it shows a question mark instead of a drawing. */
function MysteryTile({ className, label }: { className?: string; label: string }) {
  return (
    <div className={`relative grid place-items-center ${className ?? ""}`} role="img" aria-label={label}>
      <div className="grid aspect-square w-[78%] place-items-center rounded-card bg-accent-soft text-accent-ink shadow-tile-correct">
        <Question size="58%" weight="bold" aria-hidden="true" />
      </div>
      <span className="absolute bottom-[4%] right-[4%] grid h-[30%] w-[30%] place-items-center rounded-pill bg-paper text-ink-muted shadow-tile">
        <Lock size="55%" weight="fill" aria-hidden="true" />
      </span>
    </div>
  );
}
