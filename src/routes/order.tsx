import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { siteInfo } from "@/data/site";
import { formatKes } from "@/lib/money";
import { orderFormSchema, resolveLines, type OrderForm } from "@/lib/order";
import { submitOrder } from "@/lib/order.functions";
import { useProducts } from "@/lib/use-products";
import { useCartStore } from "@/stores/cart-store";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Place your order | Jowam Coffee Roasters" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

const defaultValues: OrderForm = {
  name: "",
  phone: "",
  email: "",
  method: "Pickup",
  address: "",
  notes: "",
  company: "",
};

function OrderPage() {
  const { lines, clear } = useCartStore();
  const [hydrated, setHydrated] = useState(() => useCartStore.persist.hasHydrated());
  useEffect(() => useCartStore.persist.onFinishHydration(() => setHydrated(true)), []);
  const { data: products = [], isPending } = useProducts();
  const { items, unavailable, subtotal } = resolveLines(products, lines);
  const form = useForm<OrderForm>({ resolver: zodResolver(orderFormSchema), defaultValues });
  const method = form.watch("method");
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<{ ref: string; saved: boolean; link: string } | null>(null);

  const onSubmit = async (values: OrderForm) => {
    setError(null);
    try {
      const result = await submitOrder({
        data: {
          form: values,
          lines: items.map(({ handle, variantId, quantity }) => ({ handle, variantId, quantity })),
        },
      });
      setPlaced(result);
      clear();
      window.open(result.link, "_blank", "noopener");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We could not place your order. Please try again.",
      );
    }
  };

  if (placed) {
    const isWhatsApp = placed.link.startsWith("https://wa.me/");
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
        <CheckCircle2 className="mx-auto size-12 text-olive" />
        <p className="eyebrow mt-6">Order {placed.ref}</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">Almost done.</h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-7 text-muted-foreground">
          {placed.saved
            ? "We have your order. Send the message so we can confirm delivery and payment with you."
            : "Please send the message so we receive your order. We will confirm delivery and payment with you there."}
        </p>
        <Button asChild size="lg" className="mt-8">
          <a href={placed.link} target="_blank" rel="noopener noreferrer">
            {isWhatsApp ? <MessageCircle /> : <Mail />}
            {isWhatsApp ? "Open WhatsApp" : "Open email"}
          </a>
        </Button>
        <div className="mt-6">
          <Link to="/shop" className="text-sm underline underline-offset-4">
            Back to the shop
          </Link>
        </div>
      </main>
    );
  }

  if (!hydrated || isPending) {
    return (
      <main className="mx-auto flex max-w-2xl justify-center px-5 py-24 sm:px-8">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-label="Loading" />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-5xl">Your bag is empty.</h1>
        <Button asChild className="mt-8">
          <Link to="/shop">Browse coffee</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <p className="eyebrow">Place your order</p>
      <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">Your details</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_0.8fr]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (WhatsApp)</FormLabel>
                  <FormControl>
                    <Input type="tel" autoComplete="tel" placeholder="0712 345 678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optional)</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection or delivery</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="gap-3"
                    >
                      <label className="flex items-center gap-3 text-sm">
                        <RadioGroupItem value="Pickup" />
                        Pick up at {siteInfo.addressLine}
                      </label>
                      <label className="flex items-center gap-3 text-sm">
                        <RadioGroupItem value="Delivery" />
                        Delivery in Nairobi
                      </label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {method === "Delivery" && (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery area or address</FormLabel>
                    <FormControl>
                      <Input autoComplete="street-address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Grind preference, timing, gate code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div aria-hidden="true" className="hidden">
              <label>
                Company
                <input tabIndex={-1} autoComplete="off" {...form.register("company")} />
              </label>
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
              disabled={form.formState.isSubmitting || items.length === 0}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <MessageCircle />
              )}
              Place order on WhatsApp
            </Button>
          </form>
        </Form>

        <aside className="h-fit border-t border-border pt-5 lg:sticky lg:top-28">
          <h2 className="font-display text-3xl">Your bag</h2>
          <ul className="mt-5 divide-y divide-border">
            {items.map((item) => (
              <li key={item.variantId} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  {item.quantity} × {item.name}
                  <span className="block text-xs text-muted-foreground">{item.variantLabel}</span>
                </span>
                <span className="tabular-nums">{formatKes(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          {unavailable.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              {unavailable.length} item{unavailable.length > 1 ? "s are" : " is"} no longer
              available and will not be ordered.
            </p>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Subtotal
            </span>
            <span className="font-display text-3xl tabular-nums">{formatKes(subtotal)}</span>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Delivery fee and payment (M-Pesa or on pickup) are confirmed on WhatsApp.
          </p>
        </aside>
      </div>
    </main>
  );
}
