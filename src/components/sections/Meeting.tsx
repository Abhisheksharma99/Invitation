"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { wedding } from "@content/wedding";
import { useMotion } from "@/components/motion/MotionProvider";
import { PortraitArch } from "@/components/Portrait";
import { Fireworks, type FireworksHandle } from "@/components/ornaments/Fireworks";
import { JaalBackground } from "@/components/ornaments/JaalBackground";
import { PetalField } from "@/components/ornaments/PetalField";

type Who = "groom" | "bride";

// The varmala: a garland hung from one finial to the other, sagging into the
// valley between the two arches. Positions are in % of the row of arches.
const FROM = { x: 23, y: 8 };
const SAG = { x: 50, y: 58 };
const TO = { x: 77, y: 8 };
const onGarland = (t: number) => ({
  x: (1 - t) ** 2 * FROM.x + 2 * (1 - t) * t * SAG.x + t ** 2 * TO.x,
  y: (1 - t) ** 2 * FROM.y + 2 * (1 - t) * t * SAG.y + t ** 2 * TO.y,
});
const BLOOMS = Array.from({ length: 15 }, (_, i) => ({ ...onGarland(i / 14), alt: i % 2 === 1, big: i === 7 }));

// Glints of light around an arch as its portrait is uncovered: left %, top %, size rem
const GLINTS = [
  [-7, 30, 1.1], [105, 24, 0.9], [4, 8, 0.7], [97, 52, 0.8], [-5, 68, 0.7],
];

/** One jharokha: glow behind, portrait inside, covers over it, glints around it. */
function Jharokha({ who }: { who: Who }) {
  return (
    <div data-who={who} className="relative w-[46%]">
      <div
        data-glow
        className="pointer-events-none absolute -inset-[18%] opacity-0"
        style={{ background: "radial-gradient(ellipse at 50% 55%, color-mix(in oklab, var(--saffron) 55%, transparent), transparent 68%)" }}
      />
      <PortraitArch who={who} className="w-full">
        {/* the portrait comes out of shadow, then light passes across it */}
        <div data-tint className="pointer-events-none absolute inset-0 bg-wine opacity-0" />
        <div data-shine className="portrait-shine pointer-events-none absolute inset-y-0 left-0 w-full" />
        {who === "groom" ? (
          // two carved leaves on hinges
          <div className="absolute inset-0 [perspective:700px]">
            <div data-door="left" className="portrait-cover portrait-door absolute inset-y-0 left-0 w-1/2 origin-left" />
            <div data-door="right" className="portrait-cover portrait-door absolute inset-y-0 right-0 w-1/2 origin-right" />
          </div>
        ) : (
          // a veil in two layers, lifted from the hem
          <div className="absolute inset-0 [perspective:700px]">
            <div data-veil="sheer" className="portrait-cover portrait-veil-sheer absolute inset-0 origin-top" />
            <div data-veil="outer" className="portrait-cover portrait-veil absolute inset-0 origin-top" />
          </div>
        )}
      </PortraitArch>
      {GLINTS.map(([left, top, size]) => (
        <svg
          key={`${left}-${top}`}
          data-glint
          viewBox="-10 -10 20 20"
          className="pointer-events-none absolute opacity-0"
          style={{ left: `${left}%`, top: `${top}%`, width: `${size}rem` }}
          aria-hidden="true"
        >
          <path d="M0 -10L2 -2L10 0L2 2L0 10L-2 2L-10 0L-2 -2Z" fill="var(--gold-pale)" />
        </svg>
      ))}
    </div>
  );
}

function Name({ who }: { who: Who }) {
  return (
    <h2 className="relative overflow-hidden px-3 font-script text-[clamp(3rem,14.5vw,5.5rem)] leading-[1.15] text-gold-pale">
      <span data-name={who}>{wedding[who].name}</span>
      <span data-shimmer={who} className="name-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/2" aria-hidden="true" />
    </h2>
  );
}

const LINE = "text-balance text-[clamp(1.05rem,4.6vw,1.5rem)] leading-snug";

