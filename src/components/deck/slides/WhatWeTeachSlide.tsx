"use client";

import { motion } from "motion/react";
import { whatWeTeach } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import { Jp, KeyValueList, Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

export function WhatWeTeachSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={whatWeTeach.heading}>
      <Reveal className="mt-10 max-w-[1500px]">
        <p className="text-h2 text-ink">{whatWeTeach.objective}</p>
      </Reveal>
      <WordEquation />
      <div className="absolute left-24 right-24 top-[790px] grid grid-cols-2 gap-16">
        {whatWeTeach.reasons.map((reason) => (
          <KeyValueList key={reason.key} rows={[reason]} stacked visibleCount={step >= 2 ? 1 : 0} />
        ))}
      </div>
    </SlideShell>
  );
}

/** 折り (ori, to fold) + 紙 (kami, paper) = 折り紙 (origami). */
function WordEquation() {
  const [ori, kami] = whatWeTeach.wordParts;
  return (
    <div className="absolute left-24 top-[380px] flex items-start gap-10">
      <WordPart jp={ori.jp} romaji={ori.romaji} english={ori.english} delay={0.2} />
      <Operator symbol="+" delay={0.35} />
      <WordPart jp={kami.jp} romaji={kami.romaji} english={kami.english} delay={0.45} />
      <Operator symbol="=" delay={0.6} />
      <WordPart jp="折り紙" romaji="origami" english="folding paper" delay={0.75} accent />
    </div>
  );
}

function WordPart({ jp, romaji, english, delay, accent = false }: { jp: string; romaji: string; english: string; delay: number; accent?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, delay, ease: ease.outSoft }}
    >
      <Jp className={`block text-jp-xl font-extrabold ${accent ? "text-accent-ink" : "text-ink"}`}>{jp}</Jp>
      <p className="mt-4 text-h3 text-ink">{romaji}</p>
      <p className="text-body text-ink-muted">{english}</p>
    </motion.div>
  );
}

function Operator({ symbol, delay }: { symbol: string; delay: number }) {
  return (
    <motion.span
      className="pt-10 text-h1 text-ink-faint"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.base, delay }}
      aria-hidden="true"
    >
      {symbol}
    </motion.span>
  );
}
