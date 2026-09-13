import { requireRole } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import CreatorProfileForm from "@/components/CreatorProfileForm";
import type { CreatorProfile } from "@/lib/types";

export default async function CreatorDashboardPage() {
  const userId = await requireRole("creator");

  const supabase = createAdminSupabaseClient();
  const { data: profile } = await supabase
    .from("creators")
    .select("*")
    .eq("user_id", userId)
    .single<CreatorProfile>();

  const { count: threadCount } = await supabase
    .from("conversations")
    .select("id", { count: "exact", head: true })
    .eq("creator_id", profile?.id ?? "");

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Your creator profile
          </h1>
          <p className="mt-1 text-slate-600">
            {profile?.is_published
              ? "Your profile is live in the directory."
              : "Your profile is hidden — publish it to get discovered."}
          </p>
        </div>
        <a href="/messages" className="btn-secondary">
          View messages
          {typeof threadCount === "number" && threadCount > 0
            ? ` (${threadCount})`
            : ""}
        </a>
      </div>

      {profile ? (
        <CreatorProfileForm profile={profile} />
      ) : (
        <p className="text-slate-600">
          We couldn&apos;t find your profile. Try refreshing, or contact
          support if this persists.
        </p>
      )}
    </div>
  );
}
