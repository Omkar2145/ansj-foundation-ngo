import { GraduationCap, Home, Stethoscope, LifeBuoy } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { Progress } from "@/components/ui/progress";

const impact = [
  { icon: GraduationCap, label: "Children Educated", value: 8400, goal: 10000, color: "primary" },
  { icon: Home, label: "Families Supported", value: 3200, goal: 5000, color: "secondary" },
  { icon: Stethoscope, label: "Medical Aid Delivered", value: 12500, goal: 15000, color: "accent" },
  { icon: LifeBuoy, label: "Disaster Relief Programs", value: 48, goal: 60, color: "primary" },
];

export function Impact() {
  return (
    <section className="py-20 lg:py-28 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Our Impact</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Real numbers. <span className="gradient-text">Real lives.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Every contribution is tracked, measured and reported — see the difference your generosity makes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {impact.map((i) => {
            const pct = Math.round((i.value / i.goal) * 100);
            return (
              <div
                key={i.label}
                className="bg-card border rounded-3xl p-6 shadow-[var(--shadow-soft)] card-hover"
              >
                <div
                  className={`size-14 rounded-2xl grid place-items-center mb-4 ${
                    i.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : i.color === "secondary"
                      ? "bg-secondary/10 text-secondary"
                      : "bg-accent/15 text-accent-foreground"
                  }`}
                >
                  <i.icon className="size-7" />
                </div>
                <div className="font-heading text-3xl font-bold">
                  <AnimatedCounter end={i.value} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground mt-1 mb-4">{i.label}</div>
                <Progress value={pct} className="h-2" />
                <div className="text-xs text-muted-foreground mt-2">{pct}% of {i.goal.toLocaleString("en-IN")} goal</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
