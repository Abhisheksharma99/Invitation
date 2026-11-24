"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { wedding } from "@content/wedding";
import { whenGateOpens } from "@/lib/gate";
import { Arch } from "@/components/ornaments/Arch";
import { Diya } from "@/components/ornaments/Diya";
import { Ganesha } from "@/components/ornaments/Ganesha";
import { JaalBackground } from "@/components/ornaments/JaalBackground";
import { Mandala } from "@/components/ornaments/Mandala";
import { PetalField } from "@/components/ornaments/PetalField";

/**
 * Section 1. As the doors open the arch draws itself and the mandala appears.
 * Scrolling then draws Ganesha, raises the shlok and lights the five diyas.
 * Without motion (reduced motion, or no JavaScript) everything is simply there.
 */
export function Invocation() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Arrival: plays once, in its own time, as the gate opens.
        const arrival = gsap
          .timeline({ paused: true, defaults: { ease: "power2.inOut" } })
          .from(".arch-line", { drawSVG: 0, duration: 2.2, stagger: 0.25 })
          .from(".arch-finial", { autoAlpha: 0, duration: 1 }, "-=0.9")
          .from("[data-halo]", { autoAlpha: 0, scale: 0.9, duration: 1.8, ease: "power2.out" }, 0.5)
          .from("[data-lamp]", { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.12, ease: "power2.out" }, 1)
          .from("[data-hint]", { autoAlpha: 0, duration: 0.8 }, 2.2);
        const stopWaiting = whenGateOpens(() => arrival.play());

        // The rest is tied to the scroll while the section is pinned.
        gsap
          .timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=170%",
              pin: true,
              scrub: 0.7,
              onEnter: () => arrival.progress(1),
            },
          })
          .to("[data-hint-fade]", { autoAlpha: 0, duration: 0.3 })
          .from(".ganesha-line", { drawSVG: 0, duration: 0.7, stagger: 0.14, ease: "power1.inOut" }, 0.1)
          .from("[data-rise]", { autoAlpha: 0, y: 22, duration: 0.9, stagger: 0.75 }, 2.6)
          .from(".diya-fire", { autoAlpha: 0, duration: 0.5, stagger: 0.45 }, 5.4)
          .to({}, { duration: 1.2 }); // hold the finished card before unpinning

        return stopWaiting;
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-section="invocation"
      className="relative flex h-svh min-h-[34rem] flex-col items-center justify-between overflow-hidden px-5 pb-5 pt-[max(1.5rem,4svh)] text-center"
      style={{ background: "radial-gradient(ellipse 90% 60% at 50% 32%, var(--wine-raised), var(--wine) 75%)" }}
    >
      <JaalBackground opacity={0.1} />
      {/* behind the text, so nothing drifts across a line being read */}
      <PetalField petals={8} dust={24} />

      <div className="relative flex flex-col items-center">
        <Arch className="h-[48svh] max-h-[34rem] shrink-0">
          <div className="grid h-full place-items-center pt-[24%]">
            <div className="relative w-[92%]">
              <div data-halo>
                <Mandala turn={140} className="w-full opacity-45" />
              </div>
              <Ganesha className="absolute inset-0 m-auto w-[72%]" />
            </div>
          </div>
        </Arch>

        <div className="relative mt-[clamp(0.75rem,3svh,2rem)] flex flex-col items-center gap-1">
          <p data-rise lang="sa" className="font-deva text-[clamp(1.35rem,5.8vw,2.2rem)] text-gold-pale">
            {wedding.invocation.salutation}
          </p>
          {wedding.invocation.shlok.map((line) => (
            <p key={line} data-rise lang="sa" className="font-deva text-[clamp(1.05rem,4.6vw,1.6rem)] leading-snug">
              {line}
            </p>
          ))}
          <h1 data-rise className="mt-2 font-script text-[clamp(2.5rem,11vw,4.5rem)] leading-tight text-gold-pale">
            {wedding.invocation.title}
          </h1>

          {/* scroll cue: sits where the text will rise, gone on the first scroll */}
          <div data-hint-fade className="hint pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
            <svg data-hint viewBox="0 0 40 56" className="scroll-cue h-14 w-10" fill="none" stroke="var(--gold-pale)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 8L20 20L32 8M8 26L20 38L32 26" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative flex shrink-0 items-end justify-center gap-[clamp(0.5rem,3.5vw,1.75rem)]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} data-lamp>
            <Diya delay={i * 0.41} className="w-[clamp(2.4rem,11vw,3.5rem)]" />
          </div>
        ))}
      </div>
    </section>
  );
}
