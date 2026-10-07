import heroImage from "@/assets/jowam-team-roaster.jpg";
import logo from "@/assets/logo-160.jpg";
import { siteInfo } from "@/data/site";
import type { Product } from "@/lib/products";

export const absoluteUrl = (path: string) => new URL(path, siteInfo.url).toString();

type PageSeo = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  image?: string;
  imageAlt?: string;
};

// Head tags for one page: absolute canonical, og:url and og:image, as search engines and link previews expect.
export function pageHead({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  image = heroImage,
  imageAlt,
}: PageSeo) {
  const url = absoluteUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: ogTitle ?? title },
      { property: "og:description", content: ogDescription ?? description },
      { property: "og:url", content: url },
      { property: "og:image", content: absoluteUrl(image) },
      ...(imageAlt ? [{ property: "og:image:alt", content: imageAlt }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

const jsonLd = (data: object) => ({ type: "application/ld+json", children: JSON.stringify(data) });

export function cafeJsonLd() {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${siteInfo.url}/#cafe`,
    name: siteInfo.name,
    url: siteInfo.url,
    email: siteInfo.contact.hello,
    logo: absoluteUrl(logo),
    image: absoluteUrl(heroImage),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteInfo.addressLine,
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    openingHoursSpecification: siteInfo.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    servesCuisine: ["Coffee", "Breakfast", "Kenyan", "Indian", "Pizza", "Burgers"],
    hasMenu: absoluteUrl("/menu"),
    currenciesAccepted: "KES",
  });
}

export function productJsonLd(product: Product) {
  const url = absoluteUrl(`/product/${product.handle}`);
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.image ? absoluteUrl(product.image) : undefined,
    url,
    category: product.category,
    brand: { "@type": "Brand", name: siteInfo.name },
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      name: v.label,
      price: v.priceKes,
      priceCurrency: "KES",
      availability: v.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
      seller: { "@id": `${siteInfo.url}/#cafe` },
    })),
  });
}
