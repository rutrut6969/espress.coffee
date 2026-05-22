import Link from "next/link";
import { BriefcaseBusiness, LayoutDashboard, Menu, PackageCheck, ShoppingBag, ShoppingCart, UserRound } from "lucide-react";
import { getSessionFromCookies, getPreviewRole } from "@/lib/auth";

export function SiteNav() {
  const session = getSessionFromCookies();
  const preview = getPreviewRole();
  const roleLink =
    session?.role === "ADMIN"
      ? { href: "/admin", label: "Admin Panel", icon: LayoutDashboard }
      : session?.role === "ROASTER"
        ? { href: "/roaster", label: "Roaster Portal", icon: BriefcaseBusiness }
        : session?.role === "FULFILLMENT"
          ? { href: "/fulfillment", label: "Fulfillment Portal", icon: PackageCheck }
          : null;
  const RoleIcon = roleLink?.icon;

  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Main navigation">
        <Link href="/" className="brand" aria-label="espress.coffee home">
          espress<span>.coffee</span>
        </Link>
        <div className="nav-links desktop-nav">
          <Link href="/market">Market</Link>
          <Link href="/roasters">Roasters</Link>
          {roleLink ? <Link href={roleLink.href}>{roleLink.label}</Link> : null}
          {!session ? (
            <details className="demo-portals">
              <summary>Demo Portals</summary>
              <div>
                <Link href="/login?next=/admin">Admin</Link>
                <Link href="/login?next=/roaster">Roaster</Link>
                <Link href="/login?next=/fulfillment">Fulfillment</Link>
              </div>
            </details>
          ) : null}
        </div>
        <div className="nav-actions">
          {preview ? <Link className="role-chip preview-chip" href="/admin/preview">Previewing {preview.toLowerCase()}</Link> : null}
          <Link className="icon-button" href="/cart" aria-label="Cart" title="Cart">
            <ShoppingCart size={18} />
          </Link>
          <Link className="icon-button" href={session ? "/account" : "/login"} aria-label="Account" title="Account">
            <UserRound size={18} />
          </Link>
          {roleLink && RoleIcon ? (
            <Link className="icon-button" href={roleLink.href} aria-label={roleLink.label} title={roleLink.label}>
              <RoleIcon size={18} />
            </Link>
          ) : null}
          <Link className="button-secondary" href="/market">
            <ShoppingBag size={18} />
            Shop
          </Link>
          <details className="mobile-menu">
            <summary aria-label="Open menu">
              <Menu size={20} />
            </summary>
            <div>
              <Link href="/market">Market</Link>
              <Link href="/roasters">Roasters</Link>
              <Link href="/cart">Cart</Link>
              <Link href={session ? "/account" : "/login"}>{session ? "Account" : "Login"}</Link>
              {roleLink ? <Link href={roleLink.href}>{roleLink.label}</Link> : null}
              {!session ? (
                <>
                  <span>Demo portals</span>
                  <Link href="/login?next=/admin">Admin demo</Link>
                  <Link href="/login?next=/roaster">Roaster demo</Link>
                  <Link href="/login?next=/fulfillment">Fulfillment demo</Link>
                </>
              ) : null}
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
