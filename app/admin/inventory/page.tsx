import { PortalShell } from "@/components/portal-shell";
import { adminLinks } from "@/lib/portal-links";
import { getCatalogProducts } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function AdminInventoryPage() {
  await requireRole(["ADMIN"]);
  const rows = (await getCatalogProducts()).flatMap((product) => product.variants.map((variant) => ({ product, variant })));
  return (
    <PortalShell title="Inventory" eyebrow="Stock controls" links={adminLinks}>
      <section className="panel responsive-table">
        <table>
          <thead><tr><th>SKU</th><th>Product</th><th>Variant</th><th>Roaster</th><th>Stock</th><th>Mode</th><th>Action</th></tr></thead>
          <tbody>{rows.map(({ product, variant }) => (
            <tr key={variant.sku}>
              <td>{variant.sku}</td><td>{product.name}</td><td>{variant.label}</td><td>{product.roaster?.name ?? "Admin-owned"}</td>
              <td>{variant.stockQuantity}</td><td>{variant.isAvailable ? "Available" : "Unavailable"}</td><td><button className="button-secondary">Adjust</button></td>
            </tr>
          ))}</tbody>
        </table>
      </section>
    </PortalShell>
  );
}
