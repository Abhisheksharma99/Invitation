"use client";

import { useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { musicIsOn, subscribeToMusic, toggleMusic } from "@/lib/music";
import { useMotion } from "@/components/motion/MotionProvider";
import { SparkleTrail } from "@/components/SparkleTrail";

const FLOATING =
  "grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-gold bg-wine/90 text-gold-pale";

function MusicToggle() {
  const on = useSyncExternalStore(subscribeToMusic, musicIsOn, () => false);
  return (
    <button
      type="button"
      onClick={toggleMusic}
      aria-label="Music"
      aria-pressed={on}
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-40 ${FLOATING}`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 17.5V5.5L19 3.5V15.5" />
        <circle cx="6.5" cy="17.5" r="2.5" fill="currentColor" />
        <circle cx="16.5" cy="15.5" r="2.5" fill="currentColor" />
        {!on && <path d="M3 3L21 21" stroke="var(--marigold)" strokeWidth="2.2" />}
      </svg>
    </button>
  );
}

/**
 * Site-wide fixtures: a thin gold progress bar, a back-to-top seal, and the
 * music toggle (only when a music file was present at build time).
 */
export function SiteChrome({ hasAudio }: { hasAudio: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const { getLenis, reducedMotion } = useMotion();

  useGSAP(
    () => {
      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: true },
      });
      // the seal appears once the guest is a screen into the invitation
      ScrollTrigger.create({
        start: () => window.innerHeight,
        onEnter: () => root.current?.toggleAttribute("data-scrolled", true),
        onLeaveBack: () => root.current?.toggleAttribute("data-scrolled", false),
      });
    },
    { scope: root },
  );

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 2.4 });
    else window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <div ref={root} className="group/chrome">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px]" aria-hidden="true">
        <div data-progress className="h-full origin-left scale-x-0 bg-gold" />
      </div>
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        className={`invisible fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 opacity-0 transition-[opacity,visibility] duration-500 group-data-[scrolled]/chrome:visible group-data-[scrolled]/chrome:opacity-100 ${FLOATING}`}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 14L12 8L18 14" />
        </svg>
      </button>
      {hasAudio && <MusicToggle />}
      <SparkleTrail />
    </div>
  );
}
