"use client";

import { Check, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Nara, type Pose } from "@/components/art/nara/Nara";
import { Button } from "@/components/ui/Button";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { exerciseLabels, foldFor, questions, roleFor, tryLesson, type Question } from "@/content/content";
import { duration, ease, spring } from "@/lib/motion";
import { play } from "@/lib/sound";
import { ChoiceExercise, MatchExercise, SpeakExercise, type ExerciseOutcome } from "./Exercises";

/**
 * A Duolingo-style lesson screen for one question: progress, Nara and her story,
 * the exercise, and a feedback banner that reacts to right and wrong answers.
 */

type CardProps = {
  question: Question;
  print: boolean;
  onAdvance: () => void;
  onOutcome: (outcome: ExerciseOutcome) => void;
};

const done = (outcome: ExerciseOutcome) => outcome === "solved" || outcome === "explained";

// Nara's expression follows the learner: presenting the question, thinking after a miss,
// cheering a right answer and encouraging after a second miss.
const poseFor: Record<ExerciseOutcome, Pose> = { open: "present", missed: "think", solved: "cheer", explained: "love" };

function initialSelection(question: Question, print: boolean): number | null {
  if (!print || question.kind === "speak" || question.kind === "match") return null;
  return question.correct;
}

export function LessonCard({ question, print, onAdvance, onOutcome }: CardProps) {
  const [outcome, setOutcomeState] = useState<ExerciseOutcome>(print ? "solved" : "open");
  const [selected, setSelected] = useState<number | null>(initialSelection(question, print));
  const [misses, setMisses] = useState(0);

  const setOutcome = (next: ExerciseOutcome) => {
    setOutcomeState(next);
    onOutcome(next);
    if (next === "solved") play("correct");
    if (next === "missed" || next === "explained") play("wrong");
  };

  const check = () => {
    if (question.kind !== "choose" && question.kind !== "word") return;
    if (selected === question.correct) return setOutcome("solved");
    const total = misses + 1;
    setMisses(total);
    setOutcome(total >= 2 ? "explained" : "missed");
  };

  const retry = () => {
    setSelected(null);
    setOutcomeState("open");
    onOutcome("open");
  };

  const progress = (question.n - 1 + (done(outcome) ? 1 : 0)) / questions.length;
  const pose = question.kind === "speak" && outcome === "open" ? "talk" : poseFor[outcome];

  return (
    <div data-no-advance className="relative flex h-full flex-col rounded-card bg-paper-raised shadow-card">
      <div className="flex items-center gap-6 px-10 pt-8">
        <span className="shrink-0 text-small font-extrabold text-ink-muted">{exerciseLabels[question.kind]}</span>
        <ProgressBar value={progress} />
      </div>
      <div className="flex items-end gap-4 px-8 pt-4">
        <Nara pose={pose} className="h-[250px] w-[172px] shrink-0" />
        <SpeechBubble className="mb-10 flex-1">
          <StoryText story={question.story} clue={question.clue} lit={outcome === "missed"} />
        </SpeechBubble>
      </div>
      <h3 className="px-10 pt-2 text-h3 text-ink">{question.prompt}</h3>
      <div className="flex-1 px-10 pt-5">
        <ExerciseBody question={question} outcome={outcome} selected={selected} onSelect={setSelected} onSolve={() => setOutcome("solved")} />
      </div>
      <Footer question={question} outcome={outcome} canCheck={selected !== null} onCheck={check} onRetry={retry} onAdvance={onAdvance} />
      <XpPop show={outcome === "solved" && !print} />
    </div>
  );
}

function ExerciseBody({
  question,
  outcome,
  selected,
  onSelect,
  onSolve,
}: {
  question: Question;
  outcome: ExerciseOutcome;
  selected: number | null;
  onSelect: (index: number) => void;
  onSolve: () => void;
}) {
  if (question.kind === "speak") return <SpeakExercise question={question} solved={done(outcome)} onSolve={onSolve} />;
  if (question.kind === "match") return <MatchExercise question={question} solved={done(outcome)} onSolve={onSolve} />;
  return <ChoiceExercise question={question} outcome={outcome} selected={selected} onSelect={onSelect} />;
}

/** Duolingo's progress bar: a green fill with a lighter stripe along its top. */
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-5 flex-1 overflow-hidden rounded-pill bg-line" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        className="relative h-full rounded-pill bg-accent"
        initial={false}
        animate={{ width: `${Math.max(value, 0.04) * 100}%` }}
        transition={{ duration: duration.slow, ease: ease.outSoft }}
      >
        <span className="absolute inset-x-3 top-1 h-1.5 rounded-pill bg-paper opacity-30" />
      </motion.div>
    </div>
  );
}

