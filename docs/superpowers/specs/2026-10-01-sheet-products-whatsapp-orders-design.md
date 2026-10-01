# Sheet-driven products and WhatsApp ordering (v1)

Status: approved design, 2026-10-01
Branch: `feature/sheet-products-whatsapp-orders`

## Goal

Remove Shopify from the site. Staff manage the product list in a Google Sheet without touching code. Customers build a cart, fill in a short order form and send the order to Jowam on WhatsApp. Every order is also saved as a row in the same Sheet. Payment and the delivery fee are agreed on WhatsApp.

Running cost: zero. Everything sits inside the free tiers of Cloudflare Workers, Workers KV and Google Apps Script.

## Out of scope (v2)

- Online payment and automatic checkout (M-Pesa STK push or a gateway)
- Stock quantities (v1 only has an "Available" checkbox)
- An admin page on the site
- Delivery zones and fees on the site

## Overview

```
Staff ──edit──> Google Sheet (Products tab, Orders tab)
                      │  ▲
          doGet (JSON)│  │doPost (append order row)
                      ▼  │
                Apps Script web app  (shared secret)
                      │  ▲
                      ▼  │
  Browser <──> Cloudflare Worker (TanStack Start server functions)
                 ├─ getProducts: Cache API (5 min) ─> Apps Script ─> KV last-good copy
                 ├─ submitOrder: validate, price, ref ─> Apps Script doPost
                 └─ /api/v1/images/:driveId: Drive image proxy, edge cached
```

One Sheet file holds both tabs. One Apps Script project bound to that Sheet serves reads and writes.

## The Sheet

### Products tab

One row per variant. Rows that share a Handle form one product. Row 1 is the header row and its labels must match exactly.

| Column | Type | Rules |
|---|---|---|
| Handle | text | lowercase letters, numbers and hyphens. Becomes the URL `/product/<handle>` |
| Name | text | required |
| Category | dropdown | `Coffee`, `Equipment`, `Merch`. Data validation in the Sheet |
| Description | text | taken from the first row of the product |
| Variant | text | required, e.g. `250g Whole Bean` |
| Price KES | number | required, whole shillings, greater than 0 |
| Available | checkbox | unticked means sold out |
| Image | Drive link | taken from the first row of the product; optional |
| Sort | number | lower shows first; ties sort by Name |

Product-level fields (Name, Category, Description, Image, Sort) are read from the first row of each handle. Staff can leave them blank on the extra variant rows.

### Orders tab

Written only by the script. Staff edit the Status column.

| Column | Filled by |
|---|---|
| Received at | script, Africa/Nairobi time |
| Ref | site, e.g. `JW-261001-4F7K` |
| Name | customer |
| Phone | customer, normalised to `2547XXXXXXXX` |
| Email | customer, optional |
| Method | `Pickup` or `Delivery` |
| Address | customer, delivery only |
| Items | site, one line per item: `2 × Kiambu AA (250g Whole Bean) @ 1,200` |
| Subtotal KES | site |
| Notes | customer |
| Status | dropdown, starts as `New`. Staff move it to `Confirmed`, `Paid`, `Fulfilled` or `Cancelled` |

## Apps Script web app

Bound to the Sheet and deployed as a web app that executes as the owner, with access set to "Anyone". The shared secret is what stops strangers from using it.

- `doGet(e)`: checks `e.parameter.secret`, reads the Products tab and returns `{ products: Row[] }` as JSON, one object per sheet row with the raw cell values. The site handles grouping and validation, so the script stays small.
- `doPost(e)`: parses the JSON body, checks `body.secret`, takes a `LockService` script lock, appends one row to Orders and returns `{ ok: true }`.
- A wrong or missing secret returns `{ ok: false, error: "unauthorized" }`. Apps Script cannot set HTTP status codes, so the Worker checks `ok`.

