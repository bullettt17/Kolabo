"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { NICHES, PLATFORMS } from "@/lib/types";

export default function SearchFilters({
  initial,
}: {
  initial: { q?: string; niche?: string; platform?: string; minFollowers?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(initial.q ?? "");
  const [niche, setNiche] = useState(initial.niche ?? "");
  const [platform, setPlatform] = useState(initial.platform ?? "");
  const [minFollowers, setMinFollowers] = useState(initial.minFollowers ?? "");

  function applyFilters(e?: FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const set = (key: string, value: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };
    set("q", q);
    set("niche", niche);
    set("platform", platform);
    set("minFollowers", minFollowers);
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    setQ("");
    setNiche("");
    setPlatform("");
    setMinFollowers("");
    router.push(pathname);
  }

  return (
    <form onSubmit={applyFilters} className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <label className="label">Search</label>
        <input
          className="input"
          placeholder="Name, headline, or bio…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Niche</label>
        <select
          className="input"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
        >
          <option value="">Any niche</option>
          {NICHES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Platform</label>
        <select
          className="input"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="">Any platform</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p} className="capitalize">
              {p}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Min. followers</label>
        <input
          type="number"
          min={0}
          className="input"
          placeholder="e.g. 10000"
          value={minFollowers}
          onChange={(e) => setMinFollowers(e.target.value)}
        />
      </div>
      <div className="flex items-end gap-2 lg:col-span-5">
        <button type="submit" className="btn-primary">
          Apply filters
        </button>
        <button type="button" onClick={clearFilters} className="btn-ghost">
          Clear
        </button>
      </div>
    </form>
  );
}
