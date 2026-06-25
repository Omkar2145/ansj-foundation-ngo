import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Logo } from "./Logo";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="bg-foreground text-background pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="[&_a]:text-background [&_*]:text-background">
              <Logo />
            </div>
            <p className="text-sm text-background/70 mt-4 max-w-sm">
              ANSJ Welfare & Education Foundation transforms lives through education, healthcare and compassion — with full transparency on every rupee contributed.
            </p>
            <div className="space-y-2 mt-5 text-sm text-background/75">
              <p className="flex items-center gap-2"><MapPin className="size-4 text-accent" /> Registered office address — India</p>
              <p className="flex items-center gap-2"><Phone className="size-4 text-accent" /> +91 00000 00000</p>
              <p className="flex items-center gap-2"><Mail className="size-4 text-accent" /> contact@ansjfoundation.org</p>
            </div>
            <div className="flex gap-2 mt-5">
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social link" className="size-9 rounded-full border border-background/20 grid place-items-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-background">Explore</h4>
            <ul className="space-y-2 text-sm text-background/70">
              {[
                { to: "/about", l: "About Us" },
                { to: "/sponsor", l: "Sponsor a Child" },
                { to: "/sponsor", l: "Support an Elder" },
                { to: "/campaigns", l: "Campaigns" },
                { to: "/media", l: "Media Center" },
              ].map((x) => (
                <li key={x.l}><Link to={x.to} className="hover:text-accent transition-colors">{x.l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-background">Get Involved</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/donate" className="hover:text-accent">Donate</Link></li>
              <li><Link to="/volunteer" className="hover:text-accent">Volunteer</Link></li>
              <li><Link to="/transparency" className="hover:text-accent">Transparency</Link></li>
              <li><Link to="/tax-benefits" className="hover:text-accent">Tax Benefits (80G)</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-background">Stay updated</h4>
            <p className="text-sm text-background/70 mb-3">Monthly impact reports & beneficiary stories.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed! Welcome to the ANSJ family."); setEmail(""); }}
              className="flex gap-2"
            >
              <Input type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background/10 border-background/20 text-background placeholder:text-background/50 h-10" />
              <Button type="submit" className="bg-accent text-accent-foreground hover:brightness-105 h-10">Join</Button>
            </form>
          </div>
        </div>

        <div className="pt-6 border-t border-background/15 flex flex-col sm:flex-row justify-between gap-3 text-xs text-background/60">
          <p>© {new Date().getFullYear()} ANSJ Welfare & Education Foundation. All rights reserved · 80G & 12A Certified · FCRA Registered.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent">Privacy Policy</a>
            <a href="#" className="hover:text-accent">Terms</a>
            <a href="#" className="hover:text-accent">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
