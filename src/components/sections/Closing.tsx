"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { wedding } from "@content/wedding";
import { dhruviLines } from "@/lib/dhruvi";
import { useMotion } from "@/components/motion/MotionProvider";
import { Diya } from "@/components/ornaments/Diya";
import { Fireworks, type FireworksHandle } from "@/components/ornaments/Fireworks";
import { JaalBackground } from "@/components/ornaments/JaalBackground";
import { Lantern } from "@/components/ornaments/Lantern";
import { Mandala } from "@/components/ornaments/Mandala";

const PHONES = wedding.closing.phones.match(/\d{10}/g) ?? [];

// left %, size (rem), seconds to rise, delay (s)
const LANTERNS = [
  [6, 2.4, 26, 0], [22, 1.6, 34, 9], [38, 2.9, 30, 17], [58, 1.8, 36, 4], [74, 2.6, 28, 13], [90, 1.5, 38, 21], [48, 1.3, 42, 26],
];

function shareLink() {
  const here = typeof window === "undefined" ? "" : ` ${window.location.origin}${window.location.pathname}`;
  return `https://wa.me/?text=${encodeURIComponent(`${wedding.couple.line}, ${wedding.couple.date}${here}`)}`;
}

/**
 * Section 10. Dhruvi's line types itself in a child's hand, the monogram seal
 * spins into its mandala, and the family's numbers become buttons to call.
 * Lanterns drift up behind; they rest while the section is off-screen. At the
 * foot are five lamps to light, and fireworks when they are all burning.
 */
const LAMPS = 5;

/**
 * Five lamps for the guest to light with a tap. Left alone they light
 * themselves a few seconds after coming into view. When the last one catches,
 * the sky fills with fireworks.
 */
function Lamps({ onAllLit }: { onAllLit: () => void }) {
  const row = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotion();
  const [lit, setLit] = useState<boolean[]>(() => Array(LAMPS).fill(false));
  const celebrated = useRef(false);
  const allLit = reducedMotion || lit.every(Boolean);
  const next = lit.indexOf(false);

  const light = (index: number) => setLit((now) => now.map((on, i) => on || i === index));

  useEffect(() => {
    if (!allLit || reducedMotion || celebrated.current) return;
    celebrated.current = true;
    onAllLit();
  }, [allLit, reducedMotion, onAllLit]);

  // no tap after four seconds in view: the lamps catch one by one on their own
  useEffect(() => {
    const el = row.current;
    if (!el || reducedMotion) return;
    let wait: ReturnType<typeof setTimeout>;
    let each: ReturnType<typeof setInterval>;
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        watcher.disconnect();
        wait = setTimeout(() => {
          each = setInterval(() => setLit((now) => {
            const i = now.indexOf(false);
            return i < 0 ? now : now.map((on, n) => on || n === i);
          }), 550);
        }, 4000);
      },
      { threshold: 0.8 },
    );
    watcher.observe(el);
    return () => {
      watcher.disconnect();
      clearTimeout(wait);
      clearInterval(each);
    };
  }, [reducedMotion]);

  return (
    <div ref={row} className="mt-[clamp(2.5rem,8svh,4.5rem)] flex items-end justify-center gap-[clamp(0.25rem,2vw,1.25rem)]">
      {lit.map((on, i) => (
        <button
          key={i}
          type="button"
          onClick={() => light(i)}
          aria-label="Light the lamp"
          aria-pressed={reducedMotion || on}
          className="relative cursor-pointer rounded-full p-1.5"
        >
          {i === next && !reducedMotion && (
            <span className="gate-pulse absolute inset-x-2 top-1 aspect-square rounded-full border-2 border-gold-pale" />
          )}
          <Diya lit={reducedMotion || on} delay={i * 0.37} className="relative w-[clamp(2.4rem,11vw,3.4rem)]" />
        </button>
      ))}
    </div>
  );
}

