import Link from "next/link";

export default function LoginPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <form className="panel" method="post" action="/api/auth/login">
          <span className="eyebrow">Login</span>
          <h1 style={{ color: "var(--espresso)" }}>Access espress.coffee</h1>
          {searchParams.error ? <p className="pill">Invalid or suspended account</p> : null}
          <input type="hidden" name="next" value={searchParams.next ?? "/account"} />
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" required defaultValue="admin@espress.coffee" />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" required defaultValue="AdminDemo123!" />
          </div>
          <button className="button" type="submit">Login</button>
          <p className="muted">Demo accounts are documented in the README. New customers can also create an account.</p>
          <Link href="/signup">Create customer account</Link>
        </form>
      </div>
    </main>
  );
}
