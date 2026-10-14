"use client";

import { ArrowsLeftRight, ChatCircleDots, CursorClick, Microphone, type Icon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { CranePaper } from "@/components/art/CranePaper";
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

export function LessonOverviewSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={lessonOverview.heading}>
      <ol className="absolute left-24 right-24 top-[210px] grid grid-cols-10 gap-3">
        {questions.map((question, i) => (
          <QuestionColumn key={question.n} index={i} showFold={step >= 2} />
        ))}
      </ol>
    </SlideShell>
  );
}

function QuestionColumn({ index, showFold }: { index: number; showFold: boolean }) {
  const question = questions[index];
  const fold = folds[index];
  const ExerciseIcon = exerciseIcons[question.kind];
  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.base, delay: index * 0.07, ease: ease.outSoft }}
      className="flex flex-col items-center"
    >
      <p className="h-[64px] text-center text-small leading-tight text-ink-muted">{question.place}</p>
      <div className="flex h-[250px] w-full flex-col items-center justify-between rounded-card bg-paper-raised px-2 pb-5 pt-4 shadow-tile">
        <span className="text-small font-extrabold text-ink-muted">Q{question.n}</span>
        <Jp className={`whitespace-nowrap text-center font-extrabold text-ink ${question.topic.jp.length > 3 ? "text-jp-sm" : "text-jp-md"}`}>
          {question.topic.jp}
        </Jp>
        <span className="text-small text-ink">{question.topic.romaji}</span>
        <ExerciseIcon size={34} weight="bold" className="text-accent-ink" aria-label={question.kind} />
      </div>
      <motion.div
        className="mt-6 flex w-full flex-col items-center"
        initial={false}
        animate={{ opacity: showFold ? 1 : 0, y: showFold ? 0 : 20 }}
        transition={{ duration: duration.base, delay: showFold ? 0.3 + index * 0.08 : 0 }}
      >
        <svg width="4" height="44" aria-hidden="true">
          <line x1="2" y1="0" x2="2" y2="44" stroke="var(--color-accent)" strokeWidth="4" strokeDasharray="8 6" />
        </svg>
        <div className="mt-2 h-[150px] w-[150px]">
          <CranePaper state={fold.n} label={`After fold ${fold.n}: ${fold.instruction}`} />
        </div>
        <p className="mt-2 text-small font-bold text-ink">Fold {fold.n}</p>
      </motion.div>
    </motion.li>
  );
}
