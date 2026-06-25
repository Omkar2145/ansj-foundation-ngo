import { useEffect, useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const events = [
  { title: "Charity Run 2026", date: "2026-08-15", loc: "Marine Drive, Mumbai", spots: 220, desc: "5K & 10K runs to raise funds for child education. T-shirts & medals for all participants." },
  { title: "Community Food Drive", date: "2026-07-04", loc: "Dharavi, Mumbai", spots: 80, desc: "Volunteer-led food distribution serving 500+ families across 5 neighborhoods." },
  { title: "Blood Donation Camp", date: "2026-06-22", loc: "Hearts United HQ, Bandra", spots: 150, desc: "In partnership with Red Cross. Refreshments and certificates provided." },
  { title: "Education Awareness Workshop", date: "2026-09-10", loc: "Online · Zoom", spots: 500, desc: "Free workshop for parents on child education rights and government schemes." },
];

function useCountdown(target: string) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const compute = () => setDiff(+new Date(target) - Date.now());
    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, [target]);
  const d = Math.max(0, Math.floor(diff / 86400000));
  const h = Math.max(0, Math.floor((diff / 3600000) % 24));
  const m = Math.max(0, Math.floor((diff / 60000) % 60));
  const s = Math.max(0, Math.floor((diff / 1000) % 60));
  return { d, h, m, s };
}


function EventCard({ ev }: { ev: typeof events[number] }) {
  const c = useCountdown(ev.date);
  return (
    <article className="bg-card border rounded-3xl p-6 lg:p-7 shadow-[var(--shadow-soft)] card-hover">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-heading text-xl font-bold">{ev.title}</h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-accent/20 text-accent-foreground font-semibold whitespace-nowrap">
          {ev.spots} spots
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{ev.desc}</p>
      <div className="flex flex-col gap-2 text-sm mb-4">
        <span className="flex items-center gap-2"><Calendar className="size-4 text-primary" /> {new Date(ev.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
        <span className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> {ev.loc}</span>
        <span className="flex items-center gap-2"><Users className="size-4 text-primary" /> Open to all</span>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[{ l: "Days", v: c.d }, { l: "Hours", v: c.h }, { l: "Min", v: c.m }, { l: "Sec", v: c.s }].map((t) => (
          <div key={t.l} className="bg-muted rounded-xl p-2 text-center">
            <div className="font-heading font-bold text-xl">{String(t.v).padStart(2, "0")}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.l}</div>
          </div>
        ))}
      </div>
      <Button onClick={() => toast.success(`Registered for ${ev.title}!`)} className="w-full font-semibold">
        Register Now
      </Button>
    </article>
  );
}

export function Events() {
  return (
    <section id="events" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Upcoming Events</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Join us <span className="gradient-text">in person</span>
          </h2>
          <p className="text-muted-foreground text-lg">Workshops, drives and community events you can attend or volunteer at.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((e) => <EventCard key={e.title} ev={e} />)}
        </div>
      </div>
    </section>
  );
}
