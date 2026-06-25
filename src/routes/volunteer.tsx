import { createFileRoute, Link } from "@tanstack/react-router";
import { Volunteer } from "@/components/site/Volunteer";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer with ANSJ Foundation" },
      { name: "description", content: "Volunteer your time and skills. Track hours, earn certificates, join leaderboards and field events." },
      { property: "og:title", content: "Volunteer — ANSJ Foundation" },
      { property: "og:description", content: "Volunteer time and skills with ANSJ." },
      { property: "og:url", content: "/volunteer" },
    ],
    links: [{ rel: "canonical", href: "/volunteer" }],
  }),
  component: VolunteerPage,
});

function VolunteerPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Volunteer"
        title="Join the movement on the ground"
        subtitle="Teach, mentor, run events, do field visits, contribute professional skills. Earn verified hours and certificates."
      />
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Button asChild size="lg">
          <Link to="/register/volunteer">Apply to volunteer <ArrowRight className="size-4 ml-1" /></Link>
        </Button>
      </section>
      <Volunteer />
    </main>
  );
}
