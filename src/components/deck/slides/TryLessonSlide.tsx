"use client";

import { LockSimple } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useState } from "react";
import { CranePaper } from "@/components/art/CranePaper";
import type { ExerciseOutcome } from "@/components/lesson/Exercises";
import { LessonCard } from "@/components/lesson/LessonCard";
import { demoQuestions, folds, questions, tryLesson, type Guidance } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import { SlideShell } from "../primitives";
import type { SlideProps } from "../types";

const guidanceLabel: Record<Guidance, string> = {
  show: "Full demo on the paper",
  mark: "Lines and arrows only",
  try: "Your turn, hints if you pause",
};

/** Three of the ten questions, live: one build step each. */
export const demoIndexFor = (step: number) => demoQuestions[Math.min(step, demoQuestions.length) - 1] - 1;

export function TryLessonSlide({ step, print, advance }: SlideProps) {
  const index = demoIndexFor(step);
  const question = questions[index];
  return (
    <SlideShell heading={tryLesson.heading}>
      <LessonStage key={step} questionIndex={index} print={print} advance={advance} />
      <p className="sr-only">
        Question {question.n} of {questions.length}
      </p>
    </SlideShell>
  );
}

function LessonStage({ questionIndex, print, advance }: { questionIndex: number; print: boolean; advance: () => void }) {
  const question = questions[questionIndex];
  const fold = folds[questionIndex];
  const [outcome, setOutcome] = useState<ExerciseOutcome>(print ? "solved" : "open");
  const unlocked = outcome === "solved" || outcome === "explained";
  return (
    <>
      <div className="absolute left-24 top-[190px] w-[600px]">
        <p className="text-small font-bold text-ink-muted">
          Stop {question.n}: {question.place}
        </p>
        <div className="relative mt-4 h-[600px] w-[600px]">
          <CranePaper state={fold.n - 1} guide={unlocked ? fold.n : null} guidance={fold.guidance} />
          {!unlocked ? <LockBadge /> : null}
        </div>
        <FoldCaption unlocked={unlocked} foldNumber={fold.n} instruction={fold.instruction} guidance={fold.guidance} />
      </div>
      <div className="absolute right-24 top-[176px] h-[836px] w-[1050px]">
        <LessonCard question={question} print={print} onAdvance={advance} onOutcome={setOutcome} />
      </div>
    </>
  );
}

function LockBadge() {
  return (
    <motion.div
      className="absolute right-4 top-4 grid h-20 w-20 place-items-center rounded-pill bg-paper-raised text-ink-muted shadow-card"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: duration.base, ease: ease.outSoft }}
    >
      <LockSimple size={40} weight="bold" aria-label="Next fold locked until the question is answered" />
    </motion.div>
  );
}

function FoldCaption({ unlocked, foldNumber, instruction, guidance }: { unlocked: boolean; foldNumber: number; instruction: string; guidance: Guidance }) {
  return (
    <motion.div key={String(unlocked)} className="mt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <p className={`text-h3 ${unlocked ? "text-ink" : "text-ink-faint"}`}>
        Fold {foldNumber}: {instruction}
      </p>
      <p className={`mt-2 text-small font-bold ${unlocked ? "text-accent-ink" : "text-ink-faint"}`}>
        {unlocked ? guidanceLabel[guidance] : "Unlocks with a right answer"}
      </p>
    </motion.div>
  );
}
