"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Nara, NaraSketch } from "@/components/art/nara/Nara";
import { OrigamiIcon } from "@/components/art/OrigamiIcon";
import { config } from "@/content/config";
import { reactions, type OrigamiModel } from "@/content/content";
import { spring } from "@/lib/motion";
import { useOrientation } from "../KioskCanvas";
import { StartButton } from "./GuidePictures";

/** Screens from before a visitor starts: waiting for someone, Nara's outline, and her expressions. */

const floatingModels: OrigamiModel[] = ["sakura", "crane", "fuji", "koi", "kabuto"];

/** The kiosk waiting for a visitor. Nara hasn't been revealed yet, so only the paper models are here. */
export function WelcomeScene() {
  const landscape = useOrientation() === "landscape";
  return (
    <div className="flex h-full flex-col items-center justify-center gap-16 px-16">
      <div className="flex items-end gap-6">
        {floatingModels.map((model, i) => (
          <motion.div
            key={model}
            animate={{ y: [0, -18, 0], rotate: [0, i % 2 ? 4 : -4, 0] }}
            transition={{ duration: 3.2, delay: i * 0.35, repeat: Infinity, ease: "easeInOut" }}
          >
            <OrigamiIcon model={model} label="" className={model === "fuji" ? "h-[200px] w-[200px]" : "h-[150px] w-[150px]"} />
          </motion.div>
        ))}
      </div>
      <h1 className={`text-center text-ink ${landscape ? "text-display" : "text-h1"}`}>{config.productName}</h1>
      <StartButton />
    </div>
  );
}

/** "Meet Nara", step 1: only her outline, as on the slide. */
export function SketchScene() {
  return (
    <div className="grid h-full place-items-center">
      <motion.div animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
        <NaraSketch className="h-[560px] w-[657px]" title={`${config.characterName}, outline sketch`} />
      </motion.div>
    </div>
  );
}

const CYCLE_MS = 1500;

/** Steps through her expressions on a loop; on the second build, only the two for mistakes. */
export function ReactionsScene({ misses }: { misses: boolean }) {
  const lineup = misses ? reactions.lineup.filter((item) => item.fix) : reactions.lineup;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((count) => count + 1), CYCLE_MS);
    return () => clearInterval(timer);
  }, []);
  const item = lineup[tick % lineup.length];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <motion.div key={item.pose} initial={{ scale: 0.92, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={spring}>
        <Nara pose={item.pose} className="h-[640px] w-[441px]" />
      </motion.div>
      <p className="text-h2 text-ink">{item.moment}</p>
      <p className={`rounded-tile bg-wrong-soft px-6 py-3 text-h4 text-wrong-ink ${item.fix ? "" : "invisible"}`}>{item.fix ?? " "}</p>
    </div>
  );
}
