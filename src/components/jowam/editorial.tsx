import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MenuCategoryData } from "@/data/jowam";

export function SectionIntro({ eyebrow, title, body, align = "left" }: { eyebrow: string; title: string; body?: string; align?: "left" | "center" }) {
  return <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}><p className="eyebrow">{eyebrow}</p><h2 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">{title}</h2>{body && <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{body}</p>}</div>;
}

export function TextLink({ to, children, inverse = false }: { to: string; children: React.ReactNode; inverse?: boolean }) {
  return <Button asChild variant={inverse ? "textInverse" : "text"}><Link to={to}>{children}<ArrowUpRight /></Link></Button>;
}

export function Image({ src, alt, width, height, className = "", priority = false, sizes = "(max-width: 768px) 100vw, 50vw" }: { src: string; alt: string; width: number; height: number; className?: string; priority?: boolean; sizes?: string }) {
  return <img src={src} alt={alt} width={width} height={height} sizes={sizes} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} className={`h-full w-full object-cover ${className}`} />;
}

export function CoffeeProduct({ coffee }: { coffee: { name: string; origin: string; process: string; notes: string; price: string; image: string } }) {
  return <article className="group border-t border-border pt-5"><div className="aspect-[4/3] overflow-hidden bg-muted"><Image src={coffee.image} alt="Bags of Jowam coffee beside a latte" width={1183} height={1200} className="transition-transform duration-700 group-hover:scale-[1.025]" /></div><div className="mt-5 flex justify-between gap-5"><div><h3 className="font-display text-3xl">{coffee.name}</h3><p className="mt-1 text-xs uppercase text-muted-foreground">{coffee.origin}</p></div><p className="text-sm">{coffee.price}</p></div><p className="mt-4 text-sm">{coffee.process}</p><p className="mt-1 text-sm text-muted-foreground">{coffee.notes}</p><div className="mt-5"><TextLink to="/shop">View coffee</TextLink></div></article>;
}

const dietaryLabels = { V: "Vegetarian", VG: "Vegan", GF: "Gluten-free", S: "Spicy" } as const;
export function MenuCategory({ category }: { category: MenuCategoryData }) {
  return <section id={category.id} className={`scroll-mt-36 py-14 md:py-20 ${category.tone === "coffee" ? "border-y border-ink/15 bg-paper-deep px-5 sm:px-8 lg:px-12" : ""}`}><div className={category.tone === "coffee" ? "mx-auto max-w-5xl" : ""}><div className="grid gap-5 md:grid-cols-[1fr_2fr]"><div><p className="eyebrow">{category.id === "coffee" ? "Roasted by us" : "On the menu"}</p><h2 className="mt-3 font-display text-5xl">{category.name}</h2>{category.description && <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{category.description}</p>}</div><div className="divide-y divide-border">{category.items.map((item) => <article key={item.name} className="grid grid-cols-[1fr_auto] gap-5 py-5 first:pt-0"><div><div className="flex flex-wrap items-baseline gap-2"><h3 className="text-base font-semibold">{item.name}</h3>{item.label && <span className="text-[0.65rem] font-semibold uppercase text-cherry">{item.label}</span>}</div>{item.description && <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">{item.description}</p>}{item.dietary && <p className="mt-2 text-[0.65rem] uppercase text-olive">{item.dietary.map((d) => dietaryLabels[d]).join(" · ")}</p>}</div><p className="text-sm tabular-nums">{item.price}</p></article>)}</div></div></div></section>;
}

export function PlaceholderPage({ eyebrow, title, body, image, imageAlt, children }: { eyebrow: string; title: string; body: string; image: string; imageAlt: string; children?: React.ReactNode }) {
  return <main><section className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-screen-2xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12"><div className="max-w-xl"><p className="eyebrow">{eyebrow}</p><h1 className="mt-5 font-display text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">{title}</h1><p className="mt-7 text-lg leading-8 text-muted-foreground">{body}</p>{children}</div><div className="aspect-[4/5] max-h-[75vh] overflow-hidden"><Image src={image} alt={imageAlt} width={1200} height={1504} priority sizes="(max-width: 1024px) 100vw, 55vw" /></div></section></main>;
}
