import { PortalShell } from "@/components/portal-shell";
import { fulfillmentLinks } from "@/lib/portal-links";
import { getOrdersForDashboard } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function FulfillmentDashboardPage() {
  await requireRole(["FULFILLMENT"]);
  const orders = await getOrdersForDashboard();
  const count = (status: string) => orders.filter((order) => String(order.fulfillmentStatus) === status).length;
  return (
    <PortalShell title="Fulfillment portal" eyebrow="Repackaging and shipping" description="Work through paid orders, repackaging status, shipping labels, and tracking updates." links={fulfillmentLinks}>
      <section className="dashboard-grid">
        <div className="data-card stat urgency-card"><span className="muted">Ready for repackaging</span><strong>{count("READY_FOR_REPACKAGING")}</strong><small>queue now</small></div>
        <div className="data-card stat"><span className="muted">In repackaging</span><strong>{count("REPACKAGING")}</strong><small>in progress</small></div>
        <div className="data-card stat"><span className="muted">Ready to ship</span><strong>{count("READY_TO_SHIP") + count("REPACKAGED")}</strong><small>label next</small></div>
        <div className="data-card stat"><span className="muted">Shipped today</span><strong>{count("SHIPPED")}</strong><small>completed</small></div>
      </section>
    </PortalShell>
  );
}
