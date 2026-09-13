import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-sm ring-1 ring-slate-100",
          },
        }}
      />
    </div>
  );
}
