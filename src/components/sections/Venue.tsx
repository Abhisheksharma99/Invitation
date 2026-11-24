"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { wedding } from "@content/wedding";
import { DIRECTIONS_URL, MAP_EMBED_URL } from "@/lib/venue";
import { JaalBackground } from "@/components/ornaments/JaalBackground";
import { Palace } from "@/components/ornaments/Palace";

/** The map is a third-party frame, so it is not requested until the guest is nearly there. */
function LazyMap() {
  const frame = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          watcher.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  return (
    <div
      ref={frame}
      className="relative aspect-[4/5] w-[min(100%,24rem)] overflow-hidden rounded-t-[50%_32%] border-2 border-gold bg-wine-panel p-1.5"
    >
      <div className="h-full w-full overflow-hidden rounded-t-[50%_32%] border border-gold-pale/60">
        {near && (
          <iframe
            src={MAP_EMBED_URL}
            title={`Map: ${wedding.venue.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        )}
      </div>
    </div>
  );
}

/**
 * Section 8. The palace lights up from the centre outwards as it scrolls into
 * view; then the venue, the note, the map and directions.
 */
export function Venue() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".palace-light", {
          autoAlpha: 0,
          duration: 0.9,
          ease: "power1.out",
          delay: (_, el: Element) => Number(el.getAttribute("data-reach")) * 1.8,
          scrollTrigger: { trigger: "[data-palace]", start: "top 72%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-section="venue"
      className="relative overflow-hidden px-5 py-[clamp(4rem,12svh,7rem)] text-center"
      style={{ background: "radial-gradient(ellipse 90% 40% at 50% 18%, var(--wine-raised), var(--wine) 80%)" }}
    >
      <JaalBackground opacity={0.08} />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center">
        <div data-palace className="w-full max-w-xl">
          <Palace className="h-auto w-full" />
        </div>

        <p className="mt-[clamp(1.5rem,5svh,3rem)] text-xl font-bold tracking-[0.35em] text-gold">{wedding.venue.label}</p>
        <h2 className="mt-1 text-balance text-[clamp(2rem,8.6vw,3.5rem)] font-bold leading-tight text-gold-pale">
          {wedding.venue.name}
        </h2>
        <p className="text-[clamp(1.3rem,5.6vw,1.9rem)]">{wedding.venue.address}</p>

        <div className="mt-[clamp(2rem,6svh,3.5rem)] flex w-full flex-col items-center gap-6">
          <LazyMap />
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold px-8 py-3 text-xl font-bold text-wine"
          >
            Get directions
          </a>
        </div>
      </div>
    </section>
  );
}
