import { describe, expect, it } from "vitest";
import { guestName } from "../src/lib/guest";

describe("personal greeting from the link", () => {
  it("is empty when the link carries no name", () => {
    expect(guestName("")).toBe("");
    expect(guestName("?other=1", "/")).toBe("");
  });
  it("reads ?to=Name, in any script", () => {
    expect(guestName("?to=Sharma%20Ji")).toBe("Sharma Ji");
    expect(guestName("?to=" + encodeURIComponent("शर्मा जी"))).toBe("शर्मा जी");
    expect(guestName("?to=Mr.+O'Neil-Rao")).toBe("Mr. O'Neil-Rao");
  });
  it("reads a name at the end of the address, hyphens as spaces", () => {
    expect(guestName("", "/Sharma-Ji")).toBe("Sharma Ji");
    expect(guestName("", "/Verma%20Family/")).toBe("Verma Family");
    expect(guestName("", "/" + encodeURIComponent("शर्मा-जी"))).toBe("शर्मा जी");
  });
  it("does not mistake pages or files for names", () => {
    expect(guestName("", "/kitchen-sink")).toBe("");
    expect(guestName("", "/og.jpg")).toBe("");
    expect(guestName("", "/a/b")).toBe("");
    expect(guestName("", "/%E0%A4%A")).toBe("");
  });
  it("prefers ?to= when both are present", () => {
    expect(guestName("?to=Asha", "/Sharma-Ji")).toBe("Asha");
  });
  it("drops markup, digits and symbols", () => {
    expect(guestName("?to=" + encodeURIComponent("<img src=x onerror=alert(1)>"))).toBe("img srcx onerroralert");
    expect(guestName("", "/" + encodeURIComponent("Ravi 123 😀 {x}"))).toBe("Ravi x");
  });
  it("limits the length", () => {
    expect(guestName("?to=" + "a".repeat(200)).length).toBe(40);
  });
});
