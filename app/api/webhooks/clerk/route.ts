import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// Optional but recommended: keeps Supabase clean when a user deletes their
// Clerk account. Wire this up in Clerk Dashboard → Webhooks → Add endpoint
// → https://yourdomain.com/api/webhooks/clerk, subscribed to "user.deleted".
export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SECRET is not configured" },
      { status: 500 }
    );
  }

  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let event: { type: string; data: { id: string } };
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(payload, headers) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "user.deleted") {
    const supabase = createAdminSupabaseClient();
    const userId = event.data.id;
    await supabase.from("creators").delete().eq("user_id", userId);
    await supabase.from("businesses").delete().eq("user_id", userId);
  }

  return NextResponse.json({ received: true });
}
