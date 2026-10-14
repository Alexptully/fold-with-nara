"use client";

import { motion } from "motion/react";
import { CranePaper } from "@/components/art/CranePaper";
import { NaraFigure } from "@/components/art/NaraFigure";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { encouragement, questions } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import { Jp, Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

const ROW_HEIGHT = 124;

export function EncouragementSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={encouragement.heading}>
      <div className="absolute left-24 top-[250px] w-[460px]">
        <NaraFigure />
      </div>
      <Timeline />
      <Reveal show={step >= 2} className="absolute left-[700px] top-[860px] right-24">
        <Progress show={step >= 2} />
      </Reveal>
    </SlideShell>
  );
}

function Timeline() {
  const height = ROW_HEIGHT * (encouragement.moments.length - 1);
  return (
    <div className="absolute left-[700px] top-[200px] right-24">
      <svg className="absolute left-[11px]" style={{ top: ROW_HEIGHT / 2 }} width="6" height={height} aria-hidden="true">
        <motion.line
          x1="3"
          y1="0"
          x2="3"
          stroke="var(--color-accent)"
          strokeWidth="5"
          strokeDasharray="14 10"
          initial={{ y2: 0 }}
          animate={{ y2: height }}
          transition={{ duration: 1.6, ease: ease.fold }}
        />
      </svg>
      <ol>
        {encouragement.moments.map((moment, i) => (
          <motion.li
            key={moment.when}
            className="relative flex items-center gap-8"
            style={{ height: ROW_HEIGHT }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: duration.base, delay: 0.2 + i * 0.18, ease: ease.outSoft }}
          >
            <span className="h-7 w-7 shrink-0 rounded-pill bg-paper-raised shadow-tile-correct" aria-hidden="true" />
            <p className="w-[250px] shrink-0 text-small font-extrabold text-ink-muted">{moment.when}</p>
            <SpeechBubble className="flex-1 py-4">
              <p className="text-body text-ink">{moment.line}</p>
            </SpeechBubble>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/** One badge per question, each marked with the first character of what it taught. */
function Progress({ show }: { show: boolean }) {
  return (
    <div className="flex items-center gap-8">
      <ol className="flex gap-3" aria-label="Ten badges, one per question">
        {questions.map((question, i) => (
          <motion.li
            key={question.n}
            className="grid h-14 w-14 place-items-center rounded-pill"
            initial={false}
            animate={{
              backgroundColor: show ? "var(--color-accent-soft)" : "var(--color-paper-sunk)",
              boxShadow: show ? "var(--shadow-tile-correct)" : "var(--shadow-tile)",
              scale: show ? [1, 1.15, 1] : 1,
            }}
            transition={{ duration: duration.base, delay: show ? 0.3 + i * 0.12 : 0 }}
          >
            <Jp className="text-small font-extrabold text-accent-ink">{question.topic.jp.charAt(0)}</Jp>
          </motion.li>
        ))}
      </ol>
      <div className="h-[110px] w-[110px] shrink-0">
        <CranePaper state={show ? 10 : 0} label="The finished crane" />
      </div>
      <p className="text-small text-ink">{encouragement.progress}</p>
    </div>
  );
}
