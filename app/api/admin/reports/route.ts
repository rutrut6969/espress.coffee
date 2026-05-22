import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getOrdersForDashboard } from "@/lib/catalog";

export async function GET() {
  const session = getSessionFromCookies();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const orders = await getOrdersForDashboard();
  return NextResponse.json({
    grossSalesCents: orders.reduce((sum, order) => sum + order.totalCents, 0),
    platformProfitCents: orders.reduce((sum, order) => sum + order.platformProfitCents, 0),
    orderCount: orders.length,
    pendingFulfillment: orders.filter((order) => !["SHIPPED", "DELIVERED", "CANCELED", "REFUNDED"].includes(String(order.fulfillmentStatus))).length
  });
}
