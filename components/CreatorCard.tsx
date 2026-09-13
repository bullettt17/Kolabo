import Link from "next/link";
import type { CreatorProfile } from "@/lib/types";

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

export default function CreatorCard({ creator }: { creator: CreatorProfile }) {
  const platforms = creator.platforms?.slice(0, 3) ?? [];

  return (
    <Link
      href={`/creators/${creator.id}`}
      className="card block transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-100 text-lg font-bold text-brand-700">
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
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">
            {creator.display_name}
          </p>
          <p className="truncate text-sm text-slate-500">
            {creator.niche ?? "Creator"}
            {creator.location ? ` · ${creator.location}` : ""}
          </p>
        </div>
      </div>

      {creator.headline && (
        <p className="mt-3 line-clamp-2 text-sm text-slate-600">
          {creator.headline}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="badge">
          {formatFollowers(creator.total_followers)} followers
        </span>
        {creator.engagement_rate != null && (
          <span className="badge">{creator.engagement_rate}% eng.</span>
        )}
        {platforms.map((p) => (
          <span
            key={p.platform + p.handle}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600"
          >
            {p.platform}
          </span>
        ))}
      </div>
    </Link>
  );
}
