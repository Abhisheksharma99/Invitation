// npm run film:studio | film:render | film:og
// Wraps the Remotion CLI so the film gets a soundtrack only when one exists.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const ENTRY = "src/remotion/index.ts";
const commands = {
  studio: ["studio", ENTRY],
  render: ["render", ENTRY, "Invitation", "out/abhishek-weds-shweta.mp4", "--codec=h264", "--pixel-format=yuv420p"],
  og: ["still", ENTRY, "OgCard", "public/og.jpg", "--image-format=jpeg", "--jpeg-quality=90"],
};

const args = commands[process.argv[2]];
if (!args) {
  console.error(`Usage: node scripts/film.mjs ${Object.keys(commands).join(" | ")}`);
  process.exit(1);
}

// The film's own soundtrack first (scripts/film-music.py makes one), else the site's music, else silence.
const audio = ["audio/film.mp3", "audio/wedding.mp3"].find((file) => existsSync(`public/${file}`)) ?? "";
console.log(audio ? `Soundtrack: public/${audio}` : "No soundtrack in public/audio: rendering silent.");

const result = spawnSync("npx", ["remotion", ...args, ...process.argv.slice(3)], {
  stdio: "inherit",
  env: { ...process.env, REMOTION_FILM_AUDIO: audio },
});
process.exit(result.status ?? 1);
