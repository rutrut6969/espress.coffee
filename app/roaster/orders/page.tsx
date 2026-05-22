import { PortalShell } from "@/components/portal-shell";
import { StatusBadge } from "@/components/status-badge";
import { roasterLinks } from "@/lib/portal-links";
import { getOrdersForDashboard } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function RoasterOrdersPage() {
  await requireRole(["ROASTER"]);
  const orders = (await getOrdersForDashboard()).filter((order) => order.items.some((item) => item.roaster));
  return (
    <PortalShell title="Roaster orders" eyebrow="Item readiness" links={roasterLinks}>
      <section className="grid">
        {orders.map((order) => (
          <article className="card card-body" key={order.id}>
            <StatusBadge value={String(order.fulfillmentStatus)} />
            <h3>{order.orderNumber}</h3>
            <p className="muted">{order.items.filter((item) => item.roaster).map((item) => `${item.quantity} x ${item.productName} (${item.variantLabel}) - ${item.roasterStatus}`).join("; ")}</p>
            <div className="pill-row"><button className="button-secondary">Accept</button><button className="button-secondary">Preparing</button><button className="button-secondary">Ready for transfer</button></div>
          </article>
        ))}
      </section>
    </PortalShell>
  );
}
