import {
  celebration,
  closing,
  demoQuestions,
  journey,
  lessonOverview,
  meetNara,
  method,
  miniBooth,
  options,
  places,
  questions,
  reactions,
  sourcesSlide,
  title,
  tryLesson,
  whyOrigami,
} from "@/content/content";
import type { SourceKey } from "@/content/sources";
import { celebrationScene, chooseScene, journeyScene, lessonScene, meetNaraScene, showOnKiosk } from "./kioskScenes";
import { CelebrationSlide, celebrationSpot } from "./slides/CelebrationSlide";
import { ChooseFoldSlide } from "./slides/ChooseFoldSlide";
import { ClosingSlide, closingSpot } from "./slides/ClosingSlide";
import { JourneySlide, journeySpot } from "./slides/JourneySlide";
import { LessonOverviewSlide } from "./slides/LessonOverviewSlide";
import { MeetNaraSlide, meetNaraSpot } from "./slides/MeetNaraSlide";
import { MethodSlide, methodSpot } from "./slides/MethodSlide";
import { MiniBoothSlide } from "./slides/MiniBoothSlide";
import { PlacesSlide } from "./slides/PlacesSlide";
import { ReactionsSlide } from "./slides/ReactionsSlide";
import { SourcesSlide } from "./slides/SourcesSlide";
import { TitleSlide } from "./slides/TitleSlide";
import { TryLessonSlide } from "./slides/TryLessonSlide";
import { WhyOrigamiSlide } from "./slides/WhyOrigamiSlide";
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

// The kiosk bows with Nara on the last two slides.
const thanksOnKiosk = showOnKiosk({ kind: "guide", say: "thanks" });

// Nara stays off stage until "Meet Nara", so her arrival after the booth is a reveal.
// The order follows the team's speaking order: everyone, Sam, Alex, Sophia, Tsion, Alex, Ledger, everyone.
// Slides without `kiosk` leave the demo kiosk on its welcome screen, where Nara hasn't appeared yet.
export const slides: SlideDef[] = [
  { name: "Title", speaker: title.speaker, steps: 1, seconds: 10, transition: "blend", notes: title.notes, Content: TitleSlide },
  {
    name: "Why origami",
    speaker: whyOrigami.speaker,
    section: sections.culture,
    steps: 2,
    seconds: 20,
    transition: "push",
    sourcesByStep: { 2: ["ikeaEffect"] },
    notes: whyOrigami.notes,
    Content: WhyOrigamiSlide,
  },
  {
    name: "Where it pops up",
    speaker: places.speaker,
    section: sections.location,
    steps: 3,
    seconds: 22,
    transition: "rise",
    printSteps: [1, 2, 3],
    notes: places.notes,
    Content: PlacesSlide,
  },
  {
    name: "Our mini booth",
    speaker: miniBooth.speaker,
    section: sections.location,
    steps: 1,
    seconds: 10,
    transition: "zoom",
    notes: miniBooth.notes,
    Content: MiniBoothSlide,
  },
  {
    name: "Meet Nara",
    speaker: meetNara.speaker,
    section: sections.character,
    steps: 3,
    seconds: 20,
    transition: "blend",
    nara: meetNaraSpot,
    printSteps: [1, 3],
    sourcesByStep: { 3: ["naraDeerCount2026", "naraDeerHistory", "naraNaturalMonument"] },
    notes: meetNara.notes,
    kiosk: meetNaraScene,
    Content: MeetNaraSlide,
  },
  {
    name: "How Nara reacts",
    speaker: reactions.speaker,
    section: sections.reactions,
    steps: 2,
    seconds: 14,
    transition: "rise",
    notes: reactions.notes,
    kiosk: (step) => ({ kind: "reactions", misses: step >= 2 }),
    Content: ReactionsSlide,
  },
  {
    name: "Your visit, step by step",
    speaker: journey.speaker,
    section: sections.journey,
    steps: journey.steps.length,
    seconds: 25,
    transition: "push",
    nara: journeySpot,
    notes: journey.notes,
    kiosk: journeyScene,
    Content: JourneySlide,
  },
  {
    name: "Choose what to fold",
    speaker: options.speaker,
    section: sections.culture,
    steps: 1,
    seconds: 14,
    transition: "zoom",
    sourcesByStep: { 1: ["sakura", "fuji", "senbazuru", "childrensDay"] },
    notes: options.notes,
    kiosk: chooseScene,
    Content: ChooseFoldSlide,
  },
  {
    name: "The Duolingo Method in paper",
    speaker: method.speaker,
    section: sections.method,
    steps: 1,
    seconds: 18,
    transition: "blend",
    nara: () => methodSpot,
    sourcesByStep: { 1: ["duolingoPrompt"] },
    notes: method.notes,
    kiosk: showOnKiosk({ kind: "guide", say: "method" }),
    Content: MethodSlide,
  },
  {
    name: "The 10-question lesson",
    speaker: lessonOverview.speaker,
    section: sections.lesson,
    steps: 2,
    seconds: 14,
    transition: "push",
    notes: lessonOverview.notes,
    kiosk: (step) => ({ kind: "path", folds: step >= 2 }),
    Content: LessonOverviewSlide,
  },
  {
    name: "Try the lesson",
    speaker: tryLesson.speaker,
    section: sections.lesson,
    steps: demoQuestions.length,
    seconds: 32,
    transition: "zoom",
    printSteps: demoQuestions.map((_, i) => i + 1),
    sourcesByStep: demoSources,
    notes: tryLesson.notes,
    kiosk: lessonScene,
    Content: TryLessonSlide,
  },
  {
    name: "You folded Mt. Fuji",
    speaker: celebration.speaker,
    section: sections.journey,
    steps: 2,
    seconds: 18,
    transition: "rise",
    nara: celebrationSpot,
    printSteps: [1, 2],
    notes: celebration.notes,
    kiosk: celebrationScene,
    Content: CelebrationSlide,
  },
  { name: "Thank you", speaker: closing.speaker, steps: 1, seconds: 7, transition: "blend", nara: () => closingSpot, notes: closing.notes, kiosk: thanksOnKiosk, Content: ClosingSlide },
  { name: "Sources", steps: 1, seconds: 0, transition: "rise", notes: sourcesSlide.notes, kiosk: thanksOnKiosk, Content: SourcesSlide },
];

/** The timed pitch, in seconds (the sources slide isn't presented). */
export const talkSeconds = slides.reduce((sum, slide) => sum + slide.seconds, 0);
