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
        <div className="page-hero compact-hero">
          <div>
            <span className="eyebrow">Marketplace</span>
            <h1>Shop espress.coffee</h1>
            <p>Browse coffee beans, brewing equipment, accessories, bundles, and featured marketplace collections.</p>
          </div>
          <div className="field sort-control">
            <label htmlFor="sort">Sort</label>
            <select id="sort" name="sort" defaultValue="featured">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price low to high</option>
              <option value="price-high">Price high to low</option>
            </select>
          </div>
        </div>

        <details className="filter-drawer" open>
          <summary>Filters</summary>
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
        </details>

        <div className="active-filters">
          {Object.entries(searchParams).filter(([, value]) => value).map(([key, value]) => (
            <span className="pill" key={key}>{key}: {value}</span>
          ))}
        </div>

        {products.length ? (
          <div className="grid product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div>
              <span className="eyebrow">No matches</span>
              <h2>No products match those filters.</h2>
              <p className="muted">Clear a filter or search another flavor note.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
