import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { BusinessProfile, Subscription } from "@/lib/types";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_APP_URL is not configured." },
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
    return NextResponse.json({ error: "No business profile found." }, { status: 404 });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("business_id", business.id)
    .single<Subscription>();

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No billing account found yet — subscribe first." },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${appUrl}/dashboard/business`,
  });

  return NextResponse.json({ url: session.url });
}
