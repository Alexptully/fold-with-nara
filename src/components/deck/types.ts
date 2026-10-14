import type { ComponentType } from "react";
import type { SourceKey } from "@/content/sources";
import type { SoundName } from "@/lib/sound";

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
  /** Steps that get their own PDF page. Defaults to the last step only. */
  printSteps?: number[];
  /** Sources shown in the footer, keyed by the first step they apply to. */
  sourcesByStep?: Record<number, SourceKey[]>;
  notes: string[];
  /** Played on each build step after the first. */
  stepSound?: SoundName;
  /** Played once the slide has turned into view. */
  arrivalSound?: SoundName;
  Content: ComponentType<SlideProps>;
};

export function sourcesForStep(slide: SlideDef, step: number): SourceKey[] {
  const entries = Object.entries(slide.sourcesByStep ?? {})
    .map(([from, keys]) => [Number(from), keys] as const)
    .filter(([from]) => from <= step)
    .sort((a, b) => a[0] - b[0]);
  return entries.length > 0 ? entries[entries.length - 1][1] : [];
}
