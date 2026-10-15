"use client";

import { CheckCircle, LockSimple } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useState } from "react";
import { FujiPaper } from "@/components/art/FujiPaper";
import type { ExerciseOutcome } from "@/components/lesson/Exercises";
import { LessonCard } from "@/components/lesson/LessonCard";
import { demoQuestions, foldUnlockedBy, foldsDoneBefore, questions, tryLesson, type Fold, type Guidance } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import { SlideShell } from "../primitives";
import type { SlideProps } from "../types";

const guidanceLabel: Record<Guidance, string> = {
  show: "Full demo on the paper",
  mark: "Lines only this time",
  try: "Your turn, hints if you pause",
};

/** One question per fold, live: each build step answers the question that unlocks the next fold. */
export const demoIndexFor = (step: number) => demoQuestions[Math.min(step, demoQuestions.length) - 1] - 1;

export function TryLessonSlide({ step, print, advance }: SlideProps) {
  const index = demoIndexFor(step);
  const question = questions[index];
  return (
    <SlideShell heading={tryLesson.heading}>
      <LessonStage key={step} questionIndex={index} finishing={step === demoQuestions.length} print={print} advance={advance} />
      <p className="sr-only">
        Question {question.n} of {questions.length}
      </p>
    </SlideShell>
  );
}

const isAnswered = (outcome: ExerciseOutcome) => outcome === "solved" || outcome === "explained";

function LessonStage({ questionIndex, finishing, print, advance }: { questionIndex: number; finishing: boolean; print: boolean; advance: () => void }) {
  const question = questions[questionIndex];
  const fold = foldUnlockedBy(question.n);
  const [outcome, setOutcome] = useState<ExerciseOutcome>(print ? "solved" : "open");
  const answered = isAnswered(outcome);
  return (
    <>
      <div className="absolute left-24 top-[176px] w-[620px]">
        <p className="text-body font-bold text-ink-muted">
          Stop {question.n}: {question.place}
        </p>
        <div className="relative mt-2 h-[560px] w-[560px]">
          <FujiPaper state={foldsDoneBefore(question.n)} guide={answered && fold ? fold.n : null} guidance={fold?.guidance} />
          <StatusBadge answered={answered} />
        </div>
        {fold ? <FoldCaption fold={fold} answered={answered} /> : null}
      </div>
      <div className="absolute right-24 top-[176px] h-[836px] w-[1050px]">
        <LessonCard question={question} print={print} finishing={finishing} onAdvance={advance} onOutcome={setOutcome} />
      </div>
    </>
  );
}

function StatusBadge({ answered }: { answered: boolean }) {
  const Icon = answered ? CheckCircle : LockSimple;
  return (
    <motion.div
      key={String(answered)}
      className={`absolute right-0 top-2 grid h-20 w-20 place-items-center rounded-pill bg-paper-raised shadow-card ${answered ? "text-accent-ink" : "text-ink-muted"}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: duration.base, ease: ease.outSoft }}
    >
      <Icon size={42} weight="bold" aria-label={answered ? "Fold unlocked" : "Next fold locked until the question is answered"} />
    </motion.div>
  );
}

function FoldCaption({ fold, answered }: { fold: Fold; answered: boolean }) {
  return (
    <motion.div key={String(answered)} className="mt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <p className={`text-h3 ${answered ? "text-ink" : "text-ink-faint"}`}>
        Fold {fold.n}: {fold.instruction}
      </p>
      <p className={`mt-2 text-body font-bold ${answered ? "text-accent-ink" : "text-ink-faint"}`}>
        {answered ? guidanceLabel[fold.guidance] : tryLesson.lockedLabel}
      </p>
    </motion.div>
  );
}
