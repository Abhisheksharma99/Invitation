"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { wedding } from "@content/wedding";
import { useMotion } from "@/components/motion/MotionProvider";
import { announceGateOpening, gateSeenThisSession, markGateOpen } from "@/lib/gate";
import { guestName } from "@/lib/guest";
import { unlockMusic } from "@/lib/music";

const subscribeNever = () => () => {};

/** One carved panel of a door leaf. */
function Panel() {
  return (
    <div className="relative min-h-0 flex-1 border border-gold/60 p-1.5">
      <div className="grid h-full place-items-center border border-brass/70 bg-wine/35">
        <svg viewBox="-50 -50 100 100" className="h-[70%] max-h-28 w-[70%]" fill="none" stroke="var(--gold)" aria-hidden="true">
          <circle r="46" strokeOpacity="0.5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <path
              key={angle}
              d="M0 -10C9 -20 7 -34 0 -42C-7 -34 -9 -20 0 -10Z"
              transform={`rotate(${angle})`}
              fill="var(--gold)"
              fillOpacity="0.14"
              strokeWidth="1.2"
            />
          ))}
          <circle r="6" fill="var(--brass)" stroke="var(--gold-pale)" />
        </svg>
      </div>
    </div>
  );
}

function Leaf({ side }: { side: "left" | "right" }) {
  const left = side === "left";
  return (
    <div
      data-leaf={side}
      className={`absolute inset-y-0 w-1/2 will-change-transform [backface-visibility:hidden] ${
        left ? "left-0 origin-left" : "right-0 origin-right"
      }`}
      style={{
        background: `linear-gradient(${left ? "100deg" : "260deg"}, var(--wine) 0%, var(--wine-panel) 55%, var(--wine-raised) 100%)`,
      }}
    >
      <div
        className={`flex h-full flex-col gap-3 border-y-[6px] border-brass p-3 sm:gap-5 sm:p-6 ${
          left ? "border-l-[6px] pr-4 sm:pr-8" : "border-r-[6px] pl-4 sm:pl-8"
        }`}
      >
        <div className="gate-studs h-3 shrink-0" />
        <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-5 lg:grid lg:grid-cols-2 lg:grid-rows-3">
          <Panel />
          <Panel />
          <Panel />
          <div className="hidden lg:contents">
            <Panel />
            <Panel />
            <Panel />
          </div>
        </div>
        <div className="gate-studs h-3 shrink-0" />
      </div>
      {/* brass strip where the leaves meet */}
      <div
        className={`absolute inset-y-0 w-1.5 bg-gradient-to-b from-gold-pale via-gold to-brass ${left ? "right-0" : "left-0"}`}
      />
    </div>
  );
}

function Seal() {
  return (
    <div data-seal className="relative grid h-36 w-36 place-items-center sm:h-44 sm:w-44">
      <span className="gate-rays absolute -inset-[70%] rounded-full" />
      <span data-pulse className="gate-pulse absolute inset-0 rounded-full border-2 border-gold-pale" />
      <svg viewBox="-60 -60 120 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => (
          <circle key={i} r="7" cx="0" cy="-51" transform={`rotate(${i * 18})`} fill="var(--gold)" />
        ))}
        <circle r="52" fill="var(--gold)" />
        <circle r="46" fill="var(--wine)" stroke="var(--brass)" strokeWidth="2" />
        <circle r="41" fill="none" stroke="var(--gold)" strokeWidth="0.8" strokeDasharray="1 5" strokeLinecap="round" />
      </svg>
      <span className="relative whitespace-nowrap font-script text-5xl leading-none text-gold-pale sm:text-6xl">
        {wedding.monogram}
      </span>
    </div>
  );
}

/**
 * Section 0. Closed palace doors over the whole screen. A tap, click, Enter or
 * Space anywhere opens them; "Skip" removes them at once. Never shown to
 * reduced-motion visitors or twice in one session. Scrolling is locked in CSS
 * (globals.css) for as long as the gate is in the page.
 */
