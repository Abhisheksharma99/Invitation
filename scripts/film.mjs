// npm run film:studio | film:render | film:og
// Wraps the Remotion CLI so the film gets its soundtrack only when the file exists.
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

const hasAudio = existsSync("public/audio/wedding.mp3");
console.log(hasAudio ? "Soundtrack: public/audio/wedding.mp3" : "No public/audio/wedding.mp3: rendering silent.");

const result = spawnSync("npx", ["remotion", ...args, ...process.argv.slice(3)], {
  stdio: "inherit",
  env: { ...process.env, REMOTION_HAS_AUDIO: hasAudio ? "1" : "0" },
});
process.exit(result.status ?? 1);
