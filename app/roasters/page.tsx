import Link from "next/link";
import { getRoasters } from "@/lib/catalog";
import { StatusBadge } from "@/components/status-badge";

export default async function RoastersPage() {
  const roasters = await getRoasters();

  return (
    <main className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="eyebrow">Roasters</span>
            <h1 style={{ color: "var(--espresso)" }}>Partner roasters on espress.coffee</h1>
          </div>
          <p className="muted">Approved roasters can submit products, manage stock, and coordinate item readiness through the roaster portal.</p>
        </div>
        <div className="grid product-grid">
          {roasters.map((roaster) => (
            <Link href={`/roasters/${roaster.slug}`} className="card card-body" key={roaster.slug}>
              <StatusBadge value={String(roaster.status)} />
              <h3>{roaster.name}</h3>
              <p className="muted">{roaster.description}</p>
              <strong>{roaster.city}, {roaster.state}</strong>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
