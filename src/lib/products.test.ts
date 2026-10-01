import { describe, expect, it } from "vitest";
import { extractDriveId, imagePath, parseProductRows, variantId } from "./products";

const row = (overrides: Record<string, unknown> = {}) => ({
  Handle: "nyeri",
  Name: "Nyeri",
  Category: "Coffee",
  Description: "Blackcurrant, citrus, caramel",
  Variant: "250g Whole Bean",
  "Price KES": 1200,
  Available: true,
  Image: "https://drive.google.com/file/d/1AbC_dEf-123/view?usp=sharing",
  Sort: 1,
  ...overrides,
});

describe("extractDriveId", () => {
  it("reads /file/d/<id>/ links", () => {
    expect(extractDriveId("https://drive.google.com/file/d/1AbC_dEf-123/view")).toBe(
      "1AbC_dEf-123",
    );
  });
  it("reads ?id=<id> links", () => {
    expect(extractDriveId("https://drive.google.com/open?id=1AbC_dEf-123")).toBe("1AbC_dEf-123");
  });
  it("returns null for anything else", () => {
    expect(extractDriveId("")).toBeNull();
    expect(extractDriveId("https://example.com/photo.jpg")).toBeNull();
  });
});

describe("variantId", () => {
  it("joins the handle and a slug of the label", () => {
    expect(variantId("nyeri", "250g Whole Bean")).toBe("nyeri--250g-whole-bean");
  });
});

describe("parseProductRows", () => {
  it("groups variant rows under one product using the first row for product fields", () => {
    const { products, errors } = parseProductRows([
      row(),
      row({
        Name: "",
        Category: "",
        Description: "",
        Image: "",
        Sort: "",
        Variant: "250g Ground",
        "Price KES": 1250,
      }),
    ]);
    expect(errors).toEqual([]);
    expect(products).toHaveLength(1);
    expect(products[0]).toEqual({
      handle: "nyeri",
      name: "Nyeri",
      category: "Coffee",
      description: "Blackcurrant, citrus, caramel",
      image: imagePath("1AbC_dEf-123"),
      sort: 1,
      variants: [
        { id: "nyeri--250g-whole-bean", label: "250g Whole Bean", priceKes: 1200, available: true },
        { id: "nyeri--250g-ground", label: "250g Ground", priceKes: 1250, available: true },
      ],
    });
  });

  it("skips invalid rows and reports their sheet row number", () => {
    const { products, errors } = parseProductRows([
      row(),
      row({ Variant: "1kg", "Price KES": "abc" }),
    ]);
    expect(products[0]?.variants).toHaveLength(1);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/^Row 3:/);
  });

  it("ignores fully blank rows without reporting them", () => {
    const { products, errors } = parseProductRows([
      row(),
      row({ Handle: "", Variant: "", "Price KES": "" }),
    ]);
    expect(products).toHaveLength(1);
    expect(errors).toEqual([]);
  });

  it("drops a product whose first row has no name or a bad category", () => {
    const { products, errors } = parseProductRows([row({ Handle: "embu", Category: "Food" })]);
    expect(products).toEqual([]);
    expect(errors[0]).toMatch(/^Row 2: product "embu"/);
  });

  it("drops products with no available variant", () => {
    const { products } = parseProductRows([row({ Available: false })]);
    expect(products).toEqual([]);
  });

  it("sorts by Sort then by name, with blank Sort last", () => {
    const { products } = parseProductRows([
      row({ Handle: "embu", Name: "Embu", Sort: "" }),
      row({ Handle: "kirinyaga", Name: "Kirinyaga", Sort: 2 }),
      row({ Handle: "nyeri", Name: "Nyeri", Sort: 2 }),
    ]);
    expect(products.map((p) => p.handle)).toEqual(["kirinyaga", "nyeri", "embu"]);
  });
});
