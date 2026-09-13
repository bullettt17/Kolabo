"use client";

import { useState } from "react";
import type { Subscription } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  none: "No subscription",
  trialing: "Trialing",
  active: "Active",
  past_due: "Payment past due",
  canceled: "Canceled",
  unpaid: "Unpaid",
  incomplete: "Incomplete",
  incomplete_expired: "Expired",
};

const STATUS_COLOR: Record<string, string> = {
  none: "bg-slate-100 text-slate-600",
  trialing: "bg-brand-50 text-brand-700",
  active: "bg-emerald-50 text-emerald-700",
  past_due: "bg-amber-50 text-amber-700",
  canceled: "bg-slate-100 text-slate-600",
  unpaid: "bg-red-50 text-red-700",
  incomplete: "bg-amber-50 text-amber-700",
  incomplete_expired: "bg-slate-100 text-slate-600",
};

export default function SubscriptionPanel({
  subscription,
}: {
  subscription: Subscription | null;
}) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const status = subscription?.status ?? "none";
  const isActive = status === "active" || status === "trialing";
  const hasStripeCustomer = Boolean(subscription?.stripe_customer_id);

  async function startCheckout() {
    setLoading("checkout");
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Failed to start checkout");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start checkout");
      setLoading(null);
    }
  }

  async function openPortal() {
    setLoading("portal");
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Failed to open billing portal");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to open billing portal");
      setLoading(null);
    }
  }

  return (
    <div className="card sticky top-24 space-y-4">
      <div>
        <p className="font-semibold text-slate-900">Subscription</p>
        <span
          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[status]}`}
        >
          {STATUS_LABEL[status] ?? status}
        </span>
      </div>

      {subscription?.current_period_end && (
        <p className="text-sm text-slate-500">
          {subscription.cancel_at_period_end
            ? "Cancels on "
            : "Renews on "}
          {new Date(subscription.current_period_end).toLocaleDateString()}
        </p>
      )}

      <p className="text-sm text-slate-600">
        {isActive
          ? "You can search, message, and negotiate deals with any creator on Kolabo."
          : "Subscribe to unlock messaging and deal negotiation with creators."}
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isActive && (
        <button
          onClick={startCheckout}
          disabled={loading !== null}
          className="btn-primary w-full"
        >
          {loading === "checkout" ? "Redirecting…" : "Subscribe now"}
        </button>
      )}

      {hasStripeCustomer && (
        <button
          onClick={openPortal}
          disabled={loading !== null}
          className="btn-secondary w-full"
        >
          {loading === "portal" ? "Redirecting…" : "Manage billing"}
        </button>
      )}
    </div>
  );
}
