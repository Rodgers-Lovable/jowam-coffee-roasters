import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/jowam-bags-counter.jpg";
import lineupImage from "@/assets/jowam-bags-lineup.jpg";
import { Image, SectionIntro, TextLink } from "@/components/jowam/editorial";
import { ProductCard } from "@/components/jowam/product-card";
import { Button } from "@/components/ui/button";
import { confirmChannel, siteInfo } from "@/data/site";
import { getProducts } from "@/lib/products.functions";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/shop")({
  head: () =>
    pageHead({
      title: "Shop Coffee | Jowam Coffee Roasters",
      description: "Buy Jowam's freshly roasted Kenyan specialty coffee online, with whole bean and ground options delivered across Nairobi.",
      path: "/shop",
      ogTitle: "Shop Jowam Coffee",
      ogDescription: "Freshly roasted Kenyan specialty coffee and coffee goods from our Lavington roastery.",
      image: heroImage,
      imageAlt: "Jowam coffee bags lined up on the café counter",
    }),
  loader: () => getProducts(),
  component: ShopPage,
});

const assurances = [
  { title: "Roasted to order", body: "Every bag is roasted in small batches at our Lavington roastery and rested, never stockpiled." },
  { title: "Kenyan single origins", body: "We buy from washing stations and smallholder groups whose work we can trace and taste." },
  { title: "Nairobi delivery", body: `Order here and we confirm delivery or collection with you by ${confirmChannel}.` },
];

function ShopPage() {
  const products = Route.useLoaderData();

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-screen-2xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 lg:py-20">
          <div className="max-w-xl">
            <p className="eyebrow">Shop Jowam</p>
            <h1 className="mt-5 font-display text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">Coffee to take home.</h1>
            <p className="mt-7 text-lg leading-8 text-muted-foreground">
              The same coffee we brew at Lavington Mall, roasted in small batches and packed for your kitchen.
              Choose a bag, pick your grind and we’ll handle the rest.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg"><a href="#all-coffee">Browse coffee</a></Button>
              <Button asChild variant="outline" size="lg"><Link to="/coffee">How we roast</Link></Button>
            </div>
          </div>
          <div className="aspect-[4/5] max-h-[70vh] overflow-hidden">
            <Image src={heroImage} alt="Jowam coffees from Bungoma, Nyeri, Meru, Murang'a and Kirinyaga lined up on the café counter" width={1116} height={1200} priority sizes="(max-width: 1024px) 100vw, 55vw" />
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="all-coffee" className="mx-auto max-w-screen-2xl scroll-mt-28 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <SectionIntro
          eyebrow="Current releases"
          title="Freshly roasted, ready to brew."
          body={`Bags are roasted to order. Pick what you like and we confirm delivery and payment by ${confirmChannel}.`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Questions about an order? Email{" "}
          <a href={`mailto:${siteInfo.contact.sales}`} className="underline underline-offset-4">
            {siteInfo.contact.sales}
          </a>
          .
        </p>

        <div className="mt-14">
          {products.length === 0 ? (
            <div className="border-t border-border py-16 text-center">
              <h3 className="font-display text-4xl">The shop is being restocked</h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                Pop into the café at Lavington Mall and we’ll tell you what’s on the roaster this
                week. You can buy a bag at the counter.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                {siteInfo.contact.whatsapp && (
                  <Button asChild>
                    <a href={`https://wa.me/${siteInfo.contact.whatsapp}`}>Order on WhatsApp</a>
                  </Button>
                )}
                <Button asChild variant="outline">
                  <Link to="/visit">Visit the café</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.handle} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Assurances */}
      <section className="border-y border-ink/15 bg-paper-deep">
        <div className="mx-auto max-w-screen-2xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-10 md:grid-cols-3">
            {assurances.map((item) => (
              <div key={item.title} className="border-t border-ink/20 pt-5">
                <h3 className="font-display text-3xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale cross-sell */}
      <section className="mx-auto max-w-screen-2xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="aspect-[5/4] overflow-hidden">
            <Image src={lineupImage} alt="Bags of Jowam coffee lined up at the café bar with a takeaway cup" width={1200} height={942} />
          </div>
          <div className="max-w-xl">
            <p className="eyebrow">Buying for a team</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">Coffee for cafés, offices and kitchens.</h2>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              We supply businesses across Nairobi with the same coffee we pour at the café. Tell us what you
              serve and how much you use, and we’ll suggest coffees to taste.
            </p>
            <div className="mt-7"><TextLink to="/wholesale">Wholesale with Jowam</TextLink></div>
          </div>
        </div>
      </section>
    </main>
  );
}
