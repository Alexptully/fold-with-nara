"use client";

import { MotionGlobalConfig } from "motion/react";
import { disableSound } from "@/lib/sound";
import { Grain } from "./Grain";
import { SlideFooter } from "./SlideFooter";
import { slides } from "./slides";
import { sourcesForStep, type SlideDef } from "./types";

// On the print route every animation jumps straight to its end state.
MotionGlobalConfig.skipAnimations = true;
disableSound();

const noop = () => undefined;

function pagesFor(slide: SlideDef): number[] {
  return slide.printSteps ?? [slide.steps];
}

/** Every slide (and chosen build steps) as a 1920 by 1080 page, for Save as PDF. */
export function PrintDeck() {
  return (
    <div className="bg-paper">
      <p className="p-6 text-panel text-ink-muted print:hidden">
        To export: open the print dialog, choose Save as PDF, set margins to None and turn on background graphics.
      </p>
      <div className="print-root">
        {slides.flatMap((slide) =>
          pagesFor(slide).map((step) => (
            <section key={`${slide.name}-${step}`} className="print-page bg-paper" aria-label={`${slide.name}, build ${step}`}>
              <slide.Content step={step} print advance={noop} />
              <SlideFooter sourceKeys={sourcesForStep(slide, step)} section={slide.section} />
              <Grain />
            </section>
          )),
        )}
      </div>
    </div>
  );
}