Apps Script answers with a 302 redirect to `script.googleusercontent.com`. The Worker uses `fetch` with `redirect: "follow"`. A POST becomes a GET on that redirect, which is expected and still returns the `doPost` output.

The secret is sent as a query parameter on reads because `doGet` cannot read headers. This request only travels between the Worker and Google, never through the browser.

The script source and setup steps live in `docs/apps-script/jowam-sheet.gs` and the staff guide.

## Site changes

### Product data (`src/lib/products.ts`, server only)

```ts
type Variant = { id: string; label: string; priceKes: number; available: boolean };
type Product = {
  handle: string;
  name: string;
  category: "Coffee" | "Equipment" | "Merch";
  description: string;
  image: string | null; // site path, e.g. /api/v1/images/<driveId>
  sort: number;
  variants: Variant[];
};
```

The variant `id` is `<handle>--<slug of Variant label>`, which stays stable across reloads as long as staff don't rename the variant.

`getProducts()` is a TanStack Start server function:

1. Look up the Cloudflare Cache API entry. If it is younger than 5 minutes, return it.
2. Otherwise call the Apps Script `doGet`. Validate each row with zod, skip invalid rows and `console.error` each one with its row number and reason. Group rows by handle. Drop products that have no available variants.
3. On success, write the result to the cache and to KV key `products:last-good`.
4. If the Apps Script call fails or every row is invalid, return KV `products:last-good`.
5. If KV is also empty, return `[]`. The shop page then shows an "Order on WhatsApp" message.

Cache API and KV access go through the Cloudflare bindings exposed by the Nitro `cloudflare-module` preset. The implementation plan confirms the exact access pattern.

### Image proxy (`/api/v1/images/$driveId`)

- Server route that accepts only IDs found in the current product list. Anything else returns 404, so the route cannot proxy arbitrary Drive files.
- Fetches `https://drive.google.com/uc?export=download&id=<id>`, checks the response is `image/*` and returns it with `Cache-Control: public, max-age=86400`.
- Staff paste the normal Drive share link. The site extracts the file ID from the `/file/d/<id>/` or `?id=<id>` forms.
- No image or a broken image falls back to the existing product placeholder.

### Shop and product pages

- `src/routes/shop.tsx` and `src/routes/product.$handle.tsx` load data through `getProducts` in route loaders instead of calling Shopify from the browser.
- An unknown handle returns the router's not-found page.
- A sold-out variant shows "Sold out" and its add button is disabled.
- `src/components/jowam/product-card.tsx` switches to the new `Product` type.
- The shop copy "Delivery options and timelines are shown at checkout" changes to say delivery is arranged on WhatsApp.

### Cart (`src/stores/cart-store.ts`)

- Remove every Shopify mutation and query, plus `getCheckoutUrl` and `syncCart`.
- Persist only `{ handle, variantId, quantity }[]` in localStorage. Names and prices come from the current product data when the cart renders, so the cart never shows an old price.
- A line whose product or variant has disappeared or sold out is shown as unavailable and left out of the order.
- `src/components/jowam/cart-drawer.tsx`: the "Checkout" button becomes "Place order" and links to `/order`. The "Taxes and delivery are calculated at checkout" note changes to "Delivery fee and payment are confirmed on WhatsApp."

### Order page (`src/routes/order.tsx`)

Order summary on one side, form on the other (stacked on mobile). react-hook-form with a zod schema shared with the server:

- Name: required, 2 to 80 characters
- Phone: required. Accepts `07XXXXXXXX`, `01XXXXXXXX`, `+2547…` or `2547…` and normalises to `254XXXXXXXXX`
- Email: optional, valid email
- Method: radio, `Pickup at Lavington Mall` or `Delivery`
- Address or area: required when Method is Delivery, up to 200 characters
- Notes: optional, up to 500 characters
- Honeypot field `company`, hidden from people and screen readers. A filled value means the request is dropped quietly.

The page shows the subtotal and the line "Delivery fee and payment (M-Pesa or on pickup) are confirmed on WhatsApp."

