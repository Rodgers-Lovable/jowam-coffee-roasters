import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin } from "lucide-react";
import image from "@/assets/jowam-v60-bar.jpg";
import { Image } from "@/components/jowam/editorial";
import { GoogleReviews } from "@/components/jowam/google-reviews";
import { LocationMap } from "@/components/jowam/location-map";
import { Button } from "@/components/ui/button";
import { siteInfo } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/visit")({
  head: () =>
    pageHead({
      title: "Visit Jowam Coffee Roasters | Lavington Mall, Nairobi",
      description: "Find Jowam Coffee Roasters at Lavington Mall on James Gichuru Road, Nairobi. Open Monday to Saturday 7:15 am to 7 pm and Sunday 9 am to 5 pm.",
      path: "/visit",
      ogTitle: "Visit Jowam Coffee Roasters",
      ogDescription: "Lavington Mall, James Gichuru Road, Nairobi. Open every day for coffee, breakfast and lunch.",
      image: image,
      imageAlt: "A V60 brewing at the Jowam bar",
    }),
  component: VisitPage,
});

const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteInfo.mapsQuery)}`;

function VisitPage() {
  return (
    <main>
      <section className="mx-auto grid max-w-screen-2xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-12 lg:py-20">
        <div className="max-w-xl">
          <p className="eyebrow">Visit Jowam</p>
          <h1 className="mt-5 font-display text-6xl leading-[0.9] sm:text-7xl">Meet us at the café.</h1>
          <p className="mt-7 text-lg leading-8 text-muted-foreground">You’ll find us at Lavington Mall on James Gichuru Road. We open early for coffee and breakfast, and there’s no rush to leave.</p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="eyebrow flex items-center gap-2 text-olive"><MapPin className="size-3.5" /> Location</p>
              <address className="mt-3 text-sm not-italic leading-6">
                {siteInfo.addressLine}
                <br />
                {siteInfo.city}
              </address>
            </div>
            <div>
              <p className="eyebrow flex items-center gap-2 text-olive"><Clock className="size-3.5" /> Opening hours</p>
              <dl className="mt-3 space-y-1.5 text-sm">
                {siteInfo.hours.map((entry) => (
                  <div key={entry.day} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{entry.day}</dt>
                    <dd className="tabular-nums">{entry.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="eyebrow flex items-center gap-2 text-olive"><Mail className="size-3.5" /> Email</p>
              <a href={`mailto:${siteInfo.contact.hello}`} className="mt-3 block text-sm underline-offset-4 hover:underline">{siteInfo.contact.hello}</a>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild><a href={directionsUrl} target="_blank" rel="noreferrer">Get directions</a></Button>
            <Button asChild variant="outline"><Link to="/menu">See the menu</Link></Button>
          </div>
        </div>
        <div className="aspect-[4/5] max-h-[75vh] overflow-hidden">
          <Image src={image} alt="A V60 brewing at the Jowam bar, with the coffee plant mural behind" width={916} height={1214} priority sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
      </section>

      <section className="bg-paper-deep">
        <div className="mx-auto max-w-screen-2xl px-5 py-20 sm:px-8 lg:px-12">
          <h2 className="font-display text-4xl sm:text-5xl">Find us</h2>
          <p className="mt-3 text-sm text-muted-foreground">{siteInfo.addressLine}, {siteInfo.city}</p>
          <LocationMap className="mt-8 aspect-[16/10] w-full md:aspect-[21/9]" />
        </div>
      </section>

      <GoogleReviews />
    </main>
  );
}
