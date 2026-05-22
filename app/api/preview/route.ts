import { NextResponse } from "next/server";
import { getSessionFromCookies, previewCookieName } from "@/lib/auth";

export async function POST(request: Request) {
  const session = getSessionFromCookies();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const formData = await request.formData();
  const role = String(formData.get("role") ?? "CLEAR");
  const next = String(formData.get("next") ?? "/admin");
  const response = NextResponse.redirect(new URL(next, request.url), { status: 303 });
  if (role === "CUSTOMER" || role === "ROASTER" || role === "FULFILLMENT") {
    response.cookies.set(previewCookieName, role, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 4 });
  } else {
    response.cookies.delete(previewCookieName);
  }
  return response;
}
