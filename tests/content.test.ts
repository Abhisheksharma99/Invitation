import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TIME_ZONE, wedding } from "../content/wedding";

// Section 2 of HANDOVER.md is the source of truth. This test reads it and
// compares it, string for string, with content/wedding.ts.

const handover = readFileSync(path.resolve(__dirname, "../HANDOVER.md"), "utf8");
const start = handover.indexOf("## 2. Invitation content");
const end = handover.indexOf("## 3. Assets supplied");
const section = handover.slice(start, end);

/** Every `quoted` string in section 2, in document order. */
const quoted = [...section.matchAll(/`([^`]+)`/g)].map((m) => m[1]);

/** The Golden Moments table rows as [day, event, time]. */
const rows = section
  .split("\n")
  .filter((line) => line.startsWith("|"))
  .slice(2)
  .map((line) =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim()),
  );

const w = wedding;

describe("content/wedding.ts matches HANDOVER.md section 2", () => {
  it("finds section 2", () => {
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    expect(quoted.length).toBeGreaterThan(0);
  });

  it("has every quoted string, exactly and in order", () => {
    expect([
      w.invocation.salutation,
      ...w.invocation.shlok,
      w.invocation.title,
      w.hosts.names,
      w.hosts.invitation,
      w.groom.name,
      w.groom.lineage,
      w.groom.address,
      w.bride.with,
      w.bride.name,
      w.bride.lineage,
      w.bride.address,
      w.couple.line,
      w.couple.date,
      w.goldenMoments.title,
      w.venue.label,
      w.venue.name,
      w.venue.address,
      w.closing.dhruvi,
      w.closing.compliments,
      w.closing.rsvp,
      w.closing.family,
      w.closing.phones,
      w.monogram,
    ]).toEqual(quoted);
  });

  it("has the Golden Moments table, exactly and in order", () => {
    expect(w.goldenMoments.events.map((e) => [e.day, e.name, e.time])).toEqual(rows);
    expect(rows).toHaveLength(6);
  });

  it("holds no text that is not on the card", () => {
    const structural = new Set<string>([
      TIME_ZONE,
      ...w.goldenMoments.events.flatMap((e) => [e.date, e.start]),
    ]);
    const leaves: string[] = [];
    const walk = (value: unknown) => {
      if (typeof value === "string") leaves.push(value);
      else if (value && typeof value === "object") Object.values(value).forEach(walk);
    };
    walk(w);
    const allowed = new Set([...quoted, ...rows.flat()]);
    expect(leaves.filter((s) => !allowed.has(s) && !structural.has(s))).toEqual([]);
  });

  it("states the time zone the handover states", () => {
    expect(section).toContain(`(${TIME_ZONE})`);
  });

  it("keeps each event's structured date and time in step with its printed text", () => {
    const ordinal = (n: number) =>
      n + (n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th");
    for (const e of w.goldenMoments.events) {
      const at = new Date(`${e.date}T${e.start}:00+05:30`);
      const part = (options: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat("en-IN", { timeZone: e.timeZone, ...options }).format(at);
      const day = `${part({ weekday: "long" })}, ${ordinal(Number(part({ day: "numeric" })))} ${part({ month: "long" })} ${part({ year: "numeric" })}`;
      const time = new Intl.DateTimeFormat("en-US", {
        timeZone: e.timeZone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
        .format(at)
        .replace(/\s/g, " ");
      expect(day).toBe(e.day);
      expect(time).toBe(e.time);
    }
  });

  it("puts the wedding date on the Saturday events", () => {
    expect(w.goldenMoments.events.filter((e) => e.day === w.couple.date).map((e) => e.name)).toEqual([
      "Sehrabandi",
      "Departure of Barat",
    ]);
  });
});
