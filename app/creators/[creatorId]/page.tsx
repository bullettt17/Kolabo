import { notFound } from "next/navigation";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { businessHasActiveSubscription } from "@/lib/subscription";
import StartConversationButton from "@/components/StartConversationButton";
import type { BusinessProfile, CreatorProfile } from "@/lib/types";

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

const PLATFORM_STYLES: Record<
  string,
  { label: string; className: string; icon: string }
> = {
  "tiktok.com": { label: "TikTok", className: "bg-black", icon: "TT" },
  "instagram.com": {
    label: "Instagram",
    className: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#515bd4]",
    icon: "IG",
  },
  "youtube.com": { label: "YouTube", className: "bg-[#FF0000]", icon: "YT" },
  "youtu.be": { label: "YouTube", className: "bg-[#FF0000]", icon: "YT" },
  "x.com": { label: "X", className: "bg-black", icon: "X" },
  "twitter.com": { label: "X", className: "bg-black", icon: "X" },
  "twitch.tv": { label: "Twitch", className: "bg-[#9146FF]", icon: "TW" },
};

function getLinkMeta(link: string) {
  try {
    const host = new URL(link).hostname.replace(/^www\./, "");
    const match = PLATFORM_STYLES[host];
    if (match) return { ...match, host };
    return {
      label: host,
      className: "bg-slate-600",
      icon: host.charAt(0).toUpperCase(),
      host,
    };
  } catch {
    return { label: link, className: "bg-slate-600", icon: "?", host: link };
  }
}

const PLATFORM_ICON: Record<string, { icon: string; className: string }> = {
  tiktok: { icon: "TT", className: "bg-black" },
  instagram: {
    icon: "IG",
    className: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#515bd4]",
  },
  youtube: { icon: "YT", className: "bg-[#FF0000]" },
  twitter: { icon: "X", className: "bg-black" },
  twitch: { icon: "TW", className: "bg-[#9146FF]" },
  other: { icon: "•", className: "bg-slate-500" },
};

