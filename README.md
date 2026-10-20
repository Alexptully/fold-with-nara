# Fold with Nara

Our Prompt 2 deck for the Duolingo x Iovine and Young Innovator's Forum, Fall 2026. It runs in a web browser, and you present it from there.

You don't need to know how to code to run it or to change the words on a slide.

- **Code:** https://github.com/Alexptully/fold-with-nara. The repo is private, so ask Alex to add you as a collaborator, then accept the email invite.
- **Present from the web:** https://alexptully.github.io/fold-with-nara/ is the deck, rebuilt from `main` every time a change is merged (it takes about two minutes). It works in any browser with nothing installed. The mini booth's iPad and projector can't follow the hosted copy, so run the deck from your laptop (below) when you use them.

## Run it on your computer

1. Install Node.js (version 20 or newer) from https://nodejs.org. Pick the "LTS" download.
2. Get the code. Either clone the repo, or on GitHub click **Code**, then **Download ZIP**, and unzip it.
3. Open a terminal in the project folder. (On a Mac, right-click the folder in Finder and choose **New Terminal at Folder**. On Windows, open the folder, click the address bar, type `cmd` and press Enter.)
4. Run `npm install` once. It takes a minute or two.
5. Run `npm run dev` and open http://localhost:3000 in Chrome. It also starts the link to the mini booth's iPad and projector (below).

On presentation day, use `npm run present` instead. It builds the finished site once and serves it, so nothing recompiles while you're on stage. If you're not using the iPad and projector, the web link above is enough.

## Who says what

The speaker notes are our script. Press **N** while presenting: each slide shows whose part it is, the lines to say, and cues in brackets (press, click, point). At every handoff the notes name the next speaker.

| Part | Slides | Speaker |
| --- | --- | --- |
| Intro | Title | Everyone |
| Why we did it | Why origami | Sam |
| What we did | Where it pops up, Our mini booth | Alex |
| Meet Nara | Meet Nara, How Nara reacts | Sophia |
| User experience | Your visit, Choose what to fold | Tsion |
| Duolingo in paper | The Duolingo Method in paper | Alex |
| Example lesson | The 10-question lesson, Try the lesson, You folded Mt. Fuji | Ledger |
| Arigatō gozaimasu | Thank you | Everyone |

