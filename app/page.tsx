import Link from "next/link";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import CreatorCard from "@/components/CreatorCard";
import type { CreatorProfile } from "@/lib/types";

async function getFeaturedCreators(): Promise<CreatorProfile[]> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data } = await supabase
      .from("creators")
      .select("*")
      .eq("is_published", true)
      .order("total_followers", { ascending: false })
      .limit(6);
    return (data as CreatorProfile[]) ?? [];
  } catch {
    // Supabase env vars not configured yet — render the page without data
    // so the site still works before setup is finished.
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedCreators();

  return (
    <div>
      {/* Hero */}
      <section className="sunset-band border-b border-orange-900/10">
        <div className="container-page relative z-10 grid gap-10 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="badge mb-5 bg-white/15 text-white">Creator marketplace</span>
            <h1 className="text-4xl font-bold tracking-tightest text-white sm:text-5xl">
              Where brands find creators, and deals get done.
            </h1>
            <p className="mt-5 text-lg text-white/85">
              Kolabo is the marketplace where influencers list their
              accounts and businesses subscribe monthly to search, contact,
              and negotiate deals with creators — no agencies, no cold DMs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sign-up" className="btn bg-cream px-6 py-3 text-base text-ink hover:bg-white">
                Join as a business
              </Link>
              <Link
                href="/sign-up"
                className="btn px-6 py-3 text-base text-white ring-1 ring-inset ring-white/40 hover:bg-white/10"
              >
                Join as a creator
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-white/80">
              <Link href="/creators" className="font-medium text-white hover:text-cream">
                Browse the creator directory →
              </Link>
            </div>
          </div>
          <div className="sunset-card grid grid-cols-2 gap-4">
            <HeroStat label="Creators listed" value="Growing weekly" />
            <HeroStat label="Avg. reply time" value="< 24 hrs" />
            <HeroStat label="Niches covered" value="15+" />
            <HeroStat label="Deals handled" value="On-platform" />
          </div>
        </div>
      </section>

      {/* Featured creators */}
      {featured.length > 0 && (
        <section className="container-page py-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Featured creators
            </h2>
            <Link
              href="/creators"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </section>
      )}

      {/* For businesses */}
      <section id="for-businesses" className="border-t border-slate-100 bg-white py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="badge mb-4">For businesses</span>
            <h2 className="text-3xl font-bold text-slate-900">
              One subscription. Every creator.
            </h2>
            <p className="mt-4 text-slate-600">
              Search creators by niche, platform, follower count, and
              engagement rate. Message them directly and negotiate your deal
              right inside Kolabo — no more chasing agencies or guessing who
              replies.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <Step text="Subscribe monthly — cancel anytime" />
              <Step text="Unlimited search and filtering" />
              <Step text="Direct messaging with creators" />
              <Step text="Negotiate deals in one thread" />
            </ul>
            <Link href="/sign-up" className="btn-primary mt-8 px-6 py-3 text-base">
              Start your subscription
            </Link>
          </div>
          <PricingCard />
        </div>
      </section>

      {/* For creators */}
      <section id="for-creators" className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="card">
              <p className="text-sm font-semibold text-slate-500">
                Your profile
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-brand-100" />
                <div>
                  <p className="font-semibold text-slate-900">Your name</p>
                  <p className="text-sm text-slate-500">Lifestyle · 120K followers</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Add your platforms, your rates, and let businesses come to
                you — free to list.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="badge mb-4">For creators</span>
            <h2 className="text-3xl font-bold text-slate-900">
              Listing your account is free.
            </h2>
            <p className="mt-4 text-slate-600">
              Build a profile with your platforms, follower counts, niche,
              and rates. Get discovered by paying businesses actively
              looking to book creators like you.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <Step text="Free to create and publish your profile" />
              <Step text="Get messaged directly by businesses" />
              <Step text="Set your own rates and terms" />
              <Step text="Negotiate every deal on your terms" />
            </ul>
            <Link href="/sign-up" className="btn-primary mt-8 px-6 py-3 text-base">
              List your account
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sunset-band border-t border-orange-900/10">
        <div className="container-page relative z-10 flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to get started with Kolabo?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/sign-up"
              className="btn bg-cream px-6 py-3 text-base text-ink hover:bg-white"
            >
              Create your account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-ink/[0.04] p-4">
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink/60">{label}</p>
    </div>
  );
}

function Step({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
        ✓
      </span>
      {text}
    </li>
  );
}

function PricingCard() {
  return (
    <div className="card">
      <p className="text-sm font-semibold text-slate-500">Business plan</p>
      <p className="mt-2 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-slate-900">Monthly</span>
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Billed monthly, cancel anytime
      </p>
      <ul className="mt-6 space-y-3 text-sm text-slate-700">
        <Step text="Full access to the creator directory" />
        <Step text="Unlimited messages to creators" />
        <Step text="Deal negotiation in-platform" />
        <Step text="Manage billing anytime" />
      </ul>
      <Link href="/sign-up" className="btn-primary mt-6 w-full py-3">
        Subscribe now
      </Link>
    </div>
  );
}
