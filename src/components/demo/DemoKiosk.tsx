"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { KioskCanvas } from "@/components/kiosk/KioskCanvas";
import { FinishScene } from "@/components/kiosk/scenes/FinishScene";
import { GuideScene } from "@/components/kiosk/scenes/GuideScene";
import { WelcomeScene } from "@/components/kiosk/scenes/IntroScenes";
import { PathScene } from "@/components/kiosk/scenes/PathScene";
import { Button } from "@/components/ui/Button";
import { demoKiosk, questions, type KioskGuideKey } from "@/content/content";
import { duration } from "@/lib/motion";
import { DemoChoose } from "./DemoChoose";
import { DemoLesson } from "./DemoLesson";

/**
 * The whole kiosk visit on one screen, worked by taps instead of the deck: waiting for
 * a visitor, Nara's hello, choosing a fold, printing and placing the paper, the light,
 * the ten-stop path, the lesson with its three folds, the badge, then keep it or hang it.
 * Every screen is the kiosk's own; this only decides which comes next.
 */

type Step =
  | { kind: "welcome" }
  | { kind: "guide"; say: KioskGuideKey }
  | { kind: "choose" }
  | { kind: "path" }
  | { kind: "lesson"; index: number }
  | { kind: "finish"; kept: boolean; hung: boolean };

const visit: Step[] = [
  { kind: "welcome" },
  { kind: "guide", say: "meet" },
  { kind: "guide", say: "intro" },
  { kind: "choose" },
  { kind: "guide", say: "print" },
  { kind: "guide", say: "place" },
  { kind: "guide", say: "light" },
  { kind: "path" },
  ...questions.map((_, index): Step => ({ kind: "lesson", index })),
  { kind: "guide", say: "badge" },
  { kind: "finish", kept: false, hung: false },
];

function stepKey(step: Step): string {
  if (step.kind === "guide") return `guide-${step.say}`;
  if (step.kind === "lesson") return `lesson-${step.index}`;
  return step.kind;
}

export function DemoKiosk() {
  const [at, setAt] = useState(0);
  const [finish, setFinish] = useState({ kept: false, hung: false });
  const next = () => setAt((index) => Math.min(index + 1, visit.length - 1));
  const restart = () => {
    setFinish({ kept: false, hung: false });
    setAt(0);
  };
  const step = visit[at];
  return (
    <KioskCanvas>
      <AnimatePresence initial={false}>
        <motion.div
          key={stepKey(step)}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.base }}
        >
          <Screen step={step} finish={finish} onNext={next} onFinish={setFinish} onRestart={restart} />
        </motion.div>
      </AnimatePresence>
    </KioskCanvas>
  );
}

type ScreenProps = {
  step: Step;
  finish: { kept: boolean; hung: boolean };
  onNext: () => void;
  onFinish: (finish: { kept: boolean; hung: boolean }) => void;
  onRestart: () => void;
};

function Screen({ step, finish, onNext, onFinish, onRestart }: ScreenProps) {
  switch (step.kind) {
    case "welcome":
      return <WelcomeScene onStart={onNext} />;
    case "guide":
      return <WithNext label={demoKiosk.nextLabel} onNext={onNext}><GuideScene say={step.say} /></WithNext>;
    case "choose":
      return <DemoChoose onFold={onNext} />;
    case "path":
      return <WithNext label={demoKiosk.lessonLabel} onNext={onNext}><PathScene folds /></WithNext>;
    case "lesson":
      return <DemoLesson index={step.index} onAdvance={onNext} />;
    case "finish":
      return <Finish finish={finish} onFinish={onFinish} onRestart={onRestart} />;
  }
}

/** A kiosk screen with the button that moves the visit on, in its bottom corner. */
function WithNext({ label, onNext, children }: { label: string; onNext: () => void; children: ReactNode }) {
  return (
    <div className="relative h-full">
      {children}
      <div className="absolute bottom-10 right-12">
        <Button variant="primary" size="large" onClick={onNext}>
          {label}
        </Button>
      </div>
    </div>
  );
}

function Finish({ finish, onFinish, onRestart }: Pick<ScreenProps, "finish" | "onFinish" | "onRestart">) {
  return (
    <div className="relative h-full">
      <FinishScene
        kept={finish.kept}
        hung={finish.hung}
        onKeep={() => onFinish({ ...finish, kept: true })}
        onHang={() => onFinish({ ...finish, hung: true })}
      />
      {finish.kept || finish.hung ? (
        <div className="absolute bottom-10 right-12">
          <Button variant="chunky" size="large" onClick={onRestart}>
            {demoKiosk.againLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
