"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Nara } from "@/components/art/nara/Nara";
import { Jp } from "@/components/deck/primitives";
import { SparkleBurst } from "@/components/deck/SparkleBurst";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { kioskScreen, type KioskGuide, type KioskGuideKey } from "@/content/content";
import { spring } from "@/lib/motion";
import { useOrientation } from "../KioskCanvas";
import { GuidePicture } from "./GuidePictures";

/**
 * Nara talking to the visitor, with a picture of what to do when there is one.
 * "meet" is her reveal: she pops in with sparkles, at the same moment as on the slide.
 */
export function GuideScene({ say }: { say: KioskGuideKey }) {
  const guide: KioskGuide = kioskScreen.guide[say];
  const landscape = useOrientation() === "landscape";
  if (!guide.picture) return <Spotlight guide={guide} reveal={say === "meet"} landscape={landscape} />;
  const picture = (
    <div className="grid flex-1 place-items-center">
      <GuidePicture picture={guide.picture} />
    </div>
  );
  if (landscape) {
    return (
      <div className="flex h-full items-end gap-10 px-16 py-14">
        <Nara pose={guide.pose} className="h-[700px] w-[482px] shrink-0" />
        {/* As tall as Nara, so her line starts beside her head and the picture fills the rest. */}
        <div className="flex h-[660px] flex-1 flex-col gap-8">
          <SpeechBubble>
            <Line guide={guide} />
          </SpeechBubble>
          {picture}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col gap-10 px-16 py-14">
      <div className="flex items-center gap-8">
        <Nara pose={guide.pose} className="h-[420px] w-[290px] shrink-0" />
        <SpeechBubble className="flex-1">
          <Line guide={guide} />
        </SpeechBubble>
      </div>
      {picture}
    </div>
  );
}

/** Nara on her own, large, with what she says beside her (or above her when the screen is tall). */
function Spotlight({ guide, reveal, landscape }: { guide: KioskGuide; reveal: boolean; landscape: boolean }) {
  return (
    <div className={`flex h-full items-center justify-center gap-12 px-16 ${landscape ? "" : "flex-col-reverse"}`}>
      <RevealedNara guide={guide} reveal={reveal} />
      <SpeechBubble className={landscape ? "max-w-[640px]" : "max-w-[860px]"} tail={landscape ? "left" : "down"}>
        <Line guide={guide} large />
      </SpeechBubble>
    </div>
  );
}

function RevealedNara({ guide, reveal }: { guide: KioskGuide; reveal: boolean }) {
  // The sparkles fire just after she pops in; they never play on a page that opens mid-scene.
  const [burst, setBurst] = useState(false);
  useEffect(() => {
    if (!reveal) return;
    const timer = setTimeout(() => setBurst(true), 250);
    return () => clearTimeout(timer);
  }, [reveal]);
  return (
    <motion.div
      className="relative h-[720px] w-[496px] shrink-0"
      style={{ transformOrigin: "50% 100%" }}
      initial={reveal ? { scale: 0.6, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={spring}
    >
      <Nara pose={guide.pose} className="h-full w-full" />
      <div className="absolute left-[8%] right-[8%] top-[4%] h-[46%]">
        <SparkleBurst on={burst} />
      </div>
    </motion.div>
  );
}

function lineSize(guide: KioskGuide, large: boolean) {
  if (guide.jp) return "mt-4 text-lead";
  return large ? "text-h2" : "text-h3";
}

function Line({ guide, large = false }: { guide: KioskGuide; large?: boolean }) {
  return (
    <>
      {guide.jp ? <Jp className="block text-jp-md font-extrabold text-ink">{guide.jp}</Jp> : null}
      {guide.romaji ? <p className="mt-2 text-h3 text-accent-ink">{guide.romaji}</p> : null}
      <p className={`text-ink ${lineSize(guide, large)}`}>{guide.line}</p>
    </>
  );
}
