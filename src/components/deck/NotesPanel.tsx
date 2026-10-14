"use client";

import type { SlideDef } from "./types";

/** Speaker notes, toggled with N. Sits over the bottom of the window, outside the stage. */
export function NotesPanel({
  slide,
  nextSlide,
  step,
  onClose,
}: {
  slide: SlideDef;
  nextSlide?: SlideDef;
  step: number;
  onClose: () => void;
}) {
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
            Build {step} of {slide.steps}
          </span>
        </h2>
        <button type="button" onClick={onClose} className="text-ink-muted underline underline-offset-4">
          Hide notes (N)
        </button>
      </div>
      <ul className="mx-auto mt-3 max-w-5xl list-disc space-y-2 pl-6">
        {slide.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      {nextSlide ? <p className="mx-auto mt-4 max-w-5xl text-ink-muted">Next slide: {nextSlide.name}</p> : null}
    </aside>
  );
}
