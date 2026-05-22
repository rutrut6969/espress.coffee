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
        <div className="page-hero compact-hero">
          <div>
            <span className="eyebrow">Cart</span>
            <h1>Your espress.coffee order</h1>
            <p>Review grind, package size, and delivery details before checkout.</p>
          </div>
          <Link className="button-secondary" href="/market">Continue shopping</Link>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div>
              <span className="eyebrow">Empty cart</span>
              <h2>Your cart is ready for coffee.</h2>
              <p className="muted">Start with a featured roast, choose your grind, and come back here to checkout.</p>
            </div>
            <Link className="button" href="/market"><ShoppingBag size={18} /> Shop market</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="mobile-card-list">
              {items.map((item) => (
                <div className="cart-item data-card" key={`${item.productSlug}-${item.variantId}-${item.selectedGrind}`}>
                  <div className="cart-item-main">
                    <Image src={item.product.images[0]} alt={item.product.name} width={96} height={96} unoptimized />
                    <div>
                      <h3>{item.product.name}</h3>
                      <p className="muted">{item.variant.label} {item.selectedGrind ? `- ${item.selectedGrind}` : ""}</p>
                      <div className="pill-row">
                        <span className="pill">Qty {item.quantity}</span>
                        <span className="pill">Update soon</span>
                        <span className="pill">Remove soon</span>
                      </div>
                    </div>
                  </div>
                  <strong>{item.quantity} x {formatCurrency(item.variant.retailPriceCents)}</strong>
                </div>
              ))}
            </div>
            <form className="form-card checkout-card" method="post" action="/api/checkout">
              <span className="eyebrow">Checkout</span>
              <h2>Shipping details</h2>
              <p className="muted">Demo review data can be entered here; fields are intentionally blank for production realism.</p>
              <div className="field"><label htmlFor="customerName">Name</label><input id="customerName" name="customerName" required placeholder="Casey Customer" autoComplete="name" /></div>
              <div className="field"><label htmlFor="customerEmail">Email</label><input id="customerEmail" name="customerEmail" type="email" required placeholder="customer@espress.coffee" autoComplete="email" /></div>
              <div className="field"><label htmlFor="shippingAddress">Shipping address</label><textarea id="shippingAddress" name="shippingAddress" required placeholder={"123 Coffee Lane\nAsheville, NC 28801"} autoComplete="shipping street-address" /></div>
              <div className="totals-box">
                <span>Subtotal <strong>{formatCurrency(subtotal)}</strong></span>
                <span>Shipping <strong>{formatCurrency(shipping)}</strong></span>
                <span>Estimated tax <strong>{formatCurrency(tax)}</strong></span>
                <span className="total-line">Total <strong>{formatCurrency(total)}</strong></span>
              </div>
              <button className="button" type="submit">Go to Stripe Checkout</button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
