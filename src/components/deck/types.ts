import type { ComponentType } from "react";
import type { SourceKey } from "@/content/sources";
import type { NaraSpot } from "./NaraActor";
import type { TransitionKind } from "./SlideTransition";

export type SlideProps = {
  /** The current build step, starting at 1. */
  step: number;
  /** True on the /print route: show the finished state, no interaction. */
  print: boolean;
  /** Moves the deck forward, for controls inside a slide that mean "next". */
  advance: () => void;
};

export type SlideDef = {
  name: string;
  /** Footer tag naming the required section this slide covers. */
  section?: string;
  steps: number;
  /** Speaking time for this slide. The timed slides add up to under four minutes. */
  seconds: number;
  /** How this slide arrives (going back plays it in reverse). */
  transition: TransitionKind;
  /** Where Nara stands on this slide at each build step, or null when she steps off stage. */
  nara?: (step: number) => NaraSpot | null;
  /** Steps that get their own PDF page. Defaults to the last step only. */
  printSteps?: number[];
  /** Sources shown in the footer, keyed by the first step they apply to. */
  sourcesByStep?: Record<number, SourceKey[]>;
  notes: string[];
  Content: ComponentType<SlideProps>;
};

export function sourcesForStep(slide: SlideDef, step: number): SourceKey[] {
  const entries = Object.entries(slide.sourcesByStep ?? {})
    .map(([from, keys]) => [Number(from), keys] as const)
    .filter(([from]) => from <= step)
    .sort((a, b) => a[0] - b[0]);
  return entries.length > 0 ? entries[entries.length - 1][1] : [];
}

export const naraSpotFor = (slide: SlideDef, step: number): NaraSpot | null => slide.nara?.(step) ?? null;
