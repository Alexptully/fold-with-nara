# Fold with Nara: content brief

The master brief for the deck. It sets what the deck must cover, the lesson content, every fact and its source, and the placeholders. Design and tooling rules live in `CLAUDE.md`.

## The assignment

Duolingo x Iovine and Young Innovator's Forum, Fall 2026, **Prompt 2: New World Character, Lesson Concept**.

> Your team's mission is to develop a new world character and create a concise, 10 question Duolingo lesson for beginners. Your proposal can either: 1. Introduce learners to an important cultural aspect of a country. Set them in a distinct location, such as a café, museum, monument, or building OR 2. Introduce the fundamentals of an entirely new subject that isn't already on Duolingo.
>
> Use design resources to keep consistent with the brand identity for characters and environments, especially the simple illustration style guidelines. Consider how your lesson will correct wrong answers and how your character can best encourage a learner to start something new and stay engaged!

We take option 1 (a cultural aspect of Japan). The lesson lives inside the team's origami pop-up from the shared doc, so the deck also answers the three questions the team's script was built around: what we teach and why, how the installation teaches, and the visitor's journey.

The pitch window is four minutes and should be interactive: the audience folds paper during the pitch.

## Required sections and where each one is covered

Each slide's footer names the section it covers.

| Requirement | Slide |
| --- | --- |
| New world character, consistent with the simple illustration style (rounded square, circle, rounded triangle, semicircle) | Meet Nara |
| Important cultural aspect of a country | What we teach and why, Choose what to fold |
| Distinct location | The airport kiosk, The tent pop-up (and Nara Park as the lesson's setting) |
| Concise 10-question lesson for beginners | The 10-question lesson, Try the lesson |
| How the lesson corrects wrong answers | When you get it wrong |
| How the character encourages the learner to start and stay engaged | How Nara keeps you going (all seven expressions from the character sheet) |
| How the installation teaches (team script, section 2) | How a station teaches, Help fades as you learn, The Duolingo Method in paper |
| Visitor journey and takeaway (team script, section 3) | Your visit, step by step; The ten-minute visit |

## The user experience, in the team's order

"Your visit, step by step" follows this list from the team doc exactly, one path node per item:

1. Welcome screen with fun animations, starring Nara the sika deer from Nara Park.
2. Free or paid, depending on the location.
3. Choose what to fold, at three levels. Easy: Sakura and Mt. Fuji. Medium: Crane and Koi fish. Hard: Samurai helmet and the special Duo fold.
4. The station prints paper designed for that model.
5. Place the paper in the frame, as the screen in front of you shows.
6. The projector outlines where to fold, right on the paper.
7. Each fold comes with a question on the screen, and you answer it to move on. The questions are about the culture behind the item you're folding.
8. Scan with your phone to get a badge on your Duolingo account.
9. Keep the origami, or hang it in the installation.

## Character and installation references

- Nara follows the team's character sheet (outline sketch, colored figure and seven expressions: talk, present, think, love, laugh, cheer, bow). The deck draws Nara in vector so every pose stays sharp and can animate.
- The kiosk and tent follow the team's render: a wooden kiosk about 7 ft tall on a 2.5 ft square footprint with an overhead camera and projector, touchscreen, folding area, paper dispenser and storage; and a white faceted dome tent with stations around the walls and origami hanging overhead.
- Duo appears in text only, as a locked "special" option. The deck never draws Duolingo's characters or logo.

## The concept in one sentence

Nara, a sika deer from Nara Park, walks a visitor through ten stops in the park; each right answer unlocks the next fold of a paper crane, so the visitor leaves with a crane they folded and ten pieces of Japanese language and culture.

## The lesson

The featured model is the traditional crane. Its ten steps line up one-to-one with the ten questions, and its kite and reverse folds repeat, which lets the projector give less help each time (see "Help fades as you learn").

Questions marked **doc** are the team's wording from the shared doc (Tab 1). Questions marked **draft** were written for this deck in the same voice; Sophia owns the questions and should review or replace them.

| # | Stop | Topic | Exercise | Status | Source |
| --- | --- | --- | --- | --- | --- |
| 1 | The park gate | こんにちは konnichiwa, hello | Say it out loud | doc | |
| 2 | The deer lawn | お辞儀 ojigi, a bow | Multiple choice | draft | Coto Academy |
| 3 | A paper shop | 折り紙 origami, folding paper | Multiple choice | draft | Merriam-Webster |
| 4 | The sakura grove | 桜 sakura, cherry blossom | Multiple choice | doc | Embassy of Japan in Canada |
| 5 | A tea house | 茶道 sadō, tea ceremony | Multiple choice | doc | Embassy of Japan in India |
| 6 | A kimono shop | 着物 kimono, a thing to wear | Multiple choice | doc | Vocabulary.com |
| 7 | The pond | 鶴 tsuru, crane | Pick the word | draft | |
| 8 | A shrine | 千羽鶴 senbazuru, a thousand cranes | Multiple choice | draft | Wikipedia |
| 9 | A bench by the pond | 復習 fukushū, review | Match the pairs | draft | |
| 10 | Back at the park gate | ありがとうございます arigatō gozaimasu | Say it out loud | doc | |

Full story text, hints and explanations are in `src/content/content.ts`.

## Facts and their sources

Every number and cultural claim on a slide, with its source key in `src/content/sources.ts`.

| Claim | Source key |
| --- | --- |
| 1,687 deer counted in Nara Park, July 2026 (Nara Deer Preservation Foundation survey) | `naraDeerCount2026` |
| Nara's deer are revered as messengers of the gods of Kasuga Taisha, for more than 1,250 years; they bow for crackers | `naraDeerHistory` |
| Nara's deer are protected as a natural monument | `naraNaturalMonument` |
| Bowing (ojigi) is used to greet, thank and apologize | `ojigi` |
| Origami is ori (fold) + kami (paper) | `origamiWord` |
| Sakura symbolize transience; blossoms last about a week to ten days | `sakura` |
| The tea ceremony's principles: harmony, respect, purity, tranquility; the host's hospitality | `teaCeremony` |
| Kimono is ki (wear) + mono (thing) | `kimono` |
| Cranes symbolize long life; a thousand cranes is a wish for recovery | `senbazuru` |
| Japanese is one of Duolingo's Top 9 courses; the five Duolingo Method principles; the character shape guide | `duolingoPrompt` |
| Mt. Fuji is a sacred place and an icon of Japan (UNESCO World Heritage, 2013) | `fuji` |
| Carp streamers stand for strength and perseverance; kabuto are displayed on Children's Day to inspire bravery | `childrensDay` |
| Testing yourself beats restudying for long-term retention | `retrieval` |
| Fading worked steps helps learners move to solving alone | `fading` |

**Labeled estimates.** The ten-minute timeline on "The ten-minute visit" is a team estimate and is labeled that way on the slide. Replace it with timings from the prototype. The kiosk's 7 ft height and 2.5 ft footprint are the team's design targets from the render, not measurements.

## Placeholders

All in `src/content/config.ts`:

- `productName`, `tagline`, `team`, `occasion`
- `characterName` (Nara)
- `characterImage`: Sophia's Illustrator drawing, once exported to `public/renders/`
- `kioskRender`: Sam's render of the kiosk, once exported to `public/renders/`

## Open items for the team

- Sophia: review or replace the five draft questions (2, 3, 7, 8, 9).
- Sophia: the vector Nara follows your character sheet. If you'd rather show your Illustrator file on the title and closing slides, export it and set `characterImage`.
- Decide pricing for the paid locations (the deck only says "free or paid, depending on the location").
- Sam: drop the kiosk render into `public/renders/` and set `kioskRender`.
- Tsion: the speaker notes (press N) follow the first-draft script; trim them to fit four minutes.
- Decide whether Q1 is said out loud by the whole room (the notes assume yes).
