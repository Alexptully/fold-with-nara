import { demoQuestions, journey, type JourneyIcon } from "@/content/content";
import type { KioskScene, LessonMirror } from "@/lib/kiosk/protocol";
import type { KioskLive } from "./types";

/**
 * Which screen the demo kiosk shows on each slide. Before "Meet Nara" it waits for
 * a visitor without her, so the reveal still happens on the slide and the kiosk at once.
 */

export const showOnKiosk = (scene: KioskScene) => () => scene;

export const openLesson = (question: number, finishing = false): LessonMirror => ({
  question,
  outcome: "open",
  selected: null,
  listening: false,
  replays: 0,
  finishing,
});

/** Step 1 shows only her outline, as the slide does; step 2 pops her in; step 3 she introduces herself. */
export function meetNaraScene(step: number): KioskScene {
  if (step === 1) return { kind: "sketch" };
  return { kind: "guide", say: step >= 3 ? "intro" : "meet" };
}

// Each step of the visit, as the kiosk shows it.
const visitScreens: Record<JourneyIcon, KioskScene> = {
  wave: { kind: "guide", say: "hello" },
  choose: { kind: "choose", chosen: "fuji" },
  print: { kind: "guide", say: "print" },
  frame: { kind: "guide", say: "place" },
  projector: { kind: "guide", say: "light" },
  question: { kind: "lesson", lesson: openLesson(1) },
  phone: { kind: "guide", say: "badge" },
  bird: { kind: "finish", kept: false, hung: false },
};

export function journeyScene(step: number): KioskScene {
  const item = journey.steps[Math.min(step, journey.steps.length) - 1];
  return visitScreens[item.icon];
}

export const chooseScene = (_step: number, live: KioskLive): KioskScene => ({ kind: "choose", chosen: live.chosen ?? "fuji" });

/** The demo question for this build step, with whatever the presenter has done on its card so far. */
export function lessonScene(step: number, live: KioskLive): KioskScene {
  const at = Math.min(step, demoQuestions.length);
  const question = demoQuestions[at - 1];
  const reported = live.lesson?.question === question ? live.lesson : null;
  return { kind: "lesson", lesson: reported ?? openLesson(question, at === demoQuestions.length) };
}

export const celebrationScene = (step: number, live: KioskLive): KioskScene => ({ kind: "finish", kept: Boolean(live.kept), hung: step >= 2 });
