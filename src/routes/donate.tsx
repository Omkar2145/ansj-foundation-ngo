import { createFileRoute } from "@tanstack/react-router";
import { Donate } from "@/components/site/Donate";
import { PageHeader } from "@/components/site/PageHeader";
import { GraduationCap, Stethoscope, HandCoins, BookOpen, Pill, Heart } from "lucide-react";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — ANSJ Foundation" },
      { name: "description", content: "Donate to support education or healthcare. Choose one-time, monthly or annual giving. 80G tax exemption. 100% transparent fund tracking." },
      { property: "og:title", content: "Donate to ANSJ Foundation" },
      { property: "og:description", content: "Your gift creates lasting change. 80G tax-deductible." },
      { property: "og:url", content: "/donate" },
    ],
    links: [{ rel: "canonical", href: "/donate" }],
  }),
  component: DonatePage,
});

const categories = [
  { icon: GraduationCap, t: "Education Support", d: "School fees, college fees, books, uniforms, digital learning kits.", color: "bg-primary/10 text-primary" },
  { icon: Stethoscope, t: "Healthcare Support", d: "Elderly care, medicines, surgeries and emergency medical care.", color: "bg-secondary/10 text-secondary" },
  { icon: HandCoins, t: "General Fund", d: "Support foundation operations, infrastructure and field staff.", color: "bg-accent/15 text-accent" },
];
const breakdown = [
  { icon: BookOpen, t: "₹500", d: "School supplies for 1 child for a month" },
  { icon: Pill, t: "₹1,500", d: "Monthly medicines for an elder" },
  { icon: GraduationCap, t: "₹2,500", d: "Full school fees for 1 child / month" },
  { icon: Heart, t: "₹5,000", d: "Sponsors one elder's healthcare / month" },
];

function DonatePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Donate"
        title="Every rupee creates measurable change"
        subtitle="Choose where your contribution goes. Get instant 80G receipts. Track utilization in real time."
      />

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">Donation categories</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {categories.map((c) => (
              <div key={c.t} className="bg-card border rounded-3xl p-7 card-hover">
                <div className={`size-14 rounded-2xl grid place-items-center mb-4 ${c.color}`}>
                  <c.icon className="size-7" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">{c.t}</h3>
                <p className="text-muted-foreground text-sm">{c.d}</p>
              </div>
            ))}
          </div>

          <h2 className="font-heading text-3xl font-bold mb-8 text-center">Where your money goes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {breakdown.map((b) => (
              <div key={b.t} className="rounded-2xl bg-muted/50 p-5 text-center">
                <b.icon className="size-7 text-accent mx-auto mb-2" />
                <div className="font-heading font-bold text-2xl text-primary">{b.t}</div>
                <p className="text-xs text-muted-foreground mt-1">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Donate />
    </main>
  );
}
