import { z } from "zod";

export const CATEGORIES = ["Coffee", "Equipment", "Merch"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Variant = { id: string; label: string; priceKes: number; available: boolean };
export type Product = {
  handle: string;
  name: string;
  category: Category;
  description: string;
  image: string | null;
  sort: number;
  variants: Variant[];
};

export type ProductStore = {
  get(): Promise<Product[] | null>;
  put(products: Product[]): Promise<void>;
};

const text = z.preprocess((v) => (v == null ? "" : String(v)), z.string().trim());

const rowSchema = z.object({
  Handle: text.pipe(
    z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Handle must be lowercase words joined by hyphens"),
  ),
  Name: text,
  Category: text,
  Description: text,
  Variant: text.pipe(z.string().min(1, "Variant is empty")),
  "Price KES": z.preprocess(
    (v) => (typeof v === "string" ? Number(v.replace(/,/g, "").trim()) : v),
    z.number({ invalid_type_error: "Price KES must be a number" }).int().positive(),
  ),
  Available: z.preprocess((v) => v === true || v === "TRUE" || v === "true", z.boolean()),
  Image: text,
  Sort: z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().nullable()),
});

export function extractDriveId(link: string): string | null {
  const match = /\/file\/d\/([\w-]+)/.exec(link) ?? /[?&]id=([\w-]+)/.exec(link);
  return match?.[1] ?? null;
}

export function imagePath(driveId: string) {
  return `/api/v1/images/${driveId}`;
}

export function variantId(handle: string, label: string) {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${handle}--${slug}`;
}

// A row with neither a Handle nor a Variant is treated as empty space in the sheet.
function isBlankRow(raw: unknown) {
  if (!raw || typeof raw !== "object") return true;
  const row = raw as Record<string, unknown>;
  const empty = (v: unknown) => v == null || String(v).trim() === "";
  return empty(row["Handle"]) && empty(row["Variant"]);
}

export function parseProductRows(rows: unknown[]): { products: Product[]; errors: string[] } {
  const errors: string[] = [];
  const byHandle = new Map<string, { product: Product | null; firstRow: number }>();

  rows.forEach((raw, index) => {
    const rowNumber = index + 2; // row 1 is the header
    if (isBlankRow(raw)) return;

    const parsed = rowSchema.safeParse(raw);
    if (!parsed.success) {
      const reason = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      errors.push(`Row ${rowNumber}: ${reason}`);
      return;
    }
    const r = parsed.data;

    let entry = byHandle.get(r.Handle);
    if (!entry) {
      const category = CATEGORIES.find((c) => c === r.Category);
      if (!r.Name || !category) {
        errors.push(
          `Row ${rowNumber}: product "${r.Handle}" needs a Name and a Category on its first row`,
        );
        entry = { product: null, firstRow: rowNumber };
      } else {
        const driveId = extractDriveId(r.Image);
        entry = {
          firstRow: rowNumber,
          product: {
            handle: r.Handle,
            name: r.Name,
            category,
            description: r.Description,
            image: driveId ? imagePath(driveId) : null,
            sort: r.Sort ?? 9999, // finite so it survives JSON in KV and server function responses
            variants: [],
          },
        };
      }
      byHandle.set(r.Handle, entry);
    }

    entry.product?.variants.push({
      id: variantId(r.Handle, r.Variant),
      label: r.Variant,
      priceKes: r["Price KES"],
      available: r.Available,
    });
  });

  const products = [...byHandle.values()]
    .map((e) => e.product)
    .filter((p): p is Product => p !== null && p.variants.some((v) => v.available))
    .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));

  return { products, errors };
}
