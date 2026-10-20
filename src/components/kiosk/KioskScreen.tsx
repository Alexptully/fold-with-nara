"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { kioskScreen } from "@/content/content";
import type { KioskMessage, KioskScene } from "@/lib/kiosk/protocol";
import { duration } from "@/lib/motion";
import { KioskCanvas } from "./KioskCanvas";
import { ChooseScene } from "./scenes/ChooseScene";
import { FinishScene } from "./scenes/FinishScene";
import { GuideScene } from "./scenes/GuideScene";
import { ReactionsScene, SketchScene, WelcomeScene } from "./scenes/IntroScenes";
import { LessonScene } from "./scenes/LessonScene";
import { PathScene } from "./scenes/PathScene";

/** The kiosk's touchscreen: whatever screen the deck's current slide and step call for. */

type SceneOf<K extends KioskScene["kind"]> = Extract<KioskScene, { kind: K }>;
type Renderers = { [K in KioskScene["kind"]]: (scene: SceneOf<K>) => ReactNode };

const renderers: Renderers = {
  welcome: () => <WelcomeScene />,
  sketch: () => <SketchScene />,
  guide: (scene) => <GuideScene say={scene.say} />,
  reactions: (scene) => <ReactionsScene misses={scene.misses} />,
  choose: (scene) => <ChooseScene chosen={scene.chosen} />,
  path: (scene) => <PathScene folds={scene.folds} />,
  lesson: (scene) => <LessonScene lesson={scene.lesson} />,
  finish: (scene) => <FinishScene kept={scene.kept} hung={scene.hung} />,
};

const renderScene = (scene: KioskScene) => (renderers[scene.kind] as (scene: KioskScene) => ReactNode)(scene);

/** Screens cross-fade when this changes; within one screen (a tile picked, a build step) they update in place. */
function sceneKey(scene: KioskScene): string {
  if (scene.kind === "guide") return `guide-${scene.say}`;
  if (scene.kind === "lesson") return `lesson-${scene.lesson.question}`;
  return scene.kind;
}

const welcome: KioskScene = { kind: "welcome" };

export function KioskScreen({ message, linked }: { message: KioskMessage | null; linked: boolean }) {
  const scene = message?.scene ?? welcome;
  return (
    <KioskCanvas>
      <AnimatePresence initial={false}>
        <motion.div
          key={sceneKey(scene)}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.base }}
        >
          {renderScene(scene)}
        </motion.div>
      </AnimatePresence>
      <LinkNotice waiting={!message} linked={linked} />
    </KioskCanvas>
  );
}

/**
 * Before the deck has said anything, a note says what to start. If the link drops
 * mid-pitch, the screen keeps its last picture and a small grey dot shows it's catching up.
 */
function LinkNotice({ waiting, linked }: { waiting: boolean; linked: boolean }) {
  if (waiting) {
    return (
      <div className="absolute inset-x-0 bottom-10 flex justify-center">
        <div className="flex max-w-[900px] items-center gap-5 rounded-card bg-paper-sunk px-8 py-5 shadow-well">
          <motion.span className="h-5 w-5 shrink-0 rounded-pill bg-ink-faint" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <p className="text-small text-ink-muted">
            <span className="font-extrabold text-ink">{kioskScreen.waitingTitle}.</span> {kioskScreen.waitingLine}
          </p>
        </div>
      </div>
    );
  }
  if (linked) return null;
  return <span className="absolute right-6 top-6 h-4 w-4 rounded-pill bg-ink-faint" role="status" aria-label="Reconnecting to the deck" />;
}
