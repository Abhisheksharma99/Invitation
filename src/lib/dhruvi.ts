import { wedding } from "@content/wedding";

/**
 * Dhruvi's line, broken where a child would take a breath:
 * after the second comma, and after "me". The text itself is untouched.
 */
export function dhruviLines(): string[] {
  const match = wedding.closing.dhruvi.match(/^([^,]+,[^,]+,) (.+? me) (.+)$/);
  return match ? match.slice(1) : [wedding.closing.dhruvi];
}
