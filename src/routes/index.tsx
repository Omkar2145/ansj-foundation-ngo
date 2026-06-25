import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { Hero } from "@/components/site/Hero";
import { supabase } from "@/integrations/supabase/client";

const Impact = lazy(() => import("@/components/site/Impact").then((m) => ({ default: m.Impact })));
const FeaturedBeneficiaries = lazy(() =>
  import("@/components/site/FeaturedBeneficiaries").then((m) => ({ default: m.FeaturedBeneficiaries })),
);
const Stories = lazy(() => import("@/components/site/Stories").then((m) => ({ default: m.Stories })));
const Events = lazy(() => import("@/components/site/Events").then((m) => ({ default: m.Events })));
const CSRPartners = lazy(() => import("@/components/site/CSRPartners").then((m) => ({ default: m.CSRPartners })));
const SocialWall = lazy(() => import("@/components/site/SocialWall").then((m) => ({ default: m.SocialWall })));

const SectionFallback = () => <div className="h-48" aria-hidden />;

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "ANSJ Foundation — Transforming Lives Through Education, Healthcare & Compassion" },
      { name: "description", content: "Sponsor a child or elder, track every rupee in real time, and witness verified impact. ANSJ Welfare & Education Foundation — 80G & FCRA registered." },
      { property: "og:title", content: "ANSJ Foundation — Transforming Lives" },
      { property: "og:description", content: "Sponsor a child or elder, track every rupee in real time, and witness verified impact." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [gateChecked, setGateChecked] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("ansj_welcome_seen");
    if (seen) {
      setGateChecked(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      sessionStorage.setItem("ansj_welcome_seen", "1");
      if (!data.session) {
        navigate({ to: "/auth", search: { from: "welcome" } as never });
      } else {
        setGateChecked(true);
      }
    });
  }, [navigate]);

  if (!gateChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main>
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <Impact />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FeaturedBeneficiaries />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Stories />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Events />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CSRPartners />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <SocialWall />
      </Suspense>
    </main>
  );
}
