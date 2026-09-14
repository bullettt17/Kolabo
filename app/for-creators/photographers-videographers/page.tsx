import type { Metadata } from "next";
import AudienceLandingPage from "@/components/AudienceLandingPage";

export const metadata: Metadata = {
  title: "Kolabo for Photographers & Videographers",
  description:
    "Turn your portfolio into paid brand work — list a content-example gallery and priced packages on Kolabo.",
};

export default function PhotographersVideographersPage() {
  return (
    <AudienceLandingPage
      eyebrow="For photographers & videographers"
      title="Turn your portfolio into paid brand work."
      subtitle="Show your best shots, list what a shoot costs, and let brands who need real photography or video find you directly — no agency in between."
      ctaLabel="Create your free profile"
      ctaHref="/sign-up"
      showSecondaryLink={false}
      heroImage={{
        src: "https://images.unsplash.com/photo-1630797160666-38e8c5ba44c1",
        alt: "A photographer holding a camera outdoors during daytime",
      }}
      closingHeadline="Free to join. Keep 100% of what you charge."
      closingCtaLabel="Create your free profile"
      benefits={[
        {
          title: "A portfolio brands actually see",
          text: "Add a grid of your best content examples right on your profile — the first thing a brand sees when they open your page.",
        },
        {
          title: "Price by shoot type",
          text: "List separate packages for product shoots, portraits, or video edits — each with its own price, so there's no back-and-forth over what's included.",
        },
        {
          title: "No agency cut",
          text: "Brands message and pay you directly. Kolabo takes a flat subscription from brands, never a commission on your rate.",
        },
        {
          title: "Filtered by the brands who need you",
          text: "Brands can filter the directory by niche and platform, so you're found by people looking for exactly what you shoot.",
        },
      ]}
    />
  );
}
