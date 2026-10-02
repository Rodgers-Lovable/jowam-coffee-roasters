import { describe, expect, it } from "vitest";
import { canonicalRedirect } from "./redirects";

const at = (url: string) => canonicalRedirect(new Request(url));

describe("canonicalRedirect", () => {
  it("leaves canonical URLs alone", () => {
    expect(at("https://jowamroasters.com/")).toBeNull();
    expect(at("https://jowamroasters.com/menu")).toBeNull();
    expect(at("https://jowam-coffee-roasters-git-develop.vercel.app/menu")).toBeNull();
  });

  it("strips trailing slashes permanently and keeps the query", () => {
    const response = at("https://jowamroasters.com/menu/?ref=ig");
    expect(response?.status).toBe(308);
    expect(response?.headers.get("location")).toBe("/menu?ref=ig");
  });

  it("collapses repeated slashes", () => {
    expect(at("https://jowamroasters.com/product/nyeri//")?.headers.get("location")).toBe("/product/nyeri");
  });

  it("sends the old vercel.app address to the real domain", () => {
    const response = at("https://jowam-coffee-roasters.vercel.app/shop/");
    expect(response?.status).toBe(308);
    expect(response?.headers.get("location")).toBe("https://jowamroasters.com/shop");
  });
});
