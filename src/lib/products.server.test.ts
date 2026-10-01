import { describe, expect, it, vi, type Mock } from "vitest";
import type { Product, ProductStore } from "./products";
import { loadProducts } from "./products.server";

const validRow = {
  Handle: "nyeri",
  Name: "Nyeri",
  Category: "Coffee",
  Description: "",
  Variant: "250g",
  "Price KES": 1200,
  Available: true,
  Image: "",
  Sort: 1,
};

const kvProduct: Product = {
  handle: "kv",
  name: "From KV",
  category: "Coffee",
  description: "",
  image: null,
  sort: 1,
  variants: [{ id: "kv--250g", label: "250g", priceKes: 1000, available: true }],
};

type MemoryStore = {
  value: Product[] | null;
  get: Mock<ProductStore["get"]>;
  put: Mock<ProductStore["put"]>;
};

function memoryStore(initial: Product[] | null = null): MemoryStore {
  const store = {
    value: initial,
    get: vi.fn(async () => store.value),
    put: vi.fn(async (products: Product[]) => {
      store.value = products;
    }),
  };
  return store;
}

const quiet = () => vi.spyOn(console, "error").mockImplementation(() => {});

describe("loadProducts", () => {
  it("returns cached products without calling the sheet", async () => {
    const readRows = vi.fn();
    const result = await loadProducts({
      readRows,
      cache: memoryStore([kvProduct]),
      lastGood: memoryStore(),
    });
    expect(result).toEqual([kvProduct]);
    expect(readRows).not.toHaveBeenCalled();
  });

  it("reads the sheet on a cache miss and stores the result in both stores", async () => {
    const cache = memoryStore();
    const lastGood = memoryStore();
    const result = await loadProducts({ readRows: async () => [validRow], cache, lastGood });
    expect(result.map((p) => p.handle)).toEqual(["nyeri"]);
    expect(cache.value).toEqual(result);
    expect(lastGood.value).toEqual(result);
  });

  it("falls back to the last good copy when the sheet fails", async () => {
    const spy = quiet();
    const result = await loadProducts({
      readRows: async () => {
        throw new Error("down");
      },
      cache: memoryStore(),
      lastGood: memoryStore([kvProduct]),
    });
    expect(result).toEqual([kvProduct]);
    spy.mockRestore();
  });

  it("falls back when every row is invalid", async () => {
    const spy = quiet();
    const cache = memoryStore();
    const result = await loadProducts({
      readRows: async () => [{ ...validRow, "Price KES": "abc" }],
      cache,
      lastGood: memoryStore([kvProduct]),
    });
    expect(result).toEqual([kvProduct]);
    expect(cache.value).toBeNull();
    spy.mockRestore();
  });

  it("returns an empty list when the sheet fails and there is no last good copy", async () => {
    const spy = quiet();
    const result = await loadProducts({
      readRows: async () => {
        throw new Error("down");
      },
      cache: memoryStore(),
      lastGood: memoryStore(),
    });
    expect(result).toEqual([]);
    spy.mockRestore();
  });

  it("logs skipped rows", async () => {
    const spy = quiet();
    await loadProducts({
      readRows: async () => [validRow, { ...validRow, Variant: "1kg", "Price KES": "abc" }],
      cache: memoryStore(),
      lastGood: memoryStore(),
    });
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/Row 3:/));
    spy.mockRestore();
  });

  it("treats a cache read error as a miss", async () => {
    const spy = quiet();
    const cache = memoryStore();
    cache.get.mockRejectedValue(new Error("edge down"));
    const result = await loadProducts({
      readRows: async () => [validRow],
      cache,
      lastGood: memoryStore(),
    });
    expect(result.map((p) => p.handle)).toEqual(["nyeri"]);
    spy.mockRestore();
  });

  it("still returns fresh products and writes last good when cache.put throws", async () => {
    const spy = quiet();
    const cache = memoryStore();
    cache.put.mockRejectedValue(new Error("full"));
    const lastGood = memoryStore();
    const result = await loadProducts({ readRows: async () => [validRow], cache, lastGood });
    expect(result.map((p) => p.handle)).toEqual(["nyeri"]);
    expect(lastGood.value).toEqual(result);
    spy.mockRestore();
  });

  it("still returns fresh products when lastGood.put throws", async () => {
    const spy = quiet();
    const lastGood = memoryStore();
    lastGood.put.mockRejectedValue(new Error("kv down"));
    const result = await loadProducts({
      readRows: async () => [validRow],
      cache: memoryStore(),
      lastGood,
    });
    expect(result.map((p) => p.handle)).toEqual(["nyeri"]);
    spy.mockRestore();
  });

  it("returns an empty list when lastGood.get throws during fallback", async () => {
    const spy = quiet();
    const lastGood = memoryStore();
    lastGood.get.mockRejectedValue(new Error("kv down"));
    const result = await loadProducts({
      readRows: async () => {
        throw new Error("down");
      },
      cache: memoryStore(),
      lastGood,
    });
    expect(result).toEqual([]);
    spy.mockRestore();
  });

  it("does not log the secret from an error message object", async () => {
    const spy = quiet();
    await loadProducts({
      readRows: async () => {
        throw new Error("boom");
      },
      cache: memoryStore(),
      lastGood: memoryStore(),
    });
    for (const call of spy.mock.calls) expect(call.every((a) => typeof a === "string")).toBe(true);
    spy.mockRestore();
  });
});
