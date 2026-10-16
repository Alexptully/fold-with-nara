"use client";

import { motion } from "motion/react";
import { Kiosk } from "@/components/art/Kiosk";
import { TENT_DOOR_VIEW, TENT_FRAME, TentExterior } from "@/components/art/Tent";
import { INSIDE, KIOSK_SCALE, TentInside, featuredKiosk } from "@/components/art/TentInside";
import { places } from "@/content/content";
import { ease } from "@/lib/motion";
import { SlideShell } from "../primitives";
import type { SlideProps } from "../types";

/**
 * A camera move through the pop-up, all in drawings. Step 1: the event tent from
 * outside. Step 2: the camera flies in through the door to the kiosks along the
 * walls. Step 3: it closes in on one kiosk, which turns into the labeled drawing.
 *
 * Everything sits in one "world" the size of the viewer at step 1. The camera is a
 * scale and a shift of that world, so each step is a single transform animation.
 */

const VIEW = { left: 96, top: 170, width: INSIDE.width, height: INSIDE.height };

// The tent drawing fills the viewer's height, centered.
const tentScale = VIEW.height / TENT_FRAME.height;
const tentLeft = (VIEW.width - TENT_FRAME.width * tentScale) / 2;

// The window through the door that becomes the whole viewer at step 2.
const doorWindow = {
  left: tentLeft + TENT_DOOR_VIEW.left * tentScale,
  top: TENT_DOOR_VIEW.top * tentScale,
  scale: (TENT_DOOR_VIEW.width * tentScale) / VIEW.width,
};
const insideZoom = 1 / doorWindow.scale;

// The labeled kiosk at step 3: its 1150 by 900 drawing at the viewer's height, the
// cabinet and callouts centered. The compact kiosk inside the tent starts at (105, 70).
const labeledScale = VIEW.height / 900;
const labeled = { left: VIEW.width / 2 - 552 * labeledScale, width: 1150 * labeledScale };
const [kioskLeft, kioskTop] = featuredKiosk;
const kioskZoom = labeledScale / KIOSK_SCALE;
const kioskShift = { x: labeled.left + 105 * labeledScale - kioskZoom * kioskLeft, y: 70 * labeledScale - kioskZoom * kioskTop };

const cameras = [
  { scale: 1, x: 0, y: 0 },
  { scale: insideZoom, x: -insideZoom * doorWindow.left, y: -insideZoom * doorWindow.top },
  {
    scale: kioskZoom * insideZoom,
    x: kioskShift.x - kioskZoom * insideZoom * doorWindow.left,
    y: kioskShift.y - kioskZoom * insideZoom * doorWindow.top,
  },
];

const ZOOM = { duration: 1.6, ease: ease.fold };
const FADE = 0.45;

export function PlacesSlide({ step, print }: SlideProps) {
  const view = Math.min(step, 3);
  return (
    <SlideShell heading={places.heading}>
      <div className="absolute overflow-hidden rounded-card bg-paper-raised shadow-card" style={VIEW}>
        <motion.div className="absolute left-0 top-0" style={{ width: VIEW.width, height: VIEW.height, transformOrigin: "0 0" }} initial={false} animate={cameras[view - 1]} transition={ZOOM}>
          <motion.div
            className="absolute top-0"
            style={{ left: tentLeft, width: TENT_FRAME.width * tentScale, height: VIEW.height }}
            initial={false}
            animate={{ opacity: view === 1 ? 1 : 0 }}
            transition={{ duration: FADE, delay: view === 1 ? 0 : 0.75 }}
          >
            <TentExterior jp={places.tent.signJp} />
          </motion.div>
          <motion.div
            className="absolute"
            style={{ left: doorWindow.left, top: doorWindow.top, scale: doorWindow.scale, transformOrigin: "0 0" }}
            initial={false}
            animate={{ opacity: view === 2 ? 1 : 0 }}
            transition={{ duration: FADE, delay: insideFadeDelay(view) }}
          >
            <TentInside />
          </motion.div>
        </motion.div>
        {view === 3 ? <LabeledKiosk print={print} /> : null}
      </div>
      {places.steps.map((caption, i) => (
        <Caption key={caption.name} name={caption.name} detail={caption.detail} show={view === i + 1} />
      ))}
    </SlideShell>
  );
}

/** Inside fades in as the camera passes the door, and out as the labeled kiosk takes over. */
function insideFadeDelay(view: number) {
  if (view === 2) return 0.45;
  return view === 3 ? 1.3 : 0;
}

/** The kiosk alone, with its parts called out. It lines up with the zoomed kiosk, so the swap is invisible. */
function LabeledKiosk({ print }: { print: boolean }) {
  return (
    <motion.div
      className="absolute top-0"
      style={{ left: labeled.left, width: labeled.width, height: VIEW.height }}
      initial={print ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: FADE, delay: 1.3 }}
    >
      <Kiosk labels={places.kiosk.parts} />
    </motion.div>
  );
}

function Caption({ name, detail, show }: { name: string; detail: string; show: boolean }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: VIEW.left, top: VIEW.top + VIEW.height + 22, width: VIEW.width }}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 10 }}
      transition={{ duration: FADE, delay: show ? 0.9 : 0 }}
      aria-hidden={!show}
    >
      <h2 className="inline text-h3 text-ink">{name}</h2>
      <p className="ml-4 inline text-body text-ink-muted">{detail}</p>
    </motion.div>
  );
}
