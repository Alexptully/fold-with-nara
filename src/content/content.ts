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

export const title = {
  headline: config.productName,
  tagline: config.tagline,
  welcome: "Konnichiwa! I'm Nara, a sika deer from Nara Park. Want to fold with me?",
  notes: [
    "Before we start: everyone should have one square of paper. We'll fold it together later.",
    `We're ${config.team.join(", ")}. For Prompt 2 we designed a new world character, ${nara} the sika deer, and a 10-question lesson you fold with your hands at an origami pop-up.`,
    "This is the welcome screen visitors see at the station: Nara waves hello before anything else happens.",
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
    { key: "Home", value: "Nara Park, where 1,687 deer were counted in July 2026" },
    { key: "Teaches", value: "Polite Japanese and the culture behind each fold" },
    { key: "Signature move", value: "Bows at the end of every lesson, like the deer of Nara Park" },
  ],
  history: "Nara's deer have been revered as messengers of the gods for more than 1,250 years.",
  notes: [
    `This is ${nara}, a sika deer from Nara Park, where deer live alongside visitors and are protected as a natural monument.`,
    `We started from an outline built out of rounded shapes, the same way Duolingo's characters are drawn: a round head, oval eyes, leaf-shaped ears and antlers made of rounded capsules. Hover a shape to see every part of ${nara} made from it.`,
    "We picked a Nara deer because those deer famously bow to visitors, and bowing is one of the first things a visitor to Japan learns. So the character's signature move is also part of the lesson.",
    "The 1,687 figure is the Nara Deer Preservation Foundation's July 2026 count, a record high.",
  ],
};

export type Expression = { pose: Pose; when: string; line: string };

export const encouragement = {
  heading: `How ${nara} keeps you going`,
  expressions: [
    { pose: "talk", when: "Welcome", line: "Konnichiwa! Want to fold with me?" },
    { pose: "present", when: "Each question", line: "Here's your next question!" },
    { pose: "think", when: "After a miss", line: "Hmm, look back at what I said." },
    { pose: "laugh", when: "Right answer", line: "You got it!" },
    { pose: "cheer", when: "Fold unlocked", line: "+10 XP! Your next fold is lit up." },
    { pose: "love", when: "Hardest fold", line: "This one is tricky for everyone." },
    { pose: "bow", when: "The end", line: "Arigatō gozaimasu!" },
  ] satisfies Expression[],
  progress: "Ten badges, one per question, and an origami model that takes shape as you answer.",
  notes: [
    `${nara} has seven expressions, and each one belongs to a moment in the lesson.`,
    `To get someone to start something new, ${nara} waves hello and asks them to fold together, so nobody feels they need experience.`,
    `After a miss, ${nara} thinks it over with you instead of saying you're wrong. At the hardest fold, ${nara} says out loud that it's tricky for everyone, so a beginner doesn't think they're the problem.`,
    `Right answers get a laugh, an unlocked fold gets a cheer and +10 XP, and every lesson ends with ${nara}'s bow.`,
  ],
};

export const whatWeTeach = {
  heading: "What we teach and why",
  objective:
    "In under ten minutes, a beginner folds a piece of origami and learns the Japanese words and culture behind it, one question per fold.",
  wordParts: [
    { jp: "折り", romaji: "ori", english: "to fold" },
    { jp: "紙", romaji: "kami", english: "paper" },
  ],
  reasons: [
    {
      key: "Why Japanese culture",
      value: "Our team is drawn to it, and origami is a part of it a visitor can actually hold.",
    },
    {
      key: "Why it fits Duolingo",
      value: "Japanese is one of Duolingo's Top 9 language courses, and every answer here unlocks a real fold.",
    },
  ],
  notes: [
    "For our lesson, we're teaching visitors how to make origami while learning about Japanese history and culture.",
    "Our team chose this because we're interested in Japanese culture, and origami gives visitors a hands-on way to explore it. They learn the Japanese name of what they're making, along with the culture connected to it.",
    "The word itself is the first lesson: origami is ori, to fold, plus kami, paper.",
  ],
};