/**
 * Sections 3 to 5 as one scene. Two jharokhas draw themselves side by side.
 * Scrolling swings his doors open and lifts her veil, each portrait coming out
 * of shadow under a pass of light; writes each name with its family lines;
 * then hangs a marigold varmala from one arch to the other, bloom by bloom,
 * under petals and fireworks.
 */
export function Meeting() {
  const root = useRef<HTMLElement>(null);
  const fireworks = useRef<FireworksHandle>(null);
  const { lowEnd } = useMotion();

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        section.dataset.armed = ""; // CSS now shows the doors and the veil
        const names = {
          groom: SplitText.create('[data-name="groom"]', { type: "chars" }),
          bride: SplitText.create('[data-name="bride"]', { type: "chars" }),
        };

        // Arrival: the arches draw themselves as the section comes into view.
        const arrival = { trigger: section, start: "top 62%", once: true };
        gsap.from(".arch-line", { drawSVG: 0, duration: 1.9, stagger: 0.1, ease: "power2.inOut", scrollTrigger: arrival });
        gsap.from(".arch-finial", { autoAlpha: 0, duration: 1, delay: 0.9, ease: "power2.out", scrollTrigger: arrival });

        // Fireworks, and the first time a handful of petals from the middle of the
        // garland. A plain function on purpose: it makes no GSAP objects, and
        // wrapping it with contextSafe ties this scene's two GSAP contexts into
        // a loop that overflows the stack when the scene is torn down.
        let showered = false;
        const celebrate = async () => {
          // only when the guest scrolls through it, not when a reload lands further down the page
          if (!scene.scrollTrigger?.isActive) return;
          fireworks.current?.launch(5);
          const knot = section.querySelector("[data-pendant]");
          if (showered || !knot) return;
          showered = true;
          const { default: confetti } = await import("canvas-confetti");
          const box = knot.getBoundingClientRect();
          const css = getComputedStyle(knot);
          confetti({
            particleCount: lowEnd ? 22 : 54,
            spread: 120,
            startVelocity: 26,
            gravity: 0.6,
            scalar: 1.5,
            ticks: 240,
            shapes: [confetti.shapeFromPath({ path: "M0 -10C8 -4 6 8 0 10C-6 8 -8 -4 0 -10Z" })],
            colors: ["--marigold", "--gold", "--ivory"].map((name) => css.getPropertyValue(name).trim()),
            origin: { x: (box.left + box.width / 2) / window.innerWidth, y: (box.top + box.height / 2) / window.innerHeight },
            disableForReducedMotion: true,
          });
        };

        /** Uncover one portrait, then write that person's name and lines. */
        const reveal = (who: Who) => {
          const at = (selector: string) => `[data-who="${who}"] ${selector}`;
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
          if (who === "groom") {
            tl.to('[data-door="left"]', { rotateY: -112, duration: 1.6 }, 0).to('[data-door="right"]', { rotateY: 112, duration: 1.6 }, 0);
          } else {
            tl.to('[data-veil="outer"]', { yPercent: -108, rotateX: 38, duration: 1.6 }, 0).to(
              '[data-veil="sheer"]',
              { yPercent: -108, rotateX: 24, duration: 1.5 },
              0.35,
            );
          }
          return tl
            .fromTo(at("[data-glow]"), { autoAlpha: 0 }, { autoAlpha: 0.75, duration: 1.4, ease: "power1.out" }, 0.1)
            .fromTo(at("[data-tint]"), { autoAlpha: 0.8 }, { autoAlpha: 0, duration: 1.5, ease: "power1.out" }, 0.3)
            .fromTo(at("[data-portrait]"), { scale: 1.18 }, { scale: 1, duration: 2, ease: "power2.out" }, 0)
            .fromTo(at("[data-shine]"), { xPercent: -110, autoAlpha: 1 }, { xPercent: 110, autoAlpha: 1, duration: 1, ease: "power1.inOut" }, 1.5)
            .set(at("[data-shine]"), { autoAlpha: 0 })
            .fromTo(
              at("[data-glint]"),
              { scale: 0, rotation: -90, autoAlpha: 0 },
              { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.45, stagger: 0.12, ease: "power2.out" },
              1.5,
            )
            .to(at("[data-glow]"), { autoAlpha: 0.35, duration: 0.8 }, 2.1)
            .from(names[who].chars, { autoAlpha: 0, duration: 0.25, stagger: 0.15, ease: "none" }, 1.5)
            .fromTo(`[data-shimmer="${who}"]`, { xPercent: -100, autoAlpha: 1 }, { xPercent: 200, autoAlpha: 1, duration: 1, ease: "power1.inOut" }, ">-0.5")
            .set(`[data-shimmer="${who}"]`, { autoAlpha: 0 })
            .from(`[data-lines="${who}"] p`, { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.4, ease: "power2.out" }, "<0.2");
        };

        const scene = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: section, start: "top top", end: "+=300%", pin: true, scrub: 0.7 },
        });
        scene
          .add(reveal("groom"))
          .from("[data-with]", { autoAlpha: 0, duration: 0.5 })
          .add(reveal("bride"))
          // the varmala
          .from("[data-garland]", { drawSVG: 0, duration: 1.5, ease: "power1.inOut" })
          .from("[data-bloom]", { scale: 0, autoAlpha: 0, duration: 0.35, stagger: 0.09, ease: "power2.out" }, "<0.15")
          .from("[data-pendant]", { autoAlpha: 0, y: -10, duration: 0.5, ease: "power2.out" }, "-=0.3")
          .call(celebrate)
          .to({}, { duration: 1.4 }); // hold under the fireworks before unpinning

        return () => {
          delete section.dataset.armed;
          names.groom.revert();
          names.bride.revert();
        };
      });
    },
    { scope: root, dependencies: [lowEnd], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      data-section="meeting"
      className="relative flex h-svh min-h-[36rem] flex-col items-center justify-center overflow-hidden px-4 py-4 text-center"
      style={{ background: "radial-gradient(ellipse 100% 55% at 50% 30%, var(--wine-raised), var(--wine) 78%)" }}
    >
      <JaalBackground opacity={0.1} />
      <PetalField petals={10} dust={28} />
      <Fireworks ref={fireworks} />

      {/* two arches, each 46% of the row; never wider than the picture files */}
      <div className="relative flex w-[min(100%,calc(37svh*1.359),58rem)] shrink-0 justify-between lg:w-[min(100%,calc(50svh*1.359),58rem)]">
        <Jharokha who="groom" />
        <Jharokha who="bride" />

        {/* the varmala */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
            <path data-garland d={`M${FROM.x} ${FROM.y}Q${SAG.x} ${SAG.y} ${TO.x} ${TO.y}`} stroke="var(--brass)" strokeWidth="0.6" />
          </svg>
          {BLOOMS.map((bloom, i) => (
            <span
              key={i}
              data-bloom
              className={`garland-bloom absolute rounded-full ${bloom.big ? "w-[7.5%]" : "w-[5.2%]"} ${bloom.alt ? "bg-saffron" : "bg-marigold"}`}
              style={{ left: `${bloom.x}%`, top: `${bloom.y}%` }}
            />
          ))}
          <span data-pendant className="absolute left-1/2 flex -translate-x-1/2 gap-[0.35rem]" style={{ top: `${onGarland(0.5).y + 3}%` }}>
            {[0, 1, 2].map((n) => (
              <span key={n} className={`garland-tassel ${n === 1 ? "h-9" : "h-6"}`} />
            ))}
          </span>
        </div>
      </div>

      <div className="relative mt-[clamp(0.25rem,1.5svh,1rem)] flex flex-col items-center">
        <Name who="groom" />
        <div data-lines="groom">
          <p className={LINE}>{wedding.groom.lineage}</p>
          <p className={`${LINE} text-ivory-soft`}>{wedding.groom.address}</p>
        </div>
        <p data-with className="mt-[clamp(0.4rem,1.6svh,1rem)] text-[clamp(1.15rem,5vw,1.6rem)] leading-none text-gold">
          {wedding.bride.with}
        </p>
        <Name who="bride" />
        <div data-lines="bride">
          <p className={LINE}>{wedding.bride.lineage}</p>
          <p className={`${LINE} text-ivory-soft`}>{wedding.bride.address}</p>
        </div>
      </div>
    </section>
  );
}
