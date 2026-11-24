# Abhishek weds Shweta — Wedding Invitation Website

Handover and phased build prompts for Claude Code. Written 24 November 2026.

## How to use this file

1. Make a project folder, for example `~/work/abhishek-weds-shweta`, and copy this file and the `assets/` folder into it.
2. Open a terminal in that folder and start Claude Code (`claude`).
3. Run **Phase 0** yourself (it installs the skills and plugins Claude Code will lean on).
4. Paste the **Phase 1** prompt. When it finishes and you have looked at the result, paste Phase 2, and so on. One phase per prompt keeps each step reviewable.
5. Every phase prompt assumes Claude Code has read this file. The first line of each prompt tells it to.

Anything marked **CONFIRM** is a decision or a fact only the couple can supply. Defaults are given so the build is never blocked.

---

## 1. Brief

Build a single-page, mobile-first wedding invitation website for the wedding of Abhishek and Shweta on Saturday, 12th December 2026, at Sargam Palace, Dhusara, Una (Himachal Pradesh).

It is the scrolling counterpart of the invitation video: the guest opens a link from WhatsApp, the invitation "opens" in front of them, and each scroll reveals the next part of the card. It should feel like unwrapping a royal printed invitation, not like browsing a website.

- **Audience:** family and friends of all ages, almost all arriving from a WhatsApp link on a mid-range Android phone. Desktop must look good but is secondary.
- **Tone:** royal, warm, traditional; playful only in the niece's line near the end.
- **Success:** a guest can read every name, date, time and the venue without effort; the animations delight but never hide or delay information; it loads fast on mobile data.

## 2. Invitation content (source of truth)

Use this text exactly: spelling, capitalisation, punctuation and honorifics included. Do not add events, relatives, quotes, hashtags or a love story. If something is not here, it does not go on the site.

**Invocation**

- `॥ श्री गणेशाय नमः ॥`
- `वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।`
- `निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥`
- `Wedding Invitation`

**Hosts**

- `Smt. Veena & Sh. Ram Kumar Sharma`
- `solicit your gracious presence & blessings on the auspicious occasion of the wedding ceremony of their beloved loving son`

**Groom**

- `Abhishek`
- `(Grand S/o Late Smt. Leela Devi & Sh. Mangat Ram)`
- `at VPO Jhalera, Tehsil & Distt. Una, H.P.`

**Bride**

- `with`
- `Shweta`
- `(D/o Mrs. Neelam Sharma & Mr. Suman Sharma)`
- `at Village Dathwada, Tehsil & Distt. Una`

**Couple line**

- `Abhishek weds Shweta`
- `Saturday, 12th December 2026`

**Golden Moments** (the section title is exactly `Golden Moments`)

| Day | Event | Time |
|---|---|---|
| Thursday, 10th December 2026 | Sunder Kand | 8:30 AM |
| Friday, 11th December 2026 | Nanka Mail | 11:00 AM |
| Friday, 11th December 2026 | Lunch | 1:30 PM |
| Saturday, 12th December 2026 | Sehrabandi | 3:00 PM |
| Saturday, 12th December 2026 | Departure of Barat | 5:30 PM |
| Sunday, 13th December 2026 | Vadhu Pravesh | 5:00 AM |

All times are India Standard Time (Asia/Kolkata).

**Venue**

- `VENUE`
- `Dhusara, Sargam Palace`
- `Tehsil & Distt. Una, H.P.`

