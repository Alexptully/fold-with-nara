// Every word, number and note in the deck. Slide components read from here.
// Questions marked fromDoc: true follow the team's wording from the shared doc
// (shortened to fit the lesson card); the rest are drafts for Sophia to review (see brief.md).

import type { Pose } from "@/components/art/nara/geometry";
import { config } from "./config";
import type { SourceKey } from "./sources";

const nara = config.characterName;

/* ---------- The lesson: three folds and ten questions ---------- */

export type Guidance = "show" | "mark" | "try";

export type Fold = {
  n: number;
  instruction: string;
  guidance: Guidance;
};

// The origami Mt. Fuji from the team's fold sheet. The sheet comes printed with its
// dashed guide lines, so the visitor makes three folds, each shown as a projected demo.
export const folds: Fold[] = [
  { n: 1, instruction: "Fold in half into a triangle, snow on top", guidance: "show" },
  { n: 2, instruction: "Fold the left corner over to the right", guidance: "show" },
  { n: 3, instruction: "Open it halfway so your mountain stands", guidance: "show" },
];

/**
 * The ten questions come in three sets of three, one set before each fold: the
 * third answer in a set unlocks the next fold. Question 10 comes once the mountain
 * stands, just before the completion message.
 */
export const QUESTIONS_PER_FOLD = 3;
/** The fold a question unlocks, or null if it doesn't unlock one. */
export const foldUnlockedBy = (n: number): Fold | null => (n % QUESTIONS_PER_FOLD === 0 ? (folds[n / QUESTIONS_PER_FOLD - 1] ?? null) : null);
/** How many folds are already on the paper when a question is asked. */
export const foldsDoneBefore = (n: number) => Math.min(Math.floor((n - 1) / QUESTIONS_PER_FOLD), folds.length);

export type ExerciseKind = "speak" | "choose" | "word" | "match";

type QuestionBase = {
  n: number;
  place: string;
  topic: { jp: string; romaji: string; english: string };
  story: string;
  /** The words in the story that hold the answer. Nara highlights them after a miss. */
  clue: string;
  prompt: string;
  hint: string;
  explain: string;
  fromDoc: boolean;
  source?: SourceKey;
};

export type SpeakQuestion = QuestionBase & {
  kind: "speak";
  answer: { jp: string; romaji: string };
};
export type ChoiceQuestion = QuestionBase & {
  kind: "choose" | "word";
  options: string[];
  correct: number;
};
export type MatchQuestion = QuestionBase & {
  kind: "match";
  pairs: { word: string; meaning: string }[];
};
export type Question = SpeakQuestion | ChoiceQuestion | MatchQuestion;

