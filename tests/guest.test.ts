import { describe, expect, it } from "vitest";
import { guestName } from "../src/lib/guest";

describe("?to=Name greeting", () => {
  it("is empty with no parameter", () => {
    expect(guestName("")).toBe("");
    expect(guestName("?other=1")).toBe("");
  });
  it("keeps ordinary names, in any script", () => {
    expect(guestName("?to=Sharma%20Ji")).toBe("Sharma Ji");
    expect(guestName("?to=" + encodeURIComponent("शर्मा जी"))).toBe("शर्मा जी");
    expect(guestName("?to=Mr.+O'Neil-Rao")).toBe("Mr. O'Neil-Rao");
  });
  it("drops markup, digits and symbols", () => {
    expect(guestName("?to=" + encodeURIComponent("<img src=x onerror=alert(1)>"))).toBe("img srcx onerroralert");
    expect(guestName("?to=" + encodeURIComponent("Ravi 123 😀 {x}"))).toBe("Ravi x");
  });
  it("limits the length", () => {
    expect(guestName("?to=" + "a".repeat(200)).length).toBe(40);
  });
});
