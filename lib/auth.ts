import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { demoUsers } from "@/lib/demo-data";

export const sessionCookieName = "espress_session";
export const previewCookieName = "espress_preview_role";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

function sessionSecret() {
  return process.env.SESSION_SECRET || "dev-only-espress-coffee-session-secret";
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signSession(user: SessionUser) {
  return jwt.sign(user, sessionSecret(), { expiresIn: "7d" });
}

export function readSessionToken(token?: string): SessionUser | null {
  if (!token) return null;
  try {
    return jwt.verify(token, sessionSecret()) as SessionUser;
  } catch {
    return null;
  }
}

export function getSessionFromCookies() {
  return readSessionToken(cookies().get(sessionCookieName)?.value);
}

export function getPreviewRole() {
  const value = cookies().get(previewCookieName)?.value;
  if (value === "CUSTOMER" || value === "ROASTER" || value === "FULFILLMENT") return value;
  return null;
}

export function getEffectiveRole(session: SessionUser | null) {
  if (!session) return null;
  const preview = getPreviewRole();
  return session.role === "ADMIN" && preview ? preview : session.role;
}

export async function requireRole(roles: UserRole[]) {
  const session = getSessionFromCookies();
  if (!session) redirect(`/login?next=/`);
  if (session.role === "ADMIN") return session;
  const effectiveRole = getEffectiveRole(session);
  if (!effectiveRole || !roles.includes(effectiveRole as UserRole)) redirect("/login");
  return session;
}

export async function authenticate(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || user.status !== "ACTIVE") return null;
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch {
    const demo = demoUsers.find((user) => user.email === email.toLowerCase() && user.password === password);
    if (!demo) return null;
    return { id: demo.email, email: demo.email, name: demo.name, role: demo.role as UserRole };
  }
}
