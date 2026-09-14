import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/nextjs";

const FOR_BRANDS_LINKS: { href: string; label: string; text: string }[] = [
  {
    href: "/for-brands/marketing-teams",
    label: "Marketing teams",
    text: "Run every campaign from one shared account",
  },
  {
    href: "/for-brands/agencies",
    label: "Agencies",
    text: "Search creators for every client, from one place",
  },
  {
    href: "/for-brands/founders",
    label: "Founders",
    text: "Find your first creator partners, no agency needed",
  },
  {
    href: "/for-brands/enterprise",
    label: "Enterprise",
    text: "Custom plans for creator programs at volume",
  },
];

const FOR_CREATORS_LINKS: { href: string; label: string; text: string }[] = [
  {
    href: "/for-creators/getting-started",
    label: "New creators",
    text: "List your rate card and start getting booked",
  },
  {
    href: "/for-creators/ugc",
    label: "UGC creators",
    text: "Get paid for content, not your following",
  },
  {
    href: "/for-creators/photographers-videographers",
    label: "Photographers & videographers",
    text: "Turn your portfolio into paid brand work",
  },
  {
    href: "/for-creators/full-time",
    label: "Full-time creators",
    text: "Manage every brand relationship from one inbox",
  },
];

// Pure-CSS dropdown (group-hover/group-focus-within) shared by both the
// "For brands" and "For creators" nav items — no client component needed,
// so Navbar can stay a server component.
function NavDropdown({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string; text: string }[];
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 hover:text-slate-900"
      >
        {label}
        <svg
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          className="h-3 w-3 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-2xl bg-white p-2 shadow-lg ring-1 ring-slate-200/70">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-3.5 py-2.5 hover:bg-slate-50"
            >
              <p className="text-sm font-semibold text-slate-900">
                {item.label}
              </p>
              <p className="mt-0.5 text-xs font-normal text-slate-500">
                {item.text}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sunset text-sm font-bold text-white shadow-sm">
            K
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-slate-900">
            Kolabo
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 sm:flex">
          <Link href="/creators" className="hover:text-slate-900">
            Browse creators
          </Link>
          <NavDropdown label="For creators" links={FOR_CREATORS_LINKS} />
          <NavDropdown label="For brands" links={FOR_BRANDS_LINKS} />
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
