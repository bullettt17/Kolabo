import type { Metadata } from "next";
import AudienceLandingPage from "@/components/AudienceLandingPage";
import { INFLUENCER_MARKETING_STATS } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Kolabo Enterprise",
  description:
    "Custom Kolabo plans for teams managing creator programs across multiple brands or regions.",
};

// NOTE: the CTA below points at a placeholder mailto address. Swap
// "hello@kolabo.co" for a real inbox once you have one set up (README →
// "5. Set up Stripe" area is a good place to also note your support email).
export default function EnterprisePage() {
  return (
    <AudienceLandingPage
      eyebrow="For enterprise"
      title="Custom plans for creator programs at volume."
      subtitle="Running creator relationships across multiple brands, regions, or teams? Get in touch and we'll set up a plan around how your team actually works."
      ctaLabel="Get in touch"
      ctaHref="mailto:hello@kolabo.co?subject=Kolabo%20Enterprise"
      stats={INFLUENCER_MARKETING_STATS}
      heroImage={{
        src: "https://images.unsplash.com/photo-1758598497635-48cbbb1f6555",
        alt: "A team member in a modern corporate office setting",
      }}
      secondaryNote="We'll reply from a real person, not a form — expect a response within a couple of business days."
      benefits={[
        {
          title: "Multiple team members, one account",
          text: "Give your whole team access to search and message creators under a single Kolabo subscription.",
        },
        {
          title: "Manage more than one brand",
          text: "Running creator programs for several brands or regions? We'll talk through how to structure that on Kolabo.",
        },
        {
          title: "Dedicated onboarding",
          text: "We'll help your team get set up and searching for the right creators from day one.",
        },
        {
          title: "Volume-based pricing",
          text: "If the standard monthly or yearly plan doesn't fit how much your team searches and messages, ask us about volume pricing.",
        },
      ]}
    />
  );
}
