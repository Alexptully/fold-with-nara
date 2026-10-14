"use client";

/**
 * Sound effects, synthesized with the Web Audio API so the deck ships no audio
 * files. They echo the feel of a Duolingo lesson (a bright two-note chime for a
 * right answer, a soft low bonk for a miss) without copying any of its sounds.
 * Browsers only allow audio after a click or key press, which every trigger is.
 */

export type SoundName = "tap" | "correct" | "wrong" | "fold" | "pop" | "unlock" | "complete";

const STORAGE_KEY = "fold-with-nara:muted";
let context: AudioContext | null = null;
let master: GainNode | null = null;
let muted = readMuted();
let disabled = false;
const listeners = new Set<(muted: boolean) => void>();

function readMuted(): boolean {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function audio(): { ctx: AudioContext; out: GainNode } | null {
  if (typeof window === "undefined" || disabled) return null;
  if (!context) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
    master = context.createGain();
    master.gain.value = 0.55;
    master.connect(context.destination);
  }
  if (context.state === "suspended") void context.resume();
  return master ? { ctx: context, out: master } : null;
}

type Note = { freq: number; at: number; length: number; type?: OscillatorType; volume?: number; glideTo?: number };

function note({ ctx, out }: { ctx: AudioContext; out: GainNode }, n: Note) {
  const start = ctx.currentTime + n.at;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = n.type ?? "sine";
  osc.frequency.setValueAtTime(n.freq, start);
  if (n.glideTo) osc.frequency.exponentialRampToValueAtTime(n.glideTo, start + n.length);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(n.volume ?? 0.3, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + n.length);
  osc.connect(gain).connect(out);
  osc.start(start);
  osc.stop(start + n.length + 0.05);
}

/** A soft paper swish: filtered noise sweeping upward, then a quiet crease tick. */
function swish({ ctx, out }: { ctx: AudioContext; out: GainNode }) {
  const length = 0.42;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * length), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 0.9;
  const now = ctx.currentTime;
  filter.frequency.setValueAtTime(700, now);
  filter.frequency.exponentialRampToValueAtTime(3200, now + length);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
  source.connect(filter).connect(gain).connect(out);
  source.start(now);
  note({ ctx, out }, { freq: 1800, at: 0.36, length: 0.05, type: "triangle", volume: 0.05 });
}

const recipes: Record<SoundName, (a: { ctx: AudioContext; out: GainNode }) => void> = {
  tap: (a) => note(a, { freq: 520, at: 0, length: 0.07, type: "triangle", volume: 0.18, glideTo: 420 }),
  pop: (a) => note(a, { freq: 420, at: 0, length: 0.12, volume: 0.28, glideTo: 980 }),
  correct: (a) => {
    note(a, { freq: 880, at: 0, length: 0.16, type: "triangle", volume: 0.26 });
    note(a, { freq: 1318.5, at: 0.11, length: 0.42, type: "triangle", volume: 0.3 });
    note(a, { freq: 2637, at: 0.11, length: 0.3, volume: 0.06 });
  },
  wrong: (a) => {
    note(a, { freq: 330, at: 0, length: 0.14, type: "square", volume: 0.07 });
    note(a, { freq: 233, at: 0.12, length: 0.3, type: "triangle", volume: 0.24, glideTo: 196 });
  },
  unlock: (a) => [1046.5, 1318.5, 1568, 2093].forEach((freq, i) => note(a, { freq, at: i * 0.06, length: 0.22, type: "triangle", volume: 0.16 })),
  complete: (a) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => note(a, { freq, at: i * 0.11, length: 0.3, type: "triangle", volume: 0.22 }));
    [523.25, 659.25, 783.99, 1046.5].forEach((freq) => note(a, { freq, at: 0.5, length: 0.9, type: "triangle", volume: 0.12 }));
  },
  fold: swish,
};

export function play(name: SoundName) {
  if (muted) return;
  const a = audio();
  if (a) recipes[name](a);
}

export function isMuted() {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // Storage can be blocked; the setting then lasts until the page reloads.
  }
  listeners.forEach((listener) => listener(next));
}

export function onMutedChange(listener: (muted: boolean) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The print route never makes sound. */
export function disableSound() {
  disabled = true;
}
