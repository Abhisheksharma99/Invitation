"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { useMotion } from "@/components/motion/MotionProvider";

export type FireworksHandle = {
  /** Send up this many bursts, one after another. */
  launch: (bursts?: number) => void;
};

type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number; colour: string };

/**
 * A canvas of gold fireworks over its positioned parent. It draws nothing and
 * runs no timer until `launch()` is called, and stops again when the last
 * spark fades. Does nothing for reduced motion.
 */
export function Fireworks({ ref, className = "" }: { ref: Ref<FireworksHandle>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const launchRef = useRef<(bursts: number) => void>(() => {});
  const { reducedMotion, lowEnd } = useMotion();

  useImperativeHandle(ref, () => ({ launch: (bursts = 3) => launchRef.current(bursts) }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || reducedMotion) return;

    const css = getComputedStyle(canvas);
    const colours = ["--gold", "--marigold", "--ivory"].map((name) => css.getPropertyValue(name).trim());
    const sparks: Spark[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let frame = 0;
    let last = 0;
    let width = 0;
    let height = 0;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1 : 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;
        if (s.age >= s.life) {
          sparks.splice(i, 1);
          continue;
        }
        const fromX = s.x;
        const fromY = s.y;
        s.vx *= 1 - 1.6 * dt; // air drag
        s.vy = s.vy * (1 - 1.6 * dt) + 70 * dt; // and gravity
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const fade = 1 - s.age / s.life;
        ctx.globalAlpha = fade;
        ctx.strokeStyle = s.colour;
        ctx.lineWidth = 1.2 + 2.2 * fade;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(fromX - s.vx * 0.05, fromY - s.vy * 0.05);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      frame = sparks.length ? requestAnimationFrame(tick) : 0;
      if (!frame) ctx.clearRect(0, 0, width, height);
    };

    const burst = () => {
      const x = width * (0.14 + Math.random() * 0.72);
      // aim at the part of the canvas the guest can actually see
      const box = canvas.getBoundingClientRect();
      const top = Math.max(0, -box.top);
      const seen = Math.max(0, Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0));
      const y = top + seen * (0.12 + Math.random() * 0.38);
      const colour = colours[Math.floor(Math.random() * colours.length)];
      const count = lowEnd ? 26 : 64;
      const reach = Math.min(width, 520) * (0.55 + Math.random() * 0.35);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.2;
        const speed = reach * (0.55 + Math.random() * 0.55);
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          age: 0,
          life: 1.3 + Math.random() * 0.9,
          colour: Math.random() < 0.75 ? colour : colours[2],
        });
      }
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    launchRef.current = (bursts) => {
      fit();
      for (let i = 0; i < bursts; i++) timers.push(setTimeout(burst, i * 380 + Math.random() * 120));
    };

    return () => {
      launchRef.current = () => {};
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
    };
  }, [reducedMotion, lowEnd]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
