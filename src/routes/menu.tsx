import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/jowam-grilled-beef.jpg";
import cafeImage from "@/assets/jowam-cafe-interior.jpg";
import icedLatteImage from "@/assets/jowam-iced-latte.jpg";
import pastriesImage from "@/assets/jowam-pastries.jpg";
import { MenuCategory, Image, TextLink } from "@/components/jowam/editorial";
import { menuCategories } from "@/data/jowam";
import { Button } from "@/components/ui/button";
import { siteInfo } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/menu")({ head: () =>
    pageHead({
      title: "Menu | Jowam Coffee Roasters",
      description: "The Jowam café menu: breakfast, burgers, steaks, Kenyan classics, Indian dishes, pizza, coffee, shakes and more, with prices in KSh.",
      path: "/menu",
      ogDescription: "Breakfast, burgers, steaks, Kenyan classics, Indian dishes, pizza and coffee we roast ourselves.",
      image: heroImage,
      imageAlt: "Grilled beef with pepper sauce and fries",
    }), component: MenuPage });

function MenuPage() {
  const food = menuCategories.filter((category) => category.group === "food");
  const coffee = menuCategories.filter((category) => category.group === "drinks" && category.tone === "coffee");
  const otherDrinks = menuCategories.filter((category) => category.group === "drinks" && category.tone !== "coffee");
  const navLink = (c: (typeof menuCategories)[number]) => <a key={c.id} href={`#${c.id}`} className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] hover:text-cherry">{c.name}</a>;
  return <main>
    <section className="mx-auto grid max-w-screen-2xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-14"><div className="flex flex-col justify-center py-8"><p className="eyebrow">Eat & drink</p><h1 className="mt-4 font-display text-7xl leading-none sm:text-8xl">Menu</h1><p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">Food for slow mornings, quick lunches and everything in between. Always with good coffee.</p><p className="mt-5 text-xs uppercase tracking-[0.14em] text-muted-foreground">All prices in KSh</p></div><div className="aspect-[16/9] overflow-hidden"><Image src={heroImage} alt="Grilled beef with rosemary, pepper sauce and fries" width={868} height={578} priority sizes="(max-width:1024px) 100vw, 60vw" /></div></section>
    <nav className="sticky top-20 z-40 border-y border-border bg-background/95 backdrop-blur" aria-label="Menu categories"><div className="mx-auto flex max-w-screen-2xl gap-7 overflow-x-auto px-5 py-4 sm:px-8 lg:px-12"><span className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-olive">Food</span>{food.map(navLink)}<span aria-hidden className="shrink-0 border-l border-border" /><span className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-olive">Drinks</span>{[...coffee, ...otherDrinks].map(navLink)}</div></nav>
    <div className="mx-auto max-w-5xl px-5 sm:px-8 xl:px-0">{food.slice(0, 2).map((category) => <MenuCategory key={category.id} category={category} />)}<div className="my-4 aspect-[16/7] overflow-hidden"><Image src={pastriesImage} alt="A croissant, cookies and a dusted brownie on the café counter" width={1300} height={1064} /></div>{food.slice(2).map((category) => <MenuCategory key={category.id} category={category} />)}</div>
    <div className="my-6">{coffee.map((category) => <MenuCategory key={category.id} category={category} />)}</div>
    <section className="mx-auto grid max-w-5xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-2"><div className="aspect-[4/5] overflow-hidden"><Image src={icedLatteImage} alt="An iced latte beside a bag of Jowam Nyeri dark roast" width={1032} height={1400} /></div><div className="flex flex-col justify-center"><p className="eyebrow">Beyond the espresso bar</p><h2 className="mt-4 font-display text-5xl">Something cold, something sweet.</h2><p className="mt-6 leading-7 text-muted-foreground">Milkshakes, smoothies, matcha, mocktails, iced teas and lemonades, plus an affogato when you want coffee and dessert in one cup.</p><div className="mt-7"><TextLink to="/coffee">Explore our coffee</TextLink></div></div></section>
    <div className="mx-auto max-w-5xl px-5 sm:px-8 xl:px-0">{otherDrinks.map((category) => <MenuCategory key={category.id} category={category} />)}<aside className="mb-20 border border-border p-6 text-sm leading-6"><strong>Allergies and dietary needs</strong><p className="mt-2 text-muted-foreground">Our menu includes nuts, dairy, gluten, eggs and fish, so we cannot guarantee any dish is allergen free. Tell the team about allergies when you order and we will help you choose.</p></aside></div>
    <section className="relative min-h-[32rem] overflow-hidden bg-ink text-ink-foreground"><Image src={cafeImage} alt="Guests enjoying time together at the café" width={1600} height={1072} sizes="100vw" className="absolute inset-0" /><div className="absolute inset-0 bg-ink/55" /><div className="relative mx-auto flex min-h-[32rem] max-w-screen-2xl flex-col items-center justify-center px-5 text-center"><p className="eyebrow">Found something you like?</p><h2 className="mt-4 font-display text-5xl sm:text-7xl">Come and eat with us.</h2><div className="mt-8 flex gap-3"><Button asChild variant="hero"><Link to="/visit">Visit us</Link></Button><Button asChild variant="heroOutline"><a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteInfo.mapsQuery)}`} target="_blank" rel="noreferrer">Get directions</a></Button></div></div></section>
  </main>;
}
