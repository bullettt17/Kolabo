import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Kolabo. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/creators" className="hover:text-slate-900">
            Browse creators
          </Link>
          <Link href="/sign-up" className="hover:text-slate-900">
            Join as a creator
          </Link>
          <Link href="/sign-up" className="hover:text-slate-900">
            Join as a business
          </Link>
        </div>
      </div>
    </footer>
  );
}
