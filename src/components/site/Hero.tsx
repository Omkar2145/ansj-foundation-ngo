import { Button } from "@/components/ui/button";
import { Heart, HandHeart, ArrowRight, GraduationCap, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { AnimatedCounter } from "./AnimatedCounter";

const stats = [
  { label: "Children Supported", value: 4200, suffix: "+" },
  { label: "Elders Supported", value: 1850, suffix: "+" },
  { label: "Funds Raised", value: 8.4, prefix: "₹", suffix: " Cr+" },
  { label: "Cities Covered", value: 42, suffix: "+" },
];

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={hero}
          alt="Children and elders supported by ANSJ Foundation"
          className="w-full h-full object-cover scale-105"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/65 to-secondary/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl text-primary-foreground animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium mb-6">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            100% transparent · 80G certified · FCRA registered
          </span>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-7xl leading-[1.05] mb-6">
            Transforming Lives Through{" "}
            <span className="text-accent">Education, Healthcare & Compassion</span>
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mb-8">
            Sponsor a child's education or an elder's healthcare. Track every rupee, watch real progress, and build a relationship that changes a life.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              asChild
              className="bg-accent text-accent-foreground hover:brightness-105 shadow-[var(--shadow-glow)] font-semibold h-12 px-7"
            >
              <Link to="/donate">
                <Heart className="size-5" fill="currentColor" /> Donate Now
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="h-12 px-7 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold"
            >
              <Link to="/sponsor">
                <GraduationCap className="size-5" /> Sponsor a Child
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="h-12 px-7 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold"
            >
              <Link to="/sponsor">
                <Users className="size-5" /> Support an Elder
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="h-12 px-7 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold"
            >
              <Link to="/volunteer">
                <HandHeart className="size-5" /> Become a Volunteer
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="glass rounded-2xl p-5 lg:p-6 text-primary-foreground animate-fade-up"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="text-3xl lg:text-4xl font-heading font-bold text-accent">
                <AnimatedCounter end={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="text-sm mt-1 text-primary-foreground/85">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#featured"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-foreground/70 hover:text-accent transition-colors text-sm flex flex-col items-center gap-1"
      >
        Meet our beneficiaries <ArrowRight className="size-4 rotate-90 animate-bounce" />
      </a>
    </section>
  );
}
