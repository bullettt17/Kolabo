import type { Metadata } from "next";
import AudienceLandingPage from "@/components/AudienceLandingPage";

export const metadata: Metadata = {
  title: "Kolabo for UGC Creators, Photographers & Videographers",
  description:
    "Get paid for content, not your following — list UGC packages, shoot rates, or a portfolio gallery for brands to find.",
};

export default function UgcAndContentPage() {
  return (
    <AudienceLandingPage
      eyebrow="For UGC, photo & video creators"
      title="Get paid for content, not your following."
      subtitle="Whether you shoot UGC, product photography, or brand video, Kolabo's directory is where businesses come looking for content — not follower counts."
      ctaLabel="Create your free profile"
      ctaHref="/sign-up"
      showSecondaryLink={false}
      heroImage={{
        src: "https://images.unsplash.com/photo-1543525469-65b61cc2bc06",
        alt: "A creator using a smartphone to record UGC video content",
      }}
      closingHeadline="Free to join. Keep 100% of what you charge."
      closingCtaLabel="Create your free profile"
      benefits={[
        {
          title: "Small following, real income",
          text: "This work isn't about reach — it's about production. List your style and let your content speak for itself, whatever your following looks like.",
        },
        {
          title: "A portfolio brands actually see",
          text: "Add a grid of your best content examples right on your profile — the first thing a brand sees when they open your page.",
        },
        {
          title: "Package your deliverables",
          text: "List priced packages like \"1 UGC video — £80\" or \"Product shoot — £150\" instead of one flat rate, so brands know exactly what they're booking.",
        },
        {
          title: "No exclusivity, no agency cut",
          text: "Take on as many brands as you want, whenever you want. Kolabo takes a flat subscription from brands, never a commission on your rate.",
        },
      ]}
    />
  );
}
