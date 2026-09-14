import type { Metadata } from "next";
import AudienceLandingPage from "@/components/AudienceLandingPage";

export const metadata: Metadata = {
  title: "Kolabo for New Creators",
  description:
    "Set up a free Kolabo profile and start getting found by brands — no follower minimum, no fees to join.",
};

export default function GettingStartedPage() {
  return (
    <AudienceLandingPage
      eyebrow="For new creators"
      title="List your rate card and start getting booked."
      subtitle="Set up a free Kolabo profile in minutes — add your niche, platforms, and rates, and brands can find and message you directly."
      ctaLabel="Create your free profile"
      ctaHref="/sign-up"
      showSecondaryLink={false}
      heroImage={{
        src: "https://images.unsplash.com/photo-1595039838779-f3780873afdd",
        alt: "A creator holding a smartphone, getting ready to shoot content",
      }}
      closingHeadline="Free to join. Keep 100% of what you charge."
      closingCtaLabel="Create your free profile"
      benefits={[
        {
          title: "No follower minimum",
          text: "There's no threshold to join Kolabo — list what you offer and let brands judge you on your work, not your follower count.",
        },
        {
          title: "Free, always",
          text: "Creating and keeping a Kolabo profile costs nothing. Kolabo charges brands a subscription — never creators, and never a cut of your rate.",
        },
        {
          title: "You set your own rates",
          text: "List one starting rate or break your work into priced packages (e.g. \"1 Instagram Reel — £150\") — you decide what you charge and for what.",
        },
        {
          title: "Brands message you first",
          text: "No applying to open briefs or pitching cold — brands search the directory by niche, platform, and budget, then reach out to you.",
        },
      ]}
    />
  );
}
