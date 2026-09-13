import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { BusinessProfile, Subscription } from "@/lib/types";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const priceId = process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!priceId || !appUrl) {
    return NextResponse.json(
      { error: "Stripe is not fully configured yet (missing price id or app url)." },
      { status: 500 }
    );
  }

  const supabase = createAdminSupabaseClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", userId)
    .single<BusinessProfile>();

  if (!business) {
    return NextResponse.json(
      { error: "No business profile found for this account." },
      { status: 404 }
    );
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("business_id", business.id)
    .single<Subscription>();

  const stripe = getStripe();
  let customerId = subscription?.stripe_customer_id ?? undefined;

  if (!customerId) {
    const user = await currentUser();
    const customer = await stripe.customers.create({
      name: business.company_name,
      email: user?.primaryEmailAddress?.emailAddress,
      metadata: { business_id: business.id, clerk_user_id: userId },
    });
    customerId = customer.id;

    await supabase
      .from("subscriptions")
      .upsert(
        { business_id: business.id, stripe_customer_id: customerId },
        { onConflict: "business_id" }
      );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: business.id,
    metadata: { business_id: business.id, clerk_user_id: userId },
    subscription_data: {
      metadata: { business_id: business.id, clerk_user_id: userId },
    },
    success_url: `${appUrl}/dashboard/business?checkout=success`,
    cancel_url: `${appUrl}/dashboard/business?checkout=cancel`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