export function Gate({ hasAudio }: { hasAudio: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const opening = useRef(false);
  const [gone, setGone] = useState(false);
  const { reducedMotion, lowEnd } = useMotion();
  const seen = useSyncExternalStore(subscribeNever, gateSeenThisSession, () => false);
  // a name in the link (…/Sharma-Ji or …/?to=Sharma Ji) greets the guest personally
  const guest = useSyncExternalStore(
    subscribeNever,
    () => guestName(window.location.search, window.location.pathname),
    () => "",
  );
  const hidden = gone || seen || reducedMotion;

  const { contextSafe } = useGSAP({ scope: root });

  useEffect(() => {
    if (hidden) return;
    opener.current?.focus({ preventScroll: true });
    void import("canvas-confetti"); // warm the burst so the tap is instant
  }, [hidden]);

  const finish = () => {
    markGateOpen();
    setGone(true);
    // the page regains its scrollbar; pinned scenes must re-measure
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  const burst = async () => {
    const { default: confetti } = await import("canvas-confetti");
    const css = getComputedStyle(document.documentElement);
    const colors = ["--marigold", "--gold", "--ivory"].map((name) => css.getPropertyValue(name).trim());
    const petal = confetti.shapeFromPath({ path: "M0 -10C8 -4 6 8 0 10C-6 8 -8 -4 0 -10Z" });
    const count = lowEnd ? 28 : 64;
    const shared = { colors, gravity: 0.65, ticks: 260, disableForReducedMotion: true };
    confetti({ ...shared, particleCount: count, spread: 110, startVelocity: 34, scalar: 1.7, shapes: [petal], origin: { y: 0.52 } });
    confetti({ ...shared, particleCount: Math.round(count / 2), spread: 70, startVelocity: 24, scalar: 0.6, origin: { y: 0.5 } });
  };

  const swing = contextSafe(() => {
    gsap
      .timeline({ defaults: { ease: "power2.inOut" }, onComplete: finish })
      // the seal is pressed…
      .to("[data-seal]", { scale: 0.9, duration: 0.14, ease: "power2.in" })
      .to("[data-seal]", { scale: 1, duration: 0.32, ease: "power2.out" })
      .to("[data-fade]", { autoAlpha: 0, duration: 0.3 }, 0)
      // …lifts away…
      .to("[data-seal]", { autoAlpha: 0, scale: 1.2, duration: 0.5 })
      .add(() => {
        announceGateOpening();
        void burst();
      }, "-=0.25")
      // …and both leaves swing inward
      .to('[data-leaf="left"]', { rotateY: -96, duration: 2.3 }, "<")
      .to('[data-leaf="right"]', { rotateY: 96, duration: 2.3 }, "<")
      .fromTo("[data-light]", { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 0.9, ease: "power1.out" }, "<")
      .to("[data-light]", { autoAlpha: 0, duration: 1.3, ease: "power1.inOut" }, ">");
  });

  const open = () => {
    if (opening.current) return;
    opening.current = true;
    if (hasAudio) unlockMusic(); // starts muted; the music toggle unmutes it
    window.scrollTo(0, 0);
    swing();
  };

  const skip = () => {
    if (opening.current) return;
    opening.current = true;
    finish();
  };

  if (hidden) return null;

  return (
    <div
      ref={root}
      className="gate fixed inset-0 z-50 touch-none overflow-hidden [perspective:1600px]"
    >
      <div
        data-light
        className="invisible absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, var(--gold-pale) 0%, transparent 65%)" }}
      />
      <Leaf side="left" />
      <Leaf side="right" />

      <button
        ref={opener}
        type="button"
        onClick={open}
        className="absolute inset-0 grid cursor-pointer place-items-center focus-visible:outline-none"
      >
        <span className="flex flex-col items-center gap-5">
          {guest && (
            <span data-fade className="flex max-w-[88vw] flex-col items-center rounded-3xl border border-gold/70 bg-wine px-6 py-3 text-center">
              <span className="font-script text-[clamp(2rem,8.6vw,3rem)] leading-tight text-gold-pale">Dear {guest},</span>
              <span className="text-balance text-[clamp(1.05rem,4.6vw,1.4rem)] leading-snug text-ivory">
                you are warmly invited to the wedding of {wedding.groom.name} & {wedding.bride.name}
              </span>
            </span>
          )}
          <Seal />
          <span
            data-fade
            className="gate-label rounded-full border border-gold/70 bg-wine px-6 py-2 text-lg font-bold uppercase tracking-[0.22em] text-ivory"
          >
            Tap to open
          </span>
        </span>
      </button>

      <button
        data-fade
        type="button"
        onClick={skip}
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-wine px-5 py-2 text-lg text-ivory underline decoration-gold underline-offset-4"
      >
        Skip
      </button>
    </div>
  );
}