export type JourneyIcon = "wave" | "ticket" | "choose" | "print" | "frame" | "projector" | "question" | "phone" | "bird";

export const journey = {
  heading: "Your visit, step by step",
  steps: [
    { icon: "wave", title: "Say hi to Nara", body: "The welcome screen opens with a fun animation of Nara, our sika deer from Nara Park." },
    { icon: "ticket", title: "Free or paid", body: "Free at events and campuses. Some places, like airports, may charge." },
    { icon: "choose", title: "Choose your fold", body: "Pick what to fold at one of three levels: easy, medium or hard." },
    { icon: "print", title: "Print your paper", body: "The station prints a sheet designed for the model you chose." },
    { icon: "frame", title: "Place your paper", body: "The screen in front of you shows where it goes in the frame." },
    { icon: "projector", title: "Follow the light", body: "The projector outlines each fold right on your paper." },
    { icon: "question", title: "Answer to unlock", body: "Each fold comes with a culture question about your model. Answer it to move on." },
    { icon: "phone", title: "Scan for a badge", body: "Scan the code with your phone to add a badge to your Duolingo account." },
    { icon: "bird", title: "Keep it or hang it", body: "Take your origami home, or hang it in the installation." },
  ] satisfies { icon: JourneyIcon; title: string; body: string }[],
  notes: [
    "Here's the whole visit, in order. Press through it one step at a time.",
    "Visitors are welcomed by a fun animation of Nara, our sika deer from Nara Park.",
    "Depending on the location, the station is free or paid: free at events and campuses, possibly paid at airports.",
    "They choose what they want to fold and a difficulty level. The station prints paper designed for their model, and they place it in the frame as the screen shows.",
    "The projector outlines where to fold. With each fold, a question appears on the screen, and they have to answer it to move on. The questions are about the culture behind the model they're folding.",
    "At the end, they scan a code with their phone to get a badge on their Duolingo account, then choose to keep their origami or hang it in the installation.",
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
        { model: "fuji", name: "Mt. Fuji", jp: "富士山", romaji: "Fujisan", meaning: "A sacred mountain and an icon of Japan", source: "fuji" },
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
        { model: "kabuto", name: "Samurai helmet", jp: "兜", romaji: "kabuto", meaning: "Shown on Children's Day to inspire bravery", source: "childrensDay" },
        { model: "duo", name: "Duo", jp: "", romaji: "", meaning: "A special bonus fold", locked: true },
      ],
    },
  ] satisfies { name: string; rank: number; models: FoldOption[] }[],
  featuredNote: "The lesson in this deck is the crane. Every model gets its own ten questions about its culture.",
  notes: [
    "Visitors choose what they want to fold, at three difficulty levels.",
    "Easy is sakura and Mt. Fuji. Medium is the crane and the koi fish. Hard is the samurai helmet and a special Duo fold.",
    "Each model brings its own culture questions: the crane's questions are about long life and senbazuru, the koi's are about Children's Day, and so on.",
    "Click a card to select it, the way a visitor would on the kiosk screen.",
  ],
};

export const kiosk = {
  heading: "The airport kiosk",
  callouts: {
    head: "Camera and projector",
    screen: "Touchscreen for choosing",
    workspace: "Folding area",
    dispenser: "Paper dispenser",
    storage: "Paper and computer storage",
  },
  height: "About 7 ft",
  edge: "2.5 ft",
  sideJp: "折って 知って つながろう",
  sideEn: "A small fold, a bigger world",
  facts: [
    { key: "Where", value: "Airports, malls, museums and campuses" },
    { key: "Visitors", value: "One at a time" },
    { key: "Cost", value: "Free or paid, depending on the location" },
  ],
  notes: [
    "The first version is a compact kiosk for high-traffic places like airports and malls. One person uses it at a time.",
    "From the top: an overhead arm holds the camera and projector, a touchscreen handles choosing and shows progress, the folding area is where the light lands on your paper, the dispenser prints your sheet, and the cabinet hides paper and the computer.",
    "It's about seven feet tall on a two-and-a-half-foot square footprint, our design target.",
    "The side panel says 折って 知って つながろう: fold, learn, connect.",
  ],
};

