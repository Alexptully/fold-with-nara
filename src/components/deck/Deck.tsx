"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { play } from "@/lib/sound";
import { duration } from "@/lib/motion";
import { Grain } from "./Grain";
import { NotesPanel } from "./NotesPanel";
import { HingeCrease, PageLayer } from "./PageTurn";
import { SlideFooter } from "./SlideFooter";
import { slides } from "./slides";
import { sourcesForStep, type SlideDef } from "./types";
import { useDeckNavigation } from "./useDeckNavigation";
import { stageSize, usePresenterKeys } from "./usePresenterKeys";

type Turn = { id: number; from: number; fromStep: number; direction: 1 | -1 };

/** Tracks the page that is folding away while the next one comes in. */
function usePageTurn(index: number, step: number, direction: 1 | -1, animate: boolean) {
  const [shown, setShown] = useState({ index, step });
  const [turn, setTurn] = useState<Turn | null>(null);
  if (shown.index !== index || shown.step !== step) {
    if (shown.index !== index && animate) setTurn({ id: (turn?.id ?? 0) + 1, from: shown.index, fromStep: shown.step, direction });
    setShown({ index, step });
  }
  useEffect(() => {
    if (!turn) return;
    play("fold");
    const timer = window.setTimeout(() => setTurn(null), duration.pageTurn * 1000 + 60);
    return () => window.clearTimeout(timer);
  }, [turn]);
  return turn;
}

/** Build-step pops and arrival sounds that some slides ask for. */
function useSlideSounds(index: number, step: number, animate: boolean) {
  const last = useRef({ index, step });
  useEffect(() => {
    const slide = slides[index];
    const sameSlide = last.current.index === index;
    last.current = { index, step };
    if (sameSlide && step > 1 && slide.stepSound) play(slide.stepSound);
    if (sameSlide || !animate || !slide.arrivalSound) return;
    const sound = slide.arrivalSound;
    const timer = window.setTimeout(() => play(sound), duration.pageTurn * 1000 * 0.7);
    return () => window.clearTimeout(timer);
  }, [index, step, animate]);
}

function SlidePage({ slide, step, advance }: { slide: SlideDef; step: number; advance: () => void }) {
  return (
    <section className="absolute inset-0" aria-label={slide.name}>
      <slide.Content step={step} print={false} advance={advance} />
      <SlideFooter sourceKeys={sourcesForStep(slide, step)} section={slide.section} />
    </section>
  );
}

export function Deck() {
  const nav = useDeckNavigation(slides);
  const presenter = usePresenterKeys();
  const { slide: index, step, direction, animate } = nav.position;
  const turn = usePageTurn(index, step, direction, animate);
  useSlideSounds(index, step, animate);
  const slide = slides[index];
  const leaving = turn && turn.from !== index ? turn : null;

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
        <div className="relative h-full w-full overflow-hidden bg-paper" style={{ perspective: 2600 }}>
          {leaving ? (
            <PageLayer key={`slide-${leaving.from}`} role="leaving" direction={leaving.direction} turning>
              <SlidePage slide={slides[leaving.from]} step={leaving.fromStep} advance={nav.next} />
            </PageLayer>
          ) : null}
          <PageLayer key={`slide-${index}`} role="current" direction={leaving?.direction ?? 1} turning={Boolean(leaving)}>
            <SlidePage slide={slide} step={step} advance={nav.next} />
          </PageLayer>
          {leaving ? <HingeCrease id={leaving.id} /> : null}
          <Grain />
        </div>
      </div>
      {presenter.notesOpen ? (
        <NotesPanel slide={slide} nextSlide={slides[index + 1]} step={step} onClose={() => presenter.setNotesOpen(false)} />
      ) : null}
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
