"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "@/components/motion/MotionProvider";

type Petal = {
  x: number; // 0..1 across the canvas
  y: number; // px
  size: number;
  fall: number; // px per second
  sway: number; // px
  phase: number;
  spin: number; // radians per second
  tumble: number;
  colour: string;
};

type Mote = {
  x: number;
  y: number;
  r: number;
  rise: number;
  phase: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

type PetalFieldProps = {
  /** Number of drifting marigold petals. */
  petals?: number;
  /** Number of gold dust motes. */
  dust?: number;
  className?: string;
};

/**
 * One canvas of drifting petals and gold dust that fills its positioned parent.
 * It stops drawing while off-screen or while the tab is hidden, thins out on
 * low-end devices, and holds a single still frame for reduced motion.
 */
export function PetalField({ petals = 14, dust = 36, className = "" }: PetalFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { reducedMotion, lowEnd } = useMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const css = getComputedStyle(canvas);
    const gold = css.getPropertyValue("--gold").trim();
    const marigold = css.getPropertyValue("--marigold").trim();
    const ivory = css.getPropertyValue("--ivory").trim();

    const dpr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1 : 2);
    const thin = lowEnd ? 0.5 : 1;
    let width = 0;
    let height = 0;

    const petalList: Petal[] = Array.from({ length: Math.round(petals * thin) }, () => ({
      x: Math.random(),
      y: 0,
      size: rand(6, 11),
      fall: rand(16, 38),
      sway: rand(10, 28),
      phase: rand(0, Math.PI * 2),
      spin: rand(-0.8, 0.8),
      tumble: rand(0.6, 1.6),
      colour: Math.random() < 0.7 ? marigold : gold,
    }));
    const moteList: Mote[] = Array.from({ length: Math.round(dust * thin) }, () => ({
      x: Math.random(),
      y: 0,
      r: rand(0.6, 1.7),
      rise: rand(4, 12),
      phase: rand(0, Math.PI * 2),
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const m of moteList) {
        ctx.globalAlpha = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t * 1.3 + m.phase));
        ctx.fillStyle = m.r > 1.3 ? ivory : gold;
        ctx.beginPath();
        ctx.arc(m.x * width + Math.sin(t * 0.4 + m.phase) * 8, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of petalList) {
        const s = p.size;
        ctx.save();
        ctx.translate(p.x * width + Math.sin(t * 0.7 + p.phase) * p.sway, p.y);
        ctx.rotate(p.phase + t * p.spin);
        ctx.scale(1, 0.45 + 0.55 * Math.abs(Math.cos(t * p.tumble + p.phase)));
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = p.colour;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.85, -s * 0.4, s * 0.6, s * 0.75, 0, s);
        ctx.bezierCurveTo(-s * 0.6, s * 0.75, -s * 0.85, -s * 0.4, 0, -s);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    let seeded = false;
    let clock = 0;
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!seeded && height > 0) {
        for (const p of petalList) p.y = rand(0, height);
        for (const m of moteList) m.y = rand(0, height);
        seeded = true;
      }
      draw(clock);
    };

    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      clock += dt;
      for (const p of petalList) {
        p.y += p.fall * dt;
        if (p.y > height + 16) {
          p.y = -16;
          p.x = Math.random();
        }
      }
      for (const m of moteList) {
        m.y -= m.rise * dt;
        if (m.y < -4) {
          m.y = height + 4;
          m.x = Math.random();
        }
      }
      draw(clock);
      frame = requestAnimationFrame(tick);
    };

    let onScreen = false;
    const sync = () => {
      const shouldRun = onScreen && !document.hidden && !reducedMotion;
      if (shouldRun && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } else if (!shouldRun && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const resizer = new ResizeObserver(resize);
    resizer.observe(canvas);
    const watcher = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    watcher.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      watcher.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [petals, dust, reducedMotion, lowEnd]);

  return (
    <canvas
      ref={ref}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
