import { PortalShell } from "@/components/portal-shell";
import { roasterLinks } from "@/lib/portal-links";
import { getCatalogProducts } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function RoasterStockPage() {
  await requireRole(["ROASTER"]);
  const rows = (await getCatalogProducts()).filter((product) => product.roaster).flatMap((product) => product.variants.map((variant) => ({ product, variant })));
  return (
    <PortalShell title="Roaster stock" eyebrow="Inventory alerts" links={roasterLinks}>
      <section className="panel responsive-table">
        <table><thead><tr><th>Product</th><th>Variant</th><th>SKU</th><th>Stock</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map(({ product, variant }) => (
          <tr key={variant.sku}><td>{product.name}</td><td>{variant.label}</td><td>{variant.sku}</td><td>{variant.stockQuantity}</td><td>{variant.isAvailable ? "Available" : "Unavailable"}</td><td><button className="button-secondary">Update stock</button></td></tr>
        ))}</tbody></table>
      </section>
    </PortalShell>
  );
}
