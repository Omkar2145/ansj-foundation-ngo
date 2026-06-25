import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import edu from "@/assets/campaign-education.jpg";
import med from "@/assets/campaign-medical.jpg";
import food from "@/assets/campaign-food.jpg";
import disaster from "@/assets/campaign-disaster.jpg";
import women from "@/assets/campaign-women.jpg";
import rural from "@/assets/campaign-rural.jpg";

type Campaign = {
  title: string;
  desc: string;
  img: string;
  raised: number;
  goal: number;
  days: number;
  cat: string;
};

const all: Campaign[] = [
  { title: "Education for Every Child", desc: "Provide books, uniforms and tuition for 500 children in rural schools.", img: edu, raised: 820000, goal: 1500000, days: 24, cat: "Education" },
  { title: "Emergency Medical Support", desc: "Life-saving surgeries and treatment for underprivileged patients.", img: med, raised: 1240000, goal: 2000000, days: 12, cat: "Healthcare" },
  { title: "Food for Families", desc: "Nutritious meals for 1,000 families struggling with hunger every month.", img: food, raised: 540000, goal: 700000, days: 18, cat: "Relief" },
  { title: "Disaster Relief Fund", desc: "Rapid response for flood, cyclone and earthquake affected communities.", img: disaster, raised: 1750000, goal: 2500000, days: 40, cat: "Relief" },
  { title: "Women Empowerment Initiative", desc: "Skill training and micro-enterprise support for 300 rural women.", img: women, raised: 410000, goal: 800000, days: 30, cat: "Empowerment" },
  { title: "Rural Development Program", desc: "Clean water wells, sanitation and infrastructure in 25 villages.", img: rural, raised: 950000, goal: 1800000, days: 60, cat: "Development" },
];

const categories = ["All", "Education", "Healthcare", "Relief", "Empowerment", "Development"];
const sorts = [
  { v: "trending", l: "Trending" },
  { v: "ending", l: "Ending Soon" },
  { v: "newest", l: "Newest" },
];

export function Campaigns() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("trending");

  const filtered = useMemo(() => {
    let list = all.filter(
      (c) =>
        (cat === "All" || c.cat === cat) &&
        (c.title.toLowerCase().includes(q.toLowerCase()) ||
          c.desc.toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === "ending") list = [...list].sort((a, b) => a.days - b.days);
    if (sort === "trending") list = [...list].sort((a, b) => b.raised / b.goal - a.raised / a.goal);
    return list;
  }, [q, cat, sort]);

  return (
    <section id="campaigns" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Active Campaigns</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Support a <span className="gradient-text">cause that matters</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose a verified campaign and contribute to outcomes you care about.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 h-11 bg-card"
            />
          </div>
          <div className="flex flex-wrap gap-2 lg:items-center">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  cat === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 px-3 rounded-md border bg-card text-sm font-medium"
            aria-label="Sort campaigns"
          >
            {sorts.map((s) => (
              <option key={s.v} value={s.v}>Sort: {s.l}</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
            return (
              <article
                key={c.title}
                className="bg-card border rounded-3xl overflow-hidden shadow-[var(--shadow-soft)] card-hover flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={c.img} alt={c.title} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">{c.cat}</Badge>
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="font-heading text-xl font-bold mb-1">{c.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{c.desc}</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold">₹{(c.raised / 100000).toFixed(1)}L raised</span>
                      <span className="text-muted-foreground">of ₹{(c.goal / 100000).toFixed(0)}L</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{pct}% funded</span>
                      <span className="flex items-center gap-1"><Clock className="size-3" /> {c.days} days left</span>
                    </div>
                  </div>
                  <Button asChild className="mt-auto bg-primary hover:bg-primary/90 font-semibold">
                    <Link to="/donate"><Heart className="size-4" fill="currentColor" /> Donate</Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
