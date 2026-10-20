import type { ReactNode } from "react";

/** A speech bubble with a small tail pointing toward the speaker: left of it by default, or below it. */
export function SpeechBubble({ children, className = "", tail = "left" }: { children: ReactNode; className?: string; tail?: "left" | "down" }) {
  return (
    <div className={`relative rounded-card bg-paper-raised px-7 py-5 shadow-tile ${className}`}>
      {tail === "left" ? <LeftTail /> : <DownTail />}
      {children}
    </div>
  );
}

function LeftTail() {
  return (
    <svg className="absolute -left-[18px] top-8" width="20" height="28" viewBox="0 0 20 28" aria-hidden="true">
      <path d="M20 0 L20 28 L2 16 Q-1 14 2 12 Z" fill="var(--color-line)" />
      <path d="M20 3 L20 25 L5 15.5 Q3 14 5 12.5 Z" fill="var(--color-paper-raised)" />
    </svg>
  );
}

// The bubble's ledge shadow is 4px deep, so this tail starts below it.
function DownTail() {
  return (
    <svg className="absolute -bottom-[22px] left-20" width="28" height="22" viewBox="0 0 28 22" aria-hidden="true">
      <path d="M0 0 L28 0 L16 20 Q14 23 12 20 Z" fill="var(--color-line)" />
      <path d="M3 0 L25 0 L15.5 15 Q14 17 12.5 15 Z" fill="var(--color-paper-raised)" />
    </svg>
  );
}
