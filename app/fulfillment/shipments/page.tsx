import { PortalShell } from "@/components/portal-shell";
import { StatusBadge } from "@/components/status-badge";
import { fulfillmentLinks } from "@/lib/portal-links";
import { getOrdersForDashboard } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function FulfillmentShipmentsPage() {
  await requireRole(["FULFILLMENT"]);
  const orders = await getOrdersForDashboard();
  return (
    <PortalShell title="Shipments" eyebrow="Tracking" links={fulfillmentLinks}>
      <section className="panel responsive-table">
        <table><thead><tr><th>Order</th><th>Status</th><th>Customer</th><th>Carrier</th><th>Tracking</th><th>Action</th></tr></thead><tbody>{orders.map((order) => (
          <tr key={order.id}><td>{order.orderNumber}</td><td><StatusBadge value={String(order.fulfillmentStatus)} /></td><td>{order.customerEmail}</td><td>USPS</td><td>{String(order.fulfillmentStatus) === "SHIPPED" ? "9400 1000 0000 0000" : "Pending"}</td><td><button className="button-secondary">Update shipment</button></td></tr>
        ))}</tbody></table>
      </section>
    </PortalShell>
  );
}
