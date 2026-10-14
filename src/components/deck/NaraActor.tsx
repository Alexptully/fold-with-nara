"use client";

import { AnimatePresence, motion, type Transition } from "motion/react";
import { createContext, useContext, useState } from "react";
import { BODY_VIEWBOX, HEAD_VIEWBOX } from "@/components/art/nara/geometry";
import { Nara, type Pose, type ShapeKind } from "@/components/art/nara/Nara";
import { config } from "@/content/config";
import { duration, ease } from "@/lib/motion";
import { asset } from "@/lib/paths";

/**
 * Nara lives on the stage, not inside a slide. Each slide says where she stands
 * and which expression she wears, and she walks, grows and changes expression
 * between spots while the slides blend underneath her.
 */

export type NaraSpot = {
  /** Top-left corner of her 620 by 900 frame on the 1920 by 1080 stage. */
  x: number;
  y: number;
  /** Rendered height of that frame, in stage pixels. */
  h: number;
  pose: Pose;
  /** Walk to this spot, then fade out on it (Meet Nara's outline step). */
  hidden?: boolean;
};

const scaleOf = (spot: NaraSpot) => spot.h / BODY_VIEWBOX.h;

/** Where Nara's head sits on the stage for a spot, so the outline sketch can line up with it. */
export function headBox(spot: NaraSpot) {
  const s = scaleOf(spot);
  return {
    left: spot.x + (HEAD_VIEWBOX.x - BODY_VIEWBOX.x) * s,
    top: spot.y + (HEAD_VIEWBOX.y - BODY_VIEWBOX.y) * s,
    width: HEAD_VIEWBOX.w * s,
    height: HEAD_VIEWBOX.h * s,
  };
}

type Highlight = { highlight: ShapeKind | null; setHighlight: (kind: ShapeKind | null) => void };

/** Lets a slide light up Nara's parts by shape (the shape kit on Meet Nara). */
export const NaraHighlightContext = createContext<Highlight>({ highlight: null, setHighlight: () => undefined });
export const useNaraHighlight = () => useContext(NaraHighlightContext);

type Move = "appear" | "travel" | "leaveTo" | "leaveHere" | "still";

const instant = { duration: 0 };
const moves: Record<Move, Transition> = {
  // Appearing: jump to the spot unseen, then fade in.
  appear: { x: instant, y: instant, scale: instant, opacity: { duration: duration.base, delay: 0.2 } },
  travel: { duration: duration.travel, ease: ease.fold },
  // Walk to the new spot, then dissolve there.
  leaveTo: { duration: duration.travel, ease: ease.fold, opacity: { duration: duration.base, delay: duration.travel * 0.55 } },
  leaveHere: { opacity: { duration: duration.base * 0.8 } },
  still: instant,
};

function moveFor(wasShown: boolean, shown: boolean, hasSpot: boolean): Move {
  if (!wasShown && shown) return "appear";
  if (wasShown && shown) return "travel";
  if (wasShown) return hasSpot ? "leaveTo" : "leaveHere";
  return "still";
}

const keyOf = (spot: NaraSpot | null) => (spot ? `${spot.x}:${spot.y}:${spot.h}:${spot.pose}:${Boolean(spot.hidden)}` : "none");

/** Remembers the last spot and how Nara should get from there to the new one. */
function useStageMove(spot: NaraSpot | null) {
  const shown = Boolean(spot && !spot.hidden);
  const key = keyOf(spot);
  const [state, setState] = useState({ key, shown, place: spot, move: "still" as Move });
  if (state.key !== key) {
    setState({ key, shown, place: spot ?? state.place, move: moveFor(state.shown, shown, Boolean(spot)) });
  }
  return state;
}

/** `cut` skips the walk, for jumps from the address bar that cut straight to a slide. */
export function NaraActor({ spot, cut = false }: { spot: NaraSpot | null; cut?: boolean }) {
  const { place, shown, move } = useStageMove(spot);
  const { highlight } = useNaraHighlight();
  if (!place) return null;
  return (
    <motion.div
      aria-hidden={!shown}
      className="pointer-events-none absolute left-0 top-0 z-10"
      style={{ width: BODY_VIEWBOX.w, height: BODY_VIEWBOX.h, transformOrigin: "0 0" }}
      initial={false}
      animate={{ x: place.x, y: place.y, scale: scaleOf(place), opacity: shown ? 1 : 0 }}
      transition={cut ? instant : moves[move]}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={place.pose}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // The old expression stays solid underneath until the new one fully covers it.
          exit={{ opacity: 0, transition: { delay: duration.quick, duration: 0.05 } }}
          transition={{ duration: duration.quick }}
        >
          <Figure pose={place.pose} highlight={highlight} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/** The team's own drawing when config.characterImage is set; otherwise the vector Nara. */
function Figure({ pose, highlight }: { pose: Pose; highlight: ShapeKind | null }) {
  if (config.characterImage) {
    return <img src={asset(config.characterImage)} alt={config.characterName} className="h-full w-full object-contain object-bottom" />;
  }
  return <Nara pose={pose} highlight={highlight} title={config.characterName} className="h-full w-full" />;
}
