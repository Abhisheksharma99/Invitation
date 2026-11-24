import { useId } from "react";

type JaalBackgroundProps = {
  /** Line opacity, 0 to 1. The lattice should stay faint behind text. */
  opacity?: number;
  /** Size of one lattice cell in CSS px. */
  cell?: number;
  className?: string;
};

/** A faint jaali lattice that fills its positioned parent and fades at the edges. */
export function JaalBackground({ opacity = 0.14, cell = 56, className = "" }: JaalBackgroundProps) {
  const id = useId();

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{
        opacity,
        maskImage: "radial-gradient(ellipse at center, black 35%, transparent 100%)",
      }}
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} width={cell} height={cell} patternUnits="userSpaceOnUse" viewBox="0 0 48 48">
          <g fill="none" stroke="var(--gold)" strokeWidth="1">
            {/* interlocking circles give the pointed-petal lattice of a stone jaali */}
            <circle cx="24" cy="24" r="24" />
            <circle cx="0" cy="0" r="24" />
            <circle cx="48" cy="0" r="24" />
            <circle cx="0" cy="48" r="24" />
            <circle cx="48" cy="48" r="24" />
            <path d="M24 17L31 24L24 31L17 24Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
