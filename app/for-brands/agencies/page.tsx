import type { Metadata } from "next";
import AudienceLandingPage from "@/components/AudienceLandingPage";
import { INFLUENCER_MARKETING_STATS } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Kolabo for Agencies & Marketing Teams",
  description:
    "Search creators for every client or campaign from one shared Kolabo account — no separate seats, no per-client lists.",
};

export default function AgenciesPage() {
  return (
    <AudienceLandingPage
      eyebrow="For agencies & marketing teams"
      title="One account. Every client, every campaign."
      subtitle="Whether you're staffing client briefs or running your own team's campaigns, Kolabo gives you a single creator directory to work from — filter by niche, platform, country, and budget, and keep every conversation visible to the whole team."
      ctaLabel="Start your subscription"
      ctaHref="/sign-up"
      stats={INFLUENCER_MARKETING_STATS}
      heroImage={{
        src: "https://images.unsplash.com/photo-1622675363311-3e1904dc1885",
        alt: "An agency team on laptops during a client board meeting",
      }}
      benefits={[
        {
          title: "One login, one subscription",
          text: "Your whole team searches and messages creators from the same account — no separate seats to buy or manage, and no rebuilding a shortlist per client.",
        },
        {
          title: "Nothing gets lost between teammates",
          text: "Every conversation with a creator stays visible under Messages, so a campaign or client brief doesn't stall if one person is out.",
        },
        {
          title: "You negotiate directly",
          text: "Message creators yourself and agree terms on your own timeline — Kolabo doesn't sit in the middle of the deal.",
        },
        {
          title: "One flat fee, not per client",
          text: "Your subscription covers unlimited search and messaging across every campaign or client you're working for — no per-booking commission.",
        },
      ]}
    />
  );
}
