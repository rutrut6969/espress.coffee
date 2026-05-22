import { PortalShell } from "@/components/portal-shell";
import { StatusBadge } from "@/components/status-badge";
import { fulfillmentLinks } from "@/lib/portal-links";
import { getOrdersForDashboard } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function FulfillmentOrdersPage() {
  await requireRole(["FULFILLMENT"]);
  const orders = await getOrdersForDashboard();
  return (
    <PortalShell title="Order detail" eyebrow="Fulfillment history" links={fulfillmentLinks}>
      <section className="grid">
        {orders.map((order) => (
          <article className="card card-body" key={order.id}>
            <StatusBadge value={String(order.fulfillmentStatus)} />
            <h3>{order.orderNumber}</h3>
            <p className="muted">Roaster readiness: {order.items.map((item) => item.roasterStatus).join(", ")}</p>
            <p>{order.items.map((item) => `${item.productName} - ${item.variantLabel} - ${item.selectedGrind ?? "standard"}`).join("; ")}</p>
          </article>
        ))}
      </section>
    </PortalShell>
  );
}
