import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getUserRole } from "@/lib/auth";
import { getConversationForParticipant } from "@/lib/conversations";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { businessHasActiveSubscription } from "@/lib/subscription";

const bodySchema = z.object({
  conversationId: z.string().uuid(),
  body: z.string().min(1).max(4000),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const role = await getUserRole();
  if (!role) {
    return NextResponse.json({ error: "Complete onboarding first." }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid message" },
      { status: 400 }
    );
  }

  const { conversationId, body } = parsed.data;

  const detail = await getConversationForParticipant(conversationId, userId, role);
  if (!detail) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  // Businesses must keep an active subscription to keep messaging, even in
  // threads they started before their subscription lapsed.
  if (role === "business") {
    const active = await businessHasActiveSubscription(detail.business.id);
    if (!active) {
      return NextResponse.json(
        {
          error: "Your subscription is inactive — reactivate it to keep messaging creators.",
          code: "SUBSCRIPTION_REQUIRED",
        },
        { status: 402 }
      );
    }
  }

  const supabase = createAdminSupabaseClient();
  const now = new Date().toISOString();

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_user_id: userId,
      sender_role: role,
      body,
      created_at: now,
    })
    .select("*")
    .single();

  if (error || !message) {
    return NextResponse.json(
      { error: error?.message || "Failed to send message" },
      { status: 500 }
    );
  }

  await supabase
    .from("conversations")
    .update({ last_message_at: now })
    .eq("id", conversationId);

  return NextResponse.json({ message });
}
