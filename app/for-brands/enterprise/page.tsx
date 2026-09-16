import type { Metadata } from "next";
import AudienceLandingPage from "@/components/AudienceLandingPage";
import EnterpriseContactForm from "@/components/EnterpriseContactForm";
import { INFLUENCER_MARKETING_STATS } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Kolabo Enterprise",
  description:
    "Custom Kolabo plans for teams managing creator programs across multiple brands or regions.",
};

export default function EnterprisePage() {
  return (
    <>
      <AudienceLandingPage
        eyebrow="For enterprise"
        title="Custom plans for creator programs at volume."
        subtitle="Running creator relationships across multiple brands, regions, or teams? Tell us how your team works and we'll set up a plan around it."
        ctaLabel="Get in touch"
        ctaHref="#contact"
        stats={INFLUENCER_MARKETING_STATS}
        heroImage={{
          src: "https://images.unsplash.com/photo-1758598497635-48cbbb1f6555",
          alt: "A team member in a modern corporate office setting",
        }}
        secondaryNote="We'll reply from a real person within a couple of business days."
        closingCtaLabel="Get in touch"
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
            text: "If the standard monthly plan doesn't fit how much your team searches and messages, ask us about volume pricing.",
          },
        ]}
      />
      <section id="contact" className="border-t border-slate-100 bg-white py-16">
        <div className="container-page max-w-2xl">
          <span className="badge mb-4">Get in touch</span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Tell us about your team.
          </h2>
          <p className="mt-3 text-slate-600">
            A couple of details and we&apos;ll reply from a real inbox — no automated ticket queue.
          </p>
          <div className="mt-8">
            <EnterpriseContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