export default async function CreatorProfilePage({
  params,
}: {
  params: { creatorId: string };
}) {
  const supabase = createPublicSupabaseClient();
  const { data: creator } = await supabase
    .from("creators")
    .select("*")
    .eq("id", params.creatorId)
    .eq("is_published", true)
    .single<CreatorProfile>();

  if (!creator) notFound();

  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const role = user?.publicMetadata?.role;
  const isOwnProfile = role === "creator" && creator.user_id === userId;

  let businessHasSub = false;
  let viewerIsBusiness = false;

  if (userId && role === "business") {
    viewerIsBusiness = true;
    const admin = createAdminSupabaseClient();
    const { data: business } = await admin
      .from("businesses")
      .select("*")
      .eq("user_id", userId)
      .single<BusinessProfile>();
    if (business) {
      businessHasSub = await businessHasActiveSubscription(business.id);
    }
  }

  const platforms = creator.platforms ?? [];
  const totalPlatformFollowers = platforms.reduce(
    (sum, p) => sum + (p.followers || 0),
    0
  );
  const portfolioLinks = creator.portfolio_links ?? [];

  return (
    <div className="container-page py-8">
      {/* Stat panel */}
      <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white sm:p-9">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(255,106,31,.45), transparent 70%)",
          }}
        />
        <div className="relative flex flex-wrap items-center gap-5">
          <div className="h-20 w-20 flex-none overflow-hidden rounded-2xl border-2 border-white/15 bg-white/10 text-2xl font-bold">
            {creator.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={creator.avatar_url}
                alt={creator.display_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                {creator.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              {creator.display_name}
            </h1>
            <p className="mt-1 text-sm font-semibold text-white/55">
              {creator.niche ?? "Creator"}
              {creator.location ? ` · ${creator.location}` : ""}
            </p>
            {creator.is_published && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Open for bookings
              </div>
            )}
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-4">
          <div className="bg-white/[0.04] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/45">
              Total reach
            </p>
            <p className="mt-1.5 font-mono text-xl font-extrabold sm:text-2xl">
              {formatFollowers(creator.total_followers)}
            </p>
          </div>
          <div className="bg-white/[0.04] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/45">
              Engagement
            </p>
            <p className="mt-1.5 font-mono text-xl font-extrabold sm:text-2xl">
              {creator.engagement_rate != null
                ? `${creator.engagement_rate}%`
                : "—"}
            </p>
          </div>
          <div className="bg-white/[0.04] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/45">
              Platforms
            </p>
            <p className="mt-1.5 font-mono text-xl font-extrabold sm:text-2xl">
              {String(platforms.length).padStart(2, "0")}
            </p>
          </div>
          <div className="bg-white/[0.04] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/45">
              From
            </p>
            <p className="mt-1.5 font-mono text-xl font-extrabold sm:text-2xl">
              {creator.starting_rate != null
                ? `£${creator.starting_rate}`
                : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {creator.headline || creator.bio ? (
            <div className="card">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                About
              </p>
              {creator.headline && (
                <p className="mt-3 text-[17px] font-semibold text-slate-800">
                  {creator.headline}
                </p>
              )}
              {creator.bio && (
                <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">
                  {creator.bio}
                </p>
              )}
            </div>
          ) : null}

          {/* Content */}
          {portfolioLinks.length > 0 ? (
            <div className="card">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Content
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {portfolioLinks.map((link) => {
                  const meta = getLinkMeta(link);
                  return (
                    <a
                      key={link}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-3 rounded-2xl bg-cream p-4 transition-colors hover:bg-brand-50"
                    >
                      <span
                        className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl text-xs font-extrabold text-white ${meta.className}`}
                      >
                        {meta.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-slate-900">
                          {meta.label}
                        </span>
                        <span className="block truncate text-xs font-medium text-slate-500">
                          {meta.host}
                        </span>
                      </span>
                      <span className="flex-none text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600">
                        →
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : isOwnProfile ? (
            <div className="card border-2 border-dashed border-slate-200 bg-transparent text-center">
              <p className="text-sm font-semibold text-slate-600">
                Add links to your best posts or videos
              </p>
              <p className="mt-1 text-sm text-slate-500">
                They&apos;ll show here as cards businesses can click straight through to.
              </p>
              <Link
                href="/dashboard/creator"
                className="mt-4 inline-block text-sm font-bold text-brand-600 hover:text-brand-700"
              >
                Add content →
              </Link>
            </div>
          ) : null}

          {platforms.length > 0 && (
            <div className="card">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Platforms
              </p>

              {platforms.length > 1 && totalPlatformFollowers > 0 && (
                <div className="mt-4">
                  <div className="flex h-3.5 overflow-hidden rounded-full">
                    {platforms.map((p, i) => (
                      <div
                        key={p.platform + p.handle + i}
                        className={PLATFORM_ICON[p.platform]?.className ?? "bg-slate-400"}
                        style={{
                          width: `${((p.followers || 0) / totalPlatformFollowers) * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2.5">
                {platforms.map((p, i) => (
                  <div
                    key={p.platform + p.handle + i}
                    className="flex items-center justify-between rounded-xl bg-cream px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg text-[11px] font-extrabold text-white ${
                          PLATFORM_ICON[p.platform]?.className ?? "bg-slate-400"
                        }`}
                      >
                        {PLATFORM_ICON[p.platform]?.icon ?? "•"}
                      </span>
                      <div>
                        <p className="font-semibold capitalize text-slate-900">
                          {p.platform}
                        </p>
                        <p className="text-sm text-slate-500">{p.handle}</p>
                      </div>
                    </div>
                    <p className="font-extrabold text-slate-900">
                      {formatFollowers(p.followers)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card sticky top-24 space-y-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Starting rate
              </p>
              {creator.starting_rate != null ? (
                <p className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-slate-900">
                    £{creator.starting_rate}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    per deliverable
                  </span>
                </p>
              ) : (
                <p className="mt-1.5 text-sm text-slate-500">
                  Rates available on request
                </p>
              )}
              {creator.rate_notes && (
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {creator.rate_notes}
                </p>
              )}
            </div>

            {isOwnProfile ? (
              <p className="text-sm text-slate-500">
                This is your public profile.{" "}
                <Link
                  href="/dashboard/creator"
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Edit it
                </Link>
              </p>
            ) : viewerIsBusiness ? (
              <StartConversationButton
                creatorId={creator.id}
                hasSubscription={businessHasSub}
              />
            ) : (
              <div>
                <Link href="/sign-up" className="btn-primary w-full">
                  Sign up as a business to contact
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
