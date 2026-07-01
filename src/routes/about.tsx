import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/About";
import { PageHeader } from "@/components/site/PageHeader";
import { FileText, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import coi from "@/assets/certs/COI.pdf.asset.json";
import eAnudaan from "@/assets/certs/e-anudaan.pdf.asset.json";
import msme from "@/assets/certs/MSME.pdf.asset.json";
import ngoDarpan from "@/assets/certs/NGO_DARPAN.pdf.asset.json";
import pancard from "@/assets/certs/Pancard.pdf.asset.json";
import section8 from "@/assets/certs/SECTION_8.pdf.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ANSJ Welfare & Education Foundation" },
      { name: "description", content: "Our mission, vision, leadership, board, certifications and annual reports. Building India's most transparent NGO platform." },
      { property: "og:title", content: "About ANSJ Foundation" },
      { property: "og:description", content: "Mission, vision, leadership and certifications." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const leadership = [
  { name: "Founder & Chairperson", role: "Founder", bio: "Two decades in social impact and education reform." },
  { name: "Chief Executive", role: "CEO", bio: "Former corporate strategist now driving program scale." },
  { name: "Head of Programs", role: "Programs Lead", bio: "Field veteran with 15+ years across 8 states." },
  { name: "Head of Tech & Transparency", role: "CTO", bio: "Building the AI-powered donor platform." },
];
const certs = [
  { t: "Certificate of Incorporation", d: "Official incorporation certificate.", url: coi.url },
  { t: "Section 8 Certificate", d: "Section 8 company registration.", url: section8.url },
  { t: "NGO Darpan Registration", d: "Government of India NGO Darpan portal.", url: ngoDarpan.url },
  { t: "e-Anudaan Registration", d: "Ministry of Social Justice grant portal.", url: eAnudaan.url },
  { t: "MSME Registration", d: "Udyam / MSME registration certificate.", url: msme.url },
  { t: "PAN Card", d: "Permanent Account Number of the foundation.", url: pancard.url },
];

function useAuthed() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s?.user));
    return () => sub.subscription.unsubscribe();
  }, []);
  return authed;
}

function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About Us"
        title="Compassion. Transparency. Real impact."
        subtitle="ANSJ Welfare & Education Foundation exists to ensure that no child is denied an education and no elder is left without care."
      />
      <About />

      <section className="py-20 lg:py-24 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 mb-16">
            {[
              { t: "Our Mission", d: "Provide education, healthcare and dignified support to underprivileged children and elders across India — with complete transparency." },
              { t: "Our Vision", d: "An India where every child has access to quality education and every elder lives with dignity, healthcare and respect." },
              { t: "Our Values", d: "Transparency. Compassion. Accountability. Innovation. Donor-beneficiary trust above all else." },
            ].map((x) => (
              <div key={x.t} className="bg-card border rounded-3xl p-8 shadow-[var(--shadow-soft)]">
                <h3 className="font-heading font-bold text-2xl mb-3 text-primary">{x.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-2">Leadership team</h2>
            <p className="text-muted-foreground mb-8">The people building India's most transparent NGO.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {leadership.map((p) => (
                <div key={p.name} className="bg-card rounded-2xl p-6 border card-hover">
                  <div className="size-16 rounded-full gradient-hero mb-4" />
                  <div className="font-heading font-bold">{p.name}</div>
                  <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">{p.role}</div>
                  <p className="text-sm text-muted-foreground">{p.bio}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-2">Certifications & compliance</h2>
            <p className="text-muted-foreground mb-8">Every registration, every audit — publicly verifiable.</p>
            <CertificationsList />
          </div>
        </div>
      </section>
    </main>
  );
}

function CertificationsList() {
  const authed = useAuthed();
  if (authed === null) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (!authed) {
    return (
      <div className="bg-card border rounded-3xl p-8 text-center flex flex-col items-center gap-4">
        <div className="size-14 rounded-2xl bg-primary/10 text-primary grid place-items-center">
          <Lock className="size-7" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-xl mb-1">Sign in to view certificates</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Our official registration documents are available to registered users only.
          </p>
        </div>
        <Button asChild>
          <Link to="/auth">Sign in to view</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {certs.map((c) => (
        <a
          key={c.t}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-card rounded-2xl p-6 border flex flex-col gap-3 card-hover"
        >
          <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center">
            <FileText className="size-6" />
          </div>
          <div className="font-heading font-bold">{c.t}</div>
          <p className="text-sm text-muted-foreground">{c.d}</p>
          <span className="text-xs font-semibold text-primary mt-auto">View PDF →</span>
        </a>
      ))}
    </div>
  );
}
