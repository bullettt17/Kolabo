import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Read-only, anon-key Supabase client for use in Server Components and
 * anywhere you only need to read data that's protected by Row Level
 * Security policies (see supabase/schema.sql). Never use this client to
 * write data on behalf of a specific user — use lib/supabase/admin.ts
 * inside an API route instead, after verifying the Clerk session there.
 */
export function createPublicSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars."
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
