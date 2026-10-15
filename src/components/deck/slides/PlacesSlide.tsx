"use client";

import { Kiosk } from "@/components/art/Kiosk";
import { TentExterior } from "@/components/art/Tent";
import { config } from "@/content/config";
import { places } from "@/content/content";
import { asset } from "@/lib/paths";
import { FlipCard } from "../FlipCard";
import { useRevealSound } from "../useRevealSound";
import { Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

/**
 * Step 1: our drawings of the kiosk and the tent. Step 2: each card flips over to
 * the team's real-life render, with a pop and a burst of sparkles.
 */
export function PlacesSlide({ step, print }: SlideProps) {
  const real = step >= 2;
  useRevealSound(real, print);
  return (
    <SlideShell heading={places.heading}>
      <div className="absolute left-[291px] top-[170px] h-[700px] w-[440px]">
        <FlipCard print={print} flipped={real} front={<KioskDrawing />} back={<Photo src={config.kioskPhoto} alt={places.kiosk.photoAlt} />} />
      </div>
      <div className="absolute left-[821px] top-[170px] h-[700px] w-[808px]">
        <FlipCard
          print={print}
          flipped={real}
          delay={0.18}
          front={
            <div className="grid h-full w-full place-items-center p-6">
              <TentExterior jp={places.tent.signJp} />
            </div>
          }
          back={<Photo src={config.tentPhoto} alt={places.tent.photoAlt} />}
        />
      </div>
      <Reveal delay={0.2} className="absolute left-[291px] top-[892px] w-[440px]">
        <Label name={places.kiosk.name} detail={places.kiosk.detail} />
      </Reveal>
      <Reveal delay={0.3} className="absolute left-[821px] top-[892px] w-[808px]">
        <Label name={places.tent.name} detail={places.tent.detail} />
      </Reveal>
    </SlideShell>
  );
}

function KioskDrawing() {
  const { kiosk } = places;
  return (
    <div className="h-full w-full p-6">
      <Kiosk sideJp={kiosk.sideJp} />
    </div>
  );
}

function Photo({ src, alt }: { src: string; alt: string }) {
  return <img src={asset(src)} alt={alt} className="h-full w-full object-cover" draggable={false} />;
}

function Label({ name, detail }: { name: string; detail: string }) {
  return (
    <>
      <h2 className="text-h3 text-ink">{name}</h2>
      <p className="mt-1 text-body text-ink-muted">{detail}</p>
    </>
  );
}