(The Hindi note about clothes was removed from the invitation at the couple's request on 25 November 2026.)

**Closing**

- `Na koi phone, na koi bahana, mere chachu ki shadi me jalul-jalul aana ji..... Dhruvi`
- `With best compliments from all relatives & friends`
- `R.S.V.P.` / `Sharma Family`
- `M: 8826133717, 8076763711`

**Monogram:** `A & S`

## 3. Assets supplied

In `assets/`:

- `portrait-groom.png` (434 x 1024), `portrait-bride.png` (431 x 1024), `portrait-couple.png` (648 x 1024): illustrated bride-and-groom portraits the couple approved. These are the only pictures of the couple to use. They are small, so display them no wider than about 420 CSS px on phones and inside an arch frame on desktop; never stretch them full-bleed.

Not supplied, so do not invent them:

- **Music.** CONFIRM: the couple will add a licensed instrumental at `public/audio/wedding.mp3`. Build the music toggle so it works when the file exists and hides itself when it does not.
- **Exact map pin.** CONFIRM. Until then link to a Google Maps search for `Sargam Palace, Dhusara, Una, Himachal Pradesh`.
- **Larger portraits.** If full-size versions arrive, they replace the three files with the same names.

Draw everything else (arches, mandala, diyas, garlands, event motifs, Ganesha line-art) as original inline SVG. No stock photos, no AI-generated faces, no clip-art downloaded from the web.

## 4. Design direction

One world: a palace at lamp-light. It matches the invitation video so the two feel like a pair.

- **Palette:** wine ground `#4A0D1C`, antique gold `#D4A84B`, ivory text `#FFF3DC`, marigold accent `#F08A24`. Derive every other tone by mixing these four (lighter wine for panels, brass for shaded gold, pale gold for highlights).
- **Type:** names in a flowing script (Great Vibes or Pinyon Script), body in a high-contrast serif (Cormorant Garamond, weight 500/700), Devanagari in Noto Serif Devanagari or Tiro Devanagari Hindi. Load with `next/font`, subset, `display: swap`.
- **Motifs:** ogee jharokha arches, a three-ring petal mandala, brass diyas with flickering flames, marigold torans with hanging bud strings, a faint jaal lattice on the ground, drifting marigold petals and gold dust.
- **Event tints:** each Golden Moment shifts the light, not the palette. Sunder Kand saffron glow; Nanka Mail bright gold; Sehrabandi and Barat night with string lights; Vadhu Pravesh pale dawn.
- **Motion character:** slow, graceful, eased. Things draw themselves in gold, unfold, swing and settle. Nothing bounces like an app, nothing flashes, and text never moves while it is being read.

## 5. The scroll experience

Research on current animated wedding invitations (links in section 10) shows the same crowd-pleasers again and again: a tap-to-open envelope or palace door, names revealed letter by letter, layered parallax, petals and gold dust, self-drawing SVG borders, a scratch-to-reveal date, a live countdown, stacked event cards, an arch-framed map, a muted-by-default music toggle, add-to-calendar and WhatsApp share. This site uses the ones that suit a royal Indian card and skips the rest.

| # | Section | What the guest sees | Signature effect |
|---|---|---|---|
| 0 | Gate | Closed palace doors with an `A & S` seal and "Tap to open" | Seal pulses; on tap the doors swing open in 3D, petals burst, music may start (the tap is the user gesture) |
| 1 | Invocation | Ganesha line-art in a turning mandala, shlok, `Wedding Invitation` | Gold lines draw themselves; diyas light one by one |
| 2 | Hosts | Parents' names and the invitation line | Marigold toran drops in and sways; words arrive one at a time; kalash rises |
| 3 | Groom | Portrait in a jharokha arch, `Abhishek`, family lines | Arch clip-path opens like doors as the section pins; name writes on letter by letter with a gold shimmer |
| 4 | Bride | Portrait, `with` / `Shweta`, family lines | A veil lifts off the portrait on scroll |
| 5 | Together | Couple portrait, `Abhishek weds Shweta` | The two arches slide together into one; petal shower |
| 6 | The date | A gold foil panel | Scratch to reveal `Saturday, 12th December 2026`; then a flip-clock countdown and "Add to calendar" |
| 7 | Golden Moments | Four days as a pinned sequence | A gold thread draws down the page linking the days; each day's card pins, its motif animates, then it recedes behind the next |
| 8 | Venue | Palace facade, venue text, the Hindi note | Windows light up from the centre outwards; arch-framed map and "Get directions" |
| 9 | The film | The invitation as a 60-second film | Remotion Player, poster first, plays on tap |
| 10 | Closing | Dhruvi's line, compliments, monogram, R.S.V.P. | Dhruvi's line types itself in a child's handwriting; monogram seal spins in; call buttons; share on WhatsApp |

Golden Moments motifs (original SVG, each animated on scroll progress):

- **Sunder Kand:** an open pothi on a rehal, pages opening, lines of text drawing in, a hanging bell swinging.
- **Nanka Mail and Lunch:** a dhol with two sticks beating in turn, a gift thali sliding in, a marigold swag dropping.
- **Sehrabandi and Departure of Barat:** a safa with kalgi; sehra strings fall one by one; string lights switch on across the arch and soft sparks rise.
- **Vadhu Pravesh:** doors open on a dawn sky over hills; a kalash tips at the threshold and rice spills; alta footprints appear walking towards the viewer.

## 6. Stack

| Need | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router, TypeScript, static export) | One page, no server needed, free static hosting, good image and font handling |
| Styling | Tailwind CSS v4 plus CSS variables for the four colours | Fast to build, tokens in one place |
| Scroll animation | GSAP with ScrollTrigger, SplitText, DrawSVG via `@gsap/react` `useGSAP` | The standard for pinned, scrubbed scroll scenes; every GSAP plugin is now free |
| Smooth scroll | Lenis, driven from the GSAP ticker | Makes scrubbed scenes feel smooth; disable on low-end phones |
| Small interactions | Motion (the `motion` package, formerly Framer Motion) | Buttons, toggles, presence animations |
| Film | Remotion: compositions in the same repo, `@remotion/player` on the page, `npx remotion render` for an MP4 | The film reuses the site's React components and tokens, and renders to a file for WhatsApp |
| Particles | One small canvas for petals and dust | Cheaper than a particle library |
| Audio | A plain `<audio>` element with a toggle (Howler.js only if fades are needed) | Smallest thing that works |
| Extras | `canvas-confetti` for the gate burst; `.ics` generated at build time | |
| Hosting | Vercel (or any static host) | CONFIRM domain; default is the free `*.vercel.app` address |

