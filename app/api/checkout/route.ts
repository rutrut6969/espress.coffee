import { NextResponse } from "next/server";
import Stripe from "stripe";
import { FulfillmentStatus, PaymentStatus } from "@prisma/client";
import { hydrateCart, cartCookieName } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import { calculatePlatformProfit } from "@/lib/pricing";
import { hasUsableDatabaseUrl } from "@/lib/runtime";

function orderNumber() {
  return `EC-${Date.now().toString().slice(-7)}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const customerName = String(formData.get("customerName") ?? "Guest Customer");
  const customerEmail = String(formData.get("customerEmail") ?? "guest@example.com");
  const shippingAddress = String(formData.get("shippingAddress") ?? "");
  const items = await hydrateCart();
  const appUrl = process.env.APP_URL || new URL("/", request.url).origin;

  if (!items.length) return NextResponse.redirect(new URL("/cart", request.url), { status: 303 });

  const subtotalCents = items.reduce((sum, item) => sum + item.variant.retailPriceCents * item.quantity, 0);
  const shippingCents = 600;
  const taxCents = Math.round(subtotalCents * 0.07);
  const totalCents = subtotalCents + shippingCents + taxCents;
  const platformProfitCents = items.reduce(
    (sum, item) => sum + calculatePlatformProfit(item.variant.retailPriceCents, item.variant.baseCostCents) * item.quantity,
    0
  );

  let orderId = "";
  let orderPersisted = false;
  if (hasUsableDatabaseUrl()) {
    try {
      const created = await prisma.order.create({
        data: {
          orderNumber: orderNumber(),
          customerEmail,
          customerName,
          shippingAddress: { raw: shippingAddress },
          paymentStatus: PaymentStatus.PENDING,
          fulfillmentStatus: FulfillmentStatus.PENDING_PAYMENT,
          subtotalCents,
          shippingCents,
          taxCents,
          totalCents,
          platformProfitCents,
          items: {
            create: items.map((item) => ({
              productId: item.product.id,
              productVariantId: item.variant.id,
              roasterId: item.product.roaster?.id ?? null,
              productName: item.product.name,
              variantLabel: item.variant.label,
              quantity: item.quantity,
              selectedGrind: item.selectedGrind,
              baseCostCents: item.variant.baseCostCents,
              retailPriceCents: item.variant.retailPriceCents,
              platformProfitCents: calculatePlatformProfit(item.variant.retailPriceCents, item.variant.baseCostCents) * item.quantity,
              roasterStatus: item.product.roaster ? "NEW" : "NOT_REQUIRED"
            }))
          }
        }
      });
      orderId = created.id;
      orderPersisted = true;
    } catch {
      orderId = "demo-order";
    }
  } else {
    orderId = "demo-order";
  }

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("replace_me")) {
    const response = NextResponse.redirect(`${appUrl}/checkout/success?demo=1&order=${orderId}`, { status: 303 });
    response.cookies.delete(cartCookieName);
    return response;
  }

  if (!orderPersisted) {
    return NextResponse.json(
      { error: "Checkout requires a reachable database so the order can be saved before payment." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.product.name} - ${item.variant.label}`,
          description: item.selectedGrind ? `Grind: ${item.selectedGrind}` : item.product.shortDescription,
          images: item.product.images
        },
        unit_amount: item.variant.retailPriceCents
      }
    })),
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Standard repackaging and shipping",
          type: "fixed_amount",
          fixed_amount: { amount: shippingCents, currency: "usd" }
        }
      }
    ],
    metadata: { orderId },
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel`
  });

  if (orderId !== "demo-order") {
    await prisma.order.update({ where: { id: orderId }, data: { stripeCheckoutSessionId: session.id } }).catch(() => null);
  }

  const response = NextResponse.redirect(session.url ?? `${appUrl}/checkout/success?order=${orderId}`, { status: 303 });
  response.cookies.delete(cartCookieName);
  return response;
}
