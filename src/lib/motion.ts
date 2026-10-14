// Easing curves and durations for motion. These mirror --ease-fold and
// --ease-out-soft in globals.css so CSS and JS animations feel the same.

export const ease = {
  fold: [0.65, 0, 0.35, 1] as const,
  outSoft: [0.22, 1, 0.36, 1] as const,
};

/** Duolingo-style pop: a quick spring with a little overshoot. */
export const spring = { type: "spring" as const, stiffness: 420, damping: 24, mass: 0.9 };

export const duration = {
  quick: 0.25,
  base: 0.5,
  slow: 0.9,
  /** Slides blending into each other. */
  slide: 0.75,
  /** Nara walking or growing from one spot to the next. */
  travel: 0.95,
};

/** Pop-and-rise used by most reveals, with a small springy overshoot. Pass the delay as `custom`. */
export const rise = {
  hidden: { opacity: 0, y: 26, scale: 0.97, transition: { duration: duration.quick } },
  shown: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...spring, delay, opacity: { duration: duration.quick, delay } },
  }),
};
