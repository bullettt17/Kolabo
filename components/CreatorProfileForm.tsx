"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import type { CreatorProfile, PlatformHandle } from "@/lib/types";
import { NICHES, PLATFORMS } from "@/lib/types";

export default function CreatorProfileForm({
  profile,
}: {
  profile: CreatorProfile;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [headline, setHeadline] = useState(profile.headline ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [niche, setNiche] = useState(profile.niche ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [platforms, setPlatforms] = useState<PlatformHandle[]>(
    profile.platforms?.length
      ? profile.platforms
      : [{ platform: "instagram", handle: "", followers: 0, url: "" }]
  );
  const [engagementRate, setEngagementRate] = useState(
    profile.engagement_rate != null ? String(profile.engagement_rate) : ""
  );
  const [startingRate, setStartingRate] = useState(
    profile.starting_rate != null ? String(profile.starting_rate) : ""
  );
  const [rateNotes, setRateNotes] = useState(profile.rate_notes ?? "");
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>(
    profile.portfolio_links?.length ? profile.portfolio_links : [""]
  );
  const [isPublished, setIsPublished] = useState(profile.is_published);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  function updatePlatform(index: number, patch: Partial<PlatformHandle>) {
    setPlatforms((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p))
    );
  }

  function addPlatform() {
    setPlatforms((prev) => [
      ...prev,
      { platform: "instagram", handle: "", followers: 0, url: "" },
    ]);
  }

  function removePlatform(index: number) {
    setPlatforms((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleAvatarUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingAvatar(true);
    setAvatarError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/creator-profile/avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setAvatarUrl(data.url);
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : "Upload failed — try again."
      );
    } finally {
      setUploadingAvatar(false);
    }
  }

  function updateLink(index: number, value: string) {
    setPortfolioLinks((prev) =>
      prev.map((l, i) => (i === index ? value : l))
    );
  }

  function addLink() {
    setPortfolioLinks((prev) => [...prev, ""]);
  }

  function removeLink(index: number) {
    setPortfolioLinks((prev) => prev.filter((_, i) => i !== index));
  }

  async function save(publish?: boolean) {
    setSaving(true);
    setStatus(null);
    setError(null);
    const nextPublished = publish ?? isPublished;

    try {
      const res = await fetch("/api/creator-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          headline,
          bio,
          niche,
          location,
          avatar_url: avatarUrl,
          platforms: platforms
            .filter((p) => p.handle.trim().length > 0)
            .map((p) => ({ ...p, url: p.url || undefined })),
          engagement_rate: engagementRate ? Number(engagementRate) : null,
          starting_rate: startingRate ? Number(startingRate) : null,
          rate_notes: rateNotes,
          portfolio_links: portfolioLinks.filter((l) => l.trim().length > 0),
          is_published: nextPublished,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save profile");
      }

      setIsPublished(nextPublished);
      setStatus(nextPublished ? "Profile published!" : "Draft saved.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <section className="card space-y-4">
          <h2 className="font-semibold text-slate-900">Basics</h2>
          <div>
            <label className="label">Display name</label>
            <input
              className="input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={80}
            />
          </div>
          <div>
            <label className="label">Headline</label>
            <input
              className="input"
              placeholder="e.g. Lifestyle & travel creator based in London"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              maxLength={120}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Niche</label>
              <select
                className="input"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              >
                <option value="">Select a niche</option>
                {NICHES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <input
                className="input"
                placeholder="e.g. Bournemouth, UK"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={80}
              />
            </div>
          </div>
          <div>
            <label className="label">Profile picture</label>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-2xl bg-brand-100 text-xl font-bold text-brand-700">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Your profile picture"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  displayName.charAt(0).toUpperCase() || "?"
                )}
              </div>
              <div>
                <label className="btn-secondary cursor-pointer">
                  {uploadingAvatar
                    ? "Uploading…"
                    : avatarUrl
                    ? "Change photo"
                    : "Upload photo"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    disabled={uploadingAvatar}
                    onChange={handleAvatarUpload}
                  />
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  PNG, JPEG, WEBP, or GIF. Up to 5MB.
                </p>
                {avatarError && (
                  <p className="mt-1 text-xs text-red-600">{avatarError}</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea
              className="input min-h-28"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={2000}
            />
          </div>
        </section>

        <section className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Platforms</h2>
            <button
              type="button"
              onClick={addPlatform}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              + Add platform
            </button>
          </div>
          <div className="space-y-4">
            {platforms.map((p, i) => (
              <div
                key={i}
                className="grid grid-cols-1 items-end gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <div>
                  <label className="label">Platform</label>
                  <select
                    className="input"
                    value={p.platform}
                    onChange={(e) =>
                      updatePlatform(i, {
                        platform: e.target.value as PlatformHandle["platform"],
                      })
                    }
                  >
                    {PLATFORMS.map((pl) => (
                      <option key={pl} value={pl}>
                        {pl}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Handle</label>
                  <input
                    className="input"
                    placeholder="@yourhandle"
                    value={p.handle}
                    onChange={(e) =>
                      updatePlatform(i, { handle: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Followers</label>
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={p.followers}
                    onChange={(e) =>
                      updatePlatform(i, {
                        followers: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePlatform(i)}
                  className="btn-ghost h-fit"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="font-semibold text-slate-900">Rates</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Engagement rate (%)</label>
              <input
                type="number"
                step="0.1"
                min={0}
                max={100}
                className="input"
                value={engagementRate}
                onChange={(e) => setEngagementRate(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Starting rate (per post, £)</label>
              <input
                type="number"
                min={0}
                className="input"
                value={startingRate}
                onChange={(e) => setStartingRate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label">Rate notes</label>
            <textarea
              className="input min-h-20"
              placeholder="e.g. Package deals available for multi-post campaigns"
              value={rateNotes}
              onChange={(e) => setRateNotes(e.target.value)}
              maxLength={1000}
            />
          </div>
        </section>

        <section className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Content</h2>
            <button
              type="button"
              onClick={addLink}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              + Add link
            </button>
          </div>
          <p className="text-sm text-slate-500">
            Link your best posts or videos — these show as cards on your public profile.
          </p>
          {portfolioLinks.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input"
                placeholder="https://…"
                value={link}
                onChange={(e) => updateLink(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="btn-ghost"
              >
                Remove
              </button>
            </div>
          ))}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="card sticky top-24 space-y-4">
          <div>
            <p className="font-semibold text-slate-900">Visibility</p>
            <p className="mt-1 text-sm text-slate-500">
              {isPublished
                ? "Live — businesses can find and message you."
                : "Hidden — only visible to you until published."}
            </p>
          </div>

          {status && <p className="text-sm text-emerald-600">{status}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => save()}
              className="btn-secondary w-full"
            >
              {saving ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save(!isPublished)}
              className="btn-primary w-full"
            >
              {saving
                ? "Saving…"
                : isPublished
                ? "Unpublish"
                : "Publish profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
