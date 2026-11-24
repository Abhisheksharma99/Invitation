import { wedding, type WeddingEvent } from "@content/wedding";

// India has no daylight saving, so Asia/Kolkata is always five and a half hours ahead of UTC.
const INDIA_OFFSET = "+05:30";

/** The moment an event starts, the same instant in every visitor's time zone. */
export const eventInstant = (event: WeddingEvent) =>
  new Date(`${event.date}T${event.start}:00${INDIA_OFFSET}`);

export type WeddingDay = { day: string; date: string; events: WeddingEvent[] };

/** The Golden Moments grouped by day, in order. */
export const weddingDays: WeddingDay[] = [];
for (const event of wedding.goldenMoments.events) {
  const last = weddingDays.at(-1);
  if (last?.date === event.date) last.events.push(event);
  else weddingDays.push({ day: event.day, date: event.date, events: [event] });
}

/** Events on the wedding date itself. */
export const weddingDayEvents = wedding.goldenMoments.events.filter(
  (event) => event.day === wedding.couple.date,
);

/** The countdown runs to the last event of the wedding day (Departure of Barat). */
export const countdownTarget = eventInstant(weddingDayEvents[weddingDayEvents.length - 1]);

/** 20261212T120000Z */
export const utcStamp = (date: Date) => date.toISOString().replace(/[-:]|\.\d{3}/g, "");
