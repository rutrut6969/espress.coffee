import { NextResponse } from "next/server";
import { getEffectiveRole, getSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const session = getSessionFromCookies();
  return NextResponse.json({ user: session, effectiveRole: getEffectiveRole(session) });
}
