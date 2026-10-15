"use client";

import { ArrowsLeftRight, ChatCircleDots, CursorClick, Microphone, type Icon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { FujiPaper } from "@/components/art/FujiPaper";
import { OrigamiIcon } from "@/components/art/OrigamiIcon";
import { folds, lessonOverview, questions, type ExerciseKind } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import { Jp, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

const exerciseIcons: Record<ExerciseKind, Icon> = {
  speak: Microphone,
  choose: CursorClick,
  word: ChatCircleDots,
  match: ArrowsLeftRight,
};

/** Step 1: the ten questions. Step 2: each set of three questions joins the fold it unlocks, and question 10 finishes the model. */
export function LessonOverviewSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={lessonOverview.heading}>
      <ol className="absolute left-24 right-24 top-[200px] grid grid-cols-10 gap-3">
        {questions.map((question, i) => (
          <QuestionCard key={question.n} index={i} />
        ))}
      </ol>
      <ol className="absolute left-24 right-24 top-[478px] grid grid-cols-10 gap-3">
        {folds.map((fold, i) => (
          <FoldCell key={fold.n} index={i} show={step >= 2} />
        ))}
        <DoneCell show={step >= 2} />
      </ol>
    </SlideShell>
  );
}

function QuestionCard({ index }: { index: number }) {
  const question = questions[index];
  const ExerciseIcon = exerciseIcons[question.kind];
  const long = question.topic.jp.length > 3;
  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.base, delay: index * 0.06, ease: ease.outSoft }}
      className="flex h-[262px] flex-col items-center justify-between rounded-card bg-paper-raised px-2 pb-5 pt-4 shadow-tile"
    >
      <span className="text-small font-extrabold text-ink-muted">Q{question.n}</span>
      <Jp className={`whitespace-nowrap text-center font-extrabold text-ink ${long ? "text-jp-sm" : "text-jp-md"}`}>{question.topic.jp}</Jp>
      <span className="text-small text-ink">{question.topic.romaji}</span>
      <ExerciseIcon size={38} weight="bold" className="text-accent-ink" aria-label={question.kind} />
    </motion.li>
  );
}

const appear = (show: boolean, delay: number) => ({
  initial: false as const,
  animate: { opacity: show ? 1 : 0, y: show ? 0 : 24 },
  transition: { duration: duration.base, delay: show ? delay : 0 },
});

/** Three dashed creases run from a set of three questions into the fold they unlock. */
function FoldCell({ index, show }: { index: number; show: boolean }) {
  const fold = folds[index];
  return (
    <motion.li className="col-span-3 flex flex-col items-center" {...appear(show, 0.2 + index * 0.15)}>
      <svg width="100%" height="64" viewBox="0 0 510 64" preserveAspectRatio="none" aria-hidden="true">
        <path d="M81 0 L255 46 M255 0 L255 46 M429 0 L255 46 M255 46 L255 64" fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeDasharray="10 8" strokeLinecap="round" />
      </svg>
      <div className="mt-6 h-[170px] w-[300px]">
        <FujiPaper state={fold.n} tight className="h-full w-full" label={`After fold ${fold.n}: ${fold.instruction}`} />
      </div>
      <p className="mt-6 text-body font-bold text-ink">Fold {fold.n}</p>
      <p className="mt-1 max-w-[440px] text-center text-small text-ink-muted">{fold.instruction}</p>
    </motion.li>
  );
}

/** Question 10 comes once the mountain stands: the lesson ends with a badge. */
function DoneCell({ show }: { show: boolean }) {
  return (
    <motion.li className="col-span-1 flex flex-col items-center" {...appear(show, 0.7)}>
      <svg width="4" height="140" aria-hidden="true">
        <line x1="2" y1="0" x2="2" y2="140" stroke="var(--color-accent)" strokeWidth="4" strokeDasharray="10 8" strokeLinecap="round" />
      </svg>
      <div className="grid h-[118px] w-[118px] place-items-center rounded-pill bg-bee shadow-badge">
        <OrigamiIcon model="fuji" label="Mt. Fuji badge" className="h-[76px] w-[76px]" />
      </div>
      <p className="mt-[34px] text-body font-bold text-ink">Done</p>
    </motion.li>
  );
}
