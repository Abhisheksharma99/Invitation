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

## Personal links

Put the guest's name at the end of the address and the opening screen greets them:
"Dear Sharma Ji, you are warmly invited to the wedding of Abhishek & Shweta".

| Link | Greeting |
|---|---|
| `https://SITE/Sharma-Ji` | Dear Sharma Ji, (hyphens become spaces) |
| `https://SITE/?to=Sharma Ji` | Dear Sharma Ji, (works on any host, keeps hyphens) |
| `https://SITE/` | no greeting |

The short form needs the rewrite in `vercel.json`. Names may contain letters of any script,
spaces, dots, apostrophes and hyphens, up to 40 characters.

## The film

A 60-second video of the invitation for WhatsApp: `film/abhishek-weds-shweta.mp4`.
It is not shown on the website. Its soundtrack, `public/audio/film.mp3`, is an original
piece synthesised by `scripts/film-music.py`; replace that file with any licensed track
and render again to change the music.

```bash
npm run film:studio   # preview
npm run film:render   # writes out/abhishek-weds-shweta.mp4 (run after `npm run build`, which empties out/);
                      # copy it to film/ to keep it
npm run film:og       # writes public/og.jpg, the link-preview card
```

## Deploy

Hosted on Vercel as a static export. Pushing to `main` deploys. The page is marked
noindex because it shows family phone numbers.
