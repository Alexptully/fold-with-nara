"use client";

import { config } from "@/content/config";
import { closing } from "@/content/content";
import { Confetti } from "../Confetti";
import type { NaraSpot } from "../NaraActor";
import { Jp, Reveal } from "../primitives";

/** Nara bows on the left while the thank-you comes in on the right. */
export const closingSpot: NaraSpot = { x: 110, y: 170, h: 820, pose: "bow" };

export function ClosingSlide() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Confetti />
      <div className="absolute left-[820px] top-[330px] w-[980px]">
        <Reveal>
          <Jp className="block text-jp-lg font-extrabold text-ink">{closing.jp}</Jp>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-h2 text-accent">{closing.romaji}</p>
          <p className="mt-4 text-lead text-ink">{closing.line}</p>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="mt-20 text-body text-ink">{config.team.join(", ")}</p>
          <p className="mt-1 text-small text-ink-muted">{config.occasion}</p>
        </Reveal>
      </div>
    </div>
  );
}
