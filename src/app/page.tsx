import { existsSync } from "node:fs";
import path from "node:path";
import { SiteChrome } from "@/components/SiteChrome";
import { Closing } from "@/components/sections/Closing";
import { Gate } from "@/components/sections/Gate";
import { GoldenMoments } from "@/components/sections/GoldenMoments";
import { Hosts } from "@/components/sections/Hosts";
import { Invocation } from "@/components/sections/Invocation";
import { Meeting } from "@/components/sections/Meeting";
import { TheDate } from "@/components/sections/TheDate";
import { Venue } from "@/components/sections/Venue";

// Checked at build time: with no music file, no audio code runs in the browser.
const hasAudio = existsSync(path.join(process.cwd(), "public/audio/wedding.mp3"));

export default function Home() {
  return (
    <>
      <Gate hasAudio={hasAudio} />
      <main>
        <Invocation />
        <Hosts />
        <Meeting />
        <TheDate />
        <GoldenMoments />
        <Venue />
        <Closing />
      </main>
      <SiteChrome hasAudio={hasAudio} />
    </>
  );
}
