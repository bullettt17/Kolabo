import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  company_name: z.string().min(1).max(120),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().max(60).optional().or(z.literal("")),
  logo_url: z.string().url().optional().or(z.literal("")),
});

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("businesses")
    .update({
      company_name: data.company_name,
      website: data.website || null,
      industry: data.industry || null,
      logo_url: data.logo_url || null,
    })
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
