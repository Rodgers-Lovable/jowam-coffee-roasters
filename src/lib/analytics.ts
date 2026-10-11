import type { EnquiryFormId } from "@/data/enquiry-forms";

// Umami analytics (self-hosted, cookieless). Both values are public and baked in at build time.
// Leave either unset and no script loads, so local dev and previews stay out of the stats.
const scriptUrl = import.meta.env["VITE_UMAMI_SCRIPT_URL"] as string | undefined;
const websiteId = import.meta.env["VITE_UMAMI_WEBSITE_ID"] as string | undefined;

/** Only page views on this host are recorded, even if the script runs on a preview URL. */
export const ANALYTICS_DOMAIN = "jowamroasters.com";

export type AnalyticsEvent =
  | "add_to_cart"
  | "begin_checkout"
  | "order_submitted"
  | "order_failed"
  // One name per form, because Umami funnels and goals match on the event name alone.
  | `${EnquiryFormId}_enquiry_submitted`
  | "enquiry_failed"
  | "enquiry_whatsapp"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "directions_click"
  | "social_click"
  | "reviews_click";

type EventData = Record<string, string | number | boolean>;

type Umami = { track: (event: string, data?: EventData) => void };

export function umamiScript(
  { url, id }: { url?: string | undefined; id?: string | undefined } = {
    url: scriptUrl,
    id: websiteId,
  },
) {
  if (!url || !id) return null;
  return {
    src: url,
    defer: true,
    "data-website-id": id,
    "data-domains": ANALYTICS_DOMAIN,
  };
}

/** Records a custom event. Does nothing when the script is blocked, missing or still loading. */
export function track(event: AnalyticsEvent, data?: EventData) {
  if (typeof window === "undefined") return;
  const umami = (window as { umami?: Umami }).umami;
  try {
    umami?.track(event, data);
  } catch {
    // Analytics must never break the page.
  }
}

/** Attributes for a link Umami records on click, e.g. `<a {...trackLink("phone_click")}>`. */
export function trackLink(event: AnalyticsEvent, data: Record<string, string> = {}) {
  return {
    "data-umami-event": event,
    ...Object.fromEntries(
      Object.entries(data).map(([key, value]) => [`data-umami-event-${key}`, value]),
    ),
  };
}
