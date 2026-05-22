import { PortalShell } from "@/components/portal-shell";
import { StatusBadge } from "@/components/status-badge";
import { adminLinks } from "@/lib/portal-links";
import { getRoasters } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function AdminRoastersPage() {
  await requireRole(["ADMIN"]);
  const roasters = await getRoasters();
  return (
    <PortalShell title="Roasters" eyebrow="Partner review" links={adminLinks}>
      <section className="grid product-grid">
        {roasters.map((roaster) => (
          <article className="card card-body" key={roaster.id}>
            <StatusBadge value={String(roaster.status)} />
            <h3>{roaster.name}</h3>
            <p className="muted">{roaster.description}</p>
            <p><strong>{roaster.products.length}</strong> visible products</p>
            <div className="pill-row"><button className="button-secondary">Approve</button><button className="button-secondary">Suspend</button><button className="button-secondary">Archive</button></div>
          </article>
        ))}
      </section>
    </PortalShell>
  );
}
