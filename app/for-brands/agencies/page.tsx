import type { Metadata } from "next";
import AudienceLandingPage from "@/components/AudienceLandingPage";
import { INFLUENCER_MARKETING_STATS } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Kolabo for Agencies",
  description:
    "Search creators for every client brief from one Kolabo account, without juggling separate lists per client.",
};

export default function AgenciesPage() {
  return (
    <AudienceLandingPage
      eyebrow="For agencies"
      title="Search creators for every client, from one account."
      subtitle="Kolabo gives your agency a single directory to work from — filter by niche, platform, country, and budget for whichever brief you're staffing."
      ctaLabel="Start your subscription"
      ctaHref="/sign-up"
      stats={INFLUENCER_MARKETING_STATS}
      heroImage={{
        src: "https://images.unsplash.com/photo-1622675363311-3e1904dc1885",
        alt: "An agency team on laptops during a client board meeting",
      }}
      benefits={[
        {
          title: "One directory, every client",
          text: "Search the same creator directory for each client brief instead of rebuilding a shortlist from scratch every time.",
        },
        {
          title: "Save a shortlist per campaign",
          text: "Bookmark creators as you shortlist them, so each client's options stay easy to find again later.",
        },
        {
          title: "You negotiate directly",
          text: "Message creators yourself and agree terms on your own timeline — Kolabo doesn't sit in the middle of the deal.",
        },
        {
          title: "One flat fee, not per client",
          text: "Your subscription covers unlimited search and messaging across every client you're working for — no per-booking commission.",
        },
      ]}
    />
  );
}
