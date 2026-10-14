"use client";

import {
  Bird,
  ChatCircleText,
  Check,
  CursorClick,
  DeviceMobile,
  FrameCorners,
  HandWaving,
  Printer,
  ProjectorScreen,
  Ticket,
  type Icon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { Nara } from "@/components/art/nara/Nara";
import { journey, type JourneyIcon } from "@/content/content";
import { spring } from "@/lib/motion";
import type { Pt } from "@/lib/shapes";
import { SlideShell } from "../primitives";
import type { SlideProps } from "../types";

/**
 * The visit drawn as a Duolingo learning path: round "lesson" nodes joined by
 * the deck's dashed crease. Each press completes a node and Nara walks on.
 */

const icons: Record<JourneyIcon, Icon> = {
  wave: HandWaving,
  ticket: Ticket,
  choose: CursorClick,
  print: Printer,
  frame: FrameCorners,
  projector: ProjectorScreen,
  question: ChatCircleText,
  phone: DeviceMobile,
  bird: Bird,
};

const ROW_1 = 360;
const ROW_2 = 760;
const nodes: Pt[] = [
  [210, ROW_1],
  [560, ROW_1],
  [910, ROW_1],
  [1260, ROW_1],
  [1590, ROW_1],
  [1500, ROW_2],
  [1150, ROW_2],
  [800, ROW_2],
  [450, ROW_2],
];
const R = 58;

function segment(from: Pt, to: Pt): string {
  if (from[1] === to[1]) return `M${from[0]} ${from[1]} L${to[0]} ${to[1]}`;
  return `M${from[0]} ${from[1]} C${from[0] + 290} ${from[1]} ${to[0] + 330} ${to[1]} ${to[0]} ${to[1]}`;
}

type NodeState = "done" | "current" | "locked";
const stateOf = (index: number, step: number): NodeState => {
  if (index + 1 < step) return "done";
  return index + 1 === step ? "current" : "locked";
};

export function JourneySlide({ step }: SlideProps) {
  const current = nodes[Math.min(step, nodes.length) - 1];
  const onRowTwo = current[1] === ROW_2;
  return (
    <SlideShell heading={journey.heading}>
      <svg className="absolute inset-0" width={1920} height={1080} aria-hidden="true">
        {nodes.slice(1).map((to, i) => (
          <path
            key={i}
            d={segment(nodes[i], to)}
            fill="none"
            stroke={i + 2 <= step ? "var(--color-accent)" : "var(--color-line)"}
            strokeWidth={10}
            strokeDasharray="22 16"
            strokeLinecap="round"
            style={{ transition: "stroke 0.4s" }}
          />
        ))}
      </svg>
      <ol>
        {journey.steps.map((item, i) => (
          <PathNode key={item.title} index={i} at={nodes[i]} state={stateOf(i, step)} icon={icons[item.icon]} title={item.title} body={item.body} />
        ))}
      </ol>
      <motion.div
        className="absolute h-[200px] w-[134px]"
        initial={false}
        animate={{ left: current[0] + (onRowTwo ? 72 : -206), top: current[1] - 150 }}
        transition={spring}
      >
        <Nara pose={step === nodes.length ? "cheer" : "talk"} className="h-full w-full" />
      </motion.div>
    </SlideShell>
  );
}

const nodeLook: Record<NodeState, string> = {
  done: "bg-accent text-paper shadow-node",
  current: "bg-accent text-paper shadow-node",
  locked: "bg-line text-ink-faint shadow-node-locked",
};

function PathNode({ index, at, state, icon: IconComponent, title, body }: { index: number; at: Pt; state: NodeState; icon: Icon; title: string; body: string }) {
  const shown = state !== "locked";
  return (
    <li className="absolute w-[300px] -translate-x-1/2 text-center" style={{ left: at[0], top: at[1] - R }}>
      <div className="relative mx-auto h-[116px] w-[116px]">
        {state === "current" ? <CurrentRing /> : null}
        <motion.span
          className={`relative grid h-full w-full place-items-center rounded-pill transition-colors duration-300 ${nodeLook[state]}`}
          initial={false}
          animate={state === "current" ? { scale: [0.8, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          {state === "done" ? <Check size={54} weight="bold" aria-hidden="true" /> : <IconComponent size={54} weight="fill" aria-hidden="true" />}
        </motion.span>
      </div>
      <motion.div initial={false} animate={{ opacity: shown ? 1 : 0.45 }} transition={{ duration: 0.3 }}>
        <h2 className="mt-5 text-h4 text-ink">
          {index + 1}. {title}
        </h2>
        <p className="mt-1 text-small text-ink-muted">{body}</p>
      </motion.div>
    </li>
  );
}

/** A soft ring that pulses around the step Nara is on. */
function CurrentRing() {
  return (
    <motion.span
      className="absolute -inset-3 rounded-pill bg-accent-soft"
      animate={{ scale: [1, 1.12, 1], opacity: [0.9, 0.5, 0.9] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    />
  );
}
