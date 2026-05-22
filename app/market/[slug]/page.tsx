import { notFound } from "next/navigation";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { getCatalogProducts, getProductBySlug } from "@/lib/catalog";
import { formatCurrency } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const related = (await getCatalogProducts({ category: product.category })).filter((item) => item.slug !== product.slug).slice(0, 3);
  const profile = product.coffeeProfile;

  return (
    <main className="section">
      <div className="container detail-layout">
        <div>
          <Image className="detail-image" src={product.images[0]} alt={product.name} width={1200} height={1200} unoptimized />
          {profile ? (
            <section className="panel" style={{ marginTop: 18 }}>
              <span className="eyebrow">Coffee profile</span>
              <h2 style={{ color: "var(--espresso)" }}>{profile.roastLevel.replace("_", " ").toLowerCase()} roast</h2>
              <div className="pill-row">
                {profile.flavorNotes.map((note) => <span className="pill" key={note}>{note}</span>)}
              </div>
              <div className="grid stat-grid" style={{ marginTop: 16 }}>
                <div className="stat card"><span className="muted">Origin</span><strong>{profile.origin ?? "Blend"}</strong></div>
                <div className="stat card"><span className="muted">Body</span><strong>{profile.body.toLowerCase()}</strong></div>
                <div className="stat card"><span className="muted">Acidity</span><strong>{profile.acidity.toLowerCase()}</strong></div>
                <div className="stat card"><span className="muted">Sweetness</span><strong>{profile.sweetness.toLowerCase()}</strong></div>
              </div>
            </section>
          ) : null}
        </div>

        <aside className="commerce-box">
          <span className="eyebrow">{product.category.replace("_", " ").toLowerCase()}</span>
          <h1 style={{ color: "var(--espresso)" }}>{product.name}</h1>
          <p className="muted">{product.description}</p>
          {product.roaster ? <a className="pill" href={`/roasters/${product.roaster.slug}`}>{product.roaster.name}</a> : <span className="pill">espress.coffee curated</span>}

          <form className="panel" method="post" action="/api/cart">
            <input type="hidden" name="productSlug" value={product.slug} />
            <div className="field">
              <label htmlFor="variantId">Package / variant</label>
              <select id="variantId" name="variantId" required>
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.label} - {formatCurrency(variant.retailPriceCents)}
                  </option>
                ))}
              </select>
            </div>
            {profile ? (
              <div className="field">
                <label htmlFor="selectedGrind">Grind</label>
                <select id="selectedGrind" name="selectedGrind">
                  {profile.grindOptions.map((grind) => <option key={grind} value={grind}>{grind}</option>)}
                </select>
              </div>
            ) : null}
            <div className="field">
              <label htmlFor="quantity">Quantity</label>
              <input id="quantity" name="quantity" type="number" min="1" max="12" defaultValue="1" />
            </div>
            <button className="button" type="submit">
              <ShoppingCart size={18} />
              Add to cart
            </button>
          </form>
        </aside>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Related</span>
              <h2 style={{ color: "var(--espresso)" }}>More to try next</h2>
            </div>
          </div>
          <div className="grid product-grid">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
