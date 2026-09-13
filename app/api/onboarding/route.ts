import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { setUserRole } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  role: z.enum(["creator", "business"]),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const user = await currentUser();
  const existingRole = user?.publicMetadata?.role;
  if (existingRole === "creator" || existingRole === "business") {
    return NextResponse.json(
      { error: "Role already set" },
      { status: 400 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const { role } = parsed.data;
  const supabase = createAdminSupabaseClient();

  if (role === "creator") {
    const { error } = await supabase.from("creators").insert({
      user_id: userId,
      display_name:
        user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "New creator",
    });
    if (error && error.code !== "23505" /* unique_violation: already exists */) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { data: business, error } = await supabase
      .from("businesses")
      .insert({
        user_id: userId,
        company_name:
          user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "New business",
      })
      .select("id")
      .single();

    if (error && error.code !== "23505") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Make sure every business has a subscriptions row to track against.
    if (business?.id) {
      await supabase
        .from("subscriptions")
        .upsert(
          { business_id: business.id, status: "none" },
          { onConflict: "business_id", ignoreDuplicates: true }
        );
    }
  }

  await setUserRole(userId, role);

  return NextResponse.json({ ok: true, role });
}
