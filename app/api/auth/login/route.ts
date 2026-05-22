import { NextResponse } from "next/server";
import { authenticate, sessionCookieName, signSession } from "@/lib/auth";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());
  const user = await authenticate(String(data.email), String(data.password));
  const next = String(data.next ?? "/account");

  if (!user) {
    if (contentType.includes("application/json")) return NextResponse.json({ error: "Invalid login" }, { status: 401 });
    return NextResponse.redirect(new URL(`/login?error=1&next=${encodeURIComponent(next)}`, request.url), { status: 303 });
  }

  const response = contentType.includes("application/json")
    ? NextResponse.json({ user })
    : NextResponse.redirect(new URL(next, request.url), { status: 303 });
  response.cookies.set(sessionCookieName, signSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}
