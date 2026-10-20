"use client";

import { useEffect, useState } from "react";

/**
 * How the projector's picture sits on the ledge: moved, sized, turned and (for a
 * projector bouncing off a mirror) flipped until the white square lines up with a
 * real sheet. Each device remembers its own fit.
 */
export type Fit = { x: number; y: number; size: number; turn: number; mirror: boolean };

export const defaultFit: Fit = { x: 0, y: 0, size: 1, turn: 0, mirror: false };

function readFit(key: string): Fit | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...defaultFit, ...(JSON.parse(raw) as Partial<Fit>) } : null;
  } catch {
    return null;
  }
}

function writeFit(key: string, fit: Fit) {
  try {
    window.localStorage.setItem(key, JSON.stringify(fit));
  } catch {
    // Private browsing can refuse storage; the fit still works until the page closes.
  }
}

/** The SVG transform for a fit: move, then turn, size and flip around the sheet's center. */
export function fitTransform(fit: Fit, center: number): string {
  const flip = fit.mirror ? -fit.size : fit.size;
  return `translate(${fit.x} ${fit.y}) rotate(${fit.turn} ${center} ${center}) translate(${center} ${center}) scale(${flip} ${fit.size}) translate(${-center} ${-center})`;
}

export function useProjectorFit(storageKey: string) {
  const [fit, setFit] = useState<Fit>(defaultFit);
  const [fitted, setFitted] = useState(true);
  useEffect(() => {
    const stored = readFit(storageKey);
    // Reading storage has to wait until the page is in the browser.
    const timer = setTimeout(() => {
      if (stored) setFit(stored);
      setFitted(stored !== null);
    }, 0);
    return () => clearTimeout(timer);
  }, [storageKey]);

  const change = (next: Fit) => {
    setFit(next);
    setFitted(true);
    writeFit(storageKey, next);
  };
  return { fit, fitted, change };
}

type Nudge = (fit: Fit, big: boolean) => Fit;

const move = (dx: number, dy: number): Nudge => (fit, big) => ({ ...fit, x: fit.x + dx * (big ? 8 : 1), y: fit.y + dy * (big ? 8 : 1) });
const grow = (direction: 1 | -1): Nudge => (fit, big) => ({ ...fit, size: Math.max(0.2, fit.size * (1 + direction * (big ? 0.08 : 0.01))) });
const turn = (direction: 1 | -1): Nudge => (fit, big) => ({ ...fit, turn: fit.turn + direction * (big ? 5 : 0.5) });

/** Every adjustment, by name, for both the on-screen buttons and the keyboard. */
export const nudges = {
  up: move(0, -1),
  down: move(0, 1),
  left: move(-1, 0),
  right: move(1, 0),
  bigger: grow(1),
  smaller: grow(-1),
  turnLeft: turn(-1),
  turnRight: turn(1),
  mirror: (fit: Fit) => ({ ...fit, mirror: !fit.mirror }),
  reset: () => defaultFit,
} satisfies Record<string, Nudge>;

export type NudgeName = keyof typeof nudges;

export const nudgeKeys: Record<string, NudgeName> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  "+": "bigger",
  "=": "bigger",
  "-": "smaller",
  _: "smaller",
  "[": "turnLeft",
  "]": "turnRight",
  "{": "turnLeft",
  "}": "turnRight",
  m: "mirror",
  "0": "reset",
};
