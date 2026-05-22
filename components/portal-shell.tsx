"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type PortalShellProps = {
  title: string;
  eyebrow: string;
  description?: string;
  links: Array<{ href: string; label: string }>;
  children: React.ReactNode;
};

export function PortalShell({ title, eyebrow, description, links, children }: PortalShellProps) {
  const pathname = usePathname();

  return (
    <main className="container portal-frame">
      <header className="dashboard-header">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
      </header>
      <div className="portal-layout">
        <aside className="portal-sidebar" aria-label={`${title} navigation`}>
          <div className="role-chip">{title}</div>
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </aside>
        <details className="portal-menu">
          <summary>Portal Menu</summary>
          <nav>
            {links.map((link) => (
              <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>
        </details>
        <section className="portal-content">{children}</section>
      </div>
    </main>
  );
}
