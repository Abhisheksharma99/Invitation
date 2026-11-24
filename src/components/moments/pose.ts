// Frame-by-frame posing for the Golden Moments motifs.
//
// Each motif is drawn in its finished pose and has a `pose(svg, p)` function
// that sets every moving part for a progress p from 0 (not yet begun) to 1
// (finished). It writes only transform, opacity and stroke-dash, and it is a
// pure function of p, so the same code serves the scroll scene (GSAP feeds it
// scroll progress) and the film (Remotion feeds it the frame).

export type Pose = (svg: SVGSVGElement, p: number) => void;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** How far p has travelled from a to b, eased in and out, 0 to 1. */
export const span = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const mix = (from: number, to: number, t: number) => from + (to - from) * t;

type Placement = {
  x?: number;
  y?: number;
  rotate?: number;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
  /** Pivot in SVG user units, e.g. "160px 88px". */
  origin?: string;
};

/** Place every element matching `selector`. Distances are in SVG user units. */
export function put(
  svg: SVGSVGElement,
  selector: string,
  placement: Placement | ((index: number, count: number) => Placement),
) {
  const elements = svg.querySelectorAll<SVGElement>(selector);
  elements.forEach((element, index) => {
    const v = typeof placement === "function" ? placement(index, elements.length) : placement;
    if (v.origin) element.style.transformOrigin = v.origin;
    element.style.transform = `translate(${v.x ?? 0}px, ${v.y ?? 0}px) rotate(${v.rotate ?? 0}deg) scale(${v.scaleX ?? 1}, ${v.scaleY ?? 1})`;
    if (v.opacity !== undefined) element.style.opacity = String(v.opacity);
  });
}

/** Draw strokes on. Elements must carry pathLength="1". */
export function draw(svg: SVGSVGElement, selector: string, amount: number | ((index: number) => number)) {
  svg.querySelectorAll<SVGElement>(selector).forEach((element, index) => {
    const t = typeof amount === "function" ? amount(index) : amount;
    element.style.strokeDasharray = "1 1.2";
    element.style.strokeDashoffset = String(1.1 * (1 - t));
  });
}
