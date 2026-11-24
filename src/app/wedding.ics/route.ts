import { wedding } from "@content/wedding";
import { eventInstant, utcStamp } from "@/lib/events";

// Written once by `next build` as a static file: out/wedding.ics
export const dynamic = "force-static";

// The card gives start times only. Calendar apps need an end, so each entry is one hour long.
const ENTRY_MINUTES = 60;

const escape = (text: string) => text.replace(/([\;,])/g, "\\$1");

export function GET() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sharma Family//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escape(wedding.couple.line)}`,
    ...wedding.goldenMoments.events.flatMap((event, index) => {
      const start = eventInstant(event);
      const end = new Date(start.getTime() + ENTRY_MINUTES * 60_000);
      return [
        "BEGIN:VEVENT",
        `UID:golden-moment-${index + 1}@abhishek-weds-shweta`,
        `DTSTAMP:${utcStamp(eventInstant(wedding.goldenMoments.events[0]))}`,
        `DTSTART:${utcStamp(start)}`,
        `DTEND:${utcStamp(end)}`,
        `SUMMARY:${escape(`${event.name} (${wedding.couple.line})`)}`,
        "END:VEVENT",
      ];
    }),
    "END:VCALENDAR",
  ];

  return new Response(lines.join("\r\n") + "\r\n", {
    headers: { "Content-Type": "text/calendar; charset=utf-8" },
  });
}
