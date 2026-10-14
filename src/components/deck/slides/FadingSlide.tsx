"use client";

import { Lightbulb } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { CranePaper } from "@/components/art/CranePaper";
import { fading, folds } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import { Reveal, SlideShell } from "../primitives";
import { UseDots } from "./LessonOverviewSlide";
import type { SlideProps } from "../types";

// All three panels show the same kite fold on the square base, so the only
// thing that changes from panel to panel is how much the projector helps.
const KITE_FOLD = 4;
const SQUARE_BASE = 3;

export function FadingSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={fading.heading}>
      <div className="absolute left-24 right-24 top-[210px] grid grid-cols-3 gap-12">
        {fading.stages.map((stage, i) => (
          <FadePanel key={stage.fold} index={i} show={step >= i + 1} />
        ))}
      </div>
      <Reveal show={step >= 3} delay={0.6} className="absolute left-24 top-[910px] max-w-[1400px]">
        <p className="text-body text-ink-muted">{fading.research}</p>
      </Reveal>
    </SlideShell>
  );
}

function FadePanel({ index, show }: { index: number; show: boolean }) {
  const stage = fading.stages[index];
  const guidance = folds[stage.fold - 1].guidance;
  return (
    <motion.section
      initial={false}
      animate={{ opacity: show ? 1 : 0.15, y: show ? 0 : 20 }}
      transition={{ duration: duration.slow, ease: ease.outSoft }}
    >
      <div className="relative grid h-[480px] place-items-center rounded-card bg-paper-sunk shadow-well">
        <div className="h-[420px] w-[420px]">
          <CranePaper state={SQUARE_BASE} guide={KITE_FOLD} guidance={guidance} label={`${stage.label}: ${stage.help}`} />
        </div>
        {guidance === "try" ? <YourTurn /> : null}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <h2 className="text-h3 text-ink">Fold {stage.fold}</h2>
        <UseDots count={fading.stages.length} filled={index + 1} />
      </div>
      <p className="mt-2 text-body text-ink">{stage.help}</p>
    </motion.section>
  );
}

/** On the third kite fold the projector only offers a hint button. */
function YourTurn() {
  return (
    <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-pill bg-paper-raised px-5 py-2 text-small font-bold text-ink-muted shadow-tile">
      <Lightbulb size={26} weight="bold" aria-hidden="true" />
      Hint
    </div>
  );
}
