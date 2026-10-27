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
  /** The question whose right answer unlocks this fold. */
  unlockedBy: number;
  instruction: string;
  guidance: Guidance;
};

// The origami Mt. Fuji from the team's fold sheet. The sheet comes printed with its
// dashed guide lines, so the visitor makes three folds, each shown as a projected demo.
// Saying hello (question 1) unlocks the first fold, so everyone starts folding right
// away; after that, every four right answers unlock the next fold. Question 10 comes
// once the mountain stands, just before the completion message.
export const folds: Fold[] = [
  { n: 1, unlockedBy: 1, instruction: "Fold in half into a triangle, snow outside", guidance: "show" },
  { n: 2, unlockedBy: 5, instruction: "Fold the left corner over to the right", guidance: "show" },
  { n: 3, unlockedBy: 9, instruction: "Open it halfway so your mountain stands", guidance: "show" },
];

/** The fold a question unlocks, or null if it doesn't unlock one. */
export const foldUnlockedBy = (n: number): Fold | null => folds.find((fold) => fold.unlockedBy === n) ?? null;
/** How many folds are already on the paper when a question is asked. */
export const foldsDoneBefore = (n: number) => folds.filter((fold) => fold.unlockedBy < n).length;
/** The questions that unlock each fold, in order. */
export const unlockingQuestions = folds.map((fold) => fold.unlockedBy);

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
    n: 4,
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
    n: 5,
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

/** Who presents each part of the script. "Everyone" speaks together. */
export const everyone = "Everyone";
const [sam, alex, tsion, sophia, ledger] = config.team;

/**
 * One line of the script: words to say (by the slide's speaker unless `who` says
 * otherwise), or a cue for the presenter, like a click or something to point at.
 */
export type Note = { say: string; who?: string } | { cue: string };
const say = (text: string, who?: string): Note => ({ say: text, who });
const cue = (text: string): Note => ({ cue: text });

export const title = {
  headline: config.productName,
  tagline: config.tagline,
  sheetLabel: "The printed paper square for an origami Mt. Fuji, with a green fold line",
  speaker: everyone,
  notes: [
    cue("Hand out the paper squares before you start. Each person says their own name."),
    ...config.team.map((name, i) => say(i === config.team.length - 1 ? `And I'm ${name}.` : `Hi, I'm ${name}.`, name)),
    say(`And this is ${config.productName}!`, everyone),
  ],
};

