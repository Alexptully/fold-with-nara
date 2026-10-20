import { ArrowsLeftRight, ChatCircleDots, CursorClick, Microphone, type Icon } from "@phosphor-icons/react";
import type { ExerciseKind } from "@/content/content";

/** One icon per kind of exercise, on the lesson overview and the kiosk's lesson path. */
export const exerciseIcons: Record<ExerciseKind, Icon> = {
  speak: Microphone,
  choose: CursorClick,
  word: ChatCircleDots,
  match: ArrowsLeftRight,
};
