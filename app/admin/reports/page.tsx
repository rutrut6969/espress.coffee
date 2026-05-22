import { PortalShell } from "@/components/portal-shell";
import { adminLinks } from "@/lib/portal-links";
import { getOrdersForDashboard } from "@/lib/catalog";
import { formatCurrency } from "@/lib/pricing";
import { requireRole } from "@/lib/auth";

export default async function AdminReportsPage() {
  await requireRole(["ADMIN"]);
  const orders = await getOrdersForDashboard();
  const gross = orders.reduce((sum, order) => sum + order.totalCents, 0);
  const profit = orders.reduce((sum, order) => sum + order.platformProfitCents, 0);
  const average = orders.length ? Math.round(gross / orders.length) : 0;
  const topProducts = new Map<string, number>();
  orders.forEach((order) => order.items.forEach((item) => topProducts.set(item.productName, (topProducts.get(item.productName) ?? 0) + item.quantity)));
  return (
    <PortalShell title="Sales reports" eyebrow="Revenue and profit" description="Track gross sales, platform profit, order value, refund exposure, and product demand." links={adminLinks}>
      <section className="dashboard-grid">
        <div className="data-card stat"><span className="muted">Gross sales</span><strong>{formatCurrency(gross)}</strong><small>all demo order totals</small></div>
        <div className="data-card stat"><span className="muted">Platform profit</span><strong>{formatCurrency(profit)}</strong><small>stored margin snapshots</small></div>
        <div className="data-card stat"><span className="muted">Average order</span><strong>{formatCurrency(average)}</strong><small>gross order average</small></div>
        <div className="data-card stat"><span className="muted">Refund totals</span><strong>{formatCurrency(orders.filter((o) => o.paymentStatus === "REFUNDED").reduce((s, o) => s + o.totalCents, 0))}</strong><small>refunded/canceled exposure</small></div>
      </section>
      <section className="table-shell responsive-table">
        <table><thead><tr><th>Top product</th><th>Units</th></tr></thead><tbody>{[...topProducts.entries()].map(([name, quantity]) => <tr key={name}><td>{name}</td><td>{quantity}</td></tr>)}</tbody></table>
      </section>
    </PortalShell>
  );
}
