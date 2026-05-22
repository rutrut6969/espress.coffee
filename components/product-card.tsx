import Link from "next/link";
import { Coffee, PackageCheck } from "lucide-react";
import { CatalogProduct } from "@/lib/catalog";
import { formatCurrency } from "@/lib/pricing";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const firstVariant = product.variants[0];
  const notes = product.coffeeProfile?.flavorNotes.slice(0, 3) ?? product.tags.slice(0, 3);

  return (
    <Link className="card product-card" href={`/market/${product.slug}`}>
      <img className="product-image" src={product.images[0]} alt={product.name} />
      <div className="card-body">
        <div className="pill-row">
          <span className="pill">
            {product.category === "COFFEE_BEANS" ? <Coffee size={14} /> : <PackageCheck size={14} />}
            {product.category.replace("_", " ").toLowerCase()}
          </span>
          {product.coffeeProfile ? <span className="pill">{product.coffeeProfile.roastLevel.replace("_", " ").toLowerCase()}</span> : null}
        </div>
        <div>
          <h3>{product.name}</h3>
          <p className="muted" style={{ margin: 0 }}>{product.roaster?.name ?? "espress.coffee curated gear"}</p>
        </div>
        <p className="muted" style={{ margin: 0 }}>{product.shortDescription}</p>
        <div className="pill-row">
          {notes.map((note) => (
            <span className="pill" key={note}>{note}</span>
          ))}
        </div>
        <strong>From {firstVariant ? formatCurrency(firstVariant.retailPriceCents) : "soon"}</strong>
      </div>
    </Link>
  );
}
