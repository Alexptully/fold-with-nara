"use client";

import { motion } from "motion/react";
import { method } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import type { NaraSpot } from "../NaraActor";
import { Reveal, SlideShell } from "../primitives";

/** Nara laughs along on the right, then walks to center stage for the bow on the next slide. */
export const methodSpot: NaraSpot = { x: 1330, y: 230, h: 720, pose: "laugh" };

export function MethodSlide() {
  return (
    <SlideShell heading={method.heading}>
      <table className="absolute left-24 top-[210px] w-[1180px] border-collapse text-left">
        <thead className="sr-only">
          <tr>
            <th>Duolingo Method principle</th>
            <th>How the station does it</th>
          </tr>
        </thead>
        <tbody>
          {method.rows.map((row, i) => (
            <motion.tr
              key={row.key}
              className="border-b-2 border-line"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.base, delay: 0.1 + i * 0.1, ease: ease.outSoft }}
            >
              <th scope="row" className="w-[540px] py-6 pr-10 align-top text-h3 text-ink">
                {row.key}
              </th>
              <td className="py-6 align-top text-body text-ink">{row.value}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <Reveal delay={0.9} className="absolute left-24 top-[880px] w-[1180px]">
        <p className="text-body text-ink-muted">{method.research}</p>
      </Reveal>
    </SlideShell>
  );
}
