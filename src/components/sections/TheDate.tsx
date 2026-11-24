"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { wedding } from "@content/wedding";
import { countdownTarget, utcStamp, weddingDayEvents } from "@/lib/events";
import { useMotion } from "@/components/motion/MotionProvider";
import { JaalBackground } from "@/components/ornaments/JaalBackground";

/* ── Scratch card ───────────────────────────────────────────────────────── */

const GRID = { cols: 24, rows: 10 };
const REVEAL_AT = 0.45;

function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const scratched = useRef(new Set<number>());
  const last = useRef<{ x: number; y: number } | null>(null);
  const { lowEnd } = useMotion();

  // Lay the gold foil. With no JavaScript the canvas stays clear and the date simply shows.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const css = getComputedStyle(canvas);
    const colour = (name: string) => css.getPropertyValue(name).trim();

    const paint = () => {
      if (!canvas.isConnected) return; // the card has left the page (fonts can finish loading after that)
      if (scratched.current.size > 0) return; // never repaint over a guest's scratching
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = colour("--gold");
      ctx.fillRect(0, 0, w, h);
      // bands of sheen
      const sheen = ctx.createLinearGradient(0, 0, w, h);
      const ivory = colour("--ivory");
      for (const [stop, alpha] of [[0, 0.1], [0.22, 0.55], [0.4, 0.05], [0.62, 0.45], [0.8, 0.05], [1, 0.3]]) {
        // #rrggbb plus a two-digit alpha
        sheen.addColorStop(stop, ivory + Math.round(alpha * 255).toString(16).padStart(2, "0"));
      }
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, w, h);
      // foil grain
      for (let i = 0; i < 900; i++) {
        ctx.globalAlpha = Math.random() * 0.22;
        ctx.fillStyle = Math.random() < 0.5 ? colour("--ivory") : colour("--wine");
        ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2);
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colour("--wine");
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      ctx.strokeRect(7.5, 7.5, w - 15, h - 15);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = colour("--wine");
      ctx.font = `700 ${Math.round(Math.min(w / 13, 28))}px ${css.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Scratch to reveal", w / 2, h / 2);
      ctx.globalAlpha = 1;
    };

    paint();
    document.fonts.ready.then(paint);
    const resizer = new ResizeObserver(paint);
    resizer.observe(canvas);
    return () => resizer.disconnect();
  }, []);

  const reveal = async () => {
    if (revealed) return;
    setRevealed(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { default: confetti } = await import("canvas-confetti");
    const box = canvas.getBoundingClientRect();
    const css = getComputedStyle(canvas);
    confetti({
      particleCount: lowEnd ? 18 : 40,
      spread: 75,
      startVelocity: 22,
      scalar: 0.8,
      ticks: 160,
      gravity: 0.8,
      colors: ["--marigold", "--gold", "--ivory"].map((name) => css.getPropertyValue(name).trim()),
      origin: {
        x: (box.left + box.width / 2) / window.innerWidth,
        y: (box.top + box.height / 2) / window.innerHeight,
      },
      disableForReducedMotion: true,
    });
  };

  const scratch = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const box = canvas.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    const from = last.current ?? { x, y };
    last.current = { x, y };

    const brush = Math.max(44, box.width / 6);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = brush;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";

    // Count coverage on a coarse grid: cheap, and good enough for "about 45%".
    const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / 8));
    const cellW = box.width / GRID.cols;
    const cellH = box.height / GRID.rows;
    for (let s = 0; s <= steps; s++) {
      const px = from.x + ((x - from.x) * s) / steps;
      const py = from.y + ((y - from.y) * s) / steps;
      for (let c = Math.floor((px - brush / 2) / cellW); c <= Math.floor((px + brush / 2) / cellW); c++) {
        for (let r = Math.floor((py - brush / 2) / cellH); r <= Math.floor((py + brush / 2) / cellH); r++) {
          if (c < 0 || r < 0 || c >= GRID.cols || r >= GRID.rows) continue;
          const dx = (c + 0.5) * cellW - px;
          const dy = (r + 0.5) * cellH - py;
          if (Math.hypot(dx, dy) <= brush / 2) scratched.current.add(r * GRID.cols + c);
        }
      }
    }
    if (scratched.current.size / (GRID.cols * GRID.rows) >= REVEAL_AT) void reveal();
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative aspect-[5/2] w-[min(100%,27rem)] border-2 border-gold bg-wine-panel">
        <p
          data-testid="revealed-date"
          className="grid h-full place-items-center text-balance px-4 text-[clamp(1.5rem,6.8vw,2.25rem)] font-bold leading-tight text-gold-pale"
        >
          {wedding.couple.date}
        </p>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full cursor-grab touch-none transition-opacity duration-700 ${
            revealed ? "pointer-events-none opacity-0" : ""
          }`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            last.current = null;
            scratch(event);
          }}
          onPointerMove={(event) => {
            if (event.buttons || event.pointerType === "touch") scratch(event);
          }}
          onPointerUp={() => (last.current = null)}
          onPointerCancel={() => (last.current = null)}
        />
      </div>
      <button
        type="button"
        onClick={reveal}
        className={`cursor-pointer rounded-full border border-gold px-7 py-2 text-lg font-bold uppercase tracking-[0.2em] transition-opacity duration-500 ${
          revealed ? "invisible opacity-0" : ""
        }`}
      >
        Reveal
      </button>
    </div>
  );
}