export const tent = {
  heading: "The tent pop-up",
  signJp: "折って つながろう",
  signEn: "A small fold, a bigger world",
  facts: [
    { key: "Where", value: "Events, festivals and campus fairs" },
    { key: "Visitors", value: "Several at once, one per station" },
    { key: "Stations", value: "Each has a screen, projector, camera and paper dispenser" },
    { key: "Cranes", value: "Hang yours from the canopy, and the ceiling fills up over the day" },
  ],
  plan: {
    entrance: "Entrance",
    stations: "Folding stations",
    canopy: "Hang your origami here",
  },
  notes: [
    "The second version is a larger pop-up for events, built like a giant folded-paper dome. Several people fold at once.",
    "It doesn't invent new technology: inside, the same station repeats around the walls, each with a screen, projector, camera and paper dispenser.",
    "Visitors who choose to hang their origami add it to the canopy in the middle, so the installation grows as more people finish.",
    `Prompt 2 asks for a distinct location. The lesson's setting is Nara Park itself: each question is a stop on ${nara}'s walk, from the park gate to a tea house to a shrine.`,
  ],
};

export const mechanism = {
  heading: "How a station teaches",
  loop: [
    { key: "Show", value: "The projector outlines the next fold right on your paper." },
    { key: "Fold", value: "You make the fold with your own hands." },
    { key: "Check", value: "The camera checks the fold and gives feedback." },
    { key: "Ask", value: "A question about your model appears. Answer it to move on." },
  ],
  paperNote: "Each sheet is printed for its model, so the art only lines up when the folds are right.",
  notes: [
    "Every fold goes through the same loop.",
    "The projector above the table outlines where to fold, directly on the paper, so nobody has to look back and forth at a video.",
    "Our proposed camera system checks each fold and gives feedback so visitors can adjust.",
    "Then the screen in front of them shows a question tied to the item they're folding, and they have to answer it to move on to the next fold.",
  ],
};

export const lessonOverview = {
  heading: "The 10-question lesson",
  repeatNote: "Kite and reverse folds come back, with less help each time.",
  notes: [
    "Here's the whole crane lesson, our medium-level example. Ten questions, each one tied to a stop on Nara's walk and each one unlocking a fold of the crane.",
    "The exercise types mix the way a Duolingo lesson does: two speaking questions, multiple choice, a pick-the-word question and a match-the-pairs review.",
    "The distractors in question 7 are words from earlier questions, so even a wrong option is review. Question 9 brings back anything the visitor missed.",
  ],
};

export const tryLesson = {
  heading: "Try the lesson",
  checkLabel: "Check",
  continueLabel: "Continue",
  retryLabel: "Try again",
  speakLabel: "Everyone said it",
  revealLabel: "Show the answer",
  correctTitle: "Nice work!",
  wrongTitle: "Almost!",
  unlockedLine: (fold: number) => `Fold ${fold} is lit up on your paper.`,
  notes: [
    "Use the arrow keys to move between questions, and click the answers to show how Nara reacts.",
    "Question 1: ask the whole room to say konnichiwa together, then click 'Everyone said it'.",
    "Try a wrong answer on the tea house question to show the hint, then pick the right one.",
    "If time is short, show questions 1, 4 and 10 and skip the rest.",
  ],
};

export const wrongAnswers = {
  heading: "When you get it wrong",
  answerLane: {
    name: "A wrong answer",
    steps: [
      "The tile shakes red and the footer says Almost. You try again right away.",
      `${nara} points back to the line in the story that holds the answer.`,
      `A second miss: ${nara} explains the answer, and it comes back in the review round.`,
    ],
  },
  foldLane: {
    name: "A wrong fold",
    steps: [
      "The camera sees a corner that doesn't line up.",
      "The projector outlines that corner and draws where it should go.",
      "You refold, and the outline turns green.",
    ],
  },
  rule: "There are no hearts to lose and no lockout. The worst a mistake does is bring back a hint.",
  notes: [
    "If visitors get a question wrong, the station gives feedback and a hint, then lets them try again.",
    "The hint is never new information. Nara points back to the sentence in the story that holds the answer, so the visitor rereads and retrieves it.",
    "A second miss gets a short explanation, and that question is added to the question 9 review round.",
    "Fold mistakes work the same way: the projector highlights the one corner that's off instead of restarting the step.",
  ],
};

