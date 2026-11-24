import type { CSSProperties, ReactNode } from "react";

const r2 = (n: number) => Number(n.toFixed(2));

/** A pointed petal standing on the circle of radius `from`, reaching `to`. */
function petal(from: number, to: number, halfWidth: number) {
  const len = to - from;
  const a = -r2(from + len * 0.3);
  const b = -r2(from + len * 0.78);
  const w = r2(halfWidth);
  const w2 = r2(halfWidth * 0.55);
  return `M0 ${-from}C${w} ${a} ${w2} ${b} 0 ${-to}C${-w2} ${b} ${-w} ${a} 0 ${-from}Z`;
}

const RINGS = [
  { count: 8, from: 34, to: 84, halfWidth: 19, fill: "var(--gold)", fillOpacity: 0.16 },
  { count: 16, from: 92, to: 136, halfWidth: 14, fill: "var(--marigold)", fillOpacity: 0.1 },
  { count: 24, from: 144, to: 186, halfWidth: 12, fill: "var(--gold)", fillOpacity: 0.06 },
];

type MandalaProps = {
  /** Seconds for one full turn of the outer ring. Omit for a still mandala. */
  turn?: number;
  /** Fixed rotation in degrees, for scenes that drive it themselves. */
  rotation?: number;
  /** Centred over the mandala: a monogram, a line-art figure. */
  children?: ReactNode;
  className?: string;
};

export function Mandala({ turn, rotation = 0, children, className = "" }: MandalaProps) {
  return (
    <div className={`relative aspect-square ${className}`}>
      <svg
        viewBox="-200 -200 400 400"
        className={`absolute inset-0 h-full w-full ${turn ? "mandala-spin" : ""}`}
        style={
          {
            "--mandala-turn": turn ? `${turn}s` : undefined,
            transform: rotation ? `rotate(${rotation}deg)` : undefined,
          } as CSSProperties
        }
        fill="none"
        stroke="var(--gold)"
        aria-hidden="true"
      >
        {RINGS.map((ring, i) => (
          <g key={i} className="mandala-ring" strokeWidth={1.4 - i * 0.2}>
            <circle r={ring.from - 4} strokeOpacity="0.7" />
            {Array.from({ length: ring.count }, (_, n) => (
              <path
                key={n}
                d={petal(ring.from, ring.to, ring.halfWidth)}
                transform={`rotate(${r2((360 / ring.count) * n)})`}
                fill={ring.fill}
                fillOpacity={ring.fillOpacity}
              />
            ))}
          </g>
        ))}
        <circle r="192" strokeWidth="1.5" />
        <circle r="197" strokeWidth="0.75" strokeOpacity="0.6" strokeDasharray="1 7" strokeLinecap="round" />
      </svg>
      {children !== undefined && (
        <div className="absolute inset-0 grid place-items-center">{children}</div>
      )}
    </div>
  );
}
