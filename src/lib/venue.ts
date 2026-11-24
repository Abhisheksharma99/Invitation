/**
 * THE MAP PIN. Until the family supplies the exact location this is a search by
 * name. To pin the exact spot, replace it with coordinates, e.g. "31.4685,76.2708".
 * The map and the "Get directions" button both use it.
 */
export const VENUE_MAP_PIN = "Sargam Palace, Dhusara, Una, Himachal Pradesh";

export const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_MAP_PIN)}`;
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(VENUE_MAP_PIN)}&z=14&output=embed`;
