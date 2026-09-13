"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BusinessProfile } from "@/lib/types";

export default function BusinessProfileForm({
  business,
}: {
  business: BusinessProfile;
}) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState(business.company_name);
  const [website, setWebsite] = useState(business.website ?? "");
  const [industry, setIndustry] = useState(business.industry ?? "");
  const [logoUrl, setLogoUrl] = useState(business.logo_url ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setStatus(null);
    setError(null);
    try {
      const res = await fetch("/api/business-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          website,
          industry,
          logo_url: logoUrl,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }
      setStatus("Saved.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card space-y-4">
      <h2 className="font-semibold text-slate-900">Company profile</h2>
      <div>
        <label className="label">Company name</label>
        <input
          className="input"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          maxLength={120}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Website</label>
          <input
            className="input"
            placeholder="https://…"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Industry</label>
          <input
            className="input"
            placeholder="e.g. Fashion, SaaS, Food & Bev"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            maxLength={60}
          />
        </div>
      </div>
      <div>
        <label className="label">Logo URL</label>
        <input
          className="input"
          placeholder="https://…"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
        />
      </div>

      {status && <p className="text-sm text-emerald-600">{status}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="button"
        disabled={saving}
        onClick={save}
        className="btn-primary"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </section>
  );
}
