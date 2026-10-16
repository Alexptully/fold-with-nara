"use client";

import { motion } from "motion/react";
import { Kiosk } from "@/components/art/Kiosk";
import { config } from "@/content/config";
import { miniBooth } from "@/content/content";
import { asset } from "@/lib/paths";
import { Reveal, SlideShell } from "../primitives";

/** The presenter points to the real booth in the room. Nara isn't on stage yet: she's revealed on the next slide. */
export function MiniBoothSlide() {
  return (
    <SlideShell heading={miniBooth.heading}>
      <Reveal className="absolute left-24 top-[176px] h-[740px] w-[1060px]">
        <div className="h-full w-full overflow-hidden rounded-card bg-paper-sunk shadow-card">
          <BoothPicture />
        </div>
      </Reveal>
      <Reveal delay={0.25} className="absolute left-[1240px] top-[420px] w-[600px]">
        <HereToday />
        <p className="mt-6 text-lead text-ink">{miniBooth.line}</p>
        <p className="mt-2 text-lead text-ink-muted">{miniBooth.invite}</p>
      </Reveal>
    </SlideShell>
  );
}

/** The team's photo once config.miniBoothPhoto is set; until then, the kiosk drawn at desk size. */
function BoothPicture() {
  if (config.miniBoothPhoto) {
    return <img src={asset(config.miniBoothPhoto)} alt={miniBooth.photoAlt} className="h-full w-full object-cover" draggable={false} />;
  }
  return (
    <div className="relative h-full w-full" role="img" aria-label="Drawing of a desk-size version of the kiosk on a tabletop">
      <div className="absolute left-1/2 top-[70px] h-[560px] w-[360px] -translate-x-1/2">
        <Kiosk />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[120px] bg-wood-top shadow-divider" />
      <div className="absolute inset-x-0 bottom-[96px] h-[24px] bg-wood-left" />
    </div>
  );
}

/** A pill with a pulsing dot: the booth is in the room right now. */
function HereToday() {
  return (
    <span className="inline-flex items-center gap-3 rounded-pill bg-accent-soft px-5 py-2 text-body font-bold text-accent-ink">
      <motion.span
        className="h-4 w-4 rounded-pill bg-accent"
        animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      {miniBooth.badge}
    </span>
  );
}
