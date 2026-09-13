# Kolabo

A creator marketplace: influencers list their accounts for free, businesses
pay a monthly subscription to search the directory, message creators, and
negotiate deals — all inside the app.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind**, **Clerk**
for authentication, **Supabase (Postgres)** for the database, and **Stripe**
for the monthly business subscription. Designed to deploy on **Vercel**.

This is the "core marketplace" MVP: creator profiles, search & filters,
business subscriptions, and in-app messaging to negotiate deals. It does
**not** yet include structured deal/contract objects or paying creators
through the platform (Stripe Connect) — see "What's not built yet" below.

---

## 1. What you're getting

```
app/
  page.tsx                        Landing page
  sign-in/, sign-up/              Clerk auth pages
  onboarding/                     Pick "creator" or "business" after signup
  creators/                       Public directory + search/filter
  creators/[creatorId]/           Public creator profile page
  dashboard/creator/              Creator: edit + publish profile
  dashboard/business/             Business: company profile + subscription
  messages/                       Conversation list + thread (both roles)
  api/                            All server-side routes (see below)
components/                       All React components (forms, cards, etc.)
lib/                              Supabase clients, auth helpers, Stripe, types
supabase/schema.sql               Full database schema — run this once in Supabase
middleware.ts                     Clerk route protection
```

Key API routes:
- `POST /api/onboarding` — sets a user's role and creates their creator/business row
- `PUT /api/creator-profile` — creator saves/publishes their profile
- `PUT /api/business-profile` — business saves its company profile
- `POST /api/stripe/checkout` — starts a Stripe Checkout session for the monthly plan
- `POST /api/stripe/portal` — opens the Stripe customer billing portal
- `POST /api/webhooks/stripe` — keeps subscription status in sync with Stripe
- `POST /api/webhooks/clerk` — cleans up Supabase rows if a user deletes their account
- `POST /api/conversations` — business starts a conversation with a creator (subscription-gated)
- `POST /api/messages` — send a message in a conversation (subscription-gated for businesses)

**A note on how auth + database talk to each other:** Clerk handles sign-in
and stores each user's role (`creator` or `business`) in Clerk's
`publicMetadata`. Every database write goes through a Next.js API route,
which checks the caller's Clerk session and role in code, then uses
Supabase's **service role key** (server-only, bypasses Row Level Security)
to read/write. The public `anon` key is only ever used to read *published*
creator profiles for the directory. This keeps things simple to set up
correctly — see `supabase/schema.sql` for the RLS policy.

---

## 2. Before you start: create your accounts

You'll need four things. Free tiers work fine to build and test.

1. **Vercel** — https://vercel.com (sign up with GitHub, it's easiest)
2. **Clerk** — https://dashboard.clerk.com → "Create application"
   - Enable Email and/or Google/whatever sign-in methods you want
3. **Supabase** — https://supabase.com/dashboard → "New project"
   - Pick a region close to your users, set a database password (save it)
4. **Stripe** — https://dashboard.stripe.com (use test mode while building)

Keep each dashboard open in a tab — you'll copy keys from each into `.env.local`.

---

## 3. Set up Supabase

1. In your Supabase project, go to **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this project, paste the whole thing in, and click **Run**.
   This creates all five tables (`creators`, `businesses`, `subscriptions`,
   `conversations`, `messages`), their indexes, and Row Level Security policies.
3. Go to **Project Settings → API**. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ keep this secret — never put it in client-side code or commit it)

---

## 4. Set up Clerk

1. In Clerk's dashboard → **API Keys**. Copy:
   - `Publishable key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `Secret key` → `CLERK_SECRET_KEY`
2. (Optional but recommended) **Webhooks → Add Endpoint**:
   - URL: `https://yourdomain.com/api/webhooks/clerk` (set this up after your first deploy)
   - Subscribe to: `user.deleted`
   - Copy the **Signing Secret** → `CLERK_WEBHOOK_SECRET`
3. The app already points Clerk's redirect URLs at `/onboarding` after
   sign-in/sign-up (set via env vars in `.env.example`) — no dashboard
   changes needed for that.

---

## 5. Set up Stripe

1. **Product catalog → Add product.** Name it something like "Kolabo — Business plan".
   Add a **recurring price**, billing period **Monthly**, in whatever
   currency/amount you want to charge. Save, then copy the **Price ID**
   (starts with `price_...`) → `STRIPE_BUSINESS_MONTHLY_PRICE_ID`.
