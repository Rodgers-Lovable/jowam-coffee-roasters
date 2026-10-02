import productsImage from "@/assets/jowam-bags-latte.jpg";

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

// Wholesale — broad categories only (brief §16). Programme details are placeholders until confirmed.
export const wholesaleCategories = ["Cafés", "Restaurants", "Hotels", "Offices", "Hospitality businesses"] as const;

export const wholesalePrinciples = [
  { title: "Roasted by the people who serve it", body: "The coffee you pour is the coffee we pour at our own café, every day." },
  { title: "Coffee chosen for your menu", body: "Selection shaped around your guests, your service and how your team brews." },
  { title: "Hospitality people, working with hospitality people", body: "We understand busy mornings, full tables and the standards behind good service." },
] as const;

export const wholesaleSteps = [
  { title: "Conversation", body: "Tell us about your place, your guests and what you serve today." },
  { title: "Tasting", body: "Taste coffees side by side and talk through what suits your menu." },
  { title: "Selection", body: "Agree the coffees, quantities and rhythm that fit your service." },
  { title: "Ongoing supply", body: "Freshly roasted coffee, with a team you can reach when you need us." },
] as const;

export const wholesaleVolumes = ["Under 5 kg", "5–15 kg", "15–40 kg", "Over 40 kg", "Not sure yet"] as const;

export const wholesaleFaqs = [
  { q: "Is there a minimum order?", a: "Minimum order details are to be confirmed. Get in touch and we’ll talk it through." },
  { q: "Where do you deliver?", a: "Delivery areas and schedules are to be confirmed." },
  { q: "Can you help with equipment?", a: "Equipment support is to be confirmed. Tell us about your setup in your enquiry." },
  { q: "Do you train our staff?", a: "Training for partner teams is to be confirmed. See our experiences page for current education plans." },
] as const;

// Experiences — formats are representative; durations, group sizes and prices are to be confirmed.
export const experienceFormats = [
  { id: "cupping", title: "Public cupping", body: "Taste several coffees side by side, the way roasters do. Compare, ask questions and find out what you enjoy. No experience needed.", image: "cupping" },
  { id: "roastery", title: "Roastery visit", body: "See green coffee become the coffee in your cup. Stand by the roaster, smell the change and taste the result.", image: "roastery" },
  { id: "brewing", title: "Home brewing workshop", body: "Get more from your coffee at home. Grind, ratio and technique for the brewer you already own.", image: "products" },
  { id: "training", title: "Barista training", body: "Hands-on time behind the bar: espresso, milk and the habits that make service consistent.", image: "barista" },
] as const;

export const experienceDetails = ["Duration", "Group size", "Price"] as const;

export const experienceInterests = [...experienceFormats.map((f) => f.title), "Private or team event"] as const;
