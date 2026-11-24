// Generates WebP and AVIF versions of the portraits at their natural size.
// Run again (npm run portraits) whenever a PNG in public/portraits is replaced.
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("public/portraits");
const files = (await readdir(dir)).filter((f) => f.endsWith(".png"));

for (const file of files) {
  const src = path.join(dir, file);
  const base = src.slice(0, -4);
  const { width, height } = await sharp(src).metadata();
  await sharp(src).webp({ quality: 82 }).toFile(`${base}.webp`);
  await sharp(src).avif({ quality: 60 }).toFile(`${base}.avif`);
  console.log(`${file}: ${width} x ${height} -> webp, avif`);
}
