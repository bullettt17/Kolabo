import { createPublicSupabaseClient } from "@/lib/supabase/server";
import CreatorCard from "@/components/CreatorCard";
import SearchFilters from "@/components/SearchFilters";
import type { CreatorProfile } from "@/lib/types";

export const revalidate = 0;

interface Props {
  searchParams: {
    q?: string;
    niche?: string;
    platform?: string;
    minFollowers?: string;
  };
}

async function getCreators(params: Props["searchParams"]): Promise<CreatorProfile[]> {
  try {
    const supabase = createPublicSupabaseClient();
    let query = supabase
      .from("creators")
      .select("*")
      .eq("is_published", true)
      .order("total_followers", { ascending: false })
      .limit(60);

    if (params.niche) {
      query = query.eq("niche", params.niche);
    }
    if (params.q) {
      query = query.or(
        `display_name.ilike.%${params.q}%,headline.ilike.%${params.q}%,bio.ilike.%${params.q}%`
      );
    }
    if (params.minFollowers) {
      const min = Number(params.minFollowers);
      if (!Number.isNaN(min)) {
        query = query.gte("total_followers", min);
      }
    }

    const { data } = await query;
    let results = (data as CreatorProfile[]) ?? [];

    if (params.platform) {
      results = results.filter((c) =>
        c.platforms?.some((p) => p.platform === params.platform)
      );
    }

    return results;
  } catch {
    return [];
  }
}

export default async function CreatorsPage({ searchParams }: Props) {
  const creators = await getCreators(searchParams);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Browse creators
        </h1>
        <p className="mt-1 text-slate-600">
          {creators.length} creator{creators.length === 1 ? "" : "s"} match
          your filters
        </p>
      </div>

      <SearchFilters initial={searchParams} />

      {creators.length === 0 ? (
        <div className="card mt-8 text-center">
          <p className="font-medium text-slate-900">No creators found yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your filters, or check back soon as more creators
            join Kolabo.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
}
