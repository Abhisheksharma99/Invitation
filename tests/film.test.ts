import { describe, expect, it } from "vitest";
import { wedding } from "../content/wedding";
import { dhruviLines } from "../src/lib/dhruvi";
import { FILM, FPS, SCENE_SECONDS, TOTAL_FRAMES, type Line } from "../src/remotion/schedule";

const isLine = (value: unknown): value is Line =>
  typeof value === "object" && value !== null && "text" in value && "at" in value && "settle" in value;

/** Every line of a scene, however it is nested. */
function linesOf(scene: unknown): Line[] {
  if (isLine(scene)) return [scene];
  if (scene && typeof scene === "object") return Object.values(scene).flatMap(linesOf);
  return [];
}

const scenes = [FILM.invocation, FILM.hosts, FILM.meeting, ...FILM.moments, FILM.venue, FILM.closing];

describe("the film", () => {
  it("has nine scenes and runs sixty seconds", () => {
    // HANDOVER.md gave groom 6 s, bride 6 s and together 4 s; they are now one 16 s scene, as on the website
    expect(SCENE_SECONDS).toEqual([6, 7, 16, 4, 4.5, 5, 4, 5.5, 8]);
    expect(TOTAL_FRAMES).toBe(60 * FPS);
  });

  it("keeps every line readable for at least 1 s plus 0.3 s per word", () => {
    const tooShort: string[] = [];
    for (const scene of scenes) {
      for (const line of linesOf(scene)) {
        const words = line.text.trim().split(/\s+/).length;
        const readable = scene.seconds - (line.at + line.settle);
        const needed = 1 + 0.3 * words;
        if (readable < needed - 1e-9) tooShort.push(`${line.text}: ${readable.toFixed(2)}s of ${needed.toFixed(2)}s`);
      }
    }
    expect(tooShort).toEqual([]);
  });

  it("breaks Dhruvi's line in three without changing a letter", () => {
    expect(dhruviLines()).toEqual([
      "Na koi phone, na koi bahana,",
      "mere chachu ki shadi me",
      "jalul-jalul aana ji..... Dhruvi",
    ]);
    expect(dhruviLines().join(" ")).toBe(wedding.closing.dhruvi);
  });
});
