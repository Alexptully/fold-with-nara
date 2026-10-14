"use client";

import { CheckCircle, LightbulbFilament } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useState } from "react";
import { NaraAvatar } from "@/components/art/Nara";
import { Button } from "@/components/ui/Button";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { exerciseLabels, folds, questions, tryLesson, type Question } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import { ChoiceExercise, MatchExercise, SpeakExercise, type ExerciseOutcome } from "./Exercises";

/**
 * A Duolingo-style lesson screen for one question: progress, Nara's story,
 * the exercise, and a footer that reacts to right and wrong answers.
 */

type CardProps = {
  question: Question;
  print: boolean;
  onAdvance: () => void;
  onOutcome: (outcome: ExerciseOutcome) => void;
};

const done = (outcome: ExerciseOutcome) => outcome === "solved" || outcome === "explained";

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
    setOutcome("open");
  };

  const progress = (question.n - 1 + (done(outcome) ? 1 : 0)) / questions.length;

  return (
    <div data-no-advance className="relative flex h-full flex-col rounded-card bg-paper-raised shadow-card">
      <div className="flex items-center gap-6 px-10 pt-8">
        <span className="shrink-0 text-small font-extrabold text-ink-muted">{exerciseLabels[question.kind]}</span>
        <ProgressBar value={progress} />
      </div>
      <div className="flex items-start gap-6 px-10 pt-7">
        <NaraAvatar className="mt-1 h-[104px] w-[150px] shrink-0" />
        <SpeechBubble className="flex-1">
          <StoryText story={question.story} clue={question.clue} lit={outcome === "missed"} />
        </SpeechBubble>
      </div>
      <h3 className="px-10 pt-7 text-h3 text-ink">{question.prompt}</h3>
      <div className="flex-1 px-10 pt-5">
        <ExerciseBody question={question} outcome={outcome} selected={selected} onSelect={setSelected} onSolve={() => setOutcome("solved")} />
      </div>
      <Footer question={question} outcome={outcome} canCheck={selected !== null} onCheck={check} onRetry={retry} onAdvance={onAdvance} />
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

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-5 flex-1 overflow-hidden rounded-pill bg-paper-sunk" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        className="h-full rounded-pill bg-accent"
        initial={false}
        animate={{ width: `${Math.max(value, 0.03) * 100}%` }}
        transition={{ duration: duration.slow, ease: ease.outSoft }}
      />
    </div>
  );
}

/** Nara's story, with the clue phrase marked once the visitor has missed. */
function StoryText({ story, clue, lit }: { story: string; clue: string; lit: boolean }) {
  const start = story.indexOf(clue);
  if (start < 0) return <p className="text-small text-ink">{story}</p>;
  return (
    <p className="text-small text-ink">
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
  open: "bg-transparent",
  missed: "bg-wrong-soft",
  explained: "bg-wrong-soft",
  solved: "bg-accent-soft",
};

function Footer(props: FooterProps) {
  return (
    <motion.div
      className={`flex min-h-[132px] items-center justify-between gap-8 rounded-b-card px-10 py-6 transition-colors ${footerLook[props.outcome]}`}
      layout
    >
      <FooterMessage question={props.question} outcome={props.outcome} />
      <FooterAction {...props} />
    </motion.div>
  );
}

function FooterMessage({ question, outcome }: { question: Question; outcome: ExerciseOutcome }) {
  const fold = folds[question.n - 1];
  if (outcome === "solved") {
    return (
      <Message icon={<CheckCircle size={52} weight="fill" className="text-accent" />} title={tryLesson.correctTitle} tone="text-accent-ink">
        {tryLesson.unlockedLine(fold.n)}
      </Message>
    );
  }
  if (outcome === "missed") {
    return (
      <Message icon={<LightbulbFilament size={52} weight="fill" className="text-wrong" />} title={tryLesson.wrongTitle} tone="text-wrong-ink">
        {question.hint}
      </Message>
    );
  }
  if (outcome === "explained") {
    return (
      <Message icon={<LightbulbFilament size={52} weight="fill" className="text-wrong" />} title="Here's the answer" tone="text-wrong-ink">
        {question.explain} It comes back in the review round.
      </Message>
    );
  }
  return <span />;
}

function Message({ icon, title, tone, children }: { icon: React.ReactNode; title: string; tone: string; children: React.ReactNode }) {
  return (
    <motion.div className="flex items-center gap-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {icon}
      <div>
        <p className={`text-h3 ${tone}`}>{title}</p>
        <p className={`text-small ${tone}`}>{children}</p>
      </div>
    </motion.div>
  );
}

function FooterAction({ question, outcome, canCheck, onCheck, onRetry, onAdvance }: FooterProps) {
  const isLast = question.n === questions.length;
  if (outcome === "solved") return <Button variant="onCorrect" onClick={onAdvance}>{isLast ? "Finish the crane" : tryLesson.continueLabel}</Button>;
  if (outcome === "explained") return <Button variant="onWrong" onClick={onAdvance}>{tryLesson.continueLabel}</Button>;
  if (outcome === "missed") return <Button variant="onWrong" onClick={onRetry}>{tryLesson.retryLabel}</Button>;
  if (question.kind === "choose" || question.kind === "word") {
    return (
      <Button onClick={onCheck} disabled={!canCheck}>
        {tryLesson.checkLabel}
      </Button>
    );
  }
  return null;
}
