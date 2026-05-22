import Link from "next/link";

type PortalShellProps = {
  title: string;
  eyebrow: string;
  links: Array<{ href: string; label: string }>;
  children: React.ReactNode;
};

export function PortalShell({ title, eyebrow, links, children }: PortalShellProps) {
  return (
    <main className="container portal-layout">
      <section className="panel">
        <span className="eyebrow">{eyebrow}</span>
        <h1 style={{ color: "var(--espresso)", fontSize: "clamp(2rem, 7vw, 4rem)" }}>{title}</h1>
        <nav className="portal-nav" aria-label={`${title} navigation`}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </nav>
      </section>
      {children}
    </main>
  );
}
