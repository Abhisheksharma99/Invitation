import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { AbsoluteFill, random } from "remotion";
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

// The nine scenes. Each mirrors its section of the site: same words, same
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

// the varmala, in % of the row of arches (the same curve as on the website)
const garlandPoint = (t: number) => ({
  x: (1 - t) ** 2 * 23 + 2 * (1 - t) * t * 50 + t ** 2 * 77,
  y: (1 - t) ** 2 * 8 + 2 * (1 - t) * t * 58 + t ** 2 * 8,
});
const BLOOMS = Array.from({ length: 15 }, (_, i) => ({ ...garlandPoint(i / 14), alt: i % 2 === 1, big: i === 7 }));
const GLINTS = [
  [-7, 30, 34], [105, 24, 28], [4, 8, 22], [97, 52, 26], [-5, 68, 22],
];

/** One arch of the couple scene: glow, portrait out of shadow, its cover, glints. */
function FilmJharokha({ who, from }: { who: "groom" | "bride"; from: number }) {
  const t = useSeconds();
  const open = ramp(t, from, 1.5);
  return (
    <div style={{ position: "relative", width: "46%" }}>
      <div
        style={{
          position: "absolute",
          inset: "-18%",
          opacity: 0.7 * ramp(t, from + 0.1, 1.2),
          background: "radial-gradient(ellipse at 50% 55%, color-mix(in oklab, var(--saffron) 55%, transparent), transparent 68%)",
        }}
      />
      <FilmPortrait who={who} style={{ width: "100%" }} zoom={1.18 - 0.18 * ramp(t, from, 2)}>
        <div style={{ position: "absolute", inset: 0, background: "var(--wine)", opacity: 0.8 * (1 - ramp(t, from + 0.3, 1.4)) }} />
        <div style={{ position: "absolute", inset: 0, perspective: 700 }}>
          {who === "groom" ? (
            <>
              <div className="portrait-door" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "50%", transformOrigin: "0 50%", backfaceVisibility: "hidden", transform: `rotateY(${-112 * open}deg)` }} />
              <div className="portrait-door" style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "50%", transformOrigin: "100% 50%", backfaceVisibility: "hidden", transform: `rotateY(${112 * open}deg)` }} />
            </>
          ) : (
            <>
              <div className="portrait-veil-sheer" style={{ position: "absolute", inset: 0, transformOrigin: "50% 0", transform: `translateY(${-108 * ramp(t, from + 0.35, 1.4)}%) rotateX(${24 * open}deg)` }} />
              <div className="portrait-veil" style={{ position: "absolute", inset: 0, transformOrigin: "50% 0", transform: `translateY(${-108 * open}%) rotateX(${38 * open}deg)` }} />
            </>
          )}
        </div>
      </FilmPortrait>
      {GLINTS.map(([left, top, size], i) => {
        const k = ramp(t, from + 1.4 + i * 0.12, 0.45);
        return (
          <svg key={i} viewBox="-10 -10 20 20" style={{ position: "absolute", left: `${left}%`, top: `${top}%`, width: size, opacity: k, scale: String(k), rotate: `${(1 - k) * -90}deg` }}>
            <path d="M0 -10L2 -2L10 0L2 2L0 10L-2 2L-10 0L-2 -2Z" fill="var(--gold-pale)" />
          </svg>
        );
      })}
    </div>
  );
}

// fireworks: when (s), where (px), which of the three colours
const BURSTS = [
  [11.0, 250, 330, 0], [11.4, 820, 260, 1], [11.9, 540, 190, 2], [12.5, 180, 620, 1], [12.9, 900, 560, 0], [13.6, 560, 380, 2], [14.2, 300, 240, 0],
];
const SPARK_COLOURS = ["var(--gold)", "var(--marigold)", "var(--ivory)"];

function FilmFireworks() {
  const t = useSeconds();
  return (
    <AbsoluteFill>
      {BURSTS.flatMap(([at, x, y, colour], b) => {
        const age = t - at;
        if (age < 0 || age > 1.9) return [];
        return Array.from({ length: 40 }, (_, i) => {
          const angle = (i / 40) * Math.PI * 2 + random(`a${b}-${i}`) * 0.2;
          const reach = (230 + random(`r${b}-${i}`) * 150) * (1 - Math.exp(-2.4 * age));
          const fade = 1 - age / 1.9;
          return (
            <div
              key={`${b}-${i}`}
              style={{
                position: "absolute",
                left: x + Math.cos(angle) * reach,
                top: y + Math.sin(angle) * reach + 55 * age * age,
                width: 22 * fade + 4,
                height: 5,
                borderRadius: 3,
                background: random(`c${b}-${i}`) < 0.75 ? SPARK_COLOURS[colour] : SPARK_COLOURS[2],
                opacity: fade,
                rotate: `${angle}rad`,
              }}
            />
          );
        });
      })}
    </AbsoluteFill>
  );
}

export function MeetingScene() {
  const t = useSeconds();
  const s = FILM.meeting;
  const strung = ramp(t, 9.2, 1.5);
  const lines: CSSProperties = { fontSize: 44, lineHeight: 1.3, maxWidth: 880 };
  return (
    <AbsoluteFill style={{ ...column, paddingTop: 170 }}>
      <div style={{ position: "relative", width: 900, display: "flex", justifyContent: "space-between" }}>
        <FilmJharokha who="groom" from={0.3} />
        <FilmJharokha who="bride" from={5.3} />
        {/* the varmala */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
          <path d="M23 8Q50 58 77 8" stroke="var(--brass)" strokeWidth="0.6" pathLength="1" strokeDasharray="1 1.2" strokeDashoffset={1.1 * (1 - strung)} />
        </svg>
        {BLOOMS.map((bloom, i) => {
          const k = ramp(t, 9.4 + i * 0.09, 0.35);
          return (
            <span
              key={i}
              className={`garland-bloom ${bloom.alt ? "bg-saffron" : "bg-marigold"}`}
              style={{ position: "absolute", borderRadius: "50%", left: `${bloom.x}%`, top: `${bloom.y}%`, width: bloom.big ? "7.5%" : "5.2%", opacity: k, scale: String(k) }}
            />
          );
        })}
        <div style={{ position: "absolute", left: "50%", top: `${garlandPoint(0.5).y + 3}%`, translate: "-50% 0", display: "flex", gap: 8, opacity: ramp(t, 10.6, 0.5) }}>
          {[44, 68, 44].map((height, n) => (
            <span key={n} className="garland-tassel" style={{ height, width: 9 }} />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Say line={s.groomName} className={SCRIPT} style={{ fontSize: 136, lineHeight: 1.18 }} />
        <Say line={s.groomLineage} style={lines} />
        <Say line={s.groomAddress} className="text-ivory-soft" style={lines} />
        <Say line={s.with} className="text-gold" style={{ fontSize: 46, lineHeight: 1, marginTop: 22 }} />
        <Say line={s.brideName} className={SCRIPT} style={{ fontSize: 136, lineHeight: 1.18 }} />
        <Say line={s.brideLineage} style={lines} />
        <Say line={s.brideAddress} className="text-ivory-soft" style={lines} />
        <Say line={s.couple} className={SCRIPT} style={{ fontSize: 104, lineHeight: 1.25, marginTop: 44, whiteSpace: "nowrap" }} />
        <Say line={s.date} className={BOLD} style={{ fontSize: 54 }} />
      </div>
      <FilmFireworks />
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
