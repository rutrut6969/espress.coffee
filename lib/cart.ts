import { cookies } from "next/headers";
import { getProductBySlug } from "@/lib/catalog";

export const cartCookieName = "espress_cart";

export type CookieCartItem = {
  productSlug: string;
  variantId: string;
  quantity: number;
  selectedGrind?: string;
};

export function readCookieCart(): CookieCartItem[] {
  const raw = cookies().get(cartCookieName)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function encodeCart(items: CookieCartItem[]) {
  return Buffer.from(JSON.stringify(items)).toString("base64url");
}

export async function hydrateCart() {
  const items = readCookieCart();
  const hydrated = [];

  for (const item of items) {
    const product = await getProductBySlug(item.productSlug);
    const variant = product?.variants.find((candidate) => candidate.id === item.variantId || candidate.sku === item.variantId);
    if (product && variant) hydrated.push({ ...item, product, variant });
  }

  return hydrated;
}
