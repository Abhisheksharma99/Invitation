import { draw, put, span, type Pose } from "./pose";

// An open pothi on a rehal, a hanging bell. Lines of text draw across the pages.

const LINES = [0, 1, 2, 3, 4];

export function SunderKandMotif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="62 0 222 192" className={className} aria-hidden="true">
      {/* bell on its chain */}
      <g className="sk-bell">
        <path d="M252 0V34" stroke="var(--brass)" strokeWidth="2" strokeDasharray="3 2" />
        <path d="M238 68C238 46 243 36 252 36C261 36 266 46 266 68L271 76H233Z" fill="var(--gold)" stroke="var(--brass)" strokeWidth="1.5" />
        <path d="M240 60H264" stroke="var(--brass)" strokeWidth="1.5" />
        <circle cx="252" cy="80" r="4.5" fill="var(--brass)" />
      </g>

      {/* rehal: two crossed carved boards */}
      <g stroke="var(--brass)" strokeWidth="9" strokeLinecap="round">
        <path d="M104 182L206 122" />
        <path d="M216 182L114 122" />
      </g>
      <g stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
        <path d="M110 178L200 125M210 178L120 125" />
      </g>
      <circle cx="160" cy="151" r="5" fill="var(--gold-pale)" />

      {/* cover, then the two pages that open from the spine */}
      <path d="M80 116C110 104 140 106 160 120C180 106 210 104 240 116V124C210 114 180 116 160 130C140 116 110 114 80 124Z" fill="var(--ember)" stroke="var(--gold)" strokeWidth="1.5" />
      <g className="sk-page-left">
        <path d="M160 118C140 104 110 102 84 112V62C110 52 140 54 160 68Z" fill="var(--ivory)" stroke="var(--gold)" strokeWidth="1.5" />
        {LINES.map((i) => (
          <path key={i} className="sk-line" pathLength="1" d={`M94 ${70 + i * 9}C112 ${64 + i * 9} 134 ${65 + i * 9} 152 ${74 + i * 9}`} fill="none" stroke="var(--ember)" strokeWidth="1.6" strokeLinecap="round" />
        ))}
      </g>
      <g className="sk-page-right">
        <path d="M160 118C180 104 210 102 236 112V62C210 52 180 54 160 68Z" fill="var(--ivory)" stroke="var(--gold)" strokeWidth="1.5" />
        {LINES.map((i) => (
          <path key={i} className="sk-line" pathLength="1" d={`M168 ${74 + i * 9}C186 ${65 + i * 9} 208 ${64 + i * 9} 226 ${70 + i * 9}`} fill="none" stroke="var(--ember)" strokeWidth="1.6" strokeLinecap="round" />
        ))}
      </g>
      {/* ribbon marker */}
      <path d="M160 68V138L155 132" fill="none" stroke="var(--marigold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const poseSunderKand: Pose = (svg, p) => {
  const open = span(p, 0, 0.32);
  put(svg, ".sk-page-left", { origin: "160px 90px", scaleX: 0.06 + 0.94 * open, opacity: open });
  put(svg, ".sk-page-right", { origin: "160px 90px", scaleX: 0.06 + 0.94 * open, opacity: open });
  // left page lines first, then the right page
  draw(svg, ".sk-line", (i) => span(p, 0.3 + i * 0.055, 0.42 + i * 0.055));
  // the bell swings and comes to rest
  put(svg, ".sk-bell", { origin: "252px 0px", rotate: Math.sin(p * Math.PI * 5) * 16 * (1 - p) });
};
