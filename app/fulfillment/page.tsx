import { PortalShell } from "@/components/portal-shell";
import { fulfillmentLinks } from "@/lib/portal-links";
import { getOrdersForDashboard } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function FulfillmentDashboardPage() {
  await requireRole(["FULFILLMENT"]);
  const orders = await getOrdersForDashboard();
  const count = (status: string) => orders.filter((order) => String(order.fulfillmentStatus) === status).length;
  return (
    <PortalShell title="Fulfillment portal" eyebrow="Repackaging and shipping" links={fulfillmentLinks}>
      <section className="grid stat-grid">
        <div className="card stat"><span className="muted">Ready for repackaging</span><strong>{count("READY_FOR_REPACKAGING")}</strong></div>
        <div className="card stat"><span className="muted">In repackaging</span><strong>{count("REPACKAGING")}</strong></div>
        <div className="card stat"><span className="muted">Ready to ship</span><strong>{count("READY_TO_SHIP") + count("REPACKAGED")}</strong></div>
        <div className="card stat"><span className="muted">Shipped today</span><strong>{count("SHIPPED")}</strong></div>
      </section>
    </PortalShell>
  );
}
