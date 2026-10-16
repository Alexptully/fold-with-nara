"use client";

import { useEffect, useState } from "react";

/**
 * A rehearsal stopwatch for the notes panel. It starts with the first key press
 * or click on the deck, and T resets it.
 */
export function useTalkClock() {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const start = () => setStartedAt((current) => current ?? Date.now());
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() === "t") setStartedAt(null);
      else start();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", start);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", start);
    };
  }, []);

  useEffect(() => {
    if (startedAt === null) return;
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 500);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  return startedAt === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000));
}

export const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
