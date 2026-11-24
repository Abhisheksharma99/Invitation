import { useId } from "react";
import { mix, put, span, type Pose } from "./pose";

// Seen from outside the home at dawn. The doors open on the lamp-lit room, the
// kalash at the threshold tips inward and its rice spills across the floor,
// and alta footprints walk away from us, in through the door.

// grains come to rest on the floor inside the doorway
const RICE = [
  [170, 134], [178, 130], [186, 135], [193, 129], [200, 134], [175, 126], [184, 124], [192, 123], [206, 130], [167, 129], [198, 126], [181, 137],
];
// x, y, size, tilt, in the order they are stepped: the first is nearest to us
// and largest, each one after it smaller and closer to the door
const STEPS = [
  [174, 194, 1.08, 8], [146, 182, 0.88, -8], [170, 170, 0.7, 8], [150, 160, 0.55, -8],
];

function Leaf({ side }: { side: "left" | "right" }) {
  const x = side === "left" ? 96 : 160;
  return (
    <g className={`vp-door-${side}`}>
      <rect x={x} y="14" width="64" height="126" fill="var(--wine-panel)" stroke="var(--gold)" strokeWidth="2" />
      <rect x={x + 8} y="24" width="48" height="46" fill="none" stroke="var(--brass)" strokeWidth="1.5" />
      <rect x={x + 8} y="80" width="48" height="50" fill="none" stroke="var(--brass)" strokeWidth="1.5" />
      <circle cx={side === "left" ? 152 : 168} cy="78" r="3" fill="var(--gold-pale)" />
    </g>
  );
}

export function VadhuPraveshMotif({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="66 2 188 208" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-dawn`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--gold-pale)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--ivory)" }} />
          <stop offset="1" style={{ stopColor: "var(--saffron)" }} />
        </linearGradient>
        <clipPath id={`${id}-doorway`}>
          <rect x="96" y="14" width="128" height="126" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-doorway)`}>
        <rect x="96" y="14" width="128" height="126" fill={`url(#${id}-dawn)`} />
        {/* the room inside: a hanging lamp and the floor running back from the threshold */}
        <path d="M96 140L120 116H200L224 140Z" fill="var(--brass)" opacity="0.55" />
        <path d="M120 116H200" stroke="var(--brass)" strokeWidth="1.5" />
        <g className="vp-lamp">
          <circle cx="160" cy="66" r="26" fill="var(--saffron)" opacity="0.45" />
          <path d="M160 14V50" stroke="var(--brass)" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M148 56H172L168 68C165 73 155 73 152 68Z" fill="var(--gold)" stroke="var(--brass)" strokeWidth="1.2" />
          <path d="M160 56C165 49 164 43 160 38C156 43 155 49 160 56Z" fill="var(--marigold)" />
        </g>
        <Leaf side="left" />
        <Leaf side="right" />
      </g>

      {/* door frame, lintel garland, threshold */}
      <path d="M92 142V12H228V142" fill="none" stroke="var(--gold)" strokeWidth="4" strokeLinejoin="round" />
      <path d="M82 12H238" stroke="var(--gold)" strokeWidth="4" strokeLinecap="round" />
      {[104, 120, 136, 152, 168, 184, 200, 216].map((x) => (
        <circle key={x} cx={x} cy="20" r="5" fill={x % 32 ? "var(--marigold)" : "var(--saffron)"} />
      ))}
      <path d="M78 142H242" stroke="var(--gold)" strokeWidth="5" strokeLinecap="round" />

      {/* rice, then the kalash that spilled it */}
      {RICE.map(([x, y], i) => (
        <ellipse key={i} className="vp-rice" cx={x} cy={y} rx="3" ry="1.5" fill="var(--ivory)" />
      ))}
      <g className="vp-kalash">
        <path d="M143 122H157C155 125 155 127 157 129C166 132 166 141 150 142C134 141 134 132 143 129C145 127 145 125 143 122Z" fill="var(--gold)" stroke="var(--brass)" strokeWidth="1.2" />
        <path d="M150 122C146 116 147 111 150 107C153 111 154 116 150 122Z" fill="var(--ember)" />
      </g>

      {STEPS.map(([x, y, size, tilt]) => (
        <g key={y} className="vp-step" transform={`translate(${x} ${y}) rotate(${tilt}) scale(${size})`} fill="var(--marigold)">
          <path d="M0 -7C5 -7 6 0 5 6C4 11 -4 11 -5 6C-6 0 -5 -7 0 -7Z" />
          <circle cx="-4" cy="-11" r="1.9" />
          <circle cx="0" cy="-12.5" r="2.1" />
          <circle cx="4" cy="-11" r="1.9" />
        </g>
      ))}
    </svg>
  );
}

export const poseVadhuPravesh: Pose = (svg, p) => {
  const open = span(p, 0, 0.36);
  put(svg, ".vp-door-left", { origin: "96px 77px", scaleX: mix(1, 0.14, open) });
  put(svg, ".vp-door-right", { origin: "224px 77px", scaleX: mix(1, 0.14, open) });
  svg.querySelectorAll<SVGElement>(".vp-lamp").forEach((lamp) => {
    lamp.style.opacity = String(mix(0.25, 1, span(p, 0.1, 0.45)));
  });
  // the kalash goes over away from us, into the room
  const tip = span(p, 0.4, 0.58);
  put(svg, ".vp-kalash", { origin: "158px 142px", rotate: mix(0, 78, tip), y: mix(0, -9, tip), scaleX: mix(1, 0.86, tip), scaleY: mix(1, 0.86, tip) });
  put(svg, ".vp-rice", (i) => {
    const spill = span(p, 0.5 + i * 0.01, 0.66 + i * 0.01);
    const [x, y] = RICE[i];
    // each grain rolls from the mouth of the pot to its place on the floor
    return { origin: `${x}px ${y}px`, rotate: (i * 47) % 180, x: mix(166 - x, 0, spill), y: mix(134 - y, 0, spill), opacity: spill };
  });
  svg.querySelectorAll<SVGElement>(".vp-step").forEach((step, i) => {
    step.style.opacity = String(span(p, 0.66 + i * 0.075, 0.74 + i * 0.075));
  });
};
