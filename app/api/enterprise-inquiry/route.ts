import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// Public, unauthenticated endpoint — the Enterprise page's contact form
// posts here instead of using a mailto: link. Every request is validated
// server-side before it touches the database; the admin client is used
// because this table has no public RLS policies (see the
// create_enterprise_inquiries migration).
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, companyName, email, teamSize, message } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (
    typeof name !== "string" ||
    typeof companyName !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    name.trim().length < 1 ||
    name.trim().length > 200 ||
    companyName.trim().length < 1 ||
    companyName.trim().length > 200 ||
    message.trim().length < 1 ||
    message.trim().length > 4000
  ) {
    return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
  }

  const trimmedEmail = email.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail) || trimmedEmail.length > 320) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const trimmedTeamSize =
    typeof teamSize === "string" && teamSize.trim().length > 0
      ? teamSize.trim().slice(0, 100)
      : null;

  try {
    const supabase = createAdminSupabaseClient();
    const { error } = await supabase.from("enterprise_inquiries").insert({
      name: name.trim(),
      company_name: companyName.trim(),
      email: trimmedEmail,
      team_size: trimmedTeamSize,
      message: message.trim(),
    });

    if (error) {
      console.error("enterprise_inquiries insert failed:", error);
      return NextResponse.json(
        { error: "Something went wrong on our end — please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("enterprise-inquiry route error:", err);
    return NextResponse.json(
      { error: "Something went wrong on our end — please try again." },
      { status: 500 }
    );
  }
}
