# Abhishek weds Shweta

A single-page, mobile-first wedding invitation for Saturday, 12th December 2026.
`HANDOVER.md` is the brief; `CLAUDE.md` holds the project rules.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run lint`, `npm run typecheck` and `npm test` should all pass before a change ships.
`npm run build` writes the static site to `out/`.

## Change things

| What | Where |
|---|---|
| Any text on the invitation | `content/wedding.ts`, and the same line in section 2 of `HANDOVER.md` (a test compares the two) |
| Portraits | Replace the PNG in `public/portraits/` under the same name, then `npm run portraits` |
| Music | Add `public/audio/wedding.mp3`; the music toggle appears by itself |
| Exact map pin | `VENUE_MAP_PIN` in `src/lib/venue.ts` |

## The film

A 60-second video of the invitation for WhatsApp. It is not shown on the website.

```bash
npm run film:studio   # preview
npm run film:render   # writes out/abhishek-weds-shweta.mp4 (run after `npm run build`, which empties out/)
npm run film:og       # writes public/og.jpg, the link-preview card
```

## Deploy

Hosted on Vercel as a static export. Pushing to `main` deploys. The page is marked
noindex because it shows family phone numbers.
