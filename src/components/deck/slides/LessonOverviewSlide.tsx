"use client";

import { ArrowsLeftRight, ChatCircleDots, CursorClick, Microphone, type Icon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { FujiPaper } from "@/components/art/FujiPaper";
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

/** Step 1: the ten questions. Step 2: every pair of questions joins the fold it belongs to. */
export function LessonOverviewSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={lessonOverview.heading}>
      <ol className="absolute left-24 right-24 top-[200px] grid grid-cols-10 gap-3">
        {questions.map((question, i) => (
          <QuestionCard key={question.n} index={i} />
        ))}
      </ol>
      <ol className="absolute left-24 right-24 top-[478px] grid grid-cols-5 gap-3">
        {folds.map((fold, i) => (
          <FoldCell key={fold.n} index={i} show={step >= 2} />
        ))}
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

/** Two dashed creases run from a pair of questions into the fold they unlock and check. */
function FoldCell({ index, show }: { index: number; show: boolean }) {
  const fold = folds[index];
  return (
    <motion.li
      className="flex flex-col items-center"
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 24 }}
      transition={{ duration: duration.base, delay: show ? 0.2 + index * 0.1 : 0 }}
    >
      <svg width="100%" height="64" viewBox="0 0 336 64" preserveAspectRatio="none" aria-hidden="true">
        <path d="M81 0 L168 46 M255 0 L168 46 M168 46 L168 64" fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeDasharray="10 8" strokeLinecap="round" />
      </svg>
      <div className="h-[230px] w-[230px]">
        <FujiPaper state={fold.n} label={`After fold ${fold.n}: ${fold.instruction}`} />
      </div>
      <p className="mt-1 text-body font-bold text-ink">Fold {fold.n}</p>
    </motion.li>
  );
}
