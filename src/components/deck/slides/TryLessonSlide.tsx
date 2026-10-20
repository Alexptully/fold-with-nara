"use client";

import { ArrowCounterClockwise, CheckCircle, LockSimple } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useState } from "react";
import { FoldPlayer, FujiPaper } from "@/components/art/FujiPaper";
import type { ExerciseOutcome } from "@/components/lesson/Exercises";
import { LessonCard, type CardView } from "@/components/lesson/LessonCard";
import { Button } from "@/components/ui/Button";
import { demoQuestions, foldUnlockedBy, foldsDoneBefore, questions, tryLesson, type Fold, type Guidance } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import { SlideShell } from "../primitives";
import type { SlideProps } from "../types";
import { useReportToKiosk } from "../useKioskLink";

const guidanceLabel: Record<Guidance, string> = {
  show: "Watch the fold",
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
  const [view, setView] = useState<CardView>({ outcome: print ? "solved" : "open", selected: null, listening: false });
  // Each replay remounts the paper, so the fold plays again from the last step.
  const [runs, setRuns] = useState(0);
  const answered = isAnswered(view.outcome);
  useReportToKiosk({ lesson: { question: question.n, ...view, replays: runs, finishing } });
  return (
    <>
      <div className="absolute left-24 top-[176px] w-[620px]">
        <p className="text-body font-bold text-ink-muted">
          Stop {question.n}: {question.place}
        </p>
        <div className="relative mt-2 h-[560px] w-[560px]">
          <LessonPaper key={runs} fold={fold?.n ?? null} done={foldsDoneBefore(question.n)} play={answered} print={print} />
          <StatusBadge answered={answered} />
        </div>
        {fold ? <FoldCaption fold={fold} answered={answered} onReplay={print ? null : () => setRuns((count) => count + 1)} /> : null}
      </div>
      <div className="absolute right-24 top-[176px] h-[836px] w-[1050px]">
        <LessonCard question={question} print={print} finishing={finishing} onAdvance={advance} onView={setView} />
      </div>
    </>
  );
}

/**
 * The paper starts as the last fold left it, without popping in again. A right
 * answer plays the next fold on it: crease, flap, and the new shape.
 */
function LessonPaper({ fold, done, play, print }: { fold: number | null; done: number; play: boolean; print: boolean }) {
  if (fold === null) return <FujiPaper state={done} appear={false} className="h-full w-full" />;
  return <FoldPlayer fold={fold} play={play} instant={print} className="h-full w-full" />;
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

function FoldCaption({ fold, answered, onReplay }: { fold: Fold; answered: boolean; onReplay: (() => void) | null }) {
  return (
    <motion.div key={String(answered)} className="mt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <p className={`text-h3 ${answered ? "text-ink" : "text-ink-faint"}`}>
        Fold {fold.n}: {fold.instruction}
      </p>
      <div className="mt-3 flex min-h-[72px] items-center justify-between gap-6">
        <p className={`text-body font-bold ${answered ? "text-accent-ink" : "text-ink-faint"}`}>
          {answered ? guidanceLabel[fold.guidance] : tryLesson.lockedLabel}
        </p>
        {answered && onReplay ? <ReplayButton onReplay={onReplay} /> : null}
      </div>
    </motion.div>
  );
}

/** Plays the fold again from the last step, as many times as the presenter likes. */
function ReplayButton({ onReplay }: { onReplay: () => void }) {
  return (
    <Button variant="chunky" onClick={onReplay} className="flex items-center gap-3 px-6" data-no-advance>
      <ArrowCounterClockwise size={30} weight="bold" aria-hidden="true" />
      {tryLesson.replayLabel}
    </Button>
  );
}
