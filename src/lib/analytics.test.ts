import { afterEach, describe, expect, it, vi } from "vitest";
import { track, trackLink, umamiScript } from "./analytics";

describe("analytics", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("loads no script until both the URL and website ID are set", () => {
    expect(umamiScript({ id: "abc" })).toBeNull();
    expect(umamiScript({ url: "https://stats.example.com/script.js" })).toBeNull();
  });

  it("limits the script to the real domain", () => {
    expect(umamiScript({ url: "https://stats.example.com/script.js", id: "abc" })).toEqual({
      src: "https://stats.example.com/script.js",
      defer: true,
      "data-website-id": "abc",
      "data-domains": "jowamroasters.com",
    });
  });

  it("builds click attributes with event data", () => {
    expect(trackLink("social_click", { network: "Instagram" })).toEqual({
      "data-umami-event": "social_click",
      "data-umami-event-network": "Instagram",
    });
  });

  it("forwards events to Umami and ignores a missing or failing tracker", () => {
    const umami = { track: vi.fn() };
    vi.stubGlobal("window", { umami });
    track("add_to_cart", { product: "nyeri-aa" });
    expect(umami.track).toHaveBeenCalledWith("add_to_cart", { product: "nyeri-aa" });

    umami.track.mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => track("phone_click")).not.toThrow();

    vi.stubGlobal("window", {});
    expect(() => track("phone_click")).not.toThrow();
  });
});
