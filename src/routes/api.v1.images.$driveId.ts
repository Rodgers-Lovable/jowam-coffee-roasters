import { createFileRoute } from "@tanstack/react-router";
import { imagePath } from "@/lib/products";
import { getLiveProducts } from "@/lib/products.server";

export const Route = createFileRoute("/api/v1/images/$driveId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = imagePath(params.driveId);
        const products = await getLiveProducts();
        // Only serve images that belong to a listed product, so this is not an open Drive proxy.
        if (!products.some((p) => p.image === path)) {
          return new Response("Not found", { status: 404 });
        }

        const upstream = await fetch(
          `https://drive.google.com/uc?export=download&id=${encodeURIComponent(params.driveId)}`,
          { redirect: "follow" },
        );
        const type = upstream.headers.get("content-type") ?? "";
        if (!upstream.ok || !type.startsWith("image/")) {
          console.error(`[images] Drive returned ${upstream.status} ${type} for ${params.driveId}`);
          return new Response("Image unavailable", { status: 502 });
        }

        return new Response(upstream.body, {
          headers: {
            "content-type": type,
            "cache-control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
