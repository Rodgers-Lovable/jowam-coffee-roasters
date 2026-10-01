// Hosting adapter. The only file that knows the site runs on Cloudflare Workers.
// Moving to another host means rewriting this file and the deploy config, nothing else.
import { getRequestHeader } from "@tanstack/react-start/server";
import type { Product, ProductStore } from "@/lib/products";
import { SheetError, type SheetConfig } from "@/lib/sheet.server";

type KvNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};
type RateLimiter = { limit(options: { key: string }): Promise<{ success: boolean }> };
type EdgeCache = {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
};
type WorkerEnv = {
  PRODUCTS_KV?: KvNamespace;
  ORDER_RATE_LIMITER?: RateLimiter;
  SHEET_SCRIPT_URL?: string;
  SHEET_SECRET?: string;
};

async function getWorkerEnv(): Promise<WorkerEnv> {
  try {
    const specifier = "cloudflare:workers";
    const mod = (await import(/* @vite-ignore */ specifier)) as { env?: WorkerEnv };
    return mod.env ?? {};
  } catch {
    return {}; // vite dev on Node: no Workers runtime
  }
}

function getEdgeCache(): EdgeCache | null {
  const caches = (globalThis as { caches?: { default?: EdgeCache } }).caches;
  return caches?.default ?? null;
}

export async function getSheetConfig(): Promise<SheetConfig> {
  const env = await getWorkerEnv();
  const url = env.SHEET_SCRIPT_URL ?? process.env["SHEET_SCRIPT_URL"];
  const secret = env.SHEET_SECRET ?? process.env["SHEET_SECRET"];
  if (!url || !secret) throw new SheetError("SHEET_SCRIPT_URL or SHEET_SECRET is not set");
  return { url, secret };
}

const CACHE_TTL_SECONDS = 300;
const CACHE_KEY = "https://cache.jowam.internal/products/v1";
const LAST_GOOD_KEY = "products:last-good";

// Per isolate memory, then the Cloudflare edge cache for the data centre.
let memory: { at: number; products: Product[] } | null = null;

export const productCache: ProductStore = {
  async get() {
    if (memory && Date.now() - memory.at < CACHE_TTL_SECONDS * 1000) return memory.products;
    const hit = await getEdgeCache()?.match(new Request(CACHE_KEY));
    if (!hit) return null;
    const products = (await hit.json()) as Product[];
    memory = { at: Date.now(), products };
    return products;
  },
  async put(products) {
    memory = { at: Date.now(), products };
    await getEdgeCache()?.put(
      new Request(CACHE_KEY),
      new Response(JSON.stringify(products), {
        headers: {
          "content-type": "application/json",
          "cache-control": `public, max-age=${CACHE_TTL_SECONDS}`,
        },
      }),
    );
  },
};

const IMAGE_CACHE_TTL_SECONDS = 86400;
const imageCacheRequest = (driveId: string) =>
  new Request(`https://cache.jowam.internal/images/${encodeURIComponent(driveId)}`);

/** Edge cache for proxied images. No-ops when there is no edge cache (vite dev). */
export const imageCache = {
  async get(driveId: string): Promise<Response | null> {
    return (await getEdgeCache()?.match(imageCacheRequest(driveId))) ?? null;
  },
  async put(driveId: string, response: Response): Promise<void> {
    const headers = new Headers(response.headers);
    headers.set("cache-control", `public, max-age=${IMAGE_CACHE_TTL_SECONDS}`);
    await getEdgeCache()?.put(
      imageCacheRequest(driveId),
      new Response(response.body, { status: 200, headers }),
    );
  },
};

export const lastGoodStore: ProductStore = {
  async get() {
    const kv = (await getWorkerEnv()).PRODUCTS_KV;
    const raw = await kv?.get(LAST_GOOD_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Product[];
    } catch {
      return null; // corrupt copy: treat as missing
    }
  },
  async put(products) {
    const kv = (await getWorkerEnv()).PRODUCTS_KV;
    if (!kv) return;
    const next = JSON.stringify(products);
    // Skip the write when nothing changed; the KV free tier allows 1,000 writes a day.
    if ((await kv.get(LAST_GOOD_KEY)) === next) return;
    await kv.put(LAST_GOOD_KEY, next);
  },
};

/** True when the request is allowed. Allows everything when no limiter is bound (local dev). */
export async function rateLimit(key: string): Promise<boolean> {
  const limiter = (await getWorkerEnv()).ORDER_RATE_LIMITER;
  if (!limiter) return true;
  return (await limiter.limit({ key })).success;
}

/** The visitor's IP as reported by the host. Used for rate limiting only. */
export function clientIp(): string {
  return getRequestHeader("cf-connecting-ip") ?? "unknown";
}