// Stories are kept to a sentence or two so they read at a glance on the lesson card.
export const questions: Question[] = [
  {
    n: 1,
    kind: "speak",
    place: "The park gate",
    topic: { jp: "こんにちは", romaji: "konnichiwa", english: "hello" },
    story: "You'll meet new people as we explore Japan. Saying こんにちは is a great way to start a conversation!",
    clue: "Saying こんにちは is a great way to start a conversation!",
    prompt: "How do you say \"hello\" in Japanese?",
    answer: { jp: "こんにちは", romaji: "konnichiwa" },
    hint: "Listen for the word I used to start a conversation.",
    explain: "こんにちは (konnichiwa) means hello. Say it with me!",
    fromDoc: true,
  },
  {
    n: 2,
    kind: "choose",
    place: "The deer lawn",
    topic: { jp: "お辞儀", romaji: "ojigi", english: "a bow" },
    story: "Welcome to Nara Park! People here bow, お辞儀 (ojigi), to greet, to say thanks and to say sorry.",
    clue: "to greet, to say thanks and to say sorry",
    prompt: "What does a bow usually show in Japan?",
    options: ["Respect for the other person", "That you're in a hurry", "That you disagree", "That you're lost"],
    correct: 0,
    hint: "Think about when people bow: hello, thank you and sorry.",
    explain: "A bow shows respect. People bow to greet, to thank and to apologize.",
    fromDoc: false,
    source: "ojigi",
  },
  {
    n: 3,
    kind: "choose",
    place: "A paper shop",
    topic: { jp: "折り紙", romaji: "origami", english: "folding paper" },
    story: "This shop sells paper! 折り紙 (origami) joins two words: ori, to fold, and kami, paper.",
    clue: "ori, to fold, and kami, paper",
    prompt: "What does \"origami\" mean?",
    options: ["Folding paper", "Paper money", "Flying bird", "Paper lantern"],
    correct: 0,
    hint: "Ori means to fold. Kami means paper.",
    explain: "Origami means folding paper: ori (fold) plus kami (paper).",
    fromDoc: false,
    source: "origamiWord",
  },
  {
    n: 4,
    kind: "choose",
    place: "The sakura grove",
    topic: { jp: "桜", romaji: "sakura", english: "cherry blossom" },
    story: "Every spring, pink cherry blossoms called sakura bloom across Japan. Their petals dance in the wind, but they don't stay for long.",
    clue: "they don't stay for long",
    prompt: "What do cherry blossoms symbolize in Japanese culture?",
    options: [
      "The beauty and fleeting nature of life",
      "Wealth and power",
      "Strength in battle",
      "The beginning of winter",
    ],
    correct: 0,
    hint: "Remember what I said: the petals don't stay for long.",
    explain: "Sakura bloom for only about a week, so they stand for beauty that doesn't last.",
    fromDoc: true,
    source: "sakura",
  },
  {
    n: 5,
    kind: "choose",
    place: "A kimono shop",
    topic: { jp: "着物", romaji: "kimono", english: "a thing to wear" },
    story: "One famous garment is the kimono. People wear kimonos for celebrations and ceremonies.",
    clue: "One famous garment is the kimono",
    prompt: "What is a kimono?",
    options: ["A traditional Japanese garment", "A musical instrument", "A type of house", "A traditional dessert"],
    correct: 0,
    hint: "I called it a famous garment.",
    explain: "A kimono is a traditional garment. The word means a thing to wear: ki (wear) plus mono (thing).",
    fromDoc: true,
    source: "kimono",
  },
  {
    n: 6,
    kind: "choose",
    place: "A tea house",
    topic: { jp: "茶道", romaji: "sadō", english: "tea ceremony" },
    story: "At this tea house, the host prepares tea for the guests, paying attention to every little detail.",
    clue: "paying attention to every little detail",
    prompt: "What is an important part of a Japanese tea ceremony?",
    options: [
      "Drinking tea as fast as you can",
      "Mindfulness and hospitality",
      "Making the most tea",
      "Celebrating only New Year",
    ],
    correct: 1,
    hint: "The host pays attention to every little detail.",
    explain: "The tea ceremony is about hospitality and calm attention to detail.",
    fromDoc: true,
    source: "teaCeremony",
  },
  {
    n: 7,
    kind: "choose",
    place: "A shrine",
    topic: { jp: "神社", romaji: "jinja", english: "shrine" },
    story: "Shrines are called 神社 (jinja). From Mt. Fuji's shrines, pilgrims have set off to climb it for centuries, and artists paint it again and again.",
    clue: "pilgrims have set off to climb it for centuries, and artists paint it again and again",
    prompt: "Why is Mt. Fuji special in Japan?",
    options: [
      "It's sacred and inspires artists",
      "It's Japan's biggest city",
      "It's where origami began",
      "It only appears in winter",
    ],
    correct: 0,
    hint: "Think about who climbs it and who paints it.",
    explain: "Mt. Fuji is a sacred place for pilgrims and a favorite subject for artists.",
    fromDoc: false,
    source: "fuji",
  },
  {
    n: 8,
    kind: "match",
    place: "A bench by the pond",
    topic: { jp: "復習", romaji: "fukushū", english: "review" },
    story: "Let's rest here and look back at our walk. Anything you missed comes back here.",
    clue: "Anything you missed comes back here",
    prompt: "Match each word to its meaning",
    pairs: [
      { word: "こんにちは", meaning: "hello" },
      { word: "お辞儀", meaning: "a bow" },
      { word: "桜", meaning: "cherry blossom" },
      { word: "着物", meaning: "a thing to wear" },
      { word: "神社", meaning: "shrine" },
    ],
    hint: "Tap a word, then tap its meaning.",
    explain: "Every pair is a word from our walk.",
    fromDoc: false,
  },
  {
    n: 9,
    kind: "word",
    place: "A print shop",
    topic: { jp: "富士山", romaji: "Fujisan", english: "Mt. Fuji" },
    story: "Look at this woodblock print! The tall mountain is 富士山 (Fujisan), Mt. Fuji, just like the one in your hands.",
    clue: "The tall mountain is 富士山 (Fujisan), Mt. Fuji",
    prompt: "Which word means Mt. Fuji?",
    options: ["ふじさん Fujisan", "さくら sakura", "かみ kami", "きもの kimono"],
    correct: 0,
    hint: "It's the name I gave the tall mountain.",
    explain: "富士山 (Fujisan) is Mt. Fuji. The other three are words from earlier on our walk.",
    fromDoc: false,
    source: "fuji",
  },
  {
    n: 10,
    kind: "speak",
    place: "Back at the park gate",
    topic: { jp: "ありがとう", romaji: "arigatō", english: "thank you" },
    story: "You did it! Before we say goodbye, let's say ありがとうございます to thank each other.",
    clue: "let's say ありがとうございます",
    prompt: "How do you say \"thank you\" politely in Japanese?",
    answer: { jp: "ありがとうございます", romaji: "arigatō gozaimasu" },
    hint: "It's the long phrase I used before saying goodbye.",
    explain: "ありがとうございます (arigatō gozaimasu) is a polite thank you.",
    fromDoc: true,
  },
];

