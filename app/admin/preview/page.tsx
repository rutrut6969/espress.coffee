import { PortalShell } from "@/components/portal-shell";
import { adminLinks } from "@/lib/portal-links";
import { getPreviewRole, requireRole } from "@/lib/auth";

export default async function AdminPreviewPage() {
  await requireRole(["ADMIN"]);
  const preview = getPreviewRole();
  const options = [
    { role: "CUSTOMER", href: "/market", label: "Preview customer experience" },
    { role: "ROASTER", href: "/roaster", label: "Preview roaster portal" },
    { role: "FULFILLMENT", href: "/fulfillment", label: "Preview fulfillment portal" }
  ];
  return (
    <PortalShell title="Admin preview" eyebrow="Role-safe preview mode" links={adminLinks}>
      <section className="panel">
        <p className="muted">Preview mode changes only the effective browsing view for this admin session. It does not modify the admin account role.</p>
        {preview ? <p className="pill">Current preview: {preview.toLowerCase()}</p> : <p className="pill">Preview mode clear</p>}
        <div className="grid product-grid" style={{ marginTop: 16 }}>
          {options.map((option) => (
            <form className="card card-body" action="/api/preview" method="post" key={option.role}>
              <input type="hidden" name="role" value={option.role} />
              <input type="hidden" name="next" value={option.href} />
              <h3>{option.label}</h3>
              <button className="button" type="submit">Start preview</button>
            </form>
          ))}
          <form className="card card-body" action="/api/preview" method="post">
            <input type="hidden" name="role" value="CLEAR" />
            <input type="hidden" name="next" value="/admin" />
            <h3>Return to admin view</h3>
            <button className="button-secondary" type="submit">Clear preview</button>
          </form>
        </div>
      </section>
    </PortalShell>
  );
}
