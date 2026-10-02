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
  group: "food" | "drinks";
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

// Prices in KSh, from Jowam's printed food and drinks menus.
const ksh = (price: number) => `KSh ${price.toLocaleString("en-KE")}`;
const hotIced = (hot: number, iced: number) => `${ksh(hot)} · Iced ${iced.toLocaleString("en-KE")}`;
const item = (name: string, price: number, description?: string): MenuItemData =>
  description ? { name, price: ksh(price), description } : { name, price: ksh(price) };
const both = (name: string, hot: number, iced: number): MenuItemData => ({ name, price: hotIced(hot, iced) });

export const menuCategories: MenuCategoryData[] = [
  // Food
  {
    id: "breakfast", group: "food", name: "Breakfast", description: "Full plates to start the day, each with a coffee.",
    items: [
      item("Jowam full breakfast", 1300, "Bread, eggs, sausages, baked beans, bacon, mixed veggies, wedges and coffee."),
      item("Mini breakfast", 1000, "Bread, eggs, sausages, baked beans, mixed veggies, wedges and coffee."),
    ],
  },
  {
    id: "build-your-breakfast", group: "food", name: "Build Your Breakfast", description: "Pick the pieces you want.",
    items: [
      item("Bacon", 300), item("Fried eggs / sunny side up", 200), item("Toast", 100), item("Beef samosa", 200),
      item("Lemon mandazi", 50), item("Spanish omelette", 250), item("Cheese omelette", 250),
      item("Spanish cheese omelette", 300), item("Beef sausages", 200), item("2 pancakes", 100),
    ],
  },
  {
    id: "soups", group: "food", name: "Soups",
    items: [item("Chicken soup", 450), item("Bone soup", 450), item("Butternut soup", 450), item("Vegetable soup", 450)],
  },
  {
    id: "sandwiches", group: "food", name: "Sandwiches", description: "All served with fries.",
    items: [
      item("Chicken sandwich", 800, "Grilled chicken, lettuce, tomatoes, mayo."),
      item("Chicken & avo sandwich", 850, "Grilled chicken, lettuce, avocado, tomatoes, mayo."),
      item("Chicken & cheese", 1300, "Grilled chicken, lettuce, tomatoes, cheese, mayo."),
      item("BLTC", 1300, "Bacon, lettuce, tomatoes, cheese, mayo."),
      item("Beef sandwich", 1200),
    ],
  },
  {
    id: "burgers", group: "food", name: "Burgers", description: "All served with fries.",
    items: [
      item("Chicken burger", 800, "Grilled chicken, cheese, lettuce, tomato, mayo."),
      { ...item("Jowam house burger", 900, "Grilled beef, cheese, bacon, lettuce, tomato, mayo."), label: "Chef's special" },
      item("Beef burger", 800, "Grilled beef, cheese, lettuce, tomato, mayo."),
      item("Vegetable burger", 750, "Veg, cheese, mayo."),
    ],
  },
  {
    id: "salads", group: "food", name: "Salads",
    items: [
      item("Garden salad", 700, "Carrots, cucumber, lettuce, avocado, tomatoes, onions, dressing."),
      item("Chicken Caesar salad", 800, "Chicken, cucumber, lettuce, parmesan cheese."),
      item("Indian salad", 800, "Carrots, green chillies, parmesan cheese, tomatoes, onions, dressing."),
      item("Potato salad", 700, "Potatoes, tomatoes, cucumber."),
    ],
  },
  {
    id: "mains", group: "food", name: "Main Dishes", description: "Served with a side of your choice.",
    items: [
      item("Stir fry beef", 800), item("Beef fry (wet or dry)", 700), item("Stir fry chicken", 850),
      item("Grilled fish fillet", 1400), item("Grilled chicken", 1200), item("Hawaiian grilled chicken", 1200),
      item("Chicken drumsticks", 1350), item("Moist chicken wrapped with bacon", 1400), item("Creamy chicken", 1450),
      item("Lamb chops", 1800),
    ],
  },
  {
    id: "steaks", group: "food", name: "Steaks",
    items: [
      item("Grilled fillet steak", 1500), item("Slow cooked sirloin steak", 1500),
      item("Chinese pepper steak", 1500), item("Chateaubriand steak", 2000),
    ],
  },
  {
    id: "kenyan-classics", group: "food", name: "Kenyan Classics", description: "Served with a side of your choice.",
    items: [
      item("Beef pilau", 1300), item("Chicken pilau", 1200), item("Ugali & kienyeji chicken & greens", 500),
      item("Ndengu or beans and chapati", 500), item("Kienyeji chicken", 1050), item("¼ roast chicken", 700),
    ],
  },
  {
    id: "indian-corner", group: "food", name: "Indian Corner", description: "Served with a starch of your choice.",
    items: [
      item("Butter chicken", 1200), item("Chicken tikka masala", 1400), item("Paneer tikka masala", 1250),
      item("Paneer tikka", 1200), item("Palak paneer", 1000), item("Vegetable curry", 1000),
      item("Chicken curry", 1200), item("Egg curry", 1000), item("Chicken biryani", 1300),
    ],
  },
  {
    id: "pizza", group: "food", name: "Pizza",
    items: [
      item("Chicken tikka pizza", 1300, "Cheese, spiced chicken, capsicum."),
      item("BBQ chicken pizza", 1400, "Cheese, chicken, BBQ sauce, capsicum."),
      item("Hawaiian pizza", 1300, "Cheese, chicken, ham, pineapple, capsicum."),
      item("Margherita pizza", 1200, "Tomatoes, mozzarella."),
      item("Seafood pizza", 1800, "Cheese, fish."),
    ],
  },
  {
    id: "pasta", group: "food", name: "Pasta",
    items: [item("Pasta arrabiata", 600), item("Pasta bolognese", 750), item("Pasta carbonara", 800), item("Pasta with meatballs", 750)],
  },
  {
    id: "rice-dishes", group: "food", name: "Rice Dishes",
    items: [item("Egg fried rice", 800), item("Chicken fried rice", 1100), item("Bacon fried rice", 1200)],
  },
  {
    id: "small-meals", group: "food", name: "Small Meals",
    items: [
      item("5 chicken nuggets or chicken fingers", 700), item("5 chicken wings or chicken lollipops", 700),
      item("5 fish fingers or fish goujons", 750), item("Meatballs and fries", 700),
    ],
  },
  {
    id: "sides", group: "food", name: "Sides",
    items: [
      item("Plain chips", 200), item("Masala chips", 250), item("Pepper chips", 300), item("Poussin chips", 300),
      item("Garlic fries", 250), item("Potato wedges", 300), item("Mashed potatoes", 300),
      item("Naan", 150, "Butter, chilli or garlic naan. Cheese naan KSh 200."),
    ],
  },
  // Drinks
  {
    id: "coffee", group: "drinks", name: "Coffee", tone: "coffee",
    description: "Roasted by us. Add plant-based milk or a syrup for KSh 100 each.",
    items: [
      item("Espresso", 200), item("Ristretto", 200), item("Lungo", 200), item("Espresso macchiato", 300),
      both("Americano", 250, 300), both("Latte", 300, 350), both("Cappuccino", 300, 350), both("Flat white", 300, 350),
      both("Latte macchiato", 300, 350), both("Mocha or peppermint mocha", 400, 450), item("Cortado", 300),
      both("Spanish latte", 400, 450),
    ],
  },
  {
    id: "filter-coffee", group: "drinks", name: "Filter Coffee", tone: "coffee",
    description: "Brewed by hand with a coffee from the current bar.",
    items: [
      both("V60", 400, 450), both("Chemex", 400, 450), both("Aeropress", 400, 450), both("French press", 400, 450),
      { name: "Cold brew", price: `Iced ${ksh(600)}` },
    ],
  },
  {
    id: "tea", group: "drinks", name: "Tea & Chocolate",
    items: [item("Black tea", 200), item("English tea", 250), item("Masala tea", 300), item("Dawa", 300), item("Hot chocolate", 300)],
  },
  {
    id: "matcha", group: "drinks", name: "Matcha",
    items: [both("Matcha latte", 550, 600), item("Strawberry matcha", 700)],
  },
  {
    id: "milkshakes", group: "drinks", name: "Milkshakes",
    items: ["Vanilla", "Caramel", "Strawberry", "Espresso", "Peach", "Marsha", "Blueberry", "Mixed berry", "Raspberry", "Mocha"]
      .map((flavour) => item(`${flavour} shake`, 650)),
  },
  {
    id: "smoothies", group: "drinks", name: "Smoothies",
    items: [item("Coffee smoothie", 500), item("Zesty smoothie", 400), item("Tropical smoothie", 400), item("Nutty smoothie", 400)],
  },
  {
    id: "ice-cream", group: "drinks", name: "Ice Cream",
    items: [item("3 scoops of ice cream", 550), item("Affogato", 600, "Espresso poured over ice cream.")],
  },
  {
    id: "mocktails", group: "drinks", name: "Mocktails",
    items: [item("Blue moon", 400), item("Cherry spirit", 400), item("Kiwi-mint", 400), item("Peach fantasy", 400)],
  },
  {
    id: "iced-teas", group: "drinks", name: "Iced Teas",
    items: [item("Passion iced tea", 400), item("Peach iced tea", 400), item("Kiwi-mint iced tea", 400), item("Lemon-mint iced tea", 400)],
  },
  {
    id: "lemonades", group: "drinks", name: "Lemonades & Slushies",
    items: [
      item("Lemonade", 600), item("Strawberry lemonade", 600), item("Passion lemonade", 600),
      item("Slushies", 400, "Ask the team which flavours are available."),
    ],
  },
  {
    id: "soft-drinks", group: "drinks", name: "Soft Drinks",
    items: [
      item("Still water 500ml", 100), item("Still water 1L", 150), item("Sparkling water 500ml", 150),
      item("Sparkling water 750ml", 250), item("Soda", 100),
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