/* ── Countdown ──────────────────────────────────────────────────────────── */

const subscribeToSeconds = (onTick: () => void) => {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
};

// label, seconds in one unit, how many of the unit before it rolls over
const UNITS: [string, number, number][] = [
  ["Days", 86400, Infinity],
  ["Hours", 3600, 24],
  ["Minutes", 60, 60],
  ["Seconds", 1, 60],
];

function Countdown() {
  // Seconds since 1970 are the same everywhere, so the count is right in any time zone.
  const now = useSyncExternalStore(
    subscribeToSeconds,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
  const left = now === null ? null : Math.floor(countdownTarget.getTime() / 1000) - now;

  if (left !== null && left <= 0) {
    return (
      <p className="font-script text-[clamp(2.4rem,10vw,3.75rem)] leading-tight text-gold-pale">
        The celebrations have begun
      </p>
    );
  }

  return (
    <dl className="grid grid-cols-4 gap-[clamp(0.4rem,2.5vw,1rem)]" aria-live="off">
      {UNITS.map(([label, size, wrap]) => {
        const value = Math.floor((left ?? 0) / size) % wrap;
        const text = left === null ? "--" : String(value).padStart(2, "0");
        return (
          <div key={label} className="flex flex-col-reverse items-center gap-1.5">
            <dt className="text-[clamp(0.8rem,3.4vw,1rem)] font-bold uppercase tracking-[0.14em] text-ivory-soft">
              {label}
            </dt>
            <dd className="flip-tile relative grid h-[clamp(4rem,19vw,5.5rem)] w-[clamp(4rem,19vw,5.5rem)] place-items-center overflow-hidden rounded-md border border-gold/70 bg-wine-panel text-[clamp(2rem,9.5vw,2.9rem)] font-bold tabular-nums text-gold-pale">
              <span key={text} className="flip-digit">
                {text}
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

/* ── Add to calendar ────────────────────────────────────────────────────── */

// An all-day entry for the wedding date. Google wants the end date exclusive.
const weddingDate = weddingDayEvents[0].date;
const dayAfter = utcStamp(new Date(Date.parse(`${weddingDate}T00:00:00Z`) + 86_400_000)).slice(0, 8);
const GOOGLE_CALENDAR_URL = `https://calendar.google.com/calendar/render?${new URLSearchParams({
  action: "TEMPLATE",
  text: wedding.couple.line,
  dates: `${weddingDate.replaceAll("-", "")}/${dayAfter}`,
  details: weddingDayEvents.map((event) => `${event.name}: ${event.time}`).join("\n"),
})}`;

const LINK =
  "rounded-full border border-gold px-5 py-2.5 text-lg font-bold underline-offset-4 hover:underline";

/**
 * Section 6. The couple's line, a gold-foil card to scratch for the date, a countdown to the
 * Departure of Barat, and two ways to put the days in a calendar.
 */
export function TheDate() {
  return (
    <section data-section="date" className="relative overflow-hidden px-5 py-[clamp(4rem,12svh,7rem)] text-center">
      <JaalBackground opacity={0.08} />
      <div className="relative mx-auto flex max-w-xl flex-col items-center gap-[clamp(2.5rem,7svh,4rem)]">
        <h2 className="font-script text-[clamp(2.7rem,12.5vw,5.5rem)] leading-[1.2] text-gold-pale">
          {wedding.couple.line}
        </h2>
        <ScratchCard />
        <Countdown />
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-gold">Add to calendar</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/wedding.ics" download className={LINK}>
              All six events (.ics)
            </a>
            <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
              Google Calendar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
