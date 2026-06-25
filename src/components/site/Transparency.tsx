import { ShieldCheck, FileText, Award, BadgeCheck } from "lucide-react";

const breakdown = [
  { label: "Programs", pct: 70, color: "var(--primary)" },
  { label: "Operations", pct: 15, color: "var(--secondary)" },
  { label: "Community Outreach", pct: 10, color: "var(--accent)" },
  { label: "Administration", pct: 5, color: "color-mix(in oklab, var(--foreground) 50%, transparent)" },
];

export function Transparency() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Transparency</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Where every <span className="gradient-text">rupee goes</span>
          </h2>
          <p className="text-muted-foreground text-lg">Audited annually. Published publicly. Always.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="bg-card border rounded-3xl p-8 shadow-[var(--shadow-soft)]">
            <h3 className="font-heading text-2xl font-bold mb-6">Fund Allocation 2025</h3>
            <div className="space-y-5">
              {breakdown.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>{b.label}</span>
                    <span className="font-heading font-bold">{b.pct}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${b.pct}%`, background: b.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, t: "80G & 12A Certified", d: "Tax-exempt donations under Indian law" },
              { icon: BadgeCheck, t: "FCRA Registered", d: "Authorized for foreign contributions" },
              { icon: Award, t: "GuideStar Gold", d: "Top transparency rating since 2019" },
              { icon: FileText, t: "Annual Reports", d: "Public financials downloadable below" },
            ].map((c) => (
              <div key={c.t} className="bg-card border rounded-2xl p-5 card-hover">
                <c.icon className="size-8 text-primary mb-3" />
                <h4 className="font-heading font-semibold mb-1">{c.t}</h4>
                <p className="text-sm text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
