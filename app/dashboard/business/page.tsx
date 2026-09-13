import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import BusinessProfileForm from "@/components/BusinessProfileForm";
import SubscriptionPanel from "@/components/SubscriptionPanel";
import type { BusinessProfile, Subscription } from "@/lib/types";

export default async function BusinessDashboardPage() {
  const userId = await requireRole("business");
  const supabase = createAdminSupabaseClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", userId)
    .single<BusinessProfile>();

  const { data: subscription } = business
    ? await supabase
        .from("subscriptions")
        .select("*")
        .eq("business_id", business.id)
        .single<Subscription>()
    : { data: null };

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Business dashboard
          </h1>
          <p className="mt-1 text-slate-600">
            Manage your company profile and subscription.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/creators" className="btn-secondary">
            Browse creators
          </Link>
          <Link href="/messages" className="btn-secondary">
            Messages
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {business && <BusinessProfileForm business={business} />}
        </div>
        <div>
          <SubscriptionPanel subscription={subscription ?? null} />
        </div>
      </div>
    </div>
  );
}
