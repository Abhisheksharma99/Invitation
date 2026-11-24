import { useId } from "react";

const LEAF = "M0 0C11 -18 9 -42 0 -56C-9 -42 -11 -18 0 0Z";

export function Kalash({ className = "" }: { className?: string }) {
  const id = useId();

  return (
    <svg viewBox="0 0 160 226" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--brass)" }} />
          <stop offset="0.35" style={{ stopColor: "var(--gold-pale)" }} />
          <stop offset="0.6" style={{ stopColor: "var(--gold)" }} />
          <stop offset="1" style={{ stopColor: "var(--brass)" }} />
        </linearGradient>
      </defs>

      {/* mango leaves, fanned behind the coconut */}
      <g transform="translate(80 96)" stroke="var(--wine)" strokeOpacity="0.5" strokeWidth="1">
        {[-64, -34, 34, 64].map((angle) => (
          <path key={angle} d={LEAF} transform={`rotate(${angle})`} fill="var(--brass)" />
        ))}
        {[-17, 17].map((angle) => (
          <path key={angle} d={LEAF} transform={`rotate(${angle}) scale(1.08)`} fill="var(--gold)" />
        ))}
      </g>

      {/* coconut */}
      <path
        d="M80 22C96 40 102 62 96 80C92 92 68 92 64 80C58 62 64 40 80 22Z"
        fill="var(--ember)"
        stroke="var(--gold)"
        strokeWidth="1.5"
      />
      <path
        d="M80 26C84 46 84 68 80 88M72 40C70 56 70 72 73 86M88 40C90 56 90 72 87 86"
        fill="none"
        stroke="var(--gold-pale)"
        strokeOpacity="0.5"
        strokeWidth="1"
      />

      {/* pot */}
      <path d="M52 96H108C100 104 100 112 106 120H54C60 112 60 104 52 96Z" fill={`url(#${id}-brass)`} />
      <ellipse cx="80" cy="96" rx="30" ry="5.5" fill="var(--gold-pale)" />
      <path d="M54 120C18 130 14 196 80 204C146 196 142 130 106 120Z" fill={`url(#${id}-brass)`} />
      <path d="M64 204L56 220H104L96 204Z" fill="var(--brass)" />
      <path d="M52 222H108" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />

      {/* chased band around the belly */}
      <g fill="none" stroke="var(--wine)" strokeOpacity="0.55" strokeLinecap="round">
        <path d="M27 150C52 160 108 160 133 150" strokeWidth="1.5" />
        <path d="M26 168C52 178 108 178 134 168" strokeWidth="1.5" />
        <path d="M30 160C54 169 106 169 130 160" strokeWidth="3" strokeDasharray="0.5 9" />
      </g>
    </svg>
  );
}
