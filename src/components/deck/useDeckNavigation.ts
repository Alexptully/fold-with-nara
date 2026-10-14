"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SlideDef } from "./types";

/** `animate` is false for jumps from the address bar, which should not turn a page. */
export type DeckPosition = { slide: number; step: number; direction: 1 | -1; animate: boolean };

const ADVANCE_KEYS = new Set(["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"]);
const BACK_KEYS = new Set(["ArrowLeft", "ArrowUp", "PageUp", "Backspace"]);
const SWIPE_DISTANCE = 50;

function readHash(slideCount: number): number {
  const parsed = Number.parseInt(window.location.hash.replace("#", ""), 10);
  if (Number.isNaN(parsed)) return 0;
  return Math.min(Math.max(parsed - 1, 0), slideCount - 1);
}

function isTyping(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
}

/** Keyboard, click, swipe and address-bar navigation through slides and their build steps. */
export function useDeckNavigation(slides: SlideDef[]) {
  const [position, setPosition] = useState<DeckPosition>({ slide: 0, step: 1, direction: 1, animate: false });
  const touchStart = useRef<number | null>(null);

  const next = useCallback(() => {
    setPosition((current) => {
      if (current.step < slides[current.slide].steps) return { ...current, step: current.step + 1, direction: 1, animate: true };
      if (current.slide === slides.length - 1) return current;
      return { slide: current.slide + 1, step: 1, direction: 1, animate: true };
    });
  }, [slides]);

  const prev = useCallback(() => {
    setPosition((current) => {
      if (current.step > 1) return { ...current, step: current.step - 1, direction: -1, animate: true };
      if (current.slide === 0) return current;
      return { slide: current.slide - 1, step: slides[current.slide - 1].steps, direction: -1, animate: true };
    });
  }, [slides]);

  const goTo = useCallback(
    (slide: number, animate = true) =>
      setPosition((current) => ({ slide, step: 1, direction: slide >= current.slide ? 1 : -1, animate })),
    [],
  );

  // Start from the slide in the address bar, and follow manual hash edits, without a page turn.
  useEffect(() => {
    const sync = () => goTo(readHash(slides.length), false);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [goTo, slides.length]);

  // Keep the address bar on the current slide so one section can be rehearsed.
  useEffect(() => {
    const hash = `#${position.slide + 1}`;
    if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
  }, [position.slide]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (ADVANCE_KEYS.has(event.key)) next();
      else if (BACK_KEYS.has(event.key)) prev();
      else if (event.key === "Home") goTo(0);
      else if (event.key === "End") goTo(slides.length - 1);
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, slides.length]);

  const onStageClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as Element;
      if (target.closest("[data-no-advance], button, a, input")) return;
      next();
    },
    [next],
  );

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  }, []);

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      const start = touchStart.current;
      const end = event.changedTouches[0]?.clientX;
      touchStart.current = null;
      if (start === null || end === undefined || Math.abs(end - start) < SWIPE_DISTANCE) return;
      if (end < start) next();
      else prev();
    },
    [next, prev],
  );

  return { position, next, prev, goTo, onStageClick, onTouchStart, onTouchEnd };
}
