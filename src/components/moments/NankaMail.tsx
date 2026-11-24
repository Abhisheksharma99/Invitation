import { mix, put, span, type Pose } from "./pose";

// A dhol beaten by two sticks in turn, a thali of gifts, a marigold swag overhead.

const SWAG = Array.from({ length: 13 }, (_, i) => {
  const t = i / 12;
  return { x: 40 + t * 240, y: 12 + 4 * 30 * t * (1 - t), alt: i % 2 === 1 };
});

export function NankaMailMotif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="10 0 300 182" className={className} aria-hidden="true">
      <g className="nm-swag">
        <path d="M40 12Q160 72 280 12" fill="none" stroke="var(--brass)" strokeWidth="1.5" />
        {SWAG.map((f) => (
          <g key={f.x} transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)})`}>
            <circle r="8" fill={f.alt ? "var(--saffron)" : "var(--marigold)"} />
            <circle r="3" fill="var(--gold-pale)" />
          </g>
        ))}
      </g>

      {/* dhol */}
      <path d="M62 152Q118 60 174 152" fill="none" stroke="var(--marigold)" strokeWidth="4" strokeLinecap="round" />
      <path d="M66 96C92 86 144 86 170 96V156C144 166 92 166 66 156Z" fill="var(--ember)" stroke="var(--gold)" strokeWidth="2" />
      <path d="M70 98L90 160L110 92L130 162L150 94L166 156" fill="none" stroke="var(--gold-pale)" strokeWidth="1.6" strokeLinejoin="round" />
      <ellipse cx="66" cy="126" rx="11" ry="31" fill="var(--ivory-soft)" stroke="var(--gold)" strokeWidth="2.5" />
      <ellipse cx="170" cy="126" rx="11" ry="31" fill="var(--ivory-soft)" stroke="var(--gold)" strokeWidth="2.5" />

      {/* sticks: a hooked dagga on the left, a thin tilli on the right */}
      <path className="nm-stick-left" d="M22 92L52 122C56 126 60 124 58 118" fill="none" stroke="var(--gold-pale)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path className="nm-stick-right" d="M218 88L182 124" fill="none" stroke="var(--gold-pale)" strokeWidth="3" strokeLinecap="round" />

      {/* thali of gifts */}
      <g className="nm-thali">
        <ellipse cx="250" cy="164" rx="52" ry="11" fill="var(--gold)" stroke="var(--brass)" strokeWidth="2" />
        <ellipse cx="250" cy="162" rx="44" ry="7.5" fill="var(--gold-pale)" />
        <rect x="214" y="132" width="30" height="27" rx="2" fill="var(--marigold)" stroke="var(--ember)" strokeWidth="1.5" />
        <path d="M229 132V159M214 145H244" stroke="var(--gold-pale)" strokeWidth="3" />
        <path d="M229 132C222 122 214 126 229 132C244 126 236 122 229 132Z" fill="var(--gold-pale)" stroke="var(--brass)" strokeWidth="1" />
        {[
          [262, 152], [276, 152], [290, 153], [269, 141], [283, 141], [276, 130],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="7.5" fill="var(--saffron)" stroke="var(--ember)" strokeWidth="1" />
        ))}
      </g>
    </svg>
  );
}

export const poseNankaMail: Pose = (svg, p) => {
  const drop = span(p, 0, 0.3);
  put(svg, ".nm-swag", { y: mix(-80, 0, drop), opacity: drop });
  // six beats, the sticks taking turns; both rest on the skins at the end
  const beat = Math.sin(p * Math.PI * 6) * (p < 1 ? 1 : 0);
  const left = Math.max(0, beat);
  const right = Math.max(0, -beat);
  put(svg, ".nm-stick-left", { x: -12 * left, y: -9 * left, rotate: -8 * left, origin: "22px 92px" });
  put(svg, ".nm-stick-right", { x: 12 * right, y: -9 * right, rotate: 8 * right, origin: "218px 88px" });
  const slide = span(p, 0.35, 0.72);
  put(svg, ".nm-thali", { x: mix(120, 0, slide), opacity: slide });
};
