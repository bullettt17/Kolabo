import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB, matches the bucket's file_size_limit
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);
const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const role = await getUserRole();
  if (role !== "creator") {
    return NextResponse.json({ error: "Not a creator account" }, { status: 403 });
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Please upload a PNG, JPEG, WEBP, or GIF image." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be 5MB or smaller." },
      { status: 400 }
    );
  }

  const ext = EXT_BY_TYPE[file.type] ?? "jpg";
  const path = `${userId}/${Date.now()}.${ext}`;

  const supabase = createAdminSupabaseClient();
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}
