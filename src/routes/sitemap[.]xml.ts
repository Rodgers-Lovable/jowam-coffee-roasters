import { createFileRoute } from "@tanstack/react-router";
import { getLiveProducts } from "@/lib/products.server";
import { absoluteUrl } from "@/lib/seo";

// Public pages only: /order is noindex and stays out.
const PAGES = [
  "/",
  "/menu",
  "/coffee",
  "/shop",
  "/our-story",
  "/wholesale",
  "/visit",
  "/experiences",
];

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function buildSitemap(handles: string[]) {
  const urls = [...PAGES, ...handles.map((handle) => `/product/${handle}`)]
    .map((path) => `  <url><loc>${escapeXml(absoluteUrl(path))}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const products = await getLiveProducts();
        return new Response(buildSitemap(products.map((p) => p.handle)), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
