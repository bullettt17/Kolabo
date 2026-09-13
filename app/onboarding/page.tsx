import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/auth";
import OnboardingForm from "@/components/OnboardingForm";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const role = await getUserRole();
  if (role) redirect("/dashboard");

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-2xl">
        <h1 className="text-center text-3xl font-bold text-slate-900">
          How will you use Kolabo?
        </h1>
        <p className="mt-2 text-center text-slate-600">
          You can&apos;t switch this later on this MVP, so pick the one that
          matches you.
        </p>
        <OnboardingForm />
      </div>
    </div>
  );
}
