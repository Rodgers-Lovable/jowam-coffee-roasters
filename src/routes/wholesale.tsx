import { createFileRoute, Link } from "@tanstack/react-router";
import { BedDouble, Building2, ConciergeBell, Coffee, UtensilsCrossed } from "lucide-react";
import baristaImage from "@/assets/jowam-barista.jpg";
import portafiltersImage from "@/assets/jowam-portafilters.jpg";
import cafeImage from "@/assets/jowam-cafe-interior.jpg";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Image, SectionIntro, TextLink } from "@/components/jowam/editorial";
import { EnquiryForm, type EnquiryField } from "@/components/jowam/enquiry-form";
import { FeaturedCoffees } from "@/components/jowam/featured-coffees";
import {
  wholesaleCategories,
  wholesaleFaqs,
  wholesalePrinciples,
  wholesaleSteps,
  wholesaleVolumes,
} from "@/data/jowam";

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: "Wholesale Coffee | Jowam Coffee Roasters" },
      {
        name: "description",
        content:
          "Wholesale Kenyan coffee for cafés, restaurants, hotels and offices in Nairobi, roasted by the team behind Jowam café at Lavington Mall.",
      },
      { property: "og:title", content: "Wholesale Coffee | Jowam" },
      { property: "og:description", content: "Serve the coffee we roast and pour at our own café." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/wholesale" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/wholesale" }],
  }),
  component: WholesalePage,
});

const categoryIcons = [Coffee, UtensilsCrossed, BedDouble, Building2, ConciergeBell];

const enquiryFields: EnquiryField[] = [
  { type: "text", name: "name", label: "Your name", required: true },
  { type: "text", name: "business", label: "Business name", required: true },
  { type: "email", name: "email", label: "Email", required: true },
  { type: "tel", name: "phone", label: "Phone" },
  {
    type: "select",
    name: "businessType",
    label: "Type of business",
    options: wholesaleCategories,
    required: true,
  },
  { type: "text", name: "location", label: "Location", placeholder: "Area, city" },
  {
    type: "select",
    name: "volume",
    label: "Roughly how much coffee you use a week",
    options: wholesaleVolumes,
    wide: true,
  },
  {
    type: "textarea",
    name: "message",
    label: "Tell us about your place",
    placeholder: "What you serve, how you brew, what you’re looking for",
  },
];

function WholesalePage() {
  return (
    <main>
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-ink text-ink-foreground">
        <Image
          src={baristaImage}
          alt="A barista preparing specialty coffee in a busy hospitality setting"
          width={1200}
          height={1504}
          priority
          sizes="100vw"
          className="absolute inset-0 object-[center_35%]"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-screen-2xl flex-col justify-end px-5 pb-14 sm:px-8 lg:px-12">
          <p className="eyebrow text-ink-foreground/70">Wholesale</p>
          <h1 className="mt-4 font-display text-7xl leading-[0.88] sm:text-8xl lg:text-[8.5rem]">
            Serve
            <br />
            <em>Jowam.</em>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-7 text-ink-foreground/80">
            Coffee for good hospitality, roasted by people who run a café of their own.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <a href="#enquire">Start a conversation</a>
            </Button>
            <Button asChild variant="heroOutline" size="lg">
              <Link to="/coffee">Explore our coffee</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-screen-2xl gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
        <div>
          <p className="eyebrow">Who we work with</p>
          <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
            For places where people gather.
          </h2>
        </div>
        <ul className="border-t border-foreground/25">
          {wholesaleCategories.map((category, i) => {
            const Icon = categoryIcons[i] ?? Coffee;
            return (
              <li
                key={category}
                className="flex items-center justify-between gap-6 border-b border-foreground/25 py-5 sm:py-6"
              >
                <span className="font-display text-4xl sm:text-5xl">{category}</span>
                <Icon className="size-6 shrink-0 text-olive" aria-hidden />
              </li>
            );
          })}
        </ul>
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-screen-2xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-h-[28rem] lg:min-h-[44rem]">
            <Image
              src={portafiltersImage}
              alt="Two portafilters, one with whole beans and one with freshly ground coffee"
              width={866}
              height={1126}
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
          <div className="flex flex-col justify-center px-5 py-20 sm:px-8 lg:px-16">
            <p className="eyebrow text-ink-foreground/55">Why Jowam</p>
            <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
              The same coffee
              <br />
              <em>we pour ourselves.</em>
            </h2>
            <div className="mt-12 divide-y divide-ink-foreground/20 border-y border-ink-foreground/20">
              {wholesalePrinciples.map((p) => (
                <article key={p.title} className="py-6">
                  <h3 className="font-display text-2xl sm:text-3xl">{p.title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-ink-foreground/70">{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-5 py-24 sm:px-8 md:py-32 lg:px-12">
        <SectionIntro
          eyebrow="How it works"
          title="From first cup to every morning."
          body="It starts with a chat and a tasting. No forms to sign before you know you like the coffee."
        />
        <ol className="mt-16 grid border-t border-border md:grid-cols-4">
          {wholesaleSteps.map((s, i) => (
            <li
              key={s.title}
              className="border-b border-border py-7 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
            >
              <p className="text-xs text-cherry">0{i + 1}</p>
              <h3 className="mt-8 font-display text-3xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-paper-deep">
        <div className="mx-auto max-w-screen-2xl px-5 py-24 sm:px-8 md:py-32 lg:px-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionIntro
              eyebrow="Currently roasting"
              title="Coffees for your bar."
              body="These are the coffees in our retail shop right now. Wholesale prices and bag sizes are shared when you enquire."
            />
            <TextLink to="/coffee">Our approach to coffee</TextLink>
          </div>
          <div className="mt-12">
            <FeaturedCoffees />
          </div>
        </div>
      </section>

      <section className="relative min-h-[60svh] overflow-hidden bg-ink text-ink-foreground">
        <Image
          src={cafeImage}
          alt="Guests enjoying coffee in a lively café"
          width={1600}
          height={1072}
          sizes="100vw"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative mx-auto flex min-h-[60svh] max-w-screen-2xl items-center justify-center px-5 text-center sm:px-8 lg:px-12">
          <p className="max-w-4xl font-display text-5xl leading-[1.02] sm:text-7xl">
            Good coffee is part of <em>good hospitality.</em>
          </p>
        </div>
      </section>

      <section id="enquire" className="scroll-mt-20 bg-olive text-ink-foreground">
        <div className="mx-auto grid max-w-screen-2xl gap-14 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div>
            <p className="eyebrow text-ink-foreground/65">Start a conversation</p>
            <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
              Tell us about your place.
            </h2>
            <p className="mt-6 max-w-md leading-7 text-ink-foreground/75">
              Share a few details and we’ll be in touch to arrange a tasting and talk through what
              would suit your service.
            </p>
          </div>
          <EnquiryForm
            inverse
            fields={enquiryFields}
            submitLabel="Send enquiry"
            subject={(v) => `Wholesale enquiry: ${String(v["business"] ?? "")}`}
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-screen-2xl gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
        <div>
          <p className="eyebrow">Questions</p>
          <h2 className="mt-4 font-display text-5xl leading-none">Good to know.</h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
            Pricing and terms depend on what you need, so we share them after we talk.
          </p>
        </div>
        <Accordion type="single" collapsible className="border-t border-border">
          {wholesaleFaqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="py-6 text-left font-display text-2xl font-normal hover:no-underline sm:text-3xl">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-base leading-7 text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}
