"use client";

import { motion } from "motion/react";
import { Nara } from "@/components/art/nara/Nara";
import { reactions, type Reaction } from "@/content/content";
import { duration, spring } from "@/lib/motion";
import { Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

/**
 * Step 1: one expression per moment of the lesson. Step 2: the two that handle
 * mistakes come forward with what Nara does about them; the rest step back.
 */
export function ReactionsSlide({ step }: SlideProps) {
  const focusMisses = step >= 2;
  return (
    <SlideShell heading={reactions.heading}>
      <ol className="absolute left-16 right-16 top-[190px] grid grid-cols-7 gap-4">
        {reactions.lineup.map((item, i) => (
          <Column key={item.pose} item={item} index={i} dim={focusMisses && !item.fix} showFix={focusMisses} />
        ))}
      </ol>
      <Reveal show={focusMisses} delay={0.35} className="absolute inset-x-0 top-[800px] text-center">
        <p className="text-h2 text-ink">{reactions.rule}</p>
      </Reveal>
    </SlideShell>
  );
}

function Column({ item, index, dim, showFix }: { item: Reaction; index: number; dim: boolean; showFix: boolean }) {
  return (
    <motion.li
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: dim ? 0.3 : 1, y: 0 }}
      transition={{ ...spring, delay: dim ? 0 : 0.1 + index * 0.08, opacity: { duration: duration.base } }}
    >
      <Nara pose={item.pose} className="h-[380px] w-[262px]" />
      <p className="mt-2 text-body font-extrabold text-ink">{item.moment}</p>
      {item.fix ? (
        <motion.p
          className="mt-4 rounded-tile bg-wrong-soft px-4 py-2 text-body font-bold text-wrong-ink"
          initial={false}
          animate={{ opacity: showFix ? 1 : 0, scale: showFix ? 1 : 0.8 }}
          transition={spring}
        >
          {item.fix}
        </motion.p>
      ) : null}
    </motion.li>
  );
}
