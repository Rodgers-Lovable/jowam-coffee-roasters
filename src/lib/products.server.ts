import { getSheetConfig, lastGoodStore, productCache } from "@/lib/platform.server";
import { parseProductRows, type Product, type ProductStore } from "@/lib/products";
import { readProductRows } from "@/lib/sheet.server";

type LoadDeps = {
  readRows: () => Promise<unknown[]>;
  cache: ProductStore;
  lastGood: ProductStore;
};

export async function loadProducts(deps: LoadDeps): Promise<Product[]> {
  const cached = await deps.cache.get();
  if (cached) return cached;

  try {
    const rows = await deps.readRows();
    const { products, errors } = parseProductRows(rows);
    for (const error of errors) console.error(`[products] ${error}`);
    if (products.length === 0 && errors.length > 0) {
      throw new Error("Every product row in the Sheet is invalid");
    }
    await deps.cache.put(products);
    await deps.lastGood.put(products);
    return products;
  } catch (error) {
    console.error("[products] falling back to the last good copy", error);
    return (await deps.lastGood.get()) ?? [];
  }
}

export function getLiveProducts() {
  return loadProducts({
    readRows: async () => readProductRows(await getSheetConfig()),
    cache: productCache,
    lastGood: lastGoodStore,
  });
}
