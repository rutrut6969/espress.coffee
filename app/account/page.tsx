import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getOrdersForDashboard } from "@/lib/catalog";
import { formatCurrency } from "@/lib/pricing";
import { StatusBadge } from "@/components/status-badge";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await requireRole(["CUSTOMER"]);
  const orders = (await getOrdersForDashboard()).filter((order) => order.customerEmail === session.email || session.role === "ADMIN").slice(0, 8);

  return (
    <main className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="eyebrow">Account</span>
            <h1 style={{ color: "var(--espresso)" }}>{session.name}</h1>
          </div>
          <form method="post" action="/api/auth/logout"><button className="button-secondary" type="submit">Logout</button></form>
        </div>

        <section className="panel">
          <h2 style={{ color: "var(--espresso)" }}>Order history</h2>
          <div className="responsive-table">
            <table>
              <thead><tr><th>Order</th><th>Status</th><th>Total</th><th>Items</th><th>Action</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td><StatusBadge value={String(order.fulfillmentStatus)} /></td>
                    <td>{formatCurrency(order.totalCents)}</td>
                    <td>{order.items.map((item) => item.productName).join(", ")}</td>
                    <td><Link className="button-secondary" href="/market">Reorder</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
