import type { ReactNode } from "react";

/** A speech bubble with a small tail pointing left, toward the speaker. */
export function SpeechBubble({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-card bg-paper-raised px-7 py-5 shadow-tile ${className}`}>
      <svg
        className="absolute -left-[18px] top-8"
        width="20"
        height="28"
        viewBox="0 0 20 28"
        aria-hidden="true"
      >
        <path d="M20 0 L20 28 L2 16 Q-1 14 2 12 Z" fill="var(--color-line)" />
        <path d="M20 3 L20 25 L5 15.5 Q3 14 5 12.5 Z" fill="var(--color-paper-raised)" />
      </svg>
      {children}
    </div>
  );
}
