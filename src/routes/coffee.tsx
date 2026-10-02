import { createFileRoute, Link } from "@tanstack/react-router";
import roasteryImage from "@/assets/jowam-roastery.jpg";
import originImage from "@/assets/jowam-origin-kenya.jpg";
import baristaImage from "@/assets/jowam-barista.jpg";
import cuppingImage from "@/assets/jowam-cupping-table.jpg";
import productsImage from "@/assets/jowam-bags-black-coffee.jpg";
import { Button } from "@/components/ui/button";
import { Image, SectionIntro, TextLink } from "@/components/jowam/editorial";
import { FeaturedCoffees } from "@/components/jowam/featured-coffees";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/coffee")({
  head: () =>
    pageHead({
      title: "Our Coffee | Jowam Coffee Roasters",
      description: "How Jowam sources and roasts Kenyan coffee from Bungoma, Nyeri, Meru, Murang’a and Kirinyaga, and how to pick one you will enjoy.",
      path: "/coffee",
      ogDescription: "Kenyan coffee, roasted by Jowam in Nairobi.",
      image: roasteryImage,
      imageAlt: "Coffee roasting at the Jowam drum roaster",
    }),
  component: CoffeePage,
});

const principles = [
  {
    n: "01",
    title: "Origin",
    body: "The farm, the farmers and the growing conditions set what a coffee can taste like.",
  },
  {
    n: "02",
    title: "Quality",
    body: "We buy coffee that tastes clean and distinct, and that we want to drink every day.",
  },
  {
    n: "03",
    title: "Roasting",
    body: "Small batches, adjusted for each coffee, so the roast supports the flavour instead of hiding it.",
  },
  {
    n: "04",
    title: "Brewing",
    body: "Good coffee can still be ruined in the cup. We care about how it is made at the bar and at home.",
  },
];
const processes = [
  {
    title: "Washed",
    body: "The fruit is removed before the beans dry. This usually gives a clean, bright cup, and it is how most Kenyan coffee is processed.",
  },
  {
    title: "Natural",
    body: "The beans dry inside the whole cherry. Expect more sweetness, heavier body and obvious fruit flavours.",
  },
  {
    title: "Honey",
    body: "Some of the sticky fruit stays on while the beans dry. The result sits between washed and natural.",
  },
  {
    title: "Experimental",
    body: "Producers play with fermentation times and conditions. Results vary a lot, so we taste each one before we buy.",
  },
];
const flavours = [
  {
    title: "Bright & fruity",
    notes: "Citrus · Berries · Floral",
    tone: "bg-cherry text-ink-foreground",
  },
  {
    title: "Sweet & balanced",
    notes: "Honey · Caramel · Stone fruit",
    tone: "bg-paper-deep text-foreground",
  },
  {
    title: "Rich & comforting",
    notes: "Chocolate · Nuts · Cocoa",
    tone: "bg-olive text-ink-foreground",
  },
];

