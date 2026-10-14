"use client";

import { useState } from "react";
import { Nara, type ShapeKind } from "@/components/art/Nara";
import { ShapeKit } from "@/components/art/ShapeKit";
import { config } from "@/content/config";
import { meetNara } from "@/content/content";
import { KeyValueList, Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

export function MeetNaraSlide({ step }: SlideProps) {
  const [highlight, setHighlight] = useState<ShapeKind | null>(null);
  const colored = step >= 2;
  return (
    <SlideShell heading={meetNara.heading}>
      <div className="absolute left-24 top-[200px] w-[560px]">
        <Nara mode={colored ? "color" : "wire"} highlight={highlight} bowing={step >= 3} title={config.characterName} />
      </div>
      <div className="absolute left-[680px] top-[260px] w-[340px]" data-no-advance>
        <ShapeKit labels={meetNara.shapeLabels} active={highlight} onHover={setHighlight} />
      </div>
      <div className="absolute left-[1080px] top-[250px] w-[740px]">
        <KeyValueList rows={meetNara.profile} keyWidth={210} visibleCount={step >= 3 ? meetNara.profile.length : 0} />
        <Reveal show={step >= 3} delay={0.5} className="mt-12">
          <p className="text-lead text-ink">{meetNara.history}</p>
        </Reveal>
      </div>
    </SlideShell>
  );
}
