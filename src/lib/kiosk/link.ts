import { CHANNEL_NAME, RELAY_PORT, isKioskMessage, type KioskMessage, type KioskRole, type ViewerCounts } from "./protocol";

/**
 * Two ways a kiosk page hears the deck. Pages in the same browser (a projector
 * window on the laptop's second screen) hear it over a BroadcastChannel. The iPad
 * and other devices on the same Wi-Fi hear it through the relay that
 * `npm run present` starts on the laptop (scripts/kiosk-relay.mjs).
 */

const RETRY_MS = 5000;
const HELLO = "fold-with-nara-kiosk:hello";

/** Where the relay runs: same machine as the page, next port up. Hosted https copies can't reach a laptop, so they skip it. */
export function relayBase(): string | null {
  if (typeof window === "undefined" || window.location.protocol !== "http:") return null;
  return `http://${window.location.hostname}:${RELAY_PORT}`;
}

function openChannel(): BroadcastChannel | null {
  return typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(CHANNEL_NAME);
}

export type RelayState = "linked" | "offline" | "unavailable";
export type LinkStatus = { relay: RelayState; viewers: ViewerCounts };
export const noViewers: ViewerCounts = { screen: 0, projector: 0 };

/** The deck's side: sends every new message, answers pages that just opened, and reports who's listening. */
export function createPublisher(onStatus: (status: LinkStatus) => void) {
  const channel = openChannel();
  const base = relayBase();
  let latest: KioskMessage | null = null;
  let quietUntil = 0;

  const post = async (message: KioskMessage) => {
    if (!base || Date.now() < quietUntil) return;
    try {
      const response = await fetch(`${base}/state`, { method: "POST", headers: { "content-type": "text/plain" }, body: JSON.stringify(message) });
      const body = (await response.json()) as { viewers?: ViewerCounts };
      onStatus({ relay: "linked", viewers: body.viewers ?? noViewers });
    } catch {
      // The relay isn't running. Try again in a few seconds instead of on every change.
      quietUntil = Date.now() + RETRY_MS;
      onStatus({ relay: "offline", viewers: noViewers });
    }
  };

  const send = (message: KioskMessage) => {
    latest = message;
    channel?.postMessage(message);
    void post(message);
  };

  if (channel) {
    channel.onmessage = (event) => {
      if (event.data === HELLO && latest) channel.postMessage(latest);
    };
  }
  if (!base) onStatus({ relay: "unavailable", viewers: noViewers });

  return {
    send,
    /** Re-sends the last message, so a relay that restarted catches up and the viewer count stays fresh. */
    beat: () => (latest ? post(latest) : undefined),
    close: () => channel?.close(),
  };
}

export type Via = "channel" | "relay";

/** A kiosk page's side: calls `onMessage` with every message and `onLink` when the relay connects or drops. */
export function subscribe(role: KioskRole, onMessage: (message: KioskMessage, via: Via) => void, onLink: (linked: boolean) => void): () => void {
  const channel = openChannel();
  if (channel) {
    channel.onmessage = (event) => {
      if (isKioskMessage(event.data)) onMessage(event.data, "channel");
    };
    channel.postMessage(HELLO);
  }
  const stopRelay = listenToRelay(role, onMessage, onLink);
  return () => {
    channel?.close();
    stopRelay();
  };
}

function parse(data: string): KioskMessage | null {
  try {
    const value: unknown = JSON.parse(data);
    return isKioskMessage(value) ? value : null;
  } catch {
    return null;
  }
}

/** Follows the relay's event stream, reopening it if the browser gives up (Safari does after some errors). */
function listenToRelay(role: KioskRole, onMessage: (message: KioskMessage, via: Via) => void, onLink: (linked: boolean) => void): () => void {
  const base = relayBase();
  if (!base || typeof EventSource === "undefined") return () => undefined;
  let source: EventSource | null = null;
  let retry: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;

  const open = () => {
    source = new EventSource(`${base}/events?role=${role}`);
    source.onopen = () => onLink(true);
    source.addEventListener("state", (event) => {
      const message = parse((event as MessageEvent<string>).data);
      if (message) onMessage(message, "relay");
    });
    source.onerror = () => {
      onLink(false);
      if (source?.readyState !== EventSource.CLOSED || stopped) return;
      retry = setTimeout(open, RETRY_MS);
    };
  };

  open();
  return () => {
    stopped = true;
    clearTimeout(retry);
    source?.close();
  };
}
