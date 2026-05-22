import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { StatusBadge } from "@/components/status-badge";
import { adminLinks } from "@/lib/portal-links";
import { getCatalogProducts, getOrdersForDashboard } from "@/lib/catalog";
import { formatCurrency } from "@/lib/pricing";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireRole(["ADMIN"]);
  const products = await getCatalogProducts();
  const orders = await getOrdersForDashboard();
  const totalSales = orders.filter((order) => order.paymentStatus === "PAID").reduce((sum, order) => sum + order.totalCents, 0);
  const platformProfit = orders.reduce((sum, order) => sum + order.platformProfitCents, 0);
  const pending = orders.filter((order) => !["SHIPPED", "DELIVERED", "CANCELED", "REFUNDED"].includes(String(order.fulfillmentStatus))).length;
  const lowStock = products.flatMap((product) => product.variants).filter((variant) => variant.stockQuantity <= 15).length;

  return (
    <PortalShell title="Admin panel" eyebrow="espress.coffee operations" links={adminLinks}>
      <section className="grid stat-grid">
        {[
          ["Total sales", formatCurrency(totalSales)],
          ["Platform profit", formatCurrency(platformProfit)],
          ["Total orders", String(orders.length)],
          ["Pending fulfillment", String(pending)],
          ["Low inventory", String(lowStock)],
          ["Products awaiting approval", "3"]
        ].map(([label, value]) => (
          <div className="card stat" key={label}><span className="muted">{label}</span><strong>{value}</strong></div>
        ))}
      </section>
      <section className="panel">
        <div className="section-header">
          <div><span className="eyebrow">Recent orders</span><h2 style={{ color: "var(--espresso)" }}>Order activity</h2></div>
          <Link className="button-secondary" href="/admin/orders">Manage orders</Link>
        </div>
        <div className="responsive-table">
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th><th>Items</th></tr></thead>
            <tbody>
              {orders.slice(0, 8).map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.customerEmail}</td>
                  <td><StatusBadge value={String(order.fulfillmentStatus)} /></td>
                  <td>{formatCurrency(order.totalCents)}</td>
                  <td>{order.items.map((item) => item.productName).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PortalShell>
  );
}
