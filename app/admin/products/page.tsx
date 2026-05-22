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
    <PortalShell title="Products" eyebrow="Admin product management" description="Review roaster submissions, pricing, variants, visibility, and featured placement." links={adminLinks}>
      <section className="table-shell">
        <div className="section-header">
          <div><span className="eyebrow">Catalog</span><h2>Approve, publish, feature, and price products</h2></div>
          <button className="button">Create product</button>
        </div>
        <div className="responsive-table">
          <table>
            <thead><tr><th>Product</th><th>Roaster</th><th>Status</th><th>Featured</th><th>Variants</th><th>Price</th><th>Actions</th></tr></thead>
            <tbody>{products.map((product) => (
              <tr key={product.id}>
                <td><strong>{product.name}</strong><br /><span className="muted">{product.category}</span></td>
                <td>{product.roaster?.name ?? "Admin-owned"}</td>
                <td><StatusBadge value={product.status} /></td>
                <td>{product.homepageFeatured ? "Homepage" : product.marketVisible ? "Market" : "Hidden"}</td>
                <td><div className="pill-row">{product.variants.slice(0, 3).map((variant) => <span className="pill" key={variant.id}>{variant.label}</span>)}{product.variants.length > 3 ? <span className="pill">+{product.variants.length - 3}</span> : null}</div></td>
                <td>{formatCurrency(product.variants[0]?.retailPriceCents ?? 0)}</td>
                <td><div className="pill-row"><button className="button-secondary">Edit</button><button className="button-secondary">Feature</button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </PortalShell>
  );
}
