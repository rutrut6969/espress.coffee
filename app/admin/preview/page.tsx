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
    <PortalShell title="Admin preview" eyebrow="Role-safe preview mode" description="Safely preview customer, roaster, and fulfillment experiences without changing your admin role." links={adminLinks}>
      <section className="data-card preview-mode-panel">
        <p className="muted">Preview mode changes only the effective browsing view for this admin session. It does not modify the admin account role.</p>
        {preview ? <p className="status-badge status-badge-warning">Current preview: {preview.toLowerCase()}</p> : <p className="status-badge status-badge-success">Preview mode clear</p>}
        <div className="dashboard-grid preview-card-grid">
          {options.map((option) => (
            <form className="data-card preview-card" action="/api/preview" method="post" key={option.role}>
              <input type="hidden" name="role" value={option.role} />
              <input type="hidden" name="next" value={option.href} />
              <h3>{option.label}</h3>
              <p className="muted">Open the {option.role.toLowerCase()} surface using safe route state.</p>
              <button className="button" type="submit">Start preview</button>
            </form>
          ))}
          <form className="data-card preview-card admin-return-card" action="/api/preview" method="post">
            <input type="hidden" name="role" value="CLEAR" />
            <input type="hidden" name="next" value="/admin" />
            <h3>Return to admin view</h3>
            <p className="muted">Clear preview mode and go back to the admin dashboard.</p>
            <button className="button-secondary" type="submit">Clear preview</button>
          </form>
        </div>
      </section>
    </PortalShell>
  );
}
