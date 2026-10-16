"use client";

import type { Note } from "@/content/content";
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
          {slide.speaker ? <span className="mr-3 rounded-pill bg-accent-soft px-3 py-0.5 text-accent-ink">{slide.speaker}</span> : null}
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
      <ul className="mx-auto mt-3 max-w-5xl space-y-2">
        {slide.notes.map((note, i) => (
          <NoteLine key={i} note={note} />
        ))}
      </ul>
      <p className="mx-auto mt-4 max-w-5xl text-ink-muted">
        {nextSlide ? `Next slide: ${nextSlide.name}${handoff(slide, nextSlide)}. ` : ""}T resets the clock.
      </p>
    </aside>
  );
}

/** A line to say, named when someone other than the slide's speaker says it, or a cue in muted brackets. */
function NoteLine({ note }: { note: Note }) {
  if ("cue" in note) return <li className="text-ink-muted">[{note.cue}]</li>;
  return (
    <li>
      {note.who ? <span className="mr-2 font-extrabold text-accent-ink">{note.who}:</span> : null}
      {note.say}
    </li>
  );
}

/** Names the next speaker when the next slide changes hands, so nobody misses their cue. */
function handoff(slide: SlideDef, next: SlideDef): string {
  return next.speaker && next.speaker !== slide.speaker ? `, over to ${next.speaker}` : "";
}