export function Closing() {
  const root = useRef<HTMLElement>(null);
  const fireworks = useRef<FireworksHandle>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create("[data-typed]", { type: "chars" });
        gsap.from(split.chars, {
          autoAlpha: 0,
          duration: 0.01,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: "[data-typed]", start: "top 72%", once: true },
        });
        gsap.from("[data-seal]", {
          autoAlpha: 0,
          scale: 0.6,
          rotation: -170,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-seal]", start: "top 80%", once: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 20,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  const celebrate = useCallback(() => fireworks.current?.launch(7), []);

  // the lanterns only drift while the section can be seen
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const watcher = new IntersectionObserver(([entry]) => {
      section.toggleAttribute("data-live", entry.isIntersecting);
    });
    watcher.observe(section);
    return () => watcher.disconnect();
  }, []);

  return (
    <section
      ref={root}
      data-section="closing"
      className="closing relative overflow-hidden px-5 pb-24 pt-[clamp(4rem,12svh,7rem)] text-center"
      style={{ background: "radial-gradient(ellipse 100% 45% at 50% 100%, var(--wine-raised), var(--wine) 85%)" }}
    >
      <JaalBackground opacity={0.08} />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {LANTERNS.map(([left, size, seconds, delay]) => (
          <div
            key={left}
            className="lantern absolute top-full opacity-0"
            style={{ left: `${left}%`, width: `${size}rem`, animationDuration: `${seconds}s`, animationDelay: `${-delay}s` }}
          >
            <Lantern className="h-auto w-full" />
          </div>
        ))}
      </div>

      <Fireworks ref={fireworks} />

      <div className="relative mx-auto flex max-w-xl flex-col items-center">
        <p className="font-hand text-[clamp(1.45rem,6.4vw,2.4rem)] leading-snug text-gold-pale">
          {dhruviLines().map((line) => (
            <span key={line} data-typed className="block">
              {line}
            </span>
          ))}
        </p>

        <p data-rise className="mt-[clamp(2rem,6svh,3.5rem)] max-w-[22ch] text-balance text-[clamp(1.25rem,5.4vw,1.7rem)] leading-snug">
          {wedding.closing.compliments}
        </p>

        <div data-seal className="mt-[clamp(1.5rem,5svh,3rem)] w-[min(72vw,18rem)]">
          <Mandala turn={160} className="w-full">
            <span className="grid aspect-square w-[52%] place-items-center whitespace-nowrap rounded-full bg-wine font-script text-[clamp(2.4rem,11vw,3.4rem)] leading-none text-gold-pale">
              {wedding.monogram}
            </span>
          </Mandala>
        </div>

        <p data-rise className="mt-[clamp(1.5rem,5svh,3rem)] text-xl font-bold tracking-[0.25em] text-gold">{wedding.closing.rsvp}</p>
        <p data-rise className="text-[clamp(2rem,8.6vw,3rem)] font-bold leading-tight">{wedding.closing.family}</p>
        <p data-rise className="mt-1 text-[clamp(1.1rem,4.8vw,1.4rem)] text-ivory-soft">{wedding.closing.phones}</p>

        <div data-rise className="mt-5 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          {PHONES.map((number) => (
            <a
              key={number}
              href={`tel:+91${number}`}
              aria-label={`Call ${number}`}
              className="flex items-center justify-center gap-3 rounded-full bg-gold px-8 py-3.5 text-[clamp(1.5rem,6.4vw,1.9rem)] font-bold tabular-nums tracking-wide text-wine"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor" aria-hidden="true">
                <path d="M6.6 2.5L9.7 2.9L11 7.7L8.8 9.5C9.9 11.9 12.1 14.1 14.5 15.2L16.3 13L21.1 14.3L21.5 17.4C21.6 19.6 19.6 21.5 17.4 21.5C9.2 21.5 2.5 14.8 2.5 6.6C2.5 4.4 4.4 2.4 6.6 2.5Z" />
              </svg>
              {number}
            </a>
          ))}
        </div>

        <a
          data-rise
          href={shareLink()}
          onClick={(event) => {
            event.currentTarget.href = shareLink(); // now with this page's address
          }}
          target="_blank"
          rel="noopener noreferrer"
          suppressHydrationWarning
          className="mt-6 rounded-full border border-gold px-7 py-3 text-xl font-bold"
        >
          Share on WhatsApp
        </a>

        <Lamps onAllLit={celebrate} />
      </div>
    </section>
  );
}
