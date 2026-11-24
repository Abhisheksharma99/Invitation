import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { AbsoluteFill } from "remotion";
import { dhruviLines } from "@/lib/dhruvi";
import { MOMENTS } from "@/components/moments";
import { Arch } from "@/components/ornaments/Arch";
import { Ganesha } from "@/components/ornaments/Ganesha";
import { Kalash } from "@/components/ornaments/Kalash";
import { Mandala } from "@/components/ornaments/Mandala";
import { Palace } from "@/components/ornaments/Palace";
import { Toran } from "@/components/ornaments/Toran";
import { FilmDiya, FilmMotif, FilmPortrait, Rise, Say, ramp, useSeconds } from "./parts";
import { FILM } from "./schedule";

// The eleven scenes. Each mirrors its section of the site: same words, same
// ornaments, same order of events. Sizes are in pixels of a 1080 x 1920 frame.

const column: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: "0 96px",
};
const SCRIPT = "font-script text-gold-pale";
const BOLD = "font-bold";

function Lamps({ from, top }: { from: number; top?: number }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: top === undefined ? 110 : undefined, top, display: "flex", justifyContent: "center", gap: 56 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <FilmDiya key={i} litAt={from + i * 0.28} size={120} />
      ))}
    </div>
  );
}

export function InvocationScene() {
  const t = useSeconds();
  const s = FILM.invocation;
  return (
    <AbsoluteFill style={{ ...column, paddingTop: 120 }}>
      <Rise at={0} distance={0} style={{ width: 560 }}>
        <Arch className="w-full">
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", paddingTop: "24%" }}>
            <div style={{ position: "relative", width: "92%" }}>
              <Mandala rotation={t * 5} className="w-full opacity-45" />
              <Ganesha drawn={ramp(t, 0.2, 2.6)} className="absolute inset-0 m-auto w-[72%]" />
            </div>
          </div>
        </Arch>
      </Rise>
      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 12 }}>
        <Say line={s.salutation} className="font-deva text-gold-pale" style={{ fontSize: 76 }} />
        {s.shlok.map((line) => (
          <Say key={line.text} line={line} className="font-deva" style={{ fontSize: 50, lineHeight: 1.35 }} />
        ))}
        <Say line={s.title} className={SCRIPT} style={{ fontSize: 118, lineHeight: 1.25, marginTop: 8, whiteSpace: "nowrap" }} />
      </div>
      <Lamps from={3.2} />
    </AbsoluteFill>
  );
}

