"use client";

import { useState } from "react";
import { LevelHeader, OptionCard } from "@/components/lesson/FoldOptions";
import { options, type OrigamiModel } from "@/content/content";
import { play } from "@/lib/sound";
import { SlideShell } from "../primitives";
import { useReportToKiosk } from "../useKioskLink";

/** The kiosk's first screen: pick a model at one of three levels. Click a card to see what it stands for. */
export function ChooseFoldSlide() {
  const [selected, setSelected] = useState<OrigamiModel>("fuji");
  useReportToKiosk({ chosen: selected });
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
