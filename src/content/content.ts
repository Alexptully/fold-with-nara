// Every word, number and note in the deck. Slide components read from here.
// Questions marked fromDoc: true are the team's wording from the shared doc;
// the rest are drafts for Sophia to review (see brief.md).

import type { Pose } from "@/components/art/nara/geometry";
import { config } from "./config";
import type { SourceKey } from "./sources";

const nara = config.characterName;

/* ---------- The lesson: ten folds and ten questions ---------- */

export type Technique = "valley" | "collapse" | "kite" | "petal" | "reverse" | "open";
export type Guidance = "show" | "mark" | "try";

export type Fold = {
  n: number;
  instruction: string;
  technique: Technique;
  guidance: Guidance;
};

// The traditional crane, split into ten steps. Kite and reverse folds repeat,
// so the projector can give less help each time they come back.
export const folds: Fold[] = [
  { n: 1, instruction: "Fold corner to corner, both ways, then unfold", technique: "valley", guidance: "show" },
  { n: 2, instruction: "Turn over, fold edge to edge both ways, then unfold", technique: "valley", guidance: "mark" },
  { n: 3, instruction: "Collapse the creases into a square base", technique: "collapse", guidance: "show" },
  { n: 4, instruction: "Fold the lower edges to the center line", technique: "kite", guidance: "show" },
  { n: 5, instruction: "Fold the top down, then unfold the last three folds", technique: "valley", guidance: "mark" },
  { n: 6, instruction: "Petal fold: lift the bottom corner up along the creases", technique: "petal", guidance: "show" },
  { n: 7, instruction: "Turn over and repeat the kite and petal folds", technique: "kite", guidance: "mark" },
  { n: 8, instruction: "Narrow both legs to the center, front and back", technique: "kite", guidance: "try" },
  { n: 9, instruction: "Inside reverse fold the neck and tail up", technique: "reverse", guidance: "show" },
  { n: 10, instruction: "Reverse fold the head and open the wings", technique: "reverse", guidance: "try" },
];

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

export const questions: Question[] = [
  {
    n: 1,
    kind: "speak",
    place: "The park gate",
    topic: { jp: "こんにちは", romaji: "konnichiwa", english: "hello" },
    story:
      "As you explore Japan with me, you'll meet new people along the way! In Japan, greeting someone politely is an important part of everyday life. Saying こんにちは is a great way to start a conversation!",
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
    story:
      "Welcome to my home, Nara Park! Here even the deer bow. A bow is called お辞儀 (ojigi), and people bow to greet each other, to say thanks and to say sorry.",
    clue: "people bow to greet each other, to say thanks and to say sorry",
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
    story:
      "This little shop sells paper! The sheet in your hands has a name too. 折り紙 (origami) joins two words: ori, to fold, and kami, paper.",
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
    story:
      "Come with me! I want to show you one of Japan's most beautiful sights. Every spring, delicate pink cherry blossoms, called sakura, bloom across Japan. Their petals dance in the wind, but they don't stay for long. That's part of what makes them so special!",
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
    place: "A tea house",
    topic: { jp: "茶道", romaji: "sadō", english: "tea ceremony" },
    story:
      "As we continue our journey, I'm taking you to a traditional Japanese tea house! Here, the host carefully prepares tea for their guests, paying attention to every little detail. It's a special way to welcome others and enjoy a peaceful moment together.",
    clue: "paying attention to every little detail",
    prompt: "What is an important part of a traditional Japanese tea ceremony?",
    options: [
      "Drinking tea as quickly as possible",
      "Practicing mindfulness and hospitality",
      "Competing to make the most tea",
      "Celebrating only the New Year",
    ],
    correct: 1,
    hint: "The host pays attention to every little detail to welcome the guests.",
    explain: "The tea ceremony is about hospitality and calm attention to detail.",
    fromDoc: true,
    source: "teaCeremony",
  },
  {
    n: 6,
    kind: "choose",
    place: "A kimono shop",
    topic: { jp: "着物", romaji: "kimono", english: "a thing to wear" },
    story:
      "Japan has a rich clothing tradition! One famous garment is the kimono, known for its elegant shape and beautiful patterns. People wear kimonos for celebrations, ceremonies, and other special occasions.",
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
    n: 7,
    kind: "word",
    place: "The pond",
    topic: { jp: "鶴", romaji: "tsuru", english: "crane" },
    story: "Look at what's taking shape in your hands! This bird is a 鶴 (tsuru), a crane.",
    clue: "This bird is a 鶴 (tsuru), a crane",
    prompt: "Which word means crane?",
    options: ["つる tsuru", "さくら sakura", "かみ kami", "きもの kimono"],
    correct: 0,
    hint: "It's the word I just said with the bird.",
    explain: "鶴 (tsuru) means crane. The other three are words from earlier on our walk.",
    fromDoc: false,
  },
  {
    n: 8,
    kind: "choose",
    place: "A shrine",
    topic: { jp: "千羽鶴", romaji: "senbazuru", english: "a thousand cranes" },
    story:
      "At shrines you'll often see strings of paper cranes. People say cranes live a thousand years, so friends fold 千羽鶴 (senbazuru), a thousand cranes, for someone they care about.",
    clue: "People say cranes live a thousand years",
    prompt: "Why do people fold a thousand paper cranes?",
    options: [
      "To wish someone a long, healthy life",
      "To decorate for winter",
      "To win a folding contest",
      "To count the days of spring",
    ],
    correct: 0,
    hint: "People say cranes live a thousand years.",
    explain: "The crane stands for long life, so a thousand cranes is a wish for health and recovery.",
    fromDoc: false,
    source: "senbazuru",
  },
  {
    n: 9,
    kind: "match",
    place: "A bench by the pond",
    topic: { jp: "復習", romaji: "fukushū", english: "review" },
    story:
      "Let's rest for a moment and look back at our walk. Anything you missed earlier comes back here.",
    clue: "Anything you missed earlier comes back here",
    prompt: "Match each word to its meaning",
    pairs: [
      { word: "こんにちは", meaning: "hello" },
      { word: "お辞儀", meaning: "a bow" },
      { word: "桜", meaning: "cherry blossom" },
      { word: "着物", meaning: "a thing to wear" },
      { word: "鶴", meaning: "crane" },
    ],
    hint: "Tap a word, then tap its meaning.",
    explain: "Every pair is a word from our walk.",
    fromDoc: false,
  },
  {
    n: 10,
    kind: "speak",
    place: "Back at the park gate",
    topic: { jp: "ありがとう", romaji: "arigatō", english: "thank you" },
    story:
      "You did it! You've completed your cultural journey with me and learned more about the beauty of Japanese culture along the way. Thank you for joining me on this adventure! Before we say goodbye, let's say ありがとうございます to express our gratitude. I hope you had fun learning with me!",
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
    `We're ${config.team.join(", ")}. Our Prompt 2 pitch is ${nara}, a sika deer who teaches a ten-question lesson you fold with your hands.`,
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
    `${nara} starts as an outline of rounded shapes, the way Duolingo draws its characters: a rounded-square head, oval eyes, leaf ears and capsule antlers.`,
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
    "Nara welcomes you. It's free at events and campuses, and airports may charge.",
    "You choose a model and a level, the station prints paper for it, and you set it in the frame.",
    "The projector outlines each fold on your paper, and each fold comes with a culture question you answer to move on.",
    "At the end you scan for a Duolingo badge, then keep your origami or hang it in the installation.",
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
    "Three levels. Easy is sakura and Mt. Fuji, medium is the crane and the koi fish, and hard is the samurai helmet and a special Duo fold.",
    "Each model brings its own culture questions. Click a card to see what it stands for. Our example lesson is the crane.",
  ],
};

