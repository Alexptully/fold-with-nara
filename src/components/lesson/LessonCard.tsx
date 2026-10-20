"use client";

import { Check, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Nara, type Pose } from "@/components/art/nara/Nara";
import { Button } from "@/components/ui/Button";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { exerciseLabels, folds, foldUnlockedBy, foldsDoneBefore, questions, tryLesson, type Question } from "@/content/content";
import { duration, ease, spring } from "@/lib/motion";
import { play } from "@/lib/sound";
import { ChoiceExercise, MatchExercise, SpeakExercise, type ExerciseOutcome } from "./Exercises";

/**
 * A Duolingo-style lesson screen for one question: progress, Nara and her story,
 * the exercise, and a feedback banner that reacts to right and wrong answers.
 *
 * `LessonCard` holds the state and plays the sounds. `LessonCardView` only draws a
 * state, so the demo kiosk can show the same card as the deck, tap for tap.
 */

/** Everything about the card that the presenter changes by answering. */
export type CardView = { outcome: ExerciseOutcome; selected: number | null; listening: boolean };

type CardActions = {
  select: (index: number) => void;
  check: () => void;
  retry: () => void;
  listen: () => void;
  solve: () => void;
  advance: () => void;
};

type CardProps = {
  question: Question;
  print: boolean;
  /** The last question shown: its Continue finishes the model with the fanfare. */
  finishing?: boolean;
  onAdvance: () => void;
  onView: (view: CardView) => void;
};

const done = (outcome: ExerciseOutcome) => outcome === "solved" || outcome === "explained";

// Nara's expression follows the learner: presenting the question, thinking after a miss,
// cheering a right answer and encouraging after a second miss.
const poseFor: Record<ExerciseOutcome, Pose> = { open: "present", missed: "think", solved: "cheer", explained: "love" };

// The speak question "listens" this long before it counts the room's hello.
const LISTEN_MS = 1400;

function initialSelection(question: Question, print: boolean): number | null {
  if (!print || question.kind === "speak" || question.kind === "match") return null;
  return question.correct;
}

/** The card's state, and what each of its buttons does to it. */
function useLessonCard(question: Question, print: boolean, onAdvance: () => void) {
  const [outcome, setOutcomeState] = useState<ExerciseOutcome>(print ? "solved" : "open");
  const [selected, setSelected] = useState<number | null>(initialSelection(question, print));
  const [misses, setMisses] = useState(0);
  const [listening, setListening] = useState(false);
  const listenTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(listenTimer.current), []);

  const setOutcome = (next: ExerciseOutcome) => {
    setOutcomeState(next);
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

  const actions: CardActions = {
    select: setSelected,
    check,
    retry: () => {
      setSelected(null);
      setOutcomeState("open");
    },
    listen: () => {
      setListening(true);
      listenTimer.current = setTimeout(() => setOutcome("solved"), LISTEN_MS);
    },
    solve: () => setOutcome("solved"),
    advance: onAdvance,
  };
  const view = useMemo<CardView>(() => ({ outcome, selected, listening }), [outcome, selected, listening]);
  return { view, actions };
}

export function LessonCard({ question, print, finishing = false, onAdvance, onView }: CardProps) {
  const { view, actions } = useLessonCard(question, print, onAdvance);
  useEffect(() => onView(view), [onView, view]);
  return <LessonCardView question={question} view={view} finishing={finishing} actions={actions} celebrate={!print} />;
}

const noop = () => undefined;
const noActions: CardActions = { select: noop, check: noop, retry: noop, listen: noop, solve: noop, advance: noop };

/** Draws the card in one state. Without `actions` it can't be clicked: the kiosk mirror. */
export function LessonCardView({
  question,
  view,
  finishing = false,
  actions,
  celebrate = true,
}: {
  question: Question;
  view: CardView;
  finishing?: boolean;
  actions?: CardActions;
  /** Floats "+10 XP" up after a right answer (off in print). */
  celebrate?: boolean;
}) {
  const { outcome, selected } = view;
  const act = actions ?? noActions;
  const progress = (question.n - 1 + (done(outcome) ? 1 : 0)) / questions.length;
  const pose = question.kind === "speak" && outcome === "open" ? "talk" : poseFor[outcome];

  return (
    <div data-no-advance inert={!actions} className="relative flex h-full flex-col rounded-card bg-paper-raised shadow-card">
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
        <ExerciseBody question={question} view={view} actions={act} />
      </div>
      <Footer question={question} outcome={outcome} canCheck={selected !== null} finishing={finishing} actions={act} />
      <XpPop show={outcome === "solved" && celebrate} />
    </div>
  );
}

function ExerciseBody({ question, view, actions }: { question: Question; view: CardView; actions: CardActions }) {
  const solved = done(view.outcome);
  if (question.kind === "speak") return <SpeakExercise question={question} solved={solved} listening={view.listening} onListen={actions.listen} />;
  if (question.kind === "match") return <MatchExercise question={question} solved={solved} onSolve={actions.solve} />;
  return <ChoiceExercise question={question} outcome={view.outcome} selected={view.selected} onSelect={actions.select} />;
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
  finishing: boolean;
  actions: CardActions;
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

/** After a right answer: the fold it unlocked, how many answers are left before the next one, or the finished model. */
function solvedLine(question: Question): string {
  const fold = foldUnlockedBy(question.n);
  if (fold) return tryLesson.unlockedLine(fold.n);
  if (question.n === questions.length) return tryLesson.finishedLine;
  const next = folds[foldsDoneBefore(question.n)];
  return tryLesson.towardLine(next.unlockedBy - question.n, next.n);
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

function FooterAction({ question, outcome, canCheck, finishing, actions }: FooterProps) {
  const next = finishing ? () => finish(actions.advance) : actions.advance;
  const sound = finishing ? null : "tap";
  if (outcome === "solved") return <Button variant="primary" onClick={next} sound={sound}>{finishing ? tryLesson.finishLabel : tryLesson.continueLabel}</Button>;
  if (outcome === "explained") return <Button variant="danger" onClick={next} sound={sound}>{tryLesson.continueLabel}</Button>;
  if (outcome === "missed") return <Button variant="danger" onClick={actions.retry}>{tryLesson.retryLabel}</Button>;
  if (question.kind === "choose" || question.kind === "word") {
    return (
      <Button variant="primary" onClick={actions.check} disabled={!canCheck} sound={null}>
        {tryLesson.checkLabel}
      </Button>
    );
  }
  return null;
}

/** The last Continue of the demo finishes Mt. Fuji with the lesson-complete fanfare. */
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
