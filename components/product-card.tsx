import Link from "next/link";
import Image from "next/image";
import { Coffee, PackageCheck } from "lucide-react";
import { CatalogProduct } from "@/lib/catalog";
import { formatCurrency } from "@/lib/pricing";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const firstVariant = product.variants[0];
  const notes = product.coffeeProfile?.flavorNotes.slice(0, 3) ?? product.tags.slice(0, 3);

  return (
    <Link className="card product-card" href={`/market/${product.slug}`}>
      <Image className="product-image" src={product.images[0]} alt={product.name} width={1200} height={900} unoptimized />
      <div className="card-body">
        <div className="product-meta">
          <span className={`status-badge ${product.category === "COFFEE_BEANS" ? "status-badge-work" : "status-badge-neutral"}`}>
            {product.category === "COFFEE_BEANS" ? <Coffee size={14} /> : <PackageCheck size={14} />}
            {product.category.replace("_", " ").toLowerCase()}
          </span>
          {product.coffeeProfile ? <span className="status-badge status-badge-warning">{product.coffeeProfile.roastLevel.replace("_", " ").toLowerCase()}</span> : null}
        </div>
        <div>
          <h3>{product.name}</h3>
          <p className="muted" style={{ margin: 0 }}>{product.roaster?.name ?? "espress.coffee curated gear"}</p>
        </div>
        <p className="muted" style={{ margin: 0 }}>{product.shortDescription}</p>
        <div className="pill-row flavor-list">
          {notes.map((note) => (
            <span className="pill" key={note}>{note}</span>
          ))}
        </div>
        <div className="price-line">
          <strong>From {firstVariant ? formatCurrency(firstVariant.retailPriceCents) : "soon"}</strong>
          <span>View product</span>
        </div>
      </div>
    </Link>
  );
}
