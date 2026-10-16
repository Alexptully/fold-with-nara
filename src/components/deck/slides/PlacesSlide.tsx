"use client";

import { Kiosk } from "@/components/art/Kiosk";
import { TentExterior } from "@/components/art/Tent";
import { config } from "@/content/config";
import { places } from "@/content/content";
import { asset } from "@/lib/paths";
import { FlipCard } from "../FlipCard";
import { useRevealSound } from "../useRevealSound";
import { FoldArrow, Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

/**
 * The pop-up lives at events: a tent with folding kiosks inside. Step 1: our
 * drawings of the tent and one of its kiosks, joined by the crease. Step 2: each
 * card flips over to the team's real-life render, with a pop and a burst of sparkles.
 */

const TENT = { left: 236, top: 170, width: 808, height: 700 };
const KIOSK = { left: 1244, top: 170, width: 440, height: 700 };
const LABEL_TOP = 892;

export function PlacesSlide({ step, print }: SlideProps) {
  const real = step >= 2;
  useRevealSound(real, print);
  return (
    <SlideShell heading={places.heading}>
      <div className="absolute" style={TENT}>
        <FlipCard
          print={print}
          flipped={real}
          front={
            <div className="grid h-full w-full place-items-center p-6">
              <TentExterior jp={places.tent.signJp} />
            </div>
          }
          back={<Photo src={config.tentPhoto} alt={places.tent.photoAlt} />}
        />
      </div>
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 1920 1080" aria-hidden="true">
        <FoldArrow from={[TENT.left + TENT.width + 28, 520]} to={[KIOSK.left - 28, 520]} bend={-0.28} delay={0.5} />
      </svg>
      <div className="absolute" style={KIOSK}>
        <FlipCard
          print={print}
          flipped={real}
          delay={0.18}
          front={
            <div className="h-full w-full p-6">
              <Kiosk sideJp={places.kiosk.sideJp} />
            </div>
          }
          back={<Photo src={config.kioskPhoto} alt={places.kiosk.photoAlt} />}
        />
      </div>
      <Reveal delay={0.2} className="absolute left-0 top-0">
        <Label at={TENT.left} width={TENT.width} name={places.tent.name} detail={places.tent.detail} />
      </Reveal>
      <Reveal delay={0.3} className="absolute left-0 top-0">
        <Label at={KIOSK.left} width={KIOSK.width} name={places.kiosk.name} detail={places.kiosk.detail} />
      </Reveal>
    </SlideShell>
  );
}

function Photo({ src, alt }: { src: string; alt: string }) {
  return <img src={asset(src)} alt={alt} className="h-full w-full object-cover" draggable={false} />;
}

function Label({ at, width, name, detail }: { at: number; width: number; name: string; detail: string }) {
  return (
    <div className="absolute" style={{ left: at, top: LABEL_TOP, width }}>
      <h2 className="text-h3 text-ink">{name}</h2>
      <p className="mt-1 text-body text-ink-muted">{detail}</p>
    </div>
  );
}
