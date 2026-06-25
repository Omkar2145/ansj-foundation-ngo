import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HandHeart, Users, Award, Globe } from "lucide-react";
import { toast } from "sonner";

const benefits = [
  { icon: HandHeart, t: "Make Real Impact", d: "Direct, measurable change in lives every week." },
  { icon: Users, t: "Find Community", d: "Join 250+ passionate volunteers across India." },
  { icon: Award, t: "Get Certified", d: "Recognition certificates and recommendation letters." },
  { icon: Globe, t: "Build Skills", d: "Leadership, communication and project management." },
];

export function Volunteer() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: "Education", message: "" });
  return (
    <section id="volunteer" className="py-20 lg:py-28 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Volunteer</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Lend your time. <span className="gradient-text">Change a life.</span>
          </h2>
          <p className="text-muted-foreground text-lg">Whether you have an hour or every weekend — there's a meaningful role waiting for you.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((b) => (
              <div key={b.t} className="bg-card border rounded-2xl p-5 card-hover">
                <b.icon className="size-8 text-secondary mb-3" />
                <h4 className="font-heading font-semibold mb-1">{b.t}</h4>
                <p className="text-sm text-muted-foreground">{b.d}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Application received! We'll be in touch within 48 hours.");
              setForm({ name: "", email: "", phone: "", interest: "Education", message: "" });
            }}
            className="bg-card border rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-soft)] space-y-4"
          >
            <h3 className="font-heading text-2xl font-bold">Apply to volunteer</h3>
            <Input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11" />
              <Input required type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11" />
            </div>
            <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} className="w-full h-11 px-3 rounded-md border bg-card text-sm" aria-label="Area of interest">
              {["Education", "Healthcare", "Disaster Relief", "Fundraising", "Community Outreach"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <Textarea rows={4} placeholder="Why do you want to volunteer? (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <Button type="submit" className="w-full h-11 font-semibold">Submit Application</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
