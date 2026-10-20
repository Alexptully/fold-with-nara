import { foldUnlockedBy, foldsDoneBefore, type KioskGuideKey } from "@/content/content";
import type { KioskScene, LessonMirror } from "./protocol";

/**
 * What the kiosk's projector draws on the folding ledge for each kiosk screen.
 * Black is "no light", so everything here is drawn as light on paper: the green
 * frame where the sheet goes, the crease and arrow for a fold, and sparkles.
 */
export type Light =
  /** The four corners where the paper goes; bright when the visitor should place it. */
  | { kind: "frame"; bright: boolean }
  /** Sparkles on the ledge (Nara arriving, saying goodbye). */
  | { kind: "sparkle" }
  /** The paper's outline for this fold, then its crease and arrow once it's unlocked. */
  | { kind: "fold"; fold: number; lit: boolean; missed: boolean; replay: number }
  /** The paper's outline on a question that doesn't unlock a fold. */
  | { kind: "paper"; state: number; missed: boolean }
  /** The finished mountain, outlined and sparkling. */
  | { kind: "done" };

const frame: Light = { kind: "frame", bright: false };

const guideLight: Record<KioskGuideKey, Light> = {
  meet: { kind: "sparkle" },
  intro: frame,
  hello: frame,
  print: frame,
  place: { kind: "frame", bright: true },
  light: { kind: "fold", fold: 1, lit: true, missed: false, replay: 0 },
  method: frame,
  badge: frame,
  thanks: { kind: "sparkle" },
};

function lessonLight(lesson: LessonMirror): Light {
  const missed = lesson.outcome === "missed";
  const fold = foldUnlockedBy(lesson.question);
  if (!fold) return { kind: "paper", state: foldsDoneBefore(lesson.question), missed };
  const lit = lesson.outcome === "solved" || lesson.outcome === "explained";
  return { kind: "fold", fold: fold.n, lit, missed, replay: lesson.replays };
}

export function lightFor(scene: KioskScene): Light {
  if (scene.kind === "guide") return guideLight[scene.say];
  if (scene.kind === "path") return { kind: "frame", bright: true };
  if (scene.kind === "lesson") return lessonLight(scene.lesson);
  if (scene.kind === "finish") return scene.hung ? frame : { kind: "done" };
  return frame;
}
