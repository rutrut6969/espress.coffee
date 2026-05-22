import { NextResponse } from "next/server";
import { cartCookieName, encodeCart, readCookieCart } from "@/lib/cart";

export async function POST(request: Request) {
  const formData = await request.formData();
  const productSlug = String(formData.get("productSlug") ?? "");
  const variantId = String(formData.get("variantId") ?? "");
  const selectedGrind = String(formData.get("selectedGrind") ?? "") || undefined;
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));
  const cart = readCookieCart();
  const existing = cart.find((item) => item.productSlug === productSlug && item.variantId === variantId && item.selectedGrind === selectedGrind);

  if (existing) existing.quantity += quantity;
  else cart.push({ productSlug, variantId, selectedGrind, quantity });

  const response = NextResponse.redirect(new URL("/cart", request.url), { status: 303 });
  response.cookies.set(cartCookieName, encodeCart(cart), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return response;
}

export async function DELETE(request: Request) {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(cartCookieName);
  return response;
}
