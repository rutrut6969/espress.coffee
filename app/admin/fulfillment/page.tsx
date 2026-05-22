import { PortalShell } from "@/components/portal-shell";
import { StatusBadge } from "@/components/status-badge";
import { adminLinks } from "@/lib/portal-links";
import { getOrdersForDashboard } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function AdminFulfillmentPage() {
  await requireRole(["ADMIN"]);
  const orders = await getOrdersForDashboard();
  return (
    <PortalShell title="Fulfillment" eyebrow="Repackaging and shipping" links={adminLinks}>
      <section className="grid">
        {orders.filter((order) => String(order.fulfillmentStatus).includes("REPACK") || String(order.fulfillmentStatus).includes("SHIP")).map((order) => (
          <article className="card card-body" key={order.id}>
            <StatusBadge value={String(order.fulfillmentStatus)} />
            <h3>{order.orderNumber}</h3>
            <p className="muted">{order.items.map((item) => `${item.quantity} x ${item.productName} (${item.selectedGrind ?? "standard"})`).join("; ")}</p>
            <div className="pill-row"><button className="button-secondary">Mark repackaged</button><button className="button-secondary">Add tracking</button><button className="button-secondary">Mark shipped</button></div>
          </article>
        ))}
      </section>
    </PortalShell>
  );
}
