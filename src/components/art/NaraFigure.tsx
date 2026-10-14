"use client";

import { config } from "@/content/config";
import { asset } from "@/lib/paths";
import { Nara } from "./Nara";

/**
 * Nara as she appears on the title, encouragement and closing slides.
 * Uses the team's illustration when config.characterImage is set.
 */
export function NaraFigure({ bowing = true }: { bowing?: boolean }) {
  if (config.characterImage) {
    return <img src={asset(config.characterImage)} alt={config.characterName} className="h-auto w-full" />;
  }
  return <Nara bowing={bowing} title={config.characterName} />;
}
