import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            K
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Kolabo
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
          <Link href="/creators" className="hover:text-slate-900">
            Browse creators
          </Link>
          <Link href="/#for-businesses" className="hover:text-slate-900">
            For businesses
          </Link>
          <Link href="/#for-creators" className="hover:text-slate-900">
            For creators
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href="/dashboard" className="btn-ghost">
              Dashboard
            </Link>
            <Link href="/messages" className="btn-ghost">
              Messages
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-ghost">Sign in</button>
            </SignInButton>
            <Link href="/sign-up" className="btn-primary">
              Get started
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
