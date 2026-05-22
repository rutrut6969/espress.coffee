export function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes("demo:demo@localhost")) return false;
  if (url.includes("USER:PASSWORD@HOST")) return false;
  return true;
}
