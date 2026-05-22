import { calculatePlatformProfit, calculateRetailPrice } from "./pricing";

export const demoUsers = [
  { email: "admin@espress.coffee", password: "AdminDemo123!", role: "ADMIN", name: "Avery Admin" },
  { email: "customer@espress.coffee", password: "CustomerDemo123!", role: "CUSTOMER", name: "Casey Customer" },
  { email: "roaster@espress.coffee", password: "RoasterDemo123!", role: "ROASTER", name: "Riley Roaster" },
  { email: "fulfillment@espress.coffee", password: "FulfillDemo123!", role: "FULFILLMENT", name: "Finley Fulfillment" }
] as const;

export const demoRoasters = [
  {
    name: "Ember & Oak Roasters",
    slug: "ember-and-oak-roasters",
    description: "Warm, chocolate-forward small-batch roasts built for slow mornings and steady espresso bars.",
    businessEmail: "hello@emberoak.example",
    phone: "555-0101",
    website: "https://example.com/ember-oak",
    city: "Asheville",
    state: "NC",
    status: "APPROVED",
    internalNotes: "Reliable supply partner with consistent medium and dark roast demand."
  },
  {
    name: "Northstar Beanworks",
    slug: "northstar-beanworks",
    description: "Bright, fruit-forward specialty coffees with expressive single origins and espresso blends.",
    businessEmail: "team@northstar.example",
    phone: "555-0102",
    website: "https://example.com/northstar",
    city: "Portland",
    state: "ME",
    status: "APPROVED",
    internalNotes: "Feature in light roast and seasonal collections."
  },
  {
    name: "Hollow Creek Coffee Co.",
    slug: "hollow-creek-coffee-co",
    description: "Smooth everyday blends, approachable medium roasts, and dependable decaf.",
    businessEmail: "orders@hollowcreek.example",
    phone: "555-0103",
    website: "https://example.com/hollow-creek",
    city: "Bentonville",
    state: "AR",
    status: "APPROVED",
    internalNotes: "Strong fit for subscriptions and office orders."
  },
  {
    name: "Sol Ridge Roasting",
    slug: "sol-ridge-roasting",
    description: "Experimental single-origin and lighter roasts with layered fruit, florals, and clean sweetness.",
    businessEmail: "green@solridge.example",
    phone: "555-0104",
    website: "https://example.com/sol-ridge",
    city: "Santa Fe",
    state: "NM",
    status: "PENDING",
    internalNotes: "Pending packaging review, demo products approved for internal review."
  }
] as const;