/** Nara's story, with the clue phrase marked once the visitor has missed. */
function StoryText({ story, clue, lit }: { story: string; clue: string; lit: boolean }) {
  const start = story.indexOf(clue);
  if (start < 0) return <p className="text-body text-ink">{story}</p>;
  return (
    <p className="text-body text-ink">
      {story.slice(0, start)}
      <motion.mark
        className={`rounded-md text-ink ${lit ? "-mx-1 px-1" : ""}`}
        initial={false}
        animate={{ backgroundColor: lit ? "var(--color-accent-soft)" : "transparent", boxShadow: lit ? "var(--shadow-clue)" : "none" }}
        transition={{ duration: duration.base }}
      >
        {story.slice(start, start + clue.length)}
      </motion.mark>
      {story.slice(start + clue.length)}
    </p>
  );
}

type FooterProps = {
  question: Question;
  outcome: ExerciseOutcome;
  canCheck: boolean;
  onCheck: () => void;
  onRetry: () => void;
  onAdvance: () => void;
};

const footerLook: Record<ExerciseOutcome, string> = {
  open: "bg-transparent shadow-divider",
  missed: "bg-wrong-soft",
  explained: "bg-wrong-soft",
  solved: "bg-accent-soft",
};

function Footer(props: FooterProps) {
  return (
    <div className={`flex min-h-[136px] items-center justify-between gap-8 rounded-b-card px-10 py-6 transition-colors duration-300 ${footerLook[props.outcome]}`}>
      <FooterMessage question={props.question} outcome={props.outcome} />
      <FooterAction {...props} />
    </div>
  );
}

/** After a right answer: the fold it unlocked, the fold the camera just checked, or the finished model. */
function solvedLine(question: Question): string {
  const fold = foldFor(question.n);
  if (roleFor(question.n) === "unlock") return tryLesson.unlockedLine(fold.n);
  return question.n === questions.length ? tryLesson.finishedLine : tryLesson.checkedLine(fold.n);
}

function FooterMessage({ question, outcome }: { question: Question; outcome: ExerciseOutcome }) {
  if (outcome === "solved") {
    return (
      <Message good title={tryLesson.correctTitle}>
        {solvedLine(question)}
      </Message>
    );
  }
  if (outcome === "missed") return <Message title={tryLesson.wrongTitle}>{question.hint}</Message>;
  if (outcome === "explained") return <Message title="Here's the answer">{question.explain} It comes back in the review round.</Message>;
  return <span />;
}

/** The round badge, title and line on the left of Duolingo's feedback banner. */
function Message({ good = false, title, children }: { good?: boolean; title: string; children: React.ReactNode }) {
  const tone = good ? "text-accent-ink" : "text-wrong-ink";
  return (
    <motion.div className="flex items-center gap-5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
      <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-pill bg-paper ${tone}`}>
        {good ? <Check size={38} weight="bold" aria-hidden="true" /> : <X size={38} weight="bold" aria-hidden="true" />}
      </span>
      <div>
        <p className={`font-display text-h3 ${tone}`}>{title}</p>
        <p className={`text-body ${tone}`}>{children}</p>
      </div>
    </motion.div>
  );
}

function FooterAction({ question, outcome, canCheck, onCheck, onRetry, onAdvance }: FooterProps) {
  const isLast = question.n === questions.length;
  if (outcome === "solved" && isLast) return <Button variant="primary" onClick={() => finish(onAdvance)} sound={null}>{tryLesson.finishLabel}</Button>;
  if (outcome === "solved") return <Button variant="primary" onClick={onAdvance}>{tryLesson.continueLabel}</Button>;
  if (outcome === "explained") return <Button variant="danger" onClick={onAdvance}>{tryLesson.continueLabel}</Button>;
  if (outcome === "missed") return <Button variant="danger" onClick={onRetry}>{tryLesson.retryLabel}</Button>;
  if (question.kind === "choose" || question.kind === "word") {
    return (
      <Button variant="primary" onClick={onCheck} disabled={!canCheck} sound={null}>
        {tryLesson.checkLabel}
      </Button>
    );
  }
  return null;
}

/** The last Continue finishes Mt. Fuji with the lesson-complete fanfare. */
function finish(onAdvance: () => void) {
  play("complete");
  onAdvance();
}

/** "+10 XP" floats up from the banner after a right answer. */
function XpPop({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.p
          className="pointer-events-none absolute bottom-36 right-12 font-display text-h2 text-bee-ink"
          initial={{ opacity: 0, y: 20, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, -10, -30, -60], scale: [0.6, 1.15, 1, 1] }}
          transition={{ duration: 1.6, times: [0, 0.2, 0.7, 1] }}
        >
          +10 XP
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
