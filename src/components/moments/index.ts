import type { ComponentType } from "react";
import type { Pose } from "./pose";
import { NankaMailMotif, poseNankaMail } from "./NankaMail";
import { SehraBaratMotif, poseSehraBarat } from "./SehraBarat";
import { SunderKandMotif, poseSunderKand } from "./SunderKand";
import { VadhuPraveshMotif, poseVadhuPravesh } from "./VadhuPravesh";

export type Moment = {
  id: string;
  Motif: ComponentType<{ className?: string }>;
  pose: Pose;
  /** The light of this day, as a CSS background laid over the wine ground. */
  light: string;
};

const glow = (colour: string, strength: number, at = "50% 34%") =>
  `radial-gradient(ellipse 80% 55% at ${at}, color-mix(in oklab, var(${colour}) ${strength}%, transparent), transparent 72%)`;

/** One per day of the Golden Moments, in order (see weddingDays in lib/events). */
export const MOMENTS: Moment[] = [
  // Sunder Kand: saffron glow
  { id: "sunder-kand", Motif: SunderKandMotif, pose: poseSunderKand, light: glow("--saffron", 34) },
  // Nanka Mail and Lunch: bright gold
  { id: "nanka-mail", Motif: NankaMailMotif, pose: poseNankaMail, light: glow("--gold-pale", 38) },
  // Sehrabandi and Barat: night, lit only by the string lights
  { id: "sehra-barat", Motif: SehraBaratMotif, pose: poseSehraBarat, light: glow("--gold", 10, "50% 12%") },
  // Vadhu Pravesh: pale dawn
  {
    id: "vadhu-pravesh",
    Motif: VadhuPraveshMotif,
    pose: poseVadhuPravesh,
    light: `linear-gradient(to bottom, color-mix(in oklab, var(--ivory) 15%, transparent), color-mix(in oklab, var(--saffron) 9%, transparent) 55%, transparent 85%)`,
  },
];
