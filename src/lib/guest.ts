const MAX_LENGTH = 40;

/** Letters (any script), spaces, dots, apostrophes and hyphens only; at most 40 characters. */
function clean(raw: string) {
  return raw
    .normalize("NFC")
    .replace(/[^\p{L}\p{M}\s.'’-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_LENGTH)
    .trim();
}

// addresses that are pages of the site, not a guest's name
const PAGES = new Set(["kitchen-sink", "index", "404"]);

/**
 * The guest's name from the invitation link, made safe to show. Two forms work:
 *
 *   …/Sharma-Ji          name at the end of the address; hyphens become spaces
 *   …/?to=Sharma Ji      name as a parameter; kept exactly as typed
 *
 * Returns "" when the link carries no name, and the gate then shows no greeting.
 */
export function guestName(search: string, pathname = "/"): string {
  const fromParameter = clean(new URLSearchParams(search).get("to") ?? "");
  if (fromParameter) return fromParameter;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 1 || segments[0].includes(".") || PAGES.has(segments[0].toLowerCase())) return "";
  try {
    return clean(decodeURIComponent(segments[0]).replace(/[-_+]+/g, " "));
  } catch {
    return ""; // a badly encoded address
  }
}
