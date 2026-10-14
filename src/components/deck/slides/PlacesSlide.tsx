"use client";

import { Kiosk } from "@/components/art/Kiosk";
import { TentExterior } from "@/components/art/Tent";
import { config } from "@/content/config";
import { places } from "@/content/content";
import { asset } from "@/lib/paths";
import { Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

/** The same folding station in two sizes: a kiosk first, then the event tent. */
export function PlacesSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={places.heading}>
      <Reveal className="absolute left-[20px] top-[140px] h-[760px] w-[970px]">
        <KioskArt />
      </Reveal>
      <Reveal delay={0.2} className="absolute left-[150px] top-[900px]">
        <Label name={places.kiosk.name} detail={places.kiosk.detail} />
      </Reveal>
      <Reveal show={step >= 2} className="absolute left-[1010px] top-[270px] h-[560px] w-[875px]">
        <TentExterior jp={places.tent.signJp} en={places.tent.signEn} />
      </Reveal>
      <Reveal show={step >= 2} delay={0.2} className="absolute left-[1090px] top-[900px]">
        <Label name={places.tent.name} detail={places.tent.detail} />
      </Reveal>
    </SlideShell>
  );
}

function Label({ name, detail }: { name: string; detail: string }) {
  return (
    <>
      <h2 className="text-h3 text-ink">{name}</h2>
      <p className="mt-1 text-small text-ink-muted">{detail}</p>
    </>
  );
}

/** Sam's render replaces the drawing as soon as config.kioskRender is set. */
function KioskArt() {
  if (config.kioskRender) {
    return <img src={asset(config.kioskRender)} alt="Render of the kiosk" className="h-full w-full object-contain" />;
  }
  const { kiosk } = places;
  return <Kiosk labels={kiosk.callouts} sideJp={kiosk.sideJp} sideEn={kiosk.sideEn} height={kiosk.height} edge={kiosk.edge} />;
}
