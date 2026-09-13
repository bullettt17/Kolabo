import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { SubscriptionStatus } from "@/lib/types";

// Stripe needs the raw request body to verify the webhook signature, so
// this route must not run through any body-parsing middleware.
export const runtime = "nodejs";

async function upsertFromSubscription(sub: Stripe.Subscription) {
  const supabase = createAdminSupabaseClient();
  const businessId = sub.metadata?.business_id;

  const patch = {
    stripe_customer_id:
      typeof sub.customer === "string" ? sub.customer : sub.customer.id,
    stripe_subscription_id: sub.id,
    status: sub.status as SubscriptionStatus,
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
  };

  if (businessId) {
    await supabase
      .from("subscriptions")
      .upsert({ business_id: businessId, ...patch }, { onConflict: "business_id" });
    return;
  }

  // Fallback: match by Stripe customer id if metadata wasn't set for some reason.
  await supabase
    .from("subscriptions")
    .update(patch)
    .eq("stripe_customer_id", patch.stripe_customer_id);
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await upsertFromSubscription(sub);
      break;
    }
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id
        );
        await upsertFromSubscription(sub);
      }
      break;
    }
    default:
      // Ignore events we don't act on.
      break;
  }

  return NextResponse.json({ received: true });
}
