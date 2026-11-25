import type { CSSProperties, ReactNode } from "react";
import { Composition, Still } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadHand } from "@remotion/google-fonts/GochiHand";
import { loadFont as loadScript } from "@remotion/google-fonts/GreatVibes";
import { loadFont as loadDevanagari } from "@remotion/google-fonts/TiroDevanagariHindi";
import "../app/globals.css";
import { Invitation, type InvitationProps } from "./Invitation";
import { OgCard } from "./OgCard";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./schedule";

// Entry for the Remotion CLI and Studio only. On the website the same
// components take their fonts from next/font;
// here the fonts are loaded for the renderer and given the same variable names.
const fonts = {
  "--font-great-vibes": loadScript("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  "--font-cormorant": loadSerif("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily,
  "--font-tiro-devanagari": loadDevanagari("normal", { weights: ["400"], subsets: ["devanagari", "latin"] }).fontFamily,
  "--font-gochi-hand": loadHand("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
} as CSSProperties;

const WithFonts = ({ children }: { children: ReactNode }) => (
  <div style={{ ...fonts, position: "absolute", inset: 0 }}>{children}</div>
);

const InvitationFilm = (props: InvitationProps) => (
  <WithFonts>
    <Invitation {...props} />
  </WithFonts>
);

const OgStill = () => (
  <WithFonts>
    <OgCard />
  </WithFonts>
);

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="Invitation"
        component={InvitationFilm}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={TOTAL_FRAMES}
        // set by scripts/film.mjs to the soundtrack it found, if any
        defaultProps={{ audio: process.env.REMOTION_FILM_AUDIO || null }}
      />
      <Still id="OgCard" component={OgStill} width={1200} height={630} />
    </>
  );
}
