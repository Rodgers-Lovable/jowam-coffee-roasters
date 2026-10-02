import { createFileRoute } from "@tanstack/react-router";
import { imageCache } from "@/lib/platform.server";
import { imagePath } from "@/lib/products";
import { getLiveProducts } from "@/lib/products.server";

const DRIVE_ID = /^[\w-]{10,200}$/;
const MAX_BYTES = 5 * 1024 * 1024;
const RASTER_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"]);

const notFound = () => new Response("Not found", { status: 404 });
const unavailable = () => new Response("Image unavailable", { status: 502 });

function imageResponse(body: BodyInit | null, type: string) {
  return new Response(body, {
    headers: {
      "content-type": type,
      "cache-control": "public, max-age=86400",
      "x-content-type-options": "nosniff",
    },
  });
}

export const Route = createFileRoute("/api/v1/images/$driveId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { driveId } = params;
        if (!DRIVE_ID.test(driveId)) return notFound();

        const path = imagePath(driveId);
        const products = await getLiveProducts();
        // Only serve images that belong to a listed product, so this is not an open Drive proxy.
        if (!products.some((p) => p.image === path)) return notFound();

        const cached = await imageCache.get(driveId);
        if (cached) {
          return imageResponse(cached.body, cached.headers.get("content-type") ?? "image/jpeg");
        }

        let upstream: Response;
        try {
          upstream = await fetch(
            `https://drive.google.com/uc?export=download&id=${encodeURIComponent(driveId)}`,
            { redirect: "follow", signal: AbortSignal.timeout(8000) },
          );
        } catch {
          console.error(`[images] Drive request failed for ${driveId}`);
          return unavailable();
        }

        const type = (upstream.headers.get("content-type") ?? "").split(";")[0]?.trim() ?? "";
        const length = Number(upstream.headers.get("content-length") ?? 0);
        if (!upstream.ok || !RASTER_TYPES.has(type) || length > MAX_BYTES) {
          console.error(`[images] Drive returned ${upstream.status} ${type} for ${driveId}`);
          return unavailable();
        }

        const [forClient, forCache] = upstream.body?.tee() ?? [null, null];
        if (forCache) {
          // Best effort; a cache failure must not break the response.
          void imageCache
            .put(driveId, imageResponse(forCache, type))
            .catch(() => console.error(`[images] cache write failed for ${driveId}`));
        }
        return imageResponse(forClient, type);
      },
    },
  },
});
