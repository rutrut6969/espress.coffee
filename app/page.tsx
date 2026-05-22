import Link from "next/link";
import { ArrowRight, Coffee, PackageCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { StatusBadge } from "@/components/status-badge";
import { getCatalogProducts, getRoasters } from "@/lib/catalog";

export default async function HomePage() {
  const products = await getCatalogProducts();
  const roasters = await getRoasters();
  const featured = products.filter((product) => product.homepageFeatured).slice(0, 4);
  const gear = products.filter((product) => product.category !== "COFFEE_BEANS").slice(0, 3);
  const steps = [
    { title: "Discover", copy: "Filter by roast, flavor notes, brew method, grind, package size, roaster, and category.", Icon: Coffee },
    { title: "Checkout", copy: "Cart and checkout flows snapshot retail price, base cost, and platform profit.", Icon: Sparkles },
    { title: "Fulfill", copy: "Roaster statuses and repackaging tasks keep supply, packaging, shipment, and tracking aligned.", Icon: PackageCheck }
  ];

  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow">Premium roaster marketplace</span>
          <h1>espress.coffee</h1>
          <p className="lead">
            Independent roasts, flavor-forward discovery, curated brewing tools, and fulfillment workflows built for a polished coffee ecommerce experience.
          </p>
          <div className="hero-cta-row">
            <Link className="button" href="/market">
              Shop the market <ArrowRight size={18} />
            </Link>
            <Link className="button-secondary" href="/roasters">Explore roasters</Link>
          </div>
          <div className="hero-stat-row">
            <div><strong>12+</strong><span>coffee profiles</span></div>
            <div><strong>4</strong><span>partner roasters</span></div>
            <div><strong>6</strong><span>curated gear picks</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Featured roasts</span>
              <h2>Admin-curated coffees ready for your bar.</h2>
            </div>
            <p>Every coffee on espress.coffee carries roast, origin, body, acidity, sweetness, brew method, grind, package, and profit snapshot data.</p>
          </div>
          <div className="grid product-grid">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="section section-band">
        <div className="container dashboard-grid">
          {steps.map(({ title, copy, Icon }) => (
            <div className="data-card step-card" key={title}>
              <Icon size={24} color="#C9823B" />
              <h3>{title}</h3>
              <p className="muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Shop by flavor</span>
              <h2>Profiles customers can actually taste.</h2>
            </div>
            <p>Chocolate, citrus, berry, caramel, florals, full-body espresso, and low-acidity comfort roasts are visible across cards, detail pages, filters, and portals.</p>
          </div>
          <div className="pill-row">
            {["chocolate", "brown sugar", "orange zest", "blueberry", "caramel", "floral honey", "dark cocoa", "toasted almond", "strawberry"].map((note) => (
              <Link className="pill" href={`/market?q=${encodeURIComponent(note)}`} key={note}>{note}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-band">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Roaster spotlight</span>
              <h2>Independent partners, curated by espress.coffee.</h2>
            </div>
            <Link className="button-secondary" href="/roasters">View all roasters</Link>
          </div>
          <div className="grid product-grid">
            {roasters.slice(0, 4).map((roaster) => (
              <Link className="card card-body" key={roaster.slug} href={`/roasters/${roaster.slug}`}>
                <StatusBadge value={String(roaster.status)} />
                <h3>{roaster.name}</h3>
                <p className="muted">{roaster.description}</p>
                <strong>{roaster.city}, {roaster.state}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Brewing gear</span>
              <h2>Tools that make the roast shine.</h2>
            </div>
            <Link className="button-secondary" href="/market?category=BREWING_EQUIPMENT">Shop gear</Link>
          </div>
          <div className="grid product-grid">
            {gear.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
