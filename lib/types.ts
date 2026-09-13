export type UserRole = "creator" | "business";

export interface PlatformHandle {
  platform: "instagram" | "tiktok" | "youtube" | "twitter" | "twitch" | "other";
  handle: string;
  followers: number;
  url?: string;
}

export interface CreatorProfile {
  id: string;
  user_id: string; // Clerk user id
  display_name: string;
  headline: string | null;
  bio: string | null;
  niche: string | null;
  location: string | null;
  avatar_url: string | null;
  platforms: PlatformHandle[];
  total_followers: number;
  engagement_rate: number | null;
  starting_rate: number | null;
  rate_notes: string | null;
  portfolio_links: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessProfile {
  id: string;
  user_id: string; // Clerk user id
  company_name: string;
  website: string | null;
  industry: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "none";

export interface Subscription {
  id: string;
  business_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  business_id: string;
  creator_id: string;
  created_at: string;
  last_message_at: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_user_id: string; // Clerk user id of sender
  sender_role: UserRole;
  body: string;
  created_at: string;
  read_at: string | null;
}

export const NICHES = [
  "Beauty",
  "Fashion",
  "Fitness",
  "Food & Drink",
  "Gaming",
  "Lifestyle",
  "Music",
  "Parenting",
  "Tech",
  "Travel",
  "Business & Finance",
  "Comedy",
  "Education",
  "Sports",
  "Other",
] as const;

export const PLATFORMS = [
  "instagram",
  "tiktok",
  "youtube",
  "twitter",
  "twitch",
  "other",
] as const;
