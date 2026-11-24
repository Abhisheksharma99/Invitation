"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

// Registered once, here, for the whole site. Scenes import gsap and use it.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);
// Phone address bars resize the viewport while scrolling; do not re-measure pins for that.
ScrollTrigger.config({ ignoreMobileResize: true });

type Motion = {
  /** The visitor asked their device for less motion. Every scene must honour it. */
  reducedMotion: boolean;
  /** A weak phone or a data-saver connection: no smooth scroll, lighter effects. */
  lowEnd: boolean;
  /** The Lenis instance, or null when smooth scroll is off. */
  getLenis: () => Lenis | null;
};

const MotionContext = createContext<Motion>({
  reducedMotion: false,
  lowEnd: false,
  getLenis: () => null,
});

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const subscribeNever = () => () => {};

function detectLowEnd() {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return (
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) ||
    (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4) ||
    nav.connection?.saveData === true
  );
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
  const lowEnd = useSyncExternalStore(subscribeNever, detectLowEnd, () => false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion || lowEnd) return;

    // autoToggle: Lenis stops by itself while the page is scroll-locked (the gate).
    const lenis = new Lenis({ autoToggle: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion, lowEnd]);

  const getLenis = useCallback(() => lenisRef.current, []);
  const value = useMemo(
    () => ({ reducedMotion, lowEnd, getLenis }),
    [reducedMotion, lowEnd, getLenis],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  return useContext(MotionContext);
}

export function useReducedMotion() {
  return useContext(MotionContext).reducedMotion;
}
