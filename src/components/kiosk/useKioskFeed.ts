"use client";

import { useEffect, useState } from "react";
import { subscribe } from "@/lib/kiosk/link";
import { isNewer, type KioskMessage, type KioskRole } from "@/lib/kiosk/protocol";

/**
 * The deck's latest message for this kiosk page, and whether the page can hear the
 * deck: through the relay, or from a deck open in the same browser.
 */
export function useKioskFeed(role: KioskRole) {
  const [message, setMessage] = useState<KioskMessage | null>(null);
  const [relayOpen, setRelayOpen] = useState(false);
  const [sameBrowser, setSameBrowser] = useState(false);
  useEffect(
    () =>
      subscribe(
        role,
        (next, via) => {
          setMessage((current) => (isNewer(next, current) ? next : current));
          if (via === "channel") setSameBrowser(true);
        },
        setRelayOpen,
      ),
    [role],
  );
  return { message, linked: relayOpen || sameBrowser };
}

type FullScreenTarget = HTMLElement & { webkitRequestFullscreen?: () => void };

export function goFullScreen() {
  const root = document.documentElement as FullScreenTarget;
  if (document.fullscreenElement) return;
  if (root.requestFullscreen) void root.requestFullscreen().catch(() => undefined);
  else root.webkitRequestFullscreen?.();
}

/**
 * A kiosk page should never dim or show the browser's bars. The first tap asks for
 * full screen and a screen wake lock (browsers only allow both after a tap), and the
 * lock comes back whenever the page is shown again.
 */
export function useStayAwake() {
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const keepAwake = async () => {
      if (!("wakeLock" in navigator)) return;
      try {
        lock = await navigator.wakeLock.request("screen");
      } catch {
        lock = null;
      }
    };
    const onFirstTap = () => {
      goFullScreen();
      void keepAwake();
    };
    const onShown = () => {
      if (document.visibilityState === "visible" && lock?.released !== false) void keepAwake();
    };
    window.addEventListener("pointerdown", onFirstTap, { once: true });
    document.addEventListener("visibilitychange", onShown);
    return () => {
      window.removeEventListener("pointerdown", onFirstTap);
      document.removeEventListener("visibilitychange", onShown);
      void lock?.release();
    };
  }, []);
}
