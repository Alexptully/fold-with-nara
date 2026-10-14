import {
  closing,
  encouragement,
  fading,
  lessonOverview,
  meetNara,
  mechanism,
  method,
  popUp,
  questions,
  sourcesSlide,
  title,
  tryLesson,
  visit,
  whatWeTeach,
  wrongAnswers,
} from "@/content/content";
import type { SourceKey } from "@/content/sources";
import { ClosingSlide } from "./slides/ClosingSlide";
import { EncouragementSlide } from "./slides/EncouragementSlide";
import { FadingSlide } from "./slides/FadingSlide";
import { LessonOverviewSlide } from "./slides/LessonOverviewSlide";
import { MechanismSlide } from "./slides/MechanismSlide";
import { MeetNaraSlide } from "./slides/MeetNaraSlide";
import { MethodSlide } from "./slides/MethodSlide";
import { PopUpSlide } from "./slides/PopUpSlide";
import { SourcesSlide } from "./slides/SourcesSlide";
import { TitleSlide } from "./slides/TitleSlide";
import { TryLessonSlide } from "./slides/TryLessonSlide";
import { VisitSlide } from "./slides/VisitSlide";
import { WhatWeTeachSlide } from "./slides/WhatWeTeachSlide";
import { WrongAnswersSlide } from "./slides/WrongAnswersSlide";
import type { SlideDef } from "./types";

// Footer tags name the brief's required sections (see brief.md).
export const sections = {
  character: "Prompt 2: new world character and brand style",
  culture: "Prompt 2: cultural aspect of Japan",
  location: "Prompt 2: distinct location",
  mechanism: "How the installation teaches",
  lesson: "Prompt 2: 10-question lesson",
  wrong: "Prompt 2: correcting wrong answers",
  encourage: "Prompt 2: encouraging the learner",
  journey: "Visitor journey and takeaway",
} as const;

// Each lesson step cites the source behind its question, if it has one.
const lessonSources = Object.fromEntries(
  questions.map((question) => [question.n, question.source ? [question.source] : []]),
) as Record<number, SourceKey[]>;

export const slides: SlideDef[] = [
  { name: "Title", steps: 1, notes: title.notes, Content: TitleSlide },
  {
    name: "Meet Nara",
    section: sections.character,
    steps: 3,
    printSteps: [1, 3],
    sourcesByStep: { 1: ["duolingoPrompt"], 3: ["duolingoPrompt", "naraDeerCount2026", "naraDeerHistory", "naraNaturalMonument"] },
    notes: meetNara.notes,
    Content: MeetNaraSlide,
  },
  {
    name: "What we teach and why",
    section: sections.culture,
    steps: 2,
    sourcesByStep: { 1: ["origamiWord"], 2: ["origamiWord", "duolingoPrompt"] },
    notes: whatWeTeach.notes,
    Content: WhatWeTeachSlide,
  },
  {
    name: "One station in two sizes",
    section: sections.location,
    steps: 2,
    notes: popUp.notes,
    Content: PopUpSlide,
  },
  {
    name: "How a station teaches",
    section: sections.mechanism,
    steps: 4,
    printSteps: [1, 3, 4],
    notes: mechanism.notes,
    Content: MechanismSlide,
  },
  {
    name: "The 10-question lesson",
    section: sections.lesson,
    steps: 2,
    notes: lessonOverview.notes,
    Content: LessonOverviewSlide,
  },
  {
    name: "Try the lesson",
    section: sections.lesson,
    steps: questions.length,
    printSteps: questions.map((question) => question.n),
    sourcesByStep: lessonSources,
    notes: tryLesson.notes,
    Content: TryLessonSlide,
  },
  {
    name: "When you get it wrong",
    section: sections.wrong,
    steps: 2,
    sourcesByStep: { 1: ["sakura"] },
    notes: wrongAnswers.notes,
    Content: WrongAnswersSlide,
  },
  {
    name: "Help fades as you learn",
    section: sections.mechanism,
    steps: 3,
    sourcesByStep: { 3: ["fading"] },
    notes: fading.notes,
    Content: FadingSlide,
  },
  {
    name: "How Nara keeps you going",
    section: sections.encourage,
    steps: 2,
    notes: encouragement.notes,
    Content: EncouragementSlide,
  },
  {
    name: "The Duolingo Method in paper",
    section: sections.mechanism,
    steps: 1,
    sourcesByStep: { 1: ["duolingoPrompt", "retrieval"] },
    notes: method.notes,
    Content: MethodSlide,
  },
  {
    name: "The ten-minute visit",
    section: sections.journey,
    steps: 2,
    notes: visit.notes,
    Content: VisitSlide,
  },
  { name: "Thank you", steps: 1, notes: closing.notes, Content: ClosingSlide },
  { name: "Sources", steps: 1, notes: sourcesSlide.notes, Content: SourcesSlide },
];
