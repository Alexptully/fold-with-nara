"use client";

import { Microphone } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tile, type TileState } from "@/components/ui/Tile";
import { Jp } from "@/components/deck/primitives";
import type { ChoiceQuestion, MatchQuestion, SpeakQuestion } from "@/content/content";
import { tryLesson } from "@/content/content";

/**
 * The three exercise bodies inside the lesson card. Each one reports a right
 * answer with onSolve and a wrong one with onMiss; the card decides what Nara says.
 */

export type ExerciseOutcome = "open" | "missed" | "solved" | "explained";

type ChoiceProps = {
  question: ChoiceQuestion;
  outcome: ExerciseOutcome;
  selected: number | null;
  onSelect: (index: number) => void;
};

function choiceTileState(index: number, selected: number | null, correct: number, outcome: ExerciseOutcome): TileState {
  const isAnswer = index === correct;
  if ((outcome === "solved" || outcome === "explained") && isAnswer) return "correct";
  if (outcome === "missed" && index === selected) return "wrong";
  if (outcome === "explained" && index === selected) return "wrong";
  return index === selected ? "selected" : "idle";
}

/** Splits "つる tsuru" into its Japanese and romaji parts. */
function splitWord(option: string): { jp: string; romaji: string } {
  const [jp, ...rest] = option.split(" ");
  return { jp, romaji: rest.join(" ") };
}

export function ChoiceExercise({ question, outcome, selected, onSelect }: ChoiceProps) {
  const locked = outcome !== "open";
  return (
    <div className="grid grid-cols-2 gap-4">
      {question.options.map((option, i) => (
        <Tile
          key={option}
          state={choiceTileState(i, selected, question.correct, outcome)}
          onClick={() => onSelect(i)}
          disabled={locked}
          className="min-h-[96px]"
        >
          {question.kind === "word" ? <WordOption option={option} /> : option}
        </Tile>
      ))}
    </div>
  );
}

function WordOption({ option }: { option: string }) {
  const { jp, romaji } = splitWord(option);
  return (
    <span className="flex items-baseline gap-4">
      <Jp className="text-jp-sm font-extrabold">{jp}</Jp>
      <span>{romaji}</span>
    </span>
  );
}

export function SpeakExercise({ question, solved, onSolve }: { question: SpeakQuestion; solved: boolean; onSolve: () => void }) {
  const [listening, setListening] = useState(false);
  const listen = () => {
    setListening(true);
    window.setTimeout(onSolve, 1400);
  };
  if (solved) {
    return (
      <motion.div className="py-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Jp className="block text-jp-lg font-extrabold text-accent-ink">{question.answer.jp}</Jp>
        <p className="mt-2 text-h3 text-ink">{question.answer.romaji}</p>
      </motion.div>
    );
  }
  return (
    <div className="flex items-center gap-8 py-4">
      <motion.span
        className="grid h-36 w-36 place-items-center rounded-pill bg-paper-raised text-accent-ink shadow-tile"
        animate={listening ? { scale: [1, 1.08, 1], boxShadow: ["var(--shadow-tile)", "var(--shadow-tile-correct)", "var(--shadow-tile)"] } : { scale: 1 }}
        transition={{ duration: 0.7, repeat: listening ? Infinity : 0 }}
        aria-hidden="true"
      >
        <Microphone size={64} weight="fill" />
      </motion.span>
      <Button onClick={listen} disabled={listening}>
        {listening ? "Listening..." : tryLesson.speakLabel}
      </Button>
    </div>
  );
}

// Meanings are shown in a fixed shuffled order so the columns don't line up.
const meaningOrder = [2, 4, 0, 3, 1];

export function MatchExercise({ question, solved, onSolve }: { question: MatchQuestion; solved: boolean; onSolve: () => void }) {
  const allPairs = question.pairs.map((_, i) => i);
  const [matched, setMatched] = useState<number[]>(solved ? allPairs : []);
  const [picked, setPicked] = useState<number | null>(null);
  const [miss, setMiss] = useState<[number, number] | null>(null);

  const pickMeaning = (pairIndex: number) => {
    if (picked === null) return;
    if (picked !== pairIndex) {
      setMiss([picked, pairIndex]);
      window.setTimeout(() => setMiss(null), 600);
      setPicked(null);
      return;
    }
    const next = [...matched, pairIndex];
    setMatched(next);
    setPicked(null);
    if (next.length === question.pairs.length) onSolve();
  };

  const wordState = (i: number): TileState => {
    if (matched.includes(i)) return "correct";
    if (miss?.[0] === i) return "wrong";
    return picked === i ? "selected" : "idle";
  };
  const meaningState = (i: number): TileState => {
    if (matched.includes(i)) return "correct";
    return miss?.[1] === i ? "wrong" : "idle";
  };

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
      {question.pairs.map((pair, row) => {
        const meaningIndex = meaningOrder[row] ?? row;
        return [
          <Tile key={`w${row}`} state={wordState(row)} onClick={() => setPicked(row)} disabled={matched.includes(row)} className="py-3">
            <Jp className="text-jp-sm font-extrabold">{pair.word}</Jp>
          </Tile>,
          <Tile
            key={`m${row}`}
            state={meaningState(meaningIndex)}
            onClick={() => pickMeaning(meaningIndex)}
            disabled={matched.includes(meaningIndex)}
            className="py-3"
          >
            {question.pairs[meaningIndex].meaning}
          </Tile>,
        ];
      })}
    </div>
  );
}
