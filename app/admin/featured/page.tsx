import { PortalShell } from "@/components/portal-shell";
import { adminLinks } from "@/lib/portal-links";
import { getCatalogProducts } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function AdminFeaturedPage() {
  await requireRole(["ADMIN"]);
  const products = await getCatalogProducts();
  const collections = ["Homepage Featured Roasts", "New Arrivals", "Dark Roast Picks", "Brewing Gear", "Local Roasters", "Market Page Featured"];
  return (
    <PortalShell title="Featured listings" eyebrow="Curation" links={adminLinks}>
      <section className="grid product-grid">
        {collections.map((collection) => (
          <article className="card card-body" key={collection}>
            <h3>{collection}</h3>
            <p className="muted">{products.filter((product) => product.collections.includes(collection.replace("Homepage ", "")) || product.collections.includes(collection)).slice(0, 4).map((product) => product.name).join(", ") || "Ready for admin placement."}</p>
            <button className="button-secondary">Manage order</button>
          </article>
        ))}
      </section>
    </PortalShell>
  );
}
