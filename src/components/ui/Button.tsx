"use client";

import type { ButtonHTMLAttributes } from "react";
import { play, type SoundName } from "@/lib/sound";

type Variant = "primary" | "danger" | "chunky" | "quiet";

// Primary and danger copy Duolingo's lesson buttons: a filled face on a darker 4px ledge.
const variants: Record<Variant, string> = {
  primary: "bg-accent text-paper shadow-button-green active:translate-y-1 active:shadow-none",
  danger: "bg-wrong text-paper shadow-button-red active:translate-y-1 active:shadow-none",
  chunky: "bg-paper-raised text-ink shadow-tile active:translate-y-1 active:shadow-none",
  quiet: "bg-transparent text-ink-muted underline underline-offset-4 decoration-2",
};

const disabledLook = "disabled:bg-line disabled:text-ink-faint disabled:shadow-none disabled:cursor-not-allowed";

/** The deck's one button. It plays a soft tap unless told to play something else. */
export function Button({
  variant = "chunky",
  className = "",
  sound = "tap",
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; sound?: SoundName | null }) {
  return (
    <button
      type="button"
      {...props}
      onClick={(event) => {
        if (sound) play(sound);
        onClick?.(event);
      }}
      className={`shrink-0 whitespace-nowrap rounded-tile px-9 py-4 text-small font-extrabold transition-transform ${variants[variant]} ${disabledLook} ${className}`}
    />
  );
}
