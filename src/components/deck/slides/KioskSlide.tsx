"use client";

import { Kiosk } from "@/components/art/Kiosk";
import { config } from "@/content/config";
import { kiosk } from "@/content/content";
import { asset } from "@/lib/paths";
import { KeyValueList, Reveal, SlideShell } from "../primitives";

export function KioskSlide() {
  return (
    <SlideShell heading={kiosk.heading}>
      <div className="absolute left-12 top-[150px] h-[880px] w-[1150px]">
        <KioskArt />
      </div>
      <Reveal delay={0.5} className="absolute right-24 top-[300px] w-[560px]">
        <KeyValueList rows={kiosk.facts} stacked />
      </Reveal>
    </SlideShell>
  );
}

/** Sam's render replaces the drawing as soon as config.kioskRender is set. */
function KioskArt() {
  if (config.kioskRender) {
    return <img src={asset(config.kioskRender)} alt="Render of the kiosk" className="h-full w-full object-contain" />;
  }
  return <Kiosk labels={kiosk.callouts} sideJp={kiosk.sideJp} sideEn={kiosk.sideEn} height={kiosk.height} edge={kiosk.edge} />;
}
