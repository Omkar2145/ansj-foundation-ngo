import { Target, Eye, Sparkles, Award } from "lucide-react";

const values = [
  { icon: Sparkles, title: "Compassion", desc: "Every action driven by empathy for those in need." },
  { icon: Award, title: "Integrity", desc: "100% transparent operations and fund utilization." },
  { icon: Target, title: "Impact", desc: "Measurable outcomes in every community we serve." },
  { icon: Eye, title: "Inclusion", desc: "Embracing diversity across every program we run." },
];

const timeline = [
  { y: "2014", t: "Hearts United founded with 5 volunteers in Mumbai" },
  { y: "2017", t: "Crossed 1,000 children supported across 3 states" },
  { y: "2020", t: "Pandemic relief: 50,000+ meals & medical kits delivered" },
  { y: "2023", t: "Awarded 'Best NGO Initiative' by India CSR Forum" },
  { y: "2026", t: "Operating across 18 states with 250+ active volunteers" },
];

export function About() {
  return (
    <section id="about" className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">About Us</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-2 mb-4">
            A decade of <span className="gradient-text">unwavering compassion</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Hearts United began as a small group of friends and grew into a movement of thousands —
            united by a single belief: kindness, when organized, changes the world.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-16">
          <div className="bg-card rounded-3xl p-8 lg:p-10 shadow-[var(--shadow-soft)] card-hover border">
            <div className="size-14 rounded-2xl bg-primary/10 grid place-items-center mb-5">
              <Target className="size-7 text-primary" />
            </div>
            <h3 className="font-heading text-2xl font-bold mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To unite compassionate individuals and organizations to create meaningful change in
              communities that need it most — through education, healthcare, emergency relief, and
              sustainable development.
            </p>
          </div>
          <div className="bg-card rounded-3xl p-8 lg:p-10 shadow-[var(--shadow-soft)] card-hover border">
            <div className="size-14 rounded-2xl bg-secondary/10 grid place-items-center mb-5">
              <Eye className="size-7 text-secondary" />
            </div>
            <h3 className="font-heading text-2xl font-bold mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              A world where every individual — regardless of birth, geography, or circumstance —
              has access to basic necessities, education, healthcare, and opportunities for growth.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {values.map((v) => (
            <div key={v.title} className="bg-card border rounded-2xl p-6 card-hover">
              <v.icon className="size-8 text-accent mb-3" />
              <h4 className="font-heading font-semibold text-lg mb-1">{v.title}</h4>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-heading text-2xl lg:text-3xl font-bold text-center mb-10">Our Journey</h3>
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div
                  key={item.y}
                  className={`relative flex items-center gap-4 sm:gap-8 ${
                    i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 size-4 rounded-full bg-accent ring-4 ring-background" />
                  <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-8">
                    <div
                      className={`bg-card border rounded-2xl p-5 shadow-[var(--shadow-soft)] card-hover ${
                        i % 2 === 0 ? "sm:text-right" : "sm:text-left"
                      }`}
                    >
                      <div className="font-heading text-2xl font-bold gradient-text">{item.y}</div>
                      <p className="text-sm text-muted-foreground mt-1">{item.t}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
