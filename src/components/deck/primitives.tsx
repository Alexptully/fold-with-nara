"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { duration, ease, rise } from "@/lib/motion";
import type { Pt } from "@/lib/shapes";

/** The standard slide frame: one heading in the top-left, content below. */
export function SlideShell({ heading, children }: { heading?: string; children: ReactNode }) {
  return (
    <div className="absolute inset-0 px-24 pt-16 pb-24">
      {heading ? <h1 className="text-h1 text-ink">{heading}</h1> : null}
      {children}
    </div>
  );
}

/** Fades and lifts its children in when `show` turns true. */
export function Reveal({
  show = true,
  delay = 0,
  className,
  children,
}: {
  show?: boolean;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={className}
      variants={rise}
      custom={delay}
      initial="hidden"
      animate={show ? "shown" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export type KeyValue = { key: string; value: ReactNode };

/** Facts as a two-column block: the key quiet on the left, the value on the right. */
export function KeyValueList({
  rows,
  keyWidth = 240,
  className = "",
  visibleCount,
  stacked = false,
  size = "body",
}: {
  rows: readonly KeyValue[];
  keyWidth?: number;
  className?: string;
  visibleCount?: number;
  /** Put each key above its value instead of beside it. */
  stacked?: boolean;
  /** "small" sets values at 24px for dense facts beside a drawing. */
  size?: "body" | "small";
}) {
  const shown = visibleCount ?? rows.length;
  const columns = stacked ? "1fr" : `${keyWidth}px 1fr`;
  const gaps = stacked ? "gap-y-1 [&>dd]:mb-8" : "gap-x-8 gap-y-5";
  return (
    <dl className={`grid ${gaps} ${className}`} style={{ gridTemplateColumns: columns }}>
      {rows.flatMap((row, i) => {
        const fade = {
          initial: false as const,
          animate: { opacity: i < shown ? 1 : 0, y: i < shown ? 0 : 12 },
          transition: { duration: duration.base, delay: i < shown ? i * 0.08 : 0 },
        };
        return [
          <motion.dt key={`${row.key}-k`} {...fade} className={`text-small text-ink-muted font-extrabold ${size === "small" ? "" : "pt-1"}`}>
            {row.key}
          </motion.dt>,
          <motion.dd key={`${row.key}-v`} {...fade} className={`${size === "small" ? "text-small" : "text-body"} text-ink`}>
            {row.value}
          </motion.dd>,
        ];
      })}
    </dl>
  );
}

/** Japanese text, set in the rounded Japanese face and marked for screen readers. */
export function Jp({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span lang="ja" className={`jp ${className}`}>
      {children}
    </span>
  );
}

/**
 * The deck's motif: the dashed crease line Nara's projector draws on paper.
 * `draw` animates it in from its first point.
 */
export function Crease({
  from,
  to,
  draw = true,
  delay = 0,
  tone = "accent",
  width = 4,
}: {
  from: Pt;
  to: Pt;
  draw?: boolean;
  delay?: number;
  tone?: "accent" | "ink" | "faint" | "wrong";
  width?: number;
}) {
  const stroke = creaseTone[tone];
  // The line grows from its first point. (Animating pathLength would replace the dash pattern.)
  const end = draw ? { x2: to[0], y2: to[1], opacity: 1 } : { x2: from[0], y2: from[1], opacity: 0 };
  return (
    <motion.line
      x1={from[0]}
      y1={from[1]}
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={`${width * 3} ${width * 2.5}`}
      initial={{ x2: from[0], y2: from[1], opacity: 0 }}
      animate={end}
      transition={{ duration: duration.slow, delay, ease: ease.fold }}
    />
  );
}

const creaseTone = {
  accent: "var(--color-accent)",
  ink: "var(--color-ink-muted)",
  faint: "var(--color-line-strong)",
  wrong: "var(--color-wrong)",
};

/** A curved arrow that shows where a corner or edge should travel. */
export function FoldArrow({
  from,
  to,
  bend = 0.35,
  show = true,
  delay = 0,
  tone = "accent",
  width = 5,
}: {
  from: Pt;
  to: Pt;
  bend?: number;
  show?: boolean;
  delay?: number;
  tone?: "accent" | "ink" | "wrong";
  width?: number;
}) {
  const mid: Pt = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  const normal: Pt = [-(to[1] - from[1]) * bend, (to[0] - from[0]) * bend];
  const control: Pt = [mid[0] + normal[0], mid[1] + normal[1]];
  const head = arrowHead(control, to, width * 3.2);
  const stroke = creaseTone[tone];
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: duration.base, delay }}
    >
      <motion.path
        d={`M${from[0]} ${from[1]} Q${control[0]} ${control[1]} ${to[0]} ${to[1]}`}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: show ? 1 : 0 }}
        transition={{ duration: duration.slow, delay, ease: ease.fold }}
      />
      <path d={head} fill={stroke} />
    </motion.g>
  );
}

function arrowHead(control: Pt, tip: Pt, size: number): string {
  const angle = Math.atan2(tip[1] - control[1], tip[0] - control[0]);
  const left: Pt = [tip[0] - size * Math.cos(angle - 0.45), tip[1] - size * Math.sin(angle - 0.45)];
  const right: Pt = [tip[0] - size * Math.cos(angle + 0.45), tip[1] - size * Math.sin(angle + 0.45)];
  return `M${tip[0]} ${tip[1]} L${left[0]} ${left[1]} L${right[0]} ${right[1]} Z`;
}
