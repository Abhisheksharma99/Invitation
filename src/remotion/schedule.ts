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
  // The couple, as on the website: two arches side by side. His doors open,
  // her veil lifts, the varmala joins them, then their line and the date.
  meeting: {
    seconds: 16,
    groomName: line(w.groom.name, 1.7, 0.5),
    groomLineage: line(w.groom.lineage, 2.3),
    groomAddress: line(w.groom.address, 2.7),
    with: line(w.bride.with, 5.0),
    brideName: line(w.bride.name, 6.7, 0.5),
    brideLineage: line(w.bride.lineage, 7.3),
    brideAddress: line(w.bride.address, 7.7),
    couple: line(w.couple.line, 11.4, 0.5),
    date: line(w.couple.date, 12.0),
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
  FILM.meeting.seconds,
  ...FILM.moments.map((moment) => moment.seconds),
  FILM.venue.seconds,
  FILM.closing.seconds,
];

export const TOTAL_FRAMES = Math.round(SCENE_SECONDS.reduce((a, b) => a + b, 0) * FPS);
