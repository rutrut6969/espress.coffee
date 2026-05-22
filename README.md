# espress.coffee

espress.coffee is a full-stack premium coffee marketplace. Independent roasters publish coffee products, admins curate and manage the marketplace, consumers buy coffee and brewing gear, roasters manage stock and item readiness, and fulfillment handlers manage repackaging, shipment, and tracking.

## Core Functionality

- Consumer marketplace with home, market, product detail, roaster profile, cart, checkout success/cancel, and account pages.
- Coffee flavor profiles for roast level, origin, flavor notes, acidity, body, sweetness, brew methods, and grind options.
- Package size and equipment variants with base cost, markup, retail price, stock, and inventory mode.
- Stripe Checkout order flow that creates pending orders, snapshots prices/profit, and updates payment and fulfillment status through a raw-body webhook.
- Protected admin panel for products, orders, roasters, inventory, featured listings, fulfillment, reports, customers, preview mode, and settings.
- Protected roaster portal for dashboard, product submissions, stock, roaster order statuses, and public profile editing.
- Protected fulfillment portal for dashboard, queue, shipment tracking, and order detail views.
- Role-based access for CUSTOMER, ADMIN, ROASTER, and FULFILLMENT.
- Admin preview mode for customer, roaster, and fulfillment experiences without changing the admin account role.

## Demo Credentials

- Admin: `admin@espress.coffee` / `AdminDemo123!`
- Customer: `customer@espress.coffee` / `CustomerDemo123!`
- Roaster: `roaster@espress.coffee` / `RoasterDemo123!`
- Fulfillment: `fulfillment@espress.coffee` / `FulfillDemo123!`

Additional seeded roaster users use `RoasterDemo123!` with emails like `ember-and-oak-roasters@espress.coffee`.

## Tech Stack

- Frontend/backend: Next.js App Router with TypeScript
- Styling: mobile-first CSS using the espress.coffee palette
- Database: PostgreSQL through Prisma ORM
- Auth: credential login with bcrypt password hashes and signed HTTP-only JWT session cookie
- Payments: Stripe Checkout and webhook handling
- Deployment: Vercel-compatible Next.js app
- Testing: practical smoke script for health, auth, pages, reports, and webhook handler

## Local Setup

```bash
git clone https://github.com/rutrut6969/espress.coffee.git
cd espress.coffee
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `SESSION_SECRET`: long random string for signed session cookies.
- `STRIPE_SECRET_KEY`: Stripe test or production secret key.
- `STRIPE_WEBHOOK_SECRET`: webhook signing secret from Stripe.
- `APP_URL`: public application URL, for example `http://localhost:3000` or the Vercel URL.
- `CORS_ORIGIN`: allowed browser origin for integrations.

No production secrets are included in this repository.

## Stripe Setup

Use Stripe test mode locally. The checkout route builds line items from cart variants and stores a pending order before redirecting to Stripe. If `STRIPE_SECRET_KEY` is missing, local checkout falls back to a demo success page.

Local webhook listener:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the emitted signing secret into `STRIPE_WEBHOOK_SECRET`. In production, create a Stripe webhook for:

- `checkout.session.completed`
- `payment_intent.payment_failed`
- `charge.refunded`

Production deployments should swap test keys for live keys only after the Stripe account and webhook are ready.

The checkout route refuses to redirect to Stripe unless the pending order is saved first. That protects production payments from being collected without a matching espress.coffee order record.

## Database And Seed Data

Prisma schema lives in `prisma/schema.prisma`. It models users, roasters, products, coffee profiles, variants, carts, orders, order items, fulfillment tasks, featured collections, placements, reviews, and admin audit logs. The initial migration is checked in under `prisma/migrations`.

For production or Vercel environments, apply checked-in migrations with:

```bash
npm run prisma:deploy
```

Seed data is in `prisma/seed.ts` and is intentionally demo-safe. It creates:

- 4 core users and one user per sample roaster
- 4 roasters
- 12 coffee products with rich flavor profiles
- 4 coffee package variants per coffee
- 6 non-coffee products
- Featured placements and collections
- 8 sample orders across paid, supply, repackaging, shipped, delivered, and refunded states
- Admin audit log examples

Run:

```bash
npm run db:seed
```

The seed clears demo tables before inserting fresh data, so it is repeatable for review environments.

## Testing

```bash
npm run typecheck
npm run build
npm run test:smoke
```

The smoke script expects the dev server to be running at `APP_URL` and checks the health endpoint, auth login/me/logout behavior, public product pages, protected portal redirects, admin reports, and webhook handler.

## Deployment

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Confirm the project uses the Next.js framework preset. This repo includes `vercel.json` with `.next` as the output directory; remove any Vercel dashboard override that points the output directory to `public`.
4. Attach a PostgreSQL database such as Vercel Postgres, Neon, Supabase, or RDS.
5. Add all environment variables in Vercel project settings.
6. Run `npm run prisma:deploy` during deployment or from a trusted deployment shell.
7. Run `npm run db:seed` for demo review environments only.
8. Configure the production Stripe webhook URL: `https://YOUR_DOMAIN/api/stripe/webhook`.

Install or run the Vercel CLI with:

```bash
npm install -g vercel
# or
npx vercel
```

## Folder Structure

- `app/`: Next.js routes, pages, API route handlers, and portals.
- `components/`: shared navigation, product cards, portal shell, and badges.
- `lib/`: pricing, auth, Prisma, cart, catalog, demo data, and route link helpers.
- `prisma/`: schema and seed script.
- `scripts/`: smoke test script.
- `public/`: static assets.

## Known Limitations / Future Improvements

- Product, stock, shipment, and profile edit buttons currently present safe placeholder controls; persistence endpoints can be expanded from the existing Prisma schema.
- Refund UI, CSV exports, favorites, reviews moderation, and advanced analytics are prepared conceptually but not fully implemented.
- Checkout can run in demo mode without Stripe keys; production payment capture requires real Stripe keys and a reachable database.

## Acceptance Checklist

- Browse the espress.coffee homepage and market.
- View coffee product flavor profiles.
- Add package sizes and grind choices to cart.
- Start Stripe Checkout in test mode.
- Login as admin and review products, roasters, orders, fulfillment, featured listings, reports, customers, preview mode, and settings.
- Login as roaster and review products, stock, orders, and profile.
- Login as fulfillment and review queue, shipments, and order details.
- View sales reports and platform profit.
- Manage featured listing placeholders.
- Review fulfillment and shipping workflows.
