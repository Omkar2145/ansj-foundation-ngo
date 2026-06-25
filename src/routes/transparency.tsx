import { createFileRoute } from "@tanstack/react-router";
import { Transparency } from "@/components/site/Transparency";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/transparency")({
  head: () => ({
    meta: [
      { title: "Transparency & Fund Tracker — ANSJ Foundation" },
      { name: "description", content: "Real-time fund tracking: donations received, allocated, utilized. Monthly reports, annual audits, program-vs-operations breakdown." },
      { property: "og:title", content: "Transparency — ANSJ Foundation" },
      { property: "og:description", content: "Real-time fund tracking and monthly reports." },
      { property: "og:url", content: "/transparency" },
    ],
    links: [{ rel: "canonical", href: "/transparency" }],
  }),
  component: TransparencyPage,
});

function TransparencyPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Transparency"
        title="Every rupee, tracked in real time"
        subtitle="See exactly how donations are received, allocated and utilized. Independent audits published annually."
      />
      <Transparency />
    </main>
  );
}
