import { PortalShell } from "@/components/portal-shell";
import { adminLinks } from "@/lib/portal-links";
import { requireRole } from "@/lib/auth";

export default async function AdminSettingsPage() {
  await requireRole(["ADMIN"]);
  return (
    <PortalShell title="Settings" eyebrow="Platform configuration" links={adminLinks}>
      <section className="grid product-grid">
        {[
          ["Default markup", "Percentage markup defaults for coffee and gear variants."],
          ["Shipping settings", "Standard repackaging and shipping rules placeholder."],
          ["Tax settings", "Tax calculation placeholder ready for provider integration."],
          ["Stripe status", process.env.STRIPE_SECRET_KEY ? "Stripe secret configured." : "Stripe secret missing in this environment."],
          ["Brand settings", "Visible brand name: espress.coffee"]
        ].map(([title, copy]) => <article className="card card-body" key={title}><h3>{title}</h3><p className="muted">{copy}</p></article>)}
      </section>
    </PortalShell>
  );
}
