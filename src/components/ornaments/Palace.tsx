// Original palace facade. Every window has a lit layer with the class
// "palace-light"; data-reach is its distance from the centre (0 to 1) so a
// scene can light the palace from the middle outwards.

const WINDOW = "M-9 14V-4C-9 -10 -4 -10 0 -17C4 -10 9 -10 9 -4V14Z";

const WINDOWS: [number, number, number][] = [
  // x, y, scale
  [176, 100, 1], [224, 100, 1],
  [124, 138, 1], [276, 138, 1], [124, 180, 1], [276, 180, 1],
  [88, 138, 1], [312, 138, 1], [88, 180, 1], [312, 180, 1],
  [52, 138, 1], [348, 138, 1], [52, 180, 1], [348, 180, 1],
];

function Light({ x, y, scale, d }: { x: number; y: number; scale: number; d: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={d} fill="var(--wine)" stroke="var(--gold)" strokeWidth={1.5 / scale} />
      <path className="palace-light" data-reach={(Math.abs(x - 200) / 160).toFixed(2)} d={d} fill="var(--saffron)" stroke="var(--gold-pale)" strokeWidth={1.5 / scale} />
    </g>
  );
}

function Dome({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="var(--wine-raised)" stroke="var(--gold)" strokeWidth={2 / scale}>
      <path d="M-30 0C-36 -30 -10 -36 0 -56C10 -36 36 -30 30 0Z" />
      <path d="M0 -56V-70" strokeLinecap="round" />
      <circle cx="0" cy="-73" r="3" fill="var(--gold)" />
      <path d="M-34 0H34" strokeLinecap="round" />
    </g>
  );
}

export function Palace({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 226" className={className} aria-hidden="true">
      {/* wings */}
      <rect x="30" y="112" width="340" height="100" fill="var(--wine-panel)" stroke="var(--gold)" strokeWidth="2" />
      <path d={`M30 112${Array.from({ length: 17 }, () => "v-8h10v8h10").join("")}`} fill="var(--wine-panel)" stroke="var(--gold)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M30 158H370" stroke="var(--brass)" strokeWidth="1" />
      {/* corner chhatris */}
      <path d="M38 104V84M62 104V84M338 104V84M362 104V84" stroke="var(--gold)" strokeWidth="2" />
      <Dome x={50} y={84} scale={0.5} />
      <Dome x={350} y={84} scale={0.5} />
      {/* central block and dome */}
      <rect x="150" y="70" width="100" height="142" fill="var(--wine-raised)" stroke="var(--gold)" strokeWidth="2" />
      <path d="M144 70H256" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
      <Dome x={200} y={68} scale={1} />
      {/* gate */}
      <Light x={200} y={184} scale={2} d={WINDOW} />
      {WINDOWS.map(([x, y, scale]) => (
        <Light key={`${x}-${y}`} x={x} y={y} scale={scale} d={WINDOW} />
      ))}
      {/* plinth and steps */}
      <path d="M16 212H384" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
      <path d="M168 218H232M158 224H242" stroke="var(--brass)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
