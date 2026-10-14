"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Nara, shapeCounts, type ShapeKind } from "@/components/art/nara/Nara";
import { ShapeKit } from "@/components/art/ShapeKit";
import { config } from "@/content/config";
import { meetNara } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import { KeyValueList, Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

const POSE = "smile";
const counts = shapeCounts(POSE);

export function MeetNaraSlide({ step }: SlideProps) {
  const [highlight, setHighlight] = useState<ShapeKind | null>(null);
  return (
    <SlideShell heading={meetNara.heading}>
      <div className="absolute left-24 top-[160px] h-[840px] w-[560px]">
        <SketchToColor colored={step >= 2} highlight={highlight} />
      </div>
      <div className="absolute left-[700px] top-[250px] w-[340px]" data-no-advance>
        <ShapeKit labels={meetNara.shapeLabels} counts={counts} active={highlight} onHover={setHighlight} />
      </div>
      <div className="absolute left-[1090px] top-[250px] w-[730px]">
        <KeyValueList rows={meetNara.profile} keyWidth={210} visibleCount={step >= 3 ? meetNara.profile.length : 0} />
        <Reveal show={step >= 3} delay={0.45} className="mt-12">
          <p className="text-lead text-ink">{meetNara.history}</p>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/** The construction sketch draws itself first; color fills in over it on the next press. */
function SketchToColor({ colored, highlight }: { colored: boolean; highlight: ShapeKind | null }) {
  return (
    <div className="relative h-full w-full">
      <Nara pose={POSE} mode="outline" drawIn className="absolute inset-0 h-full w-full" title={`${config.characterName}, outline sketch`} />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: colored ? 1 : 0, scale: colored ? 1 : 0.98 }}
        transition={{ duration: duration.slow, ease: ease.outSoft }}
      >
        <Nara pose={colored ? "talk" : POSE} highlight={highlight} className="h-full w-full" title={config.characterName} />
      </motion.div>
    </div>
  );
}
