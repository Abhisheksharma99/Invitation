"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { wedding } from "@content/wedding";
import { weddingDays } from "@/lib/events";
import { useMotion } from "@/components/motion/MotionProvider";
import { MOMENTS } from "@/components/moments";
import { JaalBackground } from "@/components/ornaments/JaalBackground";

/**
 * Section 7. Four days as one pinned scene. Each day is a card in an alcove;
 * its motif plays as the guest scrolls, then the next day slides over it and
 * the earlier card steps back like a deck. A gold thread runs down the side
 * through four knots, one per day; the knots are also buttons.
 *
 * Without motion (reduced motion or no JavaScript) the days are a plain list
 * with every motif in its finished pose.
 */
export function GoldenMoments() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const { getLenis } = useMotion();

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const svgs = gsap.utils.toArray<SVGSVGElement>("[data-motif] svg", section);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        svgs.forEach((svg, i) => MOMENTS[i].pose(svg, 1));
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        section.dataset.deck = ""; // CSS switches from a list to a stacked deck
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", section);
        const dims = gsap.utils.toArray<HTMLElement>("[data-dim]", section);
        const lights = gsap.utils.toArray<HTMLElement>("[data-light]", section);
        svgs.forEach((svg, i) => MOMENTS[i].pose(svg, 0));

        const arrivals: number[] = [0];
        let current = 0;
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: "[data-stage]",
            start: "top top",
            end: "+=460%",
            pin: true,
            scrub: 0.6,
            onUpdate: () => {
              const time = tl.time();
              let index = 0;
              arrivals.forEach((at, i) => {
                if (time >= at + 0.5) index = i;
              });
              if (index !== current) {
                current = index;
                setActive(index);
              }
            },
          },
        });
        trigger.current = tl.scrollTrigger ?? null;

        cards.forEach((card, i) => {
          if (i > 0) {
            arrivals.push(tl.duration());
            // the new day slides over; the day before steps back and dims
            tl.fromTo(card, { yPercent: 106 }, { yPercent: 0, duration: 1 })
              .to(cards[i - 1], { scale: 0.92, yPercent: -3.5, duration: 1 }, "<")
              .to(dims[i - 1], { opacity: 0.6, duration: 1 }, "<")
              .fromTo(lights[i], { opacity: 0 }, { opacity: 1, duration: 1 }, "<");
            if (i > 1) tl.to(cards[i - 2], { scale: 0.86, yPercent: -6, duration: 1 }, "<");
          }
          // the motif plays only inside its own day
          const progress = { p: 0 };
          tl.to(progress, {
            p: 1,
            duration: 2.2,
            ease: "none",
            onUpdate: () => MOMENTS[i].pose(svgs[i], progress.p),
          });
          tl.addLabel(`day-${i}`).to({}, { duration: 0.6 });
        });

        tl.fromTo("[data-thread]", { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", ease: "none", duration: tl.duration() }, 0);

        return () => {
          delete section.dataset.deck;
          trigger.current = null;
          svgs.forEach((svg, i) => MOMENTS[i].pose(svg, 1));
        };
      });
    },
    { scope: root },
  );

  const jumpTo = (index: number) => {
    const st = trigger.current;
    if (!st) {
      // list layout: just bring that day into view
      root.current?.querySelectorAll("[data-card]")[index]?.scrollIntoView({ block: "center" });
      return;
    }
    const y = st.labelToScroll(`day-${index}`);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section ref={root} data-section="moments" className="group/moments relative">
      <div
        data-stage
        className="relative flex flex-col items-center overflow-hidden px-4 pb-4 pt-[max(1rem,3svh)] group-data-[deck]/moments:h-svh group-data-[deck]/moments:min-h-[36rem]"
      >
        {MOMENTS.map((moment, i) => (
          <div
            key={moment.id}
            data-light
            className={`pointer-events-none absolute inset-0 hidden group-data-[deck]/moments:block ${i ? "opacity-0" : ""}`}
            style={{ background: moment.light }}
          />
        ))}
        <JaalBackground opacity={0.09} />

        <h2 className="relative shrink-0 font-script text-[clamp(2.6rem,11.5vw,4.5rem)] leading-tight text-gold-pale">
          {wedding.goldenMoments.title}
        </h2>

        <div className="relative mt-2 flex w-full max-w-[26rem] flex-1 flex-col gap-8 pr-9 group-data-[deck]/moments:gap-0 lg:max-w-[58rem] lg:pr-14">
          {weddingDays.map((day, i) => {
            const { Motif, id, light } = MOMENTS[i];
            return (
              <article
                key={id}
                data-card
                aria-labelledby={`${id}-day`}
                style={{ zIndex: i + 1 }}
                className="moment-card relative flex flex-col items-center justify-center gap-[clamp(0.75rem,2.5svh,1.75rem)] overflow-hidden border-2 border-gold bg-wine-panel px-4 py-6 text-center will-change-transform group-data-[deck]/moments:absolute group-data-[deck]/moments:inset-y-0 group-data-[deck]/moments:left-0 group-data-[deck]/moments:right-9 lg:flex-row lg:gap-10 lg:px-10 lg:text-left lg:group-data-[deck]/moments:right-14"
              >
                <div className="pointer-events-none absolute inset-0" style={{ background: light }} />
                <div data-motif className="relative w-full max-w-[22rem] shrink-0 lg:max-w-none lg:flex-1">
                  <Motif className="h-auto w-full overflow-visible" />
                </div>
                <div className="relative lg:flex-1">
                  <h3 id={`${id}-day`} className="text-balance text-[clamp(1.35rem,5.8vw,1.9rem)] font-bold leading-tight text-gold-pale lg:text-[2.1rem]">
                    {day.day}
                  </h3>
                  <dl className="mt-[clamp(0.6rem,2svh,1.25rem)] flex flex-col gap-2">
                    {day.events.map((event) => (
                      <div key={event.name} className="flex flex-col">
                        <dt className="text-[clamp(1.6rem,7vw,2.4rem)] font-bold leading-tight lg:text-5xl">{event.name}</dt>
                        <dd className="text-[clamp(1.3rem,5.6vw,1.8rem)] leading-tight text-gold lg:text-3xl">{event.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div data-dim className="pointer-events-none absolute inset-0 bg-wine opacity-0" />
              </article>
            );
          })}

          {/* the thread and its four knots: progress, and a way to jump to a day */}
          <nav
            aria-label={wedding.goldenMoments.title}
            className="absolute inset-y-[12%] right-0 hidden w-9 flex-col items-center justify-between group-data-[deck]/moments:flex lg:w-14"
          >
            <svg className="absolute inset-y-0 left-1/2 h-full w-4 -translate-x-1/2 overflow-visible" viewBox="0 0 16 400" preserveAspectRatio="none" fill="none" aria-hidden="true">
              <path d="M8 0C16 50 0 80 8 133C16 186 0 214 8 267C16 320 0 350 8 400" stroke="var(--brass)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <path data-thread d="M8 0C16 50 0 80 8 133C16 186 0 214 8 267C16 320 0 350 8 400" stroke="var(--gold-pale)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </svg>
            {weddingDays.map((day, i) => (
              <button
                key={day.date}
                type="button"
                onClick={() => jumpTo(i)}
                aria-label={day.day}
                aria-current={i === active ? "step" : undefined}
                className="group/knot relative grid h-11 w-11 cursor-pointer place-items-center rounded-full"
              >
                <span className="block h-3.5 w-3.5 rotate-45 border-2 border-gold bg-wine transition-[scale,background-color] duration-500 group-aria-[current]/knot:scale-150 group-aria-[current]/knot:bg-gold-pale" />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
