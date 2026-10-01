import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatKes } from "@/lib/money";
import { getProducts } from "@/lib/products.functions";
import { useCartStore } from "@/stores/cart-store";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ params }) => {
    const products = await getProducts();
    const product = products.find((p) => p.handle === params.handle);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.name} | Jowam Coffee Roasters`
      : "Jowam Coffee Roasters";
    const description =
      loaderData?.description ||
      "A freshly roasted coffee release from Jowam Coffee Roasters in Nairobi.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductPage,
});

function ProductNotFound() {
  return (
    <main className="mx-auto max-w-screen-2xl px-5 py-24 text-center sm:px-8 lg:px-12">
      <p className="eyebrow">Shop Jowam</p>
      <h1 className="mt-5 font-display text-6xl">We couldn't find that coffee.</h1>
      <p className="mx-auto mt-5 max-w-md text-base leading-7 text-muted-foreground">
        It may have sold out or moved. Have a look at what we are roasting right now.
      </p>
      <Button asChild className="mt-8">
        <Link to="/shop">Back to the shop</Link>
      </Button>
    </main>
  );
}

function ProductPage() {
  const product = Route.useLoaderData();
  const addLine = useCartStore((state) => state.addLine);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected =
    product.variants.find((v) => v.id === selectedId) ??
    product.variants.find((v) => v.available) ??
    product.variants[0];

  const handleAdd = () => {
    if (!selected?.available) return;
    addLine(product.handle, selected.id);
    toast.success(`${product.name} added to your bag`);
  };

  return (
    <main className="mx-auto max-w-screen-2xl px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to the shop
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="aspect-[4/5] overflow-hidden bg-muted">
          {product.image ? (
            <img src={product.image} alt={product.name} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Photography coming soon
            </div>
          )}
        </div>

        <div className="max-w-xl">
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-4 font-display text-6xl leading-[0.92] sm:text-7xl">{product.name}</h1>
          <p className="mt-6 font-display text-4xl tabular-nums">
            {selected ? formatKes(selected.priceKes) : ""}
          </p>
          {product.description && (
            <p className="mt-7 whitespace-pre-line text-base leading-7 text-muted-foreground">
              {product.description}
            </p>
          )}

          {product.variants.length > 1 && (
            <div className="mt-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Options
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedId(variant.id)}
                    disabled={!variant.available}
                    className={`border px-4 py-2 text-sm transition-colors disabled:opacity-40 ${
                      selected?.id === variant.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {variant.label}
                    {!variant.available && " (sold out)"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" onClick={handleAdd} disabled={!selected?.available}>
              {selected?.available ? "Add to bag" : "Sold out"}
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">Keep browsing</Link>
            </Button>
          </div>

          <dl className="mt-12 divide-y divide-border border-t border-border text-sm">
            <div className="flex justify-between gap-6 py-4">
              <dt className="text-muted-foreground">Roasted</dt>
              <dd className="text-right">In small batches at our Lavington roastery</dd>
            </div>
            <div className="flex justify-between gap-6 py-4">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="text-right">Fee and timing confirmed on WhatsApp</dd>
            </div>
            <div className="flex justify-between gap-6 py-4">
              <dt className="text-muted-foreground">Collection</dt>
              <dd className="text-right">Lavington Mall, James Gichuru Road</dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
