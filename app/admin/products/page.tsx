import { PortalShell } from "@/components/portal-shell";
import { StatusBadge } from "@/components/status-badge";
import { adminLinks } from "@/lib/portal-links";
import { getCatalogProducts } from "@/lib/catalog";
import { formatCurrency } from "@/lib/pricing";
import { requireRole } from "@/lib/auth";

export default async function AdminProductsPage() {
  await requireRole(["ADMIN"]);
  const products = await getCatalogProducts();
  return (
    <PortalShell title="Products" eyebrow="Admin product management" links={adminLinks}>
      <section className="panel">
        <div className="section-header">
          <div><span className="eyebrow">Catalog</span><h2 style={{ color: "var(--espresso)" }}>Approve, publish, feature, and price products</h2></div>
          <button className="button">Create product</button>
        </div>
        <div className="responsive-table">
          <table>
            <thead><tr><th>Product</th><th>Roaster</th><th>Status</th><th>Featured</th><th>Variants</th><th>Price</th></tr></thead>
            <tbody>{products.map((product) => (
              <tr key={product.id}>
                <td><strong>{product.name}</strong><br /><span className="muted">{product.category}</span></td>
                <td>{product.roaster?.name ?? "Admin-owned"}</td>
                <td><StatusBadge value={product.status} /></td>
                <td>{product.homepageFeatured ? "Homepage" : product.marketVisible ? "Market" : "Hidden"}</td>
                <td>{product.variants.map((variant) => variant.label).join(", ")}</td>
                <td>{formatCurrency(product.variants[0]?.retailPriceCents ?? 0)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </PortalShell>
  );
}
