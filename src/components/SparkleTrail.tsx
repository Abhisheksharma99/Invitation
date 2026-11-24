"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "@/components/motion/MotionProvider";

type Mote = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; pale: boolean };

/**
 * Gold dust that follows the guest's finger or cursor across the invitation.
 * One fixed canvas; it draws only while dust is in the air. Off for reduced
 * motion and on low-end devices.
 */
export function SparkleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reducedMotion, lowEnd } = useMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || reducedMotion || lowEnd) return;

    const css = getComputedStyle(canvas);
    const gold = css.getPropertyValue("--gold").trim();
    const ivory = css.getPropertyValue("--ivory").trim();
    const motes: Mote[] = [];
    let frame = 0;
    let last = 0;
    let lastSpawn = 0;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = motes.length - 1; i >= 0; i--) {
        const m = motes[i];
        m.age += dt;
        if (m.age >= m.life) {
          motes.splice(i, 1);
          continue;
        }
        m.vy += 90 * dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        const fade = 1 - m.age / m.life;
        ctx.globalAlpha = fade * 0.9;
        ctx.fillStyle = m.pale ? ivory : gold;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * (0.4 + 0.6 * fade), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = motes.length ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawn < 28 || motes.length > 70) return;
      lastSpawn = now;
      for (let i = 0; i < 2; i++) {
        motes.push({
          x: event.clientX + (Math.random() - 0.5) * 14,
          y: event.clientY + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 50,
          vy: -20 - Math.random() * 30,
          age: 0,
          life: 0.5 + Math.random() * 0.5,
          size: 1 + Math.random() * 1.8,
          pale: Math.random() < 0.35,
        });
      }
      if (!frame) {
        last = now;
        frame = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", fit);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion, lowEnd]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[45] h-full w-full" aria-hidden="true" />;
}
