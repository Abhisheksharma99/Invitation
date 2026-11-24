"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { wedding } from "@content/wedding";
import { Diya } from "@/components/ornaments/Diya";
import { JaalBackground } from "@/components/ornaments/JaalBackground";
import { Kalash } from "@/components/ornaments/Kalash";
import { PetalField } from "@/components/ornaments/PetalField";
import { Toran } from "@/components/ornaments/Toran";

/**
 * Section 2. The toran drops as the section arrives; scrolling then brings the
 * parents' names, draws the rule, lays the invitation down word by word and
 * settles the kalash between its diyas.
 */
export function Hosts() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The garland falls into place in its own time, then sways (CSS).
        gsap.from("[data-toran]", {
          yPercent: -110,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 60%", once: true },
        });

        const split = SplitText.create("[data-words]", { type: "words" });

        gsap
          .timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=160%",
              pin: true,
              scrub: 0.7,
            },
          })
          .from("[data-names]", { autoAlpha: 0, y: 20, duration: 1 })
          .from("[data-rule] path", { drawSVG: "50% 50%", duration: 0.9, ease: "power1.inOut" })
          .from("[data-rule] circle", { autoAlpha: 0, duration: 0.3 }, "<0.3")
          .from(split.words, { autoAlpha: 0, y: 8, duration: 0.5, stagger: 0.16 })
          .from("[data-kalash]", { autoAlpha: 0, y: 36, duration: 1.1 }, "-=0.4")
          .from(".diya-fire", { autoAlpha: 0, duration: 0.5, stagger: 0.4 })
          .to({}, { duration: 1.2 }); // hold before unpinning

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-section="hosts"
      className="relative flex h-svh min-h-[34rem] flex-col items-center overflow-hidden text-center"
      style={{ background: "radial-gradient(ellipse 90% 55% at 50% 100%, var(--wine-raised), var(--wine) 80%)" }}
    >
      <JaalBackground opacity={0.1} />
      {/* behind the text, so nothing drifts across a line being read */}
      <PetalField petals={8} dust={24} />

      <div data-toran className="relative w-full shrink-0">
        <Toran swags={4} className="sm:hidden" />
        <Toran swags={10} className="hidden sm:block" />
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-6">
        <h2 data-names className="text-balance text-[clamp(1.75rem,7.4vw,3.25rem)] font-bold leading-tight text-gold-pale">
          {wedding.hosts.names}
        </h2>

        <svg data-rule viewBox="0 0 240 16" className="my-[clamp(0.75rem,2.5svh,1.5rem)] w-64 shrink-0" fill="none" aria-hidden="true">
          <path d="M4 8H104L112 2L120 8L128 2L136 8H236" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="120" cy="12.5" r="1.8" fill="var(--gold-pale)" />
        </svg>

        <p data-words className="max-w-[21ch] text-balance text-[clamp(1.35rem,5.9vw,2rem)] leading-snug sm:max-w-[32ch]">
          {wedding.hosts.invitation}
        </p>
      </div>

      <div className="relative flex shrink-0 items-end justify-center gap-5 pb-5">
        <Diya className="w-[clamp(2.4rem,11vw,3.5rem)]" />
        <div data-kalash>
          <Kalash className="h-[clamp(6.5rem,19svh,11rem)] w-auto" />
        </div>
        <Diya delay={0.8} className="w-[clamp(2.4rem,11vw,3.5rem)]" />
      </div>
    </section>
  );
}
