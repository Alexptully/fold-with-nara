# Fold with Nara

Our Prompt 2 deck for the Duolingo x Iovine and Young Innovator's Forum, Fall 2026. It runs in a web browser, and you present it from there.

You don't need to know how to code to run it or to change the words on a slide.

## Run it on your computer

1. Install Node.js (version 20 or newer) from https://nodejs.org. Pick the "LTS" download.
2. Get the code. Either clone the repo, or on GitHub click **Code**, then **Download ZIP**, and unzip it.
3. Open a terminal in the project folder. (On a Mac, right-click the folder in Finder and choose **New Terminal at Folder**. On Windows, open the folder, click the address bar, type `cmd` and press Enter.)
4. Run `npm install` once. It takes a minute or two.
5. Run `npm run dev` and open http://localhost:3000 in Chrome.

On presentation day, use `npm run present` instead. It builds the finished site once and serves it, so nothing recompiles while you're on stage.

## Keys while presenting

| Key | What it does |
| --- | --- |
| Right arrow, Space, Enter or click | Next build step or slide |
| Left arrow or Backspace | Back one step |
| Home / End | First / last slide |
| N | Show or hide speaker notes |
| F | Full screen |
| P | Open the print version (for PDF) |
| M | Turn sound effects off or on |
| T | Reset the rehearsal clock in the notes |

On a touch screen, swipe left or right. The address bar shows the slide number (`/#7`), so you can jump straight to a slide to rehearse it.

**Timing.** The pitch is planned at 3:25 across ten slides (see `brief.md`). Press N for the notes: each slide shows its time budget and a clock that starts with your first key press, green while you're on time and red when you're behind. Press T to reset it between run-throughs.

**Sound.** Changing slides is silent. The lesson plays short sound effects: a tap, a ding for a right answer, a bonk for a wrong one and a fanfare when you finish the crane. Browsers only allow sound after your first click or key press. Press M to mute.

**Nara moves with you.** She walks from slide to slide and changes expression as she goes. On "Your visit, step by step", each arrow press walks her to the next step. On "Choose what to fold", click a card to see what the model stands for.

**The "Try the lesson" slide is interactive.** It shows questions 1, 5 and 10, one per arrow press. On question 1, ask the room to say konnichiwa together, then click **Everyone said it**. On question 5, pick a wrong answer first to show Nara's hint, then the right one. On question 10, say arigatō gozaimasu together and click **Finish the crane**. Clicking inside the lesson card never skips the slide.

## Make a PDF

1. Press **P** (or go to http://localhost:3000/print/).
2. Open the print dialog (Cmd+P or Ctrl+P) and choose **Save as PDF**.
3. Under **More settings**, set **Margins** to **None** and turn on **Background graphics**.

Every slide prints on its own 1920 by 1080 page, and the lesson prints one page per demo question.

## Change the words

All the words live in three files. You can edit them in any text editor, or on GitHub with the pencil icon.

- `src/content/content.ts`: every slide's text, the ten questions, Nara's stories and hints, and the speaker notes. Keep the quotation marks and commas around each piece of text. Keep slide text short; put the rest in the notes.
- `src/content/config.ts`: the deck name, team names, Nara's name, and the paths to our own images.
- `src/content/sources.ts`: every source. If you add a number or a fact to a slide, add its source here and list it for that slide in `src/components/deck/slides.ts`.

`brief.md` explains what each slide has to cover, which questions came from our doc and which are drafts, and what's still open.

### Swap in our own drawings

- **Sophia's Nara:** the deck draws Nara from your character sheet and animation in every pose. To show your own file instead wherever Nara walks across the stage, export it as a PNG with a transparent background, save it as `public/renders/nara.png`, and set `characterImage: "/renders/nara.png"` in `config.ts`.
- **Sam's kiosk render:** save it as `public/renders/kiosk.png` and set `kioskRender: "/renders/kiosk.png"`.

## Before you push a change

1. Run `npm run check`. It must finish with no errors. It also fails if an em dash sneaks in anywhere; use a comma, colon or period instead.
2. Work on a branch, never straight on `main`:

```
git checkout -b your-change-name
git add .
git commit -m "Say what you changed"
git push -u origin your-change-name
```

3. Open a pull request on GitHub and ask a teammate to look at it.

`CLAUDE.md` holds the design and writing rules for the deck. If you use Claude Code on this repo, it reads that file automatically.