function CoffeePage() {
  return (
    <main>
      <section className="relative min-h-[78svh] overflow-hidden bg-ink text-ink-foreground">
        <Image
          src={roasteryImage}
          alt="Coffee roasting in progress at a drum roaster"
          width={1600}
          height={1072}
          priority
          sizes="100vw"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative mx-auto flex min-h-[78svh] max-w-screen-2xl flex-col justify-end px-5 py-14 sm:px-8 lg:px-12">
          <p className="eyebrow text-ink-foreground/70">Kenyan coffee, roasted in Nairobi</p>
          <h1 className="mt-4 max-w-5xl font-display text-7xl leading-[0.88] sm:text-8xl lg:text-[7rem]">
            Coffee,
            <br />
            <em>our way.</em>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-7 text-ink-foreground/75">
            Kenyan coffee from five growing regions, roasted by us.
          </p>
          <div className="mt-8">
            <Button asChild variant="hero" size="lg">
              <Link to="/shop">Shop coffee</Link>
            </Button>
          </div>
        </div>
      </section>
      <nav
        className="sticky top-20 z-40 border-b border-border bg-background/95 backdrop-blur"
        aria-label="Coffee page sections"
      >
        <div className="mx-auto flex max-w-screen-2xl gap-7 overflow-x-auto px-5 py-4 sm:px-8 lg:px-12">
          {[
            ["Our coffee", "specialty"],
            ["Sourcing", "origin"],
            ["The roastery", "roastery"],
            ["Brewing", "brewing"],
            ["Experiences", "experiences"],
          ].map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em]"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section
        id="specialty"
        className="mx-auto max-w-screen-2xl scroll-mt-36 px-5 py-24 sm:px-8 md:py-32 lg:px-12"
      >
        <SectionIntro
          eyebrow="Specialty, made simple"
          title="Better coffee begins long before the first sip."
          body="Specialty coffee is graded for quality and handled carefully at every step from farm to cup. Our job is to keep what makes each coffee different and make sure it tastes good when you drink it."
        />
        <div className="mt-16 grid border-t border-border md:grid-cols-4">
          {principles.map((p) => (
            <article
              key={p.n}
              className="border-b border-border py-7 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
            >
              <p className="text-xs text-cherry">{p.n}</p>
              <h3 className="mt-8 font-display text-3xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="origin" className="scroll-mt-36 bg-paper-deep">
        <div className="mx-auto grid max-w-screen-2xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="min-h-136">
            <Image
              src={originImage}
              alt="Ripe coffee cherries being selected in the Kenyan highlands"
              width={1600}
              height={1072}
            />
          </div>
          <div className="flex flex-col justify-center px-5 py-20 sm:px-8 lg:px-14">
            <p className="eyebrow">Coffee from Kenya</p>
            <h2 className="mt-4 font-display text-6xl leading-[0.95]">Place shapes flavour.</h2>
            <p className="mt-6 leading-7 text-muted-foreground">
              Altitude, variety, soil, rainfall and processing all show up in the cup. Kenyan coffee
              is known for bright acidity, sweetness and fruit, and the differences between counties
              are worth tasting side by side.
            </p>
            <p className="mt-5 leading-7 text-muted-foreground">
              Our current bags come from five growing areas.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 text-sm">
              {["Bungoma", "Nyeri", "Meru", "Murang’a", "Kirinyaga"].map((region) => (
                <span key={region} className="border-t border-foreground/30 pt-3">
                  {region}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper-deep py-24 md:py-32">
        <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12">
          <SectionIntro
            eyebrow="Same cherry. Different results."
            title="Processing changes the cup."
            body="What happens to the coffee cherry after picking affects sweetness, body and aroma. Here is the short version."
          />
          <div className="mt-14 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {processes.map((p, i) => (
              <article
                key={p.title}
                className="grid grid-cols-[auto_1fr] gap-5 border-t border-foreground/25 pt-5"
              >
                <span className="font-display text-2xl">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-3xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{p.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="roastery" className="scroll-mt-36 bg-ink text-ink-foreground">
        <div className="mx-auto max-w-screen-2xl">
          <div className="aspect-16/7 min-h-100 overflow-hidden">
            <Image
              src={roasteryImage}
              alt="Freshly roasted coffee entering a cooling tray"
              width={1600}
              height={1072}
              sizes="100vw"
            />
          </div>
          <div className="grid gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:px-12">
            <h2 className="font-display text-7xl leading-[0.88] sm:text-8xl">
              Roasted
              <br />
              <em>here.</em>
            </h2>
            <div>
              <p className="text-lg leading-8 text-ink-foreground/75">
                Every coffee behaves a little differently in the roaster. We adjust each batch by
                taste, so a Nyeri and a Bungoma taste like themselves even at the same roast level.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-5 py-24 sm:px-8 md:py-32 lg:px-12">
        <SectionIntro
          eyebrow="Find your cup"
          title="Start with flavour."
          body="You don’t need a tasting vocabulary to know what you like. Pick the one that sounds good and ask us for a coffee to match."
        />
        <div className="mt-12 grid md:grid-cols-3">
          {flavours.map((f) => (
            <article
              key={f.title}
              className={`flex min-h-72 flex-col justify-between p-8 ${f.tone}`}
            >
              <h3 className="font-display text-4xl">{f.title}</h3>
              <p className="text-sm">{f.notes}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-paper-deep">
        <div className="mx-auto max-w-screen-2xl px-5 py-24 sm:px-8 md:py-32 lg:px-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionIntro
              eyebrow="Currently roasting"
              title="Meet the coffees."
              body="What is in the shop right now. Each bag is roasted in small batches and can be ground for your brewer."
            />
            <TextLink to="/shop">Shop all coffee</TextLink>
          </div>
          <div className="mt-12">
            <FeaturedCoffees />
          </div>
        </div>
      </section>

      <section
        id="brewing"
        className="mx-auto grid max-w-screen-2xl scroll-mt-36 gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-12"
      >
        <div className="aspect-4/3 overflow-hidden">
          <Image
            src={productsImage}
            alt="A cup of black coffee beside bags of Jowam coffee and roasted beans"
            width={870}
            height={470}
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="eyebrow">Brewing</p>
          <h2 className="mt-4 font-display text-5xl">A good coffee, your way.</h2>
          <div className="mt-7 grid grid-cols-2 gap-3 border-y border-border py-5 text-sm">
            <span>V60</span>
            <span>Chemex</span>
            <span>Aeropress</span>
            <span>French press</span>
          </div>
          <p className="mt-6 leading-7 text-muted-foreground">
            We brew all four by hand at the bar. Order one, watch how it’s made and ask the barista
            for the grind and ratio. Then try it with a bag at home.
          </p>
        </div>
      </section>

      <section className="bg-paper-deep">
        <div className="mx-auto grid max-w-screen-2xl lg:grid-cols-2">
          <div className="min-h-136">
            <Image
              src={baristaImage}
              alt="A barista pouring a coffee in the café"
              width={1200}
              height={1504}
            />
          </div>
          <div className="flex flex-col justify-center px-5 py-20 sm:px-8 lg:px-14">
            <p className="eyebrow">Coffee at the café</p>
            <h2 className="mt-4 font-display text-6xl leading-none">
              Taste it before you take it home.
            </h2>
            <p className="mt-6 leading-7 text-muted-foreground">
              Not sure which bag to buy? Ask the barista what is on espresso and filter today and
              try a cup first.
            </p>
            <div className="mt-8">
              <TextLink to="/menu">View menu</TextLink>
            </div>
          </div>
        </div>
      </section>

      <section
        id="experiences"
        className="mx-auto grid max-w-screen-2xl scroll-mt-36 gap-10 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:px-12"
      >
        <div className="flex flex-col justify-center">
          <p className="eyebrow">Go deeper</p>
          <h2 className="mt-4 font-display text-6xl">Coffee is better shared.</h2>
          <p className="mt-6 leading-7 text-muted-foreground">
            We are planning cuppings, roastery visits and workshops where you can taste, compare and
            ask all the questions you like.
          </p>
          <div className="mt-8">
            <TextLink to="/experiences">Register your interest</TextLink>
          </div>
        </div>
        <div className="aspect-4/3 overflow-hidden">
          <Image
            src={cuppingImage}
            alt="Cupping bowls set out on a table for a Jowam coffee tasting"
            width={868}
            height={980}
          />
        </div>
      </section>
    </main>
  );
}
