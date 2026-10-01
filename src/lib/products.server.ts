import { getSheetConfig, lastGoodStore, productCache } from "@/lib/platform.server";
import { parseProductRows, type Product, type ProductStore } from "@/lib/products";
import { readProductRows } from "@/lib/sheet.server";

type LoadDeps = {
  readRows: () => Promise<unknown[]>;
  cache: ProductStore;
  lastGood: ProductStore;
  onFallback?: (products: Product[]) => void;
};

const reason = (error: unknown) => (error instanceof Error ? error.message : String(error));

async function attempt(label: string, action: () => Promise<unknown>) {
  try {
    await action();
  } catch (error) {
    console.error(`[products] ${label} failed: ${reason(error)}`);
  }
}

export async function loadProducts(deps: LoadDeps): Promise<Product[]> {
  try {
    const cached = await deps.cache.get();
    if (cached) return cached;
  } catch (error) {
    console.error(`[products] cache read failed: ${reason(error)}`);
  }

  try {
    const rows = await deps.readRows();
    const { products, errors } = parseProductRows(rows);
    for (const error of errors) console.error(`[products] ${error}`);
    if (products.length === 0 && errors.length > 0) {
      throw new Error("Every product row in the Sheet is invalid");
    }
    await attempt("cache write", () => deps.cache.put(products));
    await attempt("last good write", () => deps.lastGood.put(products));
    return products;
  } catch (error) {
    console.error(`[products] falling back to the last good copy: ${reason(error)}`);
    try {
      const lastGood = (await deps.lastGood.get()) ?? [];
      if (lastGood.length > 0) deps.onFallback?.(lastGood);
      return lastGood;
    } catch (fallbackError) {
      console.error(`[products] last good read failed: ${reason(fallbackError)}`);
      return [];
    }
  }
}

let inFlight: Promise<Product[]> | null = null;

// During a Sheet outage, remember the last good list briefly so requests do not each wait on the Sheet.
const FALLBACK_TTL_MS = 30_000;
let fallbackUntil = 0;
let fallbackProducts: Product[] | null = null;

export function getLiveProducts(): Promise<Product[]> {
  if (fallbackProducts && Date.now() < fallbackUntil) return Promise.resolve(fallbackProducts);
  inFlight ??= loadProducts({
    readRows: async () => readProductRows(await getSheetConfig()),
    cache: productCache,
    lastGood: lastGoodStore,
    onFallback: (products) => {
      fallbackProducts = products;
      fallbackUntil = Date.now() + FALLBACK_TTL_MS;
    },
  }).finally(() => {
    inFlight = null;
  });
  return inFlight;
}