The same script, with the running order and times, is in our doc [Fold with Nara script](https://claude.ai/artifact/7DthhUU9jAQG1f8PiGaogY) for reading and printing. The deck's notes are the source: to change a line, edit that slide's `notes` in `src/content/content.ts`, then update the doc to match.

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

**Timing.** The pitch is planned at 3:44 across thirteen slides (see `brief.md`). Press N for the notes: each slide shows its time budget and a clock that starts with your first key press, green while you're on time and red when you're behind. Press T to reset it between run-throughs.

**Sound.** Changing slides is silent. The lesson plays short sound effects: a tap, a ding for a right answer, a bonk for a wrong one and a fanfare when you finish Mt. Fuji. Nara pops when she's revealed, and Mt. Fuji pops when it lands in the tent. Browsers only allow sound after your first click or key press. Press M to mute.

**Nara is a reveal.** She stays off stage through the title, "Why origami" and the booth slides. "Meet Nara" opens on her outline; one arrow press pops her into color, and "How Nara reacts" follows right after.

**Nara moves with you.** From then on she walks from slide to slide and changes expression as she goes. On "Your visit, step by step", each arrow press walks her to the next step. On "Choose what to fold", click a card to see what the model stands for.

**Why origami.** One arrow press sends the Mt. Fuji home: a copy flies along the dashed line to a shelf, and the study about why people keep what they fold appears.

**Where it pops up.** The pop-up is a tent at events, free for everyone. The slide is one camera move in drawings: it opens on the tent, the first arrow press flies in through the door to the kiosks along the walls, and the second closes in on one kiosk with its parts labeled.

**Our mini booth.** This slide is your cue to point to the physical mini booth on the table and show what it does.

**The "Try the lesson" slide is interactive.** The lesson is Mt. Fuji: saying hello unlocks the first fold, then every four questions unlock the next. The slide plays the question that unlocks each fold, one per arrow press, and the room folds along. Each question opens with the paper as the last fold left it; a right answer has the projector draw the crease and arrow, then the paper folds over into its new shape. Click **Replay fold** to play it again from the last step. On question 1 the whole room says konnichiwa; click **Everyone said it** to unlock fold 1 (fold in half into a triangle, with the snowy corners on the outside). On question 5 (what origami means), pick a wrong answer first to show Nara's hint, then the right one, and fold the left corner over. Question 9 unlocks fold 3 (open it so it stands); click **Finish Mt. Fuji** for the fanfare. Clicking inside the lesson card never skips the slide.

**You folded Mt. Fuji.** The completion screen shows the finished mountain with Nara cheering. Click **Take it home** to show that choice, or **Hang it in the tent** (or press the arrow) to watch the mountain fly into our drawing of the tent and hang from the dome.

## The mini booth's iPad and projector

Our mini booth's iPad and small projector follow the deck live. As you change slides, the iPad shows what a visitor would see on the kiosk at that moment, and the projector draws the fold lines on a real sheet of paper. On "Try the lesson" every tap shows up on the iPad too: the tile you pick turns blue, a wrong answer turns red with Nara's hint, and a right answer lights up the fold on the iPad and on the paper.

**Set it up before the pitch:**

1. Put the laptop, the iPad and whatever feeds the projector on the same Wi-Fi. Event Wi-Fi often stops devices from seeing each other, so a phone hotspot is the safe choice.
2. On the laptop, run `npm run present`. The terminal prints the addresses for the iPad and the projector. On a Mac, click **Allow** if macOS asks about incoming connections for Node.
3. Open http://localhost:3000/kiosk/ on the laptop. It shows a code to scan for each kiosk page and how many are connected.
4. On the iPad, scan the code for **iPad screen**, then tap the screen once. It goes full screen and stays awake. (Add it to the Home Screen from the share menu to hide Safari's bars for good.)
5. Open the **Projector** page on whatever feeds the projector and tap it. Lay a sheet of the kiosk paper on the ledge and move, size and turn the white square until it sits on the sheet's edges (**Mirror** flips it for a projector that bounces off a mirror). Tap **Done**. Each device remembers its fit.
6. In the deck, press N. The last line of the notes says how many iPad screens and projectors are following.

**Which page goes where:**

| How the projector gets its picture | Open |
| --- | --- |
| Plugged into a laptop or phone | `/kiosk/projector/` on that device |
| Plugged into the presenting laptop as a second screen | `/kiosk/projector/` in a second browser window, dragged onto the projector. It follows the deck even without Wi-Fi. |
| Plugged into the iPad, used as a second screen (Stage Manager on recent iPads) | `/kiosk/screen/` in one Safari window and `/kiosk/projector/` in another window on the projector |
| Plugged into the iPad and only copying its screen | `/kiosk/combined/` on the iPad: the kiosk screen beside a black panel with the fold lines. Aim the projector so the black panel lands on the paper. |

**What the kiosk shows on each slide:**

| Slide | iPad | Projector |
| --- | --- | --- |
| Title to Our mini booth | A welcome screen with the paper models, and no Nara yet | Green corners where the paper goes |
| Meet Nara | Her outline, then she pops in with sparkles and says hello | Sparkles as she pops in |
| How Nara reacts | Her expressions on a loop, then the two for mistakes | Green corners |
| Your visit, step by step | The kiosk screen for each step: hello, choose, print, place your paper, follow the light, a question, the badge, the results | Bright corners for "place your paper", and fold 1 for "follow the light" |
| Choose what to fold | The fold picker, with whichever card you click | Green corners |
| The Duolingo Method in paper | Nara cheering you on | Green corners |
| The 10-question lesson | The ten stops as a path; the folds appear on the second press | Bright corners |
| Try the lesson | The lesson card, tap for tap, beside your three folds | The paper's edge, red corners after a miss, then the crease and arrow for the fold you unlocked (again on **Replay fold**) |
| You folded Mt. Fuji | The results (with **Take it home**), then Nara seeing the model off to the tent | The finished mountain glowing |
| Thank you | Nara bows: arigatō gozaimasu | Sparkles |

The kiosk pages need the deck running from `npm run present` or `npm run dev` on the laptop. The hosted copy of the deck can't reach the iPad. If the Wi-Fi drops mid-pitch, the iPad keeps its last screen, shows a small grey dot, and catches up as soon as it reconnects.

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
- **The mini booth:** save a photo as `public/renders/mini-booth.jpg` and set `miniBoothPhoto: "/renders/mini-booth.jpg"`. Until then the slide shows the kiosk drawn at desk size.

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
