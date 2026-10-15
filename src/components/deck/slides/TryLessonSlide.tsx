"use client";

import { Camera, CheckCircle, LockSimple } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useState } from "react";
import { FujiPaper } from "@/components/art/FujiPaper";
import type { ExerciseOutcome } from "@/components/lesson/Exercises";
import { LessonCard } from "@/components/lesson/LessonCard";
import { demoQuestions, foldFor, questions, roleFor, tryLesson, type Fold, type Guidance, type QuestionRole } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import { SlideShell } from "../primitives";
import type { SlideProps } from "../types";

const guidanceLabel: Record<Guidance, string> = {
  show: "Full demo on the paper",
  mark: "Lines only this time",
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

const isAnswered = (outcome: ExerciseOutcome) => outcome === "solved" || outcome === "explained";

/** What the sheet shows: before an unlock, the last fold; after it, the projector's marks. While checking, the camera frame. */
function paperProps(role: QuestionRole, fold: Fold, answered: boolean) {
  if (role === "check") return { state: fold.n, checking: !answered };
  return { state: fold.n - 1, guide: answered ? fold.n : null, guidance: fold.guidance };
}

function LessonStage({ questionIndex, print, advance }: { questionIndex: number; print: boolean; advance: () => void }) {
  const question = questions[questionIndex];
  const fold = foldFor(question.n);
  const role = roleFor(question.n);
  const [outcome, setOutcome] = useState<ExerciseOutcome>(print ? "solved" : "open");
  const answered = isAnswered(outcome);
  return (
    <>
      <div className="absolute left-24 top-[176px] w-[620px]">
        <p className="text-body font-bold text-ink-muted">
          Stop {question.n}: {question.place}
        </p>
        <div className="relative mt-2 h-[560px] w-[560px]">
          <FujiPaper {...paperProps(role, fold, answered)} />
          <StatusBadge role={role} answered={answered} />
        </div>
        <FoldCaption role={role} fold={fold} answered={answered} last={question.n === questions.length} />
      </div>
      <div className="absolute right-24 top-[176px] h-[836px] w-[1050px]">
        <LessonCard question={question} print={print} onAdvance={advance} onOutcome={setOutcome} />
      </div>
    </>
  );
}

function badgeFor(role: QuestionRole, answered: boolean) {
  if (answered) return { Icon: CheckCircle, tone: "text-accent-ink", label: "Answered" };
  if (role === "check") return { Icon: Camera, tone: "text-macaw-ink", label: "The camera is checking the fold" };
  return { Icon: LockSimple, tone: "text-ink-muted", label: "Next fold locked until the question is answered" };
}

function StatusBadge({ role, answered }: { role: QuestionRole; answered: boolean }) {
  const { Icon, tone, label } = badgeFor(role, answered);
  return (
    <motion.div
      key={`${role}-${answered}`}
      className={`absolute right-0 top-2 grid h-20 w-20 place-items-center rounded-pill bg-paper-raised shadow-card ${tone}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: duration.base, ease: ease.outSoft }}
    >
      <Icon size={42} weight="bold" aria-label={label} />
    </motion.div>
  );
}

function captionFor(role: QuestionRole, fold: Fold, answered: boolean, last: boolean) {
  if (role === "check" && answered) return { title: last ? tryLesson.finishedLine : tryLesson.checkedLine(fold.n), detail: null, lit: true };
  if (role === "check") return { title: tryLesson.checkingLabel(fold.n), detail: null, lit: true };
  return { title: `Fold ${fold.n}: ${fold.instruction}`, detail: answered ? guidanceLabel[fold.guidance] : tryLesson.lockedLabel, lit: answered };
}

function FoldCaption({ role, fold, answered, last }: { role: QuestionRole; fold: Fold; answered: boolean; last: boolean }) {
  const { title, detail, lit } = captionFor(role, fold, answered, last);
  return (
    <motion.div key={`${role}-${answered}`} className="mt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <p className={`text-h3 ${lit ? "text-ink" : "text-ink-faint"}`}>{title}</p>
      {detail ? <p className={`mt-2 text-body font-bold ${lit ? "text-accent-ink" : "text-ink-faint"}`}>{detail}</p> : null}
    </motion.div>
  );
}
