"use client";

import { LevelHeader, OptionCard } from "@/components/lesson/FoldOptions";
import { options, type OrigamiModel } from "@/content/content";

/** The kiosk's fold picker, with the card the presenter picked on the slide. */
export function ChooseScene({ chosen }: { chosen: OrigamiModel }) {
  return (
    <div className="flex h-full flex-col gap-8 px-14 pb-14 pt-12" inert>
      <h1 className="text-h2 text-ink">{options.heading}</h1>
      <div className="grid flex-1 grid-cols-3 gap-8">
        {options.levels.map((level, column) => (
          <section key={level.name} className="flex flex-col gap-5">
            <LevelHeader name={level.name} rank={level.rank} small />
            {level.models.map((option, row) => (
              <div key={option.model} className="flex-1">
                <OptionCard option={option} selected={chosen === option.model} delay={0.1 + column * 0.1 + row * 0.06} stacked />
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
