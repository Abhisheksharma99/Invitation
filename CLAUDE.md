@AGENTS.md

# Abhishek weds Shweta: project rules

`HANDOVER.md` is the brief. Read it before any phase. These rules hold in every phase.

## Content

- Every visible string comes from `content/wedding.ts`. Components never hard-code invitation text.
- `content/wedding.ts` mirrors section 2 of `HANDOVER.md` exactly. Never change names, dates, times, spellings, punctuation or honorifics. Never add events, relatives, quotes, hashtags or a story.
- `npm test` compares the two files string for string. It must pass before a phase is called done.
- Interface labels that are not on the card ("Tap to open", "Get directions") are allowed only where a phase prompt in `HANDOVER.md` names them.

## Design context

- **Audience:** family and friends of all ages, arriving from a WhatsApp link on a mid-range Android phone. Desktop is secondary.
- **Tone:** royal, warm, traditional. A palace at lamp-light. Playful only in Dhruvi's line.
- **Job:** read every name, date, time and the venue without effort. Animation delights but never hides or delays information.

## Colour and type

- Only four colours: wine `#4A0D1C`, gold `#D4A84B`, ivory `#FFF3DC`, marigold `#F08A24`, and mixes of them. They live in `src/app/globals.css` as CSS variables and Tailwind colours (`bg-wine`, `text-gold-pale`, and so on). No other hex, no black, white or grey. A new tone is a new `color-mix` token there.
- Fonts: `font-script` (Great Vibes) for names, `font-serif` (Cormorant Garamond 500/700) for everything else, `font-deva` (Tiro Devanagari Hindi) for Devanagari, `font-hand` (Gochi Hand) for Dhruvi's line only. Devanagari lines carry `lang="sa"`.
- All artwork is original inline SVG from `src/components/ornaments`. The only pictures are the three portraits in `public/portraits`, never shown wider than their natural size. No stock images, no downloaded clip-art.

## Motion

- Animate `transform` and `opacity` only. The one exception is drawing SVG strokes on (DrawSVG).
- Slow, graceful, eased. Nothing bounces or flashes. Text never moves while it is being read and is never animated out while in view.
- Every scroll scene has a reduced-motion version: complete, readable, no pinning. Read the flag from `useReducedMotion()` or use `gsap.matchMedia`.
- GSAP plugins are registered once in `src/components/motion/MotionProvider.tsx`. Use `useGSAP` with a `scope`; never a bare `useEffect` for GSAP.
- Lenis runs from the GSAP ticker in `MotionProvider` and is off for reduced motion and low-end devices. Reach it with `useMotion().getLenis()`; it may be null.
- Anything that animates on its own pauses while off-screen.
- Golden Moments motifs (`src/components/moments`) are drawn in their finished pose and moved by a pure `pose(svg, p)` function. The scroll scene and the film both call it; change a motif's motion there, once.

## The film

- Lives in `src/remotion`. It reuses the site's components and `content/wedding.ts`. Inside it, everything moves by frame number: no GSAP, no CSS animation or transition (the `.film` class switches those off).
- Its scenes follow the website: when a section of the site changes, change the matching scene.
- Soundtrack: `public/audio/film.mp3` (made by `scripts/film-music.py`). `public/audio/wedding.mp3`, if ever added, is the website's own music and switches the music toggle on.
- `src/remotion/schedule.ts` holds every line's timing. `npm test` fails if a line is on screen for less than 1 s plus 0.3 s per word, or if the scene lengths change.
- The film is a file for WhatsApp only. It is not shown on the website (removed at the couple's request), so nothing from `src/remotion` may be imported by the site.

## Layout and build

- Mobile first at 390 px wide; check 360 px. Desktop comes after.
- Static export (`output: "export"`): no server code, no `next/image` optimisation. The only route handler is the static `wedding.ics` (`dynamic = "force-static"`).
- Keep `remotion` and every `@remotion/*` package on the same exact version.
- No analytics, cookies, forms or third-party scripts.

## Commands

- `npm run dev`: develop. `/kitchen-sink` shows every building block.
- `npm run lint`, `npm run typecheck`, `npm test`: run all three before finishing a phase.
- `npm run portraits`: regenerate WebP/AVIF after replacing a PNG in `public/portraits`.
- `npm run film:studio` previews the film; `film:render` writes `out/abhishek-weds-shweta.mp4` (the kept copy is `film/abhishek-weds-shweta.mp4`); `film:og` writes `public/og.jpg`.
- `npm run build` empties `out/`, including a rendered film. Render the film after building.
- Screenshots of finished phases are in `screenshots/phase-N/`.
