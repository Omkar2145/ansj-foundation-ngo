import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, GraduationCap, Stethoscope, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

type DBBeneficiary = {
  id: string;
  slug: string;
  name: string;
  category: "child" | "elder";
  age: number | null;
  location: string | null;
  story: string | null;
  goal_amount: number;
  raised_amount: number;
  image_url: string | null;
  monthly_amount: number;
};

const filters = [
  { key: "all", label: "All", icon: Heart },
  { key: "child", label: "Children", icon: GraduationCap },
  { key: "elder", label: "Elders", icon: Stethoscope },
] as const;

export function FeaturedBeneficiaries({ all = false }: { all?: boolean }) {
  const [f, setF] = useState<(typeof filters)[number]["key"]>("all");
  const [items, setItems] = useState<DBBeneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("beneficiaries")
      .select("id, slug, name, category, age, location, story, goal_amount, raised_amount, image_url, monthly_amount")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(all ? 24 : 8)
      .then(({ data }) => {
        if (data) setItems(data as DBBeneficiary[]);
        setLoading(false);
      });
  }, [all]);

  const list = items.filter((b) => f === "all" || b.category === f);
  const shown = all ? list : list.slice(0, 4);

  return (
    <section id="featured" className="py-20 lg:py-28 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">Featured Beneficiaries</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Real lives, <span className="gradient-text">real impact</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Every beneficiary is KYC-verified by our field managers. Open a profile to read their story, see field updates, and sponsor with one click.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {filters.map((x) => (
            <button
              key={x.key}
              onClick={() => setF(x.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 ${
                f === x.key ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-soft)]" : "bg-card hover:bg-muted"
              }`}
            >
              <x.icon className="size-4" /> {x.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-3xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shown.map((b) => {
              const pct = Math.min(100, Math.round((Number(b.raised_amount) / Math.max(1, Number(b.goal_amount))) * 100));
              return (
                <article key={b.id} className="bg-card rounded-3xl overflow-hidden border shadow-[var(--shadow-soft)] card-hover flex flex-col">
                  <Link to="/beneficiaries/$slug" params={{ slug: b.slug }} className="relative aspect-[4/5] overflow-hidden block">
                    {b.image_url && (
                      <img src={b.image_url} alt={b.name} loading="lazy" className="w-full h-full object-cover" />
                    )}
                    <Badge className={`absolute top-3 left-3 border-0 ${b.category === "child" ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}`}>
                      {b.category === "child" ? "Child" : "Elder"}
                    </Badge>
                    <Badge className="absolute top-3 right-3 bg-background/90 text-foreground border-0">
                      <ShieldCheck className="size-3 mr-1" /> Verified
                    </Badge>
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                      <div className="font-heading font-bold text-lg leading-tight">{b.name}{b.age && `, ${b.age}`}</div>
                      {b.location && (
                        <div className="text-xs flex items-center gap-1 opacity-90"><MapPin className="size-3" /> {b.location}</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">{b.story}</p>
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold">₹{Number(b.raised_amount).toLocaleString("en-IN")}</span>
                        <span className="text-muted-foreground">of ₹{Number(b.goal_amount).toLocaleString("en-IN")}</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">{pct}% funded</div>
                    </div>
                    <Button asChild className="bg-accent text-accent-foreground hover:brightness-105 font-semibold">
                      <Link to="/beneficiaries/$slug" params={{ slug: b.slug }}>
                        <Heart className="size-4" fill="currentColor" /> Sponsor · ₹{Number(b.monthly_amount).toLocaleString("en-IN")}/mo
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!all && (
          <div className="text-center mt-10">
            <Button asChild size="lg" variant="outline" className="font-semibold">
              <Link to="/sponsor">View all beneficiaries</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
