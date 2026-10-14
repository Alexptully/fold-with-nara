"use client";

import { CheckCircle, LockSimpleOpen } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { CranePaper } from "@/components/art/CranePaper";
import { mechanism } from "@/content/content";
import { duration, ease } from "@/lib/motion";
import type { Pt } from "@/lib/shapes";
import { FoldArrow, Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

export function MechanismSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={mechanism.heading}>
      <div className="absolute left-24 top-[200px] h-[640px] w-[640px] rounded-card bg-paper-sunk shadow-well">
        <FrameMarks />
        <div className="absolute inset-10">
          <PaperForStep step={step} />
        </div>
      </div>
      <Reveal className="absolute left-24 top-[870px] w-[640px]">
        <p className="text-small text-ink-muted">{mechanism.paperNote}</p>
      </Reveal>
      <Loop active={step} />
    </SlideShell>
  );
}

const paperByStep: Record<number, () => React.ReactNode> = {
  1: () => <CranePaper state={0} guide={1} guidance="show" label="The projector draws the first crease and an arrow on the paper" />,
  2: () => <FoldedTriangle />,
  3: () => <FoldedTriangle checked />,
  4: () => (
    <div className="relative h-full w-full">
      <CranePaper state={1} guide={2} guidance="mark" label="The next fold lights up after a right answer" />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-pill bg-paper-raised p-5 text-accent-ink shadow-card"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: duration.base, delay: 0.3, ease: ease.outSoft }}
      >
        <LockSimpleOpen size={56} weight="bold" aria-label="Next fold unlocked" />
      </motion.div>
    </div>
  ),
};

function PaperForStep({ step }: { step: number }) {
  const render = paperByStep[step] ?? paperByStep[1];
  return <>{render()}</>;
}

/** The sheet folded corner to corner, as the visitor's hands leave it. */
function FoldedTriangle({ checked = false }: { checked?: boolean }) {
  const brackets: Pt[] = [[22, 22], [218, 22], [22, 218]];
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 240 240" className="h-full w-full" role="img" aria-label="Paper folded corner to corner into a triangle">
        <g style={{ filter: "var(--shadow-drop-sheet)" }}>
          <polygon points="30,30 210,30 30,210" fill="var(--color-sheet-fold)" stroke="var(--color-sheet-edge)" strokeWidth={1.4} />
        </g>
        <line x1={30} y1={210} x2={210} y2={30} stroke="var(--color-sheet-edge)" strokeWidth={1.4} />
        {checked ? brackets.map((corner, i) => <Bracket key={i} at={corner} index={i} />) : null}
        {checked ? <ScanLine /> : null}
        {!checked ? <FoldArrow from={[196, 196]} to={[60, 60]} bend={0.3} width={3} tone="ink" /> : null}
      </svg>
      {checked ? (
        <motion.div
          className="absolute bottom-6 right-6 text-accent"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: duration.base, delay: 1.2, ease: ease.outSoft }}
        >
          <CheckCircle size={120} weight="fill" aria-label="Fold checked" />
        </motion.div>
      ) : null}
    </div>
  );
}

function Bracket({ at, index }: { at: Pt; index: number }) {
  const [x, y] = at;
  const sx = x < 120 ? 1 : -1;
  const sy = y < 120 ? 1 : -1;
  return (
    <motion.path
      d={`M${x} ${y + 18 * sy} L${x} ${y} L${x + 18 * sx} ${y}`}
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth={3.5}
      strokeLinecap="round"
      className="projected"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.quick, delay: index * 0.1 }}
    />
  );
}

/** The camera's scan, sweeping once across the folded sheet. */
function ScanLine() {
  return (
    <motion.rect
      x={24}
      width={192}
      height={3}
      fill="var(--color-accent)"
      initial={{ y: 26, opacity: 0.9 }}
      animate={{ y: 214, opacity: 0 }}
      transition={{ duration: 1.1, ease: ease.fold, delay: 0.2 }}
    />
  );
}

/** Corner marks printed on the folding frame so visitors know where the paper goes. */
function FrameMarks() {
  const size = 34;
  const marks = [
    "left-6 top-6 border-l-4 border-t-4",
    "right-6 top-6 border-r-4 border-t-4",
    "bottom-6 left-6 border-b-4 border-l-4",
    "bottom-6 right-6 border-b-4 border-r-4",
  ];
  return (
    <>
      {marks.map((position) => (
        <span key={position} className={`absolute border-ink-faint ${position}`} style={{ width: size, height: size }} aria-hidden="true" />
      ))}
    </>
  );
}

const nodePositions: { left: number; top: number }[] = [
  { left: 1180, top: 190 },
  { left: 1500, top: 440 },
  { left: 1180, top: 690 },
  { left: 860, top: 440 },
];

const loopArrows: { from: Pt; to: Pt }[] = [
  { from: [1520, 300], to: [1640, 420] },
  { from: [1640, 600], to: [1520, 700] },
  { from: [1160, 760], to: [1040, 620] },
  { from: [1040, 420], to: [1160, 290] },
];

/** Show, fold, check, ask: the loop every fold goes through. */
function Loop({ active }: { active: number }) {
  return (
    <div className="absolute inset-0" aria-label="The station's loop for every fold">
      <svg className="absolute inset-0" width={1920} height={1080} aria-hidden="true">
        {loopArrows.map((arrow, i) => (
          <FoldArrow key={i} from={arrow.from} to={arrow.to} bend={0.25} width={4} tone={i + 1 === active ? "accent" : "ink"} delay={0.1 * i} />
        ))}
      </svg>
      {mechanism.loop.map((node, i) => (
        <LoopNode key={node.key} title={node.key} body={node.value} lit={i + 1 === active} at={nodePositions[i]} />
      ))}
    </div>
  );
}

function LoopNode({ title, body, lit, at }: { title: string; body: string; lit: boolean; at: { left: number; top: number } }) {
  return (
    <motion.div
      className="absolute w-[340px] rounded-card bg-paper-raised px-7 py-5"
      style={{ left: at.left, top: at.top }}
      animate={{
        boxShadow: lit ? "var(--shadow-tile-correct)" : "var(--shadow-tile)",
        opacity: lit ? 1 : 0.6,
        scale: lit ? 1.04 : 1,
      }}
      transition={{ duration: duration.base, ease: ease.outSoft }}
    >
      <h2 className={`text-h3 ${lit ? "text-accent-ink" : "text-ink"}`}>{title}</h2>
      <p className="mt-1 text-small text-ink">{body}</p>
    </motion.div>
  );
}