const coffeeImage = (id: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const coffeeProducts = [
  ["Morning Ember Roast", "ember-and-oak-roasters", "MEDIUM", ["chocolate", "brown sugar", "toasted almond"], "FULL", "LOW", "MEDIUM", ["drip", "French press", "pour over"], "Brazil", "Minas Gerais", coffeeImage(1514432324607)],
  ["Fireside Dark", "ember-and-oak-roasters", "DARK", ["molasses", "dark chocolate", "smoky cedar"], "FULL", "LOW", "LOW", ["French press", "espresso", "moka pot"], "Colombia", "Huila", coffeeImage(1495474472287)],
  ["Golden Hour Blend", "ember-and-oak-roasters", "MEDIUM_LIGHT", ["honey", "graham cracker", "citrus"], "MEDIUM", "MEDIUM", "HIGH", ["drip", "pour over"], "Central America", "Blend", coffeeImage(1509042239860)],
  ["Northstar Citrus", "northstar-beanworks", "LIGHT", ["orange zest", "jasmine", "cane sugar"], "LIGHT", "HIGH", "MEDIUM", ["pour over", "AeroPress"], "Kenya", "Nyeri", coffeeImage(1447933601403)],
  ["Berry Compass", "northstar-beanworks", "LIGHT", ["blueberry", "red grape", "vanilla"], "MEDIUM", "HIGH", "HIGH", ["pour over", "cold brew"], "Ethiopia", "Guji", coffeeImage(1507133750040)],
  ["Summit Espresso", "northstar-beanworks", "ESPRESSO", ["cocoa", "cherry", "caramel"], "FULL", "MEDIUM", "HIGH", ["espresso", "latte", "cappuccino"], "Brazil and Colombia", "Blend", coffeeImage(1511920170033)],
  ["Hollow Creek House Blend", "hollow-creek-coffee-co", "MEDIUM", ["milk chocolate", "biscuit", "soft citrus"], "MEDIUM", "MEDIUM", "MEDIUM", ["drip", "French press"], "Latin America", "Blend", coffeeImage(1518057111178)],
  ["Sunday Porch Decaf", "hollow-creek-coffee-co", "MEDIUM", ["caramel", "toasted pecan", "cocoa"], "MEDIUM", "LOW", "MEDIUM", ["drip", "pour over"], "Colombia", "Cauca", coffeeImage(1517701604599), true],
  ["Creekstone Breakfast", "hollow-creek-coffee-co", "MEDIUM_LIGHT", ["maple", "apple", "brown butter"], "MEDIUM", "MEDIUM", "HIGH", ["drip", "AeroPress"], "Guatemala", "Antigua", coffeeImage(1511537190424)],
  ["Sol Ridge Ethiopia", "sol-ridge-roasting", "LIGHT", ["bergamot", "peach", "floral honey"], "LIGHT", "HIGH", "HIGH", ["pour over"], "Ethiopia", "Yirgacheffe", coffeeImage(1459755486867)],
  ["Desert Sun Natural", "sol-ridge-roasting", "MEDIUM_LIGHT", ["strawberry", "cocoa nib", "raw sugar"], "MEDIUM", "HIGH", "HIGH", ["pour over", "cold brew"], "Ethiopia", "Sidama", coffeeImage(1461023058943)],
  ["Midnight Mesa", "sol-ridge-roasting", "MEDIUM_DARK", ["baking spice", "dark cocoa", "dried cherry"], "FULL", "MEDIUM", "MEDIUM", ["espresso", "French press"], "Mexico", "Chiapas", coffeeImage(1504198453319)]
] as const;

export const gearProducts = [
  ["Precision Pour-Over Kettle", "BREWING_EQUIPMENT", "Balanced flow control with a responsive gooseneck spout.", 5200, 3500, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80"],
  ["Burr Coffee Grinder", "BREWING_EQUIPMENT", "Consistent burr grinding for espresso, pour over, and cold brew.", 9800, 7000, "https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=1200&q=80"],
  ["French Press Brewer", "BREWING_EQUIPMENT", "Heat-retaining glass brewer for full-bodied cups.", 4200, 2700, "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80"],
  ["Cold Brew Maker", "BREWING_EQUIPMENT", "Clean overnight extraction with a removable stainless filter.", 3900, 2500, "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80"],
  ["Compostable Coffee Filters", "ACCESSORY", "Unbleached filters sized for everyday cone brewers.", 1200, 500, "https://images.unsplash.com/photo-1522992319-0365e5f11656?auto=format&fit=crop&w=1200&q=80"],
  ["Digital Coffee Scale", "ACCESSORY", "Fast-response scale with timer for dialed-in brewing.", 3100, 1800, "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80"]
] as const;

export function coffeeVariants(productName: string, index = 0) {
  const bases = [
    { label: "8 oz", sizeOz: 8, base: 650 + index * 10, markup: 65 },
    { label: "12 oz", sizeOz: 12, base: 900 + index * 12, markup: 75 },
    { label: "16 oz", sizeOz: 16, base: 1200 + index * 15, markup: 78 },
    { label: "2 lb", sizeOz: 32, base: 2200 + index * 24, markup: 82 }
  ];

  return bases.map((variant) => {
    const retailPriceCents = calculateRetailPrice(variant.base, "PERCENTAGE", variant.markup);
    return {
      label: variant.label,
      sizeOz: variant.sizeOz,
      sku: `${productName.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "C")}-${variant.label.replace(/\s/g, "")}`,
      baseCostCents: variant.base,
      markupType: "PERCENTAGE",
      markupValue: variant.markup,
      retailPriceCents,
      stockQuantity: 32 + index * 3,
      inventoryMode: "TRACKED",
      isAvailable: true,
      weightOz: variant.sizeOz + 2,
      shippingClass: "coffee",
      platformProfitCents: calculatePlatformProfit(retailPriceCents, variant.base)
    };
  });
}

export const grindOptions = ["whole bean", "espresso", "drip", "pour over", "French press", "cold brew"];
