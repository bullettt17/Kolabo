import Link from "next/link";
import type { IndustryStat } from "@/lib/stats";

export interface AudienceLandingPageProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  benefits: { title: string; text: string }[];
  ctaLabel: string;
  ctaHref: string;
  secondaryNote?: string;
  /** Defaults to "Browse the creator directory →" / "/creators" (brand-side pages). */
  secondaryLinkLabel?: string;
  secondaryLinkHref?: string;
  /** Set false to omit the secondary link entirely (e.g. creator-side pages). */
  showSecondaryLink?: boolean;
  /** Closing-band headline. Defaults to the brand-side subscription pitch. */
  closingHeadline?: string;
  /** Defaults to `ctaLabel`. */
  closingCtaLabel?: string;
  /** Optional sourced-statistics strip, shown right under the hero (brand-side pages). */
  stats?: IndustryStat[];
  /** Optional hero photo, shown beside the headline on larger screens. */
  heroImage?: { src: string; alt: string };
}

// Shared layout for every "/for-brands/*" and "/for-creators/*" audience
// page — one hero, a benefits grid, and a closing CTA. Keeps every audience
// page visually consistent while letting each one carry its own headline,
// benefits, and closing pitch (brand pages sell the subscription; creator
// pages sell free-to-join/zero-commission).
export default function AudienceLandingPage({
  eyebrow,
  title,
  subtitle,
  benefits,
  ctaLabel,
  ctaHref,
  secondaryNote,
  secondaryLinkLabel = "Browse the creator directory →",
  secondaryLinkHref = "/creators",
  showSecondaryLink = true,
  closingHeadline = "One flat monthly subscription — no commission on what you pay creators.",
  closingCtaLabel,
  stats,
  heroImage,
}: AudienceLandingPageProps) {
  return (
    <div>
      <section className="border-b border-slate-100 bg-white">
        <div
          className={`container-page py-16 sm:py-20 ${
            heroImage ? "grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""
          }`}
        >
          <div>
            <span className="badge mb-4">{eyebrow}</span>
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tightest text-slate-900 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600">{subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={ctaHref} className="btn-primary px-6 py-3 text-base">
                {ctaLabel}
              </Link>
              {showSecondaryLink && (
                <Link
                  href={secondaryLinkHref}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  {secondaryLinkLabel}
                </Link>
              )}
            </div>
            {secondaryNote && (
              <p className="mt-4 text-sm text-slate-500">{secondaryNote}</p>
            )}
          </div>
          {heroImage && (
            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${heroImage.src}?auto=format&fit=crop&w=1200&q=80`}
                alt={heroImage.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </section>

      {stats && stats.length > 0 && (
        <section className="border-b border-slate-100 bg-white py-14">
          <div className="container-page">
            <p className="mb-6 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Why brands budget for influencer marketing
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-4xl font-bold tracking-tight text-brand-600">
                    {s.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{s.label}</p>
                  <p className="mt-2 text-xs text-slate-400">{s.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-slate-100 bg-slate-50 py-16">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="card">
                <p className="font-semibold text-slate-900">{b.title}</p>
                <p className="mt-1.5 text-sm text-slate-600">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sunset-band">
        <div className="container-page relative z-10 flex flex-col items-center gap-5 py-16 text-center">
          <h2 className="font-display text-2xl font-bold tracking-tightest text-white sm:text-3xl">
            {closingHeadline}
          </h2>
          <Link
            href={ctaHref}
            className="btn bg-cream px-7 py-3.5 text-base text-ink hover:bg-white"
          >
            {closingCtaLabel ?? ctaLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