export const fading = {
  heading: "Help fades as you learn",
  stages: [
    { fold: 4, label: "First kite fold", help: "Animated fold, lines and arrows, and Nara talks you through it" },
    { fold: 7, label: "Second kite fold", help: "Lines and arrows only" },
    { fold: 8, label: "Third kite fold", help: "Your turn. A hint appears only if you pause or slip" },
  ],
  research:
    "Fading worked steps like this, from full examples to solving alone, helped learners in field and lab experiments.",
  notes: [
    "The station shouldn't just tell you what to do ten times. To show real learning, the help fades.",
    "The kite fold shows up three times in the crane. The first time, the projector animates it. The second time, it only draws lines and arrows. The third time, it asks you to do it yourself, and hints come back only if you struggle.",
    "The reverse fold fades the same way across folds 9 and 10.",
    "This follows research on fading worked examples by Renkl, Atkinson and Maier.",
  ],
};

export const method = {
  heading: "The Duolingo Method in paper",
  rows: [
    { key: "Learn by doing", value: "You fold real paper, and each right answer unlocks the next fold." },
    { key: "Learn in a personalized way", value: "Pick your model and level. Hints appear only when you need them." },
    { key: "Focus on what matters", value: "Day-one Japanese: hello, thank you, a bow and the words around you." },
    { key: "Stay motivated", value: "Badges, a crane taking shape and a review round for anything you missed." },
    { key: "Feel the delight", value: `${nara} bows when you get one right, and you leave holding a crane you made.` },
    { key: "For Gen Z and Gen Alpha", value: "Rounds under a minute, instructions drawn on the paper and something to show off afterward." },
  ],
  research: "Questions between folds are retrieval practice: recalling a fact builds longer-lasting memory than rereading it.",
  notes: [
    "Our installation uses the Duolingo Method through bite-sized lessons, immediate feedback, repetition and visible progress.",
    "For Gen Z and Gen Alpha, we're combining short, visual instructions with an activity where visitors watch something take shape as they learn.",
    "The questions between folds aren't decoration. Roediger and Karpicke's 2006 study found that testing yourself on material beats restudying it for long-term retention.",
  ],
};

export const visit = {
  heading: "The ten-minute visit",
  segments: [
    { label: "Welcome", seconds: 30 },
    { label: "Choose and print", seconds: 40 },
    { label: "Place paper", seconds: 15 },
    { label: "Ten rounds of question and fold", seconds: 450 },
    { label: "Badge, keep or hang", seconds: 45 },
  ],
  estimateLabel: "Team estimate. We'll time real visitors on the prototype.",
  takeaways: [
    { key: "Something you made", value: "Your origami. Keep it, or hang it in the installation." },
    { key: "Phrases you can say", value: "konnichiwa and arigatō gozaimasu" },
    { key: "Words you know", value: "ojigi, origami, sakura, kimono, tsuru and senbazuru, with what each means" },
    { key: "Folds you can do", value: "Valley, kite, petal and inside reverse folds" },
    { key: "A badge", value: "On your Duolingo account, from scanning the code at the end" },
  ],
  notes: [
    "The experience is designed to take ten minutes or less, without a teacher present. These timings are our estimate, and the prototype is how we'll test them.",
    "After the last fold and the last question, visitors scan for their badge, then keep their origami or hang it in the installation.",
    "They leave with a finished object, practice with four folding techniques, the Japanese names, and culture reinforced through the questions.",
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
  notes: ["Every number and cultural fact in the deck is listed here."],
};

/* ---------- Derived figures ---------- */

export const visitTotalSeconds = visit.segments.reduce((sum, segment) => sum + segment.seconds, 0);
