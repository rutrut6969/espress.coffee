import { PortalShell } from "@/components/portal-shell";
import { StatusBadge } from "@/components/status-badge";
import { adminLinks } from "@/lib/portal-links";
import { getOrdersForDashboard } from "@/lib/catalog";
import { formatCurrency } from "@/lib/pricing";
import { requireRole } from "@/lib/auth";

export default async function AdminOrdersPage() {
  await requireRole(["ADMIN"]);
  const orders = await getOrdersForDashboard();
  return (
    <PortalShell title="Orders" eyebrow="Payment and fulfillment" links={adminLinks}>
      <section className="panel responsive-table">
        <table>
          <thead><tr><th>Order</th><th>Payment</th><th>Fulfillment</th><th>Roaster statuses</th><th>Profit</th><th>Total</th></tr></thead>
          <tbody>{orders.map((order) => (
            <tr key={order.id}>
              <td><strong>{order.orderNumber}</strong><br /><span className="muted">{order.customerEmail}</span></td>
              <td><StatusBadge value={String(order.paymentStatus)} /></td>
              <td><StatusBadge value={String(order.fulfillmentStatus)} /></td>
              <td>{order.items.map((item) => `${item.productName}: ${item.roasterStatus}`).join("; ")}</td>
              <td>{formatCurrency(order.platformProfitCents)}</td>
              <td>{formatCurrency(order.totalCents)}</td>
            </tr>
          ))}</tbody>
        </table>
      </section>
    </PortalShell>
  );
}
