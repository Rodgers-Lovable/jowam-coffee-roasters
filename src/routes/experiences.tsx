import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import cuppingImage from "@/assets/jowam-cupping-table.jpg";
import roasteryImage from "@/assets/jowam-roastery.jpg";
import productsImage from "@/assets/jowam-portafilters.jpg";
import baristaImage from "@/assets/jowam-barista.jpg";
import { Button } from "@/components/ui/button";
import { Image, SectionIntro } from "@/components/jowam/editorial";
import { EnquiryForm, type EnquiryField } from "@/components/jowam/enquiry-form";
import { experienceFormats, experienceInterests } from "@/data/jowam";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/experiences")({
  head: () =>
    pageHead({
      title: "Coffee Experiences & Training | Jowam Coffee Roasters",
      description: "Cuppings, roastery visits, brewing workshops and barista training planned by Jowam Coffee Roasters in Nairobi. Register to hear about dates first.",
      path: "/experiences",
      ogTitle: "Coffee Experiences & Training | Jowam",
      ogDescription: "Taste. Ask. Discover. Coffee experiences at Jowam.",
      image: cuppingImage,
      imageAlt: "Cupping bowls set out for a coffee tasting",
    }),
  component: ExperiencesPage,
});

const images = {
  cupping: {
    src: cuppingImage,
    alt: "Cupping bowls set out on a table for a coffee tasting",
    width: 868,
    height: 980,
  },
  roastery: {
    src: roasteryImage,
    alt: "Freshly roasted coffee pouring into the cooling tray",
    width: 1600,
    height: 1072,
  },
  products: {
    src: productsImage,
    alt: "Two portafilters, one with whole beans and one with freshly ground coffee",
    width: 866,
    height: 1126,
  },
  barista: {
    src: baristaImage,
    alt: "A barista pouring milk into an espresso at the bar",
    width: 1200,
    height: 1504,
  },
} as const;

const expectations = [
  { title: "No experience needed", body: "Every session starts from the basics. Come with questions." },
  { title: "Small groups", body: "Few enough people that everyone gets to taste, ask and try." },
  { title: "Real coffee, real equipment", body: "You work with the coffees and gear we use at the café every day." },
] as const;

const registerFields: EnquiryField[] = [
  { type: "text", name: "name", label: "Your name", required: true },
  { type: "email", name: "email", label: "Email", required: true },
  { type: "tel", name: "phone", label: "Phone", wide: true },
  {
    type: "radio",
    name: "interest",
    label: "I’m interested in",
    options: experienceInterests,
    required: true,
  },
  {
    type: "checkboxes",
    name: "days",
    label: "Days that suit you",
    options: ["Weekdays", "Weekends"],
  },
  {
    type: "textarea",
    name: "notes",
    label: "Anything else",
    placeholder: "Group size, experience level, dates in mind",
  },
];

const PRIVATE_EVENT = "Private or team event";

function ExperiencesPage() {
  const [preset, setPreset] = useState<Record<string, string>>();
  return (
    <main>
      <section className="mx-auto grid max-w-screen-2xl gap-10 px-5 py-12 sm:px-8 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-12">
        <div className="max-w-xl">
          <p className="eyebrow">Experiences & training</p>
          <h1 className="mt-5 font-display text-7xl leading-[0.88] sm:text-8xl">
            Taste. Ask.
            <br />
            <em>Discover.</em>
          </h1>
          <p className="mt-7 text-lg leading-8 text-muted-foreground">
            We’re putting together cuppings, roastery visits and hands-on sessions for anyone who
            wants to know a bit more about what’s in the cup. Register and we’ll tell you when the
            first dates are set.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#register">Register interest</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/coffee">See the coffee</Link>
            </Button>
          </div>
        </div>
        <div className="aspect-[4/3] overflow-hidden lg:aspect-[4/5] lg:max-h-[78vh]">
          <Image
            src={cuppingImage}
            alt="Cupping bowls set out on a table for a coffee tasting"
            width={868}
            height={980}
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 md:py-36">
        <p className="font-display text-4xl leading-[1.1] sm:text-6xl">
          Coffee is better shared. You don’t need the vocabulary, <em>just a curious palate.</em>
        </p>
      </section>

      <section className="mx-auto max-w-screen-2xl px-5 pb-24 sm:px-8 md:pb-32 lg:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionIntro eyebrow="Ways to join us" title="Four ways in." />
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            Dates, lengths and prices go out to everyone on the interest list first.
          </p>
        </div>
        <div className="mt-16 space-y-20 md:space-y-28">
          {experienceFormats.map((format, i) => {
            const image = images[format.image];
            if (i === 2)
              return (
                <article key={format.id} id={format.id} className="scroll-mt-24">
                  <div className="aspect-[16/7] min-h-[18rem] overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="100vw"
                    />
                  </div>
                  <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
                    <div>
                      <p className="text-xs text-cherry">0{i + 1}</p>
                      <h3 className="mt-4 font-display text-5xl sm:text-6xl">{format.title}</h3>
                    </div>
                    <div>
                      <p className="text-lg leading-8 text-muted-foreground">{format.body}</p>
                    </div>
                  </div>
                </article>
              );
            return (
              <article
                key={format.id}
                id={format.id}
                className="grid scroll-mt-24 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16"
              >
                <div className={`aspect-[4/3] overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                  />
                </div>
                <div className="max-w-xl">
                  <p className="text-xs text-cherry">0{i + 1}</p>
                  <h3 className="mt-4 font-display text-5xl sm:text-6xl">{format.title}</h3>
                  <p className="mt-6 text-lg leading-8 text-muted-foreground">{format.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-screen-2xl lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-24 sm:px-8 lg:px-12">
            <p className="eyebrow text-ink-foreground/55">Private & team events</p>
            <h2 className="mt-5 font-display text-6xl leading-[0.9] sm:text-7xl">
              Your group,
              <br />
              <em>our roastery.</em>
            </h2>
            <p className="mt-7 max-w-lg leading-7 text-ink-foreground/70">
              A tasting with friends, a session for your team or something for a birthday. Tell us
              about your group and what you have in mind, and we’ll work out a plan with you.
            </p>
            <div className="mt-9">
              <Button asChild variant="hero" size="lg">
                <a href="#register" onClick={() => setPreset({ interest: PRIVATE_EVENT })}>
                  Plan a private event
                </a>
              </Button>
            </div>
          </div>
          <div className="min-h-[30rem]">
            <Image
              src={roasteryImage}
              alt="Coffee roasting at the drum roaster"
              width={1600}
              height={1072}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-5 py-24 sm:px-8 md:py-32 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">What to expect</p>
            <h2 className="mt-4 font-display text-5xl leading-none">
              Relaxed and hands-on.
            </h2>
          </div>
          <div className="grid border-t border-border sm:grid-cols-3">
            {expectations.map((e) => (
              <article
                key={e.title}
                className="border-b border-border py-7 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
              >
                <h3 className="font-display text-3xl">{e.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{e.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="register" className="scroll-mt-20 bg-paper-deep">
        <div className="mx-auto grid max-w-screen-2xl gap-14 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div>
            <p className="eyebrow">Register interest</p>
            <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
              Be first to hear about new sessions.
            </h2>
            <p className="mt-6 max-w-md leading-7 text-muted-foreground">
              Tell us what you’d like to try and which days suit you. We’ll be in touch once dates
              are set.
            </p>
          </div>
          <EnquiryForm
            fields={registerFields}
            preset={preset}
            submitLabel="Register interest"
            subject={(v) => `Experience interest: ${String(v["interest"] ?? "")}`}
          />
        </div>
      </section>
    </main>
  );
}
