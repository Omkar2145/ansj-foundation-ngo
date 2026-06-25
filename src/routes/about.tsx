import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/About";
import { PageHeader } from "@/components/site/PageHeader";
import { Award, FileText, ShieldCheck, Users } from "lucide-react";

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
  { icon: ShieldCheck, t: "80G Tax Exemption", d: "Donations are tax-deductible under Section 80G." },
  { icon: FileText, t: "12A Registration", d: "Income-tax registered under Section 12A." },
  { icon: Award, t: "FCRA Registered", d: "Authorized to receive international donations." },
  { icon: Users, t: "Niti Aayog Darpan", d: "Registered on the Government of India NGO portal." },
];

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
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {certs.map((c) => (
                <div key={c.t} className="bg-card rounded-2xl p-6 border flex flex-col gap-3">
                  <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center">
                    <c.icon className="size-6" />
                  </div>
                  <div className="font-heading font-bold">{c.t}</div>
                  <p className="text-sm text-muted-foreground">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