export const exerciseLabels: Record<ExerciseKind, string> = {
  speak: "Say it out loud",
  choose: "Pick the answer",
  word: "Pick the word",
  match: "Match the pairs",
};

/* ---------- Slides, in deck order ---------- */
// Slides keep to a heading, one picture and a few words. The talk lives in the notes,
// and each slide's `seconds` budget keeps the whole pitch under four minutes.

export const title = {
  headline: config.productName,
  tagline: config.tagline,
  welcome: "Konnichiwa! Want to fold with me?",
  notes: [
    "Hand out the paper squares before you start.",
    `We're ${config.team.join(", ")}. Our installation teaches origami along with Japanese history and culture.`,
    "Origami is a hands-on way into that culture: you learn the Japanese name of what you make and the story behind it.",
  ],
};

export const meetNara = {
  heading: `Meet ${nara}`,
  shapeLabels: {
    roundedSquare: "Rounded square",
    circle: "Circle",
    roundedTriangle: "Rounded triangle",
    semicircle: "Semicircle",
  },
  profile: [
    { key: "Species", value: "Sika deer, 鹿 (shika)" },
    { key: "Home", value: "Nara Park, with 1,687 deer counted in July 2026" },
    { key: "Signature move", value: "A bow, like the deer of Nara Park" },
  ],
  notes: [
    `${nara} starts as an outline of rounded shapes, the way Duolingo draws its characters.`,
    "Hover a shape to light up every part made from it.",
    `${nara} is a sika deer from Nara Park, where the deer bow to visitors. Bowing is one of the first things you learn in Japan, so her signature move is part of the lesson.`,
  ],
};

export type JourneyIcon = "wave" | "ticket" | "choose" | "print" | "frame" | "projector" | "question" | "phone" | "bird";

