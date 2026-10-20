"use client";

import { motion } from "motion/react";
import { OrigamiIcon } from "@/components/art/OrigamiIcon";
import { Jp } from "@/components/deck/primitives";
import type { FoldOption } from "@/content/content";
import { spring } from "@/lib/motion";

/**
 * The fold picker's pieces, shared by the "Choose what to fold" slide and the demo
 * kiosk's picker screen. On the slide a card lays its icon beside the name; on the
 * narrower kiosk screen (`stacked`) the icon sits above it.
 */

/** Difficulty as rising bars, like a signal meter, so the level reads before the word. */
export function LevelHeader({ name, rank, small = false }: { name: string; rank: number; small?: boolean }) {
  return (
    <div className="flex items-end gap-4">
      <span className="flex items-end gap-1.5" aria-hidden="true">
        {[1, 2, 3].map((bar) => (
          <span key={bar} className={`w-3.5 rounded-pill ${bar <= rank ? "bg-accent" : "bg-line"}`} style={{ height: 14 + bar * 10 }} />
        ))}
      </span>
      <h2 className={`${small ? "text-h3" : "text-h2"} leading-none text-ink`}>{name}</h2>
    </div>
  );
}

const cardLook = {
  idle: "bg-paper-raised shadow-tile",
  selected: "bg-macaw-soft shadow-tile-selected",
};

const layouts = {
  row: { card: "h-[300px] gap-6 px-7 text-left", text: "", icon: "h-[170px] w-[170px]", name: "text-h3" },
  stacked: { card: "h-full w-full flex-col justify-center gap-3 px-4 py-5 text-center", text: "items-center", icon: "h-[136px] w-[136px]", name: "text-h4" },
};

export function OptionCard({
  option,
  selected,
  delay,
  onSelect,
  stacked = false,
}: {
  option: FoldOption;
  selected: boolean;
  delay: number;
  onSelect?: () => void;
  stacked?: boolean;
}) {
  const layout = layouts[stacked ? "stacked" : "row"];
  return (
    <motion.button
      type="button"
      disabled={Boolean(option.locked)}
      onClick={onSelect}
      className={`flex items-center rounded-card transition-colors active:translate-y-1 disabled:cursor-default ${layout.card} ${selected ? cardLook.selected : cardLook.idle}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: selected ? 1.02 : 1 }}
      transition={{ ...spring, delay }}
      aria-pressed={selected}
    >
      <OrigamiIcon model={option.model} label={`${option.name} origami`} className={`${layout.icon} shrink-0`} />
      <span className={`flex flex-col gap-2 ${layout.text}`}>
        <span className={`font-display ${layout.name} ${selected ? "text-macaw-ink" : "text-ink"}`}>{option.name}</span>
        {option.jp ? (
          <span className="text-small text-ink">
            <Jp className="font-extrabold">{option.jp}</Jp> {option.romaji}
          </span>
        ) : null}
        <motion.span
          className="text-small text-macaw-ink"
          initial={false}
          animate={{ opacity: selected ? 1 : 0, y: selected ? 0 : 8 }}
          transition={{ duration: 0.25 }}
        >
          {option.meaning}
        </motion.span>
      </span>
    </motion.button>
  );
}
