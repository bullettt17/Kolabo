import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { UserRole } from "./types";

/**
 * Kolabo stores a user's role ("creator" or "business") in Clerk's
 * publicMetadata once they finish onboarding. This is the single source
 * of truth for role — Supabase rows are looked up by Clerk user id.
 */

export async function getUserRole(): Promise<UserRole | null> {
  const user = await currentUser();
  const role = user?.publicMetadata?.role;
  return role === "creator" || role === "business" ? role : null;
}

/** Throws (redirects) if there's no signed-in user. Returns the Clerk user id. */
export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return userId;
}

/** Redirects unauthenticated users to sign-in, and un-onboarded users to /onboarding. */
export async function requireRole(role: UserRole): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const currentRole = await getUserRole();
  if (!currentRole) {
    redirect("/onboarding");
  }
  if (currentRole !== role) {
    redirect("/dashboard");
  }
  return userId;
}

export async function setUserRole(userId: string, role: UserRole) {
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role },
  });
}
