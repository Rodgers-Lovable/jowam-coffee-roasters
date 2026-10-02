import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/jowam-hospitality-hero.jpg";
import pastaImage from "@/assets/jowam-pasta.jpg";
import burgerImage from "@/assets/jowam-burger.jpg";
import roasteryImage from "@/assets/jowam-roastery.jpg";
import baristaImage from "@/assets/jowam-barista.jpg";
import cafeImage from "@/assets/jowam-cafe-interior.jpg";
import cuppingImage from "@/assets/jowam-cupping-table.jpg";
import originImage from "@/assets/jowam-origin-kenya.jpg";
import { Button } from "@/components/ui/button";
import { Image, SectionIntro, TextLink } from "@/components/jowam/editorial";
import { FeaturedCoffees } from "@/components/jowam/featured-coffees";
import { GoogleReviews } from "@/components/jowam/google-reviews";
import { LocationMap } from "@/components/jowam/location-map";
import { siteInfo } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jowam Coffee Roasters | Café and Coffee Roastery in Lavington, Nairobi" },
      {
        name: "description",
        content:
          "Café and coffee roastery at Lavington Mall, Nairobi. Breakfast, burgers, steaks and Kenyan classics, plus Kenyan coffee we roast ourselves, by the cup or by the bag.",
      },
      { property: "og:title", content: "Jowam Coffee Roasters" },
      {
        property: "og:description",
        content:
          "Coffee, food and good company at Lavington Mall, with Kenyan coffee we roast ourselves.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-ink text-ink-foreground">
        <Image
          src={heroImage}
          alt="Friends sharing coffee and brunch in a warm contemporary café"
          width={1600}
          height={1072}
          priority
          sizes="100vw"
          className="hero-image absolute inset-0"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-screen-2xl flex-col justify-end px-5 pb-10 sm:px-8 sm:pb-14 lg:px-12">
          <p className="eyebrow mb-5 text-ink-foreground/80">Coffee · Food · Good company</p>
          <h1 className="max-w-4xl font-display text-6xl leading-[0.88] sm:text-8xl lg:text-[7.5rem]">
            Come for coffee.
            <br />
            <em>Stay awhile.</em>
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/menu">Explore menu</Link>
            </Button>
            <Button asChild variant="heroOutline" size="lg">
              <Link to="/visit">Visit us</Link>
            </Button>
          </div>
          <a
            href="#welcome"
            aria-label="Continue to welcome section"
            className="absolute bottom-9 right-5 hidden rounded-full border border-ink-foreground/50 p-3 sm:block lg:right-12"
          >
            <ArrowDown />
          </a>
        </div>
      </section>

      <section
        id="welcome"
        className="mx-auto grid max-w-screen-2xl gap-12 px-5 py-24 sm:px-8 md:py-36 lg:grid-cols-[1.1fr_0.9fr] lg:px-12"
      >
        <div className="self-center">
          <p className="eyebrow">A place to be</p>
          <h2 className="mt-5 max-w-4xl font-display text-5xl leading-[0.98] sm:text-7xl">
            Made for mornings that become afternoons.
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
            Come in for an early espresso, stay for breakfast, and nobody will mind if you are still
            at the table at lunch. We open at 7:15 am from Monday to Saturday (9 am on Sundays).
          </p>
        </div>
        <div className="aspect-[4/5] overflow-hidden lg:mt-20">
          <Image
            src={cafeImage}
            alt="A lively café filled with guests talking over coffee"
            width={1600}
            height={1072}
            className="object-[56%_center]"
          />
        </div>
      </section>

      <section className="bg-paper-deep py-24 md:py-32">
        <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="aspect-[4/5] overflow-hidden">
              <Image
                src={pastaImage}
                alt="A plate of pasta with parmesan and parsley at the café"
                width={766}
                height={768}
              />
            </div>
            <div className="flex flex-col justify-between py-2 lg:py-12">
              <SectionIntro
                eyebrow="From our kitchen"
                title="Good things on the table."
                body="Full breakfasts, burgers, steaks, pizza, Indian curries and Kenyan classics like pilau and kienyeji chicken. It is a proper kitchen, not just a coffee counter."
              />
              <div className="mt-12 grid grid-cols-2 gap-y-3 border-t border-foreground/25 pt-6 text-sm sm:grid-cols-4">
                <span>Breakfast</span>
                <span>Burgers & steaks</span>
                <span>Kenyan classics</span>
                <span>Indian corner</span>
              </div>
              <div className="mt-9">
                <TextLink to="/menu">Explore menu</TextLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-screen-2xl lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-24 sm:px-8 lg:px-12">
            <p className="eyebrow text-ink-foreground/55">Behind every cup</p>
            <h2 className="mt-5 max-w-xl font-display text-6xl leading-[0.9] sm:text-7xl">
              We serve coffee.
              <br />
              <em>We roast it too.</em>
            </h2>
            <p className="mt-7 max-w-lg leading-7 text-ink-foreground/70">
              Every espresso and filter at the bar is roasted by our own team, using coffee from
              Bungoma, Nyeri, Meru, Murang’a and Kirinyaga.
            </p>
            <div className="mt-8">
              <TextLink to="/coffee" inverse>
                Explore our coffee
              </TextLink>
            </div>
          </div>
          <div className="min-h-[35rem]">
            <Image
              src={roasteryImage}
              alt="A coffee roaster guiding freshly roasted beans into a cooling tray"
              width={1600}
              height={1072}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-5 py-24 sm:px-8 md:py-32 lg:px-12">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <SectionIntro
            eyebrow="Currently roasting"
            title="Coffee with a sense of place."
            body="Kenyan coffees from the shop, roasted in small batches. Order a bag for collection or delivery in Nairobi."
          />
          <TextLink to="/shop">Shop all coffee</TextLink>
        </div>
        <div className="mt-14">
          <FeaturedCoffees />
        </div>
      </section>

      <section className="relative min-h-[75svh] overflow-hidden bg-ink text-ink-foreground">
        <Image
          src={baristaImage}
          alt="A barista carefully pouring latte art at the café counter"
          width={1200}
          height={1504}
          sizes="100vw"
          className="absolute inset-0 object-[center_38%]"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative mx-auto flex min-h-[75svh] max-w-screen-2xl items-end px-5 py-14 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <p className="eyebrow text-ink-foreground/70">The people of Jowam</p>
            <h2 className="mt-4 font-display text-5xl leading-none sm:text-7xl">
              Care is the craft.
            </h2>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-screen-2xl gap-10 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[1.3fr_0.7fr] lg:px-12">
        <LocationMap className="aspect-[3/2] w-full" />
        <div className="flex flex-col justify-center">
          <p className="eyebrow">Visit Jowam</p>
          <h2 className="mt-4 font-display text-5xl sm:text-6xl">Your table is waiting.</h2>
          <p className="mt-6 text-muted-foreground">
            {siteInfo.addressLine}, {siteInfo.city}
          </p>
          <dl className="mt-7 divide-y divide-border border-y border-border py-2 text-sm">
            {siteInfo.hours.map((entry) => (
              <div key={entry.day} className="flex justify-between gap-5 py-2">
                <dt className="text-muted-foreground">{entry.day}</dt>
                <dd className="tabular-nums">{entry.time}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteInfo.mapsQuery)}`}
                target="_blank"
                rel="noreferrer"
              >
                Get directions
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/visit">Visit us</Link>
            </Button>
          </div>
        </div>
      </section>

      <GoogleReviews tone="deep" />

      <section className="bg-paper-deep">
        <div className="mx-auto grid max-w-screen-2xl gap-10 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:px-12">
          <div className="aspect-[4/3] overflow-hidden">
            <Image
              src={cuppingImage}
              alt="Cupping bowls set out on a table for a coffee tasting"
              width={868}
              height={980}
            />
          </div>
          <div className="flex flex-col justify-center lg:px-12">
            <SectionIntro
              eyebrow="Experiences & education"
              title="Taste. Ask. Discover."
              body="We are planning cuppings, roastery visits and brewing workshops for anyone curious about coffee. Register your interest and we will tell you when dates are set."
            />
            <div className="mt-8">
              <TextLink to="/experiences">See what we are planning</TextLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-olive text-ink-foreground">
        <div className="mx-auto grid max-w-screen-2xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div className="flex flex-col justify-center">
            <p className="eyebrow text-ink-foreground/65">Serve Jowam at your place</p>
            <h2 className="mt-5 font-display text-5xl leading-none sm:text-7xl">
              Coffee for good hospitality.
            </h2>
            <p className="mt-7 max-w-lg leading-7 text-ink-foreground/75">
              We supply cafés, restaurants, hotels and offices with the same coffee we serve at our
              own bar. Tell us about your place and we will set up a tasting.
            </p>
            <div className="mt-8">
              <TextLink to="/wholesale" inverse>
                Partner with Jowam
              </TextLink>
            </div>
          </div>
          <div className="aspect-[3/2] overflow-hidden">
            <Image
              src={cafeImage}
              alt="Coffee being enjoyed in an active hospitality setting"
              width={1600}
              height={1072}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-5 py-24 sm:px-8 md:py-32 lg:px-12">
        <SectionIntro eyebrow="Life at Jowam" title="Coffee is only part of the story." />
        <div className="mt-12 grid auto-rows-[15rem] grid-cols-2 gap-3 md:auto-rows-[20rem] md:grid-cols-4">
          <div className="col-span-2 row-span-2 overflow-hidden">
            <Image src={heroImage} alt="Friends sharing a café table" width={1600} height={1072} />
          </div>
          <div className="overflow-hidden">
            <Image
              src={burgerImage}
              alt="A bacon cheeseburger with fries"
              width={868}
              height={584}
            />
          </div>
          <div className="row-span-2 overflow-hidden">
            <Image
              src={originImage}
              alt="Coffee cherries being selected in the Kenyan highlands"
              width={1600}
              height={1072}
            />
          </div>
          <div className="overflow-hidden">
            <Image src={baristaImage} alt="Barista preparing a coffee" width={1200} height={1504} />
          </div>
        </div>
        <div className="mt-7">
          <TextLink to="/visit">Come and see for yourself</TextLink>
        </div>
      </section>
    </main>
  );
}
