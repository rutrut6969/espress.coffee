import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getRoasterBySlug } from "@/lib/catalog";
import { StatusBadge } from "@/components/status-badge";

export const dynamic = "force-dynamic";

export default async function RoasterProfilePage({ params }: { params: { slug: string } }) {
  const roaster = await getRoasterBySlug(params.slug);
  if (!roaster) notFound();

  return (
    <main className="section">
      <div className="container">
        <section className="panel">
          <StatusBadge value={String(roaster.status)} />
          <h1 style={{ color: "var(--espresso)" }}>{roaster.name}</h1>
          <p className="muted">{roaster.description}</p>
          <div className="pill-row">
            <span className="pill">{roaster.city}, {roaster.state}</span>
            {roaster.website ? <a className="pill" href={roaster.website}>Website</a> : null}
            <span className="pill">{roaster.businessEmail}</span>
          </div>
        </section>
        <section className="section">
          <div className="section-header">
            <div>
              <span className="eyebrow">Products</span>
              <h2 style={{ color: "var(--espresso)" }}>Coffee from {roaster.name}</h2>
            </div>
          </div>
          <div className="grid product-grid">
            {roaster.products.map((product) => <ProductCard key={product.id} product={product as never} />)}
          </div>
        </section>
      </div>
    </main>
  );
}
