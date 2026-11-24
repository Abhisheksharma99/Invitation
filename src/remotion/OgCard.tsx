import { AbsoluteFill } from "remotion";
import { wedding } from "@content/wedding";
import { JaalBackground } from "@/components/ornaments/JaalBackground";
import { Mandala } from "@/components/ornaments/Mandala";

/** 1200 x 630 still for link previews: monogram, the couple's line, the date. */
export function OgCard() {
  return (
    <AbsoluteFill
      className="film font-serif text-ivory"
      style={{ background: "radial-gradient(ellipse 70% 90% at 28% 50%, var(--wine-raised), var(--wine) 80%)" }}
    >
      <JaalBackground opacity={0.1} cell={90} />
      <div style={{ position: "absolute", inset: 22, border: "3px solid var(--gold)" }} />
      <div style={{ position: "absolute", inset: 34, border: "1.5px solid var(--brass)" }} />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 80px", gap: 56 }}>
        <div style={{ width: 400, flexShrink: 0 }}>
          <Mandala className="w-full">
            <span
              className="font-script text-gold-pale"
              style={{ fontSize: 104, lineHeight: 1, background: "var(--wine)", borderRadius: "50%", padding: "30px 24px" }}
            >
              {wedding.monogram}
            </span>
          </Mandala>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div className="font-script text-gold-pale" style={{ fontSize: 108, lineHeight: 1.2 }}>
            {wedding.couple.line}
          </div>
          <div style={{ width: 300, height: 2, background: "var(--gold)", margin: "22px auto" }} />
          <div className="font-bold" style={{ fontSize: 46 }}>
            {wedding.couple.date}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
