"use client";

import { useId, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/components/motion/MotionProvider";

const H = 640;
const INSET = 0.94;

// Ogee jharokha outline on a 400-wide grid: pillar, rounded shoulder, then a
// concave sweep to a point. The wide arch stretches the same points sideways.
const POINTS: [number, number][] = [
  [20, 640], [20, 270],
  [20, 170], [130, 190], [165, 135],
  [180, 110], [192, 90], [200, 60],
  [208, 90], [220, 110], [235, 135],
  [270, 190], [380, 170], [380, 270],
  [380, 640],
];

function outline(map: (x: number, y: number) => [number, number]) {
  const p = POINTS.map(([x, y]) =>
    map(x, y)
      .map((n) => Number(n.toFixed(4)))
      .join(" "),
  );
  return `M${p[0]} L${p[1]} C${p[2]} ${p[3]} ${p[4]} C${p[5]} ${p[6]} ${p[7]} C${p[8]} ${p[9]} ${p[10]} C${p[11]} ${p[12]} ${p[13]} L${p[14]}`;
}

function shapes(W: number) {
  const k = W / 400;
  const outer = (x: number, y: number): [number, number] => [x * k, y];
  // the inner line is the outer one scaled about the centre of the sill
  const inner = (x: number, y: number): [number, number] => [
    W / 2 + (x * k - W / 2) * INSET,
    H + (y - H) * INSET,
  ];
  const l = 20 * k;
  const r = 380 * k;
  return {
    W,
    outer: outline(outer),
    inner: outline(inner),
    clip: `${outline((x, y) => {
      const [ix, iy] = inner(x, y);
      return [ix / W, iy / H];
    })} Z`,
    // capitals and bases
    trim: `M${l - 14} 270H${l + 16}M${r - 16} 270H${r + 14}M${l - 12} 262H${l + 12}M${r - 12} 262H${r + 12}M${l - 16} 638H${l + 18}M${r - 18} 638H${r + 16}M${l - 11} 626H${l + 11}M${r - 11} 626H${r + 11}`,
  };
}

const NARROW = shapes(400);
const WIDE = shapes(520);

type ArchProps = {
  /** Shown inside the arch, clipped to its inner line. */
  children?: ReactNode;
  /** Draw the gold lines on as the arch scrolls into view. */
  draw?: boolean;
  /** A broader arch (520 x 640) for two people. */
  wide?: boolean;
  className?: string;
};

export function Arch({ children, draw = false, wide = false, className = "" }: ArchProps) {
  const root = useRef<HTMLDivElement>(null);
  const clipId = useId();
  const reducedMotion = useReducedMotion();
  const s = wide ? WIDE : NARROW;

  useGSAP(
    () => {
      if (!draw || reducedMotion) return;
      gsap.from(".arch-line", {
        drawSVG: 0,
        duration: 2.4,
        ease: "power2.inOut",
        stagger: 0.3,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
      gsap.from(".arch-finial", {
        opacity: 0,
        duration: 1.2,
        delay: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    },
    { scope: root, dependencies: [draw, reducedMotion] },
  );

  return (
    <div ref={root} className={`relative ${wide ? "aspect-[520/640]" : "aspect-[400/640]"} ${className}`}>
      {children !== undefined && (
        <div className="absolute inset-0" style={{ clipPath: `url(#${clipId})` }}>
          {children}
        </div>
      )}
      <svg
        viewBox={`0 0 ${s.W} ${H}`}
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={s.clip} />
          </clipPath>
        </defs>
        <path className="arch-line" d={s.outer} stroke="var(--gold)" strokeWidth="3" />
        <path className="arch-line" d={s.inner} stroke="var(--gold-pale)" strokeWidth="1.25" />
        <path className="arch-line" d={s.trim} stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" />
        {/* lotus-bud finial */}
        <g className="arch-finial" fill="var(--gold)" transform={`translate(${s.W / 2 - 200})`}>
          <path d="M200 60C189 44 191 26 200 10C209 26 211 44 200 60Z" />
          <path d="M200 60C186 56 177 46 174 33C187 35 196 45 200 60Z" opacity="0.75" />
          <path d="M200 60C214 56 223 46 226 33C213 35 204 45 200 60Z" opacity="0.75" />
        </g>
      </svg>
    </div>
  );
}
