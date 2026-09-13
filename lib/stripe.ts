import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY env var.");
  }

  cached = new Stripe(key, {
    apiVersion: "2024-06-20",
    typescript: true,
  });

  return cached;
}
