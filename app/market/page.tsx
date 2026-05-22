import { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { getCatalogProducts, getRoasters } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Market"
};

export default async function MarketPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const products = await getCatalogProducts({
    category: searchParams.category,
    roast: searchParams.roast,
    roaster: searchParams.roaster,
    q: searchParams.q
  });
  const roasters = await getRoasters();

  return (
    <main className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="eyebrow">Marketplace</span>
            <h1 style={{ color: "var(--espresso)" }}>Shop espress.coffee</h1>
          </div>
          <p className="muted">Browse coffee beans, brewing equipment, accessories, bundles, and featured marketplace collections.</p>
        </div>

        <form className="filters">
          <div className="field">
            <label htmlFor="q">Search</label>
            <input id="q" name="q" defaultValue={searchParams.q} placeholder="flavor, roast, product" />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={searchParams.category ?? ""}>
              <option value="">All</option>
              <option value="COFFEE_BEANS">Coffee beans</option>
              <option value="BREWING_EQUIPMENT">Brewing equipment</option>
              <option value="ACCESSORY">Accessory</option>
              <option value="BUNDLE">Bundle</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="roast">Roast</label>
            <select id="roast" name="roast" defaultValue={searchParams.roast ?? ""}>
              <option value="">Any</option>
              {["LIGHT", "MEDIUM_LIGHT", "MEDIUM", "MEDIUM_DARK", "DARK", "ESPRESSO"].map((roast) => (
                <option key={roast} value={roast}>{roast.replace("_", " ").toLowerCase()}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="roaster">Roaster</label>
            <select id="roaster" name="roaster" defaultValue={searchParams.roaster ?? ""}>
              <option value="">All</option>
              {roasters.map((roaster) => <option value={roaster.slug} key={roaster.slug}>{roaster.name}</option>)}
            </select>
          </div>
          <button className="button" type="submit">Apply</button>
        </form>

        <div className="grid product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </main>
  );
}