export const journey = {
  heading: "Your visit, step by step",
  steps: [
    { icon: "wave", title: "Say hi to Nara", pose: "wave" },
    { icon: "ticket", title: "Free or paid", pose: "smile" },
    { icon: "choose", title: "Choose your fold", pose: "think" },
    { icon: "print", title: "Print your paper", pose: "present" },
    { icon: "frame", title: "Place your paper", pose: "smile" },
    { icon: "projector", title: "Follow the light", pose: "talk" },
    { icon: "question", title: "Answer to unlock", pose: "laugh" },
    { icon: "phone", title: "Scan for a badge", pose: "cheer" },
    { icon: "bird", title: "Keep it or hang it", pose: "love" },
  ] satisfies { icon: JourneyIcon; title: string; pose: Pose }[],
  notes: [
    "Press once per step. Nara walks the path with you.",
    "Nara welcomes visitors. It's free at events, and airports may charge.",
    "Visitors choose what to fold, and the station dispenses their paper and shows where it goes.",
    "A projector draws each fold on the paper, and our proposed camera checks it and helps them adjust.",
    "Questions unlock each fold. At the end they scan for a badge, then keep or hang their origami.",
  ],
};

export type OrigamiModel = "sakura" | "fuji" | "crane" | "koi" | "kabuto" | "duo";

export type FoldOption = {
  model: OrigamiModel;
  name: string;
  jp: string;
  romaji: string;
  meaning: string;
  source?: SourceKey;
  locked?: boolean;
};

export const options = {
  heading: "Choose what to fold",
  levels: [
    {
      name: "Easy",
      rank: 1,
      models: [
        { model: "sakura", name: "Sakura", jp: "桜", romaji: "sakura", meaning: "Beauty that doesn't last", source: "sakura" },
        { model: "fuji", name: "Mt. Fuji", jp: "富士山", romaji: "Fujisan", meaning: "A sacred mountain", source: "fuji" },
      ],
    },
    {
      name: "Medium",
      rank: 2,
      models: [
        { model: "crane", name: "Crane", jp: "鶴", romaji: "tsuru", meaning: "A wish for long life", source: "senbazuru" },
        { model: "koi", name: "Koi fish", jp: "鯉", romaji: "koi", meaning: "Strength and perseverance", source: "childrensDay" },
      ],
    },
    {
      name: "Hard",
      rank: 3,
      models: [
        { model: "kabuto", name: "Samurai helmet", jp: "兜", romaji: "kabuto", meaning: "Bravery, on Children's Day", source: "childrensDay" },
        { model: "duo", name: "Duo", jp: "", romaji: "", meaning: "A special bonus fold", locked: true },
      ],
    },
  ] satisfies { name: string; rank: number; models: FoldOption[] }[],
  notes: [
    "Click a card to show what it stands for.",
    "There are three levels, from sakura and Mt. Fuji up to a samurai helmet and a special Duo fold. Each model has its own questions, and our example is Mt. Fuji.",
  ],
};

export const places = {
  heading: "Where it pops up",
  kiosk: {
    name: "Airport kiosk",
    detail: "One visitor at a time",
    sideJp: "折って 知って つながろう",
    photoAlt: "Render of the kiosk in an airport: a wooden cabinet with a touchscreen, an overhead camera and projector, and a folding ledge",
  },
  tent: {
    name: "Event tent",
    detail: "Many stations and a shared display",
    signJp: "折って つながろう",
    photoAlt: "Render of the event tent: a white folded-paper dome with folding stations inside and paper cranes hanging from the roof",
  },
  notes: [
    "Press once and both drawings flip over to our renders.",
    "Our concept comes in two versions: a compact kiosk for airports or malls, where one person folds at a time,",
    "and a larger tent-style pop-up for events, with several folding stations and a shared display where visitors hang their finished origami.",
  ],
};

export const miniBooth = {
  heading: "Our mini booth",
  line: "A desk-size version we built.",
  invite: "Come try it after the pitch.",
  badge: "Here today",
  photoAlt: "Photo of the team's mini booth",
  notes: [
    "Point to the mini booth on the table and show what it does.",
    "We built a desk-size version of the booth, and it's right here. Come try it after the pitch.",
  ],
};

export const lessonOverview = {
  heading: "The 10-question lesson",
  notes: [
    "Between folds, visitors get short lessons about Japanese history and culture tied to what they're making, each followed by a question.",
    "Three right answers unlock each fold, and question 10 comes once Mt. Fuji stands.",
  ],
};

