import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { businessHasActiveSubscription } from "@/lib/subscription";
import type { BusinessProfile, CreatorProfile } from "@/lib/types";

const bodySchema = z.object({
  creatorId: z.string().uuid(),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const user = await currentUser();
  if (user?.publicMetadata?.role !== "business") {
    return NextResponse.json(
      { error: "Only business accounts can start conversations." },
      { status: 403 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid creator id" }, { status: 400 });
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

  const hasSubscription = await businessHasActiveSubscription(business.id);
  if (!hasSubscription) {
    return NextResponse.json(
      { error: "An active subscription is required to message creators.", code: "SUBSCRIPTION_REQUIRED" },
      { status: 402 }
    );
  }

  const { data: creator } = await supabase
    .from("creators")
    .select("*")
    .eq("id", parsed.data.creatorId)
    .single<CreatorProfile>();

  if (!creator || !creator.is_published) {
    return NextResponse.json({ error: "Creator not found." }, { status: 404 });
  }

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("business_id", business.id)
    .eq("creator_id", creator.id)
    .maybeSingle<{ id: string }>();

  if (existing) {
    return NextResponse.json({ conversationId: existing.id });
  }

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ business_id: business.id, creator_id: creator.id })
    .select("id")
    .single<{ id: string }>();

  if (error || !created) {
    return NextResponse.json(
      { error: error?.message || "Failed to start conversation" },
      { status: 500 }
    );
  }

  return NextResponse.json({ conversationId: created.id });
}