Remotion is free for individuals and for companies of up to three people; larger companies need a company licence. This is a personal project, so the free licence applies.

Deliberately left out: Three.js / WebGL (too heavy for the phones this will be opened on), a database, logins, an RSVP form backend. R.S.V.P. is by phone, as on the card.

## 7. Phase 0: install tools and skills (run these yourself)

Requirements: Node.js 20 or newer, Git, Claude Code.

Skills are instruction packs that teach Claude Code the conventions of a library. Install only from the publishers below and skim each `SKILL.md` before trusting it.

In a terminal, inside the project folder:

```bash
# GSAP official skills: core, timeline, ScrollTrigger, plugins, React, performance
npx skills add https://github.com/greensock/gsap-skills

# Remotion official skills: best practices, create, markup, render and more
npx skills add remotion-dev/skills

# Vercel: React/Next.js performance rules and the web interface review checklist
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```

Inside Claude Code:

```text
/plugin install frontend-design@claude-plugins-official
/reload-plugins
```

`frontend-design` is Anthropic's own plugin for distinctive, non-generic interfaces. If that command is refused, the same skill installs with `npx skills add anthropics/skills --skill frontend-design --agent claude-code`. GSAP's skills can also be added from inside Claude Code with `/plugin marketplace add greensock/gsap-skills`.

Optional, for Claude Code to look at its own work in a browser: add a Playwright MCP server (see the Playwright MCP README for the current `claude mcp add` command), or simply let Claude Code run Playwright from the project as Phase 7 asks.

Check: run `/plugin` and `npx skills list` and confirm `frontend-design`, the `gsap-*` skills, the `remotion-*` skills, `vercel-react-best-practices` and `web-design-guidelines` are present.

## 8. Phase prompts

Paste one at a time. Review and commit between phases.

### Phase 1: foundation

