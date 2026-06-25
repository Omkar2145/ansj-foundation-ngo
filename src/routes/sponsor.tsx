import { createFileRoute } from "@tanstack/react-router";
import { FeaturedBeneficiaries } from "@/components/site/FeaturedBeneficiaries";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/sponsor")({
  head: () => ({
    meta: [
      { title: "Sponsor a Child or Elder — ANSJ Foundation" },
      { name: "description", content: "Browse verified children and elderly beneficiaries. Sponsor education, healthcare, or daily care and track monthly progress reports." },
      { property: "og:title", content: "Sponsor a Beneficiary — ANSJ Foundation" },
      { property: "og:description", content: "Browse verified beneficiaries. Track monthly progress." },
      { property: "og:url", content: "/sponsor" },
    ],
    links: [{ rel: "canonical", href: "/sponsor" }],
  }),
  component: SponsorPage,
});

function SponsorPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Sponsor a Beneficiary"
        title="Choose a child or elder. Change a life."
        subtitle="Every beneficiary is field-verified. Sponsor monthly, receive progress reports with photos, videos and academic / medical updates."
      />
      <FeaturedBeneficiaries all />
    </main>
  );
}
