# Fold with Nara

A web slide deck for the Duolingo x Iovine and Young Innovator's Forum, Fall 2026 (Prompt 2: New World Character). The deck pitches Nara, a sika deer from Nara Park who teaches a 10-question lesson on Japanese culture while the visitor folds a paper crane at an origami pop-up.

`brief.md` is the master brief. It sets the slide content, the required sections, the statistics and their sources, and the placeholders. When the brief and this file disagree on design or tooling, this file wins. When they disagree on content or required coverage, the brief wins.

## Stack

- Next.js (App Router, static export) with TypeScript and Tailwind CSS v4
- `motion` for animation
- Phosphor Icons (`@phosphor-icons/react`), not lucide and not emojis
- All slide copy, stats, sources and chart data live in one content file (`src/content/content.ts`). All team placeholders (product name, team names, character name, optional renders) live in one config file (`src/content/config.ts`). Sources live in `src/content/sources.ts`.

The visual reference is Duolingo's own look, laid out like the Standard Physics deck: one full-bleed white stage, chunky rounded display type, drawn SVG diagrams that animate in with a springy pop, faint paper grain and fine-print sources. Feather green is the accent; Duolingo's bright secondary colors (macaw blue, bee yellow, cardinal red, pink) are reserved for Nara's effects, answer states, badges and the origami models.

Nara is drawn in `src/components/art/nara/` from the team's character sheet. Every pose (smile, talk, present, think, love, laugh, cheer, bow) reuses the same parts, so change her anatomy in `geometry.ts`, never per slide.

Every slide is drawn on a fixed 1920 by 1080 stage that scales to fit the window, so sizes in code are real pixels at 1080p.

Keep the slides clean: no progress bar, dots or slide numbers. Each slide's footer carries only its sources and, if the assignment has a rubric, its rubric tag.

## Commands

- `npm run dev` starts the deck at http://localhost:3000
- `/print` (or the P key) is the print version, one landscape page per slide or build step, for PDF export
- `npm run check` runs the type checker, the linter with its complexity limit, and the em dash scan. Run it before saying a task is done.
- `npm run present` builds the static site and serves it at http://localhost:3000 (no dev server needed on presentation day).
- M mutes or unmutes the sound effects. Sounds are synthesized in `src/lib/sound.ts` (no audio files) and only play after a click or key press.
- Work on a branch and open a pull request. Never push straight to `main`.

## General

- Don't write summary markdown files or make copies of files (`.backup`, `.old`). We use Git.
- Use tools to understand a problem before changing code. Never make up data or statistics. Every number on a slide needs a source in `sources.ts` and in that slide's footer.
- Label estimates and dated figures honestly, for example "2019 estimate" or "team estimates".
- Code should explain itself through clear names. Comment only tricky logic.
- Passing the lint and cyclomatic complexity checks is a hard requirement, the same as a type error or a failing test. Pull branchy logic into named functions, replace nested conditionals with early returns or a lookup, and split a function that does more than one job.
- Never use em dashes anywhere: slide text, notes, code or comments. Use commas, colons, periods or parentheses.
- Keep slide text short. Details go in the speaker notes.
- If you change a team rule, update this file in the same pull request.

## Design standards

- Make professional, well-designed UI with no blurple. It should look good and still be easy to skim.
- Write copy in approachable, human, conversational terms.
- Never use gradient text (`bg-clip-text` with `text-transparent` or similar).
- Never put a visible colored border on an element with rounded corners, because the border anti-aliases unevenly at the corners. Use a shadow, ring or fill instead, and keep visible borders for sharp-cornered elements. Thin neutral borders on rounded form inputs are the one exception.

### Typography

- This deck uses Fredoka (variable) for headings, Nunito (variable) for running text and M PLUS Rounded 1c for Japanese, all self-hosted from npm. Wrap Japanese in the `Jp` primitive so it gets the right face and `lang="ja"`.
- Never use Lora or similar bracketed, moderate-contrast "blog default" serifs for display or headings.
- Never use high-contrast italic display serifs anywhere (Instrument Serif, Playfair Display, DM Serif Display, Cormorant, Fraunces italic, Libre Caslon Display, Bodoni Moda, Italiana).
- Research Google Fonts before picking type. Check the weights, optical sizes and whether a variable version exists.
- Never set text in all caps unless the content is really uppercase (acronyms, codes, ticker symbols). That includes labels, buttons, nav and emphasis.
- Don't change letter-spacing. If type looks wrong at a size, the size or the family is wrong.
- The letter-spaced uppercase micro-label is banned, even when a library or reference recommends it. Small labels stay in sentence case at a readable size.
- Use monospace only for real code, data or figures aligned in a column. Never use it to make headings, captions or labels feel technical.
- Use the type scale (`text-sm`, not `text-[9px]`). Arbitrary values need a reason.

### Define it once

