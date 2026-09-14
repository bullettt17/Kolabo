import type { Metadata } from "next";
import AudienceLandingPage from "@/components/AudienceLandingPage";

export const metadata: Metadata = {
  title: "Kolabo for Full-Time Creators",
  description:
    "Manage every brand conversation from one inbox — built for creators juggling multiple bookings at once.",
};

export default function FullTimePage() {
  return (
    <AudienceLandingPage
      eyebrow="For full-time creators"
      title="Manage every brand relationship from one inbox."
      subtitle="Running your creator work as a full-time job means juggling several brands at once — Kolabo keeps every conversation, rate, and saved deal in one place."
      ctaLabel="Create your free profile"
      ctaHref="/sign-up"
      showSecondaryLink={false}
      heroImage={{
        src: "https://images.unsplash.com/photo-1627244714766-94dab62ed964",
        alt: "A creator wearing headphones editing video content in a workspace",
      }}
      closingHeadline="Free to join. No commission, however many brands you work with."
      closingCtaLabel="Create your free profile"
      benefits={[
        {
          title: "Every conversation in one place",
          text: "Message multiple brands at once from a single Kolabo inbox instead of juggling DMs across platforms.",
        },
        {
          title: "Never a commission",
          text: "Whether you're booking one brand a month or ten, Kolabo never takes a cut — you keep 100% of every rate you agree.",
        },
        {
          title: "Packages for every deliverable",
          text: "List as many priced packages as you offer — reels, stories, UGC, photo sets — so brands can book the right one without a back-and-forth.",
        },
        {
          title: "A profile that works while you don't reply instantly",
          text: "Your rates, packages, and portfolio are visible around the clock, so brands can decide to reach out even before you're online.",
        },
      ]}
    />
  );
}
