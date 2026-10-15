"use client";

import { ArrowsClockwise, BookOpenText, Check, ChatCircleDots, X, type Icon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { FujiPaper } from "@/components/art/FujiPaper";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { method } from "@/content/content";
import { duration, ease, spring } from "@/lib/motion";
import type { NaraSpot } from "../NaraActor";
import { Jp, Reveal, SlideShell } from "../primitives";

/** Nara talks from the right, then walks to center stage for the bow on the next slide. */
export const methodSpot: NaraSpot = { x: 1380, y: 430, h: 560, pose: "talk" };

/** Four parts of the Duolingo Method, each shown as a piece of the station instead of a sentence. */
export function MethodSlide() {
  const { panels } = method;
  return (
    <SlideShell heading={method.heading}>
      <div className="absolute left-24 top-[180px] grid h-[800px] w-[1150px] grid-cols-2 grid-rows-2 gap-6">
        <Panel title={panels.biteSized.title} index={0}>
          <StoryLoop />
        </Panel>
        <Panel title={panels.feedback.title} index={1}>
          <FeedbackBanners />
        </Panel>
        <Panel title={panels.repetition.title} index={2}>
          <ReviewChips />
        </Panel>
        <Panel title={panels.progress.title} index={3}>
          <TakingShape />
        </Panel>
      </div>
      <Reveal delay={0.5} className="absolute left-[1300px] top-[176px] w-[540px]">
        <SpeechBubble>
          <p className="text-body font-bold text-ink">{method.naraLine}</p>
        </SpeechBubble>
      </Reveal>
      <Reveal delay={0.7} className="absolute left-[1300px] top-[340px] w-[540px]">
        <p className="text-body font-extrabold text-accent-ink">{method.audience}</p>
        <p className="text-body text-ink">{method.audienceLine}</p>
      </Reveal>
    </SlideShell>
  );
}

function Panel({ title, index, children }: { title: string; index: number; children: ReactNode }) {
  return (
    <motion.section
      className="flex flex-col rounded-card bg-paper-raised p-7 shadow-tile"
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...spring, delay: 0.1 + index * 0.12 }}
    >
      <h2 className="text-h3 text-ink">{title}</h2>
      <div className="grid flex-1 place-items-center">{children}</div>
    </motion.section>
  );
}

const loopIcons: Icon[] = [BookOpenText, ChatCircleDots];

/** Story, question, fold, and around again: one small loop per fold. */
function StoryLoop() {
  const { steps } = method.panels.biteSized;
  return (
    <div className="relative flex w-full items-start justify-between px-4">
      <svg className="absolute left-0 top-0 h-full w-full overflow-visible" aria-hidden="true">
        <line x1="22%" y1="48" x2="40%" y2="48" stroke="var(--color-accent)" strokeWidth="5" strokeDasharray="12 9" strokeLinecap="round" />
        <line x1="60%" y1="48" x2="78%" y2="48" stroke="var(--color-accent)" strokeWidth="5" strokeDasharray="12 9" strokeLinecap="round" />
      </svg>
      {steps.map((label, i) => (
        <div key={label} className="relative flex w-[130px] flex-col items-center">
          <span className="grid h-24 w-24 place-items-center rounded-pill bg-accent text-paper shadow-node">
            {i < loopIcons.length ? <LoopIcon icon={loopIcons[i]} /> : <FujiPaper state={1} tight className="h-12 w-20" label="Fold" />}
          </span>
          <span className="mt-3 text-small font-bold text-ink">{label}</span>
        </div>
      ))}
      <ArrowsClockwise size={44} weight="bold" className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-accent-ink" aria-label="Then around again" />
    </div>
  );
}

function LoopIcon({ icon: IconComponent }: { icon: Icon }) {
  return <IconComponent size={48} weight="fill" aria-hidden="true" />;
}

/** The lesson card's two feedback banners: a right answer and a miss with a hint. */
function FeedbackBanners() {
  const { right, wrong } = method.panels.feedback;
  return (
    <div className="flex w-full flex-col gap-4">
      <Banner good text={right} />
      <Banner text={wrong} />
    </div>
  );
}

function Banner({ good = false, text }: { good?: boolean; text: string }) {
  const tone = good ? "bg-accent-soft text-accent-ink" : "bg-wrong-soft text-wrong-ink";
  return (
    <div className={`flex items-center gap-4 rounded-tile px-5 py-3 ${tone}`}>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-pill bg-paper">
        {good ? <Check size={30} weight="bold" aria-hidden="true" /> : <X size={30} weight="bold" aria-hidden="true" />}
      </span>
      <span className="font-display text-h4">{text}</span>
    </div>
  );
}

/** Words from earlier in the walk come back together in the review round. */
function ReviewChips() {
  const { words, label } = method.panels.repetition;
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap justify-center gap-3">
        {words.map((word) => (
          <span key={word} className="rounded-tile bg-paper px-5 py-3 shadow-tile">
            <Jp className="text-jp-sm font-extrabold text-ink">{word}</Jp>
          </span>
        ))}
      </div>
      <span className="flex items-center gap-2 text-small font-bold text-macaw-ink">
        <ArrowsClockwise size={30} weight="bold" aria-hidden="true" />
        {label}
      </span>
    </div>
  );
}

/** Mt. Fuji at every stage, with the lesson's progress bar filling underneath. */
function TakingShape() {
  const stages = [0, 1, 2, 3];
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between">
        {stages.map((state) => (
          <div key={state} className="h-[110px] w-[110px]">
            <FujiPaper state={state} label={state === 3 ? "Finished Mt. Fuji" : `Mt. Fuji after fold ${state}`} />
          </div>
        ))}
      </div>
      <div className="h-5 overflow-hidden rounded-pill bg-line" role="presentation">
        <motion.div
          className="relative h-full rounded-pill bg-accent"
          initial={{ width: "8%" }}
          animate={{ width: "100%" }}
          transition={{ duration: duration.slow * 2, delay: 0.6, ease: ease.outSoft }}
        >
          <span className="absolute inset-x-3 top-1 h-1.5 rounded-pill bg-paper opacity-30" />
        </motion.div>
      </div>
    </div>
  );
}
