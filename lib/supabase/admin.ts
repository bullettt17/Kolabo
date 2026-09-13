import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. This BYPASSES Row Level Security, so it
 * must only ever be imported in server-only code (API routes, route
 * handlers, server actions) — never in a Client Component, and never
 * returned from an API response.
 *
 * Because it bypasses RLS, every call site is responsible for checking
 * the caller's Clerk identity and role (see lib/auth.ts) before reading
 * or writing anything sensitive.
 */
let cached: SupabaseClient | null = null;

export function createAdminSupabaseClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars."
    );
  }

  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
