import type { Metadata } from "next";
import AudienceLandingPage from "@/components/AudienceLandingPage";

export const metadata: Metadata = {
  title: "Kolabo for UGC Creators",
  description:
    "Get paid for content, not your following — list UGC packages and content examples for brands to find.",
};

export default function UgcPage() {
  return (
    <AudienceLandingPage
      eyebrow="For UGC creators"
      title="Get paid for content, not your following."
      subtitle="User-generated content briefs pay for footage and photos brands can use in their own ads — Kolabo's directory is where brands come looking for it."
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
          text: "UGC work isn't about reach — it's about production. List your style and let your content speak for itself, whatever your following looks like.",
        },
        {
          title: "Show your style upfront",
          text: "Add content-example images to your profile so brands can see your look and quality before they ever send a message.",
        },
        {
          title: "Package your deliverables",
          text: "List priced packages like \"1 UGC video — £80\" or \"3-photo bundle — £120\" instead of one flat rate, so brands know exactly what they're booking.",
        },
        {
          title: "No exclusivity",
          text: "Take on as many brands as you want, whenever you want — Kolabo doesn't lock you into one client or one platform.",
        },
      ]}
    />
  );
}
