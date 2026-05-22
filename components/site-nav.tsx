import Link from "next/link";
import { LayoutDashboard, ShoppingBag, ShoppingCart, UserRound } from "lucide-react";
import { getSessionFromCookies, getPreviewRole } from "@/lib/auth";

export function SiteNav() {
  const session = getSessionFromCookies();
  const preview = getPreviewRole();

  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Main navigation">
        <Link href="/" className="brand" aria-label="espress.coffee home">
          espress<span>.coffee</span>
        </Link>
        <div className="nav-links">
          <Link href="/market">Market</Link>
          <Link href="/roasters">Roasters</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/roaster">Roaster</Link>
          <Link href="/fulfillment">Fulfillment</Link>
        </div>
        <div className="nav-actions">
          {preview ? <span className="pill">Previewing {preview.toLowerCase()}</span> : null}
          <Link className="icon-button" href="/cart" aria-label="Cart" title="Cart">
            <ShoppingCart size={18} />
          </Link>
          <Link className="icon-button" href={session ? "/account" : "/login"} aria-label="Account" title="Account">
            <UserRound size={18} />
          </Link>
          {session?.role === "ADMIN" ? (
            <Link className="icon-button" href="/admin" aria-label="Admin panel" title="Admin panel">
              <LayoutDashboard size={18} />
            </Link>
          ) : null}
          <Link className="button-secondary" href="/market">
            <ShoppingBag size={18} />
            Shop
          </Link>
        </div>
      </nav>
    </header>
  );
}
