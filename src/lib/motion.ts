// Easing curves and durations for motion. These mirror --ease-fold and
// --ease-out-soft in globals.css so CSS and JS animations feel the same.

export const ease = {
  fold: [0.7, 0, 0.2, 1] as const,
  outSoft: [0.22, 1, 0.36, 1] as const,
};

export const duration = {
  quick: 0.25,
  base: 0.5,
  slow: 0.9,
  slideFold: 0.85,
};

/** Fade-and-rise used by most text reveals. Pass the delay as `custom`. */
export const rise = {
  hidden: { opacity: 0, y: 24, transition: { duration: duration.quick } },
  shown: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.outSoft, delay },
  }),
};
