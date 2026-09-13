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

  return (
    <div className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
                {creator.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={creator.avatar_url}
                    alt={creator.display_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  creator.display_name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {creator.display_name}
                </h1>
                <p className="mt-1 text-slate-500">
                  {creator.niche ?? "Creator"}
                  {creator.location ? ` · ${creator.location}` : ""}
                </p>
                {creator.headline && (
                  <p className="mt-2 text-slate-700">{creator.headline}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="badge">
                {formatFollowers(creator.total_followers)} total followers
              </span>
              {creator.engagement_rate != null && (
                <span className="badge">
                  {creator.engagement_rate}% engagement
                </span>
              )}
            </div>

            {creator.bio && (
              <div className="mt-6">
                <h2 className="font-semibold text-slate-900">About</h2>
                <p className="mt-2 whitespace-pre-line text-slate-700">
                  {creator.bio}
                </p>
              </div>
            )}

            {creator.platforms?.length > 0 && (
              <div className="mt-6">
                <h2 className="font-semibold text-slate-900">Platforms</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {creator.platforms.map((p) => (
                    <div
                      key={p.platform + p.handle}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium capitalize text-slate-900">
                          {p.platform}
                        </p>
                        <p className="text-sm text-slate-500">{p.handle}</p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        {formatFollowers(p.followers)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {creator.portfolio_links?.length > 0 && (
              <div className="mt-6">
                <h2 className="font-semibold text-slate-900">Portfolio</h2>
                <ul className="mt-2 space-y-1">
                  {creator.portfolio_links.map((link) => (
                    <li key={link}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-brand-600 hover:text-brand-700"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card sticky top-24 space-y-4">
            <div>
              <p className="font-semibold text-slate-900">Rates</p>
              {creator.starting_rate != null ? (
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  From £{creator.starting_rate}
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">
                  Rates available on request
                </p>
              )}
              {creator.rate_notes && (
                <p className="mt-2 text-sm text-slate-600">
                  {creator.rate_notes}
                </p>
              )}
            </div>

            {isOwnProfile ? (
              <p className="text-sm text-slate-500">
                This is your public profile.{" "}
                <Link
                  href="/dashboard/creator"
                  className="font-medium text-brand-600 hover:text-brand-700"
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
