import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { PLATFORMS } from "@/lib/types";

const platformSchema = z.object({
  platform: z.enum(PLATFORMS),
  handle: z.string().min(1).max(60),
  followers: z.coerce.number().int().min(0).max(1_000_000_000),
  url: z.string().url().optional().or(z.literal("")),
});

const bodySchema = z.object({
  display_name: z.string().min(1).max(80),
  headline: z.string().max(120).optional().or(z.literal("")),
  bio: z.string().max(2000).optional().or(z.literal("")),
  niche: z.string().max(60).optional().or(z.literal("")),
  location: z.string().max(80).optional().or(z.literal("")),
  avatar_url: z.string().url().optional().or(z.literal("")),
  platforms: z.array(platformSchema).max(10),
  engagement_rate: z.coerce.number().min(0).max(100).optional().nullable(),
  starting_rate: z.coerce.number().min(0).max(10_000_000).optional().nullable(),
  rate_notes: z.string().max(1000).optional().or(z.literal("")),
  portfolio_links: z.array(z.string().url()).max(10),
  is_published: z.boolean(),
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
  const total_followers = data.platforms.reduce(
    (sum, p) => sum + (p.followers || 0),
    0
  );

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("creators")
    .update({
      display_name: data.display_name,
      headline: data.headline || null,
      bio: data.bio || null,
      niche: data.niche || null,
      location: data.location || null,
      avatar_url: data.avatar_url || null,
      platforms: data.platforms,
      total_followers,
      engagement_rate: data.engagement_rate ?? null,
      starting_rate: data.starting_rate ?? null,
      rate_notes: data.rate_notes || null,
      portfolio_links: data.portfolio_links,
      is_published: data.is_published,
    })
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
