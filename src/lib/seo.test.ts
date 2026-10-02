import { describe, expect, it } from "vitest";
import { absoluteUrl, pageHead } from "./seo";
import { buildSitemap } from "@/routes/sitemap[.]xml";

describe("seo", () => {
  it("builds absolute URLs on the real domain", () => {
    expect(absoluteUrl("/")).toBe("https://jowamroasters.com/");
    expect(absoluteUrl("/menu")).toBe("https://jowamroasters.com/menu");
  });

  it("gives every page an absolute canonical and og:image", () => {
    const head = pageHead({ title: "Menu", description: "Food", path: "/menu", image: "/assets/a.jpg" });
    expect(head.links).toEqual([{ rel: "canonical", href: "https://jowamroasters.com/menu" }]);
    expect(head.meta).toContainEqual({ property: "og:image", content: "https://jowamroasters.com/assets/a.jpg" });
  });

  it("lists pages and products in the sitemap", () => {
    const xml = buildSitemap(["nyeri-aa"]);
    expect(xml).toContain("<loc>https://jowamroasters.com/menu</loc>");
    expect(xml).toContain("<loc>https://jowamroasters.com/product/nyeri-aa</loc>");
    expect(xml).not.toContain("/order");
  });
});