2. **Developers → API keys.** Copy:
   - `Secret key` → `STRIPE_SECRET_KEY`
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. **Webhooks** — you'll do this *after* your first deploy, once you have a
   real URL (see step 8). For now, leave `STRIPE_WEBHOOK_SECRET` blank or
   use the placeholder.

---

## 6. Run it locally

You'll need Node.js 18.17+ installed.

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and fill in every value you collected above (Supabase,
Clerk, Stripe). For local dev, set `NEXT_PUBLIC_APP_URL=http://localhost:3000`.

```bash
npm run dev
```

Visit http://localhost:3000. Sign up once as a business and once as a
creator (use two different email addresses, or Clerk's dashboard to delete
a test user between tries) to see both sides of the flow.

**Testing Stripe locally:** install the [Stripe CLI](https://docs.stripe.com/stripe-cli),
then run:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This prints a webhook signing secret starting with `whsec_...` — put that
in `.env.local` as `STRIPE_WEBHOOK_SECRET` while testing locally. Use
Stripe's [test card `4242 4242 4242 4242`](https://docs.stripe.com/testing)
with any future expiry/CVC to complete a test subscription.

---

## 7. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Kolabo"
```

Create a new repo on GitHub, then:

```bash
git remote add origin https://github.com/<you>/kolabo.git
git branch -M main
git push -u origin main
```

---

## 8. Deploy to Vercel

1. https://vercel.com/new → **Import** your `kolabo` GitHub repo.
2. Framework preset: Next.js (auto-detected). Leave build settings as default.
3. Before deploying, add **all** the environment variables from
   `.env.example` in the Vercel project settings (Settings → Environment
   Variables) — same names, real values. Set `NEXT_PUBLIC_APP_URL` to your
   Vercel URL (e.g. `https://kolabo.vercel.app`, or your custom domain).
4. Click **Deploy**.
5. Once live, go back to **Stripe → Developers → Webhooks → Add endpoint**:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to send: `customer.subscription.created`,
     `customer.subscription.updated`, `customer.subscription.deleted`,
     `checkout.session.completed`
   - Copy the new **Signing secret** → update `STRIPE_WEBHOOK_SECRET` in
     Vercel's env vars, then redeploy (Vercel → Deployments → ⋯ → Redeploy).
6. Do the same for the **Clerk webhook** (step 4.2 above) now that you have a real URL.
7. In Clerk, add your production domain under **Domains**, and in Stripe
   switch from test mode to live mode (with live keys) when you're ready to
   charge real businesses.

That's it — Kolabo is live.

---

## 9. How the core flows work

**Creator signs up** → picks "I'm a creator" on `/onboarding` → a blank,
unpublished profile row is created → they fill in platforms, rates, bio on
`/dashboard/creator` → click **Publish profile** → now visible on
`/creators`.

**Business signs up** → picks "I'm a business" → fills in company info on
`/dashboard/business` → clicks **Subscribe now** → Stripe Checkout → on
success, Stripe's webhook flips their `subscriptions.status` to `active` →
they can now click **Contact this creator** on any profile, which opens a
conversation and gates messaging on that active status.

**Messaging** is one thread per (business, creator) pair. Both sides see it
under `/messages`. If a business's subscription lapses (canceled, payment
failed), sending new messages is blocked until they reactivate via **Manage
billing**, but existing message history stays visible.

---

## 10. What's not built yet (roadmap)

You chose the "core marketplace" scope to start, so these were intentionally
left out — happy to build any of them next:

- **Structured deals**: right now, negotiation happens as free-form chat in
  messages. A formal "deal" object (offer amount, deliverables, accept/
  decline, status tracking) would sit on top of the existing conversation.
- **Paying creators through the platform**: would need Stripe Connect
  (creators onboard a connected account, businesses pay into escrow,
  platform takes a cut, funds release on deal completion). Bigger lift —
  worth doing once the core marketplace has real usage.
- **Creator verification / trust badges.**
- **Email notifications** for new messages (Clerk + Resend/Postmark would
  be a natural fit).
- **Image uploads** for avatars/logos (currently just URL fields — wire up
  Supabase Storage or Clerk's image upload when ready).
- **Admin moderation tools** for reported profiles/messages.

---

## 11. A note on how this was built

This project's source code was written in full, but `npm install` /
`npm run build` could not be run in the environment that generated it (no
package-registry access there) — so double-check `npm run build` locally
before your first deploy; if anything doesn't compile, share the error and
it can be fixed quickly.