export function HostsScene() {
  const t = useSeconds();
  const s = FILM.hosts;
  const drop = ramp(t, 0, 1.2);
  return (
    <AbsoluteFill style={column}>
      <div style={{ position: "absolute", top: 50, left: 50, right: 50, translate: `0 ${(drop - 1) * 340}px` }}>
        <Toran swags={5} sway={false} />
      </div>
      <div style={{ marginTop: 470, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Say line={s.names} className={`${BOLD} text-gold-pale`} style={{ fontSize: 86, lineHeight: 1.15 }} />
        <div style={{ width: 520 * ramp(t, 0.5, 0.8), height: 3, background: "var(--gold)", margin: "48px 0" }} />
        <Say line={s.invitation} style={{ fontSize: 64, lineHeight: 1.32, maxWidth: 820 }} />
      </div>
      <Rise at={0.8} duration={0.9} style={{ position: "absolute", bottom: 110, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 60 }}>
        <FilmDiya litAt={1.6} size={130} />
        <div style={{ width: 230 }}>
          <Kalash className="block h-auto w-full" />
        </div>
        <FilmDiya litAt={1.9} size={130} />
      </Rise>
    </AbsoluteFill>
  );
}

function Halo() {
  const t = useSeconds();
  return (
    <div style={{ position: "absolute", top: 200, left: 40, right: 40, opacity: 0.22 }}>
      <Mandala rotation={t * 4} className="w-full" />
    </div>
  );
}

function PersonScene({ who }: { who: "groom" | "bride" }) {
  const t = useSeconds();
  const s = FILM[who];
  const uncover = ramp(t, 0.1, 1.1);
  const panel: CSSProperties = { position: "absolute", top: 0, bottom: 0, width: "50%" };
  return (
    <AbsoluteFill style={{ ...column, paddingTop: 330 }}>
      <Halo />
      <FilmPortrait who={who} style={{ position: "relative" }}>
        {who === "groom" ? (
          <>
            <div className="portrait-door border-r-2 border-gold" style={{ ...panel, left: 0, translate: `${-101 * uncover}% 0` }} />
            <div className="portrait-door border-l-2 border-gold" style={{ ...panel, right: 0, translate: `${101 * uncover}% 0` }} />
          </>
        ) : (
          <div className="portrait-veil" style={{ position: "absolute", inset: 0, translate: `0 ${-104 * uncover}%` }} />
        )}
      </FilmPortrait>
      <div style={{ marginTop: 40, position: "relative" }}>
        {"with" in s && <Say line={s.with} className="text-ivory-soft" style={{ fontSize: 56, lineHeight: 1 }} />}
        <Say line={s.name} className={SCRIPT} style={{ fontSize: 230, lineHeight: 1.2 }} />
        <Say line={s.lineage} style={{ fontSize: 54, lineHeight: 1.3, maxWidth: 860 }} />
        <Say line={s.address} className="text-ivory-soft" style={{ fontSize: 54, lineHeight: 1.3, maxWidth: 860, marginTop: 10 }} />
      </div>
    </AbsoluteFill>
  );
}

export const GroomScene = () => <PersonScene who="groom" />;
export const BrideScene = () => <PersonScene who="bride" />;

export function TogetherScene() {
  const t = useSeconds();
  const s = FILM.together;
  const join = ramp(t, 0, 1);
  const half = (side: "left" | "right"): CSSProperties => ({
    clipPath: side === "left" ? "inset(-12% 50% -2% -6%)" : "inset(-12% -6% -2% 50%)",
    translate: `${(side === "left" ? -1 : 1) * (1 - join) * 22}% 0`,
    opacity: join,
  });
  return (
    <AbsoluteFill style={{ ...column, paddingTop: 330 }}>
      <Halo />
      <div style={{ position: "relative" }}>
        <div style={half("left")}>
          <FilmPortrait who="couple" />
        </div>
        <div style={{ ...half("right"), position: "absolute", inset: 0 }}>
          <FilmPortrait who="couple" />
        </div>
      </div>
      <Say line={s.line} className={SCRIPT} style={{ fontSize: 126, lineHeight: 1.25, marginTop: 60, whiteSpace: "nowrap" }} />
      <Say line={s.date} className={BOLD} style={{ fontSize: 66, marginTop: 14 }} />
    </AbsoluteFill>
  );
}

export function MomentScene({ index }: { index: number }) {
  const t = useSeconds();
  const s = FILM.moments[index];
  return (
    <AbsoluteFill style={{ ...column, paddingTop: 110 }}>
      <Say line={s.title} className={SCRIPT} style={{ fontSize: 124, lineHeight: 1.2 }} />
      <div
        className="moment-card border-2 border-gold bg-wine-panel"
        style={{ position: "relative", overflow: "hidden", marginTop: 40, width: 888, height: 1400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56 }}
      >
        <div style={{ position: "absolute", inset: 0, background: MOMENTS[index].light }} />
        <div style={{ position: "relative" }}>
          <FilmMotif index={index} p={Math.min(1, t / (s.seconds - 0.7))} width={720} />
        </div>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <Say line={s.day} className={`${BOLD} text-gold-pale`} style={{ fontSize: 58 }} />
          {s.events.map((event) => (
            <div key={event.name.text}>
              <Say line={event.name} className={BOLD} style={{ fontSize: 92, lineHeight: 1.1 }} />
              <Say line={event.time} className="text-gold" style={{ fontSize: 66, lineHeight: 1.2 }} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function LitPalace() {
  const t = useSeconds();
  const ref = useRef<HTMLDivElement>(null);
  // windows light from the centre outwards
  useLayoutEffect(() => {
    ref.current?.querySelectorAll<SVGElement>(".palace-light").forEach((light) => {
      light.style.opacity = String(ramp(t, 0.3 + Number(light.dataset.reach) * 1.5, 0.6));
    });
  }, [t]);
  return (
    <div ref={ref} style={{ width: 900 }}>
      <Palace className="block h-auto w-full" />
    </div>
  );
}

export function VenueScene() {
  const s = FILM.venue;
  return (
    <AbsoluteFill style={{ ...column, paddingTop: 460 }}>
      <LitPalace />
      <Say line={s.label} className={`${BOLD} text-gold`} style={{ fontSize: 54, letterSpacing: "0.35em", marginTop: 110 }} />
      <Say line={s.name} className={`${BOLD} text-gold-pale`} style={{ fontSize: 100, lineHeight: 1.15, marginTop: 10 }} />
      <Say line={s.address} style={{ fontSize: 64, marginTop: 6 }} />
    </AbsoluteFill>
  );
}

export function ClosingScene() {
  const t = useSeconds();
  const s = FILM.closing;
  const lines = dhruviLines();
  const total = lines.join("").length;
  const typed = Math.floor(total * Math.min(1, Math.max(0, (t - s.dhruvi.at) / s.dhruvi.settle)));
  const seal = ramp(t, s.monogram.at, s.monogram.settle);
  const starts = lines.map((_, i) => lines.slice(0, i).join("").length);
  return (
    <AbsoluteFill style={{ ...column, paddingTop: 170 }}>
      <div className="font-hand text-gold-pale" style={{ fontSize: 64, lineHeight: 1.35, whiteSpace: "nowrap" }}>
        {lines.map((line, i) => {
          const shown = Math.min(line.length, Math.max(0, typed - starts[i]));
          return (
            <div key={line}>
              {line.slice(0, shown)}
              <span style={{ opacity: 0 }}>{line.slice(shown)}</span>
            </div>
          );
        })}
      </div>
      <Say line={s.compliments} style={{ fontSize: 54, lineHeight: 1.3, marginTop: 60, maxWidth: 800 }} />
      <div style={{ width: 420, marginTop: 44, opacity: seal, scale: String(0.6 + 0.4 * seal), rotate: `${(1 - seal) * -160}deg` }}>
        <Mandala className="w-full">
          <span className={SCRIPT} style={{ fontSize: 100, rotate: `${(1 - seal) * 160}deg`, background: "var(--wine)", borderRadius: "50%", padding: "34px 30px", lineHeight: 1 }}>
            {s.monogram.text}
          </span>
        </Mandala>
      </div>
      <Say line={s.rsvp} className={`${BOLD} text-gold`} style={{ fontSize: 60, letterSpacing: "0.2em", marginTop: 40 }} />
      <Say line={s.family} className={BOLD} style={{ fontSize: 84, lineHeight: 1.15 }} />
      <Say line={s.phones} className="text-gold-pale" style={{ fontSize: 64, marginTop: 6 }} />
      <Lamps from={4.6} />
    </AbsoluteFill>
  );
}
