import { createFileRoute } from "@tanstack/react-router";
import { Campaigns } from "@/components/site/Campaigns";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "Fundraising Campaigns — ANSJ Foundation" },
      { name: "description", content: "Support active fundraising campaigns: scholarships, medical emergencies, elderly care, disaster relief and more." },
      { property: "og:title", content: "Campaigns — ANSJ Foundation" },
      { property: "og:description", content: "Active fundraising campaigns by ANSJ Foundation." },
      { property: "og:url", content: "/campaigns" },
    ],
    links: [{ rel: "canonical", href: "/campaigns" }],
  }),
  component: CampaignsPage,
});

function CampaignsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Campaigns"
        title="Rally behind a cause"
        subtitle="Time-bound fundraising drives for scholarships, surgeries, emergencies and community programs."
      />
      <Campaigns />
    </main>
  );
}
