import { PortalShell } from "@/components/portal-shell";
import { roasterLinks } from "@/lib/portal-links";
import { getRoasters } from "@/lib/catalog";
import { requireRole } from "@/lib/auth";

export default async function RoasterProfilePortalPage() {
  await requireRole(["ROASTER"]);
  const roaster = (await getRoasters())[0];
  return (
    <PortalShell title="Roaster profile" eyebrow="Public profile" links={roasterLinks}>
      <form className="panel">
        <div className="field"><label>Name</label><input defaultValue={roaster?.name} /></div>
        <div className="field"><label>Description</label><textarea defaultValue={roaster?.description} /></div>
        <div className="field"><label>Business email</label><input defaultValue={roaster?.businessEmail} /></div>
        <div className="field"><label>Website</label><input defaultValue={roaster?.website ?? ""} /></div>
        <button className="button" type="button">Save profile draft</button>
      </form>
    </PortalShell>
  );
}