Anything that appears more than once gets one definition that everything else references:

- **Type:** text styles defined in the theme, not per-element font declarations.
- **Color:** semantic tokens (`--surface`, `--text-muted`, `--accent`) defined in one place, never raw hex or Tailwind colors scattered through components.
- **Elements:** a button is one `Button` component with variants. The same goes for cards, badges, tiles and slide primitives.
- **Spacing, radii, shadows and motion:** scales and easing curves live in the theme.

If a design change means touching many files, the abstraction is missing. Extend the existing theme and components before starting new ones.

### Layout

- No eyebrows (the small label floating above a heading).
- No short decorative horizontal rules.
- No decorative section numbers. Number things only when the reader needs the number to find or cite them, and set it in the heading's own font.
- No middot metadata strips (`Thing · Category · Person · Year`). Important facts get a key/value block or a real sentence, and the rest gets cut.
- No reflexive rows of three (three cards, three stats, three steps). Show as many things as there really are.
- Avoid colored icons on pastel rounded squares as a layout device.
- No mystery controls. A button or link says what it does before it's clicked ("Open our Figma board", not "Figma").
- A hot, saturated accent is for glow, motion and small marks, not for filling primary buttons or chips. Controls stay neutral with one calm accent. The one exception is the Duolingo lesson mockup (`LessonCard`) and the journey path, which copy Duolingo's own UI: filled green Check and Continue buttons, a filled red Try again, and filled path nodes, because those slides depict the product.
- Text is the last resort. Before writing a label or caption, ask whether size, weight, color, position, a container, an icon or a small diagram could carry the same fact.
- Give each section one heading that names the thing, with no comma and no supporting paragraph that restates it.
- Prefer a diagram, table or marked-up state over prose that says the same thing. Put details that don't fit into presenter notes or behind a disclosure.
- Hierarchy: make the most important element dominant through size, color and contrast, and demote everything else.
- Show grouping with proximity, shared containers and alignment, not with headings that announce the group.
- Every meaningful state gets a visible change (shape, color, position, motion or contrast), not a text label.

These rules target reflexes, not accessibility. Accessible names, alt text and screen reader labels are never the thing being cut.

### Charts

- Our line or mark is thick and saturated. Competitors and comparisons are thin and muted.
- Label lines and points directly instead of relying only on a legend.
- Hover highlights a series; the key toggles it. Clicking chart controls never advances the slide.

### Ambition

The deck should look like a design textbook or a designer's portfolio. Take on the big version of the task.

- Use real imagery: generated images, or models built in Blender or Inkscape. No stock photos and no real company logos. Refer to companies by name in text only.
- Use animation and interactivity, and check animations frame by frame instead of assuming the CSS is right.
- Carry detail all the way through: grain, texture, edge treatment and weight.
- Repeat one motif across the whole deck, the way strong writers and photographers repeat an image. This deck's motif: the dashed green crease line that Nara's projector draws on paper. It appears as the `Crease` primitive on diagrams, flashes along the fold line when a slide turns like a sheet of paper, joins the steps of the journey path and links each question to its fold. Green is reserved for projected light, right answers and progress.
- Slide transitions animate only transform and opacity (see `PageTurn.tsx`). Clip-path and filter animations on the full stage repaint every frame and stutter; don't bring them back.

## Writing

- No paraprosdokians (a sentence that turns on its second half for a wink).
- No rising tricolons and no three-beat rhythms.
- No fragments punctuated as sentences for drama. Every sentence needs a subject and a verb.
- Explain, don't evoke. A metaphor can sit beside a definition but never replace it.
- Length isn't the enemy, vagueness is. Name each new term where it first appears, show a concrete example and give the reason a thing works.
- Split the work between pictures and text. Before writing a third paragraph, ask whether a diagram, worked example or before/after pair would say it better.
- No trailing phrases that rename what came before without a verb of their own, whether attached with a dash, colon or comma.
- No evaluative tags ("...and that's the point", "...which is important").
- Don't hang the point of a sentence off its end. If the key fact sits in a trailing clause, promote it to a main clause or split the sentence.
- A caption, tooltip or helper line must carry a fact the reader can't get from what it sits beside. Cover the image or control: if the words still say something specific, keep them.

## Interface skills

If your Claude Code setup has the `better-*` skills (`better-ui`, `better-typography`, `better-colors`, `better-layout`, `better-accessibility`, `better-writing`, `better-interface`), load the relevant ones before writing UI. Where a skill conflicts with this file, this file wins.

## Before you finish, verify

1. Every required section from the brief is clearly visible, and each slide's footer tag says which one it covers.
2. There are no em dashes anywhere in the project.
3. Every stat has a source in its slide's footer and an entry on the sources page.
4. Keyboard navigation, speaker notes (N), full screen (F), print-to-PDF (P) and mute (M) all work.
5. `npm run check` passes with no errors.
