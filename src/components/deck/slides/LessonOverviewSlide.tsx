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

/**
 * Step 1: the ten questions. Step 2: dashed creases run from each question to the
 * fold it leads to. Question 1 unlocks fold 1 on its own, then questions 2 to 5
 * and 6 to 9 each unlock the next fold, and question 10 finishes the model.
 */
export function LessonOverviewSlide({ step }: SlideProps) {
  const show = step >= 2;
  return (
    <SlideShell heading={lessonOverview.heading}>
      <ol className="absolute left-24 right-24 top-[200px] grid grid-cols-10 gap-3">
        {questions.map((question, i) => (
          <QuestionCard key={question.n} index={i} />
        ))}
      </ol>
      <div className="absolute left-24 top-[478px] h-[420px] w-[1728px]">
        <Creases show={show} />
        <ol>
          {folds.map((fold, i) => (
            <FoldCell key={fold.n} index={i} show={show} />
          ))}
          <DoneCell show={show} />
        </ol>
      </div>
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

// The question cards sit in ten 162 px columns with 12 px gaps.
const columnCenter = (questionN: number) => 81 + 174 * (questionN - 1);
// Each fold sits under its own questions, nudged apart so the pictures don't touch.
const foldCenters = [200, 600, columnCenter(7.5)];
const DONE_X = columnCenter(10);
const CREASE_HEIGHT = 80;
const PICTURE_TOP = CREASE_HEIGHT + 16;

/** The questions that lead to a fold: the ones after the previous fold, up to the one that unlocks it. */
function questionsFor(index: number): number[] {
  const first = index === 0 ? 1 : folds[index - 1].unlockedBy + 1;
  return Array.from({ length: folds[index].unlockedBy - first + 1 }, (_, i) => first + i);
}

const creasePaths = [
  ...folds.map((_, i) =>
    questionsFor(i)
      .map((n) => `M${columnCenter(n)} 0 L${foldCenters[i]} ${CREASE_HEIGHT - 24}`)
      .concat(`M${foldCenters[i]} ${CREASE_HEIGHT - 24} L${foldCenters[i]} ${CREASE_HEIGHT}`)
      .join(" "),
  ),
  `M${DONE_X} 0 L${DONE_X} ${PICTURE_TOP + 26}`,
];

/** The deck's dashed crease, drawn from each question into what it unlocks. */
function Creases({ show }: { show: boolean }) {
  return (
    <svg className="absolute left-0 top-0 overflow-visible" width={1728} height={PICTURE_TOP + 26} aria-hidden="true">
      {creasePaths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="4"
          strokeDasharray="10 8"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: duration.base, delay: show ? 0.1 + i * 0.15 : 0 }}
        />
      ))}
    </svg>
  );
}

function FoldCell({ index, show }: { index: number; show: boolean }) {
  const fold = folds[index];
  return (
    <motion.li
      className="absolute flex w-[340px] flex-col items-center"
      style={{ left: foldCenters[index] - 170, top: PICTURE_TOP }}
      {...appear(show, 0.25 + index * 0.15)}
    >
      <div className="h-[170px] w-[300px]">
        <FujiPaper state={fold.n} tight className="h-full w-full" label={`After fold ${fold.n}: ${fold.instruction}`} />
      </div>
      <p className="mt-6 text-body font-bold text-ink">Fold {fold.n}</p>
      <p className="mt-1 max-w-[320px] text-center text-small text-ink-muted">{fold.instruction}</p>
    </motion.li>
  );
}

/** Question 10 comes once the mountain stands: the lesson ends with a badge. */
function DoneCell({ show }: { show: boolean }) {
  return (
    <motion.li
      className="absolute flex w-[160px] flex-col items-center"
      style={{ left: DONE_X - 80, top: PICTURE_TOP + 26 }}
      {...appear(show, 0.7)}
    >
      <div className="grid h-[118px] w-[118px] place-items-center rounded-pill bg-bee shadow-badge">
        <OrigamiIcon model="fuji" label="Mt. Fuji badge" className="h-[76px] w-[76px]" />
      </div>
      <p className="mt-[50px] text-body font-bold text-ink">Done</p>
    </motion.li>
  );
}
