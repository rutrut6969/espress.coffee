import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { calculatePlatformProfit } from "../lib/pricing";
import { coffeeProducts, coffeeVariants, demoRoasters, demoUsers, gearProducts, grindOptions } from "../lib/demo-data";
import { slugify } from "../lib/slug";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

async function main() {
  await prisma.adminAuditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.featuredPlacement.deleteMany();
  await prisma.featuredCollection.deleteMany();
  await prisma.fulfillmentTask.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.coffeeProfile.deleteMany();
  await prisma.product.deleteMany();
  await prisma.roaster.deleteMany();
  await prisma.user.deleteMany();

  const users = new Map<string, Awaited<ReturnType<typeof prisma.user.create>>>();
  for (const user of demoUsers) {
    const created = await prisma.user.create({
      data: {
        email: user.email,
        username: user.email.split("@")[0],
        passwordHash: await hashPassword(user.password),
        role: user.role,
        name: user.name,
        status: "ACTIVE"
      }
    });
    users.set(user.email, created);
  }

  const roasterUsers = new Map<string, Awaited<ReturnType<typeof prisma.user.create>>>();
  for (const roaster of demoRoasters) {
    const email = `${roaster.slug}@espress.coffee`;
    const created = await prisma.user.create({
      data: {
        email,
        username: roaster.slug,
        passwordHash: await hashPassword("RoasterDemo123!"),
        role: "ROASTER",
        name: `${roaster.name} Partner`,
        status: "ACTIVE"
      }
    });
    roasterUsers.set(roaster.slug, created);
  }

  const roasters = new Map<string, Awaited<ReturnType<typeof prisma.roaster.create>>>();
  for (const roaster of demoRoasters) {
    const created = await prisma.roaster.create({
      data: {
        ...roaster,
        status: roaster.status,
        ownerUserId: roaster.slug === "ember-and-oak-roasters" ? users.get("roaster@espress.coffee")?.id : roasterUsers.get(roaster.slug)?.id
      }
    });
    roasters.set(roaster.slug, created);
  }

  const productRecords: any[] = [];
  for (const [index, coffee] of coffeeProducts.entries()) {
    const [name, roasterSlug, roastLevel, notes, body, acidity, sweetness, methods, origin, region, image, decaf] = coffee;
    const roaster = roasters.get(roasterSlug);
    if (!roaster) throw new Error(`Missing roaster ${roasterSlug}`);
    const product = await prisma.product.create({
      data: {
        roasterId: roaster.id,
        category: "COFFEE_BEANS",
        name,
        slug: slugify(name),
        shortDescription: `${notes.join(", ")} from ${roaster.name}.`,
        description: `A polished ${roastLevel.toLowerCase().replace("_", "-")} coffee profile selected for espress.coffee with ${notes.join(", ")} tasting notes.`,
        images: [image],
        status: index < 10 ? "PUBLISHED" : "SUBMITTED",
        marketVisible: index < 10,
        homepageFeatured: index < 4,
        featuredRank: index + 1,
        tags: [...notes, roastLevel.toLowerCase()],
        collections: index < 4 ? ["Featured Roasts", "Market Page Featured"] : index < 8 ? ["New Arrivals"] : ["Dark Roast Picks"],
        coffeeProfile: {
          create: {
            roastLevel,
            origin,
            region,
            beanType: "Arabica",
            processMethod: name.includes("Natural") || name.includes("Berry") ? "Natural" : "Washed",
            flavorNotes: [...notes],
            acidity,
            body,
            sweetness,
            caffeineLevel: decaf ? "decaf" : "standard",
            decaf: Boolean(decaf),
            organic: index % 2 === 0,
            fairTrade: index % 3 === 0,
            recommendedBrewMethods: [...methods],
            grindOptions
          }
        },
        variants: {
          create: coffeeVariants(name, index).map(({ platformProfitCents: _profit, ...variant }) => variant) as any
        }
      },
      include: { variants: true }
    });
    productRecords.push(product);
  }

  for (const [index, gear] of gearProducts.entries()) {
    const [name, category, description, retailPriceCents, baseCostCents, image] = gear;
    const product = await prisma.product.create({
      data: {
        category,
        name,
        slug: slugify(name),
        shortDescription: description,
        description: `${description} Curated by espress.coffee for reliable home brewing.`,
        images: [image],
        status: "PUBLISHED",
        marketVisible: true,
        homepageFeatured: index < 3,
        featuredRank: 50 + index,
        tags: ["gear", "brewing", "tools"],
        collections: ["Brewing Gear", index < 3 ? "Market Page Featured" : "Accessories"],
        variants: {
          create: {
            label: "Standard",
            sku: `GEAR-${index + 1}`,
            baseCostCents,
            markupType: "FIXED",
            markupValue: retailPriceCents - baseCostCents,
            retailPriceCents,
            stockQuantity: 20 + index * 5,
            inventoryMode: "TRACKED",
            isAvailable: true,
            shippingClass: "gear"
          }
        }
      },
      include: { variants: true }
    });
    productRecords.push(product);
  }

  const collectionNames = [
    ["Homepage Featured Roasts", "homepage-featured-roasts", "HOME", productRecords.slice(0, 4)],
    ["New Arrivals", "new-arrivals", "HOME", productRecords.slice(3, 7)],
    ["Dark Roast Picks", "dark-roast-picks", "MARKET", productRecords.filter((product) => product.name.includes("Dark") || product.name.includes("Midnight")).slice(0, 2)],
    ["Brewing Gear", "brewing-gear", "HOME", productRecords.filter((product) => product.category !== "COFFEE_BEANS").slice(0, 3)],
    ["Market Page Featured", "market-page-featured", "MARKET", productRecords.slice(0, 6)]
  ] as const;

  for (const [name, slug, page, products] of collectionNames) {
    await prisma.featuredCollection.create({
      data: {
        name,
        slug,
        page,
        placements: {
          create: products.map((product, index) => ({
            productId: product.id,
            sectionName: name,
            page,
            sortOrder: index + 1,
            active: true
          }))
        }
      }
    });
  }

  const customer = users.get("customer@espress.coffee");
  const statuses = [
    ["PAID", "PAID"],
    ["PAID", "AWAITING_ROASTER_SUPPLY"],
    ["PAID", "READY_FOR_REPACKAGING"],
    ["PAID", "REPACKAGING"],
    ["PAID", "REPACKAGED"],
    ["PAID", "SHIPPED"],
    ["PAID", "DELIVERED"],
    ["REFUNDED", "REFUNDED"]
  ] as const;

  for (const [index, [paymentStatus, fulfillmentStatus]] of statuses.entries()) {
    const first = productRecords[index];
    const second = index === 2 ? productRecords[5] : null;
    const selected = [first, second].filter(Boolean) as typeof productRecords;
    const items = selected.map((product, itemIndex) => {
      const variant = product.variants[itemIndex + 1] ?? product.variants[0];
      const quantity = index % 3 === 0 ? 2 : 1;
      const base = variant.baseCostCents * quantity;
      const retail = variant.retailPriceCents * quantity;
      return {
        productId: product.id,
        productVariantId: variant.id,
        roasterId: product.roasterId,
        productName: product.name,
        variantLabel: variant.label,
        quantity,
        selectedGrind: product.category === "COFFEE_BEANS" ? (itemIndex ? "espresso" : "drip") : null,
        baseCostCents: variant.baseCostCents,
        retailPriceCents: variant.retailPriceCents,
        platformProfitCents: calculatePlatformProfit(retail, base),
        roasterStatus: product.roasterId ? (index > 3 ? "READY_FOR_TRANSFER" : "ACCEPTED") : "NOT_REQUIRED",
        fulfillmentNotes: index > 2 ? "Demo fulfillment note for client review." : null
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.retailPriceCents * item.quantity, 0);
    const shipping = 600;
    const tax = Math.round(subtotal * 0.07);
    await prisma.order.create({
      data: {
        customerId: customer?.id,
        orderNumber: `EC-100${index + 1}`,
        paymentStatus,
        fulfillmentStatus,
        subtotalCents: subtotal,
        shippingCents: shipping,
        taxCents: tax,
        totalCents: subtotal + shipping + tax,
        platformProfitCents: items.reduce((sum, item) => sum + item.platformProfitCents, 0),
        customerEmail: customer?.email ?? "customer@espress.coffee",
        customerName: customer?.name ?? "Casey Customer",
        shippingAddress: { line1: "123 Coffee Lane", city: "Asheville", state: "NC", postalCode: "28801" },
        stripeCheckoutSessionId: `cs_test_demo_${index + 1}`,
        stripePaymentIntentId: `pi_test_demo_${index + 1}`,
        items: { create: items as any },
        fulfillmentTasks: index >= 2 ? { create: { status: fulfillmentStatus, repackagingStatus: index >= 4 ? "COMPLETED" : "QUEUED", trackingCarrier: index >= 5 ? "USPS" : null, trackingNumber: index >= 5 ? `940010000000000${index}` : null } } : undefined
      }
    });
  }

  const admin = users.get("admin@espress.coffee");
  if (admin) {
    for (const [action, targetId] of [
      ["PRODUCT_APPROVED", productRecords[0].id],
      ["PRODUCT_FEATURED", productRecords[1].id],
      ["ORDER_STATUS_UPDATED", "EC-1003"],
      ["ROASTER_APPROVED", roasters.get("ember-and-oak-roasters")?.id],
      ["SHIPMENT_UPDATED", "EC-1006"]
    ]) {
      await prisma.adminAuditLog.create({
        data: {
          adminId: admin.id,
          action,
          route: "/admin",
          targetId: targetId ?? null,
          metadata: { seeded: true, brand: "espress.coffee" }
        }
      });
    }
  }

  console.log("Seeded espress.coffee demo data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
