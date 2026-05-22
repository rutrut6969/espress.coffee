import Link from "next/link";

export default function CheckoutSuccessPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return (
    <main className="section">
      <div className="container panel">
        <span className="eyebrow">Order received</span>
        <h1 style={{ color: "var(--espresso)" }}>Thanks for shopping espress.coffee.</h1>
        <p className="muted">
          {searchParams.demo
            ? "Demo checkout completed because Stripe keys are not configured locally."
            : "Stripe confirmed the checkout handoff. The webhook will mark the order paid and move it into the fulfillment workflow."}
        </p>
        <div className="pill-row">
          <Link className="button" href="/account">View account</Link>
          <Link className="button-secondary" href="/market">Keep shopping</Link>
        </div>
      </div>
    </main>
  );
}
