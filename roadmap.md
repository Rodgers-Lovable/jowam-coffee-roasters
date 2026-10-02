# Jowam initial build

- [x] Establish design system, shared content, navigation, and footer
- [x] Build complete Home page
- [x] Build complete Menu page
- [x] Build complete Coffee page
- [x] Add polished Shop, Our Story, Wholesale, and Visit placeholders
- [x] Validate routes, interactions, accessibility, desktop, and mobile layouts

# Wholesale & experiences

- [x] Design full Wholesale page with enquiry form (mailto, WhatsApp-ready)
- [x] Add Experiences & Training page with register-interest form
- [x] Point Home, Coffee and footer experience/training links to /experiences
- [ ] Replace placeholder contact email and add WhatsApp number in `src/data/site.ts`

# Sheet products and WhatsApp ordering

- [x] Load products from the Google Sheet with caching and a last-good fallback
- [x] Local cart and order page that saves to the Sheet and hands off to WhatsApp
- [x] Remove Shopify
- [ ] Set up the Sheet, Apps Script, Drive photo folder and Cloudflare secrets (see docs/staff-guide.md)

# v2

- [ ] Online payment (M-Pesa STK push or a payment gateway)
- [ ] Stock quantities
- [ ] Delivery zones and fees on the site

# Google reviews

- [x] Call Google Places (New) directly with a server-only key, cached for 12 hours
- [ ] Create the Places API key (Jowam Google account) and set GOOGLE_PLACES_API_KEY with wrangler secret put
