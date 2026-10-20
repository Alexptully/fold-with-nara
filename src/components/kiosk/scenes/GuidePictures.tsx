"use client";

import { motion } from "motion/react";
import { FoldPlayer, FujiPaper } from "@/components/art/FujiPaper";
import { Button } from "@/components/ui/Button";
import { kioskScreen, type KioskPicture } from "@/content/content";
import { ease } from "@/lib/motion";
import { QrCode } from "../QrCode";
import { useLoop } from "../useLoop";

/** The small looping pictures beside Nara on the kiosk's guide screens. */

export function GuidePicture({ picture }: { picture: KioskPicture }) {
  const Picture = pictures[picture];
  return <Picture />;
}

/** The kiosk's pulsing start button. On the mirror it's a picture of the button, not a control. */
export function StartButton() {
  return (
    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
      <Button variant="primary" size="large" tabIndex={-1} sound={null}>
        {kioskScreen.startLabel}
      </Button>
    </motion.div>
  );
}

const PRINT_SECONDS = 3.6;

/** The printer's slot, with the printed sheet sliding out of it again and again. */
function Printer() {
  return (
    <div className="relative h-[460px] w-[520px]" aria-hidden="true">
      <div className="absolute inset-x-0 top-0 z-10 h-[150px] rounded-card bg-device shadow-float">
        <span className="absolute inset-x-12 bottom-8 h-4 rounded-pill bg-screen-frame" />
        <span className="absolute right-10 top-8 h-5 w-5 rounded-pill bg-accent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 top-[126px] overflow-hidden">
        <motion.div
          className="mx-auto h-[300px] w-[300px]"
          animate={{ y: [-310, -310, 0, 0] }}
          transition={{ duration: PRINT_SECONDS, times: [0, 0.15, 0.7, 1], repeat: Infinity, ease: ease.outSoft }}
        >
          <FujiPaper state={0} appear={false} className="h-full w-full" label="" />
        </motion.div>
      </div>
    </div>
  );
}

const corners = [
  { left: 0, top: 0, rotate: 0 },
  { right: 0, top: 0, rotate: 90 },
  { right: 0, bottom: 0, rotate: 180 },
  { left: 0, bottom: 0, rotate: 270 },
];

/** The folding ledge with its green frame, and the sheet sliding in to sit inside it. */
function Frame() {
  return (
    <div className="relative h-[440px] w-[560px] rounded-card bg-paper-sunk shadow-well" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2">
        {corners.map(({ rotate, ...at }) => (
          <motion.svg
            key={rotate}
            className="projected absolute h-[64px] w-[64px]"
            style={{ ...at, rotate }}
            viewBox="0 0 64 64"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M6 58 V6 H58" fill="none" stroke="var(--color-accent)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        ))}
        <motion.div
          className="absolute -inset-[37px]"
          animate={{ y: [260, 0, 0], opacity: [0, 1, 1], rotate: [8, 0, 0] }}
          transition={{ duration: 3.4, times: [0, 0.45, 1], repeat: Infinity, ease: ease.outSoft }}
        >
          <FujiPaper state={0} appear={false} className="h-full w-full" label="" />
        </motion.div>
      </div>
    </div>
  );
}

const FOLD_LOOP_MS = 5600;

/** Fold 1 as the projector shows it: the crease, the arrow, then the paper folding. */
function Light() {
  const loop = useLoop(FOLD_LOOP_MS);
  return (
    <div className="h-[460px] w-[460px]">
      <FoldPlayer key={loop} fold={1} play className="h-full w-full" />
    </div>
  );
}

/** The badge the visitor collects, and the code they scan for it. */
function Badge() {
  return (
    <div className="flex items-center gap-14">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="grid h-[260px] w-[260px] place-items-center rounded-pill bg-bee shadow-badge"
          animate={{ rotate: [0, -6, 6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="grid h-[220px] w-[220px] place-items-center rounded-pill bg-paper">
            <FujiPaper state={3} tight appear={false} className="w-[180px]" label="Mt. Fuji badge" />
          </span>
        </motion.div>
        <p className="text-h4 text-ink">{kioskScreen.badgeLabel}</p>
      </div>
      <QrCode text={kioskScreen.badgeLink} label="Code to scan for the badge" className="h-[300px] w-[300px] rounded-tile shadow-card" />
    </div>
  );
}

const pictures: Record<KioskPicture, () => React.ReactNode> = {
  start: StartButton,
  printer: Printer,
  frame: Frame,
  light: Light,
  badge: Badge,
};
