import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/jowam-brunch-table.jpg";
import cafeImage from "@/assets/jowam-cafe-interior.jpg";
import baristaImage from "@/assets/jowam-barista.jpg";
import { MenuCategory, Image, TextLink } from "@/components/jowam/editorial";
import { menuCategories } from "@/data/jowam";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/menu")({ head: () => ({ meta: [
  { title: "Menu | Jowam Coffee Roasters" }, { name: "description", content: "Explore the representative Jowam café menu structure for breakfast, brunch, bakery, coffee and other drinks." },
  { property: "og:title", content: "Menu | Jowam Coffee Roasters" }, { property: "og:description", content: "Thoughtful food and coffee, made for time together." }, { property: "og:type", content: "website" }, { property: "og:url", content: "/menu" }, { name: "twitter:card", content: "summary_large_image" },
], links: [{ rel: "canonical", href: "/menu" }] }), component: MenuPage });

function MenuPage() {
  const coffeeCategory = menuCategories.find((category) => category.id === "coffee");
  const drinksCategory = menuCategories.find((category) => category.id === "other-drinks");
  return <main>
    <section className="mx-auto grid max-w-screen-2xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-14"><div className="flex flex-col justify-center py-8"><p className="eyebrow">Eat & drink</p><h1 className="mt-4 font-display text-7xl leading-none sm:text-8xl">Menu</h1><p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">Food for slow mornings, quick lunches and everything in between. Always with good coffee.</p><p className="mt-5 text-xs text-cherry">Representative menu and placeholder prices — final Jowam offering to be confirmed.</p></div><div className="aspect-[16/9] overflow-hidden"><Image src={heroImage} alt="A breakfast spread with pastries and coffee" width={1200} height={1504} priority sizes="(max-width:1024px) 100vw, 60vw" /></div></section>
    <nav className="sticky top-20 z-40 border-y border-border bg-background/95 backdrop-blur" aria-label="Menu categories"><div className="mx-auto flex max-w-screen-2xl gap-7 overflow-x-auto px-5 py-4 sm:px-8 lg:px-12">{menuCategories.map((c) => <a key={c.id} href={`#${c.id}`} className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] hover:text-cherry">{c.name}</a>)}</div></nav>
    <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-0">{menuCategories.slice(0, 2).map((category) => <MenuCategory key={category.id} category={category} />)}<div className="my-4 aspect-[16/7] overflow-hidden"><Image src={cafeImage} alt="Food and coffee being enjoyed in the café" width={1600} height={1072} /></div>{menuCategories.slice(2, 5).map((category) => <MenuCategory key={category.id} category={category} />)}</div>
    {coffeeCategory && <div className="my-6"><MenuCategory category={coffeeCategory} /></div>}
    <section className="mx-auto grid max-w-5xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-2"><div className="aspect-[4/5] overflow-hidden"><Image src={baristaImage} alt="Barista preparing coffee at the café bar" width={1200} height={1504} /></div><div className="flex flex-col justify-center"><p className="eyebrow">Jowam signatures</p><h2 className="mt-4 font-display text-5xl">A space for drinks of our own.</h2><p className="mt-6 leading-7 text-muted-foreground">Two to four future signature drinks can live here, supported by strong photography. Names and recipes are intentionally not invented.</p><div className="mt-7"><TextLink to="/coffee">Explore our coffee</TextLink></div></div></section>
    <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-0">{drinksCategory && <MenuCategory category={drinksCategory} />}<aside className="mb-20 border border-border p-6 text-sm leading-6"><strong>Dietary & allergy note</strong><p className="mt-2 text-muted-foreground">V Vegetarian · VG Vegan · GF Gluten-free · S Spicy. This representative menu cannot guarantee allergen-free preparation. Please speak with the Jowam team about allergies when the final menu is published.</p></aside></div>
    <section className="relative min-h-[32rem] overflow-hidden bg-ink text-ink-foreground"><Image src={cafeImage} alt="Guests enjoying time together at the café" width={1600} height={1072} sizes="100vw" className="absolute inset-0" /><div className="absolute inset-0 bg-ink/55" /><div className="relative mx-auto flex min-h-[32rem] max-w-screen-2xl flex-col items-center justify-center px-5 text-center"><p className="eyebrow">Found something you like?</p><h2 className="mt-4 font-display text-5xl sm:text-7xl">Come have it with us.</h2><div className="mt-8 flex gap-3"><Button asChild variant="hero"><Link to="/visit">Visit us</Link></Button><Button asChild variant="heroOutline"><Link to="/visit">Get directions</Link></Button></div></div></section>
  </main>;
}
