"use client";

import { motion } from "motion/react";
import { FujiPaper } from "@/components/art/FujiPaper";
import { Nara } from "@/components/art/nara/Nara";
import { Rays } from "@/components/art/Rays";
import { Confetti } from "@/components/deck/Confetti";
import { LessonResults } from "@/components/lesson/LessonResults";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { celebration } from "@/content/content";
import { spring } from "@/lib/motion";
import { useOrientation } from "../KioskCanvas";

type FinishProps = { kept: boolean; hung: boolean; onKeep?: () => void; onHang?: () => void };

/** The kiosk's lesson-complete screen, then Nara seeing the model off to hang in the tent. */
export function FinishScene({ kept, hung, onKeep, onHang }: FinishProps) {
  const landscape = useOrientation() === "landscape";
  if (hung) return <Hung landscape={landscape} />;
  return (
    <div className="relative h-full overflow-hidden">
      <Confetti />
      <div className={`relative flex h-full items-center justify-center gap-10 px-16 ${landscape ? "" : "flex-col"}`}>
        <div className="flex flex-col items-center gap-4">
          <h1 className="relative z-10 text-h1 text-accent-ink">{celebration.heading}</h1>
          <div className="relative grid h-[320px] w-[560px] place-items-center">
            <Rays className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2" />
            <motion.div className="relative w-[520px]" initial={{ scale: 0.5, rotate: -8, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ ...spring, delay: 0.15 }}>
              <FujiPaper state={3} tight appear={false} className="h-full w-full" label="The finished origami Mt. Fuji" />
            </motion.div>
          </div>
          <LessonResults kept={kept} onKeep={onKeep} onHang={onHang} className="relative" />
        </div>
        <Nara pose="cheer" className={landscape ? "h-[700px] w-[482px] shrink-0" : "h-[420px] w-[290px] shrink-0"} />
      </div>
    </div>
  );
}

/** The model swings on its string while Nara says where it's going. */
function Hung({ landscape }: { landscape: boolean }) {
  return (
    <div className={`flex h-full items-center justify-center gap-16 px-16 ${landscape ? "" : "flex-col"}`}>
      <div className="relative h-[560px] w-[420px]">
        <motion.div
          className="absolute inset-x-0 top-0 flex h-full flex-col items-center"
          style={{ transformOrigin: "50% 0%" }}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: [0, 5, -4, 3, -2, 0] }}
          transition={{ y: spring, opacity: { duration: 0.3 }, rotate: { duration: 3.2, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" } }}
        >
          <span className="h-[260px] w-[3px] bg-ink-faint" aria-hidden="true" />
          <FujiPaper state={3} tight appear={false} className="-mt-3 w-[420px]" label="Mt. Fuji hanging from a string" />
        </motion.div>
      </div>
      <div className="flex flex-col items-center gap-8">
        <SpeechBubble tail="down">
          <p className="text-h3 text-ink">{celebration.hungLine}</p>
        </SpeechBubble>
        <Nara pose="love" className="h-[560px] w-[386px]" />
      </div>
    </div>
  );
}
