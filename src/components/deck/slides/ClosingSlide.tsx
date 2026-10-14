"use client";

import { CranePaper } from "@/components/art/CranePaper";
import { NaraFigure } from "@/components/art/NaraFigure";
import { config } from "@/content/config";
import { closing } from "@/content/content";
import { Jp, Reveal } from "../primitives";

export function ClosingSlide() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[150px] top-[250px] w-[520px]">
        <NaraFigure />
      </div>
      <div className="absolute left-[600px] top-[560px] h-[220px] w-[220px] -rotate-6">
        <CranePaper state={10} label="A finished paper crane" />
      </div>
      <div className="absolute left-[900px] top-[300px] w-[920px]">
        <Reveal>
          <Jp className="block text-jp-lg font-extrabold text-ink">{closing.jp}</Jp>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-h2 text-accent-ink">{closing.romaji}</p>
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
