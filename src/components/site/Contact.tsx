import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Contact</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Get in <span className="gradient-text">touch</span>
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { icon: MapPin, t: "Visit Us", d: "12 Linking Road, Bandra West, Mumbai 400050, India" },
              { icon: Mail, t: "Email Us", d: "hello@heartsunited.org" },
              { icon: Phone, t: "Call Us", d: "+91 22 4000 1234" },
            ].map((c) => (
              <div key={c.t} className="bg-card border rounded-2xl p-5 flex items-start gap-4 card-hover">
                <div className="size-12 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                  <c.icon className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-heading font-semibold">{c.t}</div>
                  <div className="text-sm text-muted-foreground">{c.d}</div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl overflow-hidden border h-64">
              <iframe
                title="Hearts United office location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=72.82%2C19.05%2C72.86%2C19.07&layer=mapnik"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message sent! We'll reply within 24 hours.");
              setForm({ name: "", email: "", subject: "", message: "" });
            }}
            className="bg-card border rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-soft)] space-y-4"
          >
            <h3 className="font-heading text-2xl font-bold">Send us a message</h3>
            <Input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11" />
            <Input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11" />
            <Input required placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="h-11" />
            <Textarea required rows={5} placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <Button type="submit" className="w-full h-11 font-semibold">
              <Send className="size-4" /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
