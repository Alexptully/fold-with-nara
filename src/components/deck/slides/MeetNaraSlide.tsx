"use client";

import { motion } from "motion/react";
import { NaraSketch, shapeCounts } from "@/components/art/nara/Nara";
import { ShapeKit } from "@/components/art/ShapeKit";
import { config } from "@/content/config";
import { meetNara } from "@/content/content";
import { duration } from "@/lib/motion";
import { SparkleBurst } from "../FlipCard";
import { headBox, useNaraHighlight, type NaraSpot } from "../NaraActor";
import { KeyValueList, Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";
import { useRevealSound } from "../useRevealSound";

const place = { x: 80, y: 170, h: 840 };

/**
 * The reveal. Nara stays off stage until here. Step 1: only her outline sketch.
 * Step 2: she pops into color with sparkles and a pop, and the shape kit appears.
 * Step 3: she starts talking and the facts come in.
 */
export function meetNaraSpot(step: number): NaraSpot {
  if (step === 1) return { ...place, pose: "smile", hidden: true };
  return { ...place, pose: step >= 3 ? "talk" : "smile" };
}

const head = headBox(meetNaraSpot(1));

export function MeetNaraSlide({ step, print }: SlideProps) {
  const { highlight, setHighlight } = useNaraHighlight();
  const pose = meetNaraSpot(step).pose;
  const revealed = step >= 2;
  useRevealSound(revealed, print, "pop", 250);
  return (
    <SlideShell heading={meetNara.heading}>
      <motion.div
        className="absolute"
        style={{ left: head.left, top: head.top, width: head.width, height: head.height }}
        initial={false}
        animate={{ opacity: step === 1 ? 1 : 0 }}
        transition={{ duration: duration.base, delay: step === 1 ? 0 : 0.6 }}
      >
        <NaraSketch highlight={highlight} className="h-full w-full" title={`${config.characterName}, outline sketch`} />
      </motion.div>
      <div className="absolute" style={{ left: head.left, top: head.top, width: head.width, height: head.height }}>
        <SparkleBurst on={revealed && !print} delay={0.25} />
      </div>
      <Reveal show={step >= 2} delay={0.3} className="absolute left-[720px] top-[250px] w-[340px]">
        <div data-no-advance>
          <ShapeKit labels={meetNara.shapeLabels} counts={shapeCounts(pose)} active={highlight} onHover={setHighlight} />
        </div>
      </Reveal>
      <div className="absolute left-[1120px] top-[290px] w-[700px]">
        <KeyValueList rows={meetNara.profile} keyWidth={220} visibleCount={step >= 3 ? meetNara.profile.length : 0} />
      </div>
    </SlideShell>
  );
}
