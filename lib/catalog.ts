import { prisma } from "@/lib/prisma";
import { coffeeProducts, coffeeVariants, demoRoasters, gearProducts, grindOptions } from "@/lib/demo-data";
import { slugify } from "@/lib/slug";
import { calculatePlatformProfit } from "@/lib/pricing";

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  images: string[];
  status: string;
  marketVisible: boolean;
  homepageFeatured: boolean;
  featuredRank: number | null;
  tags: string[];
  collections: string[];
  roaster: null | { id: string; name: string; slug: string; city: string | null; state: string | null; description?: string };
  coffeeProfile: null | {
    roastLevel: string;
    origin: string | null;
    region: string | null;
    flavorNotes: string[];
    acidity: string;
    body: string;
    sweetness: string;
    decaf: boolean;
    recommendedBrewMethods: string[];
    grindOptions: string[];
  };
  variants: Array<{
    id: string;
    label: string;
    sizeOz: number | null;
    sku: string;
    baseCostCents: number;
    retailPriceCents: number;
    stockQuantity: number;
    isAvailable: boolean;
  }>;
};

function fallbackProducts(): CatalogProduct[] {
  const roasterBySlug = Object.fromEntries(
    demoRoasters.map((roaster) => [
      roaster.slug,
      {
        id: roaster.slug,
        name: roaster.name,
        slug: roaster.slug,
        city: roaster.city,
        state: roaster.state,
        description: roaster.description
      }
    ])
  );

  const coffees = coffeeProducts.map((coffee, index) => {
    const [name, roasterSlug, roastLevel, notes, body, acidity, sweetness, methods, origin, region, image, decaf] = coffee;
    const slug = slugify(name);
    return {
      id: slug,
      name,
      slug,
      category: "COFFEE_BEANS",
      shortDescription: `${notes.slice(0, 3).join(", ")} from ${roasterBySlug[roasterSlug].name}.`,
      description: `A ${roastLevel.toLowerCase().replace("_", "-")} coffee with ${notes.join(", ")} notes, selected for espress.coffee customers who want a polished craft cup at home.`,
      images: [image],
      status: "PUBLISHED",
      marketVisible: true,
      homepageFeatured: index < 4,
      featuredRank: index + 1,
      tags: [...notes, roastLevel.toLowerCase()],
      collections: index < 4 ? ["Featured Roasts", "Market Page Featured"] : ["New Arrivals"],
      roaster: roasterBySlug[roasterSlug],
      coffeeProfile: {
        roastLevel,
        origin,
        region,
        flavorNotes: [...notes],
        acidity,
        body,
        sweetness,
        decaf: Boolean(decaf),
        recommendedBrewMethods: [...methods],
        grindOptions
      },
      variants: coffeeVariants(name, index).map((variant) => ({ ...variant, id: `${slug}-${variant.label}` }))
    } satisfies CatalogProduct;
  });

  const gear = gearProducts.map((item, index) => {
    const [name, category, description, retail, base, image] = item;
    const slug = slugify(name);
    return {
      id: slug,
      name,
      slug,
      category,
      shortDescription: description,
      description: `${description} Curated by espress.coffee for dependable daily brewing.`,
      images: [image],
      status: "PUBLISHED",
      marketVisible: true,
      homepageFeatured: index < 3,
      featuredRank: 20 + index,
      tags: ["gear", "brewing"],
      collections: ["Brewing Gear", index < 3 ? "Market Page Featured" : "Accessories"],
      roaster: null,
      coffeeProfile: null,
      variants: [
        {
          id: `${slug}-standard`,
          label: "Standard",
          sizeOz: null,
          sku: `GEAR-${index + 1}`,
          baseCostCents: base,
          retailPriceCents: retail,
          stockQuantity: 18 + index * 4,
          isAvailable: true
        }
      ]
    } satisfies CatalogProduct;
  });

  return [...coffees, ...gear];
}

