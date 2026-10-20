"use client";

import { Check, LockSimple } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { FoldPlayer, FujiPaper } from "@/components/art/FujiPaper";
import { LessonCardView, type CardView } from "@/components/lesson/LessonCard";
import { folds, questions, type Fold } from "@/content/content";
import type { LessonMirror } from "@/lib/kiosk/protocol";
import { spring } from "@/lib/motion";
import { useOrientation } from "../KioskCanvas";

/**
 * The lesson card exactly as the presenter is answering it on "Try the lesson",
 * beside the visitor's three folds: done, folding now, or still locked.
 */
export function LessonScene({ lesson }: { lesson: LessonMirror }) {
  const question = questions[lesson.question - 1];
  const landscape = useOrientation() === "landscape";
  const view: CardView = { outcome: lesson.outcome, selected: lesson.selected, listening: lesson.listening };
  return (
    <div className={`flex h-full items-center justify-center gap-10 px-10 ${landscape ? "" : "flex-col"}`}>
      <div className={`h-[836px] shrink-0 ${landscape ? "w-[1050px]" : "w-[944px]"}`}>
        <LessonCardView question={question} view={view} finishing={lesson.finishing} />
      </div>
      <FoldTracker lesson={lesson} across={!landscape} />
    </div>
  );
}

type SlotState = "done" | "folding" | "locked";

function slotState(fold: Fold, lesson: LessonMirror): SlotState {
  if (fold.unlockedBy < lesson.question) return "done";
  const answered = lesson.outcome === "solved" || lesson.outcome === "explained";
  return fold.unlockedBy === lesson.question && answered ? "folding" : "locked";
}

function FoldTracker({ lesson, across }: { lesson: LessonMirror; across: boolean }) {
  return (
    <ol className={`flex shrink-0 gap-6 ${across ? "" : "w-[220px] flex-col"}`}>
      {folds.map((fold) => (
        <FoldSlot key={fold.n} fold={fold} state={slotState(fold, lesson)} replays={lesson.replays} />
      ))}
    </ol>
  );
}

const labelTone: Record<SlotState, string> = { done: "text-ink", folding: "text-accent-ink", locked: "text-ink-faint" };

function FoldSlot({ fold, state, replays }: { fold: Fold; state: SlotState; replays: number }) {
  return (
    <li className="flex w-[220px] flex-col items-center text-center">
      <div className="relative h-[180px] w-[180px]">
        {state === "folding" ? (
          <motion.span
            className="absolute inset-2 rounded-pill bg-accent-soft"
            animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
        ) : null}
        <SlotPaper fold={fold} state={state} replays={replays} />
        <SlotBadge state={state} />
      </div>
      <p className={`text-small font-extrabold ${labelTone[state]}`}>Fold {fold.n}</p>
      {state === "folding" ? <p className="text-small text-ink">{fold.instruction}</p> : null}
    </li>
  );
}

/** Folding now plays the fold (again on every replay); otherwise it's the paper after this fold. */
function SlotPaper({ fold, state, replays }: { fold: Fold; state: SlotState; replays: number }) {
  if (state === "folding") return <FoldPlayer key={replays} fold={fold.n} play className="relative h-full w-full" />;
  return (
    <div className={`h-full w-full ${state === "locked" ? "opacity-30" : ""}`}>
      <FujiPaper state={fold.n} appear={false} className="h-full w-full" label={`Fold ${fold.n}`} />
    </div>
  );
}

function SlotBadge({ state }: { state: SlotState }) {
  if (state === "folding") return null;
  const done = state === "done";
  const Icon = done ? Check : LockSimple;
  return (
    <motion.span
      key={state}
      className={`absolute right-0 top-0 grid h-14 w-14 place-items-center rounded-pill shadow-card ${done ? "bg-accent text-paper" : "bg-paper-raised text-ink-faint"}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={spring}
    >
      <Icon size={30} weight="bold" aria-label={done ? "Folded" : "Locked"} />
    </motion.span>
  );
}
