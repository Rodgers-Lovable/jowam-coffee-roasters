import { siteInfo } from "@/data/site";

// The Vercel production alias still answers; send it to the real domain so only one copy gets indexed.
// Preview deployments use other vercel.app hosts and are left alone.
const OLD_HOSTS = new Set(["jowam-coffee-roasters.vercel.app"]);

// Search engines treat 307 as temporary, so use permanent 308 redirects.
export function canonicalRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const pathname =
    url.pathname !== "/" && url.pathname.endsWith("/")
      ? url.pathname.replace(/\/+$/, "") || "/"
      : url.pathname;
  const wrongHost = OLD_HOSTS.has(url.host);
  if (!wrongHost && pathname === url.pathname) return null;
  const location = (wrongHost ? siteInfo.url : "") + pathname + url.search;
  return new Response(null, { status: 308, headers: { location } });
}
