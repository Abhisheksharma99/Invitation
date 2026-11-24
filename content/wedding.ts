// Every string on the site comes from this file, and this file mirrors
// section 2 of HANDOVER.md exactly. tests/content.test.ts fails if they differ.
// Never change names, dates, times or honorifics here without changing the card.

export const TIME_ZONE = "Asia/Kolkata";

export type WeddingEvent = {
  /** Calendar day in India, ISO 8601 (YYYY-MM-DD). */
  date: string;
  /** Start time in India, 24-hour HH:mm. */
  start: string;
  timeZone: typeof TIME_ZONE;
  /** Printed exactly as on the card. */
  day: string;
  name: string;
  time: string;
};

const event = (
  date: string,
  start: string,
  day: string,
  name: string,
  time: string,
): WeddingEvent => ({ date, start, timeZone: TIME_ZONE, day, name, time });

export const wedding = {
  invocation: {
    salutation: "॥ श्री गणेशाय नमः ॥",
    shlok: [
      "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।",
      "निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    ],
    title: "Wedding Invitation",
  },
  hosts: {
    names: "Smt. Veena & Sh. Ram Kumar Sharma",
    invitation:
      "solicit your gracious presence & blessings on the auspicious occasion of the wedding ceremony of their beloved loving son",
  },
  groom: {
    name: "Abhishek",
    lineage: "(Grand S/o Late Smt. Leela Devi & Sh. Mangat Ram)",
    address: "at VPO Jhalera, Tehsil & Distt. Una, H.P.",
  },
  bride: {
    with: "with",
    name: "Shweta",
    lineage: "(D/o Mrs. Neelam Sharma & Mr. Suman Sharma)",
    address: "at Village Dathwada, Tehsil & Distt. Una",
  },
  couple: {
    line: "Abhishek weds Shweta",
    date: "Saturday, 12th December 2026",
  },
  goldenMoments: {
    title: "Golden Moments",
    events: [
      event("2026-12-10", "08:30", "Thursday, 10th December 2026", "Sunder Kand", "8:30 AM"),
      event("2026-12-11", "11:00", "Friday, 11th December 2026", "Nanka Mail", "11:00 AM"),
      event("2026-12-11", "13:30", "Friday, 11th December 2026", "Lunch", "1:30 PM"),
      event("2026-12-12", "15:00", "Saturday, 12th December 2026", "Sehrabandi", "3:00 PM"),
      event("2026-12-12", "17:30", "Saturday, 12th December 2026", "Departure of Barat", "5:30 PM"),
      event("2026-12-13", "05:00", "Sunday, 13th December 2026", "Vadhu Pravesh", "5:00 AM"),
    ],
  },
  venue: {
    label: "VENUE",
    name: "Dhusara, Sargam Palace",
    address: "Tehsil & Distt. Una, H.P.",
  },
  closing: {
    dhruvi:
      "Na koi phone, na koi bahana, mere chachu ki shadi me jalul-jalul aana ji..... Dhruvi",
    compliments: "With best compliments from all relatives & friends",
    rsvp: "R.S.V.P.",
    family: "Sharma Family",
    phones: "M: 8826133717, 8076763711",
  },
  monogram: "A & S",
} as const;

export type Wedding = typeof wedding;
