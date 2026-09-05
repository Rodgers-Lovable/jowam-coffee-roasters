# Jowam Coffee Roasters — Initial Website Build

## Goal
Build a photography-led, premium Kenyan hospitality website where café, food, people, and place lead naturally into Jowam’s specialty-coffee and roasting expertise. Home, Menu, and Coffee will be complete; Shop, Our Story, Wholesale, and Visit will be polished, intentionally limited placeholders.

## Visual direction
- Establish a warm editorial system using natural paper, cream, charcoal, espresso, muted olive, and restrained coffee-cherry accents rather than an all-brown palette.
- Pair expressive editorial display type with a highly legible sans-serif body face, generous spacing, strong hierarchy, restrained uppercase labels, and clear focus states.
- Make candid, warm photography the dominant visual material: active café tables, food in context, working baristas and roasters, Kenyan origin landscapes, and hospitality-led wholesale scenes.
- Use varied page rhythm: cinematic full-width imagery, asymmetric editorial arrangements, portrait and landscape crops, text statements, restrained product rows, and selective dark roastery transitions.
- Keep motion subtle: slow hero crossfades, small image reveals and scaling, smooth category scrolling, and reduced-motion fallbacks.

## Shared foundation
- Create a responsive global header with desktop navigation, a restrained bag icon, and a mobile menu prioritizing Menu, Visit/Directions, and Shop.
- Create an elegant shared footer with visit placeholders, page links, newsletter form presentation, and legal links.
- Build reusable editorial primitives for image sections, calls to action, coffee products, menu categories/items, producer stories, flavour profiles, experiences, journal previews, and placeholder pages.
- Centralize representative content and image references so final Jowam facts and photography can replace placeholders without layout rewrites.
- Use semantic color, typography, spacing, motion, and surface tokens throughout; avoid generic cards, gradients, glass effects, and decorative UI.

## Home (`/`)
- Build a slow, accessible hospitality image carousel with short copy and links to Menu and Visit.
- Sequence the page around hospitality statement, food, a dramatic roastery transition, currently roasting, people, visit, experiences, wholesale, and an art-directed “Life at Jowam” image composition.
- Keep copy concise and label all unknown prices, hours, and locations as representative placeholders.

## Menu (`/menu`)
- Build a compact photographic header so actual menu content appears quickly.
- Add sticky horizontal category navigation with smooth scrolling and mobile overflow.
- Render CMS-ready menu data through reusable category and item components, with readable descriptions, placeholder KSh prices, dietary markers, availability/seasonal fields, and an allergy note.
- Give coffee, signature-drink placeholders, and bakery distinct editorial treatments without turning the page into a photo grid.
- End with a visit-focused photographic call to action.

## Coffee (`/coffee`)
- Build a roastery-led hero and an in-page coffee subnavigation.
- Explain specialty coffee progressively through origin, quality, roasting, and brewing; follow with Kenyan-region placeholders, reusable producer-story presentation, processing explanations, and a strong dark roastery section.
- Add approachable flavour discovery, currently roasting products, brew methods, café reconnection, cupping/experiences, and three future journal previews.
- Clearly mark representative sourcing and producer content so no Jowam relationships are implied.

## Supporting routes
- `/shop`: polished commerce-coming placeholder, ready for a later Shopify-backed experience without implementing commerce now.
- `/our-story`: title, one strong image, and a clearly provisional introduction without invented history.
- `/wholesale`: strong hospitality/B2B image and broad audience categories only.
- `/visit`: polished location structure for café name, address, hours, phone, email, imagery, and directions, all explicitly placeholder where unknown.
- Do not create separate future pages for experiences, training, journal, brew guides, or product detail yet; use in-page destinations or non-dead presentation where appropriate.

## Images and performance
- Generate a cohesive set of representative editorial images sized for their intended crops rather than shipping remote stock placeholders.
- Use eager loading only for the first hero image; lazy-load below-the-fold images, provide width/height or aspect-ratio constraints, descriptive alt text, and responsive `sizes`.
- Keep hero architecture compatible with a future video loop while using an image carousel for this iteration.

## SEO and accessibility
- Add unique metadata to every route: title, description, Open Graph title/description/type, and Twitter card.
- Use one clear H1 per page, semantic landmarks and headings, keyboard-operable navigation/carousel, visible focus styles, readable type, strong contrast, and reduced-motion support.
- Keep schema-friendly content structure for future LocalBusiness, café, product, breadcrumb, and article data without fabricating facts now.

## Validation
- Check all routes and navigation links in the running site.
- Test desktop and mobile layouts, sticky menu categories, hero controls, mobile navigation, focus states, image loading, text fit, and absence of overlap/layout shift.
- Confirm Home feels hospitality-first, Menu is fast to scan, Coffee supports beginners and enthusiasts, and all unknown business details remain unmistakable placeholders.
