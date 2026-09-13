import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/auth";

export default async function DashboardIndexPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const role = await getUserRole();
  if (!role) redirect("/onboarding");

  redirect(role === "creator" ? "/dashboard/creator" : "/dashboard/business");
}
