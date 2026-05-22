import { PortalShell } from "@/components/portal-shell";
import { StatusBadge } from "@/components/status-badge";
import { roasterLinks } from "@/lib/portal-links";
import { getCatalogProducts, getOrdersForDashboard } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function RoasterDashboardPage() {
  await requireRole(["ROASTER"]);
  const products = (await getCatalogProducts()).filter((product) => product.roaster);
  const orders = (await getOrdersForDashboard()).filter((order) => order.items.some((item) => item.roaster));
  return (
    <PortalShell title="Roaster portal" eyebrow="espress.coffee partner tools" description="Manage submissions, stock, and item readiness for coffees sold through espress.coffee." links={roasterLinks}>
      <section className="dashboard-grid">
        <div className="data-card stat"><span className="muted">Products</span><strong>{products.length}</strong><small>submitted catalog</small></div>
        <div className="data-card stat"><span className="muted">Pending products</span><strong>3</strong><small>awaiting review</small></div>
        <div className="data-card stat"><span className="muted">Published products</span><strong>{products.filter((p) => p.status === "PUBLISHED").length}</strong><small>live in market</small></div>
        <div className="data-card stat"><span className="muted">Orders needing action</span><strong>{orders.length}</strong><small>partner queue</small></div>
        <div className="data-card stat"><span className="muted">Low stock</span><strong>{products.flatMap((p) => p.variants).filter((v) => v.stockQuantity < 15).length}</strong><small>variant alerts</small></div>
      </section>
      <section className="mobile-card-list">
        {orders.slice(0, 5).map((order) => (
          <article className="data-card task-card" key={order.id}>
            <StatusBadge value={String(order.fulfillmentStatus)} />
            <h3>{order.orderNumber}</h3>
            <p className="muted">{order.items.map((item) => `${item.productName}: ${item.roasterStatus}`).join("; ")}</p>
          </article>
        ))}
      </section>
    </PortalShell>
  );
}
