"use client";

import { useEffect, useState } from "react";

/** Counts up every `ms`. Use it as a `key` to replay a one-shot animation on a loop. */
export function useLoop(ms: number, running = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setCount((n) => n + 1), ms);
    return () => clearInterval(timer);
  }, [ms, running]);
  return count;
}
