import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="section">
      <div className="container panel">
        <span className="eyebrow">Checkout canceled</span>
        <h1 style={{ color: "var(--espresso)" }}>Your cart is still waiting.</h1>
        <p className="muted">No payment was captured. Return to cart when you are ready.</p>
        <Link className="button" href="/cart">Back to cart</Link>
      </div>
    </main>
  );
}
