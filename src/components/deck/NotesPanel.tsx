"use client";

import { slides, talkSeconds } from "./slides";
import type { SlideDef } from "./types";
import { clock } from "./useTalkClock";

/** Speaker notes, toggled with N. Sits over the bottom of the window, outside the stage. */
export function NotesPanel({
  index,
  step,
  elapsed,
  onClose,
}: {
  index: number;
  step: number;
  elapsed: number;
  onClose: () => void;
}) {
  const slide = slides[index];
  const nextSlide: SlideDef | undefined = slides[index + 1];
  const planEnd = slides.slice(0, index + 1).reduce((sum, s) => sum + s.seconds, 0);
  const late = elapsed > planEnd;
  return (
    <aside
      data-no-advance
      className="fixed inset-x-0 bottom-0 z-50 max-h-[45vh] overflow-y-auto bg-paper-raised px-8 py-6 text-panel text-ink shadow-card"
      aria-label="Speaker notes"
    >
      <div className="mx-auto flex max-w-5xl items-baseline justify-between gap-6">
        <h2 className="text-cite font-extrabold">
          {slide.name}
          <span className="ml-3 font-semibold text-ink-muted">
            Build {step} of {slide.steps}, about {slide.seconds} s
          </span>
        </h2>
        <p className={`font-bold ${late ? "text-wrong-ink" : "text-accent-ink"}`} aria-live="off">
          {clock(elapsed)} talked, aim to finish this slide by {clock(planEnd)} of {clock(talkSeconds)}
        </p>
        <button type="button" onClick={onClose} className="shrink-0 text-ink-muted underline underline-offset-4">
          Hide notes (N)
        </button>
      </div>
      <ul className="mx-auto mt-3 max-w-5xl list-disc space-y-2 pl-6">
        {slide.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <p className="mx-auto mt-4 max-w-5xl text-ink-muted">
        {nextSlide ? `Next slide: ${nextSlide.name}. ` : ""}T resets the clock.
      </p>
    </aside>
  );
}
