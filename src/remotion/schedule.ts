import { wedding } from "@content/wedding";
import { weddingDays } from "@/lib/events";
import { dhruviLines } from "@/lib/dhruvi";

// When every line of the film appears. tests/film.test.ts checks that each
// line then stays readable for at least 1 second plus 0.3 seconds per word.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Seconds a line takes to arrive (fade and rise) unless it says otherwise. */
export const SETTLE = 0.3;

export type Line = {
  text: string;
  /** Seconds into its scene at which the line starts to appear. */
  at: number;
  /** Seconds until it is fully readable. */
  settle: number;
};

const line = (text: string, at: number, settle = SETTLE): Line => ({ text, at, settle });

const w = wedding;
const title = () => line(w.goldenMoments.title, 0, 0.2);
const day = (index: number, each: number) => ({
  title: title(),
  day: line(weddingDays[index].day, 0.3),
  events: weddingDays[index].events.map((event, n) => ({
    name: line(event.name, 0.6 + n * each),
    time: line(event.time, 0.75 + n * each),
  })),
});

export const FILM = {
  invocation: {
    seconds: 6,
    salutation: line(w.invocation.salutation, 0.9),
    shlok: w.invocation.shlok.map((text, n) => line(text, 1.4 + n * 0.5)),
    title: line(w.invocation.title, 2.5),
  },
  hosts: {
    seconds: 7,
    names: line(w.hosts.names, 0.3),
    // 20 words need the whole scene, so this line is there from the first frame
    invitation: line(w.hosts.invitation, 0, 0),
  },
  groom: {
    seconds: 6,
    name: line(w.groom.name, 0.9, 0.5),
    lineage: line(w.groom.lineage, 1.3),
    address: line(w.groom.address, 1.7),
  },
  bride: {
    seconds: 6,
    with: line(w.bride.with, 0.7),
    name: line(w.bride.name, 0.9, 0.5),
    lineage: line(w.bride.lineage, 1.3),
    address: line(w.bride.address, 1.7),
  },
  together: {
    seconds: 4,
    line: line(w.couple.line, 0.7, 0.5),
    date: line(w.couple.date, 1.2),
  },
  moments: [
    { seconds: 4, ...day(0, 0.4) },
    { seconds: 4.5, ...day(1, 0.5) },
    { seconds: 5, ...day(2, 0.5) },
    { seconds: 4, ...day(3, 0.4) },
  ],
  venue: {
    seconds: 5.5,
    label: line(w.venue.label, 0.3),
    name: line(w.venue.name, 0.6),
    address: line(w.venue.address, 0.9),
  },
  closing: {
    seconds: 8,
    // typed out letter by letter: readable once the last letter lands
    dhruvi: line(dhruviLines().join(" "), 0.2, 1.7),
    compliments: line(w.closing.compliments, 2.6),
    monogram: line(w.monogram, 3.0, 0.9),
    rsvp: line(w.closing.rsvp, 3.6),
    family: line(w.closing.family, 3.8),
    phones: line(w.closing.phones, 4.1),
  },
};

/** Scene lengths in film order. */
export const SCENE_SECONDS = [
  FILM.invocation.seconds,
  FILM.hosts.seconds,
  FILM.groom.seconds,
  FILM.bride.seconds,
  FILM.together.seconds,
  ...FILM.moments.map((moment) => moment.seconds),
  FILM.venue.seconds,
  FILM.closing.seconds,
];

export const TOTAL_FRAMES = Math.round(SCENE_SECONDS.reduce((a, b) => a + b, 0) * FPS);
