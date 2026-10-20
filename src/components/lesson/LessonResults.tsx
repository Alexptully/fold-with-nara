"use client";

import { Button } from "@/components/ui/Button";
import { Jp } from "@/components/deck/primitives";
import { celebration } from "@/content/content";

/**
 * The lesson-complete screen's name, score and two choices. Shared by "You folded
 * Mt. Fuji" and the demo kiosk; without handlers it's the kiosk's mirror and can't be clicked.
 */
export function LessonResults({ kept, onKeep, onHang, className = "" }: { kept: boolean; onKeep?: () => void; onHang?: () => void; className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`} data-no-advance inert={!onKeep}>
      <p className="flex items-baseline gap-4">
        <Jp className="text-jp-md font-extrabold text-ink">{celebration.jp}</Jp>
        <span className="text-lead text-ink-muted">{celebration.romaji}</span>
      </p>
      <div className="mt-6 flex gap-6">
        {celebration.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="mt-10 flex gap-6">
        <Button variant={kept ? "chosen" : "chunky"} onClick={onKeep}>
          {celebration.keepLabel}
        </Button>
        <Button variant="primary" onClick={onHang}>
          {celebration.hangLabel}
        </Button>
      </div>
      <p className={`mt-3 h-[38px] text-body font-bold text-macaw-ink transition-opacity ${kept ? "opacity-100" : "opacity-0"}`}>{celebration.keptLine}</p>
    </div>
  );
}

const statLook = {
  bee: { frame: "bg-bee", label: "text-ink", value: "text-bee-ink" },
  accent: { frame: "bg-accent", label: "text-paper", value: "text-accent-ink" },
};

/** A Duolingo-style result card: a colored frame with the label on top and the value inside. */
function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  const look = statLook[tone as keyof typeof statLook];
  return (
    <div className={`w-[250px] rounded-tile p-1 ${look.frame}`}>
      <p className={`py-1 text-center text-small font-extrabold ${look.label}`}>{label}</p>
      <p className={`rounded-tile bg-paper py-3 text-center font-display text-h3 ${look.value}`}>{value}</p>
    </div>
  );
}