export const whyOrigami = {
  heading: "Why origami",
  doing: "A Japanese art you learn by doing",
  keepsake: "A reminder you take home",
  // Norton, Mochon and Ariely (2012), experiment 1B: builders bid 23 cents on their own origami, strangers 5 cents.
  study: "In one study, people valued origami they folded almost 5 times more than strangers did.",
  shelfLabel: "A shelf at home with the folded Mt. Fuji standing next to two books",
  speaker: sam,
  notes: [
    say("Our pop-up teaches Japanese culture through origami. We chose origami because it's a Japanese art you learn with your hands."),
    cue("Press once to send Mt. Fuji home."),
    say("It also gives everyone something to take home. People value origami they folded almost five times more than strangers do, so it becomes a reminder of the event."),
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
  speaker: sophia,
  notes: [
    say("Every kiosk has a guide, and she starts as an outline."),
    cue("Press once to reveal her."),
    say(`Meet ${nara}! She's built from Duolingo's shapes: rounded squares, circles, rounded triangles and semicircles.`),
    cue("Hover a shape to light up its parts. Press once for her profile."),
    say(`${nara} is a sika deer from Nara Park, where the deer bow to visitors. Bowing is her signature move, and it's part of the lesson.`),
  ],
};

export type JourneyIcon = "wave" | "choose" | "print" | "frame" | "projector" | "question" | "phone" | "bird";

export const journey = {
  heading: "Your visit, step by step",
  steps: [
    { icon: "wave", title: "Say hi to Nara", pose: "wave" },
    { icon: "choose", title: "Choose your fold", pose: "think" },
    { icon: "print", title: "Print your paper", pose: "present" },
    { icon: "frame", title: "Place your paper", pose: "smile" },
    { icon: "projector", title: "Follow the light", pose: "talk" },
    { icon: "question", title: "Answer to unlock", pose: "laugh" },
    { icon: "phone", title: "Scan for a badge", pose: "cheer" },
    { icon: "bird", title: "Keep it or hang it", pose: "love" },
  ] satisfies { icon: JourneyIcon; title: string; pose: Pose }[],
  speaker: tsion,
  notes: [
    cue("Press once per step. Nara walks the path with you."),
    say("Here's a visit. You say hi to Nara, pick what to fold, and the kiosk prints paper made for that model."),
    say("You place it in the frame, and the projector shows each fold on your paper. A right answer unlocks each fold."),
    say("At the end, you scan for a badge on your Duolingo account and keep your origami or hang it in the tent."),
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
  speaker: tsion,
  notes: [
    cue("Click a card to show what the model stands for."),
    say("There are three levels. Sakura and Mt. Fuji are easy, the crane and koi are medium, and the samurai helmet and a special Duo fold are hard. Today we're folding Mt. Fuji."),
  ],
};

// The pop-up lives at events only, free for everyone: a tent with folding kiosks inside.
// The slide is one camera move: the tent, then inside it, then one kiosk.
export const places = {
  heading: "Where it pops up",
  steps: [
    { name: "Event tent", detail: "A pop-up at events, free for everyone" },
    { name: "Inside the tent", detail: "Kiosks line the walls, and finished origami hangs overhead" },
    { name: "Kiosk", detail: "One visitor at each" },
  ],
  tent: { signJp: "折って つながろう" },
  kiosk: {
    parts: {
      head: "Camera and projector",
      screen: "Touchscreen with Nara",
      workspace: "Folding ledge",
      dispenser: "Paper printer",
      storage: "Storage",
    },
  },
  speaker: alex,
  notes: [
    say(`Here's what we built. ${config.productName} is a pop-up tent at events, and it's free for everyone.`),
    cue("Press once to fly inside."),
    say("Inside, kiosks line the walls, and finished origami hangs from the ceiling."),
    cue("Press once to zoom in on a kiosk."),
    say("Each visitor gets a kiosk: a touchscreen with Nara, a printer for the paper, and a camera and projector over the folding ledge."),
  ],
};

export const miniBooth = {
  heading: "Our mini booth",
  line: "A desk-size version we built.",
  invite: "Come try it after the pitch.",
  badge: "Here today",
  photoAlt: "Photo of the team's mini booth",
  speaker: alex,
  notes: [
    cue("Point to the mini booth on the table."),
    say("We also built a desk-size kiosk, and it's right here. Come try it after the pitch."),
  ],
};

export const lessonOverview = {
  heading: "The 10-question lesson",
  speaker: ledger,
  notes: [
    say("Here's our example lesson: Mt. Fuji, with ten questions on Japanese culture at ten stops around Nara Park."),
    cue("Press once."),
    say("Saying hello unlocks your first fold right away, and then every four right answers unlock the next one."),
  ],
};

/** The questions shown live on "Try the lesson", one per build step: the ones that unlock each fold. */
export const demoQuestions = unlockingQuestions;

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
  replayLabel: "Replay fold",
  speaker: ledger,
  notes: [
    say("Grab your paper and fold with us! First, let's all say hello in Japanese."),
    cue("Question 1: everyone says konnichiwa together, then click Everyone said it."),
    say("Konnichiwa! Fold 1: fold your square in half into a triangle, with the snow on the outside."),
    cue("Press once. Question 5: pick a wrong answer first, then Try again."),
    say("Almost! Nara lights up the clue so you can try again. Ori means fold and kami means paper, so origami means folding paper. Fold 2: fold the left corner over to the right."),
    cue("Press once. Question 9."),
    say("Fujisan means Mt. Fuji. Fold 3: open it halfway so your mountain stands."),
    cue("Click Finish Mt. Fuji."),
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
  speaker: ledger,
  notes: [
    say("You folded Mt. Fuji! The kiosk shows your XP and your score, and you choose what happens next."),
    cue("Press once to hang it."),
    say("You can take it home or hang it in the tent with everyone else's. We estimate a visit takes ten minutes or less, with no teacher needed."),
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
  speaker: sophia,
  notes: [
    say(`${nara} has an expression for every moment.`),
    cue("Press once for mistakes."),
    say("If you miss, she points to the clue. Miss again, and she explains the answer and brings it back later. There are no hearts to lose and no lockout."),
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
  speaker: alex,
  notes: [
    say("This is the Duolingo Method in paper. Lessons are bite-sized: a story, a question, then a fold."),
    say("Nara gives feedback right away, words come back in a review round, and you watch your progress take shape in your hands."),
    say("It's built for Gen Z and Gen Alpha."),
  ],
};

export const closing = {
  jp: "ありがとうございます",
  romaji: "Arigatō gozaimasu",
  line: "Thank you for folding with us.",
  speaker: everyone,
  notes: [cue("Everyone bows with Nara."), say("Arigatō gozaimasu!", everyone), cue("Open for questions.")],
};

export const sourcesSlide = {
  heading: "Sources",
  notes: [cue("Every number and cultural fact in the deck is listed here. Not part of the timed pitch.")],
};

/* ---------- The demo kiosk: the iPad screen and projector that follow the deck ---------- */
// The mini booth's iPad shows what a visitor would see on the kiosk's touchscreen, and
// its projector draws the folds on real paper. Both follow the deck as it's presented:
// each slide picks a kiosk screen in slides.ts (`kiosk`), and the lesson mirrors every
// tap. Nara stays off the kiosk until "Meet Nara", the same as on the slides.

export type KioskGuideKey = "meet" | "intro" | "hello" | "print" | "place" | "light" | "method" | "badge" | "thanks";
export type KioskPicture = "start" | "printer" | "frame" | "light" | "badge";
export type KioskGuide = { pose: Pose; line: string; picture?: KioskPicture; jp?: string; romaji?: string };

export const kioskScreen = {
  startLabel: "Tap to start",
  guide: {
    meet: { pose: "smile", line: "Konnichiwa!" },
    intro: { pose: "talk", line: `I'm ${nara}, a sika deer from Nara Park. Let's fold something together!` },
    hello: { pose: "wave", line: `Konnichiwa! I'm ${nara}. Tap start when you're ready to fold.`, picture: "start" },
    print: { pose: "present", line: "Your paper is printing. Take it from the tray under the ledge.", picture: "printer" },
    place: { pose: "smile", line: "Lay your paper inside the green corners on the ledge.", picture: "frame" },
    light: { pose: "talk", line: "Watch your paper. My light draws each fold right on it.", picture: "light" },
    method: { pose: "talk", line: method.naraLine },
    badge: { pose: "cheer", line: "Scan the code with your phone to add a Mt. Fuji badge to your Duolingo profile.", picture: "badge" },
    thanks: { pose: "bow", line: closing.line, jp: closing.jp, romaji: closing.romaji },
  } satisfies Record<KioskGuideKey, KioskGuide>,
  /** Where the badge code points in the mockup. */
  badgeLink: "https://www.duolingo.com/",
  badgeLabel: "Mt. Fuji badge",
  pathLine: "Ten stops around Nara Park. Saying hello lights up your first fold!",
  foldsLabel: "Your folds",
  reactionsLabel: "When you miss",
  waitingTitle: "Waiting for the deck",
  waitingLine: "Start the deck on the laptop with npm run present, then keep this page open.",
};

export const kioskProjector = {
  adjustHint: "Tap anywhere to line up the light with your paper.",
  fitTitle: "Line up the light",
  fitLine: "Lay a sheet of the kiosk paper on the ledge, then move and size the white square until it sits on the sheet's edges.",
  move: { up: "Move up", down: "Move down", left: "Move left", right: "Move right" },
  smaller: "Smaller",
  bigger: "Bigger",
  turnLeft: "Turn left",
  turnRight: "Turn right",
  mirror: "Mirror",
  reset: "Reset",
  fullScreen: "Full screen",
  done: "Done",
  keys: "Keys: arrows move (hold Shift for big steps), minus and plus size, [ and ] turn, C closes.",
};

export const kioskSetup = {
  heading: "Kiosk setup",
  intro: "The iPad and projector in our mini booth follow the deck. Run the deck on this laptop, then open these pages on them. Both need the same Wi-Fi as this laptop.",
  pages: [
    { path: "/kiosk/screen/", name: "iPad screen", line: "What a visitor sees on the kiosk's touchscreen. Open it on the iPad." },
    {
      path: "/kiosk/projector/",
      name: "Projector",
      line: "Green fold lines on black. Open it on whatever feeds the projector (the iPad in a second window, a laptop or a phone), then tap it to line it up with a sheet of paper.",
    },
    {
      path: "/kiosk/projector-right/",
      name: "Projector, right half",
      line: "The same light, kept in the right half of the picture for a projector whose left half the booth blocks. Open it on the phone that feeds the projector.",
    },
    {
      path: "/kiosk/combined/",
      name: "iPad and projector together",
      line: "For a projector that copies the iPad screen. The kiosk screen sits on top and the fold lines below, so aim the projector's black half at the paper.",
    },
  ],
  statusTitle: "Connected now",
  deckLabel: "Deck",
  screenLabel: "iPad screens",
  projectorLabel: "Projectors",
  relayOff: "The kiosk link isn't running. Start the deck with npm run present (or npm run dev to rehearse), then reload this page.",
  noNetwork: "This laptop isn't on a Wi-Fi network yet. Join the same network as the iPad, then reload.",
  notStarted: "Not started yet",
  openHere: "Open it on this computer",
  tips: [
    "Event Wi-Fi often stops devices from seeing each other. If the iPad can't connect, turn on a phone hotspot and join it with the laptop and the iPad.",
    "On a Mac, allow incoming connections for Node if macOS asks.",
    "On the iPad, tap the screen once so it stays awake and goes full screen.",
  ],
};

/**
 * The standalone demo kiosk (/demo/): the whole visit on one screen, worked by taps
 * instead of the deck, for the team's portfolios. It reuses the kiosk's own screens and words.
 */
export const demoKiosk = {
  title: `${config.productName}: try the kiosk`,
  nextLabel: "Next",
  restartLabel: "Start over",
  chooseNote: "Today we're folding Mt. Fuji.",
  foldLabel: "Fold Mt. Fuji",
  lessonLabel: "Start the lesson",
  againLabel: "Fold it again",
};
