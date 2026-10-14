"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { CranePaper } from "@/components/art/CranePaper";
import { questions, visit, visitTotalSeconds } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import { KeyValueList, Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

const BAR_WIDTH = 1728;
const ROUNDS_INDEX = 3;
const pxPerSecond = BAR_WIDTH / visitTotalSeconds;

const tones = ["bg-line-strong", "bg-ink-faint", "bg-line-strong", "bg-accent", "bg-ink-faint"];

export function VisitSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={visit.heading}>
      <Timeline />
      <div className="absolute left-24 top-[560px] w-[1080px]">
        <KeyValueList rows={visit.takeaways} keyWidth={290} visibleCount={step >= 2 ? visit.takeaways.length : 0} />
      </div>
      <Reveal show={step >= 2} delay={0.4} className="absolute right-24 top-[600px] flex items-center gap-6">
        <div className="h-[220px] w-[220px]">
          <CranePaper state={0} label="Before: a blank square" />
        </div>
        <ArrowRight size={56} weight="bold" className="text-ink-faint" aria-hidden="true" />
        <div className="h-[260px] w-[260px]">
          <CranePaper state={10} label="After: a crane" />
        </div>
      </Reveal>
    </SlideShell>
  );
}

function segmentStart(index: number): number {
  return visit.segments.slice(0, index).reduce((sum, segment) => sum + segment.seconds, 0);
}

function Timeline() {
  return (
    <div className="absolute left-24 top-[220px]" style={{ width: BAR_WIDTH }}>
      <SegmentLabels />
      <div className="mt-3 flex h-12 overflow-hidden rounded-pill">
        {visit.segments.map((segment, i) => (
          <motion.div
            key={segment.label}
            className={`h-full ${tones[i]} ${i === ROUNDS_INDEX ? "relative" : ""}`}
            style={{ width: segment.seconds * pxPerSecond }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: duration.base, delay: 0.15 * i, ease: ease.outSoft }}
            aria-label={`${segment.label}: ${segment.seconds} seconds`}
          >
            {i === ROUNDS_INDEX ? <RoundTicks /> : null}
          </motion.div>
        ))}
      </div>
      <MinuteAxis />
      <p className="mt-4 text-small text-ink-muted">{visit.estimateLabel}</p>
    </div>
  );
}

/** Ten rounds inside the green segment, one per question and fold. */
function RoundTicks() {
  return (
    <div className="absolute inset-0 flex">
      {questions.map((question) => (
        <span key={question.n} className="h-full flex-1 border-r-2 border-paper last:border-r-0" />
      ))}
    </div>
  );
}

const LABEL_ROW = 36;

/** The three short opening segments get one label row each, stepping up so none collide. */
function SegmentLabels() {
  const small = visit.segments.slice(0, ROUNDS_INDEX);
  const rounds = visit.segments[ROUNDS_INDEX];
  const roundsCenter = (segmentStart(ROUNDS_INDEX) + rounds.seconds / 2) * pxPerSecond;
  return (
    <div className="relative" style={{ height: LABEL_ROW * small.length }}>
      {small.map((segment, i) => (
        <p
          key={segment.label}
          className="absolute whitespace-nowrap text-small font-bold text-ink-muted"
          style={{ left: segmentStart(i) * pxPerSecond, bottom: (small.length - 1 - i) * LABEL_ROW }}
        >
          {segment.label}
        </p>
      ))}
      <p className="absolute bottom-0 -translate-x-1/2 whitespace-nowrap text-h3 text-accent-ink" style={{ left: roundsCenter }}>
        {rounds.label}
      </p>
      <p className="absolute bottom-0 right-0 text-small font-bold text-ink-muted">{visit.segments[4].label}</p>
    </div>
  );
}

function MinuteAxis() {
  const minutes = Array.from({ length: visitTotalSeconds / 60 + 1 }, (_, i) => i);
  return (
    <div className="relative mt-2 h-8">
      {minutes.map((minute) => {
        const isLast = minute === minutes.length - 1;
        return (
          <span
            key={minute}
            className={`absolute whitespace-nowrap text-small text-ink-muted ${isLast ? "-translate-x-full" : "-translate-x-1/2"}`}
            style={{ left: isLast ? BAR_WIDTH : minute * 60 * pxPerSecond }}
          >
            {isLast ? `${minute} min` : minute}
          </span>
        );
      })}
    </div>
  );
}
