"use client";

import { motion } from "motion/react";
import { FujiPaper } from "@/components/art/FujiPaper";
import { Nara } from "@/components/art/nara/Nara";
import { Crease } from "@/components/deck/primitives";
import { exerciseIcons } from "@/components/lesson/exerciseIcons";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { foldUnlockedBy, kioskScreen, questions } from "@/content/content";
import { spring } from "@/lib/motion";
import type { Pt } from "@/lib/shapes";
import { useOrientation } from "../KioskCanvas";

/**
 * The lesson's ten stops as a Duolingo learning path, joined by the deck's dashed
 * crease. On the overview's second build, the folds each stop unlocks appear beside it.
 */

const BOX = { width: 560, height: 900 };
const R = 46;
// The path swings left and right like Duolingo's, starting from the middle.
const swing = [0, 80, 120, 80, 0, -80, -120, -80, 0, 80];
const stops: Pt[] = swing.map((dx, i) => [250 + dx, 62 + i * 86]);
const THUMB = 124;
const thumbAt = (at: Pt): Pt => [at[0] + 150, at[1]];

export function PathScene({ folds }: { folds: boolean }) {
  const landscape = useOrientation() === "landscape";
  if (landscape) {
    return (
      <div className="flex h-full items-center justify-center gap-16 px-16">
        <div className="flex w-[520px] flex-col items-center gap-8">
          <SpeechBubble tail="down">
            <p className="text-h3 text-ink">{kioskScreen.pathLine}</p>
          </SpeechBubble>
          <Nara pose="present" className="h-[560px] w-[386px]" />
        </div>
        <LessonPath folds={folds} />
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-16">
      <div className="flex items-center gap-8">
        <Nara pose="present" className="h-[360px] w-[248px] shrink-0" />
        <SpeechBubble className="max-w-[560px]">
          <p className="text-h3 text-ink">{kioskScreen.pathLine}</p>
        </SpeechBubble>
      </div>
      <LessonPath folds={folds} />
    </div>
  );
}

function LessonPath({ folds }: { folds: boolean }) {
  return (
    <div className="relative shrink-0" style={BOX} aria-label="The lesson path: ten questions">
      <svg className="absolute inset-0" width={BOX.width} height={BOX.height} aria-hidden="true">
        {stops.slice(1).map((to, i) => (
          <Crease key={i} from={stops[i]} to={to} tone="faint" width={8} delay={i * 0.05} />
        ))}
        {stops.map((at, i) =>
          foldUnlockedBy(i + 1) || i === stops.length - 1 ? <Crease key={`f${i}`} from={[at[0] + R + 8, at[1]]} to={[thumbAt(at)[0] - THUMB / 2, at[1]]} draw={folds} width={6} delay={0.2} /> : null,
        )}
      </svg>
      {stops.map((at, i) => (
        <Stop key={i} index={i} at={at} />
      ))}
      {stops.map((at, i) => (
        <FoldThumb key={`t${i}`} index={i} at={thumbAt(at)} show={folds} />
      ))}
    </div>
  );
}

function Stop({ index, at }: { index: number; at: Pt }) {
  const question = questions[index];
  const Icon = exerciseIcons[question.kind];
  const first = index === 0;
  return (
    <div className="absolute" style={{ left: at[0] - R, top: at[1] - R, width: R * 2, height: R * 2 }}>
      {first ? (
        <motion.span
          className="absolute -inset-3 rounded-pill bg-accent-soft"
          animate={{ scale: [1, 1.12, 1], opacity: [0.9, 0.5, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      ) : null}
      <motion.span
        className={`relative grid h-full w-full place-items-center rounded-pill ${first ? "bg-accent text-paper shadow-node" : "bg-line text-ink-faint shadow-node-locked"}`}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...spring, delay: index * 0.05 }}
      >
        <Icon size={44} weight="fill" aria-label={`Question ${question.n}`} />
      </motion.span>
    </div>
  );
}

/** The paper after the fold this stop unlocks, or the finished mountain beside the last stop. */
function FoldThumb({ index, at, show }: { index: number; at: Pt; show: boolean }) {
  const fold = foldUnlockedBy(index + 1);
  const last = index === stops.length - 1;
  if (!fold && !last) return null;
  return (
    <motion.div
      className="absolute"
      style={{ left: at[0] - THUMB / 2, top: at[1] - THUMB / 2, width: THUMB, height: THUMB }}
      initial={false}
      animate={{ scale: show ? 1 : 0.4, opacity: show ? 1 : 0 }}
      transition={{ ...spring, delay: show ? 0.3 + index * 0.04 : 0 }}
    >
      <FujiPaper state={fold ? fold.n : 3} appear={false} className="h-full w-full" label={fold ? `Fold ${fold.n}` : "The finished Mt. Fuji"} />
    </motion.div>
  );
}
