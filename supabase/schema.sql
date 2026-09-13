-- ─────────────────────────────────────────────────────────────────────────
-- Kolabo database schema
--
-- How to run this:
--   1. Open your Supabase project → SQL Editor → New query.
--   2. Paste this whole file and click "Run".
-- (Full walkthrough in README.md → "3. Set up Supabase".)
--
-- Design notes:
--   Auth is handled entirely by Clerk, not Supabase Auth. Every row that
--   belongs to a user is keyed by that user's Clerk user id (a plain
--   text column, e.g. "user_2abc..."), not a Supabase auth.uid().
--
--   All reads/writes from the app go through Next.js API routes using the
--   Supabase *service role* key, which bypasses Row Level Security — the
--   API routes themselves check the caller's Clerk session and role
--   before touching the database. RLS is still enabled below as a safety
--   net: the public anon key can only ever read *published* creator
--   profiles, and nothing else.
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- Generic "touch updated_at" trigger function, reused by every table below.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─────────────────────────────────────────────────────────────────────────
-- creators — public-facing influencer/creator profiles
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists creators (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,                 -- Clerk user id
  display_name text not null,
  headline text,
  bio text,
  niche text,
  location text,
  avatar_url text,
  platforms jsonb not null default '[]'::jsonb,  -- [{platform, handle, followers, url}]
  total_followers integer not null default 0,
  engagement_rate numeric(5,2),
  starting_rate numeric(10,2),
  rate_notes text,
  portfolio_links jsonb not null default '[]'::jsonb, -- string[]
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creators_niche_idx on creators (niche);
create index if not exists creators_published_idx on creators (is_published);
create index if not exists creators_followers_idx on creators (total_followers desc);

drop trigger if exists creators_set_updated_at on creators;
create trigger creators_set_updated_at
  before update on creators
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- businesses — the company profile behind a paying subscriber
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,                  -- Clerk user id
  company_name text not null,
  website text,
  industry text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists businesses_set_updated_at on businesses;
create trigger businesses_set_updated_at
  before update on businesses
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- subscriptions — one row per business, mirrors its Stripe subscription
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references businesses(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'none'
    check (status in (
      'none', 'trialing', 'active', 'past_due',
      'canceled', 'unpaid', 'incomplete', 'incomplete_expired'
    )),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_stripe_customer_idx on subscriptions (stripe_customer_id);
create index if not exists subscriptions_stripe_subscription_idx on subscriptions (stripe_subscription_id);

drop trigger if exists subscriptions_set_updated_at on subscriptions;
create trigger subscriptions_set_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- conversations — one thread per (business, creator) pair
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  creator_id uuid not null references creators(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz,
  unique (business_id, creator_id)
);

create index if not exists conversations_business_idx on conversations (business_id);
create index if not exists conversations_creator_idx on conversations (creator_id);

-- ─────────────────────────────────────────────────────────────────────────
-- messages — individual messages within a conversation
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_user_id text not null,                  -- Clerk user id of sender
  sender_role text not null check (sender_role in ('creator', 'business')),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists messages_conversation_idx on messages (conversation_id, created_at);

-- ─────────────────────────────────────────────────────────────────────────
-- Row Level Security
--
-- The service role key (used by every server-side API route) bypasses RLS
-- entirely, so these policies only govern what the *anon* public key can
-- see if it's ever used directly (e.g. from a client component). Keep this
-- locked down: only published creator profiles are publicly readable.
-- ─────────────────────────────────────────────────────────────────────────
alter table creators enable row level security;
alter table businesses enable row level security;
alter table subscriptions enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

drop policy if exists "public can read published creators" on creators;
create policy "public can read published creators"
  on creators for select
  using (is_published = true);

-- No policies are defined for businesses, subscriptions, conversations, or
-- messages — meaning the anon key has zero access to them. All access goes
-- through server-side API routes using the service role key.
