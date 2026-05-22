import { NextResponse } from "next/server";
import { previewCookieName, sessionCookieName } from "@/lib/auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url), { status: 303 });
  response.cookies.delete(sessionCookieName);
  response.cookies.delete(previewCookieName);
  return response;
}
