"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { OrigamiIcon } from "@/components/art/OrigamiIcon";
import { options, type FoldOption, type OrigamiModel } from "@/content/content";
import { spring } from "@/lib/motion";
import { play } from "@/lib/sound";
import { Jp, SlideShell } from "../primitives";

/** The kiosk's first screen: pick a model at one of three levels. Click a card to see what it stands for. */
export function ChooseFoldSlide() {
  const [selected, setSelected] = useState<OrigamiModel>("fuji");
  const select = (model: OrigamiModel) => {
    play("tap");
    setSelected(model);
  };
  return (
    <SlideShell heading={options.heading}>
      <div className="absolute left-24 right-24 top-[210px] grid grid-cols-3 gap-12" data-no-advance>
        {options.levels.map((level, column) => (
          <section key={level.name}>
            <LevelHeader name={level.name} rank={level.rank} />
            <div className="mt-6 flex flex-col gap-6">
              {level.models.map((option, row) => (
                <OptionCard
                  key={option.model}
                  option={option}
                  selected={selected === option.model}
                  delay={0.15 + column * 0.12 + row * 0.08}
                  onSelect={() => select(option.model)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </SlideShell>
  );
}

/** Difficulty as rising bars, like a signal meter, so the level reads before the word. */
function LevelHeader({ name, rank }: { name: string; rank: number }) {
  return (
    <div className="flex items-end gap-4">
      <span className="flex items-end gap-1.5" aria-hidden="true">
        {[1, 2, 3].map((bar) => (
          <span key={bar} className={`w-3.5 rounded-pill ${bar <= rank ? "bg-accent" : "bg-line"}`} style={{ height: 14 + bar * 10 }} />
        ))}
      </span>
      <h2 className="text-h2 leading-none text-ink">{name}</h2>
    </div>
  );
}

const cardLook = {
  idle: "bg-paper-raised shadow-tile",
  selected: "bg-macaw-soft shadow-tile-selected",
};

function OptionCard({ option, selected, delay, onSelect }: { option: FoldOption; selected: boolean; delay: number; onSelect: () => void }) {
  const locked = Boolean(option.locked);
  return (
    <motion.button
      type="button"
      disabled={locked}
      onClick={onSelect}
      className={`flex h-[300px] items-center gap-6 rounded-card px-7 text-left transition-colors active:translate-y-1 disabled:cursor-default ${selected ? cardLook.selected : cardLook.idle}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: selected ? 1.02 : 1 }}
      transition={{ ...spring, delay }}
      aria-pressed={selected}
    >
      <OrigamiIcon model={option.model} label={`${option.name} origami`} className="h-[170px] w-[170px] shrink-0" />
      <span className="flex flex-col gap-2">
        <span className={`font-display text-h3 ${selected ? "text-macaw-ink" : "text-ink"}`}>{option.name}</span>
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
