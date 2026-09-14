import type { Metadata } from "next";
import AudienceLandingPage from "@/components/AudienceLandingPage";
import { INFLUENCER_MARKETING_STATS } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Kolabo for Founders",
  description:
    "Find your first creator partners yourself, without hiring an agency or a minimum spend.",
};

export default function FoundersPage() {
  return (
    <AudienceLandingPage
      eyebrow="For founders"
      title="Find your first creator partners, without an agency."
      subtitle="Kolabo is built for founders who want to run their own creator outreach — search by budget, message creators directly, and start small."
      ctaLabel="Start your subscription"
      ctaHref="/sign-up"
      stats={INFLUENCER_MARKETING_STATS}
      heroImage={{
        src: "https://images.unsplash.com/photo-1668112262164-56e782a6e07a",
        alt: "A founder working on a laptop",
      }}
      secondaryNote="No minimum spend, no retainer — cancel your subscription any time."
      benefits={[
        {
          title: "No agency retainer",
          text: "Skip the minimum spend and management fee — search and message creators yourself for one flat monthly subscription.",
        },
        {
          title: "Filter by what you can actually spend",
          text: "Set a maximum rate and Kolabo only shows creators within it, so you can start with a small first campaign.",
        },
        {
          title: "Message creators directly",
          text: "No cold DMs, no guessing who'll reply — creators on Kolabo are there to be contacted by businesses like yours.",
        },
        {
          title: "Scale up when you're ready",
          text: "Start with one creator, expand as your budget grows, and cancel any time if it's not the right moment.",
        },
      ]}
    />
  );
}
