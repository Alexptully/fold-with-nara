import {
  closing,
  encouragement,
  fading,
  journey,
  kiosk,
  lessonOverview,
  meetNara,
  mechanism,
  method,
  options,
  questions,
  sourcesSlide,
  tent,
  title,
  tryLesson,
  visit,
  whatWeTeach,
  wrongAnswers,
} from "@/content/content";
import type { SourceKey } from "@/content/sources";
import { ChooseFoldSlide } from "./slides/ChooseFoldSlide";
import { ClosingSlide } from "./slides/ClosingSlide";
import { EncouragementSlide } from "./slides/EncouragementSlide";
import { FadingSlide } from "./slides/FadingSlide";
import { JourneySlide } from "./slides/JourneySlide";
import { KioskSlide } from "./slides/KioskSlide";
import { LessonOverviewSlide } from "./slides/LessonOverviewSlide";
import { MechanismSlide } from "./slides/MechanismSlide";
import { MeetNaraSlide } from "./slides/MeetNaraSlide";
import { MethodSlide } from "./slides/MethodSlide";
import { SourcesSlide } from "./slides/SourcesSlide";
import { TentSlide } from "./slides/TentSlide";
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
  journey: "Visitor journey",
  mechanism: "How the installation teaches",
  lesson: "Prompt 2: 10-question lesson",
  wrong: "Prompt 2: correcting wrong answers",
  encourage: "Prompt 2: encouraging the learner",
  takeaway: "Visitor journey and takeaway",
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
    sourcesByStep: { 3: ["naraDeerCount2026", "naraDeerHistory", "naraNaturalMonument"] },
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
    name: "Your visit, step by step",
    section: sections.journey,
    steps: journey.steps.length,
    stepSound: "pop",
    notes: journey.notes,
    Content: JourneySlide,
  },
  {
    name: "Choose what to fold",
    section: sections.culture,
    steps: 1,
    sourcesByStep: { 1: ["sakura", "fuji", "senbazuru", "childrensDay"] },
    notes: options.notes,
    Content: ChooseFoldSlide,
  },
  { name: "The airport kiosk", section: sections.location, steps: 1, notes: kiosk.notes, Content: KioskSlide },
  { name: "The tent pop-up", section: sections.location, steps: 2, stepSound: "pop", notes: tent.notes, Content: TentSlide },
  {
    name: "How a station teaches",
    section: sections.mechanism,
    steps: 4,
    printSteps: [1, 3, 4],
    stepSound: "pop",
    notes: mechanism.notes,
    Content: MechanismSlide,
  },
  { name: "The 10-question lesson", section: sections.lesson, steps: 2, notes: lessonOverview.notes, Content: LessonOverviewSlide },
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
  { name: "How Nara keeps you going", section: sections.encourage, steps: 2, notes: encouragement.notes, Content: EncouragementSlide },
  {
    name: "Help fades as you learn",
    section: sections.mechanism,
    steps: 3,
    sourcesByStep: { 3: ["fading"] },
    notes: fading.notes,
    Content: FadingSlide,
  },
  {
    name: "The Duolingo Method in paper",
    section: sections.mechanism,
    steps: 1,
    sourcesByStep: { 1: ["duolingoPrompt", "retrieval"] },
    notes: method.notes,
    Content: MethodSlide,
  },
  { name: "The ten-minute visit", section: sections.takeaway, steps: 2, notes: visit.notes, Content: VisitSlide },
  { name: "Thank you", steps: 1, arrivalSound: "complete", notes: closing.notes, Content: ClosingSlide },
  { name: "Sources", steps: 1, notes: sourcesSlide.notes, Content: SourcesSlide },
];
