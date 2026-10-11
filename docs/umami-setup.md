# Umami analytics setup

The site reports visits and key actions to our self-hosted Umami at `umami.mawirab.com`. Umami sets no cookies, so no consent banner is needed. The privacy policy explains what is collected.

## Configuration

Two public values, read at build time:

```
VITE_UMAMI_SCRIPT_URL=https://umami.mawirab.com/script.js
VITE_UMAMI_WEBSITE_ID=<website ID from Umami: Settings > Websites>
```

Put them in `.env` for local work and in the build environment for production. They are baked into the bundle, so a Wrangler secret is not enough: the build itself must see them. If either is missing, the script is not loaded at all.

The script carries `data-domains="jowamroasters.com"`, so visits on localhost and preview URLs are never recorded.

## Events

| Event | When | Data |
| --- | --- | --- |
| `add_to_cart` | Add to bag on a product card or product page | `product`, `price`, `source` (`card` or `product`) |
| `begin_checkout` | "Place order" in the bag drawer | |
| `order_submitted` | Order accepted by the server | `revenue`, `currency` (KES), `items`, `method`, `notified` |
| `order_failed` | Order submit returned an error | |
| `wholesale_enquiry_submitted` | Wholesale form sent | |
| `experiences_enquiry_submitted` | Experiences form sent | |
| `enquiry_failed` | Enquiry submit returned an error | `form` |
| `enquiry_whatsapp` | Enquiry sent through the WhatsApp button | `form` |
| `whatsapp_click`, `phone_click`, `email_click`, `directions_click` | Contact links | `placement` (page or footer) |
| `social_click` | Instagram or TikTok in the footer | `network` |
| `reviews_click` | "Read on Google" under the reviews | |

`revenue` is the coffee subtotal. Delivery fees are confirmed with the customer after the order, so they are not included. `notified: false` means the order email failed and the customer was asked to send the order by WhatsApp or email.

Event names live in `src/lib/analytics.ts`. Use `track()` for events fired from code and `trackLink()` for links.

## Reports to create in Umami

- **Funnel "Shop"**: `/shop`, then `/product/*`, then event `add_to_cart`, then event `begin_checkout`, then event `order_submitted`.
- **Funnel "Wholesale"**: `/wholesale`, then event `wholesale_enquiry_submitted`. Same pattern for `/experiences`.
- **Goals**: `order_submitted`, both enquiry events and `whatsapp_click`.
- **Revenue**: event `order_submitted`, currency KES.
- **UTM**: tag Instagram and TikTok bio links, printed QR codes on bags and table cards, and any campaign links, for example `?utm_source=instagram&utm_medium=bio` or `?utm_source=bag_qr&utm_medium=print`.

## Ad blockers

Many blockers stop requests to `script.js` and `/api/send`, which hides a share of visits. To reduce that, set these on the Umami server and update `VITE_UMAMI_SCRIPT_URL` to match:

```
TRACKER_SCRIPT_NAME=jw.js
COLLECT_API_ENDPOINT=/api/jw
```
