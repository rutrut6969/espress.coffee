import Image from "next/image";
import { PortalShell } from "@/components/portal-shell";
import { roasterLinks } from "@/lib/portal-links";
import { getCatalogProducts } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function RoasterProductsPage() {
  await requireRole(["ROASTER"]);
  const products = (await getCatalogProducts()).filter((product) => product.roaster);
  return (
    <PortalShell title="Roaster products" eyebrow="Submission workflow" links={roasterLinks}>
      <section className="panel">
        <div className="section-header"><div><span className="eyebrow">Own catalog</span><h2 style={{ color: "var(--espresso)" }}>Submit coffee for admin review</h2></div><button className="button">Create product submission</button></div>
        <div className="grid product-grid">
          {products.map((product) => (
            <article className="card card-body" key={product.id}>
              <Image className="product-image" src={product.images[0]} alt={product.name} width={1200} height={900} unoptimized />
              <h3>{product.name}</h3>
              <p className="muted">{product.coffeeProfile?.flavorNotes.join(", ")}</p>
              <div className="pill-row"><button className="button-secondary">Edit</button><button className="button-secondary">Submit for review</button><button className="button-secondary">Archive draft</button></div>
            </article>
          ))}
        </div>
      </section>
    </PortalShell>
  );
}
