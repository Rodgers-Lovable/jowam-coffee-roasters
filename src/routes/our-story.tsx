import { createFileRoute, Link } from "@tanstack/react-router";
import image from "@/assets/jowam-cafe-interior.jpg";
import { PlaceholderPage } from "@/components/jowam/editorial";
import { Button } from "@/components/ui/button";

// Facts only: no founding story or people are named until Jowam supplies them.
export const Route = createFileRoute("/our-story")({ head: () => ({ meta: [{ title: "Our Story | Jowam Coffee Roasters" }, { name: "description", content: "Jowam is a café and coffee roastery at Lavington Mall, Nairobi. We roast Kenyan coffee, run a full kitchen and keep the tables open all day." }, { property: "og:title", content: "Our Story | Jowam" }, { property: "og:description", content: "A café and coffee roastery at Lavington Mall, Nairobi." }, { property: "og:type", content: "website" }, { property: "og:url", content: "/our-story" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "/our-story" }] }), component: OurStoryPage });

function OurStoryPage() {
  return (
    <PlaceholderPage eyebrow="Our story" title="Built around people." body="Jowam is a café and coffee roastery at Lavington Mall in Nairobi. We roast Kenyan coffee from Bungoma, Nyeri, Meru, Murang’a and Kirinyaga, serve it at our own bar and sell it by the bag. The kitchen does full breakfasts, burgers, butter chicken, pilau and a lot more, and plenty of people who come in for one coffee are still at their table by lunch. That’s how we like it." image={image} imageAlt="Guests talking over coffee in the Jowam café">
      <div className="mt-9 flex flex-wrap gap-3">
        <Button asChild size="lg"><Link to="/visit">Visit us</Link></Button>
        <Button asChild variant="outline" size="lg"><Link to="/coffee">Our coffee</Link></Button>
      </div>
    </PlaceholderPage>
  );
}