export async function getCatalogProducts(params?: {
  category?: string;
  roast?: string;
  roaster?: string;
  q?: string;
}) {
  try {
    const products = await prisma.product.findMany({
      where: {
        marketVisible: true,
        status: "PUBLISHED",
        ...(params?.category ? { category: params.category as never } : {}),
        ...(params?.roaster ? { roaster: { slug: params.roaster } } : {}),
        ...(params?.q ? { name: { contains: params.q, mode: "insensitive" } } : {})
      },
      include: {
        roaster: true,
        coffeeProfile: true,
        variants: { orderBy: { retailPriceCents: "asc" } }
      },
      orderBy: [{ homepageFeatured: "desc" }, { featuredRank: "asc" }, { createdAt: "desc" }]
    });
    const typed = products as unknown as CatalogProduct[];
    return params?.roast ? typed.filter((product) => product.coffeeProfile?.roastLevel === params.roast) : typed;
  } catch {
    const filtered = fallbackProducts().filter((product) => {
      if (params?.category && product.category !== params.category) return false;
      if (params?.roaster && product.roaster?.slug !== params.roaster) return false;
      if (params?.roast && product.coffeeProfile?.roastLevel !== params.roast) return false;
      if (params?.q && !product.name.toLowerCase().includes(params.q.toLowerCase())) return false;
      return product.marketVisible;
    });
    return filtered;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return (await prisma.product.findUnique({
      where: { slug },
      include: { roaster: true, coffeeProfile: true, variants: { orderBy: { retailPriceCents: "asc" } }, reviews: true }
    })) as unknown as CatalogProduct | null;
  } catch {
    return fallbackProducts().find((product) => product.slug === slug) ?? null;
  }
}

export async function getRoasters() {
  try {
    return await prisma.roaster.findMany({
      include: { products: { where: { marketVisible: true, status: "PUBLISHED" }, include: { variants: true, coffeeProfile: true } } },
      orderBy: { name: "asc" }
    });
  } catch {
    const products = fallbackProducts();
    return demoRoasters.map((roaster) => ({
      ...roaster,
      id: roaster.slug,
      products: products.filter((product) => product.roaster?.slug === roaster.slug)
    }));
  }
}

export async function getRoasterBySlug(slug: string) {
  const roasters = await getRoasters();
  return roasters.find((roaster) => roaster.slug === slug) ?? null;
}

export async function getOrdersForDashboard() {
  try {
    return await prisma.order.findMany({
      include: { items: { include: { product: true, roaster: true } }, fulfillmentTasks: true },
      orderBy: { createdAt: "desc" },
      take: 24
    });
  } catch {
    const products = fallbackProducts();
    return Array.from({ length: 8 }).map((_, index) => {
      const product = products[index];
      const variant = product.variants[1] ?? product.variants[0];
      const base = variant.baseCostCents;
      const retail = variant.retailPriceCents;
      const quantity = index % 3 === 0 ? 2 : 1;
      return {
        id: `order-${index + 1}`,
        orderNumber: `EC-100${index + 1}`,
        paymentStatus: index === 7 ? "REFUNDED" : index === 6 ? "PENDING" : "PAID",
        fulfillmentStatus: ["PAID", "AWAITING_ROASTER_SUPPLY", "READY_FOR_REPACKAGING", "REPACKAGING", "REPACKAGED", "SHIPPED", "DELIVERED", "REFUNDED"][index],
        subtotalCents: retail * quantity,
        shippingCents: 600,
        taxCents: Math.round(retail * quantity * 0.07),
        totalCents: retail * quantity + 600 + Math.round(retail * quantity * 0.07),
        platformProfitCents: calculatePlatformProfit(retail, base) * quantity,
        customerEmail: index % 2 ? "customer@espress.coffee" : "guest@example.com",
        customerName: index % 2 ? "Casey Customer" : "Jordan Guest",
        createdAt: new Date(Date.now() - index * 86400000),
        items: [
          {
            id: `item-${index}`,
            productName: product.name,
            variantLabel: variant.label,
            quantity,
            selectedGrind: product.category === "COFFEE_BEANS" ? "drip" : null,
            roasterStatus: product.roaster ? "ACCEPTED" : "NOT_REQUIRED",
            platformProfitCents: calculatePlatformProfit(retail, base) * quantity,
            roaster: product.roaster,
            product
          }
        ],
        fulfillmentTasks: index > 1 ? [{ id: `task-${index}`, status: "READY_FOR_REPACKAGING", repackagingStatus: "QUEUED" }] : []
      };
    });
  }
}
