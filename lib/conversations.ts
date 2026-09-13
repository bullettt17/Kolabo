import { createAdminSupabaseClient } from "./supabase/admin";
import type { BusinessProfile, Conversation, CreatorProfile, Message } from "./types";

export interface ConversationListItem {
  id: string;
  lastMessageAt: string | null;
  otherPartyName: string;
  otherPartyAvatar: string | null;
  creatorId: string;
  businessId: string;
}

/**
 * Returns every conversation the given Clerk user participates in, whether
 * they're the creator or the business side. Ordered by most recent activity.
 */
export async function getConversationsForUser(
  userId: string,
  role: "creator" | "business"
): Promise<ConversationListItem[]> {
  const supabase = createAdminSupabaseClient();

  if (role === "creator") {
    const { data: creator } = await supabase
      .from("creators")
      .select("id")
      .eq("user_id", userId)
      .single<{ id: string }>();
    if (!creator) return [];

    const { data } = await supabase
      .from("conversations")
      .select("id, last_message_at, creator_id, business_id, businesses(company_name, logo_url)")
      .eq("creator_id", creator.id)
      .order("last_message_at", { ascending: false, nullsFirst: false });

    return (
      (data as unknown as (Conversation & {
        businesses: Pick<BusinessProfile, "company_name" | "logo_url"> | null;
      })[]) ?? []
    ).map((row) => ({
      id: row.id,
      lastMessageAt: row.last_message_at,
      otherPartyName: row.businesses?.company_name ?? "Business",
      otherPartyAvatar: row.businesses?.logo_url ?? null,
      creatorId: row.creator_id,
      businessId: row.business_id,
    }));
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", userId)
    .single<{ id: string }>();
  if (!business) return [];

  const { data } = await supabase
    .from("conversations")
    .select("id, last_message_at, creator_id, business_id, creators(display_name, avatar_url)")
    .eq("business_id", business.id)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  return (
    (data as unknown as (Conversation & {
      creators: Pick<CreatorProfile, "display_name" | "avatar_url"> | null;
    })[]) ?? []
  ).map((row) => ({
    id: row.id,
    lastMessageAt: row.last_message_at,
    otherPartyName: row.creators?.display_name ?? "Creator",
    otherPartyAvatar: row.creators?.avatar_url ?? null,
    creatorId: row.creator_id,
    businessId: row.business_id,
  }));
}

export interface ConversationDetail {
  conversation: Conversation;
  creator: CreatorProfile;
  business: BusinessProfile;
  messages: Message[];
}

/**
 * Loads a conversation with authorization: returns null if it doesn't
 * exist or the given user isn't a participant in it.
 */
export async function getConversationForParticipant(
  conversationId: string,
  userId: string,
  role: "creator" | "business"
): Promise<ConversationDetail | null> {
  const supabase = createAdminSupabaseClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single<Conversation>();

  if (!conversation) return null;

  const [{ data: creator }, { data: business }] = await Promise.all([
    supabase
      .from("creators")
      .select("*")
      .eq("id", conversation.creator_id)
      .single<CreatorProfile>(),
    supabase
      .from("businesses")
      .select("*")
      .eq("id", conversation.business_id)
      .single<BusinessProfile>(),
  ]);

  if (!creator || !business) return null;

  const isParticipant =
    (role === "creator" && creator.user_id === userId) ||
    (role === "business" && business.user_id === userId);
  if (!isParticipant) return null;

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return {
    conversation,
    creator,
    business,
    messages: (messages as Message[]) ?? [],
  };
}
