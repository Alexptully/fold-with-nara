"use client";

import { useEffect, useState } from "react";
import { asset } from "@/lib/paths";
import { isMuted, setMuted } from "@/lib/sound";

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;
const IDLE_MS = 2500;

function toggleFullScreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen?.();
}

const shortcuts: Record<string, () => void> = {
  f: toggleFullScreen,
  p: () => {
    window.location.href = asset("/print/");
  },
};

/** Stage scaling, the idle cursor, and the N (notes), F (full screen), P (print) and M (mute) keys. */
export function usePresenterKeys() {
  const [scale, setScale] = useState(1);
  const [notesOpen, setNotesOpen] = useState(false);
  const [cursorIdle, setCursorIdle] = useState(false);
  const [muted, setMutedState] = useState(isMuted);
  const [muteToast, setMuteToast] = useState(0);

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === "n") setNotesOpen((open) => !open);
      if (key === "m") {
        const next = !isMuted();
        setMuted(next);
        setMutedState(next);
        setMuteToast((count) => count + 1);
      }
      shortcuts[key]?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const wake = () => {
      setCursorIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setCursorIdle(true), IDLE_MS);
    };
    wake();
    window.addEventListener("mousemove", wake);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", wake);
    };
  }, []);

  return { scale, notesOpen, setNotesOpen, cursorIdle, muted, muteToast };
}

export const stageSize = { width: STAGE_WIDTH, height: STAGE_HEIGHT };
