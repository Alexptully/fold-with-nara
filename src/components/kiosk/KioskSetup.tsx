"use client";

import { useEffect, useState } from "react";
import { kioskSetup } from "@/content/content";
import { relayBase } from "@/lib/kiosk/link";
import type { ViewerCounts } from "@/lib/kiosk/protocol";
import { asset } from "@/lib/paths";
import { QrCode } from "./QrCode";

/**
 * The team's setup page for the mini booth, opened on the laptop that runs the deck:
 * a code to scan for each kiosk page, and who is connected right now.
 */

type RelayInfo = { viewers: ViewerCounts; addresses: string[]; slide: string | null };
type RelayState = { kind: "checking" } | { kind: "off" } | { kind: "on"; info: RelayInfo };

const POLL_MS = 2000;

function useRelayInfo(): RelayState {
  const [state, setState] = useState<RelayState>({ kind: "checking" });
  useEffect(() => {
    const base = relayBase();
    let stopped = false;
    const check = async () => {
      try {
        if (!base) throw new Error("no relay");
        const info = (await (await fetch(`${base}/status`)).json()) as RelayInfo;
        if (!stopped) setState({ kind: "on", info });
      } catch {
        if (!stopped) setState({ kind: "off" });
      }
    };
    void check();
    const timer = setInterval(() => void check(), POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, []);
  return state;
}

const isLocal = (hostname: string) => hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";

function shareOrigin(address: string | undefined): string | null {
  const { hostname, port, origin } = window.location;
  if (!isLocal(hostname)) return origin;
  return address ? `http://${address}:${port || "80"}` : null;
}

/** The address other devices should use: the laptop's Wi-Fi address when this page is open on the laptop itself. */
function useShareOrigin(state: RelayState): string | null {
  const [origin, setOrigin] = useState<string | null>(null);
  const firstAddress = state.kind === "on" ? state.info.addresses[0] : undefined;
  useEffect(() => {
    const timer = setTimeout(() => setOrigin(shareOrigin(firstAddress)), 0);
    return () => clearTimeout(timer);
  }, [firstAddress]);
  return origin;
}

export function KioskSetup() {
  const relay = useRelayInfo();
  const origin = useShareOrigin(relay);
  return (
    <main className="min-h-full bg-paper-sunk px-6 py-12 text-panel text-ink">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-h2">{kioskSetup.heading}</h1>
        <p className="mt-3 max-w-3xl text-lead">{kioskSetup.intro}</p>
        <Status relay={relay} />
        <ol className="mt-8 flex flex-col gap-5">
          {kioskSetup.pages.map((page) => (
            <PageRow key={page.path} page={page} origin={origin} />
          ))}
        </ol>
        <ul className="mt-10 list-disc space-y-2 pl-6 text-ink-muted">
          {kioskSetup.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function Status({ relay }: { relay: RelayState }) {
  if (relay.kind === "checking") return null;
  if (relay.kind === "off") return <p className="mt-8 rounded-card bg-wrong-soft px-6 py-4 font-bold text-wrong-ink">{kioskSetup.relayOff}</p>;
  const { viewers, slide } = relay.info;
  const rows = [
    { key: kioskSetup.deckLabel, value: slide ?? kioskSetup.notStarted },
    { key: kioskSetup.screenLabel, value: String(viewers.screen) },
    { key: kioskSetup.projectorLabel, value: String(viewers.projector) },
  ];
  return (
    <section className="mt-8 rounded-card bg-paper-raised px-6 py-5 shadow-card">
      <h2 className="text-h4">{kioskSetup.statusTitle}</h2>
      <dl className="mt-3 grid grid-cols-[160px_1fr] gap-x-6 gap-y-1">
        {rows.map((row) => [
          <dt key={`${row.key}-k`} className="text-ink-muted">
            {row.key}
          </dt>,
          <dd key={`${row.key}-v`} className="font-extrabold">
            {row.value}
          </dd>,
        ])}
      </dl>
    </section>
  );
}

type SetupPage = (typeof kioskSetup.pages)[number];

function PageRow({ page, origin }: { page: SetupPage; origin: string | null }) {
  const url = origin ? `${origin}${asset(page.path)}` : null;
  return (
    <li className="flex items-center gap-6 rounded-card bg-paper-raised p-5 shadow-card">
      <div className="h-[150px] w-[150px] shrink-0">{url ? <QrCode text={url} label={`Code for the ${page.name} page`} className="h-full w-full" /> : null}</div>
      <div className="min-w-0">
        <h2 className="text-h4">{page.name}</h2>
        <p className="mt-1">{page.line}</p>
        {url ? <p className="mt-2 break-all font-extrabold text-accent-ink">{url}</p> : <p className="mt-2 text-ink-muted">{kioskSetup.noNetwork}</p>}
        <a
          className="mt-2 inline-block text-ink-muted underline underline-offset-4"
          href={asset(page.path)}
          target="_blank"
          rel="noreferrer"
          aria-label={`${kioskSetup.openHere}: ${page.name}`}
        >
          {kioskSetup.openHere}
        </a>
      </div>
    </li>
  );
}
