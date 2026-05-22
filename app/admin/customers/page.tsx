import { PortalShell } from "@/components/portal-shell";
import { adminLinks } from "@/lib/portal-links";
import { getOrdersForDashboard } from "@/lib/catalog";
import { formatCurrency } from "@/lib/pricing";
import { requireRole } from "@/lib/auth";

export default async function AdminCustomersPage() {
  await requireRole(["ADMIN"]);
  const orders = await getOrdersForDashboard();
  const customers = [...new Set(orders.map((order) => order.customerEmail))].map((email) => {
    const customerOrders = orders.filter((order) => order.customerEmail === email);
    return { email, orders: customerOrders.length, spent: customerOrders.reduce((sum, order) => sum + order.totalCents, 0) };
  });
  return (
    <PortalShell title="Customers" eyebrow="Customer management" links={adminLinks}>
      <section className="panel responsive-table">
        <table><thead><tr><th>Email</th><th>Orders</th><th>Total spent</th><th>Action</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.email}><td>{customer.email}</td><td>{customer.orders}</td><td>{formatCurrency(customer.spent)}</td><td><button className="button-secondary">View history</button></td></tr>)}</tbody></table>
      </section>
    </PortalShell>
  );
}
