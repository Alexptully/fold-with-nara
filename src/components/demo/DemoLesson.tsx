"use client";

import { useState } from "react";
import { FoldCaption, LessonPaper, StatusBadge } from "@/components/deck/slides/TryLessonSlide";
import { useOrientation } from "@/components/kiosk/KioskCanvas";
import type { ExerciseOutcome } from "@/components/lesson/Exercises";
import { LessonCard, type CardView } from "@/components/lesson/LessonCard";
import { foldUnlockedBy, foldsDoneBefore, questions } from "@/content/content";

const isAnswered = (outcome: ExerciseOutcome) => outcome === "solved" || outcome === "explained";
const openView: CardView = { outcome: "open", selected: null, listening: false };

/**
 * One stop of the lesson on the demo kiosk: the visitor's paper on one side, the lesson
 * card on the other, laid out like "Try the lesson". A right answer on a fold's question
 * plays that fold on the paper (crease, arrow, flap), and Replay fold plays it again.
 */
export function DemoLesson({ index, onAdvance }: { index: number; onAdvance: () => void }) {
  const question = questions[index];
  const fold = foldUnlockedBy(question.n);
  const landscape = useOrientation() === "landscape";
  const [view, setView] = useState<CardView>(openView);
  const [runs, setRuns] = useState(0);
  const answered = isAnswered(view.outcome);
  const paperSize = landscape ? "h-[500px] w-[500px]" : "h-[380px] w-[380px]";
  return (
    <div className={`flex h-full items-center justify-center gap-12 px-12 ${landscape ? "" : "flex-col gap-6"}`}>
      <div className={landscape ? "w-[520px] shrink-0" : "flex w-[944px] items-center gap-10"}>
        <div>
          <p className="text-body font-bold text-ink-muted">
            Stop {question.n}: {question.place}
          </p>
          <div className={`relative mt-2 ${paperSize}`}>
            <LessonPaper key={runs} fold={fold?.n ?? null} done={foldsDoneBefore(question.n)} play={answered} print={false} />
            <StatusBadge answered={answered} />
          </div>
        </div>
        {fold ? (
          <div className={landscape ? "" : "flex-1"}>
            <FoldCaption fold={fold} answered={answered} onReplay={() => setRuns((count) => count + 1)} />
          </div>
        ) : null}
      </div>
      <div className={`h-[836px] ${landscape ? "w-[1000px]" : "w-[944px]"}`}>
        <LessonCard question={question} print={false} finishing={index === questions.length - 1} onAdvance={onAdvance} onView={setView} />
      </div>
    </div>
  );
}
