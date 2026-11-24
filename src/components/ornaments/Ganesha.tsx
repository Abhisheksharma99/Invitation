// Original line-art Ganesha: crown, wide ears, tilak, one whole tusk and one
// broken, trunk curling to hold a modak. Every stroke has the class
// "ganesha-line" so a scene can draw them on in order.

const LINES = [
  // crown: dome, band, jewel
  "M70 58C72 40 88 34 100 12C112 34 128 40 130 58",
  "M64 60H136",
  "M100 30L105 38L100 46L95 38Z",
  "M82 52C86 46 92 44 100 44C108 44 114 46 118 52",
  // head
  "M68 62C60 80 62 100 74 112",
  "M132 62C140 80 138 100 126 112",
  // ears
  "M67 66C42 50 14 62 12 94C10 120 34 136 58 124C65 120 70 114 73 109",
  "M133 66C158 50 186 62 188 94C190 120 166 136 142 124C135 120 130 114 127 109",
  "M56 80C40 74 27 85 28 99C29 111 42 118 54 111",
  "M144 80C160 74 173 85 172 99C171 111 158 118 146 111",
  // tilak
  "M94 64V74M100 62V77M106 64V74",
  // eyes
  "M76 88C80 82 90 82 94 88",
  "M124 88C120 82 110 82 106 88",
  // trunk: outer edge into the curl, then the inner edge
  "M86 98C82 126 86 160 104 172C122 182 144 170 142 152C140 137 123 133 117 143C113 151 119 159 127 155",
  "M114 98C116 114 110 126 108 139",
  // trunk folds
  "M88 114Q100 119 112 114",
  "M87 127Q98 132 110 127",
  "M88 140Q97 145 107 141",
  // tusks: whole on the left, broken on the right
  "M76 110C69 119 68 130 73 139C80 132 84 123 85 114",
  "M124 110C129 115 129 121 126 126C121 123 117 119 115 114",
  // modak at the tip of the trunk
  "M118 152C118 144 126 142 129 136C132 142 139 145 138 152",
];

type GaneshaProps = {
  className?: string;
  /** 0 to 1: how much of the figure is drawn, stroke after stroke. Omit for the whole figure. */
  drawn?: number;
};

export function Ganesha({ className = "", drawn }: GaneshaProps) {
  return (
    <svg
      viewBox="0 0 200 190"
      className={className}
      fill="none"
      stroke="var(--gold-pale)"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {LINES.map((d, i) => {
        if (drawn === undefined) return <path key={d} className="ganesha-line" d={d} />;
        const part = Math.min(1, Math.max(0, drawn * LINES.length - i));
        return (
          <path key={d} className="ganesha-line" d={d} pathLength="1" strokeDasharray="1 1.2" strokeDashoffset={1.1 * (1 - part)} />
        );
      })}
    </svg>
  );
}