```text
Read HANDOVER.md in this folder completely before doing anything. It is the brief and the
source of truth for all content.

Phase 1 of 7: foundation only. Do not build any section yet.

1. Scaffold a Next.js App Router project in this folder with TypeScript, Tailwind CSS v4 and
   ESLint, configured for static export. Use the latest stable versions.
2. Install: gsap @gsap/react lenis motion remotion @remotion/player canvas-confetti.
   Keep every remotion package on the same version.
3. Create content/wedding.ts holding EVERY string from section 2 of HANDOVER.md, typed, with
   events as structured data (ISO date, start time, Asia/Kolkata). Components must read text
   only from this file. Add a test that fails if any string differs from HANDOVER.md.
4. Create the design tokens from section 4 as CSS variables and Tailwind theme values, and
   load the three font families with next/font.
5. Move the three portraits from assets/ into public/portraits/ and generate optimised
   WebP/AVIF versions.
6. Build these reusable, original inline-SVG components with props, each on a /kitchen-sink
   page so I can inspect them: Arch (ogee jharokha, optional draw-on), Mandala (three rings,
   rotatable), Diya (with a flame that flickers), Toran (marigold garland with hanging bud
   strings), JaalBackground, GoldFrame, Kalash, PetalField (one canvas: drifting petals and
   gold dust, pauses when off-screen).
7. Add a MotionProvider that registers GSAP plugins once, wires Lenis to the GSAP ticker,
   exposes a useReducedMotion flag, and turns Lenis off when the device is low-end or the
   user prefers reduced motion.
8. Write CLAUDE.md with the project rules: content only from content/wedding.ts; never
   change names, dates, times or honorifics; only the four palette colours and mixes of
   them; animate transform and opacity only; every scroll scene must have a reduced-motion
   version; mobile first at 390 px wide.

Use the frontend-design skill for the visual work and the gsap-react skill for the provider.
Finish by running lint, type-check and the content test, and tell me how to open
/kitchen-sink.
```

### Phase 2: gate, invocation and hosts

```text
Read HANDOVER.md and CLAUDE.md first.

Phase 2 of 7: the opening. Build sections 0, 1 and 2 from the table in section 5.

Gate: a full-screen closed pair of palace doors with the "A & S" seal and a clear
"Tap to open" prompt. On tap or Enter: the seal presses, both leaves swing open with a 3D
perspective GSAP timeline, a short petal and confetti burst plays, and the page scrolls
into the invocation. The gate locks scrolling until opened, offers a visible "Skip" link,
is fully keyboard operable, and is skipped automatically for reduced-motion users and for
returning visitors in the same session. If public/audio/wedding.mp3 exists, the tap may
start it at low volume; otherwise no audio code runs.

Invocation: original line-art Ganesha inside the turning mandala under an arch; the
strokes draw themselves; the three Devanagari lines and "Wedding Invitation" rise in;
five diyas along the base light one after another.

Hosts: a marigold toran drops from the top edge and sways; the parents' names appear, a
gold rule draws, and the invitation sentence arrives word by word (SplitText); a kalash
flanked by diyas settles at the bottom.

Rules: pin and scrub with ScrollTrigger; total pinned distance for these three sections
no more than about four screen heights; text must be fully readable the moment its
animation ends and must never be animated out while still in view. Follow the gsap-
scrolltrigger and gsap-performance skills. When done, show me screenshots at 390x844 and
1440x900 of each section's start, middle and end state.
```

### Phase 3: groom, bride, together, the date

```text
Read HANDOVER.md and CLAUDE.md first.

Phase 3 of 7: build sections 3, 4, 5 and 6.

Groom: the portrait sits inside a jharokha arch about 420 px wide on phones. As the
section pins, two door leaves slide apart to reveal it, the picture pushes in very
slightly, "Abhishek" writes on letter by letter with a gold shimmer sweep, then the two
family lines rise.

Bride: same frame, but a wine veil lifts upward off the portrait. Text: "with", "Shweta",
then her two family lines.

Together: the couple portrait in a wider arch; "Abhishek weds Shweta" and the date; a
heavier petal shower while this section is on screen.

The date: a gold-foil scratch card (canvas, pointer and touch). Scratching about 45% of
it, or pressing the "Reveal" button, uncovers "Saturday, 12th December 2026" with a small
confetti burst. Below it, a flip-clock countdown in days, hours, minutes and seconds to
12 December 2026, 5:30 PM IST (Departure of Barat), computed in Asia/Kolkata regardless
of the visitor's time zone; after that moment it shows a warm "The celebrations have
begun" line instead of zeros. Add an "Add to calendar" control offering a generated .ics
file with all six events and a Google Calendar link for the wedding day.

Never upscale the portraits beyond their natural size. Show me the same screenshot set
as in Phase 2, plus the scratch card half-scratched.
```

### Phase 4: Golden Moments and venue

