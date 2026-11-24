import { useId } from "react";

type DiyaProps = {
  /** An unlit diya shows the lamp only; lighting it fades the flame in. */
  lit?: boolean;
  /** Seconds to offset the flicker, so a row of diyas does not move in step. */
  delay?: number;
  className?: string;
};

export function Diya({ lit = true, delay = 0, className = "" }: DiyaProps) {
  const id = useId();
  const offset = { animationDelay: `${-delay}s` };

  return (
    <svg
      viewBox="0 0 120 130"
      className={`overflow-visible ${lit ? "diya-lit" : ""} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" style={{ stopColor: "var(--saffron)", stopOpacity: 0.7 }} />
          <stop offset="1" style={{ stopColor: "var(--marigold)", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id={`${id}-flame`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" style={{ stopColor: "var(--marigold)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--saffron)" }} />
          <stop offset="1" style={{ stopColor: "var(--gold-pale)" }} />
        </linearGradient>
        <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--gold-pale)" }} />
          <stop offset="0.45" style={{ stopColor: "var(--gold)" }} />
          <stop offset="1" style={{ stopColor: "var(--brass)" }} />
        </linearGradient>
      </defs>

      {/* .diya-fire is the handle scroll scenes fade to light the lamp */}
      <g className="diya-fire">
        <circle className="diya-glow" cx="60" cy="46" r="58" fill={`url(#${id}-glow)`} style={offset} />
        <g className="diya-flame" style={offset}>
          <path d="M60 10C76 34 74 62 60 72C46 62 44 34 60 10Z" fill={`url(#${id}-flame)`} />
          <path d="M60 38C67 50 66 64 60 69C54 64 53 50 60 38Z" fill="var(--ivory)" opacity="0.85" />
        </g>
      </g>

      {/* lamp */}
      <path d="M8 76C12 104 40 116 60 116C80 116 108 104 112 76Z" fill={`url(#${id}-brass)`} />
      <ellipse cx="60" cy="76" rx="52" ry="8" fill="var(--brass)" />
      <ellipse cx="60" cy="76" rx="44" ry="5.5" fill="var(--wine-raised)" />
      <path d="M44 114L38 126H82L76 114Z" fill="var(--brass)" />
      <path
        d="M20 90C32 102 46 107 60 107C74 107 88 102 100 90"
        fill="none"
        stroke="var(--wine)"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeDasharray="1 6"
        strokeLinecap="round"
      />
    </svg>
  );
}
