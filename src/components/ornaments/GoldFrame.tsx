import type { ReactNode } from "react";

const CORNERS = [
  "left-0 top-0",
  "right-0 top-0 -scale-x-100",
  "left-0 bottom-0 -scale-y-100",
  "right-0 bottom-0 -scale-100",
];

function Corner({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      className={`absolute h-12 w-12 ${className}`}
      fill="none"
      stroke="var(--gold)"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* the frame steps in at each corner around a small bloom */}
      <path d="M2 56V26C2 22 4 20 8 20H14C17 20 20 17 20 14V8C20 4 22 2 26 2H56" strokeWidth="2" />
      <path d="M10 56V30M30 10H56" stroke="var(--gold-pale)" strokeWidth="1" />
      <path
        d="M30 30C30 24 34 20 40 20C40 26 36 30 30 30ZM30 30C24 30 20 34 20 40C26 40 30 36 30 30Z"
        fill="var(--gold)"
        fillOpacity="0.35"
        strokeWidth="1"
      />
      <circle cx="30" cy="30" r="2" fill="var(--gold-pale)" stroke="none" />
    </svg>
  );
}

type GoldFrameProps = {
  children: ReactNode;
  className?: string;
};

/** A double gold rule with stepped, flowered corners around any content. */
export function GoldFrame({ children, className = "" }: GoldFrameProps) {
  return (
    <div className={`relative p-8 sm:p-10 ${className}`}>
      <div
        className="pointer-events-none absolute inset-x-12 top-0 border-t-2 border-gold"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-12 bottom-0 border-b-2 border-gold"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-12 left-0 border-l-2 border-gold"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-12 right-0 border-r-2 border-gold"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-2 border border-gold-pale/50 [clip-path:inset(0_2.6rem)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-2 border border-gold-pale/50 [clip-path:inset(2.6rem_0)]"
        aria-hidden="true"
      />
      {CORNERS.map((position) => (
        <Corner key={position} className={position} />
      ))}
      <div className="relative">{children}</div>
    </div>
  );
}