```text
Read HANDOVER.md and CLAUDE.md first.

Phase 4 of 7: build sections 7 and 8. This is the centrepiece.

Golden Moments: a section heading "Golden Moments", then four day-scenes driven by one
pinned ScrollTrigger timeline. A gold thread (SVG path, drawn with scroll progress) runs
down the page and connects the days. Each day is a card inside an alcove arch: the day
and date as its heading, each event and time on its own line, and an original animated
SVG motif as described under the table in section 5. Each day shifts the light as
described in section 4. As the next day arrives, the previous card scales back and dims
behind it like a deck, but stays readable until it is fully covered. A small four-dot
progress indicator shows which day is active and lets the guest jump to a day.

On phones the cards are stacked vertically; on wide screens the scene may switch to a
horizontal pinned track if it reads better. Use gsap.matchMedia for the two layouts and
for reduced motion, where the days simply appear as a static list with their motifs in
their finished pose.

Venue: an original SVG palace facade whose windows light up from the centre outwards as
it scrolls into view; "VENUE", "Dhusara, Sargam Palace", "Tehsil & Distt. Una, H.P." and
the Hindi note exactly as written; an arch-framed map embed that loads only when it is
near the viewport, and a "Get directions" button that opens Google Maps with the search
"Sargam Palace, Dhusara, Una, Himachal Pradesh". Leave a single clearly named constant
for the exact map pin so it can be replaced later.

Performance budget for this phase: no dropped frames on a mid-range Android (test with
4x CPU throttling); at most 300 SVG elements in any one scene; motifs animate only while
their day is active.
```

### Phase 5: the film (Remotion)

```text
Read HANDOVER.md and CLAUDE.md first. Use the remotion-best-practices, remotion-create,
remotion-markup and remotion-render skills.

Phase 5 of 7: build the invitation film and put it on the page.

1. Add a Remotion project inside this repo under src/remotion, sharing the design tokens,
   fonts, content/wedding.ts and the SVG components from Phase 1. Follow Remotion's
   guidance for using Remotion alongside Next.js.
2. Composition "Invitation": 1080x1920, 30 fps, about 60 seconds, eleven scenes in this
   order and length: invocation 6s, hosts 7s, groom 6s, bride 6s, together 4s, Sunder Kand
   4s, Nanka Mail 4.5s, Sehrabandi and Barat 5s, Vadhu Pravesh 4s, venue 5.5s, closing 8s.
   Each scene uses the same text and motifs as its website section, animated with
   Remotion's frame-based APIs (no CSS transitions, no GSAP inside Remotion). Every line
   stays on screen for at least one second plus 0.3 seconds per word.
3. Composition "OgCard": 1200x630 still with the monogram, "Abhishek weds Shweta" and the
   date, for link previews.
4. Website section 9: embed the film with @remotion/player, lazy-loaded, showing a poster
   frame until tapped, with play/pause and a mute control. No autoplay.
5. Add npm scripts: "film:studio" to preview, "film:render" to render the film to
   out/abhishek-weds-shweta.mp4 (H.264, yuv420p), and "film:og" to render the still to
   public/og.jpg. If public/audio/wedding.mp3 exists, use it as the film's soundtrack with
   a fade-out; otherwise render silent.

Render the film once, confirm the file plays, and show me six still frames spread across
it.
```

### Phase 6: closing, R.S.V.P., sharing, personal touches

```text
Read HANDOVER.md and CLAUDE.md first.

Phase 6 of 7: build section 10 and the site-wide extras.

Closing: Dhruvi's line types itself in a playful handwritten face, as three lines:
"Na koi phone, na koi bahana," / "mere chachu ki shadi me" / "jalul-jalul aana ji..... Dhruvi".
Then "With best compliments from all relatives & friends", the "A & S" monogram seal
spinning in inside the mandala, "R.S.V.P." and "Sharma Family", and the two numbers as
large tap-to-call buttons (tel: links, +91). A row of diyas along the bottom and floating
lanterns rising behind.

Site-wide:
- A floating music toggle, muted by default, shown only if the audio file exists.
- A thin gold scroll-progress bar and a small "back to top" seal.
- A "Share on WhatsApp" button that shares the page link with the text
  "Abhishek weds Shweta, Saturday, 12th December 2026".
- Personal greeting: if the link has ?to=Name, the gate shows "Dear Name," above the
  seal. Sanitise and length-limit the value; with no parameter show nothing.
- Metadata: title, description, Open Graph and Twitter tags using public/og.jpg.
- Privacy: the page shows family phone numbers, so add a robots noindex tag and a
  robots.txt that disallows indexing.

Do not add a contact form, analytics, cookies or any third-party script.
```

