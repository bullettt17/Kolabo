import { createAdminSupabaseClient } from "./supabase/admin";
import type { Subscription } from "./types";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

/**
 * A business can contact / message creators only while it has an active
 * (or trialing) Stripe subscription. This is checked server-side on every
 * write that requires it — never trust the client.
 */
export async function businessHasActiveSubscription(
  businessId: string
): Promise<boolean> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("business_id", businessId)
    .maybeSingle<Pick<Subscription, "status">>();

  if (error || !data) return false;
  return ACTIVE_STATUSES.has(data.status);
}
