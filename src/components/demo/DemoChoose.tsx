"use client";

import { useState } from "react";
import { Nara } from "@/components/art/nara/Nara";
import { LevelHeader, OptionCard } from "@/components/lesson/FoldOptions";
import { Button } from "@/components/ui/Button";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { demoKiosk, options, type OrigamiModel } from "@/content/content";

/**
 * The fold picker, live. Any card can be picked to see what it stands for, as on the
 * "Choose what to fold" slide, but the lesson is Mt. Fuji's: picking another model
 * brings Nara in to say so, and the button always folds Mt. Fuji.
 */
export function DemoChoose({ onFold }: { onFold: () => void }) {
  const [chosen, setChosen] = useState<OrigamiModel>("fuji");
  return (
    <div className="flex h-full flex-col gap-6 px-14 pb-10 pt-10">
      <h1 className="text-h2 text-ink">{options.heading}</h1>
      <div className="grid flex-1 grid-cols-3 gap-6">
        {options.levels.map((level, column) => (
          <section key={level.name} className="flex flex-col gap-4">
            <LevelHeader name={level.name} rank={level.rank} small />
            {level.models.map((option, row) => (
              <div key={option.model} className="flex-1">
                <OptionCard
                  option={option}
                  selected={chosen === option.model}
                  delay={0.1 + column * 0.1 + row * 0.06}
                  onSelect={() => setChosen(option.model)}
                  stacked
                />
              </div>
            ))}
          </section>
        ))}
      </div>
      <div className="flex h-[150px] items-center justify-end gap-6">
        {chosen === "fuji" ? null : <TodayNote />}
        <Button variant="primary" size="large" onClick={onFold}>
          {demoKiosk.foldLabel}
        </Button>
      </div>
    </div>
  );
}

function TodayNote() {
  return (
    <div className="flex flex-1 items-center gap-4">
      <Nara pose="talk" className="h-[150px] w-[103px] shrink-0" />
      <SpeechBubble>
        <p className="text-h4 text-ink">{demoKiosk.chooseNote}</p>
      </SpeechBubble>
    </div>
  );
}
