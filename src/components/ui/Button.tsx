"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "chunky" | "quiet" | "onCorrect" | "onWrong";

const variants: Record<Variant, string> = {
  chunky: "bg-paper-raised text-ink shadow-tile active:translate-y-1 active:shadow-none",
  quiet: "bg-transparent text-ink-muted underline underline-offset-4 decoration-2",
  onCorrect: "bg-paper-raised text-accent-ink shadow-tile-correct active:translate-y-1",
  onWrong: "bg-paper-raised text-wrong-ink shadow-tile-wrong active:translate-y-1",
};

/** The deck's one button. Controls stay neutral; state colors only frame them. */
export function Button({
  variant = "chunky",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      {...props}
      className={`shrink-0 whitespace-nowrap rounded-tile px-8 py-4 text-small font-extrabold transition-transform disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    />
  );
}
