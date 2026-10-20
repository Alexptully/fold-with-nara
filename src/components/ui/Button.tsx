"use client";

import type { ButtonHTMLAttributes } from "react";
import { play, type SoundName } from "@/lib/sound";

type Variant = "primary" | "danger" | "chunky" | "chosen" | "quiet";

// Primary and danger copy Duolingo's lesson buttons: a filled face on a darker 4px ledge.
const variants: Record<Variant, string> = {
  primary: "bg-accent text-paper shadow-button-green active:translate-y-1 active:shadow-none",
  danger: "bg-wrong text-paper shadow-button-red active:translate-y-1 active:shadow-none",
  chunky: "bg-paper-raised text-ink shadow-tile active:translate-y-1 active:shadow-none",
  // A chunky button the visitor has picked, in the lesson's selected-tile blue.
  chosen: "bg-macaw-soft text-macaw-ink shadow-tile-selected",
  quiet: "bg-transparent text-ink-muted underline underline-offset-4 decoration-2",
};

const disabledLook = "disabled:bg-line disabled:text-ink-faint disabled:shadow-none disabled:cursor-not-allowed";

type Size = "body" | "large" | "panel" | "icon";

// Slide buttons are "body". "large" is the kiosk's start button; "panel" and "icon" are the
// projector's setup controls, sized for a laptop or phone screen rather than the stage.
const sizes: Record<Size, string> = {
  body: "px-9 py-4 text-body",
  large: "px-16 py-6 text-h3",
  panel: "px-4 py-2 text-panel",
  icon: "grid h-12 w-12 place-items-center text-panel",
};

/** The deck's one button. It plays a soft tap unless told to play something else. */
export function Button({
  variant = "chunky",
  size = "body",
  className = "",
  sound = "tap",
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; sound?: SoundName | null }) {
  return (
    <button
      type="button"
      {...props}
      onClick={(event) => {
        if (sound) play(sound);
        onClick?.(event);
      }}
      className={`shrink-0 whitespace-nowrap rounded-tile font-extrabold transition-transform ${sizes[size]} ${variants[variant]} ${disabledLook} ${className}`}
    />
  );
}
