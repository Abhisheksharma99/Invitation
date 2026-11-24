import type { ReactNode } from "react";
import { wedding } from "@content/wedding";
import { Arch } from "@/components/ornaments/Arch";
import { Diya } from "@/components/ornaments/Diya";
import { GoldFrame } from "@/components/ornaments/GoldFrame";
import { JaalBackground } from "@/components/ornaments/JaalBackground";
import { Kalash } from "@/components/ornaments/Kalash";
import { Mandala } from "@/components/ornaments/Mandala";
import { PetalField } from "@/components/ornaments/PetalField";
import { Toran } from "@/components/ornaments/Toran";

// Developer page: every Phase 1 building block, for inspection. Not linked from the invitation.

const TOKENS = [
  ["wine", "bg-wine"],
  ["gold", "bg-gold"],
  ["ivory", "bg-ivory"],
  ["marigold", "bg-marigold"],
  ["wine-panel", "bg-wine-panel"],
  ["wine-raised", "bg-wine-raised"],
  ["brass", "bg-brass"],
  ["gold-pale", "bg-gold-pale"],
  ["ember", "bg-ember"],
  ["saffron", "bg-saffron"],
  ["ivory-soft", "bg-ivory-soft"],
];

const PORTRAITS = [
  { file: "portrait-groom", width: 434, height: 1024, alt: `Illustrated portrait of ${wedding.groom.name}` },
  { file: "portrait-bride", width: 431, height: 1024, alt: `Illustrated portrait of ${wedding.bride.name}` },
  { file: "portrait-couple", width: 648, height: 1024, alt: `Illustrated portrait of ${wedding.groom.name} and ${wedding.bride.name}` },
];

function Portrait({ file, width, height, alt, className = "" }: (typeof PORTRAITS)[number] & { className?: string }) {
  return (
    <picture>
      <source srcSet={`/portraits/${file}.avif`} type="image/avif" />
      <source srcSet={`/portraits/${file}.webp`} type="image/webp" />
      <img
        src={`/portraits/${file}.png`}
        width={width}
        height={height}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  );
}

function Specimen({ name, note, children }: { name: string; note: string; children: ReactNode }) {
  return (
    <section className="border-t border-brass/50 py-10">
      <h2 className="text-2xl font-bold text-gold">{name}</h2>
      <p className="mb-8 max-w-prose text-base text-ivory-soft">{note}</p>
      {children}
    </section>
  );
}

export default function KitchenSink() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-10">
      <h1 className="text-4xl font-bold">Kitchen sink</h1>
      <p className="mb-10 text-ivory-soft">Phase 1 building blocks. Reload the page to replay the draw-on.</p>

      <Specimen name="Colour tokens" note="Top row: the four colours of the card. The rest are mixes of those four.">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TOKENS.map(([name, bg]) => (
            <li key={name} className="text-base">
              <div className={`h-16 border border-gold/40 ${bg}`} />
              {name}
            </li>
          ))}
        </ul>
      </Specimen>

      <Specimen name="Type" note="Great Vibes for names, Cormorant Garamond 500 and 700 for body, Tiro Devanagari Hindi for Devanagari.">
        <p className="font-script text-7xl leading-tight text-gold-pale">{wedding.couple.line}</p>
        <p className="mt-4 text-2xl font-bold">{wedding.hosts.names}</p>
        <p className="max-w-prose text-xl">{wedding.hosts.invitation}</p>
        <p lang="sa" className="mt-6 font-deva text-2xl text-gold-pale">
          {wedding.invocation.salutation}
        </p>
        {wedding.invocation.shlok.map((line) => (
          <p key={line} lang="sa" className="font-deva text-xl">
            {line}
          </p>
        ))}
      </Specimen>

      <Specimen name="Arch" note="Ogee jharokha. Left: draw-on, empty. Right: content clipped to the inner line (portrait at no more than its natural width).">
        <div className="flex flex-wrap items-end justify-center gap-10">
          <Arch draw className="w-64" />
          <Arch className="w-[min(100%,340px)]">
            <Portrait {...PORTRAITS[0]} className="h-full w-full object-cover object-top" />
          </Arch>
        </div>
      </Specimen>

      <Specimen name="Mandala" note="Three petal rings. Left: turning, with the monogram in the centre slot. Right: still, rotated 15 degrees.">
        <div className="flex flex-wrap items-center justify-center gap-10">
          <Mandala turn={90} className="w-72">
            <span className="font-script text-5xl text-gold-pale">{wedding.monogram}</span>
          </Mandala>
          <Mandala rotation={15} className="w-48" />
        </div>
      </Specimen>

      <Specimen name="Diya" note="Five lit, flickering out of step, then one unlit.">
        <div className="flex flex-wrap items-end justify-center gap-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <Diya key={i} delay={i * 0.37} className="w-16" />
          ))}
          <Diya lit={false} className="w-16" />
        </div>
      </Specimen>

      <Specimen name="Toran" note="Marigold garland with swaying bud strings. Four swags (phone) and eight (wide).">
        <div className="mx-auto max-w-sm">
          <Toran swags={4} />
        </div>
        <div className="mt-12">
          <Toran swags={8} />
        </div>
      </Specimen>

      <Specimen name="JaalBackground" note="Faint lattice behind content, fading at the edges.">
        <div className="relative grid h-72 place-items-center overflow-hidden bg-wine-panel">
          <JaalBackground />
          <p className="relative text-2xl font-bold">{wedding.goldenMoments.title}</p>
        </div>
      </Specimen>

      <Specimen name="GoldFrame" note="Double rule with stepped corners around any content.">
        <GoldFrame className="mx-auto max-w-md text-center">
          <p className="text-base font-bold tracking-[0.3em] text-gold">{wedding.venue.label}</p>
          <p className="text-3xl font-bold">{wedding.venue.name}</p>
          <p className="text-xl">{wedding.venue.address}</p>
        </GoldFrame>
      </Specimen>

      <Specimen name="Kalash" note="Brass pot, mango leaves, coconut. Shown between two diyas as in the hosts section.">
        <div className="flex items-end justify-center gap-6">
          <Diya className="w-14" />
          <Kalash className="w-36" />
          <Diya delay={0.8} className="w-14" />
        </div>
      </Specimen>

      <Specimen name="PetalField" note="One canvas of petals and gold dust. It stops drawing when scrolled off-screen and holds a still frame for reduced motion.">
        <div className="relative h-96 overflow-hidden bg-wine-panel">
          <PetalField petals={18} dust={48} />
        </div>
      </Specimen>

      <Specimen name="Portraits" note="AVIF, then WebP, then the original PNG. Shown at natural size or smaller, never upscaled.">
        <div className="flex flex-wrap items-end justify-center gap-6">
          {PORTRAITS.map((portrait) => (
            <Portrait key={portrait.file} {...portrait} className="h-auto w-44" />
          ))}
        </div>
      </Specimen>
    </main>
  );
}
