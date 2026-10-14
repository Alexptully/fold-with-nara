"use client";

import { motion } from "motion/react";
import { Nara } from "@/components/art/nara/Nara";
import { encouragement, questions } from "@/content/content";
import { duration, spring } from "@/lib/motion";
import { Jp, Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

/** Nara's seven expressions from the character sheet, each tied to the moment it appears. */
export function EncouragementSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={encouragement.heading}>
      <ol className="absolute left-16 right-16 top-[190px] grid grid-cols-7 gap-4">
        {encouragement.expressions.map((item, i) => (
          <motion.li
            key={item.pose}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 + i * 0.09 }}
          >
            <Nara pose={item.pose} className="h-[330px] w-[220px]" />
            <p className="mt-3 text-small font-extrabold text-ink-muted">{item.when}</p>
            <p className="mt-3 w-full rounded-tile bg-paper-raised px-4 py-3 text-small text-ink shadow-tile">{item.line}</p>
          </motion.li>
        ))}
      </ol>
      <Reveal show={step >= 2} className="absolute left-24 right-24 top-[850px]">
        <Progress show={step >= 2} />
      </Reveal>
    </SlideShell>
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
            className="grid h-16 w-16 place-items-center rounded-pill"
            initial={false}
            animate={{
              backgroundColor: show ? "var(--color-bee)" : "var(--color-paper-sunk)",
              boxShadow: show ? "var(--shadow-badge)" : "var(--shadow-tile)",
              scale: show ? [1, 1.18, 1] : 1,
            }}
            transition={{ duration: duration.base, delay: show ? 0.2 + i * 0.1 : 0 }}
          >
            <Jp className="text-small font-extrabold text-ink">{question.topic.jp.charAt(0)}</Jp>
          </motion.li>
        ))}
      </ol>
      <p className="text-body text-ink">{encouragement.progress}</p>
    </div>
  );
}
