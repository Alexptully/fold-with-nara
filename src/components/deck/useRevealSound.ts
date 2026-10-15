"use client";

import { useEffect, useRef } from "react";
import { play, type SoundName } from "@/lib/sound";

/**
 * Plays a sound when an in-slide reveal turns on, only when the presenter steps
 * forward into it: not when the slide opens already revealed, and never in print.
 */
export function useRevealSound(on: boolean, print: boolean, sound: SoundName = "pop", delayMs = 0) {
  const wasOn = useRef(on);
  useEffect(() => {
    const revealed = on && !wasOn.current && !print;
    wasOn.current = on;
    if (!revealed) return;
    const timer = window.setTimeout(() => play(sound), delayMs);
    return () => window.clearTimeout(timer);
  }, [on, print, sound, delayMs]);
}
