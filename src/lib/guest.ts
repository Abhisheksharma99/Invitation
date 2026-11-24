const MAX_LENGTH = 40;

/**
 * The guest's name from a link like ?to=Sharma%20Ji, made safe to show:
 * letters (any script), spaces, dots, apostrophes and hyphens only, at most
 * 40 characters. Anything else is dropped. Returns "" when there is no name.
 */
export function guestName(search: string): string {
  const raw = new URLSearchParams(search).get("to") ?? "";
  return raw
    .normalize("NFC")
    .replace(/[^\p{L}\p{M}\s.'’-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_LENGTH)
    .trim();
}
