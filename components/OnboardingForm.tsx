"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

type Role = "creator" | "business";

export default function OnboardingForm() {
  const router = useRouter();
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selected }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      router.push(
        selected === "business" ? "/dashboard/business" : "/dashboard/creator"
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <RoleOption
          role="creator"
          title="I'm a creator"
          description="List your account for free and get discovered by businesses."
          selected={selected === "creator"}
          onSelect={() => setSelected("creator")}
        />
        <RoleOption
          role="business"
          title="I'm a business"
          description="Subscribe monthly to search, message, and book creators."
          selected={selected === "business"}
          onSelect={() => setSelected("business")}
        />
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      )}

      <button
        onClick={submit}
        disabled={!selected || loading}
        className="btn-primary mt-6 w-full py-3 text-base"
      >
        {loading ? "Setting up your account…" : "Continue"}
      </button>
    </div>
  );
}

function RoleOption({
  title,
  description,
  selected,
  onSelect,
}: {
  role: Role;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "card text-left transition-all",
        selected
          ? "ring-2 ring-brand-500"
          : "hover:ring-1 hover:ring-slate-300"
      )}
    >
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1.5 text-sm text-slate-600">{description}</p>
    </button>
  );
}
