"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CreaseSweep, foldVariants } from "./FoldTransition";
import { Grain } from "./Grain";
import { NotesPanel } from "./NotesPanel";
import { SlideFooter } from "./SlideFooter";
import { slides } from "./slides";
import { sourcesForStep } from "./types";
import { useDeckNavigation } from "./useDeckNavigation";
import { stageSize, usePresenterKeys } from "./usePresenterKeys";

export function Deck() {
  const nav = useDeckNavigation(slides);
  const presenter = usePresenterKeys();
  const { slide: index, step, direction } = nav.position;
  const slide = slides[index];
  const [firstSlideShown] = useState(index);
  const showSweep = index !== firstSlideShown;

  return (
    <main
      className={`fixed inset-0 overflow-hidden bg-paper select-none ${presenter.cursorIdle ? "cursor-idle" : ""}`}
      onClick={nav.onStageClick}
      onTouchStart={nav.onTouchStart}
      onTouchEnd={nav.onTouchEnd}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: stageSize.width,
          height: stageSize.height,
          transform: `translate(-50%, -50%) scale(${presenter.scale})`,
        }}
      >
        <div className="relative h-full w-full overflow-hidden bg-paper">
          <AnimatePresence initial={false} custom={direction}>
            <motion.section
              key={index}
              custom={direction}
              variants={foldVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 bg-paper"
              aria-label={slide.name}
            >
              <slide.Content step={step} print={false} advance={nav.next} />
              <SlideFooter sourceKeys={sourcesForStep(slide, step)} section={slide.section} />
            </motion.section>
          </AnimatePresence>
          {showSweep ? <CreaseSweep key={`sweep-${index}`} direction={direction} /> : null}
          <Grain />
        </div>
      </div>
      {presenter.notesOpen ? (
        <NotesPanel slide={slide} nextSlide={slides[index + 1]} step={step} onClose={() => presenter.setNotesOpen(false)} />
      ) : null}
      <p className="sr-only" aria-live="polite">
        {slide.name}, build {step} of {slide.steps}
      </p>
    </main>
  );
}
