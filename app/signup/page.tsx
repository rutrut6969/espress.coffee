export default function SignupPage() {
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 560 }}>
        <form className="panel" method="post" action="/api/auth/login">
          <span className="eyebrow">Demo signup</span>
          <h1 style={{ color: "var(--espresso)" }}>Customer accounts are ready.</h1>
          <p className="muted">For this review build, use the seeded customer account or wire a public registration action on top of the auth helper.</p>
          <input type="hidden" name="email" value="customer@espress.coffee" />
          <input type="hidden" name="password" value="CustomerDemo123!" />
          <input type="hidden" name="next" value="/account" />
          <button className="button" type="submit">Continue as demo customer</button>
        </form>
      </div>
    </main>
  );
}
