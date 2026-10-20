"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPublisher, noViewers, type LinkStatus } from "@/lib/kiosk/link";
import type { KioskScene } from "@/lib/kiosk/protocol";
import type { KioskLive } from "./types";

/**
 * The deck's half of the demo kiosk. Slides report what the presenter does on them
 * (a tile picked, a card chosen) with `useReportToKiosk`; the deck turns that and
 * the current build step into a kiosk screen and sends it to the iPad and projector.
 */

type Report = (patch: KioskLive) => void;

export const KioskLiveContext = createContext<Report>(() => undefined);

/** Tells the kiosk about something live on this slide. Outside the deck (print), it does nothing. */
export function useReportToKiosk(patch: KioskLive) {
  const report = useContext(KioskLiveContext);
  const key = JSON.stringify(patch);
  useEffect(() => report(JSON.parse(key) as KioskLive), [key, report]);
}

/** Live state belongs to the slide that reported it, so it clears when the slide changes. */
export function useKioskLive(index: number) {
  const [state, setState] = useState<{ index: number; live: KioskLive }>({ index, live: {} });
  const report = useCallback(
    (patch: KioskLive) => setState((current) => ({ index, live: { ...(current.index === index ? current.live : {}), ...patch } })),
    [index],
  );
  return { live: state.index === index ? state.live : {}, report };
}

// Changes settle for a moment before they're sent, so a slide change and the new
// slide's first report go out as one message.
const SETTLE_MS = 60;
const BEAT_MS = 3000;

const newDeckId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Sends the kiosk screen for this slide and step whenever it changes. Returns who's listening. */
export function useKioskBroadcast(slide: string, step: number, scene: KioskScene): LinkStatus {
  const [status, setStatus] = useState<LinkStatus>({ relay: "offline", viewers: noViewers });
  const publisher = useRef<ReturnType<typeof createPublisher> | null>(null);
  const deck = useRef("");
  const seq = useRef(0);

  useEffect(() => {
    const link = createPublisher(setStatus);
    publisher.current = link;
    deck.current = newDeckId();
    const beat = setInterval(() => void link.beat(), BEAT_MS);
    return () => {
      clearInterval(beat);
      link.close();
      publisher.current = null;
    };
  }, []);

  const key = JSON.stringify({ slide, step, scene });
  useEffect(() => {
    const timer = setTimeout(() => {
      seq.current += 1;
      const current = JSON.parse(key) as { slide: string; step: number; scene: KioskScene };
      publisher.current?.send({ deck: deck.current, seq: seq.current, at: Date.now(), ...current });
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [key]);

  return status;
}
