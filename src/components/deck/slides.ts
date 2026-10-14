import {
  closing,
  demoQuestions,
  journey,
  lessonOverview,
  meetNara,
  method,
  options,
  places,
  questions,
  reactions,
  sourcesSlide,
  title,
  tryLesson,
} from "@/content/content";
import type { SourceKey } from "@/content/sources";
import { ChooseFoldSlide } from "./slides/ChooseFoldSlide";
import { ClosingSlide, closingSpot } from "./slides/ClosingSlide";
import { JourneySlide, journeySpot } from "./slides/JourneySlide";
import { LessonOverviewSlide } from "./slides/LessonOverviewSlide";
import { MeetNaraSlide, meetNaraSpot } from "./slides/MeetNaraSlide";
import { MethodSlide, methodSpot } from "./slides/MethodSlide";
import { PlacesSlide } from "./slides/PlacesSlide";
import { ReactionsSlide } from "./slides/ReactionsSlide";
import { SourcesSlide } from "./slides/SourcesSlide";
import { TitleSlide, titleSpot } from "./slides/TitleSlide";
import { TryLessonSlide } from "./slides/TryLessonSlide";
import type { SlideDef } from "./types";

// Footer tags name the brief's required sections (see brief.md).
export const sections = {
  character: "Prompt 2: new world character and brand style",
  culture: "Prompt 2: cultural aspect of Japan",
  location: "Prompt 2: distinct location",
  journey: "Visitor journey and takeaway",
  lesson: "Prompt 2: 10-question lesson",
  reactions: "Prompt 2: correcting wrong answers and encouraging the learner",
  method: "How the installation teaches",
} as const;

// Each demo question cites the source behind it, if it has one.
const demoSources = Object.fromEntries(
  demoQuestions.map((n, i) => {
    const source = questions[n - 1].source;
    return [i + 1, source ? [source] : []];
  }),
) as Record<number, SourceKey[]>;

export const slides: SlideDef[] = [
  { name: "Title", steps: 1, seconds: 12, transition: "blend", nara: () => titleSpot, notes: title.notes, Content: TitleSlide },
  {
    name: "Meet Nara",
    section: sections.character,
    steps: 3,
    seconds: 25,
    transition: "blend",
    nara: meetNaraSpot,
    printSteps: [1, 3],
    sourcesByStep: { 3: ["naraDeerCount2026", "naraDeerHistory", "naraNaturalMonument"] },
    notes: meetNara.notes,
    Content: MeetNaraSlide,
  },
  {
    name: "Your visit, step by step",
    section: sections.journey,
    steps: journey.steps.length,
    seconds: 35,
    transition: "push",
    nara: journeySpot,
    notes: journey.notes,
    Content: JourneySlide,
  },
  {
    name: "Choose what to fold",
    section: sections.culture,
    steps: 1,
    seconds: 18,
    transition: "zoom",
    sourcesByStep: { 1: ["sakura", "fuji", "senbazuru", "childrensDay"] },
    notes: options.notes,
    Content: ChooseFoldSlide,
  },
  { name: "Where it pops up", section: sections.location, steps: 2, seconds: 18, transition: "rise", notes: places.notes, Content: PlacesSlide },
  {
    name: "The 10-question lesson",
    section: sections.lesson,
    steps: 2,
    seconds: 15,
    transition: "push",
    notes: lessonOverview.notes,
    Content: LessonOverviewSlide,
  },
  {
    name: "Try the lesson",
    section: sections.lesson,
    steps: demoQuestions.length,
    seconds: 40,
    transition: "zoom",
    printSteps: demoQuestions.map((_, i) => i + 1),
    sourcesByStep: demoSources,
    notes: tryLesson.notes,
    Content: TryLessonSlide,
  },
  { name: "How Nara reacts", section: sections.reactions, steps: 2, seconds: 20, transition: "blend", notes: reactions.notes, Content: ReactionsSlide },
  {
    name: "The Duolingo Method in paper",
    section: sections.method,
    steps: 1,
    seconds: 15,
    transition: "rise",
    nara: () => methodSpot,
    sourcesByStep: { 1: ["duolingoPrompt", "retrieval"] },
    notes: method.notes,
    Content: MethodSlide,
  },
  { name: "Thank you", steps: 1, seconds: 7, transition: "blend", nara: () => closingSpot, notes: closing.notes, Content: ClosingSlide },
  { name: "Sources", steps: 1, seconds: 0, transition: "rise", notes: sourcesSlide.notes, Content: SourcesSlide },
];

/** The timed pitch, in seconds (the sources slide isn't presented). */
export const talkSeconds = slides.reduce((sum, slide) => sum + slide.seconds, 0);
