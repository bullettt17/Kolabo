"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartConversationButton({
  creatorId,
  hasSubscription,
}: {
  creatorId: string;
  hasSubscription: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      router.push(`/messages/${data.conversationId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (!hasSubscription) {
    return (
      <div>
        <button disabled className="btn-primary w-full">
          Subscribe to contact
        </button>
        <p className="mt-2 text-center text-xs text-slate-500">
          <a href="/dashboard/business" className="font-medium text-brand-600 hover:text-brand-700">
            Start your subscription
          </a>{" "}
          to message creators.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={start}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "Starting conversation…" : "Contact this creator"}
      </button>
      {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
    </div>
  );
}
