import type { Metadata } from "next";
import AudienceLandingPage from "@/components/AudienceLandingPage";
import { INFLUENCER_MARKETING_STATS } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Kolabo for Marketing Teams",
  description:
    "Run every creator conversation your marketing team is having from one shared Kolabo account.",
};

export default function MarketingTeamsPage() {
  return (
    <AudienceLandingPage
      eyebrow="For marketing teams"
      title="Run every creator campaign from one shared account."
      subtitle="Search, message, and track creator conversations in one place — so nothing about a campaign lives only in one person's inbox."
      ctaLabel="Start your subscription"
      ctaHref="/sign-up"
      stats={INFLUENCER_MARKETING_STATS}
      heroImage={{
        src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
        alt: "A marketing team gathered around a table during a planning meeting",
      }}
      benefits={[
        {
          title: "One login, one subscription",
          text: "Your whole team searches and messages creators from the same account — no separate seats to buy or manage.",
        },
        {
          title: "Nothing gets lost between teammates",
          text: "Every conversation with a creator stays visible under Messages, so a campaign doesn't stall if one person is out.",
        },
        {
          title: "Shortlist as you plan",
          text: "Save creators to a shared list while you're still deciding on a campaign, then come back to message the ones you pick.",
        },
        {
          title: "No commission, ever",
          text: "You pay one flat monthly fee. Whatever you agree with a creator is between the two of you — Kolabo doesn't take a cut.",
        },
      ]}
    />
  );
}
