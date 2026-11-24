import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PORTRAITS } from "@/components/Portrait";
import { MOMENTS } from "@/components/moments";
import { Arch } from "@/components/ornaments/Arch";
import { Diya } from "@/components/ornaments/Diya";
import { JaalBackground } from "@/components/ornaments/JaalBackground";
import { HEIGHT, WIDTH, type Line } from "./schedule";

// Shared pieces of the film. Everything here moves by frame number only.

const GRACE = Easing.bezier(0.22, 1, 0.36, 1);

/** Seconds into the current scene. */
export function useSeconds() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
}

/** 0 before `at`, easing to 1 over `duration` seconds. */
export const ramp = (seconds: number, at: number, duration = 0.6) =>
  duration <= 0
    ? Number(seconds >= at)
    : interpolate(seconds, [at, at + duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: GRACE,
      });

/** Fades and rises its children into place, then leaves them still. */
export function Rise({
  at,
  duration = 0.6,
  distance = 34,
  style,
  className,
  children,
}: {
  at: number;
  duration?: number;
  distance?: number;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  const k = ramp(useSeconds(), at, duration);
  return (
    <div className={className} style={{ ...style, opacity: k, translate: `0 ${(1 - k) * distance}px` }}>
      {children}
    </div>
  );
}

/** One scheduled line of text. */
export function Say({ line, className = "", style }: { line: Line; className?: string; style?: CSSProperties }) {
  return (
    <Rise at={line.at} duration={line.settle} distance={line.settle ? 26 : 0} className={className} style={style}>
      {line.text}
    </Rise>
  );
}

/** The ground of every scene: lamp-lit wine, lattice, drifting petals, a printed card's border. */
export function Ground() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 55% at 50% 36%, var(--wine-raised), var(--wine) 78%)" }}>
      <JaalBackground opacity={0.1} cell={120} />
      {Array.from({ length: 18 }, (_, i) => {
        const size = 12 + random(`size${i}`) * 14;
        const fall = 46 + random(`fall${i}`) * 60;
        const phase = random(`phase${i}`) * Math.PI * 2;
        const x = random(`x${i}`) * WIDTH + Math.sin(t * 0.7 + phase) * 46;
        const y = ((random(`y${i}`) * (HEIGHT + 200) + t * fall) % (HEIGHT + 200)) - 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size * 1.6,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              background: random(`c${i}`) < 0.7 ? "var(--marigold)" : "var(--gold)",
              opacity: 0.6,
              rotate: `${phase * 57 + t * (30 + random(`r${i}`) * 50)}deg`,
              scale: `1 ${0.5 + 0.5 * Math.abs(Math.cos(t * 1.1 + phase))}`,
            }}
          />
        );
      })}
      <div style={{ position: "absolute", inset: 34, border: "3px solid var(--gold)" }} />
      <div style={{ position: "absolute", inset: 48, border: "1.5px solid var(--brass)" }} />
    </AbsoluteFill>
  );
}

/** A lamp that is lit at a given second. */
export function FilmDiya({ litAt, size, style }: { litAt: number; size: number; style?: CSSProperties }) {
  const t = useSeconds();
  const lit = ramp(t, litAt, 0.5);
  // a slow breathing of the flame, from the frame count
  const breathe = 1 + 0.04 * Math.sin(t * 9 + litAt * 7);
  return (
    <div style={{ position: "relative", width: size, ...style }}>
      <Diya lit={false} className="block w-full" />
      <div style={{ position: "absolute", inset: 0, opacity: lit, scale: `1 ${breathe}`, transformOrigin: "50% 60%" }}>
        <Diya className="block w-full" />
      </div>
    </div>
  );
}

/** A portrait in its arch, at no more than the picture's own size. */
export function FilmPortrait({
  who,
  children,
  style,
}: {
  who: keyof typeof PORTRAITS;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const p = PORTRAITS[who];
  const width = Math.floor(p.width / 0.94); // the picture fills 94% of the arch
  return (
    <div style={{ width, ...style }}>
      <Arch wide={who === "couple"} className="w-full">
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, var(--wine-raised), var(--wine-panel))" }} />
        <Img
          src={staticFile(`portraits/${p.file}.webp`)}
          alt=""
          style={{
            position: "absolute",
            left: "3%",
            top: `${p.top}%`,
            width: "94%",
            maskImage: "linear-gradient(to bottom, transparent 0, black 5%)",
          }}
        />
        {children}
      </Arch>
    </div>
  );
}

/** A Golden Moment motif posed for progress p (0 to 1). */
export function FilmMotif({ index, p, width }: { index: number; p: number; width: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { Motif, pose } = MOMENTS[index];
  useLayoutEffect(() => {
    const svg = ref.current?.querySelector("svg");
    if (svg) pose(svg, p);
  }, [pose, p]);
  return (
    <div ref={ref} style={{ width }}>
      <Motif className="block h-auto w-full overflow-visible" />
    </div>
  );
}
