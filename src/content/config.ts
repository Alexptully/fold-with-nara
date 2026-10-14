// Team placeholders. Change a value here and every slide that shows it updates.

export const config = {
  // Title slide headline, tab title and closing slide.
  productName: "Fold with Nara",

  // Title slide subtitle.
  tagline: "A new Duolingo character and a 10-question lesson you fold with your hands",

  // Title slide and closing slide, in speaking order.
  team: ["Sam", "Alex", "Tsion", "Sophia", "Langston"],

  // Title slide, under the team names.
  occasion: "Duolingo x Iovine and Young Innovator's Forum, Fall 2026",

  // The character's name, used everywhere Nara appears in text.
  characterName: "Nara",

  // Optional: Sophia's Illustrator drawing of Nara, shown on the title, "How Nara keeps
  // you going" and closing slides. Put the file in /public/renders/ and set this to
  // "/renders/nara.png". Leave empty to use the built-in drawing. "Meet Nara" always
  // uses the built-in drawing, because that slide shows how it's made from the shape guide.
  characterImage: "",

  // Optional: Sam's render of the kiosk. Put it in /public/renders/ and set the path.
  // Leave empty to use the built-in isometric drawing.
  kioskRender: "",
} as const;
