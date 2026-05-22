import { PortalShell } from "@/components/portal-shell";
import { StatusBadge } from "@/components/status-badge";
import { fulfillmentLinks } from "@/lib/portal-links";
import { getOrdersForDashboard } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function FulfillmentQueuePage() {
  await requireRole(["FULFILLMENT"]);
  const orders = (await getOrdersForDashboard()).filter((order) => !["SHIPPED", "DELIVERED", "CANCELED", "REFUNDED"].includes(String(order.fulfillmentStatus)));
  return (
    <PortalShell title="Fulfillment queue" eyebrow="Packaging work" description="Phone-friendly task cards for repackaging, packaging notes, and shipment handoff." links={fulfillmentLinks}>
      <section className="mobile-card-list">
        {orders.map((order) => (
          <article className="data-card task-card" key={order.id}>
            <StatusBadge value={String(order.fulfillmentStatus)} />
            <h3>{order.orderNumber}</h3>
            <p className="muted">{order.customerName} - {order.customerEmail}</p>
            <p>{order.items.map((item) => `${item.quantity} x ${item.productName} / ${item.variantLabel} / ${item.selectedGrind ?? "standard"}`).join("; ")}</p>
            <div className="pill-row"><button className="button-secondary">Start repackaging</button><button className="button-secondary">Mark completed</button><button className="button-secondary">Add notes</button></div>
          </article>
        ))}
      </section>
    </PortalShell>
  );
}