### Order submission (`submitOrder` server function)

1. Validate the input with the shared schema. Return a 400 with field errors if it fails.
2. Rate limit with the Workers Rate Limiting binding: 5 orders per IP per 10 minutes. Return 429 when the limit is reached.
3. Load products through `getProducts`. Every line must match an available variant. Prices come from the product data, never from the browser. Quantity must be between 1 and 50.
4. Generate a ref `JW-YYMMDD-XXXX`, where the date is Nairobi time and `XXXX` is 4 random characters from an alphabet without `0/O/1/I`.
5. POST the order to Apps Script with a 5 second timeout.
6. Build the WhatsApp text with `buildWhatsApp` from `src/lib/enquiry.ts`, including the ref, items, subtotal, method, address and notes. If `siteInfo.contact.whatsapp` is null, fall back to `buildMailto`.
7. Return `{ ref, saved, link }`, where `saved` is false when step 5 failed.

The browser then clears the cart, shows the confirmation screen with the ref and an "Open WhatsApp" button, and opens the link.

If the Sheet write fails, the order still goes through on WhatsApp so the sale is not lost. The confirmation screen then says "Please send the WhatsApp message so we receive your order." The failure is logged with `console.error` and shows up in the Cloudflare logs.

## Configuration

| Name | Kind | Purpose |
|---|---|---|
| `SHEET_SCRIPT_URL` | Wrangler secret | Apps Script web app URL |
| `SHEET_SECRET` | Wrangler secret | shared secret, at least 32 random characters |
| `PRODUCTS_KV` | KV namespace binding | last good product list |
| `ORDER_RATE_LIMITER` | Rate Limiting binding | order spam limit |

Local development reads the secrets from `.dev.vars`, which is already in `.gitignore`. A `wrangler.jsonc` is added with the bindings.

`siteInfo.contact.whatsapp` in `src/data/site.ts` must hold the real number before launch. Ordering depends on it.

## Removals

- `src/lib/shopify.ts`
- Shopify query keys and imports in `shop.tsx`, `product.$handle.tsx`, `product-card.tsx`, `cart-store.ts` and `cart-drawer.tsx`

## Staff guide (`docs/staff-guide.md`)

Plain-language guide covering:

- Adding a product, and adding another size or grind as a new row with the same Handle
- Changing a price and marking a variant sold out
- Adding a photo: upload it to the shared Drive folder, set it to "Anyone with the link can view", paste the link
- How long a change takes to appear (up to 5 minutes)
- What not to change: the header row, the tab names, and Handle values of live products (renaming one breaks old links and carts)
- Working the Orders tab: the Status flow and matching the ref with the WhatsApp chat

## One-time setup (owner)

1. Create the Sheet with the `Products` and `Orders` tabs. Paste in the seed rows from the Shopify export.
2. Open Extensions, then Apps Script, paste `docs/apps-script/jowam-sheet.gs`, set the secret in Script Properties and deploy as a web app.
3. Create the Drive image folder and share it with staff.
4. Run `wrangler kv namespace create PRODUCTS_KV` and `wrangler secret put` for both secrets.

## Testing

- Unit tests with Vitest (added as a dev dependency, the project has no test runner yet) for row validation and grouping, Drive link parsing, phone normalisation, ref format and WhatsApp message building.
- Local end-to-end run against a test copy of the Sheet: product list, product page, sold-out state, cart, order form errors, a successful order row in the Sheet, the WhatsApp link text and the cart clearing.
- Failure paths: wrong secret, Apps Script unreachable (falls back to KV), invalid rows skipped, Sheet write failure still shows the WhatsApp step.
- Mobile layout check for the shop, product, cart and order pages.

## Seeding

A one-off script reads the current products from the Shopify Storefront API and writes `docs/seed/products.csv` in the Products tab layout. Staff import it into the Sheet. Product images are downloaded so staff can upload them to the Drive folder. The script is deleted after use and is not part of the site.
