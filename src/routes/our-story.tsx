import { createFileRoute, Link } from "@tanstack/react-router";
import image from "@/assets/jowam-team-roaster.jpg";
import { PlaceholderPage } from "@/components/jowam/editorial";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";

// Facts only: no founding story or people are named until Jowam supplies them.
export const Route = createFileRoute("/our-story")({ head: () =>
    pageHead({
      title: "Our Story | Jowam Coffee Roasters",
      description: "Jowam is a café and coffee roastery at Lavington Mall, Nairobi. We roast Kenyan coffee, run a full kitchen and keep the tables open all day.",
      path: "/our-story",
      ogTitle: "Our Story | Jowam",
      ogDescription: "A café and coffee roastery at Lavington Mall, Nairobi.",
      image: image,
      imageAlt: "Two people at a table with bags of Jowam coffee, the roaster and grinder behind them",
    }), component: OurStoryPage });

function OurStoryPage() {
  return (
    <PlaceholderPage eyebrow="Our story" title="Built around people." body="Jowam is a café and coffee roastery at Lavington Mall in Nairobi. We roast Kenyan coffee from Bungoma, Nyeri, Meru, Murang’a and Kirinyaga, serve it at our own bar and sell it by the bag. The kitchen does full breakfasts, burgers, butter chicken, pilau and a lot more, and plenty of people who come in for one coffee are still at their table by lunch. That’s how we like it." image={image} imageAlt="Two people at a table with bags of Jowam coffee, the roaster and grinder behind them">
      <div className="mt-9 flex flex-wrap gap-3">
        <Button asChild size="lg"><Link to="/visit">Visit us</Link></Button>
        <Button asChild variant="outline" size="lg"><Link to="/coffee">Our coffee</Link></Button>
      </div>
    </PlaceholderPage>
  );
}
