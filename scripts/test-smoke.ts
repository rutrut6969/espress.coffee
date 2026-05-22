const baseUrl = process.env.APP_URL || "http://localhost:3000";

async function check(path: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual", ...init });
  console.log(`${response.status} ${path}`);
  return response;
}

async function main() {
  await check("/api/health");
  await check("/");
  await check("/market");
  await check("/market/morning-ember-roast");
  await check("/admin");
  await check("/roaster");
  await check("/fulfillment");

  const login = await check("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@espress.coffee", password: "AdminDemo123!" })
  });
  const cookie = login.headers.get("set-cookie");
  if (!cookie && login.status !== 401) throw new Error("Expected auth cookie or explicit auth failure.");

  if (cookie) {
    await check("/api/auth/me", { headers: { cookie } });
    await check("/api/admin/reports", { headers: { cookie } });
  }

  await check("/api/stripe/webhook", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "checkout.session.completed", data: { object: { metadata: { orderId: "demo-order" } } } })
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
