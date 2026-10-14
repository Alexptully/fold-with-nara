"use client";

import { config } from "@/content/config";
import { asset } from "@/lib/paths";
import { Nara, type Pose } from "./nara/Nara";

/**
 * Nara on the title and closing slides. Uses the team's own illustration
 * when config.characterImage is set; otherwise the vector Nara in the given pose.
 */
export function NaraFigure({ pose = "talk", className }: { pose?: Pose; className?: string }) {
  if (config.characterImage) {
    return <img src={asset(config.characterImage)} alt={config.characterName} className={`h-auto w-full ${className ?? ""}`} />;
  }
  return <Nara pose={pose} title={config.characterName} className={className} />;
}
