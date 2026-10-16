"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { ShapeKind } from "@/components/art/nara/Nara";
import { Grain } from "./Grain";
import { NaraActor, NaraHighlightContext } from "./NaraActor";
import { NotesPanel } from "./NotesPanel";
import { SlideFooter } from "./SlideFooter";
import { SlideLayer, type TransitionCustom } from "./SlideTransition";
import { slides } from "./slides";
import { naraSpotFor, sourcesForStep } from "./types";
import { useDeckNavigation } from "./useDeckNavigation";
import { stageSize, usePresenterKeys } from "./usePresenterKeys";
import { useTalkClock } from "./useTalkClock";

/** Going forward, a slide arrives its own way; going back replays that move in reverse. */
function transitionFor(index: number, direction: 1 | -1, animate: boolean): TransitionCustom {
  if (!animate) return { kind: "cut", direction };
  const arriving = direction > 0 ? slides[index] : (slides[index + 1] ?? slides[index]);
  return { kind: arriving.transition, direction };
}

/** Shape highlights belong to the slide that set them, so they clear when the slide changes. */
function useShapeHighlight(index: number) {
  const [state, setState] = useState<{ index: number; kind: ShapeKind | null }>({ index, kind: null });
  const highlight = state.index === index ? state.kind : null;
  return useMemo(() => ({ highlight, setHighlight: (kind: ShapeKind | null) => setState({ index, kind }) }), [highlight, index]);
}

export function Deck() {
  const nav = useDeckNavigation(slides);
  const presenter = usePresenterKeys();
  const elapsed = useTalkClock();
  const { slide: index, step, direction, animate } = nav.position;
  const slide = slides[index];
  const custom = transitionFor(index, direction, animate);
  const highlight = useShapeHighlight(index);

  return (
    <main
      className={`fixed inset-0 overflow-hidden bg-paper select-none ${presenter.cursorIdle ? "cursor-idle" : ""}`}
      onClick={nav.onStageClick}
      onTouchStart={nav.onTouchStart}
      onTouchEnd={nav.onTouchEnd}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: stageSize.width, height: stageSize.height, transform: `translate(-50%, -50%) scale(${presenter.scale})` }}
      >
        <NaraHighlightContext.Provider value={highlight}>
          <div className="relative h-full w-full overflow-hidden bg-paper">
            <AnimatePresence initial={false} custom={custom}>
              <SlideLayer key={index} custom={custom} label={slide.name}>
                <slide.Content step={step} print={false} advance={nav.next} />
                <SlideFooter sourceKeys={sourcesForStep(slide, step)} section={slide.section} />
              </SlideLayer>
            </AnimatePresence>
            <NaraActor spot={naraSpotFor(slide, step)} cut={!animate} />
            <Grain />
          </div>
        </NaraHighlightContext.Provider>
      </div>
      {presenter.notesOpen ? <NotesPanel index={index} step={step} elapsed={elapsed} onClose={() => presenter.setNotesOpen(false)} /> : null}
      <SoundToast muted={presenter.muted} toastId={presenter.muteToast} />
      <p className="sr-only" aria-live="polite">
        {slide.name}, build {step} of {slide.steps}
      </p>
    </main>
  );
}

/** A small note in the corner when M turns sound on or off. */
function SoundToast({ muted, toastId }: { muted: boolean; toastId: number }) {
  return (
    <AnimatePresence>
      {toastId > 0 ? (
        <motion.p
          key={toastId}
          className="fixed bottom-6 right-6 z-50 rounded-pill bg-ink px-5 py-2 text-panel font-bold text-paper"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, 0] }}
          transition={{ duration: 1.8, times: [0, 0.1, 0.8, 1] }}
        >
          {muted ? "Sound off (M)" : "Sound on (M)"}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
