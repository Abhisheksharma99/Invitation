import { mix, put, span, type Pose } from "./pose";

// A safa with its kalgi, sehra strings falling one by one, string lights and rising sparks.

const BULBS = Array.from({ length: 11 }, (_, i) => {
  const t = i / 10;
  return { x: 10 + t * 300, y: 8 + 4 * 20 * t * (1 - t) };
});
const STRINGS = Array.from({ length: 9 }, (_, i) => ({ x: 124 + i * 9, length: 62 + (i % 2) * 8 }));
const SPARKS = [
  [40, 176], [72, 150], [58, 118], [262, 172], [246, 138], [280, 120], [98, 184], [226, 186], [30, 132], [292, 156],
];

export function SehraBaratMotif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 182" className={className} aria-hidden="true">
      {/* string lights */}
      <path d="M10 8Q160 48 310 8" fill="none" stroke="var(--brass)" strokeWidth="1.5" />
      {BULBS.map((b) => (
        <g key={b.x} className="sb-bulb" transform={`translate(${b.x.toFixed(1)} ${(b.y + 5).toFixed(1)})`}>
          <circle r="10" fill="var(--saffron)" opacity="0.3" />
          <circle r="4.5" fill="var(--gold-pale)" />
        </g>
      ))}

      {/* sehra strings hang from the brow, behind the safa */}
      {STRINGS.map((s) => (
        <g key={s.x} className="sb-string">
          <path d={`M${s.x} 104V${104 + s.length}`} stroke="var(--gold)" strokeWidth="1" />
          {[0, 1, 2, 3].map((n) => (
            <circle key={n} cx={s.x} cy={116 + n * 12} r="2.6" fill={n % 2 ? "var(--gold-pale)" : "var(--ivory)"} />
          ))}
          <circle cx={s.x} cy={106 + s.length} r="4" fill="var(--marigold)" />
        </g>
      ))}

      {/* safa */}
      <path d="M204 96C222 104 228 126 218 148C210 134 204 116 198 102Z" fill="var(--marigold)" stroke="var(--ember)" strokeWidth="1.5" />
      <path d="M112 100C106 64 128 40 160 40C192 40 214 64 208 100C188 110 132 110 112 100Z" fill="var(--marigold)" stroke="var(--ember)" strokeWidth="2" />
      <g fill="none" stroke="var(--gold-pale)" strokeWidth="1.8" strokeLinecap="round">
        <path d="M114 90C138 70 182 66 207 84" />
        <path d="M116 74C138 56 178 52 203 68" />
        <path d="M124 60C142 47 172 45 194 55" />
      </g>
      <path d="M112 100C132 110 188 110 208 100" fill="none" stroke="var(--gold)" strokeWidth="4" strokeLinecap="round" />
      {/* kalgi: plume and jewel */}
      <path d="M160 50C148 32 150 14 164 4C174 18 172 34 160 50Z" fill="var(--ivory)" stroke="var(--gold)" strokeWidth="1.2" />
      <path d="M160 50C158 34 160 20 164 8" fill="none" stroke="var(--gold)" strokeWidth="1" />
      <circle cx="160" cy="56" r="7" fill="var(--gold-pale)" stroke="var(--brass)" strokeWidth="2" />
      <circle cx="160" cy="56" r="2.6" fill="var(--ember)" />

      {SPARKS.map(([x, y]) => (
        <circle key={`${x}-${y}`} className="sb-spark" cx={x} cy={y} r="2.2" fill="var(--gold-pale)" opacity="0" />
      ))}
    </svg>
  );
}

export const poseSehraBarat: Pose = (svg, p) => {
  put(svg, ".sb-string", (i) => {
    const fall = span(p, 0.05 + i * 0.045, 0.2 + i * 0.045);
    return { y: mix(-34, 0, fall), opacity: fall };
  });
  svg.querySelectorAll<SVGElement>(".sb-bulb").forEach((bulb, i) => {
    bulb.style.opacity = String(mix(0.14, 1, span(p, 0.5 + i * 0.03, 0.58 + i * 0.03)));
  });
  put(svg, ".sb-spark", (i) => {
    const rise = span(p, 0.62 + i * 0.02, 0.84 + i * 0.016);
    return { y: mix(18, -46, rise), opacity: Math.sin(Math.PI * rise) * 0.9 };
  });
};
