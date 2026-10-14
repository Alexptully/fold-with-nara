"use client";

import { ArrowCounterClockwise, CheckCircle } from "@phosphor-icons/react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { NaraAvatar } from "@/components/art/Nara";
import { Tile } from "@/components/ui/Tile";
import { questions, wrongAnswers, type ChoiceQuestion } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import type { Pt } from "@/lib/shapes";
import { FoldArrow, Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

// The sakura question is the worked example for a wrong answer.
const sakura = questions[3] as ChoiceQuestion;
const wrongOption = sakura.options[1];
const rightOption = sakura.options[sakura.correct];

export function WrongAnswersSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={wrongAnswers.heading}>
      <Lane top={200} title={wrongAnswers.answerLane.name} captions={wrongAnswers.answerLane.steps} show>
        <WrongTile />
        <ClueBubble />
        <ReviewChip />
      </Lane>
      <Lane top={570} title={wrongAnswers.foldLane.name} captions={wrongAnswers.foldLane.steps} show={step >= 2}>
        <Misfold stage="spotted" />
        <Misfold stage="guided" />
        <Misfold stage="fixed" />
      </Lane>
      <Reveal show={step >= 2} delay={0.8} className="absolute left-24 top-[930px] max-w-[1500px]">
        <p className="text-lead text-ink">{wrongAnswers.rule}</p>
      </Reveal>
    </SlideShell>
  );
}

const columns = [420, 900, 1380];

function Lane({ top, title, captions, show, children }: { top: number; title: string; captions: string[]; show: boolean; children: ReactNode[] }) {
  return (
    <motion.section
      className="absolute inset-x-0"
      style={{ top }}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 30 }}
      transition={{ duration: duration.slow, ease: ease.outSoft }}
    >
      <h2 className="absolute left-24 top-6 w-[280px] text-h3 text-ink">{title}</h2>
      {children.map((child, i) => (
        <div key={i} className="absolute w-[420px]" style={{ left: columns[i] }}>
          <div className="h-[220px] overflow-hidden rounded-card bg-paper-raised shadow-tile">{child}</div>
          <p className="mt-3 text-small text-ink">{captions[i]}</p>
        </div>
      ))}
      <svg className="absolute left-0 top-0" width={1920} height={240} aria-hidden="true">
        <FoldArrow from={[850, 110]} to={[890, 110]} bend={0} width={4} show={show} tone="ink" />
        <FoldArrow from={[1330, 110]} to={[1370, 110]} bend={0} width={4} show={show} tone="ink" delay={0.1} />
      </svg>
    </motion.section>
  );
}

function WrongTile() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6">
      <Tile state="wrong" disabled>
        {wrongOption}
      </Tile>
      <p className="rounded-tile bg-wrong-soft px-5 py-3 text-small font-extrabold text-wrong-ink">Almost!</p>
    </div>
  );
}

function ClueBubble() {
  const clueStart = sakura.story.indexOf(sakura.clue);
  const before = sakura.story.slice(Math.max(0, clueStart - 46), clueStart);
  return (
    <div className="flex h-full items-center gap-3 p-5">
      <NaraAvatar className="h-[70px] w-[100px] shrink-0" />
      <p className="text-small text-ink">
        ...{before}
        <mark className="rounded-md bg-accent-soft px-1 text-ink shadow-clue">{sakura.clue}</mark>.
      </p>
    </div>
  );
}

function ReviewChip() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6">
      <Tile state="correct" disabled>
        {rightOption}
      </Tile>
      <p className="flex items-center gap-3 text-small font-bold text-ink-muted">
        <ArrowCounterClockwise size={30} weight="bold" className="text-accent-ink" />
        Back in Q9, the review round
      </p>
    </div>
  );
}

type MisfoldStage = "spotted" | "guided" | "fixed";

// The flap should land its corner at (30, 30). In the misfold it lands at (52, 44).
const offCorner: Pt = [52, 44];
const target: Pt = [30, 30];

function Misfold({ stage }: { stage: MisfoldStage }) {
  const flapTip = stage === "fixed" ? target : offCorner;
  return (
    <div className="relative grid h-full place-items-center">
      <svg viewBox="0 0 240 240" className="h-[210px] w-[210px]" role="img" aria-label={`Fold ${stage}`}>
        <polygon points="30,30 210,30 30,210" fill="var(--color-sheet)" stroke="var(--color-sheet-edge)" strokeWidth={1.4} />
        <polygon
          points={`214,36 36,214 ${flapTip.join(",")}`}
          fill="var(--color-sheet-fold)"
          stroke={stage === "fixed" ? "var(--color-accent)" : "var(--color-sheet-edge)"}
          strokeWidth={stage === "fixed" ? 4 : 1.4}
        />
        {stage !== "fixed" ? <circle cx={offCorner[0]} cy={offCorner[1]} r={20} fill="none" stroke="var(--color-wrong)" strokeWidth={4} /> : null}
        {stage === "guided" ? <GuideToCorner /> : null}
      </svg>
      {stage === "fixed" ? <CheckCircle size={64} weight="fill" className="absolute bottom-4 right-6 text-accent" aria-label="Fold fixed" /> : null}
    </div>
  );
}

function GuideToCorner() {
  return (
    <g className="projected">
      <circle cx={target[0]} cy={target[1]} r={9} fill="var(--color-accent)" />
      <FoldArrow from={[offCorner[0] + 14, offCorner[1] + 22]} to={[target[0] + 6, target[1] + 14]} bend={-0.6} width={3} />
    </g>
  );
}
