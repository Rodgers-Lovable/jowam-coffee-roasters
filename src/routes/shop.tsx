import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import heroImage from "@/assets/jowam-coffee-products.jpg";
import roasteryImage from "@/assets/jowam-roastery.jpg";
import { Image, SectionIntro, TextLink } from "@/components/jowam/editorial";
import { ProductCard } from "@/components/jowam/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProducts } from "@/lib/shopify";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Coffee | Jowam Coffee Roasters" },
      { name: "description", content: "Buy Jowam's freshly roasted Kenyan specialty coffee online, with whole bean and ground options delivered across Nairobi." },
      { property: "og:title", content: "Shop Jowam Coffee" },
      { property: "og:description", content: "Freshly roasted Kenyan specialty coffee and coffee goods from our Lavington roastery." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/shop" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});

const assurances = [
  { title: "Roasted to order", body: "Every bag is roasted in small batches at our Lavington roastery and rested, never stockpiled." },
  { title: "Kenyan single origins", body: "We buy from washing stations and smallholder groups whose work we can trace and taste." },
  { title: "Nairobi delivery", body: "Delivery options and timelines are shown at checkout. Collection at the café is available too." },
];

function ProductGridSkeleton() {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="border-t border-border pt-5">
          <Skeleton className="aspect-[4/5] w-full rounded-none" />
          <Skeleton className="mt-5 h-7 w-2/3 rounded-none" />
          <Skeleton className="mt-3 h-4 w-full rounded-none" />
          <Skeleton className="mt-2 h-4 w-4/5 rounded-none" />
        </div>
      ))}
    </div>
  );
}

function ShopPage() {
  const { data: products, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["shopify-products"],
    queryFn: () => fetchProducts(24),
    staleTime: 5 * 60 * 1000,
  });

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
              Choose a bag, pick your grind, and we will handle the rest.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg"><a href="#all-coffee">Browse coffee</a></Button>
              <Button asChild variant="outline" size="lg"><Link to="/coffee">Our roasting</Link></Button>
            </div>
          </div>
          <div className="aspect-[4/5] max-h-[70vh] overflow-hidden">
            <Image src={heroImage} alt="Bags of Jowam roasted specialty coffee" width={1200} height={1500} priority sizes="(max-width: 1024px) 100vw, 55vw" />
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="all-coffee" className="mx-auto max-w-screen-2xl scroll-mt-28 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <SectionIntro
          eyebrow="Current releases"
          title="Freshly roasted, ready to brew."
          body="Bags are roasted to order. Prices, grind options and availability come straight from our store."
        />

        <div className="mt-14">
          {isLoading ? (
            <ProductGridSkeleton />
          ) : isError ? (
            <div className="border-t border-border py-16 text-center">
              <h3 className="font-display text-4xl">We couldn't load the coffee just now.</h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                Something interrupted the connection to our store. Please try again in a moment.
              </p>
              <Button className="mt-7" onClick={() => refetch()} disabled={isFetching}>
                {isFetching ? <Loader2 className="size-4 animate-spin" /> : "Try again"}
              </Button>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="border-t border-border py-16 text-center">
              <h3 className="font-display text-4xl">No products found</h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                Our online shop is being stocked. In the meantime, come and buy a bag at the café in Lavington Mall.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild><Link to="/visit">Visit the café</Link></Button>
                <Button asChild variant="outline"><Link to="/coffee">See our coffees</Link></Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
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
            <Image src={roasteryImage} alt="Coffee being roasted at the Jowam roastery" width={1200} height={960} />
          </div>
          <div className="max-w-xl">
            <p className="eyebrow">Buying for a team</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">Coffee for cafés, offices and kitchens.</h2>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              We roast for businesses across Nairobi, with training and brewing support to match. Tell us what you
              pour and we will build a programme around it.
            </p>
            <div className="mt-7"><TextLink to="/wholesale">Wholesale with Jowam</TextLink></div>
          </div>
        </div>
      </section>
    </main>
  );
}