### Phase 7: polish, test, ship

```text
Read HANDOVER.md and CLAUDE.md first. Use the web-design-guidelines and
vercel-react-best-practices skills as review checklists.

Phase 7 of 7: make it right, then deploy.

1. Content audit: run the content test, then read the rendered page top to bottom and
   compare every visible string with section 2 of HANDOVER.md. Report any difference.
2. Visual QA with Playwright at 360x740, 390x844, 768x1024 and 1440x900: capture each
   section at rest, check for clipped text, overlaps, text over busy art, and anything
   that moves while it should be read. Fix what you find and re-capture.
3. Reduced motion: with prefers-reduced-motion on, every section must be complete and
   readable with no pinning, and the gate must be skipped.
4. Performance on a throttled mid-range phone profile: Lighthouse mobile performance 90
   or better, LCP under 2.5 s, CLS under 0.05, total JavaScript under 250 kB gzipped on
   first load (the Remotion player and the map load only when needed). Compress images,
   subset fonts, and pause every off-screen animation.
5. Accessibility: keyboard path through the gate, scratch card and day indicator; visible
   focus; alt text for the portraits; text contrast of at least 4.5:1; lang attributes on
   the Devanagari lines.
6. Cross-check on iOS Safari and Android Chrome behaviours: 100vh handling, touch
   scrolling inside pinned sections, audio unlock on first tap.
7. Write README.md: how to run, how to change content, how to replace portraits, music
   and the map pin, how to render the film, how to deploy.
8. Deploy a static build to Vercel and give me the URL. Do not buy or attach a domain.

Finish with a short report: what was checked, what was fixed, what is still open.
```

## 9. Decisions to confirm

| Item | Default used until told otherwise |
|---|---|
| Countdown target | Saturday 12 December 2026, 5:30 PM IST (Departure of Barat) |
| Music | No music until a licensed file is placed at `public/audio/wedding.mp3` |
| Map | Google Maps search for the venue name; exact pin to be supplied |
| Which events are at Sargam Palace | Shown exactly as on the card: one venue block, no per-event venue |
| R.S.V.P. | Tap-to-call on the two printed numbers; WhatsApp buttons only if the family confirms which number uses WhatsApp |
| Language | English with the Sanskrit shlok and the Hindi note, as on the card |
| Domain | Free Vercel address; the site is not indexed by search engines |
| Guest personalisation | Optional `?to=Name` greeting; no guest list is stored |

## 10. Definition of done

- Every string on the page matches section 2 exactly, and the automated content test passes.
- The page works with JavaScript animations off, with reduced motion on, by keyboard, and at 360 px wide.
- The gate opens on the first tap on Android Chrome and iOS Safari.
- All four Golden Moment scenes play smoothly on a mid-range Android phone.
- The film renders to an MP4 and plays in the on-page player.
- Lighthouse mobile performance is 90 or better.
- The link preview in WhatsApp shows the monogram card, the names and the date.

## 11. References

Study these for ideas and patterns. Do not copy their code, artwork or text.

- Royal Indian scroll invitations built with GSAP ScrollTrigger: <https://github.com/rohanuser77/wedding-invitation>, <https://github.com/sagarx16/invifest>, <https://github.com/alphakrishna/harshit-sakshi-wedding-website>
- Envelope opening driven by a GSAP timeline, with skip, keyboard and reduced-motion support: <https://github.com/nurayyna/invitation-website/pull/1>
- Template patterns (film-led opening that scrubs on scroll, event cards that stack and recede, tap-to-open envelope with music toggle): <https://framer.com/templates/wildwood>, <https://www.framer.com/marketplace/templates/velvet-vow/>
- GSAP official AI skills and licence note: <https://github.com/greensock/gsap-skills>
- Remotion Agent Skills: <https://www.remotion.dev/docs/ai/skills>
- Remotion Player: <https://remotion.dev/docs/player/>
- Remotion licence FAQ: <https://www.remotion.dev/docs/license/faq.md>
- Lenis with GSAP ScrollTrigger: <https://npmjs.com/package/lenis>
- Vercel agent skills: <https://vercel.com/docs/agent-resources/skills>
- Anthropic frontend-design plugin: <https://dev.to/nishilbhave/how-to-use-claude-codes-frontend-design-plugin-511i>