export const places = {
  heading: "Where it pops up",
  kiosk: {
    name: "Airport kiosk",
    detail: "One visitor at a time",
    callouts: {
      head: "Camera and projector",
      screen: "Touchscreen",
      workspace: "Folding area",
      dispenser: "Paper dispenser",
      storage: "Storage",
    },
    height: "About 7 ft",
    edge: "2.5 ft",
    sideJp: "折って 知って つながろう",
    sideEn: "A small fold, a bigger world",
  },
  tent: {
    name: "Event tent",
    detail: "Stations around the wall, origami overhead",
    signJp: "折って つながろう",
    signEn: "A small fold, a bigger world",
  },
  notes: [
    "The kiosk fits airports and malls, with an overhead camera and projector, a touchscreen and a paper dispenser.",
    `The tent is for events: stations line the wall, and finished origami hangs from the canopy. Inside the lesson, the setting is Nara Park, one stop per question on ${nara}'s walk.`,
  ],
};

export const lessonOverview = {
  heading: "The 10-question lesson",
  notes: [
    "This is the crane lesson. Each question is a stop in Nara Park, and each right answer unlocks the next fold.",
    "Kite folds come back with less help each time, and question 9 reviews what you missed.",
  ],
};

/** The questions shown live on "Try the lesson", one per build step. */
export const demoQuestions = [1, 5, 10];

export const tryLesson = {
  heading: "Try the lesson",
  checkLabel: "Check",
  continueLabel: "Continue",
  retryLabel: "Try again",
  finishLabel: "Finish the crane",
  speakLabel: "Everyone said it",
  revealLabel: "Show the answer",
  correctTitle: "Nice work!",
  wrongTitle: "Almost!",
  unlockedLine: (fold: number) => `Fold ${fold} is lit up on your paper.`,
  notes: [
    "Question 1: have the whole room say konnichiwa, then click 'Everyone said it'.",
    "Question 5: pick a wrong answer first. Nara thinks it over and lights up the clue in her story. Then pick the right one.",
    "Question 10: say arigatō gozaimasu together and click 'Finish the crane'.",
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
    `${nara} has an expression for every moment, so the encouragement shows on her face.`,
    "A first miss gets a hint pointing back to the story. A second miss gets the answer, which returns in the review. Wrong folds work the same way: the projector marks the corner to fix.",
  ],
};

export const method = {
  heading: "The Duolingo Method in paper",
  rows: [
    { key: "Learn by doing", value: "Each right answer unlocks a real fold" },
    { key: "Learn in a personalized way", value: "Pick your model and your level" },
    { key: "Focus on what matters", value: "Hello, thank you and a bow" },
    { key: "Stay motivated", value: "A crane takes shape, then a badge" },
    { key: "Feel the delight", value: "You leave holding what you made" },
  ],
  research: "A question between folds is retrieval practice, which beats rereading for long-term memory.",
  notes: [
    "Every principle of the Duolingo Method has a physical version here.",
    "The questions between folds are retrieval practice: Roediger and Karpicke found testing beats restudying. The whole visit takes about ten minutes, by our estimate.",
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
