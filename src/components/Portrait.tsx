import type { ReactNode } from "react";
import { wedding } from "@content/wedding";
import { Arch } from "@/components/ornaments/Arch";

// The three approved portraits. `top` is how far down the arch (in % of its
// height) the picture starts, so the head sits below the narrow point.
export const PORTRAITS = {
  groom: {
    file: "portrait-groom",
    width: 434,
    height: 1024,
    top: 19,
    alt: `Illustrated portrait of ${wedding.groom.name} in a cream sherwani and safa`,
  },
  bride: {
    file: "portrait-bride",
    width: 431,
    height: 1024,
    top: 13,
    alt: `Illustrated portrait of ${wedding.bride.name} in a red bridal lehenga`,
  },
  couple: {
    file: "portrait-couple",
    width: 648,
    height: 1024,
    top: 17,
    alt: `Illustrated portrait of ${wedding.groom.name} and ${wedding.bride.name} together`,
  },
} as const;

type PortraitArchProps = {
  who: keyof typeof PORTRAITS;
  /** Layers over the picture, inside the arch: door leaves, a veil. */
  children?: ReactNode;
  className?: string;
};

/**
 * A portrait in a jharokha arch. Size it by width; the picture is never drawn
 * wider than its file (callers cap the arch width accordingly).
 */
export function PortraitArch({ who, children, className = "" }: PortraitArchProps) {
  const p = PORTRAITS[who];
  return (
    <Arch wide={who === "couple"} className={className}>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, var(--wine-raised), var(--wine-panel))" }}
      />
      <picture>
        <source srcSet={`/portraits/${p.file}.avif`} type="image/avif" />
        <source srcSet={`/portraits/${p.file}.webp`} type="image/webp" />
        <img
          data-portrait
          src={`/portraits/${p.file}.png`}
          width={p.width}
          height={p.height}
          alt={p.alt}
          loading="lazy"
          decoding="async"
          className="absolute left-[3%] h-auto w-[94%] max-w-none origin-top"
          style={{
            top: `${p.top}%`,
            maskImage: "linear-gradient(to bottom, transparent 0, black 5%)",
          }}
        />
      </picture>
      {children}
    </Arch>
  );
}
