import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

  let event: Stripe.Event;
  try {
    event = stripe && signature && secret ? stripe.webhooks.constructEvent(body, signature, secret) : JSON.parse(body);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          fulfillmentStatus: "AWAITING_ROASTER_SUPPLY",
          stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          fulfillmentTasks: { create: { status: "READY_FOR_REPACKAGING", repackagingStatus: "QUEUED" } }
        }
      }).catch(() => null);
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await prisma.order.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { paymentStatus: "FAILED" }
    }).catch(() => null);
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
    if (paymentIntentId) {
      await prisma.order.updateMany({
        where: { stripePaymentIntentId: paymentIntentId },
        data: { paymentStatus: "REFUNDED", fulfillmentStatus: "REFUNDED" }
      }).catch(() => null);
    }
  }

  return NextResponse.json({ received: true });
}
