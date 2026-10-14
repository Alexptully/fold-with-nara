"use client";

import { Kiosk } from "@/components/art/Kiosk";
import { Tent } from "@/components/art/Tent";
import { config } from "@/content/config";
import { popUp } from "@/content/content";
import { asset } from "@/lib/paths";
import { KeyValueList, Reveal, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

export function PopUpSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={popUp.heading}>
      <Reveal show={step >= 2} className="absolute right-24 top-[86px] max-w-[760px] text-right">
        <p className="text-body text-ink-muted">{popUp.setting}</p>
      </Reveal>
      <section className="absolute left-24 top-[170px] w-[800px]">
        <div className="h-[560px]">
          <KioskArt />
        </div>
        <h2 className="mt-2 text-h3 text-ink">{popUp.kiosk.name}</h2>
        <KeyValueList rows={popUp.kiosk.facts} keyWidth={150} size="small" className="mt-4" />
      </section>
      <section className="absolute right-24 top-[170px] w-[860px]">
        <div className="h-[560px]">
          <Tent show={step >= 2} />
        </div>
        <Reveal show={step >= 2}>
          <h2 className="mt-2 text-h3 text-ink">{popUp.tent.name}</h2>
          <KeyValueList rows={popUp.tent.facts} keyWidth={150} size="small" className="mt-4" />
        </Reveal>
      </section>
    </SlideShell>
  );
}

/** Sam's render replaces the drawing as soon as config.kioskRender is set. */
function KioskArt() {
  if (config.kioskRender) {
    return <img src={asset(config.kioskRender)} alt="Render of the kiosk" className="h-full w-full object-contain" />;
  }
  return <Kiosk callouts={popUp.kiosk.callouts} />;
}
