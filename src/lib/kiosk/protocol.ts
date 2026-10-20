import type { ExerciseOutcome } from "@/components/lesson/Exercises";
import type { KioskGuideKey, OrigamiModel } from "@/content/content";

/**
 * What the deck tells the demo kiosk (the iPad screen and the small projector).
 * The deck sends the whole picture every time, never a change, so a page that
 * joins late or reconnects shows the right thing from its first message.
 */

/** The live lesson card on "Try the lesson", as the presenter is answering it. */
export type LessonMirror = {
  /** The question number, 1 to 10. */
  question: number;
  outcome: ExerciseOutcome;
  /** The tile the presenter picked, before or after Check. */
  selected: number | null;
  /** The speak question's microphone, while it "listens". */
  listening: boolean;
  /** Counts Replay fold presses, so the projector draws the fold again. */
  replays: number;
  /** The last demo question: its Continue finishes Mt. Fuji. */
  finishing: boolean;
};

/** One screen of the kiosk. Each slide in slides.ts picks one per build step. */
export type KioskScene =
  | { kind: "welcome" }
  | { kind: "sketch" }
  | { kind: "guide"; say: KioskGuideKey }
  | { kind: "reactions"; misses: boolean }
  | { kind: "choose"; chosen: OrigamiModel }
  | { kind: "path"; folds: boolean }
  | { kind: "lesson"; lesson: LessonMirror }
  | { kind: "finish"; kept: boolean; hung: boolean };

export type KioskMessage = {
  /** A new id each time the deck page loads, so a reloaded deck takes over at once. */
  deck: string;
  /** Rises with every message from one deck, so late or doubled copies are ignored. */
  seq: number;
  /** When the deck made this message. With two decks open, the newest action wins, not the last heartbeat. */
  at: number;
  slide: string;
  step: number;
  scene: KioskScene;
};

export type KioskRole = "screen" | "projector";

/** How many kiosk pages are listening to the relay right now, by role. */
export type ViewerCounts = Record<KioskRole, number>;

export const CHANNEL_NAME = "fold-with-nara-kiosk";
export const RELAY_PORT = 3001;

/** True when `next` should replace what a page is showing from `current`. */
export function isNewer(next: KioskMessage, current: KioskMessage | null): boolean {
  if (!current) return true;
  if (current.deck !== next.deck) return next.at > current.at;
  return next.seq > current.seq;
}

/** A light check that a parsed message has the fields a page needs before it renders. */
export function isKioskMessage(value: unknown): value is KioskMessage {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<KioskMessage>;
  return typeof candidate.deck === "string" && typeof candidate.seq === "number" && typeof candidate.at === "number" && typeof candidate.scene?.kind === "string";
}
