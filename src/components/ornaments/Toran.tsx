const r1 = (n: number) => Number(n.toFixed(1));

const SPAN = 100; // width of one swag
const TOP = 10; // height of the rail the garland hangs from
const DIP = 44; // how far each swag sags
const FLOWERS = 9; // marigolds per swag

/** Point on the swag between two pegs, t from 0 to 1. */
function onSwag(x0: number, t: number): [number, number] {
  // parabola: peg, low point, peg
  const y = TOP + 4 * (1 - t) * t * DIP;
  return [r1(x0 + t * SPAN), r1(y)];
}

function Marigold({ x, y, r, alt }: { x: number; y: number; r: number; alt: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={alt ? "var(--saffron)" : "var(--marigold)"} />
      <circle
        r={r * 0.62}
        fill="none"
        stroke="var(--ember)"
        strokeWidth={r * 0.28}
        strokeDasharray={`${r * 0.36} ${r * 0.29}`}
        opacity="0.7"
      />
      <circle r={r * 0.24} fill="var(--gold-pale)" />
    </g>
  );
}

function BudString({ x, length, delay }: { x: number; length: number; delay: number }) {
  const beads = Math.floor((length - 16) / 12);
  return (
    <g className="toran-string" style={{ animationDelay: `${-delay}s` }}>
      <path d={`M${x} ${TOP}V${TOP + length}`} stroke="var(--brass)" strokeWidth="1" />
      {Array.from({ length: beads }, (_, i) => (
        <circle
          key={i}
          cx={x}
          cy={TOP + 16 + i * 12}
          r="3.2"
          fill={i % 2 ? "var(--saffron)" : "var(--marigold)"}
        />
      ))}
      {/* closed bud at the tip */}
      <path
        d={`M${x} ${TOP + length - 4}c5 5 5 12 0 18c-5-6-5-13 0-18Z`}
        fill="var(--gold)"
      />
    </g>
  );
}

type ToranProps = {
  /** Number of swags across. Use more on wider screens. */
  swags?: number;
  /** Let the hanging strings sway. */
  sway?: boolean;
  className?: string;
};

export function Toran({ swags = 4, sway = true, className = "" }: ToranProps) {
  const width = swags * SPAN;

  return (
    <svg
      viewBox={`0 0 ${width} 124`}
      className={`block w-full overflow-visible ${sway ? "toran-sway" : ""} ${className}`}
      aria-hidden="true"
    >
      <path d={`M0 ${TOP}H${width}`} stroke="var(--brass)" strokeWidth="2" />

      {/* strings hang behind the garland: long at the pegs, short at the dips */}
      {Array.from({ length: swags + 1 }, (_, i) => (
        <BudString key={`peg-${i}`} x={i * SPAN} length={92} delay={i * 1.3} />
      ))}
      {Array.from({ length: swags }, (_, i) => (
        <BudString key={`dip-${i}`} x={i * SPAN + SPAN / 2} length={78} delay={i * 1.3 + 0.7} />
      ))}

      {Array.from({ length: swags }, (_, s) =>
        Array.from({ length: FLOWERS }, (_, f) => {
          const [x, y] = onSwag(s * SPAN, (f + 0.5) / FLOWERS);
          return <Marigold key={`${s}-${f}`} x={x} y={y} r={7.2} alt={f % 2 === 1} />;
        }),
      )}

      {/* a larger bloom covers each peg */}
      {Array.from({ length: swags + 1 }, (_, i) => (
        <Marigold key={`knot-${i}`} x={i * SPAN} y={TOP} r={9} alt={false} />
      ))}
    </svg>
  );
}