/** The questions shown live on "Try the lesson", one per build step. */
export const demoQuestions = [3, 6, 9];

export const tryLesson = {
  heading: "Try the lesson",
  checkLabel: "Check",
  continueLabel: "Continue",
  retryLabel: "Try again",
  finishLabel: "Finish Mt. Fuji",
  speakLabel: "Everyone said it",
  revealLabel: "Show the answer",
  correctTitle: "Nice work!",
  wrongTitle: "Almost!",
  unlockedLine: (fold: number) => `Fold ${fold} is lit up on your paper.`,
  towardLine: (left: number, fold: number) => `${left} more to light up fold ${fold}.`,
  finishedLine: "Your Mt. Fuji is finished.",
  lockedLabel: "Unlocks with a right answer",
  notes: [
    "Between folds, Nara tells a short story and asks about it. A right answer unlocks the next fold, and the room folds along.",
    "Question 3: answer it, then everyone folds their square in half into a triangle.",
    "Question 6: pick a wrong answer first. Nara lights up the clue and you try again. Then fold the left corner over.",
    "Question 9: answer, open your mountain so it stands, and click 'Finish Mt. Fuji'.",
  ],
};

export const celebration = {
  heading: "You folded Mt. Fuji!",
  jp: "富士山",
  romaji: "Fujisan",
  stats: [
    { label: "Total XP", value: "100", tone: "bee" },
    { label: "Questions", value: "10 of 10", tone: "accent" },
  ],
  keepLabel: "Take it home",
  keptLine: "It's yours to keep.",
  hangLabel: "Hang it in the tent",
  hungLine: "Your Mt. Fuji joins the others.",
  tentAlt: "Inside the event tent, with origami hanging from the roof",
  notes: [
    "After the last fold, visitors see a completion message. The visit takes ten minutes or less, with no teacher.",
    "Press once to hang it. They can add it to the tent's shared display or take it home, along with its Japanese name and the culture behind it.",
  ],
};

export type Reaction = { pose: Pose; moment: string; fix?: string };

export const reactions = {
  heading: `How ${nara} reacts`,
  lineup: [
    { pose: "wave", moment: "Hello" },
    { pose: "present", moment: "New question" },
    { pose: "think", moment: "First miss", fix: "Points to the clue" },
    { pose: "love", moment: "Second miss", fix: "Explains, then reviews it" },
    { pose: "laugh", moment: "Right answer" },
    { pose: "cheer", moment: "Fold unlocked" },
    { pose: "bow", moment: "The end" },
  ] satisfies Reaction[],
  rule: "No hearts to lose and no lockout.",
  notes: [
    `${nara} has an expression for every moment. A first miss gets a hint, a second gets the answer, and either way visitors try again.`,
  ],
};

export const method = {
  heading: "The Duolingo Method in paper",
  panels: {
    biteSized: { title: "Bite-sized lessons", steps: ["Story", "Question", "Fold"] },
    feedback: { title: "Immediate feedback", right: "Nice work!", wrong: "Almost! Here's a hint." },
    repetition: { title: "Repetition", words: ["こんにちは", "桜", "着物", "神社"], label: "Review round" },
    progress: { title: "Visible progress" },
  },
  naraLine: "I'll guide you and cheer you on, start to finish!",
  audience: "For Gen Z and Gen Alpha",
  audienceLine: "Short, visual steps, and something real taking shape.",
  notes: [
    "Our installation uses the Duolingo Method: bite-sized lessons, immediate feedback, repetition and visible progress.",
    "Nara guides and encourages visitors the whole way. For Gen Z and Gen Alpha, short visual steps meet an activity where something takes shape as they learn.",
  ],
};

export const closing = {
  jp: "ありがとうございます",
  romaji: "Arigatō gozaimasu",
  line: "Thank you for folding with us.",
  notes: ["Bow with Nara, say arigatō gozaimasu together, and open for questions."],
};

export const sourcesSlide = {
  heading: "Sources",
  notes: ["Every number and cultural fact in the deck is listed here. Not part of the timed pitch."],
};
