import productsImage from "@/assets/jowam-coffee-products.jpg";

export type Dietary = "V" | "VG" | "GF" | "S";
export type MenuItemData = {
  name: string;
  description?: string;
  price: string;
  dietary?: Dietary[];
  label?: "New" | "Seasonal" | "Chef's special" | "Limited";
  available?: boolean;
};
export type MenuCategoryData = {
  id: string;
  name: string;
  description?: string;
  items: MenuItemData[];
  tone?: "default" | "coffee";
};

export const navItems = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Coffee", to: "/coffee" },
  { label: "Shop", to: "/shop" },
  { label: "Our Story", to: "/our-story" },
  { label: "Wholesale", to: "/wholesale" },
  { label: "Visit", to: "/visit" },
] as const;

export const coffees = [
  { name: "Nyeri", origin: "Kenya · Representative release", process: "Washed", notes: "Blackcurrant · Citrus · Caramel", price: "KSh —", image: productsImage },
  { name: "Kirinyaga", origin: "Kenya · Representative release", process: "Washed", notes: "Red berries · Honey · Florals", price: "KSh —", image: productsImage },
  { name: "Embu", origin: "Kenya · Representative release", process: "Natural", notes: "Stone fruit · Cocoa · Spice", price: "KSh —", image: productsImage },
] as const;

export const menuCategories: MenuCategoryData[] = [
  {
    id: "breakfast", name: "Breakfast", description: "A generous start, made for slow mornings and good coffee.",
    items: [
      { name: "Jowam breakfast plate", description: "A representative breakfast composition; final ingredients to be confirmed.", price: "KSh —", dietary: ["GF"], label: "Chef's special" },
      { name: "Sourdough & eggs", description: "Eggs your way, toasted sourdough and a seasonal accompaniment.", price: "KSh —", dietary: ["V"] },
      { name: "Seasonal breakfast bowl", description: "Fruit, cultured yoghurt, house granola and local honey.", price: "KSh —", dietary: ["V", "GF"], label: "Seasonal" },
    ],
  },
  {
    id: "brunch", name: "Brunch", description: "Familiar favourites, considered ingredients and plates worth sharing.",
    items: [
      { name: "Grilled chicken sandwich", description: "Herb-marinated chicken, caramelised onion, rocket and house aioli on toasted sourdough.", price: "KSh —" },
      { name: "Avocado on sourdough", description: "A representative seasonal preparation with herbs and citrus.", price: "KSh —", dietary: ["V", "VG"] },
      { name: "House brunch plate", description: "A changing kitchen plate shaped by the season.", price: "KSh —", label: "Seasonal" },
    ],
  },
  {
    id: "mains", name: "Mains", description: "Comforting plates for lunch and unhurried afternoons.",
    items: [
      { name: "Kitchen main — placeholder", description: "A considered, seasonal main. Final menu details are coming soon.", price: "KSh —" },
      { name: "Plant-based main — placeholder", description: "A vegetable-led plate using seasonal produce.", price: "KSh —", dietary: ["VG"] },
    ],
  },
  {
    id: "light-bites", name: "Light Bites", items: [
      { name: "Seasonal salad", description: "Leaves, grains and a bright house dressing; representative item.", price: "KSh —", dietary: ["VG", "GF"] },
      { name: "Toasted sourdough", description: "A simple café plate with rotating accompaniments.", price: "KSh —", dietary: ["V"] },
    ],
  },
  {
    id: "bakery", name: "Bakery", description: "Something baked, something brewed — best enjoyed together.",
    items: [
      { name: "Butter croissant", price: "KSh —", dietary: ["V"] },
      { name: "Daily pastry", description: "Ask the team what has just come from the kitchen.", price: "KSh —", dietary: ["V"], label: "New" },
      { name: "Cake of the day", price: "KSh —", dietary: ["V"] },
    ],
  },
  {
    id: "coffee", name: "Coffee", description: "Roasted by us. Brewed for you.", tone: "coffee",
    items: [
      { name: "Espresso", price: "KSh —" }, { name: "Americano", price: "KSh —" }, { name: "Cortado", price: "KSh —" },
      { name: "Flat white", price: "KSh —" }, { name: "Cappuccino", price: "KSh —" }, { name: "Latte", price: "KSh —" },
      { name: "V60", description: "Prepared with a coffee selected from the current bar.", price: "KSh —" },
      { name: "Aeropress", price: "KSh —" }, { name: "French press", price: "KSh —" },
      { name: "Today's coffee", description: "Ask your barista about the coffees currently on the bar.", price: "KSh —", label: "Seasonal" },
    ],
  },
  {
    id: "other-drinks", name: "Other Drinks", items: [
      { name: "House drink — placeholder", description: "Space reserved for a future Jowam signature.", price: "KSh —", label: "Limited" },
      { name: "Tea selection", description: "Final selection to be confirmed.", price: "KSh —" },
      { name: "Seasonal cooler", description: "A changing non-coffee drink.", price: "KSh —", label: "Seasonal" },
    ],
  },
];
