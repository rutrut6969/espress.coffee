import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { hydrateCart } from "@/lib/cart";
import { formatCurrency } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const items = await hydrateCart();
  const subtotal = items.reduce((sum, item) => sum + item.variant.retailPriceCents * item.quantity, 0);
  const shipping = subtotal > 0 ? 600 : 0;
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + shipping + tax;

  return (
    <main className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="eyebrow">Cart</span>
            <h1 style={{ color: "var(--espresso)" }}>Your espress.coffee order</h1>
          </div>
          <Link className="button-secondary" href="/market">Continue shopping</Link>
        </div>

        {items.length === 0 ? (
          <div className="panel">
            <p className="muted">Your cart is ready for coffee.</p>
            <Link className="button" href="/market"><ShoppingBag size={18} /> Shop market</Link>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", alignItems: "start" }}>
            <div className="grid">
              {items.map((item) => (
                <div className="card card-body" key={`${item.productSlug}-${item.variantId}-${item.selectedGrind}`}>
                  <div style={{ display: "grid", gridTemplateColumns: "86px 1fr", gap: 14 }}>
                    <Image src={item.product.images[0]} alt={item.product.name} width={86} height={86} unoptimized style={{ width: 86, height: 86, objectFit: "cover", borderRadius: 8 }} />
                    <div>
                      <h3>{item.product.name}</h3>
                      <p className="muted" style={{ margin: 0 }}>{item.variant.label} {item.selectedGrind ? `- ${item.selectedGrind}` : ""}</p>
                      <strong>{item.quantity} x {formatCurrency(item.variant.retailPriceCents)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <form className="panel" method="post" action="/api/checkout">
              <h2 style={{ color: "var(--espresso)" }}>Checkout</h2>
              <div className="field"><label>Name</label><input name="customerName" required defaultValue="Casey Customer" /></div>
              <div className="field"><label>Email</label><input name="customerEmail" type="email" required defaultValue="customer@espress.coffee" /></div>
              <div className="field"><label>Shipping address</label><textarea name="shippingAddress" required defaultValue={"123 Coffee Lane\nAsheville, NC 28801"} /></div>
              <p className="muted">Subtotal: {formatCurrency(subtotal)}</p>
              <p className="muted">Shipping: {formatCurrency(shipping)}</p>
              <p className="muted">Estimated tax: {formatCurrency(tax)}</p>
              <h3>Total {formatCurrency(total)}</h3>
              <button className="button" type="submit">Go to Stripe Checkout</button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
