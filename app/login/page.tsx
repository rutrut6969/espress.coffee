import Link from "next/link";

const demoAccounts = [
  ["Admin", "admin@espress.coffee", "AdminDemo123!", "/admin"],
  ["Customer", "customer@espress.coffee", "CustomerDemo123!", "/account"],
  ["Roaster", "roaster@espress.coffee", "RoasterDemo123!", "/roaster"],
  ["Fulfillment", "fulfillment@espress.coffee", "FulfillDemo123!", "/fulfillment"]
];

export default function LoginPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return (
    <main className="section auth-page">
      <div className="container auth-grid">
        <form className="form-card" method="post" action="/api/auth/login">
          <span className="eyebrow">Login</span>
          <h1>Access espress.coffee</h1>
          <p className="muted">Sign in to shop, manage marketplace operations, coordinate roaster orders, or run fulfillment.</p>
          {searchParams.error ? <p className="status-badge status-badge-danger">Invalid or suspended account</p> : null}
          <input type="hidden" name="next" value={searchParams.next ?? "/account"} />
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required placeholder="Enter your password" autoComplete="current-password" />
          </div>
          <button className="button" type="submit">Login</button>
          <Link href="/signup">Create customer account</Link>
        </form>
        <aside className="data-card demo-account-card">
          <span className="eyebrow">Demo accounts</span>
          <h2>Review every role without changing data.</h2>
          <p className="muted">Use these seeded credentials for the client demo. Fields stay empty so production login does not look pre-filled.</p>
          <div className="mobile-card-list">
            {demoAccounts.map(([role, email, password, next]) => (
              <div className="demo-account" key={role}>
                <div>
                  <strong>{role}</strong>
                  <span>{email}</span>
                  <span>{password}</span>
                </div>
                <Link className="button-secondary" href={`/login?next=${encodeURIComponent(next)}`}>Use</Link>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
